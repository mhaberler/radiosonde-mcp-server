// Enrich stations.json with name, wmo_id (from Windy detail API) and icao
// (proximity-matched from OurAirports CSV, threshold 10 km).
// Idempotent: stations already having `name` are skipped for detail fetch.
// Run: node src/enrich.mjs

import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { CACHE_DIR, CACHE_PATH, haversineKm, getDetail } from '../lib/utils.mjs';

const AIRPORTS_URL = 'https://davidmegginson.github.io/ourairports-data/airports.csv';
const AIRPORTS_CACHE = join(CACHE_DIR, 'airports.csv');
const ICAO_RADIUS_KM = 10;
const DETAIL_CONCURRENCY = 10;

// ── OurAirports CSV ───────────────────────────────────────────────────────────

async function loadAirports() {
  let csv;
  try {
    csv = readFileSync(AIRPORTS_CACHE, 'utf8');
    console.error(`[enrich] Loaded airports from cache`);
  } catch {
    console.error(`[enrich] Downloading OurAirports CSV...`);
    const r = await fetch(AIRPORTS_URL);
    if (!r.ok) throw new Error(`HTTP ${r.status} fetching airports CSV`);
    csv = await r.text();
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(AIRPORTS_CACHE, csv);
    console.error(`[enrich] Saved airports CSV`);
  }

  const lines = csv.split('\n');
  const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const iIcao = header.indexOf('ident');
  const iType = header.indexOf('type');
  const iLat  = header.indexOf('latitude_deg');
  const iLon  = header.indexOf('longitude_deg');

  const airports = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvRow(lines[i]);
    if (!cols || cols.length < 4) continue;
    const type = cols[iType];
    // only large/medium/small airports and heliports have reliable ICAO codes
    if (!['large_airport', 'medium_airport', 'small_airport'].includes(type)) continue;
    const icao = cols[iIcao];
    // proper ICAO codes are exactly 4 uppercase letters (no digits, no hyphens)
    if (!icao || !/^[A-Z]{4}$/.test(icao)) continue;
    const lat = parseFloat(cols[iLat]);
    const lon = parseFloat(cols[iLon]);
    if (isNaN(lat) || isNaN(lon)) continue;
    airports.push({ icao, lat, lon });
  }
  console.error(`[enrich] ${airports.length} airports loaded`);
  return airports;
}

function splitCsvRow(line) {
  // naive CSV split handling quoted fields
  const cols = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; continue; }
    if (c === ',' && !inQ) { cols.push(cur); cur = ''; continue; }
    cur += c;
  }
  cols.push(cur);
  return cols;
}

function nearestIcao(airports, lat, lon) {
  let best = null, bestDist = ICAO_RADIUS_KM;
  for (const a of airports) {
    const d = haversineKm(lat, lon, a.lat, a.lon);
    if (d < bestDist) { best = a.icao; bestDist = d; }
  }
  return best;
}

// ── Main ──────────────────────────────────────────────────────────────────────

mkdirSync(CACHE_DIR, { recursive: true });

let stations = {};
try {
  stations = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
} catch {
  console.error('[enrich] No stations.json found — run scrape first');
  process.exit(1);
}

const airports = await loadAirports();

const ids = Object.keys(stations);
console.error(`[enrich] ${ids.length} stations to process`);

// Fetch detail for stations missing name, in batches
const needDetail = ids.filter(id => !stations[id].name);
console.error(`[enrich] ${needDetail.length} stations need detail fetch`);

let fetched = 0, failed = 0;
for (let i = 0; i < needDetail.length; i += DETAIL_CONCURRENCY) {
  const batch = needDetail.slice(i, i + DETAIL_CONCURRENCY);
  await Promise.all(batch.map(async id => {
    try {
      const d = await getDetail(id);
      if (d.name) stations[id].name = d.name;
      if (d.elevation != null) stations[id].elevation_m = d.elevation;
      // use precise coords from detail if available
      if (d.lat != null) stations[id].lat = d.lat;
      if (d.lon != null) stations[id].lon = d.lon;
      fetched++;
    } catch {
      failed++;
    }
  }));
  if ((i / DETAIL_CONCURRENCY) % 10 === 0)
    process.stderr.write(`  detail: ${Math.min(i + DETAIL_CONCURRENCY, needDetail.length)}/${needDetail.length}\r`);
}
process.stderr.write('\n');
console.error(`[enrich] Detail: ${fetched} fetched, ${failed} failed`);

// ICAO proximity match for all stations
let icaoMatched = 0;
for (const id of ids) {
  const s = stations[id];
  const icao = nearestIcao(airports, s.lat, s.lon);
  if (icao) { s.icao = icao; icaoMatched++; }
  else delete s.icao;
}
console.error(`[enrich] ICAO matched: ${icaoMatched}/${ids.length}`);

// WMO IDs come from sounding metadata (station_id field), not from getDetail.
// They cannot be bulk-fetched without downloading soundings, so wmo_id is
// populated lazily by server.mjs when a sounding is retrieved.

writeFileSync(CACHE_PATH, JSON.stringify(stations, null, 2));
console.error(`[enrich] Wrote ${ids.length} stations to ${CACHE_PATH}`);
