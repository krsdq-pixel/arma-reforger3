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
  shortName?: string;
  faction: 'US Army' | 'Soviet Army' | 'FIA';
  caliber: string;
  milSystem: MilSystem;
  milsPerCircle: number; // 6400 (NATO) or 6000 (Soviet)
  minElevation: number; // mils
  maxElevation: number; // mils
  minElevationDeg?: number; // approx degrees
  maxElevationDeg?: number; // approx degrees
  verificationStatus?: string;
  sourceInfo?: string;
  angularSystemDescription?: string;
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

export interface CustomMapMarker {
  id: string;
  name: string;
  x: number;
  z: number;
  color: string;
  category: 'observation' | 'enemy' | 'friendly' | 'objective' | 'waypoint';
  notes?: string;
  createdAt: number;
}

export type WindUnit = 'm/s' | 'km/h' | 'knots' | 'mph';

export interface WeatherSettings {
  enabled: boolean;
  windSpeed: number; // Support values such as 5, 10, 15, 100 with broad configurable range
  windUnit: WindUnit;
  windDirectionDeg: number; // 0..360
  dataSource: 'manual_observation' | 'mission_briefing';
  recordedAt?: string;
  isAdvisoryOnly: boolean;
}

export interface MapOverlaySettings {
  showGrid: boolean;
  show100mGrid: boolean;
  showCapitals: boolean;
  showTowns: boolean;
  showVillages: boolean;
  showHills: boolean;
  showLandmarks: boolean;
  showGunMarker: boolean;
  showTargetMarker: boolean;
  showTrajectoryLine: boolean;
  showRangeRings: boolean;
  showCustomMarkers: boolean;
  showCoordinatesHud: boolean;
  labelSize: 'sm' | 'md' | 'lg';
  labelColor: string;
}

export interface CustomMortarConfig {
  id: string;
  name: string;
  shortName: string;
  caliber: string;
  milSystem: MilSystem;
  milsPerCircle: number;
  minElevation: number;
  maxElevation: number;
  minElevationDeg?: number;
  maxElevationDeg?: number;
  verificationStatus: string;
  sourceInfo: string;
  description: string;
  isUserDefined: boolean;
  visibleFields?: {
    azimuth: boolean;
    elevation: boolean;
    timeOfFlight: boolean;
    distance: boolean;
    deltaAlt: boolean;
    peakAlt: boolean;
    deltaHw: boolean;
    impactAngle: boolean;
  };
}

export type AppTheme = 'dark_tactical' | 'night_ops' | 'forest_slate' | 'desert_camo' | 'high_contrast';
export type LayoutPreset = 'minimal_map' | 'compact' | 'standard' | 'info_rich' | 'custom';
export type TextSize = 'sm' | 'md' | 'lg';
export type DistanceUnit = 'meters' | 'kilometers';
export type ElevationDisplayFormat = 'both' | 'degrees_first' | 'mils_first';

export interface InterfaceVisibilitySettings {
  showHeader: boolean;             // Application header and title
  showTerrainTabs: boolean;        // Map selection tabs (Everon, Arland, Kolguyev)
  showMobileTabs: boolean;         // Tactical Map and Calculator mobile tabs
  showLiveSolutionPill: boolean;   // AZ, EL, and Ring information display
  showMapTypeSelector: boolean;    // Topographic, Satellite, and Drawn map selectors
  showMarkerControls: boolean;     // Marker and target controls (Gun, Target, Marker)
  showMapTools: boolean;           // Measurement and reset tools (Ruler, Weather, Center, Fullscreen)
  showFcsButton: boolean;          // FCS Panel button
  showSettingsButton: boolean;     // Settings button on map toolbar
  showZoomControls: boolean;       // Zoom-in and zoom-out controls
  showBottomCoordinatesHud: boolean; // Bottom controls and coordinates HUD
  menuButtonPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  menuButtonSize: 'sm' | 'md' | 'lg';
}

export interface AppCustomizationSettings {
  theme: AppTheme;
  layoutPreset: LayoutPreset;
  panelWidth: number; // in pixels (340 to 560)
  panelPosition: 'right' | 'left';
  panelOpacity: number; // 80, 90, 100
  textSize: TextSize;
  iconSize: 'sm' | 'md' | 'lg';
  buttonSize: 'sm' | 'md' | 'lg';
  distanceUnit: DistanceUnit;
  decimalPrecision: number; // 0, 1, 2
  elevationDisplayFormat: ElevationDisplayFormat;
  language: 'en' | 'ar';
  fcsPanelOpen: boolean;
  weatherPanelOpen: boolean;
  rulerToolOpen: boolean;
  visibility: InterfaceVisibilitySettings;
}

export interface AppExportData {
  schemaVersion: 1;
  exportedAt: string;
  app: 'Arma Reforger FCS';
  settings: AppCustomizationSettings;
  overlaySettings: MapOverlaySettings;
  weatherSettings: WeatherSettings;
  customMarkers: CustomMapMarker[];
  customMortars: CustomMortarConfig[];
}
