# windy-radiosonde MCP server

## Install from GitHub

```bash
git clone <repo-url>
cd windy-radiosonde-skill
npm install           # triggers postinstall → scrapes ~690 stations to ~/.cache/windy-radiosonde/stations.json
```

## Register with Claude Code

```bash
# Global (all projects):
claude mcp add -s user radiosonde node /path/to/windy-radiosonde-skill/bin/server.js

# Project-local only:
claude mcp add radiosonde node /path/to/windy-radiosonde-skill/bin/server.js
```

Active in next Claude Code session. `mcpServers` is **not** a valid key in `~/.claude/settings.json` — use `claude mcp add` instead.

## Register with Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (restart app after):

```json
{
  "mcpServers": {
    "radiosonde": {
      "command": "node",
      "args": ["/path/to/windy-radiosonde-skill/bin/server.js"]
    }
  }
}
```

## MCP tools

**`find_stations(lat, lon, radius_km, limit)`**
Find stations near a location. Always probes live tile to catch stations that launched after last scrape.

**`get_station_detail(station_id)`**
Name, elevation, last 2 ascent timestamps.

**`get_sounding(station_id, time_ms?, format?)`**
GeoJSON FeatureCollection, ~190 vertical levels. Properties per level: `gpheight` (m), `temp` (K), `dewpoint` (K), `pressure` (hPa), `wind_u`/`wind_v` (m/s).

## Manual station refresh

```bash
node src/scrape.mjs          # re-scrape live tiles → ~/.cache/windy-radiosonde/stations.json
node src/scrape-igra.mjs     # cross-reference IGRA2 registry (run after scrape.mjs)
```

The server auto-refreshes the cache in the background on startup if it is older than 7 days.

## Repo layout

```
bin/server.js          # entry point (chmod +x, bin field in package.json)
src/
  server.mjs           # MCP server — 3 tools, stdio transport
  scrape.mjs           # tile scraper (zoom 4+5+6, ~690 active stations)
  scrape-igra.mjs      # IGRA2 enrichment scraper
lib/
  utils.mjs            # shared: haversine, tile math, windyFetch, CACHE_PATH
```

## API reference

### Tile API (station locations)

```
GET node.windy.com/pois/v2/{layer}/tiles/{z}/{x}/{y}?pr=0&sc=0&token2=pending
```

Response — parallel arrays:
```json
{"id":["abc123"], "tileX":[197], "tileY":[268], "time":[1779926400000], "type":["wmo"], "format":["fm94"]}
```

`tileX`/`tileY` are pixel offsets in a 256px tile → web mercator conversion in `lib/utils.mjs:tilePixelToLatLon`.

Zoom 6 (64×64 = 4096 tiles) is the sweet spot — no clustering, complete coverage.

### Station detail API

```
GET node.windy.com/pois/v2/radiosonde/{id}?pr=0&sc=0&token2=pending
```

Returns: `id`, `name`, `lat`, `lon`, `elevation`, `lastAscents: [{format, time}]`

### Sounding download API

```
GET dl.windy.com/obs/measurement/v2/radiosonde/{id}/download?time={ms}&format=fm94
```

GeoJSON FeatureCollection, one Feature per vertical level (~190 levels). `token2=pending` works for all public stations.

## Key insight: live-only tile API

Windy's tile API returns **only stations with a recent ascent** (~24–48h window). The cached index is a snapshot. `find_stations` probes the live tile on every call to discover stations that became active since last scrape.
