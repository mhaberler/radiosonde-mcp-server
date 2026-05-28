---
name: windy-poi-scraper
description: Scrape POI station locations from Windy.com and retrieve radiosonde sounding data using Playwright network interception. Extracts all stations globally via tile API, and downloads ascent GeoJSON (vertical profile: temp, dewpoint, pressure, wind) for any station. Use when asked to extract radiosonde stations or sounding data from Windy.com.
---

# Windy Radiosonde Scraper

## Quick start

```bash
npm install playwright && npx playwright install chromium
node scrape.mjs                      # → untracked/stations.json (~619 stations)
node fetch-ascent.mjs <station-id>   # → untracked/ascent-{id}-{time}.json
```

## API reference

### Tile API (station locations)
```
GET node.windy.com/pois/v2/{layer}/tiles/{z}/{x}/{y}?token2={JWT}
```
Response — parallel arrays:
```json
{"id":["abc123"], "tileX":[197], "tileY":[268], "time":[1779926400000], "type":["wmo"], "format":["fm94"]}
```
`tileX`/`tileY` are pixel offsets in a 256px tile → convert via web mercator:
```js
function tilePixelToLatLon(zoom, tileCol, tileRow, pixX, pixY) {
  const n = Math.pow(2, zoom);
  const lon = ((tileCol + pixX / 256) / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * (tileRow + pixY / 256) / n)));
  return { lat: +(latRad * 180 / Math.PI).toFixed(6), lon: +lon.toFixed(6) };
}
```

### Station detail API
```
GET node.windy.com/pois/v2/radiosonde/{id}?token2={JWT}
```
Returns: `name`, `lat`, `lon`, `elevation`, `lastAscents: [{format, time}]`

### Sounding download API
```
GET dl.windy.com/obs/measurement/v2/radiosonde/{id}/download?time={ms}&format=fm94
```
Returns GeoJSON FeatureCollection — one Feature per vertical level:
```json
{"type":"Feature","geometry":{"coordinates":[lon,lat,gpheight]},"properties":
  {"time":…,"gpheight":215,"temp":301.45,"dewpoint":284.59,"pressure":991.8,"wind_u":6.58,"wind_v":-2.39}}
```
Typically 150–200 levels per sounding. `token2=pending` works (no auth required for public stations).

### Available ascents (dropdown)
Navigate to station on Windy, click POI marker, read `document.querySelector('select')` options.
~56 entries per station = 28 days × 2 times/day (00Z + 12Z) × 2 formats (fm94 + fm35).

## Token capture pattern

```js
page.on('response', async (resp) => {
  if (capturedToken) return;
  const m = resp.url().match(/\/pois\/v2\/.*\/tiles\/.*token2=([^&]+)/);
  if (m) capturedToken = m[1];
});
```
Token is session-scoped; `token2=pending` also works for public data.

## scrape.mjs workflow (all stations)

1. Navigate to `https://www.windy.com/?{lat},{lon},4,p:radiosonde`
2. Intercept tile responses → capture token + parse viewport tiles
3. After `networkidle`, `page.evaluate(fetch(...))` all remaining zoom-4 tiles (16×16 grid)
4. Deduplicate by id → write `stations.json`

## fetch-ascent.mjs workflow (single station)

1. Navigate to station coords → capture token
2. `GET /pois/v2/radiosonde/{id}` → get `lastAscents`
3. Click POI marker → read `<select>` for full ascent list (56 entries)
4. `page.evaluate(fetch(...))` download endpoint → GeoJSON sounding
5. Write `ascent-{id}-{time}.json` with station metadata + sounding + ascent list
