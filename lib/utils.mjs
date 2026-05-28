import { homedir } from 'os';
import { join } from 'path';

export const BASE_NODE = 'https://node.windy.com/pois/v2/radiosonde';
export const BASE_DL = 'https://dl.windy.com/obs/measurement/v2/radiosonde';
export const BASE_OBS = 'https://node.windy.com/obs/measurement/v2/radiosonde';
export const TILE_SIZE = 256;
export const CACHE_DIR = join(homedir(), '.cache', 'windy-radiosonde');
export const CACHE_PATH = join(CACHE_DIR, 'stations.json');

export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function latLonToTile(lat, lon, z) {
  const n = Math.pow(2, z);
  const x = Math.floor((lon + 180) / 360 * n);
  const latR = lat * Math.PI / 180;
  const y = Math.floor((1 - Math.log(Math.tan(latR) + 1 / Math.cos(latR)) / Math.PI) / 2 * n);
  return [x, y];
}

export function tilePixelToLatLon(zoom, tileCol, tileRow, pixX, pixY) {
  const n = Math.pow(2, zoom);
  const lon = ((tileCol + pixX / TILE_SIZE) / n) * 360 - 180;
  const latR = Math.atan(Math.sinh(Math.PI * (1 - 2 * (tileRow + pixY / TILE_SIZE) / n)));
  return { lat: +(latR * 180 / Math.PI).toFixed(6), lon: +lon.toFixed(6) };
}

export async function windyFetch(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} from ${url}`);
  return r.json();
}

export function getDetail(id) {
  return windyFetch(`${BASE_NODE}/${id}?pr=0&sc=0&token2=pending`);
}
