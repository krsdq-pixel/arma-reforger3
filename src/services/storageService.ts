import { 
  AppCustomizationSettings, 
  InterfaceVisibilitySettings,
  MapOverlaySettings, 
  WeatherSettings, 
  CustomMapMarker, 
  CustomMortarConfig,
  AppExportData 
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'arma_reforger_fcs_settings_v1',
  OVERLAYS: 'arma_reforger_fcs_overlays_v1',
  WEATHER: 'arma_reforger_fcs_weather_v1',
  MARKERS: 'arma_reforger_fcs_markers_v1',
  MORTARS: 'arma_reforger_fcs_mortars_v1',
};

export const DEFAULT_VISIBILITY: InterfaceVisibilitySettings = {
  showHeader: false,
  showTerrainTabs: false,
  showMobileTabs: false,
  showLiveSolutionPill: false,
  showMapTypeSelector: false,
  showMarkerControls: false,
  showMapTools: false,
  showFcsButton: false,
  showSettingsButton: false,
  showZoomControls: false,
  showBottomCoordinatesHud: false,
  menuButtonPosition: 'top-right',
  menuButtonSize: 'md',
};

export const FULL_VISIBILITY: InterfaceVisibilitySettings = {
  showHeader: true,
  showTerrainTabs: true,
  showMobileTabs: true,
  showLiveSolutionPill: true,
  showMapTypeSelector: true,
  showMarkerControls: true,
  showMapTools: true,
  showFcsButton: true,
  showSettingsButton: true,
  showZoomControls: true,
  showBottomCoordinatesHud: true,
  menuButtonPosition: 'top-right',
  menuButtonSize: 'md',
};

export const DEFAULT_SETTINGS: AppCustomizationSettings = {
  theme: 'dark_tactical',
  layoutPreset: 'minimal_map',
  panelWidth: 420,
  panelPosition: 'right',
  panelOpacity: 95,
  textSize: 'md',
  iconSize: 'md',
  buttonSize: 'md',
  distanceUnit: 'meters',
  decimalPrecision: 1,
  elevationDisplayFormat: 'both',
  language: 'en',
  fcsPanelOpen: false, // Default is clean Map-Only view!
  weatherPanelOpen: false,
  rulerToolOpen: false,
  visibility: DEFAULT_VISIBILITY,
};

export const DEFAULT_OVERLAYS: MapOverlaySettings = {
  showGrid: true,
  show100mGrid: true,
  showCapitals: true,
  showTowns: true,
  showVillages: true,
  showHills: true,
  showLandmarks: true,
  showGunMarker: true,
  showTargetMarker: true,
  showTrajectoryLine: true,
  showRangeRings: true,
  showCustomMarkers: true,
  showCoordinatesHud: true,
  labelSize: 'md',
  labelColor: '#38bdf8',
};

export const DEFAULT_WEATHER: WeatherSettings = {
  enabled: false,
  windSpeed: 5, // Supports flexible values (e.g. 5, 10, 15, 100) without artificial limit
  windUnit: 'm/s',
  windDirectionDeg: 0,
  dataSource: 'manual_observation',
  recordedAt: new Date().toISOString(),
  isAdvisoryOnly: true,
};

// Safe JSON parser helper
function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

function safeGet<T>(key: string, fallback: T): T {
  try {
    const storage = getStorage();
    if (!storage) return fallback;
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return { ...fallback, ...parsed };
  } catch (err) {
    console.warn(`[FCS Storage] Failed reading key "${key}":`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): boolean {
  try {
    const storage = getStorage();
    if (!storage) return false;
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[FCS Storage] Failed writing key "${key}":`, err);
    return false;
  }
}

export const StorageService = {
  // Loaders
  loadSettings(): AppCustomizationSettings {
    const loaded = safeGet<AppCustomizationSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return {
      ...DEFAULT_SETTINGS,
      ...loaded,
      visibility: {
        ...DEFAULT_VISIBILITY,
        ...(loaded.visibility || {}),
      },
    };
  },

  loadOverlays(): MapOverlaySettings {
    return safeGet<MapOverlaySettings>(STORAGE_KEYS.OVERLAYS, DEFAULT_OVERLAYS);
  },

  loadWeather(): WeatherSettings {
    return safeGet<WeatherSettings>(STORAGE_KEYS.WEATHER, DEFAULT_WEATHER);
  },

  loadMarkers(): CustomMapMarker[] {
    try {
      const storage = getStorage();
      if (!storage) return [];
      const raw = storage.getItem(STORAGE_KEYS.MARKERS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  loadCustomMortars(): CustomMortarConfig[] {
    try {
      const storage = getStorage();
      if (!storage) return [];
      const raw = storage.getItem(STORAGE_KEYS.MORTARS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  // Savers
  saveSettings(settings: AppCustomizationSettings) {
    safeSet(STORAGE_KEYS.SETTINGS, settings);
  },

  saveOverlays(overlays: MapOverlaySettings) {
    safeSet(STORAGE_KEYS.OVERLAYS, overlays);
  },

  saveWeather(weather: WeatherSettings) {
    safeSet(STORAGE_KEYS.WEATHER, weather);
  },

  saveMarkers(markers: CustomMapMarker[]) {
    safeSet(STORAGE_KEYS.MARKERS, markers);
  },

  saveCustomMortars(mortars: CustomMortarConfig[]) {
    safeSet(STORAGE_KEYS.MORTARS, mortars);
  },

  // Export to Portable JSON Backup
  exportBackupFile(
    settings: AppCustomizationSettings,
    overlaySettings: MapOverlaySettings,
    weatherSettings: WeatherSettings,
    customMarkers: CustomMapMarker[],
    customMortars: CustomMortarConfig[]
  ) {
    const backup: AppExportData = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      app: 'Arma Reforger FCS',
      settings,
      overlaySettings,
      weatherSettings,
      customMarkers,
      customMortars,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arma-reforger-fcs-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Validate and Import from JSON File
  validateAndParseImport(jsonString: string): AppExportData | null {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') return null;
      if (parsed.app !== 'Arma Reforger FCS' && !parsed.schemaVersion) {
        // Tolerant check for legacy exports
        if (!parsed.settings && !parsed.customMarkers) return null;
      }
      return {
        schemaVersion: 1,
        exportedAt: parsed.exportedAt || new Date().toISOString(),
        app: 'Arma Reforger FCS',
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        overlaySettings: { ...DEFAULT_OVERLAYS, ...(parsed.overlaySettings || {}) },
        weatherSettings: { ...DEFAULT_WEATHER, ...(parsed.weatherSettings || {}) },
        customMarkers: Array.isArray(parsed.customMarkers) ? parsed.customMarkers : [],
        customMortars: Array.isArray(parsed.customMortars) ? parsed.customMortars : [],
      };
    } catch {
      return null;
    }
  },

  // Granular Reset Operations
  resetAppearance(prev: AppCustomizationSettings): AppCustomizationSettings {
    const next: AppCustomizationSettings = {
      ...prev,
      theme: DEFAULT_SETTINGS.theme,
      layoutPreset: DEFAULT_SETTINGS.layoutPreset,
      panelWidth: DEFAULT_SETTINGS.panelWidth,
      panelPosition: DEFAULT_SETTINGS.panelPosition,
      panelOpacity: DEFAULT_SETTINGS.panelOpacity,
      textSize: DEFAULT_SETTINGS.textSize,
      iconSize: DEFAULT_SETTINGS.iconSize,
      buttonSize: DEFAULT_SETTINGS.buttonSize,
    };
    safeSet(STORAGE_KEYS.SETTINGS, next);
    return next;
  },

  resetVisibility(prev: AppCustomizationSettings): AppCustomizationSettings {
    const next: AppCustomizationSettings = {
      ...prev,
      visibility: { ...DEFAULT_VISIBILITY },
      fcsPanelOpen: false,
    };
    safeSet(STORAGE_KEYS.SETTINGS, next);
    return next;
  },

  setMapOnly(prev: AppCustomizationSettings): AppCustomizationSettings {
    const next: AppCustomizationSettings = {
      ...prev,
      layoutPreset: 'minimal_map',
      fcsPanelOpen: false,
      weatherPanelOpen: false,
      rulerToolOpen: false,
      visibility: {
        ...prev.visibility,
        showHeader: false,
        showTerrainTabs: false,
        showMobileTabs: false,
        showLiveSolutionPill: false,
        showMapTypeSelector: false,
        showMarkerControls: false,
        showMapTools: false,
        showFcsButton: false,
        showSettingsButton: false,
        showZoomControls: false,
        showBottomCoordinatesHud: false,
      },
    };
    safeSet(STORAGE_KEYS.SETTINGS, next);
    return next;
  },

  setShowAll(prev: AppCustomizationSettings): AppCustomizationSettings {
    const next: AppCustomizationSettings = {
      ...prev,
      layoutPreset: 'standard',
      fcsPanelOpen: true,
      visibility: {
        ...FULL_VISIBILITY,
        menuButtonPosition: prev.visibility.menuButtonPosition,
        menuButtonSize: prev.visibility.menuButtonSize,
      },
    };
    safeSet(STORAGE_KEYS.SETTINGS, next);
    return next;
  },

  resetMapDisplay(): MapOverlaySettings {
    safeSet(STORAGE_KEYS.OVERLAYS, DEFAULT_OVERLAYS);
    return { ...DEFAULT_OVERLAYS };
  },

  resetMortarDisplay(prev: AppCustomizationSettings): AppCustomizationSettings {
    const next: AppCustomizationSettings = {
      ...prev,
      decimalPrecision: DEFAULT_SETTINGS.decimalPrecision,
      elevationDisplayFormat: DEFAULT_SETTINGS.elevationDisplayFormat,
    };
    safeSet(STORAGE_KEYS.SETTINGS, next);
    return next;
  },

  resetLanguage(prev: AppCustomizationSettings): AppCustomizationSettings {
    const next: AppCustomizationSettings = {
      ...prev,
      language: DEFAULT_SETTINGS.language,
    };
    safeSet(STORAGE_KEYS.SETTINGS, next);
    return next;
  },

  resetAllSettings(): AppCustomizationSettings {
    safeSet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    safeSet(STORAGE_KEYS.OVERLAYS, DEFAULT_OVERLAYS);
    safeSet(STORAGE_KEYS.WEATHER, DEFAULT_WEATHER);
    return { ...DEFAULT_SETTINGS };
  },

  clearUserData(): { markers: CustomMapMarker[]; mortars: CustomMortarConfig[] } {
    safeSet(STORAGE_KEYS.MARKERS, []);
    safeSet(STORAGE_KEYS.MORTARS, []);
    return { markers: [], mortars: [] };
  },

  factoryReset() {
    try {
      const storage = getStorage();
      if (!storage) return;
      storage.removeItem(STORAGE_KEYS.SETTINGS);
      storage.removeItem(STORAGE_KEYS.OVERLAYS);
      storage.removeItem(STORAGE_KEYS.WEATHER);
      storage.removeItem(STORAGE_KEYS.MARKERS);
      storage.removeItem(STORAGE_KEYS.MORTARS);
    } catch (err) {
      console.warn('Factory reset localStorage error:', err);
    }
  },
};
