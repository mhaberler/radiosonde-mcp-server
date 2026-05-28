// Enrich stations.json using IGRA2 station registry.
// For each active IGRA2 station, probe Windy's tile API at zoom 8 to find its Windy ID.
// Adds stations that were inactive during the live-tile scrape.

import { readFileSync, writeFileSync } from 'fs';

const OUT = 'untracked/stations.json';
const IGRA_URL = 'https://www.ncei.noaa.gov/pub/data/igra/igra2-station-list.txt';
const BASE = 'https://node.windy.com/pois/v2/radiosonde';
const ZOOM = 8;
const TILE_SIZE = 256;
const BATCH = 20;
const MIN_LAST_YEAR = 2020;

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

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Parse IGRA2 station list
// Format: ID lat lon elev name firstYear lastYear numRecords
function parseIGRA(text) {
  return text.split('\n')
    .filter(line => line.trim().length > 20)
    .map(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 7) return null;
      const lastYear = parseInt(parts[6]);
      if (lastYear < MIN_LAST_YEAR) return null;
      const lat = parseFloat(parts[1]);
      const lon = parseFloat(parts[2]);
      if (isNaN(lat) || isNaN(lon)) return null;
      return { igra_id: parts[0], lat, lon, lastYear };
    })
    .filter(Boolean);
}

// Load existing station index
const stations = JSON.parse(readFileSync(OUT, 'utf8'));
const existingCount = Object.keys(stations).length;
console.error(`Existing stations: ${existingCount}`);

// Download IGRA2 list
console.error('Downloading IGRA2 station list...');
const igraText = await fetch(IGRA_URL).then(r => r.text());
const igra = parseIGRA(igraText);
console.error(`IGRA2 active stations (since ${MIN_LAST_YEAR}): ${igra.length}`);

// Collect unique z8 tiles to probe
const tileMap = new Map(); // "x/y" → [igra stations in that tile]
for (const stn of igra) {
  const [tx, ty] = latLonToTile(stn.lat, stn.lon, ZOOM);
  const key = `${tx}/${ty}`;
  if (!tileMap.has(key)) tileMap.set(key, []);
  tileMap.get(key).push(stn);
}
console.error(`Unique z${ZOOM} tiles to probe: ${tileMap.size}`);

// Probe each tile, find Windy IDs closest to each IGRA station
const tileEntries = [...tileMap.entries()];
let newCount = 0;
let tilesDone = 0;

for (let i = 0; i < tileEntries.length; i += BATCH) {
  const batch = tileEntries.slice(i, i + BATCH);
  const results = await Promise.all(batch.map(async ([key, igraStnList]) => {
    const [tx, ty] = key.split('/').map(Number);
    const url = `${BASE}/tiles/${ZOOM}/${tx}/${ty}?pr=0&sc=0&token2=pending`;
    try {
      const r = await fetch(url);
      if (!r.ok) return;
      const data = await r.json();
      const ids = data.id || [];
      const tileXs = data.tileX || [];
      const tileYs = data.tileY || [];

      // Build positions for all Windy stations in this tile
      const windyPositions = ids.map((id, k) => ({
        id,
        ...tilePixelToLatLon(ZOOM, tx, ty, tileXs[k] ?? 0, tileYs[k] ?? 0),
      }));

      // For each IGRA station, find closest Windy station within 15km
      for (const igra of igraStnList) {
        const match = windyPositions
          .map(w => ({ ...w, dist: haversineKm(igra.lat, igra.lon, w.lat, w.lon) }))
          .sort((a, b) => a.dist - b.dist)[0];

        if (match && match.dist < 15 && !stations[match.id]) {
          stations[match.id] = { lat: match.lat, lon: match.lon };
          newCount++;
        }
      }
    } catch {}
  }));

  tilesDone += batch.length;
  if (tilesDone % 100 === 0 || tilesDone === tileEntries.length) {
    process.stderr.write(`  ${tilesDone}/${tileEntries.length} tiles, +${newCount} new stations\r`);
  }
}

process.stderr.write('\n');

const total = Object.keys(stations).length;
console.error(`Done. +${newCount} new stations, total ${total} (was ${existingCount})`);
writeFileSync(OUT, JSON.stringify(stations, null, 2));
