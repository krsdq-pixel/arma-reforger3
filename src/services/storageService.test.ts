import { describe, it, expect, beforeEach } from 'vitest';
import { 
  StorageService, 
  DEFAULT_SETTINGS, 
  DEFAULT_OVERLAYS, 
  DEFAULT_WEATHER 
} from './storageService';
import { CustomMapMarker, CustomMortarConfig, AppExportData } from '../types';

describe('Browser-Based Storage & Customization Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Default Settings and Loaders', () => {
    it('returns default customization settings when storage is empty', () => {
      const settings = StorageService.loadSettings();
      expect(settings.theme).toBe('dark_tactical');
      expect(settings.layoutPreset).toBe('minimal_map');
      expect(settings.panelWidth).toBe(420);
      expect(settings.panelPosition).toBe('right');
      expect(settings.distanceUnit).toBe('meters');
      expect(settings.decimalPrecision).toBe(1);
      expect(settings.language).toBe('en');
      expect(settings.fcsPanelOpen).toBe(false);
      expect(settings.visibility).toBeDefined();
      expect(settings.visibility.showHeader).toBe(false);
    });

    it('toggles visibility modes between Map Only and Show All', () => {
      const settings = StorageService.loadSettings();
      const showAll = StorageService.setShowAll(settings);
      expect(showAll.visibility.showHeader).toBe(true);
      expect(showAll.visibility.showTerrainTabs).toBe(true);
      expect(showAll.fcsPanelOpen).toBe(true);

      const mapOnly = StorageService.setMapOnly(showAll);
      expect(mapOnly.visibility.showHeader).toBe(false);
      expect(mapOnly.visibility.showTerrainTabs).toBe(false);
      expect(mapOnly.fcsPanelOpen).toBe(false);
    });

    it('returns default map overlays when storage is empty', () => {
      const overlays = StorageService.loadOverlays();
      expect(overlays.showGrid).toBe(true);
      expect(overlays.show100mGrid).toBe(true);
      expect(overlays.showCapitals).toBe(true);
      expect(overlays.showTowns).toBe(true);
      expect(overlays.showVillages).toBe(true);
      expect(overlays.showGunMarker).toBe(true);
      expect(overlays.showTargetMarker).toBe(true);
      expect(overlays.showRangeRings).toBe(true);
    });

    it('returns default weather settings and supports broad wind speeds (5, 10, 15, 100)', () => {
      const weather = StorageService.loadWeather();
      expect(weather.windSpeed).toBe(5);
      expect(weather.windUnit).toBe('m/s');
      expect(weather.dataSource).toBe('manual_observation');

      // Verify saving broad wind speeds with no arbitrary 41 limit
      StorageService.saveWeather({
        ...weather,
        windSpeed: 100,
        windDirectionDeg: 270,
      });

      const loaded = StorageService.loadWeather();
      expect(loaded.windSpeed).toBe(100);
      expect(loaded.windDirectionDeg).toBe(270);
    });
  });

  describe('2. Custom Markers & Mortar Persistence', () => {
    it('persists and retrieves custom tactical markers', () => {
      const marker: CustomMapMarker = {
        id: 'marker-1',
        name: 'Observation Post Alpha',
        x: 4800,
        z: 7100,
        color: '#ef4444',
        category: 'observation',
        notes: 'Overlooks Valley Road',
        createdAt: Date.now(),
      };

      StorageService.saveMarkers([marker]);
      const loaded = StorageService.loadMarkers();

      expect(loaded.length).toBe(1);
      expect(loaded[0].name).toBe('Observation Post Alpha');
      expect(loaded[0].x).toBe(4800);
      expect(loaded[0].z).toBe(7100);
      expect(loaded[0].color).toBe('#ef4444');
    });

    it('persists and retrieves user-defined custom mortar configurations', () => {
      const customMortar: CustomMortarConfig = {
        id: 'custom_m252_mod',
        name: 'M252 Extended Barrel Profile',
        shortName: 'M252-EXT',
        caliber: '81 mm',
        milSystem: 'NATO',
        milsPerCircle: 6400,
        minElevation: 800,
        maxElevation: 1515,
        minElevationDeg: 45.0,
        maxElevationDeg: 85.2,
        verificationStatus: 'User-Defined Configuration Profile',
        sourceInfo: 'Manual user custom configuration entry',
        description: 'Customized barrel table profile for trial fire mission.',
        isUserDefined: true,
      };

      StorageService.saveCustomMortars([customMortar]);
      const loaded = StorageService.loadCustomMortars();

      expect(loaded.length).toBe(1);
      expect(loaded[0].name).toBe('M252 Extended Barrel Profile');
      expect(loaded[0].milsPerCircle).toBe(6400);
      expect(loaded[0].isUserDefined).toBe(true);
    });
  });

  describe('3. Backup File Import & Validation', () => {
    it('validates and accepts valid JSON export payload', () => {
      const validExport: AppExportData = {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        app: 'Arma Reforger FCS',
        settings: {
          ...DEFAULT_SETTINGS,
          theme: 'night_ops',
          panelWidth: 500,
          language: 'ar',
        },
        overlaySettings: {
          ...DEFAULT_OVERLAYS,
          showVillages: false,
        },
        weatherSettings: {
          ...DEFAULT_WEATHER,
          windSpeed: 25,
        },
        customMarkers: [
          {
            id: 'm1',
            name: 'Enemy Convoy Ambush Point',
            x: 5200,
            z: 6800,
            color: '#ef4444',
            category: 'enemy',
            createdAt: Date.now(),
          },
        ],
        customMortars: [],
      };

      const result = StorageService.validateAndParseImport(JSON.stringify(validExport));
      expect(result).not.toBeNull();
      expect(result?.settings.theme).toBe('night_ops');
      expect(result?.settings.language).toBe('ar');
      expect(result?.overlaySettings.showVillages).toBe(false);
      expect(result?.weatherSettings.windSpeed).toBe(25);
      expect(result?.customMarkers.length).toBe(1);
    });

    it('rejects corrupted or non-object JSON payloads safely', () => {
      expect(StorageService.validateAndParseImport('invalid-json')).toBeNull();
      expect(StorageService.validateAndParseImport('12345')).toBeNull();
      expect(StorageService.validateAndParseImport('{"random":"data"}')).toBeNull();
    });
  });

  describe('4. Granular Reset Operations', () => {
    it('resets appearance without modifying custom markers or language', () => {
      const customized = {
        ...DEFAULT_SETTINGS,
        theme: 'night_ops' as const,
        panelWidth: 550,
        language: 'ar' as const,
      };

      const resetResult = StorageService.resetAppearance(customized);
      expect(resetResult.theme).toBe(DEFAULT_SETTINGS.theme);
      expect(resetResult.panelWidth).toBe(DEFAULT_SETTINGS.panelWidth);
      expect(resetResult.language).toBe('ar'); // Language is preserved!
    });

    it('resets map overlays independently', () => {
      StorageService.saveOverlays({
        ...DEFAULT_OVERLAYS,
        showGrid: false,
        showTowns: false,
      });

      const resetOverlays = StorageService.resetMapDisplay();
      expect(resetOverlays.showGrid).toBe(true);
      expect(resetOverlays.showTowns).toBe(true);
    });

    it('clears user data without destroying UI preferences', () => {
      StorageService.saveSettings({
        ...DEFAULT_SETTINGS,
        language: 'ar',
      });
      StorageService.saveMarkers([
        { id: '1', name: 'Test', x: 0, z: 0, color: '#f00', category: 'waypoint', createdAt: 0 },
      ]);

      const { markers } = StorageService.clearUserData();
      expect(markers.length).toBe(0);

      // Verify settings are intact
      const settings = StorageService.loadSettings();
      expect(settings.language).toBe('ar');
    });
  });
});
