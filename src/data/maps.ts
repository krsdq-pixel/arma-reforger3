import { TerrainConfig, TerrainId } from '../types';

export const TERRAINS: Record<TerrainId, TerrainConfig> = {
  everon: {
    id: 'everon',
    name: 'Everon',
    worldSize: 12800,
    tileSize: 256,
    minZoom: 0,
    maxNativeZoom: 7,
    maxZoom: 8, // At most 1 level above maxNativeZoom (Section 2.2)
    version: 1790937841,
    defaultCenter: [6400, 6400],
    defaultWeapon: [4800, 7100], // Near Montignac
    defaultTarget: [5760, 7060], // Entre Deux
    layers: {
      topo: 'https://enfumap.com/tiles/everon/{z}/{x}/{y}.webp?v=1790937841',
      sat: 'https://enfumap.com/tiles/everon/sat/{z}/{x}/{y}.webp?v=1791307910',
      drawn: 'https://enfumap.com/tiles/everon/drawn/{z}/{x}/{y}.webp?v=1792004898',
    },
    layerZoomLimits: {
      topo: { maxNativeZoom: 7, maxZoom: 8 },
      sat: { maxNativeZoom: 7, maxZoom: 8 },
      drawn: { maxNativeZoom: 6, maxZoom: 7 },
    },
    description: '12.8 x 12.8 km Atlantic island with rolling hills, dense pine forests, 18 historic towns, and tactical choke points.',
    tileHost: 'enfumap.com (Cloudflare CDN) — Unverified license/permission',
    attribution: '© Bohemia Interactive a.s. | Enfumap',
    // Section 4: ONLY the 35 verified locations from official Enfusion Map Maker data
    pois: [
      // Tier 1: Major Towns, Capitals, and Military Bases
      { name: 'Montignac', x: 4775.641, z: 7086.945, kind: 'capital', tier: 1 },
      { name: 'St Phillipe', x: 4500.872, z: 10776.053, kind: 'capital', tier: 1 },
      { name: 'St Pierre', x: 9689.432, z: 1558.166, kind: 'town', tier: 1 },
      { name: 'Morton', x: 5137.254, z: 4009.941, kind: 'town', tier: 1 },
      { name: 'Meaux', x: 4517.52, z: 9467.668, kind: 'town', tier: 1 },
      { name: 'Provins', x: 5488.17, z: 6083.411, kind: 'town', tier: 1 },
      { name: 'Villeneuve', x: 2847.008, z: 6339.848, kind: 'town', tier: 1 },
      { name: 'Entre Deux', x: 5760.571, z: 7061.821, kind: 'town', tier: 1 },
      { name: 'Airport', x: 4893.46, z: 11800.709, kind: 'military', tier: 1 },
      { name: 'Coastal Base Chotain', x: 7444.065, z: 6697.595, kind: 'military', tier: 1 },
      { name: 'Military Base Levie', x: 7476.739, z: 4301.884, kind: 'military', tier: 1 },
      { name: 'Military Hospital', x: 3904.698, z: 8450.042, kind: 'military', tier: 1 },
      { name: 'Coastal Base Lamentin', x: 1062.89, z: 6047.846, kind: 'military', tier: 1 },
      { name: 'Coastal Base Morton', x: 4956.796, z: 3875.627, kind: 'military', tier: 1 },

      // Tier 2: Villages, Secondary Settlements, and Major Landmarks
      { name: 'Tyrone', x: 4948.837, z: 9075.68, kind: 'village', tier: 2 },
      { name: 'Gravette', x: 4128.282, z: 7792.364, kind: 'village', tier: 2 },
      { name: 'Figari', x: 5256.366, z: 5341.263, kind: 'village', tier: 2 },
      { name: 'Chotain', x: 7087.74, z: 6011.904, kind: 'village', tier: 2 },
      { name: 'Levie', x: 7456.592, z: 4737.094, kind: 'town', tier: 2 },
      { name: 'Regina', x: 7188.38, z: 2312.382, kind: 'village', tier: 2 },
      { name: 'Camurac', x: 6594.162, z: 3116.684, kind: 'village', tier: 2 },
      { name: 'Durras', x: 8826.12, z: 2746.123, kind: 'village', tier: 2 },
      { name: 'Lamentin', x: 1281.055, z: 5946.839, kind: 'town', tier: 2 },
      { name: 'Power Plant', x: 5826.642, z: 9786.735, kind: 'landmark', tier: 2 },
      { name: 'Andres Beacon', x: 6843.832, z: 8191.218, kind: 'hill', tier: 2 },
      { name: 'Chotain Industrial', x: 6455.525, z: 6487.396, kind: 'landmark', tier: 2 },
      { name: 'Quarry', x: 8786.965, z: 3913.078, kind: 'landmark', tier: 2 },
      { name: 'Sawmill', x: 3114.358, z: 5221.5, kind: 'landmark', tier: 2 },

      // Tier 3: Smaller Features, Hills, Farms, Valleys, and Woods
      { name: 'Kermovan', x: 6359.376, z: 9668.684, kind: 'village', tier: 3 },
      { name: 'Farm', x: 5009.537, z: 9964.422, kind: 'landmark', tier: 3 },
      { name: 'Gorey', x: 4844.906, z: 8088.995, kind: 'village', tier: 3 },
      { name: 'Hillside', x: 6918, z: 4450, kind: 'hill', tier: 3 },
      { name: 'Old Wood', x: 3293.234, z: 4488.741, kind: 'landmark', tier: 3 },
      { name: 'Morton Valley', x: 4517.589, z: 4967.065, kind: 'landmark', tier: 3 },
      { name: 'Laruns', x: 7429.288, z: 5318.843, kind: 'village', tier: 3 },
    ],
  },
  arland: {
    id: 'arland',
    name: 'Arland',
    worldSize: 4096,
    tileSize: 256,
    minZoom: 0,
    maxNativeZoom: 7,
    maxZoom: 8,
    version: 1790938027,
    defaultCenter: [2048, 2048],
    defaultWeapon: [2776, 1623], // Arleville area
    defaultTarget: [3166, 2800], // Beauregard area
    layers: {
      topo: 'https://enfumap.com/tiles/arland/{z}/{x}/{y}.webp?v=1790938027',
      sat: 'https://enfumap.com/tiles/arland/sat/{z}/{x}/{y}.webp?v=1791308331',
      drawn: 'https://enfumap.com/tiles/arland/drawn/{z}/{x}/{y}.webp?v=1792025896',
    },
    layerZoomLimits: {
      topo: { maxNativeZoom: 7, maxZoom: 8 },
      sat: { maxNativeZoom: 5, maxZoom: 6 }, // Sat only exists up to zoom 5
      drawn: { maxNativeZoom: 6, maxZoom: 7 }, // Drawn only exists up to zoom 6
    },
    description: '4.1 x 4.1 km strategic island featuring intense small-unit combat, Arleville harbor, Beauregard settlement, and military radar stations.',
    tileHost: 'enfumap.com (Cloudflare CDN) — Unverified license/permission',
    attribution: '© Bohemia Interactive a.s. | Enfumap',
    // Section 4.2: No verified locations dataset exists; show no labels
    pois: [],
  },
  kolguyev: {
    id: 'kolguyev',
    name: 'Kolguyev',
    worldSize: 12800,
    tileSize: 256,
    minZoom: 0,
    maxNativeZoom: 7,
    maxZoom: 8,
    version: 1790938259,
    defaultCenter: [6400, 6400],
    defaultWeapon: [5100, 4800],
    defaultTarget: [6200, 5600],
    layers: {
      topo: 'https://enfumap.com/tiles/kolguyev/{z}/{x}/{y}.webp?v=1790938259',
      sat: 'https://enfumap.com/tiles/kolguyev/sat/{z}/{x}/{y}.webp?v=1791309426',
    },
    layerZoomLimits: {
      topo: { maxNativeZoom: 7, maxZoom: 8 },
      sat: { maxNativeZoom: 7, maxZoom: 8 },
      // drawn layer does not exist for Kolguyev
    },
    description: '12.8 x 12.8 km volcanic terrain with stark granite mountains, pine forests, geothermal hot springs, and hardened Soviet installations.',
    tileHost: 'enfumap.com (Cloudflare CDN) — Unverified license/permission',
    attribution: '© Bohemia Interactive a.s. | Enfumap',
    // Section 4.2: No verified locations dataset exists; show no labels
    pois: [],
  },
};
