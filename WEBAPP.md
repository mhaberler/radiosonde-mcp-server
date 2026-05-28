# Radiosonde Browser Webapp

Single-file HTML webapp for browsing radiosonde stations and viewing skew-T soundings.

## Files

- `index.html` — self-contained app (stations data inlined)
- `meteojs.bundle.js` — local IIFE bundle of meteoJS (Sounding + ThermodynamicDiagram only)
- `meteojs-entry.js` — esbuild entry point used to generate the bundle

## Usage

Open `index.html` directly in a browser (file:// works) or serve locally.

## Architecture

- **Station data**: `stations-example.json` inlined as `const STATIONS` in the HTML — no server needed
- **Geolocation**: on load, requests browser location and filters stations within 300 km sorted by distance; falls back to full list if denied
- **Ascent history**: fetches from `node.windy.com/obs/measurement/v2/radiosonde/{id}/1/1` (~14 days)
- **Sounding**: fetches GeoJSON FeatureCollection from `dl.windy.com/obs/measurement/v2/radiosonde/{id}/download?time={ms}&format=fm94`
- **Diagram**: meteoJS `ThermodynamicDiagram` (skew-T log-P) with wind speed profile and hodograph

## meteoJS bundling

meteoJS is ESM-only with bare specifiers — cannot be loaded directly from CDN in a plain `<script>` tag. Bundle is generated with esbuild:

```sh
npm install meteojs regenerator-runtime
npx esbuild meteojs-entry.js --bundle --format=iife --global-name=meteoJS --outfile=meteojs.bundle.js --loader:.svg=text
```

Only `Sounding` and `ThermodynamicDiagram` are bundled (~324 KB vs 1.6 MB for full library).

## Data mapping (Windy → meteoJS)

Windy sounding Point features → `sounding.addLevel()`:

| Windy field | meteoJS field | Notes |
|---|---|---|
| `pressure` hPa | `pres` | direct |
| `temp` K | `tmpk` | direct |
| `dewpoint` K | `dwpk` | direct |
| `gpheight` m | `hght` | direct |
| `wind_u`, `wind_v` m/s | `wspd`, `wdir` | `wspd=√(u²+v²)`, `wdir=(270−atan2(v,u)·180/π)%360` |

Last feature in the FeatureCollection is a LineString (flight path) — filtered out.
