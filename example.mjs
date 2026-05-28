import { findStations, listAscents, getSounding } from './lib/radiosonde.mjs';

// --- find by name ---
const byName = await findStations({ name: 'Wien' });
console.log('by name:', byName.map(s => `${s.id}  ${s.name}`));

// --- find by lat/lon ---
const nearby = await findStations({ lat: 48.2, lon: 16.4, radiusKm: 200, limit: 3 });
console.log('\nnearby (200km):');
nearby.forEach(s => console.log(` ${s.distance_km}km  ${s.name}  ${s.icao ?? ''}`));

// --- find by station id ---
const [wien] = await findStations({ stationId: 'm8C-x8rv' });
console.log('\nby id:', wien.name, wien.lat, wien.lon);

// --- list ascents ---
const ascents = await listAscents(wien.id);
console.log(`\nascents (${ascents.length} total, showing last 3):`);
ascents.slice(0, 3).forEach(a => console.log(` ${a.time_utc}  ${a.format}`));

// --- latest sounding ---
const fc = await getSounding(wien.id);
const levels = fc.features.filter(f => f.geometry.type === 'Point');
console.log(`\nsounding: ${levels.length} levels`);
const s = levels[0].properties;
console.log(` surface  ${s.pressure} hPa  ${(s.temp - 273.15).toFixed(1)}°C  ${(s.dewpoint - 273.15).toFixed(1)}°C dew`);
const mid = levels[Math.floor(levels.length / 2)].properties;
console.log(` mid      ${mid.pressure} hPa  ${(mid.temp - 273.15).toFixed(1)}°C`);
