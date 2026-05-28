import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const URL = 'https://www.windy.com/?13.072,-59.492,4,p:radiosonde,m:d2paexu';
const OUT = 'untracked/stations.json';
const ZOOM = 4;
const TILE_SIZE = 256;

function tilePixelToLatLon(zoom, tileCol, tileRow, pixX, pixY) {
  const n = Math.pow(2, zoom);
  const lon = ((tileCol + pixX / TILE_SIZE) / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * (tileRow + pixY / TILE_SIZE) / n)));
  return { lat: +(latRad * 180 / Math.PI).toFixed(6), lon: +lon.toFixed(6) };
}

const stations = {};
let capturedToken = null;
let capturedBaseUrl = null;
const fetchedTiles = new Set();

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Intercept tile responses and capture auth token
page.on('response', async (resp) => {
  const url = resp.url();
  const tileMatch = url.match(/\/pois\/v2\/radiosonde\/tiles\/(\d+)\/(\d+)\/(\d+)/);
  if (!tileMatch) return;

  // Capture token from first tile URL
  if (!capturedToken) {
    const tokenMatch = url.match(/token2=([^&]+)/);
    if (tokenMatch) {
      capturedToken = tokenMatch[1];
      capturedBaseUrl = url.replace(/\/tiles\/\d+\/\d+\/\d+.*/, '');
      console.error(`[TOKEN] captured (${capturedToken.slice(0, 20)}...)`);
    }
  }

  const [, z, x, y] = tileMatch.map(Number);
  const key = `${z}/${x}/${y}`;
  fetchedTiles.add(key);

  try {
    const text = await resp.text();
    if (!text || text.length < 10) return;
    const data = JSON.parse(text);
    parseTile(z, x, y, data);
  } catch {}
});

function parseTile(z, x, y, data) {
  const ids = data.id || [];
  const tileXs = data.tileX || [];
  const tileYs = data.tileY || [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (!id || stations[id]) continue;
    stations[id] = tilePixelToLatLon(z, x, y, tileXs[i] ?? 0, tileYs[i] ?? 0);
  }
}

console.error('Loading initial page...');
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForTimeout(3000);

const toggle = page.locator('a[data-tooltip="Radiosondes"]');
if (await toggle.count()) {
  const cls = await toggle.getAttribute('class') || '';
  if (!cls.includes('selected')) {
    await toggle.click();
    await page.waitForTimeout(2000);
  }
}

await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
await page.waitForTimeout(2000);

console.error(`After initial load: ${Object.keys(stations).length} stations, ${fetchedTiles.size} tiles`);

// Now fetch all remaining zoom-4 tiles directly using captured token
// Zoom 4: 2^4=16 cols (0-15), rows 0-15 (but ~3-12 have land)
if (capturedToken && capturedBaseUrl) {
  console.error('Fetching all remaining zoom-4 tiles via API...');
  const n = Math.pow(2, ZOOM); // 16

  const remaining = [];
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      const key = `${ZOOM}/${x}/${y}`;
      if (!fetchedTiles.has(key)) remaining.push([x, y]);
    }
  }
  console.error(`Tiles to fetch: ${remaining.length}`);

  // Fetch in batches of 10 in parallel
  const BATCH = 10;
  for (let i = 0; i < remaining.length; i += BATCH) {
    const batch = remaining.slice(i, i + BATCH);
    await Promise.all(batch.map(async ([x, y]) => {
      const tileUrl = `${capturedBaseUrl}/tiles/${ZOOM}/${x}/${y}?pr=0&sc=0&token2=${capturedToken}`;
      try {
        const resp = await page.evaluate(async (url) => {
          const r = await fetch(url);
          return r.ok ? r.text() : null;
        }, tileUrl);
        if (resp) {
          const data = JSON.parse(resp);
          parseTile(ZOOM, x, y, data);
        }
      } catch {}
    }));
  }
  console.error(`After full fetch: ${Object.keys(stations).length} stations`);
} else {
  console.error('WARNING: No token captured, only viewport tiles available');
}

await browser.close();

const count = Object.keys(stations).length;
console.error(`Total unique stations: ${count}`);

if (count === 0) {
  console.error('WARNING: No stations extracted.');
  process.exit(1);
}

writeFileSync(OUT, JSON.stringify(stations, null, 2));
console.log(`Wrote ${count} stations to ${OUT}`);
