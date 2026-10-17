import { describe, it, expect } from 'vitest';
import {
  interpolateBallistics,
  calculateAltitudeCorrection,
  findValidCharges,
  getRequiredChargeWarning,
  solveMortarFireMission,
  calculateSolutionByAmmo,
} from './ballisticsCalculator';
import {
  M252_M821_HE_CHARGE_0,
  M252_M821_HE_CHARGE_1,
  M252_M821_HE_CHARGE_2,
  M252_M821_HE_CHARGE_3,
  M252_M821_HE_CHARGE_4,
  PODNOS_O832DU_HE_CHARGE_0,
  PODNOS_O832DU_HE_CHARGE_1,
  PODNOS_O832DU_HE_CHARGE_2,
  PODNOS_O832DU_HE_CHARGE_3,
  PODNOS_O832DU_HE_CHARGE_4,
  M252_AMMUNITION,
  PODNOS_AMMUNITION,
  WEAPONS,
} from '../data/ballistics';

describe('Mortar Ballistic Engine - Dynamic Charges & Brackets Validation', () => {
  const m252Weapon = WEAPONS.find((w) => w.id === 'm252_81mm')!;
  const podnosWeapon = WEAPONS.find((w) => w.id === '2b14_82mm')!;

  describe('1. Distinct Ballistic Tables per Charge Ring', () => {
    it('verifies US M252 distinct tables across all 5 rings (R0 to R4)', () => {
      expect(m252Weapon.charges.length).toBe(5);

      // Ring 0: 50m - 500m
      expect(m252Weapon.charges[0].minRange).toBe(50);
      expect(m252Weapon.charges[0].maxRange).toBe(500);
      expect(m252Weapon.charges[0].table[0].range).toBe(50);
      expect(m252Weapon.charges[0].table[m252Weapon.charges[0].table.length - 1].range).toBe(500);

      // Ring 1: 100m - 800m
      expect(m252Weapon.charges[1].minRange).toBe(100);
      expect(m252Weapon.charges[1].maxRange).toBe(800);

      // Ring 2: 200m - 1400m
      expect(m252Weapon.charges[2].minRange).toBe(200);
      expect(m252Weapon.charges[2].maxRange).toBe(1400);

      // Ring 3: 300m - 2000m
      expect(m252Weapon.charges[3].minRange).toBe(300);
      expect(m252Weapon.charges[3].maxRange).toBe(2000);

      // Ring 4: 400m - 2900m
      expect(m252Weapon.charges[4].minRange).toBe(400);
      expect(m252Weapon.charges[4].maxRange).toBe(2900);
      expect(m252Weapon.charges[4].table[0].elevation).toBe(1415);
      expect(m252Weapon.charges[4].table[m252Weapon.charges[4].table.length - 1].elevation).toBe(750);
    });

    it('verifies Soviet 2B14 Podnos distinct tables across all 5 rings (R0 to R4)', () => {
      expect(podnosWeapon.charges.length).toBe(5);

      // Ring 0: 50m - 500m
      expect(podnosWeapon.charges[0].minRange).toBe(50);
      expect(podnosWeapon.charges[0].maxRange).toBe(500);

      // Ring 1: 100m - 800m
      expect(podnosWeapon.charges[1].minRange).toBe(100);
      expect(podnosWeapon.charges[1].maxRange).toBe(800);

      // Ring 2: 200m - 1400m
      expect(podnosWeapon.charges[2].minRange).toBe(200);
      expect(podnosWeapon.charges[2].maxRange).toBe(1400);

      // Ring 3: 300m - 1800m
      expect(podnosWeapon.charges[3].minRange).toBe(300);
      expect(podnosWeapon.charges[3].maxRange).toBe(1800);

      // Ring 4: 400m - 2300m
      expect(podnosWeapon.charges[4].minRange).toBe(400);
      expect(podnosWeapon.charges[4].maxRange).toBe(2300);
      expect(podnosWeapon.charges[4].table[0].elevation).toBe(1410);
      expect(podnosWeapon.charges[4].table[podnosWeapon.charges[4].table.length - 1].elevation).toBe(750);
    });
  });

  describe('2. Dynamic Table Selection by Ring & Range Warnings', () => {
    it('correctly maps target distance to valid charge rings', () => {
      // 1500m on M252 is covered by Ring 3 (300-2000m) and Ring 4 (400-2900m)
      const valid1500 = findValidCharges(m252Weapon, 1500);
      expect(valid1500.map((c) => c.charge)).toEqual([3, 4]);

      // 600m on M252 is covered by Rings 1, 2, 3, 4
      const valid600 = findValidCharges(m252Weapon, 600);
      expect(valid600.map((c) => c.charge)).toEqual([1, 2, 3, 4]);

      // 2500m on M252 is only covered by Ring 4
      const valid2500 = findValidCharges(m252Weapon, 2500);
      expect(valid2500.map((c) => c.charge)).toEqual([4]);
    });

    it('generates explicit "Range requires Ring X" warning on manual ring mismatch', () => {
      // If user selected Ring 1 (max 800m) but target is at 1500m
      const warning1500 = getRequiredChargeWarning(m252Weapon, 1, 1500);
      expect(warning1500).toBe('Range requires Ring 3 or Ring 4');

      // If user selected Ring 1 (max 800m) but target is at 2500m
      const warning2500 = getRequiredChargeWarning(m252Weapon, 1, 2500);
      expect(warning2500).toBe('Range requires Ring 4');

      // If user selected Ring 4 (min 400m) but target is at 75m
      const warning75 = getRequiredChargeWarning(m252Weapon, 4, 75);
      expect(warning75).toBe('Range requires Ring 0');

      // In-range selected ring has no warning
      const warningValid = getRequiredChargeWarning(m252Weapon, 3, 1500);
      expect(warningValid).toBeUndefined();
    });

    it('auto-selects valid optimal charge in AUTO mode (preferredCharge = -1)', () => {
      const sol = solveMortarFireMission({
        weapon: m252Weapon,
        gunPos: { x: 1000, z: 1000, alt: 0 },
        targetPos: { x: 1000, z: 2500, alt: 0 }, // 1500m
        preferredCharge: -1,
      });

      expect(sol.charge).toBe(3); // Ring 3 is optimal for 1500m
      expect(sol.inRange).toBe(true);
      expect(sol.warning).toBeUndefined();
    });
  });

  describe('3. Precise Altitude Correction (Delta Hw)', () => {
    it('applies altitude correction formula for elevated targets (hill)', () => {
      // Base at 1000m on Ring 4: Base Elev = 1295 mils, dElevPer100m = 34.8
      // Target Alt = 100m, Gun Alt = 0m -> Delta Alt = +100m
      // Final Elev = 1295 + (100 / 100 * -34.8) = 1260.2 -> 1260 mils
      const sol = solveMortarFireMission({
        weapon: m252Weapon,
        gunPos: { x: 0, z: 0, alt: 0 },
        targetPos: { x: 0, z: 1000, alt: 100 },
        preferredCharge: 4,
      });

      expect(sol.horizontalDistance).toBe(1000);
      expect(sol.heightDifference).toBe(100);
      expect(sol.elevationMils).toBe(1260);
      expect(sol.inRange).toBe(true);
    });

    it('applies altitude correction formula for depressed targets (valley)', () => {
      // Base at 1000m on Ring 4: Base Elev = 1295 mils, dElevPer100m = 34.8
      // Target Alt = 0m, Gun Alt = 100m -> Delta Alt = -100m
      // Final Elev = 1295 + (-100 / 100 * -34.8) = 1329.8 -> 1330 mils
      const sol = solveMortarFireMission({
        weapon: m252Weapon,
        gunPos: { x: 0, z: 0, alt: 100 },
        targetPos: { x: 0, z: 1000, alt: 0 },
        preferredCharge: 4,
      });

      expect(sol.horizontalDistance).toBe(1000);
      expect(sol.heightDifference).toBe(-100);
      expect(sol.elevationMils).toBe(1330);
      expect(sol.inRange).toBe(true);
    });
  });

  describe('4. Azimuth & Euclidean Planar Distance Accuracy', () => {
    it('calculates exact 3-4-5 triangle Euclidean distance (1 unit = 1 meter)', () => {
      const sol = solveMortarFireMission({
        weapon: m252Weapon,
        gunPos: { x: 1000, z: 1000, alt: 0 },
        targetPos: { x: 1300, z: 1400, alt: 0 }, // dx=300, dz=400 -> dist=500m
        preferredCharge: 1,
      });

      expect(sol.horizontalDistance).toBe(500);
      expect(sol.slantDistance).toBe(500);
    });

    it('normalizes NATO Azimuth to 6400 mils and Soviet Azimuth to 6000 mils', () => {
      // Due East: dx = 1000, dz = 0 -> angle = 90 deg
      // NATO 90 deg = 90 * 6400 / 360 = 1600 mils
      // Soviet 90 deg = 90 * 6000 / 360 = 1500 mils
      const solNato = solveMortarFireMission({
        weapon: m252Weapon,
        gunPos: { x: 0, z: 0, alt: 0 },
        targetPos: { x: 1000, z: 0, alt: 0 },
      });
      expect(solNato.azimuthDeg).toBe(90.0);
      expect(solNato.azimuthMils).toBe(1600);

      const solSoviet = solveMortarFireMission({
        weapon: podnosWeapon,
        gunPos: { x: 0, z: 0, alt: 0 },
        targetPos: { x: 1000, z: 0, alt: 0 },
      });
      expect(solSoviet.azimuthDeg).toBe(90.0);
      expect(solSoviet.azimuthMils).toBe(1500);

      // Due South: dx = 0, dz = -1000 -> angle = 180 deg
      // NATO 180 deg = 3200 mils, Soviet 180 deg = 3000 mils
      const solSouth = solveMortarFireMission({
        weapon: m252Weapon,
        gunPos: { x: 0, z: 0, alt: 0 },
        targetPos: { x: 0, z: -1000, alt: 0 },
      });
      expect(solSouth.azimuthDeg).toBe(180.0);
      expect(solSouth.azimuthMils).toBe(3200);
    });
  });

  describe('5. Intermediate Linear Interpolation & Boundary Guard', () => {
    it('accurately interpolates intermediate fractional ranges (e.g., 946m and 1450m)', () => {
      // Ring 4 (Charge 4) on M252
      const charge4Table = m252Weapon.charges[4].table;

      // 1450m falls between 1400m (elev 1202) and 1600m (elev 1152)
      const interp1450 = interpolateBallistics(charge4Table, 1450);
      expect(interp1450).not.toBeNull();
      // t = (1450 - 1400) / 200 = 0.25
      // elev = 1202 + (1152 - 1202) * 0.25 = 1189.5
      expect(interp1450!.elevation).toBeCloseTo(1189.5, 2);
      expect(interp1450!.isExact).toBe(false);

      // 946m falls between 800m and 1000m
      const interp946 = interpolateBallistics(charge4Table, 946);
      expect(interp946).not.toBeNull();
      expect(interp946!.elevation).toBeLessThan(1338);
      expect(interp946!.elevation).toBeGreaterThan(1295);
      expect(interp946!.isExact).toBe(false);
    });

    it('returns null and triggers explicit warning for out-of-bounds target ranges', () => {
      const charge4Table = m252Weapon.charges[4].table;

      // Below minRange (400m)
      expect(interpolateBallistics(charge4Table, 350)).toBeNull();

      // Above maxRange (2900m)
      expect(interpolateBallistics(charge4Table, 3050)).toBeNull();

      // Fire mission returns inRange: false and tactical warning
      const solUnder = solveMortarFireMission({
        weapon: m252Weapon,
        gunPos: { x: 0, z: 0, alt: 0 },
        targetPos: { x: 0, z: 30, alt: 0 }, // 30m is below global min (50m)
      });
      expect(solUnder.inRange).toBe(false);
      expect(solUnder.warning).toMatch(/below minimum range/i);

      const solOver = solveMortarFireMission({
        weapon: m252Weapon,
        gunPos: { x: 0, z: 0, alt: 0 },
        targetPos: { x: 0, z: 3500, alt: 0 }, // 3500m is above global max (2900m)
      });
      expect(solOver.inRange).toBe(false);
      expect(solOver.warning).toMatch(/exceeds maximum range/i);
    });
  });

  describe('6. Comprehensive Ammunition Registry & Multi-Ammo Calculation', () => {
    it('verifies US M252 has 4 distinct ammunition types with authentic in-game weights', () => {
      expect(m252Weapon.ammunition).toBeDefined();
      expect(m252Weapon.ammunition!.length).toBe(4);

      const [he, illum, smoke, training] = m252Weapon.ammunition!;

      // 1. M821 HE: 4.06 kg
      expect(he.id).toBe('M821_HE');
      expect(he.category).toBe('HE');
      expect(he.weightKg).toBe(4.06);

      // 2. M853A1 ILLUM: 4.00 kg
      expect(illum.id).toBe('M853A1_ILLUM');
      expect(illum.category).toBe('ILLUM');
      expect(illum.weightKg).toBe(4.0);

      // 3. M819 SMOKE: 4.85 kg
      expect(smoke.id).toBe('M819_SMOKE');
      expect(smoke.category).toBe('SMOKE');
      expect(smoke.weightKg).toBe(4.85);

      // 4. M879 TRAINING: 4.26 kg
      expect(training.id).toBe('M879_TRAINING');
      expect(training.category).toBe('TRAINING');
      expect(training.weightKg).toBe(4.26);
    });

    it('verifies Soviet 2B14 Podnos has 3 distinct ammunition types with authentic weights', () => {
      expect(podnosWeapon.ammunition).toBeDefined();
      expect(podnosWeapon.ammunition!.length).toBe(3);

      const [he, illum, smoke] = podnosWeapon.ammunition!;

      // 1. O832DU HE: 3.10 kg
      expect(he.id).toBe('O832DU_HE');
      expect(he.category).toBe('HE');
      expect(he.weightKg).toBe(3.1);

      // 2. S832S ILLUM: 3.51 kg
      expect(illum.id).toBe('S832S_ILLUM');
      expect(illum.category).toBe('ILLUM');
      expect(illum.weightKg).toBe(3.51);

      // 3. D832DU SMOKE: 3.48 kg
      expect(smoke.id).toBe('D832DU_SMOKE');
      expect(smoke.category).toBe('SMOKE');
      expect(smoke.weightKg).toBe(3.48);
    });

    it('dynamically recalculates ballistic solution when switching between ammunition types', () => {
      // Test at 1000m on US M252 with Charge 4
      const solHE = solveMortarFireMission({
        weapon: m252Weapon,
        gunPos: { x: 0, z: 0, alt: 0 },
        targetPos: { x: 0, z: 1000, alt: 0 },
        preferredCharge: 4,
        ammoId: 'M821_HE',
      });

      const solSmoke = solveMortarFireMission({
        weapon: m252Weapon,
        gunPos: { x: 0, z: 0, alt: 0 },
        targetPos: { x: 0, z: 1000, alt: 0 },
        preferredCharge: 4,
        ammoId: 'M819_SMOKE',
      });

      expect(solHE.elevationMils).toBe(1295);
      expect(solHE.ammoWeightKg).toBe(4.06);

      // Smoke round is 4.85 kg (heavier), requiring higher elevation and exhibiting different flight time
      expect(solSmoke.ammoWeightKg).toBe(4.85);
      expect(solSmoke.elevationMils).not.toBeNull();
      expect(solSmoke.elevationMils).not.toBe(solHE.elevationMils);
    });

    it('verifies direct calculateSolutionByAmmo helper API', () => {
      const solution = calculateSolutionByAmmo(m252Weapon, 'M821_HE', 4, 1000, 0);
      expect(solution.elevationMils).toBe(1295);
      expect(solution.charge).toBe(4);
      expect(solution.horizontalDistance).toBe(1000);
      expect(solution.inRange).toBe(true);

      // With hill altitude difference of +100m
      const solutionHill = calculateSolutionByAmmo(m252Weapon, 'M821_HE', 4, 1000, 100);
      expect(solutionHill.elevationMils).toBe(1260);
    });
  });

  describe('6. Elevation Degree Conversion & Sight Limit Verification', () => {
    it('verifies American M252 NATO 6400 mil system and reference angle values', () => {
      expect(m252Weapon.milsPerCircle).toBe(6400);
      expect(m252Weapon.minElevation).toBe(800);
      expect(m252Weapon.maxElevation).toBe(1515);

      // degrees = mils * 360 / 6400
      const degMin = (800 * 360) / 6400;
      expect(degMin).toBe(45.0);

      const degMax = Math.round(((1515 * 360) / 6400) * 10) / 10;
      expect(degMax).toBe(85.2);

      // Verify that firing solution elevationDeg matches formula
      const sol = solveMortarFireMission({
        weapon: m252Weapon,
        gunPos: { x: 0, z: 0, alt: 0 },
        targetPos: { x: 0, z: 1000, alt: 0 },
        preferredCharge: 4,
        ammoId: 'M821_HE',
      });
      expect(sol.elevationMils).toBe(1295);
      const expectedDeg = Math.round(((1295 * 360) / 6400) * 10) / 10;
      expect(sol.elevationDeg).toBe(expectedDeg);
      expect(sol.elevationDeg).toBe(72.8);
    });

    it('verifies Soviet 2B14 Podnos Warsaw Pact 6000 mil system and reference angle values', () => {
      expect(podnosWeapon.milsPerCircle).toBe(6000);
      expect(podnosWeapon.minElevation).toBe(748);
      expect(podnosWeapon.maxElevation).toBe(1415);

      // degrees = mils * 360 / 6000
      const degMin = Math.round(((748 * 360) / 6000) * 10) / 10;
      expect(degMin).toBe(44.9);

      const degMax = Math.round(((1415 * 360) / 6000) * 10) / 10;
      expect(degMax).toBe(84.9);

      // Verify that firing solution elevationDeg matches Soviet formula
      const sol = solveMortarFireMission({
        weapon: podnosWeapon,
        gunPos: { x: 0, z: 0, alt: 0 },
        targetPos: { x: 0, z: 1000, alt: 0 },
        preferredCharge: 4,
        ammoId: 'O832DU_HE',
      });
      expect(sol.elevationMils).not.toBeNull();
      const expectedDeg = Math.round(((sol.elevationMils! * 360) / 6000) * 10) / 10;
      expect(sol.elevationDeg).toBe(expectedDeg);
    });

    it('verifies independent configurations and complete specification metadata for M252 and 2B14', () => {
      // 1. American M252 Mortar
      expect(m252Weapon.shortName).toBe('M252');
      expect(m252Weapon.caliber).toBe('81 mm');
      expect(m252Weapon.angularSystemDescription).toBe('6400 mil per full circle');
      expect(m252Weapon.minElevation).toBe(800);
      expect(m252Weapon.minElevationDeg).toBe(45.0);
      expect(m252Weapon.maxElevation).toBe(1515);
      expect(m252Weapon.maxElevationDeg).toBe(85.2);
      expect(m252Weapon.verificationStatus).toBe('Requires verification against the existing game implementation');
      expect(m252Weapon.ammunition?.length).toBeGreaterThanOrEqual(4);

      // Formatted limits
      const m252MinLimitStr = `${m252Weapon.minElevation} mil ≈ ${m252Weapon.minElevationDeg?.toFixed(1)}°`;
      const m252MaxLimitStr = `${m252Weapon.maxElevation} mil ≈ ${m252Weapon.maxElevationDeg?.toFixed(1)}°`;
      expect(m252MinLimitStr).toBe('800 mil ≈ 45.0°');
      expect(m252MaxLimitStr).toBe('1515 mil ≈ 85.2°');

      // 2. Russian 2B14 Mortar
      expect(podnosWeapon.shortName).toBe('2B14');
      expect(podnosWeapon.caliber).toBe('82 mm');
      expect(podnosWeapon.angularSystemDescription).toBe('6000 mil per full circle');
      expect(podnosWeapon.minElevation).toBe(748);
      expect(podnosWeapon.minElevationDeg).toBe(44.9);
      expect(podnosWeapon.maxElevation).toBe(1415);
      expect(podnosWeapon.maxElevationDeg).toBe(84.9);
      expect(podnosWeapon.verificationStatus).toBe('Requires verification against the existing game implementation');
      expect(podnosWeapon.ammunition?.length).toBeGreaterThanOrEqual(3);

      // Formatted limits
      const podnosMinLimitStr = `${podnosWeapon.minElevation} mil ≈ ${podnosWeapon.minElevationDeg?.toFixed(1)}°`;
      const podnosMaxLimitStr = `${podnosWeapon.maxElevation} mil ≈ ${podnosWeapon.maxElevationDeg?.toFixed(1)}°`;
      expect(podnosMinLimitStr).toBe('748 mil ≈ 44.9°');
      expect(podnosMaxLimitStr).toBe('1415 mil ≈ 84.9°');

      // 3. Confirm systems are fully independent
      expect(m252Weapon.milsPerCircle).not.toBe(podnosWeapon.milsPerCircle);
      expect(m252Weapon.minElevation).not.toBe(podnosWeapon.minElevation);
      expect(m252Weapon.maxElevation).not.toBe(podnosWeapon.maxElevation);
      expect(m252Weapon.ammunition).not.toBe(podnosWeapon.ammunition);
    });
  });
});



