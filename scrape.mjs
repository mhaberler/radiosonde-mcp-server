// Scrape all radiosonde stations from Windy tile API.
// Fetches zoom levels 4, 5, 6 in parallel to capture stations hidden by clustering at low zoom.
// No browser needed — token2=pending works for public tile data.

import { writeFileSync, readFileSync } from 'fs';

const OUT = 'untracked/stations.json';
const BASE = 'https://node.windy.com/pois/v2/radiosonde';
const TILE_SIZE = 256;
const BATCH = 20;

function tilePixelToLatLon(zoom, tileCol, tileRow, pixX, pixY) {
  const n = Math.pow(2, zoom);
  const lon = ((tileCol + pixX / TILE_SIZE) / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * (tileRow + pixY / TILE_SIZE) / n)));
  return { lat: +(latRad * 180 / Math.PI).toFixed(6), lon: +lon.toFixed(6) };
}

async function fetchTile(z, x, y) {
  const url = `${BASE}/tiles/${z}/${x}/${y}?pr=0&sc=0&token2=pending`;
  const r = await fetch(url);
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

const stations = {};

// Load existing stations to preserve manually added entries (e.g. Graz)
try {
  const existing = JSON.parse(readFileSync(OUT, 'utf8'));
  Object.assign(stations, existing);
  console.error(`Loaded ${Object.keys(stations).length} existing stations`);
} catch {}

for (const zoom of [4, 5, 6]) {
  console.error(`Scraping zoom ${zoom} (${Math.pow(2,zoom)}x${Math.pow(2,zoom)} = ${Math.pow(2,zoom*2)} tiles)...`);
  const added = await scrapeZoom(zoom, stations);
  console.error(`  zoom ${zoom}: +${added} new stations, total ${Object.keys(stations).length}`);
}

const count = Object.keys(stations).length;
writeFileSync(OUT, JSON.stringify(stations, null, 2));
console.error(`Done. Wrote ${count} stations to ${OUT}`);
