---
name: radiosonde
description: >
  Use when building a weather forecast and nearby upper-air sounding data is
  needed. Handles station discovery, ascent retrieval, and optional profile
  interpretation (cloud layers, icing, shear, CAPE, thunderstorm indicators).
  Requires radiosonde MCP server registered. Invoke: /radiosonde <location> [interpret]
---

# Radiosonde Sub-Skill

Retrieve and optionally interpret the nearest upper-air sounding for a location.

## Invocation

```
/radiosonde <location> [interpret]
```

`location` accepts:
- Place name: `Vienna` — geocode to lat/lon using your knowledge, then call `find_stations`
- Coordinates: `48.2 16.4` — pass directly to `find_stations`
- ICAO code: `LOWW` — call `find_stations`, match result where `icao` field equals the code

WMO IDs are output-only — do not use as lookup input (sparsely populated in cache).

## Tool call sequence

1. `find_stations(lat, lon, radius_km=200, limit=3)` — pick the nearest station that has a recent ascent
2. `list_ascents(station_id)` — pick the latest `time_ms`
3. `get_sounding(station_id, time_ms)` — retrieve the full profile

## Data gotchas

- The last feature in the GeoJSON FeatureCollection is a LineString (balloon flight path) — filter it out: use only features where `geometry.type === 'Point'`
- All temperatures are in **Kelvin** — always convert: `°C = K − 273.15`
- Wind components are u/v in m/s — derive: `speed = √(u²+v²)`, `dir = (270 − atan2(v,u)·180/π) % 360`
- Prefer `fm94` format (high-res BUFR, ~193 levels) over `fm35` (standard TEMP, ~50 levels)
- Standard launch times: **00Z** (midnight UTC) and **12Z** (noon UTC)

## Always output

Prose summary including:
- Station name, ICAO code, elevation (m), WMO ID if present
- Ascent time in UTC
- Number of levels
- Surface conditions: temp (°C), dewpoint (°C), pressure (hPa), wind speed (m/s) and direction (°)

## With `interpret` flag — add derived diagnostics

Compute from the Point-feature levels and report as labelled prose:

| Diagnostic | Method |
| --- | --- |
| **Cloud layers** | Layers where dewpoint depression (temp − dewpoint) < 2 K; report base and top in m and hPa |
| **Icing zones** | Cloud layers (as above) where temp is between 273 K (0°C) and 253 K (−20°C) |
| **Freezing level** | Height (m AMSL) and pressure (hPa) where temp first crosses 273.15 K |
| **Tropopause** | Height and temp where environmental lapse rate flattens or inverts; look for sustained near-isothermal or inverted layer above ~8 km |
| **Speed shear** | Max wind magnitude change between adjacent layers; report layer bounds and value (m/s per km) |
| **Directional shear** | Max wind direction change between adjacent layers; report backing (anticyclonic) or veering (cyclonic) and magnitude (°/km) |
| **Bulk 0–6 km shear** | Vector difference between wind at surface and ~6 km AGL; magnitude in m/s — >18 m/s: thunderstorm-supportive, >25 m/s: supercell/hail risk |
| **CAPE proxy** | Lift a surface parcel dry-adiabatically to LCL, then moist-adiabatically; integrate positive area (parcel temp > environment temp); report J/kg |
| **LI (Lifted Index)** | Lifted parcel temp minus environment temp at 500 hPa; negative = unstable, < −4 = severe convection risk |
| **Jet core** | Level of maximum wind speed; report height (m), pressure (hPa), speed (m/s), direction (°) |

Report each diagnostic even if benign (e.g. "No icing layers detected", "Freezing level: 2840 m / 725 hPa").
