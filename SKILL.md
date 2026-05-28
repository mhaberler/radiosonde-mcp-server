---
name: windy-poi-scraper
description: Scrape radiosonde station locations from Windy.com and retrieve sounding data (vertical atmospheric profiles) using Windy's tile and measurement APIs. No browser needed — token2=pending works for all public endpoints. Use when asked to find radiosonde stations near a location, retrieve sounding data, or fetch atmospheric profiles from Windy.com.
---

# Windy Radiosonde Scraper

## Quick start

```bash
npm install playwright @modelcontextprotocol/sdk
npx playwright install chromium          # only needed for fetch-ascent.mjs
node scrape.mjs                          # → untracked/stations.json (~690 active stations)
node fetch-ascent.mjs <station-id>       # → untracked/ascent-{id}-{time}.json
node mcp-server.mjs                      # MCP server (stdio)
```

## Key insight: live-only tile API

Windy's tile API returns **only stations with a recent ascent** (~24–48h window). The 690-station index is the complete active set at scrape time. Stations that haven't launched recently are invisible regardless of zoom level. `find_stations` in the MCP server does a live tile probe on every call to catch newly-active stations automatically.

## API reference

### Tile API (station locations)

```
GET node.windy.com/pois/v2/{layer}/tiles/{z}/{x}/{y}?pr=0&sc=0&token2=pending
```

Response — parallel arrays, not objects:
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

Zoom choice: z4 clusters nearby stations, z6 (64×64=4096 tiles) is the sweet spot — no clustering, manageable tile count. Z7+ returns fewer stations near tile edges. Scrape z4+z5+z6 and deduplicate.

### Station detail API

```
GET node.windy.com/pois/v2/radiosonde/{id}?pr=0&sc=0&token2=pending
```

Returns: `id`, `name`, `lat`, `lon`, `elevation`, `lastAscents: [{format, time}]`

### Sounding download API

```
GET dl.windy.com/obs/measurement/v2/radiosonde/{id}/download?time={ms}&format=fm94
```

Returns GeoJSON FeatureCollection — one Feature per vertical level (~150–200 levels):
```json
{"type":"Feature","geometry":{"coordinates":[lon,lat,gpheight]},"properties":
  {"time":…,"gpheight":215,"temp":301.45,"dewpoint":284.59,"pressure":991.8,"wind_u":6.58,"wind_v":-2.39}}
```

`token2=pending` works for all public station data.

### Available ascents (UI dropdown)

Navigate to station on Windy, click POI marker, read `document.querySelector('select')` options. ~56 entries = 28 days × 2 launches/day (00Z + 12Z) × 2 formats (fm94 + fm35).

## MCP server

[mcp-server.mjs](mcp-server.mjs) — 3 tools, no Playwright, pure `fetch()`:

- `find_stations(lat, lon, radius_km, limit)` — nearest stations; probes live tile on every call to catch newly-active stations not yet in the index
- `get_station_detail(station_id)` — name, elevation, lastAscents
- `get_sounding(station_id, time_ms?, format?)` — full vertical profile GeoJSON (~190 levels)

Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "radiosonde": {
      "command": "node",
      "args": ["/Users/mah/Ballon/src/BalloonWare/ai/windy-radiosonde-skill/mcp-server.mjs"]
    }
  }
}
```

## scrape.mjs workflow (all stations)

Pure fetch, no browser. Scrapes zoom levels 4, 5, 6 in sequence to defeat clustering:
1. Fetch all `2^z × 2^z` tiles per zoom level in batches of 20
2. Parse parallel-array tile responses, convert pixel offsets to lat/lon
3. Deduplicate by id across zoom levels
4. Write `untracked/stations.json`

## fetch-ascent.mjs workflow (single station, with Playwright)

Used when full ascent list (dropdown) is needed:
1. Navigate to station coords → capture JWT token from tile responses
2. `GET /pois/v2/radiosonde/{id}` → get `lastAscents`
3. Click POI marker → read `<select>` for full 56-entry ascent list
4. Download latest fm94 sounding via `page.evaluate(fetch(...))`
5. Write `ascent-{id}-{time}.json` with metadata + sounding + ascent list
