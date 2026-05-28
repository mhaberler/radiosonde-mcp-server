"""Radiosonde station and sounding fetcher — mirrors lib/radiosonde.mjs."""

from __future__ import annotations
import json
import math
import urllib.request
from pathlib import Path
from typing import Any

_CACHE_PATH = Path.home() / ".cache" / "windy-radiosonde" / "stations.json"
_SNAPSHOT_PATH = Path(__file__).parent.parent / "stations-example.json"

_BASE_OBS = "https://node.windy.com/obs/measurement/v2/radiosonde"
_BASE_DL = "https://dl.windy.com/obs/measurement/v2/radiosonde"

_stations: list[dict] | None = None


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _fetch(url: str) -> Any:
    with urllib.request.urlopen(url) as r:
        if r.status != 200:
            raise RuntimeError(f"HTTP {r.status} from {url}")
        return json.loads(r.read())


def _load_stations() -> list[dict]:
    global _stations
    if _stations is not None:
        return _stations
    for path in (_CACHE_PATH, _SNAPSHOT_PATH):
        try:
            raw = json.loads(path.read_text())
            _stations = [{"id": k, **v} for k, v in raw.items()]
            return _stations
        except OSError:
            continue
    raise RuntimeError("No station data found (cache or snapshot)")


def find_stations(
    *,
    name: str | None = None,
    station_id: str | None = None,
    lat: float | None = None,
    lon: float | None = None,
    radius_km: float = 500,
    limit: int = 10,
) -> list[dict]:
    """Find stations by name substring, station ID, or lat/lon proximity."""
    stations = _load_stations()

    if station_id is not None:
        return [s for s in stations if s["id"] == station_id]

    if name is not None:
        q = name.lower()
        scored = []
        for s in stations:
            n = (s.get("name") or "").lower()
            icao = (s.get("icao") or "").lower()
            if n == q or icao == q:
                score = 3
            elif n.startswith(q) or icao.startswith(q):
                score = 2
            elif q in n or q in icao:
                score = 1
            else:
                continue
            scored.append((score, s))
        scored.sort(key=lambda x: -x[0])
        return [s for _, s in scored[:10]]

    if lat is not None and lon is not None:
        with_dist = []
        for s in stations:
            d = round(_haversine_km(lat, lon, s["lat"], s["lon"]), 1)
            if d <= radius_km:
                with_dist.append({**s, "distance_km": d})
        with_dist.sort(key=lambda s: s["distance_km"])
        return with_dist[:limit]

    raise ValueError("provide lat+lon, station_id, or name")


def list_ascents(station_id: str) -> list[dict]:
    """Return ascents for a station (~14 days), newest first."""
    from datetime import datetime, timezone
    data = _fetch(f"{_BASE_OBS}/{station_id}/1/1?pr=0&sc=0&token2=pending")
    ascents = [
        {
            "time_ms": h["time"],
            "time_utc": datetime.fromtimestamp(h["time"] / 1000, tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
            "format": h["format"],
        }
        for h in data.get("history", [])
    ]
    ascents.sort(key=lambda a: -a["time_ms"])
    return ascents


def get_sounding(station_id: str, time_ms: int | None = None) -> dict:
    """Fetch a sounding as a GeoJSON FeatureCollection.

    If time_ms is omitted, fetches the latest available ascent.
    Point features contain: pressure, temp (K), dewpoint (K), wind_u, wind_v, gpheight.
    Last feature is a LineString (flight path).
    """
    if time_ms is None:
        ascents = list_ascents(station_id)
        if not ascents:
            raise RuntimeError(f"No ascents available for {station_id}")
        time_ms = ascents[0]["time_ms"]
    return _fetch(f"{_BASE_DL}/{station_id}/download?time={time_ms}&format=fm94")
