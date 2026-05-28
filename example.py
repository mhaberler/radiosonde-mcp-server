import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent))

from lib.radiosonde import find_stations, list_ascents, get_sounding

# --- find by name ---
by_name = find_stations(name='Wien')
print('by name:', [f"{s['id']}  {s['name']}" for s in by_name])

# --- find by lat/lon ---
nearby = find_stations(lat=48.2, lon=16.4, radius_km=200, limit=3)
print('\nnearby (200km):')
for s in nearby:
    print(f"  {s['distance_km']}km  {s['name']}  {s.get('icao', '')}")

# --- find by station id ---
wien = find_stations(station_id='m8C-x8rv')[0]
print(f"\nby id: {wien['name']}  {wien['lat']}  {wien['lon']}")

# --- list ascents ---
ascents = list_ascents(wien['id'])
print(f"\nascents ({len(ascents)} total, showing last 3):")
for a in ascents[:3]:
    print(f"  {a['time_utc']}  {a['format']}")

# --- latest sounding ---
fc = get_sounding(wien['id'])
levels = [f for f in fc['features'] if f['geometry']['type'] == 'Point']
print(f"\nsounding: {len(levels)} levels")
p = levels[0]['properties']
print(f"  surface  {p['pressure']} hPa  {p['temp'] - 273.15:.1f}°C  {p['dewpoint'] - 273.15:.1f}°C dew")
mid = levels[len(levels) // 2]['properties']
print(f"  mid      {mid['pressure']} hPa  {mid['temp'] - 273.15:.1f}°C")
