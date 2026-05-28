import { readFile } from 'fs/promises';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const CACHE_PATH = join(homedir(), '.cache', 'windy-radiosonde', 'stations.json');
const SNAPSHOT_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'stations-example.json');

const BASE_OBS = 'https://node.windy.com/obs/measurement/v2/radiosonde';
const BASE_DL = 'https://dl.windy.com/obs/measurement/v2/radiosonde';

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

let _stations = null;

async function loadStations() {
  if (_stations) return _stations;
  let raw;
  try {
    raw = JSON.parse(await readFile(CACHE_PATH, 'utf8'));
  } catch {
    raw = JSON.parse(await readFile(SNAPSHOT_PATH, 'utf8'));
  }
  _stations = Object.entries(raw).map(([id, s]) => ({ id, ...s }));
  return _stations;
}

/**
 * Find radiosonde stations.
 *
 * Input variants (exactly one required):
 *   { lat, lon, radiusKm?, limit? }  — proximity search
 *   { stationId }                    — direct lookup by ID
 *   { name }                         — substring search on name/ICAO, best match first
 */
export async function findStations(input) {
  const stations = await loadStations();

  if (input.stationId != null) {
    const s = stations.find(s => s.id === input.stationId);
    return s ? [s] : [];
  }

  if (input.name != null) {
    const q = input.name.toLowerCase();
    const scored = stations
      .map(s => {
        const n = (s.name || '').toLowerCase();
        const icao = (s.icao || '').toLowerCase();
        let score = 0;
        if (n === q || icao === q) score = 3;
        else if (n.startsWith(q) || icao.startsWith(q)) score = 2;
        else if (n.includes(q) || icao.includes(q)) score = 1;
        return { s, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 10).map(x => x.s);
  }

  if (input.lat != null && input.lon != null) {
    const radiusKm = input.radiusKm ?? 500;
    const limit = input.limit ?? 10;
    return stations
      .map(s => ({ ...s, distance_km: Math.round(haversineKm(input.lat, input.lon, s.lat, s.lon) * 10) / 10 }))
      .filter(s => s.distance_km <= radiusKm)
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, limit);
  }

  throw new Error('findStations: provide lat+lon, stationId, or name');
}

/**
 * List available ascents for a station (~14 days history).
 * Returns array of { time_ms, time_utc, format } sorted newest first.
 */
export async function listAscents(stationId) {
  const data = await windyFetch(`${BASE_OBS}/${stationId}/1/1?pr=0&sc=0&token2=pending`);
  return (data.history || [])
    .map(h => ({ time_ms: h.time, time_utc: new Date(h.time).toISOString(), format: h.format }))
    .sort((a, b) => b.time_ms - a.time_ms);
}

/**
 * Fetch a sounding as a raw GeoJSON FeatureCollection.
 * If timeMs is omitted, fetches the latest available ascent.
 * Point features contain: pressure, temp, dewpoint, wind_u, wind_v, gpheight.
 * Last feature is a LineString (flight path) — filter with f.geometry.type === 'Point' if unwanted.
 */
export async function getSounding(stationId, timeMs) {
  if (timeMs == null) {
    const ascents = await listAscents(stationId);
    if (!ascents.length) throw new Error(`No ascents available for ${stationId}`);
    timeMs = ascents[0].time_ms;
  }
  return windyFetch(`${BASE_DL}/${stationId}/download?time=${timeMs}&format=fm94`);
}
