# windy-radiosonde MCP server

## Install from GitHub

```bash
git clone <repo-url>
cd radiosonde-mcp-server
npm install           # triggers postinstall → scrapes ~690 stations to ~/.cache/windy-radiosonde/stations.json
```

## Register with Claude Code

```bash
# Global (all projects):
claude mcp add -s user radiosonde node /path/to/radiosonde-mcp-server/bin/server.js

# Project-local only:
claude mcp add radiosonde node /path/to/radiosonde-mcp-server/bin/server.js
```

Active in next Claude Code session. `mcpServers` is **not** a valid key in `~/.claude/settings.json` — use `claude mcp add` instead.

## Register with Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (restart app after):

```json
{
  "mcpServers": {
    "radiosonde": {
      "command": "node",
      "args": ["/path/to/radiosonde-mcp-server/bin/server.js"]
    }
  }
}
```

## MCP tools

**`find_stations(lat, lon, radius_km, limit)`**
Find stations near a location. Always probes live tile to catch stations that launched after last scrape. Returns `name`, `wmo_id`, and `icao` when available in the enriched cache.

**`get_station_detail(station_id)`**
Name, elevation, `wmo_id`, `icao`, and last 2 ascent timestamps.

**`list_ascents(station_id)`**
List all available ascents for a station (~14 days of history). Returns array of `{time_ms, time_utc, format}`. Use `time_ms` values with `get_sounding`.

**`get_sounding(station_id, time_ms?, format?)`**
GeoJSON FeatureCollection, ~190 vertical levels. Properties per level: `gpheight` (m), `temp` (K), `dewpoint` (K), `pressure` (hPa), `wind_u`/`wind_v` (m/s). Meta block includes `wmo_id` and `icao` when known.

## Station cache enrichment

After the initial scrape, run enrichment to add human-readable names and ICAO airport codes:

```bash
npm run enrich
# or: node src/enrich.mjs
```

This adds to each cache entry:

- `name` — station name from Windy (e.g. `"Wien/Hohe Warte"`)
- `elevation_m` — elevation in metres
- `icao` — nearest ICAO airport code within 10 km (sourced from OurAirports, 4-letter codes only), if applicable
- `wmo_id` — WMO numeric ID, populated lazily the first time a sounding is retrieved for that station

The OurAirports CSV is cached at `~/.cache/windy-radiosonde/airports.csv`. Enrichment is idempotent — re-running skips stations already having a name and re-runs ICAO matching for all stations.

A pre-enriched snapshot is included in the repo as `stations-example.json` (~690 stations with name, elevation, and ICAO where available) for reference and bootstrapping.

## Manual station refresh

```bash
node src/scrape.mjs          # re-scrape live tiles → ~/.cache/windy-radiosonde/stations.json
node src/scrape-igra.mjs     # cross-reference IGRA2 registry (run after scrape.mjs)
npm run enrich               # enrich with names, ICAO codes (run after scrape)
```

The server auto-refreshes the cache in the background on startup if it is older than 7 days.

## Repo layout

```text
bin/server.js          # entry point (chmod +x, bin field in package.json)
src/
  server.mjs           # MCP server — 3 tools, stdio transport
  scrape.mjs           # tile scraper (zoom 4+5+6, ~690 active stations)
  scrape-igra.mjs      # IGRA2 enrichment scraper
  enrich.mjs           # enriches cache with name, wmo_id, ICAO from Windy + OurAirports
lib/
  utils.mjs            # shared: haversine, tile math, windyFetch, CACHE_PATH
```

## API reference

### Tile API (station locations)

```text
GET node.windy.com/pois/v2/{layer}/tiles/{z}/{x}/{y}?pr=0&sc=0&token2=pending
```

Response — parallel arrays:

```json
{"id":["abc123"], "tileX":[197], "tileY":[268], "time":[1779926400000], "type":["wmo"], "format":["fm94"]}
```

`tileX`/`tileY` are pixel offsets in a 256px tile → web mercator conversion in `lib/utils.mjs:tilePixelToLatLon`.

Zoom 6 (64×64 = 4096 tiles) is the sweet spot — no clustering, complete coverage.

### Station detail API

```text
GET node.windy.com/pois/v2/radiosonde/{id}?pr=0&sc=0&token2=pending
```

Returns: `id`, `name`, `lat`, `lon`, `elevation`, `lastAscents: [{format, time}]`

### Sounding download API

```text
GET dl.windy.com/obs/measurement/v2/radiosonde/{id}/download?time={ms}&format=fm94
```

GeoJSON FeatureCollection, one Feature per vertical level (~190 levels). `token2=pending` works for all public stations.

### Ascent history API

```text
GET node.windy.com/obs/measurement/v2/radiosonde/{windy_id}/1/1
```

Returns latest sounding data plus a `history` array of `{time, format}` for all available ascents (~14 days). Path segments: `1` = fm94 format, `1` = count (1 sounding). The `history` field always contains the full available list regardless of count.

## Key insight: live-only tile API

Windy's tile API returns **only stations with a recent ascent** (~24–48h window). The cached index is a snapshot. `find_stations` probes the live tile on every call to discover stations that became active since last scrape.
