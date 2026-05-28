import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { mkdirSync, readFileSync, statSync } from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { z } from 'zod';
import {
  CACHE_DIR, CACHE_PATH, BASE_NODE, BASE_DL,
  haversineKm, latLonToTile, tilePixelToLatLon, windyFetch, getDetail,
} from '../lib/utils.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const SCRAPE_SCRIPT = join(__dir, 'scrape.mjs');
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

mkdirSync(CACHE_DIR, { recursive: true });

// Load station index (mutable — live probes add entries at query time)
let stationsRaw = {};
try {
  stationsRaw = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
} catch {
  console.error('[radiosonde] No station cache found — running initial scrape...');
}

// Background rescrape if cache is missing or stale
function triggerRescrapeIfNeeded() {
  let stale = Object.keys(stationsRaw).length === 0;
  if (!stale) {
    try {
      const age = Date.now() - statSync(CACHE_PATH).mtimeMs;
      if (age > CACHE_MAX_AGE_MS) stale = true;
    } catch { stale = true; }
  }
  if (!stale) return;
  console.error('[radiosonde] Station cache stale or missing — refreshing in background...');
  const child = spawn(process.execPath, [SCRAPE_SCRIPT], { stdio: ['ignore', 'ignore', 'inherit'] });
  child.on('exit', (code) => {
    if (code === 0) {
      try {
        stationsRaw = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
        console.error(`[radiosonde] Cache refreshed: ${Object.keys(stationsRaw).length} stations`);
      } catch {}
    }
  });
}

triggerRescrapeIfNeeded();

// Probe live z6 tile, merging newly-active stations into stationsRaw
async function probeLiveTile(lat, lon) {
  const [tx, ty] = latLonToTile(lat, lon, 6);
  try {
    const r = await fetch(`${BASE_NODE}/tiles/6/${tx}/${ty}?pr=0&sc=0&token2=pending`);
    if (!r.ok) return;
    const data = await r.json();
    const ids = data.id || [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id && !stationsRaw[id])
        stationsRaw[id] = tilePixelToLatLon(6, tx, ty, data.tileX?.[i] ?? 0, data.tileY?.[i] ?? 0);
    }
  } catch {}
}

// ── MCP server ────────────────────────────────────────────────────────────────

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
    await probeLiveTile(lat, lon);

    const results = Object.entries(stationsRaw)
      .map(([id, s]) => ({ id, lat: s.lat, lon: s.lon, dist: haversineKm(lat, lon, s.lat, s.lon) }))
      .filter(s => s.dist <= radius_km)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, limit);

    if (results.length === 0)
      return { content: [{ type: 'text', text: `No stations within ${radius_km} km of (${lat}, ${lon})` }] };

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

    const sounding = await windyFetch(`${BASE_DL}/${station_id}/download?time=${t}&format=${format}`);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          meta: {
            station_id,
            time_ms: t,
            time_utc: new Date(t).toISOString(),
            format,
            level_count: sounding.features?.length ?? 0,
            station_name: sounding.properties?.station_name,
            elevation_m: sounding.properties?.elevation,
            lat: sounding.properties?.lat,
            lon: sounding.properties?.lon,
          },
          sounding,
        }, null, 2),
      }],
    };
  },
);

await server.connect(new StdioServerTransport());
