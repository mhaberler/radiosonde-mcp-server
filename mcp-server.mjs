import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { z } from 'zod';

const __dir = dirname(fileURLToPath(import.meta.url));
const STATIONS_PATH = join(__dir, 'untracked', 'stations.json');
const BASE_NODE = 'https://node.windy.com/pois/v2/radiosonde';
const BASE_DL = 'https://dl.windy.com/obs/measurement/v2/radiosonde';

// Load station index at startup (mutable — live probes can add entries)
const stationsRaw = JSON.parse(readFileSync(STATIONS_PATH, 'utf8'));

const TILE_SIZE = 256;

function latLonToTile(lat, lon, z) {
  const n = Math.pow(2, z);
  const x = Math.floor((lon + 180) / 360 * n);
  const latR = lat * Math.PI / 180;
  const y = Math.floor((1 - Math.log(Math.tan(latR) + 1 / Math.cos(latR)) / Math.PI) / 2 * n);
  return [x, y];
}

function tilePixelToLatLon(zoom, tileCol, tileRow, pixX, pixY) {
  const n = Math.pow(2, zoom);
  const lon = ((tileCol + pixX / TILE_SIZE) / n) * 360 - 180;
  const latR = Math.atan(Math.sinh(Math.PI * (1 - 2 * (tileRow + pixY / TILE_SIZE) / n)));
  return { lat: +(latR * 180 / Math.PI).toFixed(6), lon: +lon.toFixed(6) };
}

// Probe live tile at z6 for a lat/lon, merging any new stations into stationsRaw
async function probeLiveTile(lat, lon) {
  const [tx, ty] = latLonToTile(lat, lon, 6);
  try {
    const r = await fetch(`${BASE_NODE}/tiles/6/${tx}/${ty}?pr=0&sc=0&token2=pending`);
    if (!r.ok) return;
    const data = await r.json();
    const ids = data.id || [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id && !stationsRaw[id]) {
        stationsRaw[id] = tilePixelToLatLon(6, tx, ty, data.tileX?.[i] ?? 0, data.tileY?.[i] ?? 0);
      }
    }
  } catch {}
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function windyFetch(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} from ${url}`);
  return r.json();
}

async function getDetail(id) {
  return windyFetch(`${BASE_NODE}/${id}?pr=0&sc=0&token2=pending`);
}

// ── server ────────────────────────────────────────────────────────────────────

const server = new McpServer({ name: 'radiosonde', version: '1.0.0' });

server.tool(
  'find_stations',
  'Find radiosonde stations near a location. Returns stations sorted by distance.',
  {
    lat: z.number().describe('Latitude of search center'),
    lon: z.number().describe('Longitude of search center'),
    radius_km: z.number().default(500).describe('Search radius in km'),
    limit: z.number().int().default(10).describe('Max stations to return'),
  },
  async ({ lat, lon, radius_km, limit }) => {
    // Always probe live tile at the search center to catch recently-active stations
    await probeLiveTile(lat, lon);

    const results = Object.entries(stationsRaw)
      .map(([id, s]) => ({ id, lat: s.lat, lon: s.lon, dist: haversineKm(lat, lon, s.lat, s.lon) }))
      .filter(s => s.dist <= radius_km)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, limit);

    if (results.length === 0) {
      return { content: [{ type: 'text', text: `No stations within ${radius_km} km of (${lat}, ${lon})` }] };
    }

    // Fetch names in parallel (detail API)
    const withNames = await Promise.all(results.map(async s => {
      try {
        const d = await getDetail(s.id);
        return { ...s, name: d.name, elevation: d.elevation };
      } catch {
        return { ...s, name: s.id, elevation: null };
      }
    }));

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(withNames.map(s => ({
          id: s.id,
          name: s.name,
          lat: s.lat,
          lon: s.lon,
          elevation_m: s.elevation,
          distance_km: +s.dist.toFixed(1),
        })), null, 2),
      }],
    };
  },
);

server.tool(
  'get_station_detail',
  'Get radiosonde station metadata and list of recent ascents (last 2).',
  {
    station_id: z.string().describe('Station ID from find_stations'),
  },
  async ({ station_id }) => {
    const d = await getDetail(station_id);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          id: d.id,
          name: d.name,
          lat: d.lat,
          lon: d.lon,
          elevation_m: d.elevation,
          lastAscents: (d.lastAscents || []).map(a => ({
            format: a.format,
            time_ms: a.time,
            time_utc: new Date(a.time).toISOString(),
          })),
        }, null, 2),
      }],
    };
  },
);

server.tool(
  'get_sounding',
  'Download a radiosonde sounding (vertical atmospheric profile). Returns GeoJSON FeatureCollection with ~150-200 levels. Each feature has properties: gpheight (m), temp (K), dewpoint (K), pressure (hPa), wind_u (m/s), wind_v (m/s).',
  {
    station_id: z.string().describe('Station ID'),
    time_ms: z.number().optional().describe('Ascent timestamp in ms UTC. Omit for latest.'),
    format: z.enum(['fm94', 'fm35']).default('fm94').describe('fm94=high-res, fm35=standard TEMP'),
  },
  async ({ station_id, time_ms, format }) => {
    let t = time_ms;
    if (!t) {
      const d = await getDetail(station_id);
      const latest = (d.lastAscents || []).find(a => a.format === format) ?? d.lastAscents?.[0];
      if (!latest) throw new Error(`No ascents available for ${station_id}`);
      t = latest.time;
      format = latest.format;
    }

    const url = `${BASE_DL}/${station_id}/download?time=${t}&format=${format}`;
    const sounding = await windyFetch(url);

    const meta = {
      station_id,
      time_ms: t,
      time_utc: new Date(t).toISOString(),
      format,
      level_count: sounding.features?.length ?? 0,
      station_name: sounding.properties?.station_name,
      elevation_m: sounding.properties?.elevation,
      lat: sounding.properties?.lat,
      lon: sounding.properties?.lon,
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ meta, sounding }, null, 2),
      }],
    };
  },
);

// ── start ─────────────────────────────────────────────────────────────────────

await server.connect(new StdioServerTransport());
