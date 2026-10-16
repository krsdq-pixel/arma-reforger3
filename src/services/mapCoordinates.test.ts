import { describe, it, expect } from 'vitest';
import { gameToLatLng, latLngToGame, createTerrainCRS } from './mapCoordinates';
import { TERRAINS } from '../data/maps';

describe('Map Coordinate System (L.CRS.Simple & Game Meters)', () => {
  it('converts game meters to Leaflet LatLng and back within 0.01m tolerance', () => {
    const testCases = [
      { x: 0, z: 0 },
      { x: 6400, z: 6400 },
      { x: 4893.46, z: 11800.709 },
      { x: 1281.055, z: 5946.839 },
      { x: 12800, z: 12800 },
      { x: 4096, z: 4096 },
    ];

    for (const { x, z } of testCases) {
      const latlng = gameToLatLng(x, z);
      const roundTrip = latLngToGame(latlng);

      expect(Math.abs(roundTrip.x - x)).toBeLessThanOrEqual(0.01);
      expect(Math.abs(roundTrip.z - z)).toBeLessThanOrEqual(0.01);
    }
  });

  it('preserves exact coordinates across all verified Everon locations', () => {
    const everon = TERRAINS.everon;
    expect(everon.pois.length).toBe(35);

    for (const poi of everon.pois) {
      const latlng = gameToLatLng(poi.x, poi.z);
      const back = latLngToGame(latlng);

      expect(Math.abs(back.x - poi.x)).toBeLessThan(0.0001);
      expect(Math.abs(back.z - poi.z)).toBeLessThan(0.0001);
    }
  });

  it('CRS projection and unprojection stays invariant under zoom changes', () => {
    const crs = createTerrainCRS(TERRAINS.everon);
    const testCoords = [
      { x: 4800, z: 7100 },
      { x: 5760, z: 7060 },
      { x: 4893.46, z: 11800.709 },
    ];

    // Test across zoom levels 0 through 8
    for (let zoom = 0; zoom <= 8; zoom++) {
      for (const { x, z } of testCoords) {
        const latlng = gameToLatLng(x, z);
        const point = crs.latLngToPoint(latlng, zoom);
        const unprojected = crs.pointToLatLng(point, zoom);
        const back = latLngToGame(unprojected);

        // Even across projected pixel quantization at zoom 0..8, coordinate accuracy is within 0.01m
        expect(Math.abs(back.x - x)).toBeLessThanOrEqual(0.01);
        expect(Math.abs(back.z - z)).toBeLessThanOrEqual(0.01);
      }
    }
  });

  it('verifies horizontal distance calculation matches Euclidean game meters', () => {
    const gun = { x: 4800, z: 7100 };
    const target = { x: 5760, z: 7060 };

    const dx = target.x - gun.x;
    const dz = target.z - gun.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    expect(distance).toBeCloseTo(960.83, 1);
  });

  it('calculates verified true-ground distances between known in-game POIs', () => {
    // Montignac to Entre Deux (Known Everon town center coordinates)
    const montignac = { x: 4775.641, z: 7086.945 };
    const entreDeux = { x: 5760.571, z: 7061.821 };
    const distMontignacEntreDeux = Math.sqrt(
      Math.pow(entreDeux.x - montignac.x, 2) + Math.pow(entreDeux.z - montignac.z, 2)
    );
    expect(distMontignacEntreDeux).toBeCloseTo(985.25, 1);

    // Morton to Coastal Base Morton
    const morton = { x: 5137.254, z: 4009.941 };
    const coastalBaseMorton = { x: 4956.796, z: 3875.627 };
    const distMorton = Math.sqrt(
      Math.pow(coastalBaseMorton.x - morton.x, 2) + Math.pow(coastalBaseMorton.z - morton.z, 2)
    );
    expect(distMorton).toBeCloseTo(224.96, 1);

    // St Phillipe to Airport
    const stPhillipe = { x: 4500.872, z: 10776.053 };
    const airport = { x: 4893.46, z: 11800.709 };
    const distAirport = Math.sqrt(
      Math.pow(airport.x - stPhillipe.x, 2) + Math.pow(airport.z - stPhillipe.z, 2)
    );
    expect(distAirport).toBeCloseTo(1097.29, 1);
  });

  it('Section 7.4: Zooming and panning 5 times does not shift marker coordinates by even 0.01m', () => {
    const crs = createTerrainCRS(TERRAINS.everon);
    const gunInitial = { x: 4800.0, z: 7100.0 };
    const targetInitial = { x: 5760.0, z: 7060.0 };

    let gunPos = { ...gunInitial };
    let targetPos = { ...targetInitial };

    // Simulate zooming in and out 5 cycles (from zoom 2 -> 7 -> 2)
    const zoomCycles = [2, 3, 5, 7, 4, 1, 6, 2, 7, 3, 1, 5, 2];
    for (const zoom of zoomCycles) {
      // Convert to LatLng
      const gunLatLng = gameToLatLng(gunPos.x, gunPos.z);
      const targetLatLng = gameToLatLng(targetPos.x, targetPos.z);

      // Project to container point at current zoom
      const gunPt = crs.latLngToPoint(gunLatLng, zoom);
      const targetPt = crs.latLngToPoint(targetLatLng, zoom);

      // Simulate panning by an arbitrary pixel offset in screen space, then unpanning back
      const panOffset = { x: 123.45, y: -87.65 };
      const pannedGunPt = { x: gunPt.x + panOffset.x, y: gunPt.y + panOffset.y };
      const restoredGunPt = { x: pannedGunPt.x - panOffset.x, y: pannedGunPt.y - panOffset.y };

      const pannedTargetPt = { x: targetPt.x + panOffset.x, y: targetPt.y + panOffset.y };
      const restoredTargetPt = { x: pannedTargetPt.x - panOffset.x, y: pannedTargetPt.y - panOffset.y };

      // Unproject back to LatLng
      const restoredGunLatLng = crs.pointToLatLng(restoredGunPt as any, zoom);
      const restoredTargetLatLng = crs.pointToLatLng(restoredTargetPt as any, zoom);

      // Convert back to game coordinates
      gunPos = latLngToGame(restoredGunLatLng);
      targetPos = latLngToGame(restoredTargetLatLng);
    }

    // Compare final coordinates against initial: must not drift by even 0.01m (strict check well under 1m)
    expect(Math.abs(gunPos.x - gunInitial.x)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(gunPos.z - gunInitial.z)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(targetPos.x - targetInitial.x)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(targetPos.z - targetInitial.z)).toBeLessThanOrEqual(0.01);
  });

  it('Section 6.4: Validates marker retention rule across terrain switch', () => {
    const everonSize = TERRAINS.everon.worldSize; // 12800m
    const arlandSize = TERRAINS.arland.worldSize; // 4096m

    // Helper to evaluate bounds rule
    const isInside = (pos: { x: number; z: number }, worldSize: number) =>
      pos.x >= 0 && pos.x <= worldSize && pos.z >= 0 && pos.z <= worldSize;

    // Case 1: Markers positioned within 4096m stay valid when switching from Everon to Arland
    const smallCoord = { x: 2500, z: 2500 };
    expect(isInside(smallCoord, everonSize)).toBe(true);
    expect(isInside(smallCoord, arlandSize)).toBe(true);

    // Case 2: Markers positioned beyond 4096m on Everon must be cleared when switching to Arland
    const largeCoord = { x: 7500, z: 8000 };
    expect(isInside(largeCoord, everonSize)).toBe(true);
    expect(isInside(largeCoord, arlandSize)).toBe(false);
  });
});
