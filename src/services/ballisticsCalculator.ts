import { BallisticDataPoint, WeaponConfig, WeaponCharge, BallisticSolution } from '../types';

export interface InterpolatedBallistics {
  elevation: number;
  timeOfFlight: number;
  peakAlt: number;
  dElevPer100m: number;
  dHw: number; // Signed Delta H_w (-dElevPer100m for high-angle fire)
  angleImpact: number;
  dispersion: number;
  isExact: boolean;
}

export interface CalculateSolutionOptions {
  weapon: WeaponConfig;
  gunPos: { x: number; z: number; alt: number };
  targetPos: { x: number; z: number; alt: number };
  preferredCharge?: number; // -1 for auto
}

/**
 * Strict linear interpolation across ballistic data points according to official in-game manual formulas:
 * Result = V1 + (V2 - V1) * ((R_target - R1) / (R2 - R1))
 */
export function interpolateBallistics(
  table: BallisticDataPoint[],
  targetDistance: number
): InterpolatedBallistics | null {
  if (!table || table.length === 0) return null;

  // Check exact match (within 0.05m tolerance)
  const exact = table.find((p) => Math.abs(p.range - targetDistance) < 0.05);
  if (exact) {
    const dElev = exact.dElevPer100m ?? 30.0;
    return {
      elevation: exact.elevation,
      timeOfFlight: exact.tof,
      peakAlt: exact.peakAlt ?? (1.226 * exact.tof * exact.tof),
      dElevPer100m: dElev,
      dHw: -Math.abs(dElev),
      angleImpact: exact.angleImpact ?? (exact.elevation * (360 / 6400)),
      dispersion: exact.dispersion ?? 40.0,
      isExact: true,
    };
  }

  const minRange = table[0].range;
  const maxRange = table[table.length - 1].range;

  // Range boundary check for interpolation
  if (targetDistance < minRange || targetDistance > maxRange) {
    return null;
  }

  // Find bounding segment
  for (let i = 0; i < table.length - 1; i++) {
    const p1 = table[i];
    const p2 = table[i + 1];

    if (targetDistance >= p1.range && targetDistance <= p2.range) {
      const rangeSpan = p2.range - p1.range;
      if (rangeSpan === 0) {
        const dElev = p1.dElevPer100m ?? 30.0;
        return {
          elevation: p1.elevation,
          timeOfFlight: p1.tof,
          peakAlt: p1.peakAlt ?? 1000,
          dElevPer100m: dElev,
          dHw: -Math.abs(dElev),
          angleImpact: p1.angleImpact ?? 70,
          dispersion: p1.dispersion ?? 40,
          isExact: true,
        };
      }

      const t = (targetDistance - p1.range) / rangeSpan;

      const p1Peak = p1.peakAlt ?? (1.226 * p1.tof * p1.tof);
      const p2Peak = p2.peakAlt ?? (1.226 * p2.tof * p2.tof);

      const p1dElev = p1.dElevPer100m ?? 30.0;
      const p2dElev = p2.dElevPer100m ?? 30.0;

      const p1Angle = p1.angleImpact ?? 70.0;
      const p2Angle = p2.angleImpact ?? 70.0;

      const p1Disp = p1.dispersion ?? 40.0;
      const p2Disp = p2.dispersion ?? 40.0;

      const dElevInterp = p1dElev + (p2dElev - p1dElev) * t;

      return {
        elevation: p1.elevation + (p2.elevation - p1.elevation) * t,
        timeOfFlight: p1.tof + (p2.tof - p1.tof) * t,
        peakAlt: p1Peak + (p2Peak - p1Peak) * t,
        dElevPer100m: dElevInterp,
        dHw: -Math.abs(dElevInterp),
        angleImpact: p1Angle + (p2Angle - p1Angle) * t,
        dispersion: p1Disp + (p2Disp - p1Disp) * t,
        isExact: false,
      };
    }
  }

  return null;
}

/**
 * Finds all charge rings whose range brackets cover the given target distance.
 */
export function findValidCharges(weapon: WeaponConfig, distanceMeters: number): WeaponCharge[] {
  return weapon.charges.filter(
    (c) => distanceMeters >= c.minRange && distanceMeters <= c.maxRange
  );
}

/**
 * Returns explicit tactical guidance if a target distance falls outside a selected charge bracket.
 * e.g., "Range requires Ring 2" or "Range requires Ring 3 or Ring 4"
 */
export function getRequiredChargeWarning(
  weapon: WeaponConfig,
  selectedChargeIdx: number,
  distanceMeters: number
): string | undefined {
  const selectedCharge = weapon.charges[selectedChargeIdx];
  if (!selectedCharge) return 'Invalid charge selected';

  // If in range of current charge, no warning
  if (distanceMeters >= selectedCharge.minRange && distanceMeters <= selectedCharge.maxRange) {
    return undefined;
  }

  // Find charges that can hit this target
  const valid = findValidCharges(weapon, distanceMeters);

  if (valid.length > 0) {
    const ringNames = valid.map((c) => `Ring ${c.charge}`).join(' or ');
    return `Range requires ${ringNames}`;
  }

  // Outside weapon global min or max
  const globalMin = Math.min(...weapon.charges.map((c) => c.minRange));
  const globalMax = Math.max(...weapon.charges.map((c) => c.maxRange));

  if (distanceMeters < globalMin) {
    return `Target distance (${Math.round(distanceMeters)}m) below minimum range (${globalMin}m)`;
  }
  return `Target distance (${Math.round(distanceMeters)}m) exceeds maximum range (${globalMax}m)`;
}

/**
 * Altitude correction (Delta H_w) calculation according to official manual formula:
 * Delta Alt = Target Alt - Mortar Alt
 * Final Elevation = Base Elevation + (Delta Alt / 100 * Delta H_w)
 * Where Delta H_w is negative for high-angle mortar fire (flatter tube to reach hilltop, steeper tube into valley).
 */
export function calculateAltitudeCorrection(deltaAltMeters: number, dElevPer100m: number): number {
  return - (deltaAltMeters / 100.0) * Math.abs(dElevPer100m);
}

/**
 * Computes high-precision firing solution for mortar systems with dynamic charge table selection
 */
export function solveMortarFireMission({
  weapon,
  gunPos,
  targetPos,
  preferredCharge,
}: CalculateSolutionOptions): BallisticSolution {
  // Euclidean planar distance (1 meter per coordinate unit)
  const dx = targetPos.x - gunPos.x;
  const dz = targetPos.z - gunPos.z;
  const deltaAlt = targetPos.alt - gunPos.alt;

  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
  const slantDistance = Math.sqrt(horizontalDistance * horizontalDistance + deltaAlt * deltaAlt);

  // Azimuth calculation normalized in weapon's native mil system (6400 NATO or 6000 Soviet)
  // In Arma Reforger: Z is North (0° / 0 mils), X is East (90° / 1600 or 1500 mils)
  let angleRad = Math.atan2(dx, dz);
  if (angleRad < 0) {
    angleRad += 2 * Math.PI;
  }
  const azimuthDeg = (angleRad * 180) / Math.PI;
  const azimuthMils = (angleRad / (2 * Math.PI)) * weapon.milsPerCircle;

  // Determine valid charge rings for this distance
  const validCharges = findValidCharges(weapon, horizontalDistance);

  // Automatic optimal charge selection
  let recommendedCharge = 0;
  if (validCharges.length > 0) {
    // If target is on the extreme upper edge (> 95% of lowest charge max) and next charge has good angle headroom, prefer next
    const lowest = validCharges[0];
    const second = validCharges.length > 1 ? validCharges[1] : null;

    if (
      second &&
      horizontalDistance > lowest.maxRange * 0.95 &&
      horizontalDistance >= second.minRange + 30
    ) {
      recommendedCharge = second.charge;
    } else {
      recommendedCharge = lowest.charge;
    }
  } else {
    // Outside all charges: choose closest boundary
    const globalMin = Math.min(...weapon.charges.map((c) => c.minRange));
    if (horizontalDistance < globalMin) {
      recommendedCharge = weapon.charges[0].charge;
    } else {
      recommendedCharge = weapon.charges[weapon.charges.length - 1].charge;
    }
  }

  // Active charge selection:
  // If preferredCharge is -1 (AUTO), use recommended charge.
  // If user specified a manual charge (0..4), use it.
  const isAuto = preferredCharge === undefined || preferredCharge < 0;
  const activeChargeIdx = isAuto ? recommendedCharge : preferredCharge;

  const selectedChargeObj = weapon.charges.find((c) => c.charge === activeChargeIdx) || weapon.charges[0];
  const table = selectedChargeObj.table;
  const inRange = horizontalDistance >= selectedChargeObj.minRange && horizontalDistance <= selectedChargeObj.maxRange;

  // Check explicit bracket guidance / warnings
  let warning: string | undefined = getRequiredChargeWarning(weapon, activeChargeIdx, horizontalDistance);

  let elevationMils: number | null = null;
  let elevationDeg: number | null = null;
  let timeOfFlight: number | null = null;
  let peakAlt: number | null = null;
  let dElevPer100m: number | null = null;
  let angleImpact: number | null = null;

  // Clamp distance to charge table boundaries for evaluation
  const clampedDistance = Math.max(
    selectedChargeObj.minRange,
    Math.min(selectedChargeObj.maxRange, horizontalDistance)
  );

  const interp = interpolateBallistics(table, clampedDistance);

  if (interp) {
    dElevPer100m = Math.round(interp.dElevPer100m * 10) / 10;
    peakAlt = Math.round(interp.peakAlt);
    angleImpact = Math.round(interp.angleImpact * 10) / 10;
    timeOfFlight = Math.round(interp.timeOfFlight * 10) / 10;

    // Apply official manual altitude correction formula:
    // Final Elevation = Base Elevation + (Delta Alt / 100 * Delta H_w)
    const altitudeCorrection = calculateAltitudeCorrection(deltaAlt, interp.dElevPer100m);
    const unconstrainedElevMils = interp.elevation + altitudeCorrection;

    // Physical sight quadrant limit checks (only if within range bounds)
    if (!warning) {
      if (unconstrainedElevMils > weapon.maxElevation) {
        warning = `Corrected elevation (${Math.round(unconstrainedElevMils)} mils) exceeds maximum quadrant limit [${weapon.minElevation}–${weapon.maxElevation} mils]`;
      } else if (unconstrainedElevMils < weapon.minElevation) {
        warning = `Corrected elevation (${Math.round(unconstrainedElevMils)} mils) below minimum quadrant limit [${weapon.minElevation}–${weapon.maxElevation} mils]`;
      }
    }

    elevationMils = Math.round(unconstrainedElevMils);
    const degPerMil = 360 / weapon.milsPerCircle;
    elevationDeg = Math.round((elevationMils * degPerMil) * 10) / 10;
  }

  return {
    horizontalDistance: Math.round(horizontalDistance),
    slantDistance: Math.round(slantDistance),
    heightDifference: Math.round(deltaAlt),
    azimuthDeg: Math.round(azimuthDeg * 10) / 10,
    azimuthMils: Math.round(azimuthMils),
    charge: activeChargeIdx,
    recommendedCharge,
    elevationMils,
    elevationDeg,
    timeOfFlight,
    peakAlt,
    dElevPer100m,
    angleImpact,
    inRange,
    warning,
    ammoType: weapon.caliber,
  };
}

/**
 * Inverts elevation lookup to find the theoretical distance for a dialed elevation
 */
export function lookupRangeFromElevation(
  table: BallisticDataPoint[],
  elevationMils: number
): { range: number; tof: number; isExact: boolean } | null {
  if (!table || table.length === 0) return null;

  const exact = table.find((p) => Math.abs(p.elevation - elevationMils) < 0.2);
  if (exact) {
    return { range: exact.range, tof: exact.tof, isExact: true };
  }

  const highestElev = table[0].elevation;
  const lowestElev = table[table.length - 1].elevation;

  if (elevationMils > highestElev || elevationMils < lowestElev) {
    return null;
  }

  for (let i = 0; i < table.length - 1; i++) {
    const p1 = table[i];
    const p2 = table[i + 1];

    if (elevationMils <= p1.elevation && elevationMils >= p2.elevation) {
      const span = p2.elevation - p1.elevation;
      const t = (elevationMils - p1.elevation) / span;
      return {
        range: Math.round((p1.range + t * (p2.range - p1.range)) * 10) / 10,
        tof: Math.round((p1.tof + t * (p2.tof - p1.tof)) * 10) / 10,
        isExact: false,
      };
    }
  }

  return null;
}
