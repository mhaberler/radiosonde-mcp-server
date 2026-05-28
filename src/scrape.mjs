// Scrape all radiosonde stations from Windy tile API.
// Fetches zoom levels 4, 5, 6 to capture stations hidden by clustering at low zoom.
// Output: ~/.cache/windy-radiosonde/stations.json

import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { CACHE_DIR, CACHE_PATH, BASE_NODE, tilePixelToLatLon } from '../lib/utils.mjs';

const BATCH = 20;

async function fetchTile(z, x, y) {
  const r = await fetch(`${BASE_NODE}/tiles/${z}/${x}/${y}?pr=0&sc=0&token2=pending`);
  if (!r.ok) return null;
  return r.json();
}

async function scrapeZoom(zoom, stations) {
  const n = Math.pow(2, zoom);
  const tiles = [];
  for (let x = 0; x < n; x++)
    for (let y = 0; y < n; y++)
      tiles.push([x, y]);

  let added = 0;
  for (let i = 0; i < tiles.length; i += BATCH) {
    const batch = tiles.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(([x, y]) => fetchTile(zoom, x, y)));
    for (let j = 0; j < batch.length; j++) {
      const [x, y] = batch[j];
      const data = results[j];
      if (!data) continue;
      const ids = data.id || [];
      const tileXs = data.tileX || [];
      const tileYs = data.tileY || [];
      for (let k = 0; k < ids.length; k++) {
        const id = ids[k];
        if (!id || stations[id]) continue;
        stations[id] = tilePixelToLatLon(zoom, x, y, tileXs[k] ?? 0, tileYs[k] ?? 0);
        added++;
      }
    }
    if ((i / BATCH) % 20 === 0) {
      process.stderr.write(`  z${zoom}: ${i + batch.length}/${tiles.length} tiles, ${Object.keys(stations).length} stations total\r`);
    }
  }
  process.stderr.write('\n');
  return added;
}

mkdirSync(CACHE_DIR, { recursive: true });

const stations = {};
try {
  Object.assign(stations, JSON.parse(readFileSync(CACHE_PATH, 'utf8')));
  console.error(`Loaded ${Object.keys(stations).length} existing stations`);
} catch {}

for (const zoom of [4, 5, 6]) {
  console.error(`Scraping zoom ${zoom} (${Math.pow(2, zoom)}x${Math.pow(2, zoom)} = ${Math.pow(2, zoom * 2)} tiles)...`);
  const added = await scrapeZoom(zoom, stations);
  console.error(`  zoom ${zoom}: +${added} new stations, total ${Object.keys(stations).length}`);
}

const count = Object.keys(stations).length;
writeFileSync(CACHE_PATH, JSON.stringify(stations, null, 2));
console.error(`Done. Wrote ${count} stations to ${CACHE_PATH}`);
