import L from 'leaflet';
import { TerrainConfig } from '../types';

/**
 * Converts Arma Reforger game coordinates (meters: x = East, z = North)
 * to Leaflet LatLng for L.CRS.Simple.
 * In L.CRS.Simple, lat maps to North/Y (z), lng maps to East/X (x).
 */
export function gameToLatLng(x: number, z: number): L.LatLng {
  return L.latLng(z, x);
}

/**
 * Converts Leaflet LatLng back to Arma Reforger game coordinates in meters.
 */
export function latLngToGame(latlng: L.LatLng): { x: number; z: number } {
  return {
    x: latlng.lng,
    z: latlng.lat,
  };
}

/**
 * Creates the exact CRS for a terrain with given worldSize and tileSize.
 */
export function createTerrainCRS(terrain: Pick<TerrainConfig, 'worldSize' | 'tileSize'>): L.CRS {
  const scaleFactor = terrain.tileSize / terrain.worldSize;
  return L.extend({}, L.CRS.Simple, {
    transformation: new L.Transformation(scaleFactor, 0, -scaleFactor, terrain.tileSize),
  });
}
