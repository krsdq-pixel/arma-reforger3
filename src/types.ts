export type TerrainId = 'everon' | 'arland' | 'kolguyev';

export type MapLayerType = 'topo' | 'sat' | 'drawn';

export interface TerrainPOI {
  name: string;
  x: number; // game meters easting [0..worldSize]
  z: number; // game meters northing [0..worldSize]
  kind: 'capital' | 'town' | 'village' | 'landmark' | 'military' | 'hill' | 'bay';
  elevation?: number;
}

export interface TerrainConfig {
  id: TerrainId;
  name: string;
  worldSize: number; // in meters (e.g. 12800 or 4096)
  tileSize: number;
  minZoom: number;
  maxNativeZoom: number;
  maxZoom: number;
  version: number;
  defaultCenter: [number, number]; // [x, z] in meters
  defaultWeapon: [number, number];
  defaultTarget: [number, number];
  layers: {
    topo: string;
    sat?: string;
    drawn?: string;
  };
  pois: TerrainPOI[];
  description: string;
}

export type MilSystem = 'NATO' | 'SOVIET';

export interface WeaponCharge {
  charge: number;
  name: string;
  minRange: number; // meters
  maxRange: number; // meters
  muzzleVelocity: number; // m/s
  // Table entries: range (m) -> elevation (mils), time of flight (s)
  table: Array<{
    range: number;
    elevation: number;
    tof: number;
  }>;
}

export interface WeaponConfig {
  id: string;
  name: string;
  faction: 'US Army' | 'Soviet Army' | 'FIA';
  caliber: string;
  milSystem: MilSystem;
  milsPerCircle: number; // 6400 (NATO) or 6000 (Soviet)
  minElevation: number;
  maxElevation: number;
  charges: WeaponCharge[];
  description: string;
}

export interface BallisticSolution {
  horizontalDistance: number; // meters
  slantDistance: number; // meters
  heightDifference: number; // meters (Target - Weapon)
  azimuthDeg: number; // 0..360
  azimuthMils: number; // 0..milsPerCircle
  charge: number; // active charge ring index (0..4)
  recommendedCharge: number; // automatically selected optimal charge ring
  elevationMils: number | null; // calculated elevation in mils
  elevationDeg: number | null; // calculated elevation in degrees
  timeOfFlight: number | null; // seconds
  inRange: boolean;
  warning?: string;
  ammoType: string;
}

export interface TileDiagnostics {
  terrainId: TerrainId;
  urlTemplate: string;
  currentZoom: number;
  loadedCount: number;
  failedCount: number;
  lastError: string | null;
  isReachable: boolean | null;
  pingMs: number | null;
  httpStatus: number | null;
}
