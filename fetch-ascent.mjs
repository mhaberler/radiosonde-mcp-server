import { chromium } from 'playwright';
import { writeFileSync, readFileSync } from 'fs';

const id = process.argv[2];
if (!id) { console.error('Usage: node fetch-ascent.mjs <station-id>'); process.exit(1); }

const stations = JSON.parse(readFileSync('untracked/stations.json', 'utf8'));
if (!stations[id]) { console.error(`Station ${id} not found in stations.json`); process.exit(1); }

const { lat, lon } = stations[id];
let capturedToken = null;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Capture JWT from tile responses
page.on('response', async (resp) => {
  if (capturedToken) return;
  const url = resp.url();
  if (!url.includes('/pois/v2/radiosonde/tiles/')) return;
  const m = url.match(/token2=([^&]+)/);
  if (m) capturedToken = m[1];
});

await page.goto(`https://www.windy.com/?${lat},${lon},10,p:radiosonde`, {
  waitUntil: 'domcontentloaded', timeout: 60_000
});
await page.waitForTimeout(4000);
await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});

const token = capturedToken || 'pending';
console.error(`Token: ${token ? token.slice(0, 20) + '...' : 'none'}`);

// 1. Fetch station detail — name, elevation, lastAscents
const detailUrl = `https://node.windy.com/pois/v2/radiosonde/${id}?pr=0&sc=0&token2=${token}`;
const detailText = await page.evaluate(async (url) => {
  const r = await fetch(url);
  return r.ok ? r.text() : null;
}, detailUrl);

if (!detailText) { console.error('Failed to fetch station detail'); await browser.close(); process.exit(1); }
const detail = JSON.parse(detailText);
console.error(`Station: ${detail.name} (${detail.lat}, ${detail.lon}) elev=${detail.elevation}m`);
console.error(`Last ascents: ${JSON.stringify(detail.lastAscents)}`);

// 2. Fetch all available ascents by clicking the POI and reading the dropdown
//    Navigate to station, click marker, read select options
await page.goto(`https://www.windy.com/?${lat},${lon},10,p:radiosonde`, {
  waitUntil: 'domcontentloaded', timeout: 60_000
});
await page.waitForTimeout(5000);

const marker = page.locator(`[data-id="${id}"]`);
const allAscents = [];

if (await marker.count()) {
  await marker.first().click();
  await page.waitForTimeout(3000);

  // Read the dropdown select — options are the full ascent list
  const selectOptions = await page.evaluate(() => {
    const sel = document.querySelector('select');
    if (!sel) return [];
    return Array.from(sel.options).map(o => ({ index: o.value, label: o.text.trim() }));
  });

  console.error(`Available ascents (${selectOptions.length}):`);
  selectOptions.forEach(o => console.error(`  [${o.index}] ${o.label}`));
  allAscents.push(...selectOptions);
} else {
  console.error('Marker not visible — using lastAscents from detail API');
}

await browser.close();

// 3. Download latest ascent (fm94 preferred, fallback fm35)
const latest = detail.lastAscents?.find(a => a.format === 'fm94') ?? detail.lastAscents?.[0];
if (!latest) { console.error('No ascents available'); process.exit(1); }

const { time, format } = latest;
console.error(`\nDownloading: id=${id} time=${time} format=${format}`);

// Re-open browser to use session fetch (token may be needed)
const browser2 = await chromium.launch({ headless: true });
const page2 = await browser2.newPage();
await page2.goto(`https://www.windy.com/?${lat},${lon},10,p:radiosonde`, {
  waitUntil: 'domcontentloaded', timeout: 60_000
});
await page2.waitForTimeout(3000);

const dlUrl = `https://dl.windy.com/obs/measurement/v2/radiosonde/${id}/download?time=${time}&format=${format}`;
const data = await page2.evaluate(async (url) => {
  const r = await fetch(url);
  return { status: r.status, body: await r.text() };
}, dlUrl);

await browser2.close();

if (data.status !== 200) {
  console.error(`Download failed: HTTP ${data.status}\n${data.body.slice(0, 200)}`);
  process.exit(1);
}

const result = {
  id,
  name: detail.name,
  lat: detail.lat,
  lon: detail.lon,
  elevation: detail.elevation,
  time,
  format,
  availableAscents: allAscents,
  sounding: JSON.parse(data.body),
};

const outFile = `untracked/ascent-${id}-${time}.json`;
writeFileSync(outFile, JSON.stringify(result, null, 2));
console.log(`Wrote ${outFile} (station: ${detail.name}, ${new Date(time).toISOString()})`);
