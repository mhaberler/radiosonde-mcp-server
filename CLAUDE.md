# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install deps + run postinstall scrape (~690 stations → ~/.cache/windy-radiosonde/stations.json)
npm run setup        # re-scrape stations (node src/scrape.mjs)
npm run enrich       # enrich cache with names, elevation, ICAO (node src/enrich.mjs)
npm start            # run MCP server (node bin/server.js)

# Register with Claude Code:
claude mcp add -s user radiosonde node /path/to/bin/server.js
```

No test runner configured.

## Architecture

**MCP server** (`src/server.mjs`) — stdio transport, 4 tools:
- `find_stations` — haversine search over in-memory cache + live z6 tile probe on each call
- `get_station_detail` — fetches from Windy station detail API
- `list_ascents` — fetches full ~14-day history from obs endpoint
- `get_sounding` — downloads GeoJSON FeatureCollection; lazily persists `wmo_id` to cache

**Station cache** (`~/.cache/windy-radiosonde/stations.json`) — mutable in-memory dict keyed by Windy station ID. Auto-refreshed in background on startup if >7 days old. Fields per entry: `lat`, `lon`, `name`, `elevation_m`, `icao`, `wmo_id`.

**Shared utilities** (`lib/utils.mjs`) — API base URLs, cache path, haversine, web-mercator tile math (`tilePixelToLatLon`), `windyFetch`, `getDetail`.

**Scraper** (`src/scrape.mjs`) — walks zoom 4+5+6 tiles, deduplicates by ID, writes cache. Zoom 6 (4096 tiles) is the key level — no clustering at that zoom.

**Enrichment** (`src/enrich.mjs`) — fetches station names from Windy detail API; matches nearest ICAO airport within 10 km from OurAirports CSV (cached at `~/.cache/windy-radiosonde/airports.csv`). Idempotent.

**Webapp** (`index.html`) — standalone browser app, no server needed. Uses `meteojs.bundle.js` (local IIFE bundle) for skew-T diagram. `stations-example.json` is inlined as `const STATIONS`. To rebuild the meteoJS bundle:
```sh
npx esbuild meteojs-entry.js --bundle --format=iife --global-name=meteoJS --outfile=meteojs.bundle.js --loader:.svg=text
```

## Windy API endpoints

| Purpose | URL |
|---|---|
| Tile (station locations) | `node.windy.com/pois/v2/radiosonde/tiles/{z}/{x}/{y}?pr=0&sc=0&token2=pending` |
| Station detail | `node.windy.com/pois/v2/radiosonde/{id}?pr=0&sc=0&token2=pending` |
| Ascent history | `node.windy.com/obs/measurement/v2/radiosonde/{id}/1/1?pr=0&sc=0&token2=pending` |
| Sounding download | `dl.windy.com/obs/measurement/v2/radiosonde/{id}/download?time={ms}&format=fm94` |

`token2=pending` works for all public stations. Tile response: parallel arrays `id[]`, `tileX[]`, `tileY[]` (pixel offsets in 256px tile). Last feature in sounding FeatureCollection is a LineString (flight path) — filter it out when processing levels.

## lib/radiosonde.mjs + lib/radiosonde.py

Standalone library versions (no MCP dependency) for scripting use. `example.mjs` and `example.py` demonstrate usage.
