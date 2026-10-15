import { BallisticSolution, WeaponConfig } from '../types';

export const WEAPONS: WeaponConfig[] = [
  {
    id: 'm252_81mm',
    name: 'M252 81mm Mortar',
    faction: 'US Army',
    caliber: '81mm M821 HE',
    milSystem: 'NATO',
    milsPerCircle: 6400,
    minElevation: 800, // 45.0°
    maxElevation: 1511, // 85.0°
    description: 'American standard smoothbore battalion mortar. High-trajectory indirect fire from 75m to 4,500m using 0 to 4 propellant charge rings and M67 sight unit.',
    charges: [
      {
        charge: 0,
        name: '0 Rings (Charge 0)',
        minRange: 75,
        maxRange: 480,
        muzzleVelocity: 68,
        table: [
          { range: 75, elevation: 1511, tof: 12.8 },
          { range: 100, elevation: 1495, tof: 12.7 },
          { range: 125, elevation: 1472, tof: 12.6 },
          { range: 150, elevation: 1445, tof: 12.5 },
          { range: 175, elevation: 1420, tof: 12.4 },
          { range: 200, elevation: 1394, tof: 12.3 },
          { range: 225, elevation: 1367, tof: 12.1 },
          { range: 250, elevation: 1338, tof: 12.0 },
          { range: 275, elevation: 1309, tof: 11.8 },
          { range: 300, elevation: 1278, tof: 11.6 },
          { range: 325, elevation: 1245, tof: 11.4 },
          { range: 350, elevation: 1209, tof: 11.1 },
          { range: 375, elevation: 1169, tof: 10.8 },
          { range: 400, elevation: 1125, tof: 10.4 },
          { range: 425, elevation: 1072, tof: 10.0 },
          { range: 450, elevation: 1004, tof: 9.4 },
          { range: 465, elevation: 938, tof: 8.8 },
          { range: 480, elevation: 800, tof: 7.9 },
        ],
      },
      {
        charge: 1,
        name: '1 Ring (Charge 1)',
        minRange: 200,
        maxRange: 1080,
        muzzleVelocity: 105,
        table: [
          { range: 200, elevation: 1505, tof: 20.2 },
          { range: 250, elevation: 1482, tof: 20.1 },
          { range: 300, elevation: 1456, tof: 19.9 },
          { range: 350, elevation: 1432, tof: 19.7 },
          { range: 400, elevation: 1406, tof: 19.5 },
          { range: 450, elevation: 1380, tof: 19.3 },
          { range: 500, elevation: 1353, tof: 19.0 },
          { range: 550, elevation: 1324, tof: 18.7 },
          { range: 600, elevation: 1294, tof: 18.3 },
          { range: 650, elevation: 1263, tof: 17.9 },
          { range: 700, elevation: 1230, tof: 17.5 },
          { range: 750, elevation: 1195, tof: 17.0 },
          { range: 800, elevation: 1156, tof: 16.5 },
          { range: 850, elevation: 1113, tof: 15.8 },
          { range: 900, elevation: 1065, tof: 15.1 },
          { range: 950, elevation: 1008, tof: 14.3 },
          { range: 1000, elevation: 932, tof: 13.3 },
          { range: 1040, elevation: 875, tof: 12.3 },
          { range: 1080, elevation: 800, tof: 11.1 },
        ],
      },
      {
        charge: 2,
        name: '2 Rings (Charge 2)',
        minRange: 400,
        maxRange: 2050,
        muzzleVelocity: 145,
        table: [
          { range: 400, elevation: 1500, tof: 27.8 },
          { range: 500, elevation: 1476, tof: 27.6 },
          { range: 600, elevation: 1449, tof: 27.3 },
          { range: 700, elevation: 1423, tof: 27.0 },
          { range: 800, elevation: 1396, tof: 26.7 },
          { range: 900, elevation: 1368, tof: 26.3 },
          { range: 1000, elevation: 1339, tof: 25.9 },
          { range: 1100, elevation: 1309, tof: 25.4 },
          { range: 1200, elevation: 1278, tof: 24.9 },
          { range: 1300, elevation: 1244, tof: 24.3 },
          { range: 1400, elevation: 1209, tof: 23.7 },
          { range: 1500, elevation: 1171, tof: 22.9 },
          { range: 1600, elevation: 1129, tof: 22.0 },
          { range: 1700, elevation: 1082, tof: 21.0 },
          { range: 1800, elevation: 1026, tof: 19.9 },
          { range: 1900, elevation: 955, tof: 18.4 },
          { range: 2000, elevation: 859, tof: 16.4 },
          { range: 2050, elevation: 800, tof: 14.9 },
        ],
      },
      {
        charge: 3,
        name: '3 Rings (Charge 3)',
        minRange: 650,
        maxRange: 3200,
        muzzleVelocity: 182,
        table: [
          { range: 650, elevation: 1495, tof: 34.8 },
          { range: 800, elevation: 1472, tof: 34.5 },
          { range: 1000, elevation: 1438, tof: 34.1 },
          { range: 1200, elevation: 1405, tof: 33.6 },
          { range: 1400, elevation: 1369, tof: 33.0 },
          { range: 1600, elevation: 1333, tof: 32.2 },
          { range: 1800, elevation: 1294, tof: 31.4 },
          { range: 2000, elevation: 1253, tof: 30.5 },
          { range: 2200, elevation: 1209, tof: 29.4 },
          { range: 2400, elevation: 1160, tof: 28.1 },
          { range: 2600, elevation: 1104, tof: 26.7 },
          { range: 2800, elevation: 1036, tof: 25.0 },
          { range: 3000, elevation: 942, tof: 22.6 },
          { range: 3100, elevation: 878, tof: 20.8 },
          { range: 3200, elevation: 800, tof: 18.6 },
        ],
      },
      {
        charge: 4,
        name: '4 Rings (Charge 4)',
        minRange: 950,
        maxRange: 4500,
        muzzleVelocity: 220,
        table: [
          { range: 950, elevation: 1492, tof: 42.0 },
          { range: 1150, elevation: 1468, tof: 41.6 },
          { range: 1400, elevation: 1436, tof: 41.1 },
          { range: 1650, elevation: 1405, tof: 40.5 },
          { range: 1900, elevation: 1372, tof: 39.9 },
          { range: 2150, elevation: 1338, tof: 39.1 },
          { range: 2400, elevation: 1301, tof: 38.2 },
          { range: 2650, elevation: 1263, tof: 37.2 },
          { range: 2900, elevation: 1221, tof: 36.0 },
          { range: 3150, elevation: 1176, tof: 34.6 },
          { range: 3400, elevation: 1125, tof: 33.0 },
          { range: 3650, elevation: 1068, tof: 31.1 },
          { range: 3900, elevation: 999, tof: 28.8 },
          { range: 4100, elevation: 932, tof: 26.5 },
          { range: 4300, elevation: 852, tof: 23.8 },
          { range: 4400, elevation: 805, tof: 22.0 },
          { range: 4500, elevation: 800, tof: 21.6 },
        ],
      },
    ],
  },
  {
    id: '2b14_82mm',
    name: '2B14 Podnos 82mm Mortar',
    faction: 'Soviet Army',
    caliber: '82mm O-832DU HE',
    milSystem: 'SOVIET',
    milsPerCircle: 6000,
    minElevation: 750, // 45.0° (07-50)
    maxElevation: 1417, // 85.0° (14-17)
    description: 'Soviet/Russian light battalion mortar. High trajectory fire from 80m to 4,250m using 0 to 4 additional ring charges and 60-00 Warsaw Pact sight graduations.',
    charges: [
      {
        charge: 0,
        name: '0 Rings (Charge 0)',
        minRange: 80,
        maxRange: 470,
        muzzleVelocity: 70,
        table: [
          { range: 80, elevation: 1417, tof: 12.2 },
          { range: 100, elevation: 1397, tof: 12.1 },
          { range: 125, elevation: 1371, tof: 12.0 },
          { range: 150, elevation: 1343, tof: 11.8 },
          { range: 175, elevation: 1316, tof: 11.6 },
          { range: 200, elevation: 1288, tof: 11.4 },
          { range: 225, elevation: 1259, tof: 11.2 },
          { range: 250, elevation: 1228, tof: 11.0 },
          { range: 275, elevation: 1196, tof: 10.7 },
          { range: 300, elevation: 1163, tof: 10.4 },
          { range: 325, elevation: 1127, tof: 10.1 },
          { range: 350, elevation: 1088, tof: 9.8 },
          { range: 375, elevation: 1046, tof: 9.4 },
          { range: 400, elevation: 997, tof: 8.9 },
          { range: 425, elevation: 938, tof: 8.3 },
          { range: 450, elevation: 858, tof: 7.6 },
          { range: 460, elevation: 810, tof: 7.2 },
          { range: 470, elevation: 750, tof: 6.8 },
        ],
      },
      {
        charge: 1,
        name: '1 Ring (Charge 1)',
        minRange: 220,
        maxRange: 1150,
        muzzleVelocity: 110,
        table: [
          { range: 220, elevation: 1408, tof: 19.4 },
          { range: 260, elevation: 1391, tof: 19.3 },
          { range: 300, elevation: 1373, tof: 19.1 },
          { range: 350, elevation: 1351, tof: 18.9 },
          { range: 400, elevation: 1328, tof: 18.7 },
          { range: 450, elevation: 1305, tof: 18.5 },
          { range: 500, elevation: 1280, tof: 18.2 },
          { range: 550, elevation: 1255, tof: 17.9 },
          { range: 600, elevation: 1228, tof: 17.5 },
          { range: 650, elevation: 1201, tof: 17.2 },
          { range: 700, elevation: 1172, tof: 16.8 },
          { range: 750, elevation: 1141, tof: 16.4 },
          { range: 800, elevation: 1107, tof: 15.9 },
          { range: 850, elevation: 1071, tof: 15.3 },
          { range: 900, elevation: 1030, tof: 14.7 },
          { range: 950, elevation: 983, tof: 14.0 },
          { range: 1000, elevation: 928, tof: 13.1 },
          { range: 1050, elevation: 860, tof: 12.1 },
          { range: 1100, elevation: 800, tof: 11.2 },
          { range: 1150, elevation: 750, tof: 10.2 },
        ],
      },
      {
        charge: 2,
        name: '2 Rings (Charge 2)',
        minRange: 420,
        maxRange: 2100,
        muzzleVelocity: 150,
        table: [
          { range: 420, elevation: 1403, tof: 26.8 },
          { range: 500, elevation: 1383, tof: 26.6 },
          { range: 600, elevation: 1360, tof: 26.4 },
          { range: 700, elevation: 1336, tof: 26.1 },
          { range: 800, elevation: 1310, tof: 25.8 },
          { range: 900, elevation: 1284, tof: 25.4 },
          { range: 1000, elevation: 1257, tof: 25.0 },
          { range: 1100, elevation: 1229, tof: 24.5 },
          { range: 1200, elevation: 1200, tof: 24.0 },
          { range: 1300, elevation: 1169, tof: 23.4 },
          { range: 1400, elevation: 1137, tof: 22.8 },
          { range: 1500, elevation: 1102, tof: 22.0 },
          { range: 1600, elevation: 1063, tof: 21.2 },
          { range: 1700, elevation: 1021, tof: 20.2 },
          { range: 1800, elevation: 973, tof: 19.1 },
          { range: 1900, elevation: 914, tof: 17.7 },
          { range: 2000, elevation: 835, tof: 15.9 },
          { range: 2050, elevation: 790, tof: 14.8 },
          { range: 2100, elevation: 750, tof: 14.0 },
        ],
      },
      {
        charge: 3,
        name: '3 Rings (Charge 3)',
        minRange: 650,
        maxRange: 3100,
        muzzleVelocity: 185,
        table: [
          { range: 650, elevation: 1398, tof: 33.8 },
          { range: 800, elevation: 1378, tof: 33.5 },
          { range: 1000, elevation: 1342, tof: 33.1 },
          { range: 1200, elevation: 1309, tof: 32.6 },
          { range: 1400, elevation: 1273, tof: 32.0 },
          { range: 1600, elevation: 1236, tof: 31.3 },
          { range: 1800, elevation: 1197, tof: 30.4 },
          { range: 2000, elevation: 1156, tof: 29.4 },
          { range: 2200, elevation: 1113, tof: 28.3 },
          { range: 2400, elevation: 1064, tof: 27.0 },
          { range: 2600, elevation: 1008, tof: 25.5 },
          { range: 2800, elevation: 938, tof: 23.6 },
          { range: 2950, elevation: 858, tof: 21.4 },
          { range: 3050, elevation: 795, tof: 19.5 },
          { range: 3100, elevation: 750, tof: 18.2 },
        ],
      },
      {
        charge: 4,
        name: '4 Rings (Charge 4)',
        minRange: 950,
        maxRange: 4250,
        muzzleVelocity: 215,
        table: [
          { range: 950, elevation: 1392, tof: 40.5 },
          { range: 1150, elevation: 1371, tof: 40.1 },
          { range: 1400, elevation: 1337, tof: 39.6 },
          { range: 1650, elevation: 1306, tof: 39.0 },
          { range: 1900, elevation: 1272, tof: 38.3 },
          { range: 2150, elevation: 1237, tof: 37.5 },
          { range: 2400, elevation: 1200, tof: 36.5 },
          { range: 2650, elevation: 1162, tof: 35.4 },
          { range: 2900, elevation: 1120, tof: 34.1 },
          { range: 3150, elevation: 1075, tof: 32.7 },
          { range: 3400, elevation: 1023, tof: 31.0 },
          { range: 3600, elevation: 977, tof: 29.4 },
          { range: 3800, elevation: 923, tof: 27.5 },
          { range: 4000, elevation: 852, tof: 25.1 },
          { range: 4100, elevation: 810, tof: 23.4 },
          { range: 4200, elevation: 770, tof: 21.6 },
          { range: 4250, elevation: 750, tof: 20.5 },
        ],
      },
    ],
  },
  {
    id: 'spg9_73mm',
    name: 'SPG-9 Kopye 73mm Recoilless Rifle',
    faction: 'Soviet Army',
    caliber: '73mm PG-9V / OG-9V',
    milSystem: 'SOVIET',
    milsPerCircle: 6000,
    minElevation: 0,
    maxElevation: 400,
    description: 'Smoothbore tripod recoilless gun. High muzzle velocity direct fire against armor & fortified positions up to 1,300m.',
    charges: [
      {
        charge: 0,
        name: 'Direct Heat',
        minRange: 100,
        maxRange: 1300,
        muzzleVelocity: 435,
        table: [
          { range: 200, elevation: 6, tof: 0.35 },
          { range: 400, elevation: 15, tof: 0.72 },
          { range: 600, elevation: 28, tof: 1.15 },
          { range: 800, elevation: 46, tof: 1.62 },
          { range: 1000, elevation: 70, tof: 2.15 },
          { range: 1200, elevation: 102, tof: 2.76 },
          { range: 1300, elevation: 120, tof: 3.10 },
        ],
      },
    ],
  },
];

export function calculateFiringSolution(
  weapon: WeaponConfig,
  gunPos: { x: number; z: number; alt: number },
  targetPos: { x: number; z: number; alt: number },
  preferredCharge?: number
): BallisticSolution {
  const dx = targetPos.x - gunPos.x;
  const dz = targetPos.z - gunPos.z;
  const dH = targetPos.alt - gunPos.alt;

  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
  const slantDistance = Math.sqrt(horizontalDistance * horizontalDistance + dH * dH);

  // Azimuth calculation
  // In Arma Reforger: Z is North (0°), X is East (90°)
  let angleRad = Math.atan2(dx, dz);
  if (angleRad < 0) {
    angleRad += 2 * Math.PI;
  }
  const azimuthDeg = (angleRad * 180) / Math.PI;
  const azimuthMils = (angleRad / (2 * Math.PI)) * weapon.milsPerCircle;

  // Determine automatic optimal charge ring (0..4)
  let recommendedCharge = 0;
  const suitableCharges = weapon.charges
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => horizontalDistance >= c.minRange && horizontalDistance <= c.maxRange);

  if (suitableCharges.length > 0) {
    // If the lowest charge is on the extreme upper edge (> 96% of maxRange)
    // and the next charge covers it with comfortable elevation headroom, pick the next charge
    if (
      suitableCharges.length > 1 &&
      horizontalDistance > suitableCharges[0].c.maxRange * 0.96 &&
      horizontalDistance >= suitableCharges[1].c.minRange + 30
    ) {
      recommendedCharge = suitableCharges[1].i;
    } else {
      recommendedCharge = suitableCharges[0].i;
    }
  } else {
    // Target outside all charge bounds - select closest boundary
    if (horizontalDistance < weapon.charges[0].minRange) {
      recommendedCharge = 0;
    } else {
      recommendedCharge = weapon.charges.length - 1;
    }
  }

  // Active charge selection: use preferred if explicitly passed, otherwise use recommended
  let activeChargeIdx = recommendedCharge;
  if (preferredCharge !== undefined && preferredCharge >= 0 && weapon.charges[preferredCharge]) {
    activeChargeIdx = preferredCharge;
  }

  const selectedChargeObj = weapon.charges[activeChargeIdx] || weapon.charges[0];
  const table = selectedChargeObj.table;
  const inRange = horizontalDistance >= selectedChargeObj.minRange && horizontalDistance <= selectedChargeObj.maxRange;

  let elevationMils: number | null = null;
  let elevationDeg: number | null = null;
  let timeOfFlight: number | null = null;
  let warning: string | undefined;

  if (!inRange) {
    if (horizontalDistance < selectedChargeObj.minRange) {
      warning = `Target under min range (${Math.round(selectedChargeObj.minRange)}m) for Ring ${activeChargeIdx}`;
    } else {
      warning = `Target beyond max range (${Math.round(selectedChargeObj.maxRange)}m) for Ring ${activeChargeIdx}`;
    }
  }

  // High-precision linear interpolation across calibrated firing table
  if (table.length >= 2) {
    let lower = table[0];
    let upper = table[table.length - 1];

    for (let i = 0; i < table.length - 1; i++) {
      if (horizontalDistance >= table[i].range && horizontalDistance <= table[i + 1].range) {
        lower = table[i];
        upper = table[i + 1];
        break;
      }
    }

    const t = upper.range === lower.range ? 0 : (horizontalDistance - lower.range) / (upper.range - lower.range);
    const baseElevMils = lower.elevation + t * (upper.elevation - lower.elevation);
    const baseTof = lower.tof + t * (upper.tof - lower.tof);

    // Height difference correction for mortar high-angle fire
    // When target is higher than gun (dH > 0), tube angle must be depressed slightly (lower mils)
    // When target is lower than gun (dH < 0), tube angle is elevated slightly (higher mils)
    const radToMils = weapon.milsPerCircle / (2 * Math.PI);
    const slopeCorrectionMils = horizontalDistance > 0 ? (Math.atan(dH / horizontalDistance) * radToMils) : 0;

    const correctedElevMils = weapon.id.includes('spg9') 
      ? baseElevMils + slopeCorrectionMils 
      : baseElevMils - slopeCorrectionMils * 0.95;

    // Check tube angle physical limits
    if (correctedElevMils > weapon.maxElevation) {
      warning = `Tube elevation exceeds physical limit (${Math.round(correctedElevMils)} mils > ${weapon.maxElevation} mils)`;
    } else if (correctedElevMils < weapon.minElevation) {
      warning = `Tube elevation below physical limit (${Math.round(correctedElevMils)} mils < ${weapon.minElevation} mils)`;
    }

    // Convert mils to elevation degrees based on specific weapon milsPerCircle
    const degPerMil = 360 / weapon.milsPerCircle;
    const computedDeg = correctedElevMils * degPerMil;

    elevationMils = Math.round(correctedElevMils);
    elevationDeg = Math.round(computedDeg * 10) / 10;
    timeOfFlight = Math.round(baseTof * 10) / 10;
  }

  return {
    horizontalDistance: Math.round(horizontalDistance),
    slantDistance: Math.round(slantDistance),
    heightDifference: Math.round(dH),
    azimuthDeg: Math.round(azimuthDeg * 10) / 10,
    azimuthMils: Math.round(azimuthMils),
    charge: activeChargeIdx,
    recommendedCharge,
    elevationMils,
    elevationDeg,
    timeOfFlight,
    inRange,
    warning,
    ammoType: weapon.caliber,
  };
}

export function formatGridCoord(x: number, z: number, digits: 6 | 8 = 6): string {
  // Arma Reforger grid format:
  // 6 digits: XXX ZZZ (100m grid cell)
  // 8 digits: XXXX ZZZZ (10m grid cell)
  const padLen = digits / 2;
  const factor = digits === 6 ? 100 : 10;

  const easting = Math.floor(x / factor);
  const northing = Math.floor(z / factor);

  const eastStr = String(easting).padStart(padLen, '0').slice(-padLen);
  const northStr = String(northing).padStart(padLen, '0').slice(-padLen);

  return `${eastStr} ${northStr}`;
}
