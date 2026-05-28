// Enrich stations.json using IGRA2 station registry.
// For each active IGRA2 station, probes Windy's tile API at zoom 8 to find its Windy ID.
// Run after scrape.mjs: node src/scrape-igra.mjs

import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { CACHE_DIR, CACHE_PATH, BASE_NODE, latLonToTile, tilePixelToLatLon, haversineKm } from '../lib/utils.mjs';

const IGRA_URL = 'https://www.ncei.noaa.gov/pub/data/igra/igra2-station-list.txt';
const ZOOM = 8;
const BATCH = 20;
const MIN_LAST_YEAR = 2020;

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

mkdirSync(CACHE_DIR, { recursive: true });

const stations = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
const existingCount = Object.keys(stations).length;
console.error(`Existing stations: ${existingCount}`);

console.error('Downloading IGRA2 station list...');
const igraText = await fetch(IGRA_URL).then(r => r.text());
const igra = parseIGRA(igraText);
console.error(`IGRA2 active stations (since ${MIN_LAST_YEAR}): ${igra.length}`);

const tileMap = new Map();
for (const stn of igra) {
  const [tx, ty] = latLonToTile(stn.lat, stn.lon, ZOOM);
  const key = `${tx}/${ty}`;
  if (!tileMap.has(key)) tileMap.set(key, []);
  tileMap.get(key).push(stn);
}
console.error(`Unique z${ZOOM} tiles to probe: ${tileMap.size}`);

const tileEntries = [...tileMap.entries()];
let newCount = 0;
let tilesDone = 0;

for (let i = 0; i < tileEntries.length; i += BATCH) {
  const batch = tileEntries.slice(i, i + BATCH);
  await Promise.all(batch.map(async ([key, igraStnList]) => {
    const [tx, ty] = key.split('/').map(Number);
    try {
      const r = await fetch(`${BASE_NODE}/tiles/${ZOOM}/${tx}/${ty}?pr=0&sc=0&token2=pending`);
      if (!r.ok) return;
      const data = await r.json();
      const ids = data.id || [];
      const tileXs = data.tileX || [];
      const tileYs = data.tileY || [];

      const windyPositions = ids.map((id, k) => ({
        id,
        ...tilePixelToLatLon(ZOOM, tx, ty, tileXs[k] ?? 0, tileYs[k] ?? 0),
      }));

      for (const stn of igraStnList) {
        const match = windyPositions
          .map(w => ({ ...w, dist: haversineKm(stn.lat, stn.lon, w.lat, w.lon) }))
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
writeFileSync(CACHE_PATH, JSON.stringify(stations, null, 2));
