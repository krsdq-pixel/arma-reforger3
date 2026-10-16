export type TerrainId = 'everon' | 'arland' | 'kolguyev';

export type MapLayerType = 'topo' | 'sat' | 'drawn';

export interface TerrainPOI {
  name: string;
  x: number; // game meters easting [0..worldSize]
  z: number; // game meters northing [0..worldSize]
  kind: 'capital' | 'town' | 'village' | 'landmark' | 'military' | 'hill' | 'bay';
  elevation?: number;
  tier?: 1 | 2 | 3;
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
  layerZoomLimits?: {
    topo: { maxNativeZoom: number; maxZoom: number };
    sat?: { maxNativeZoom: number; maxZoom: number };
    drawn?: { maxNativeZoom: number; maxZoom: number };
  };
  pois: TerrainPOI[];
  description: string;
  tileHost?: string;
  attribution?: string;
}

export type MilSystem = 'NATO' | 'SOVIET';

export interface BallisticDataPoint {
  range: number;
  elevation: number;
  tof: number;
  dElevPer100m?: number; // Delta H_w (elevation change per 100m target altitude difference)
  peakAlt?: number; // Y_s (Peak Altitude in meters)
  angleImpact?: number; // Impact angle in degrees
  dispersion?: number; // meters
}

export type AmmoCategory = 'HE' | 'ILLUM' | 'SMOKE' | 'TRAINING';

export interface AmmoConfig {
  id: string;
  name: string;
  code: string;
  category: AmmoCategory;
  weightKg: number;
  description: string;
  charges: WeaponCharge[];
  isVerified?: boolean;
  verificationNote?: string;
}

export interface WeaponCharge {
  charge: number;
  name: string;
  minRange: number; // meters
  maxRange: number; // meters
  muzzleVelocity: number; // m/s
  table: BallisticDataPoint[];
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
  ammunition?: AmmoConfig[];
  description: string;
}

export interface BallisticDiagnosticInfo {
  mortarPos: { x: number; z: number; alt: number };
  targetPos: { x: number; z: number; alt: number };
  horizontalDistance: number;
  slantDistance: number;
  heightDifference: number;
  azimuthDeg: number;
  azimuthMils: number;
  mortarName: string;
  milSystem: MilSystem;
  milsPerCircle: number;
  ammoName: string;
  ammoWeightKg?: number;
  chargeRing: number;
  chargeBracket: { min: number; max: number };
  sourceTableEntry?: { range: number; elevation: number; tof: number; dElev?: number } | null;
  interpolationInputs?: {
    r1: number;
    r2: number;
    e1: number;
    e2: number;
    fraction: number;
  } | null;
  calculatedElevationMils: number | null;
  calculatedElevationDeg: number | null;
  calculatedFlightTime: number | null;
  predictedImpactPos: { x: number; z: number } | null;
  predictedImpactDistance: number | null;
  impactErrorMeters: number | null;
  tableVerificationStatus: 'VERIFIED_IN_GAME' | 'STANDARD_PROFILE' | 'UNVERIFIED';
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
  peakAlt?: number | null; // Y_s (Peak altitude in meters)
  dElevPer100m?: number | null; // Delta H_w
  angleImpact?: number | null; // Impact angle in degrees
  inRange: boolean;
  warning?: string;
  ammoType: string;
  ammoId?: string;
  ammoWeightKg?: number;
  ammoCategory?: AmmoCategory;
  predictedImpactPos?: { x: number; z: number } | null;
  predictedImpactDistance?: number | null;
  impactErrorMeters?: number | null;
  tableVerificationStatus?: 'VERIFIED_IN_GAME' | 'STANDARD_PROFILE' | 'UNVERIFIED';
  ballisticDiagnostics?: BallisticDiagnosticInfo;
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
