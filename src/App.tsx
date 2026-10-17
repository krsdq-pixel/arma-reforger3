import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TERRAINS } from './data/maps';
import { WEAPONS, calculateFiringSolution } from './data/ballistics';
import { 
  TerrainId, 
  MapLayerType, 
  TileDiagnostics, 
  WeaponConfig,
  AppCustomizationSettings,
  MapOverlaySettings,
  WeatherSettings,
  CustomMapMarker,
  CustomMortarConfig,
  AppExportData
} from './types';
import { StorageService } from './services/storageService';
import { Header } from './components/Header';
import { TacticalMap } from './components/TacticalMap';
import { FireControlPanel } from './components/FireControlPanel';
import { DiagnosticsModal } from './components/DiagnosticsModal';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { CustomMarkerModal } from './components/CustomMarkerModal';
import { WeatherWidget } from './components/WeatherWidget';
import { ThreeDotMenu } from './components/ThreeDotMenu';

export default function App() {
  // 1. Persistent Storage State (Browser LocalStorage)
  const [settings, setSettings] = useState<AppCustomizationSettings>(() => StorageService.loadSettings());
  const [overlays, setOverlays] = useState<MapOverlaySettings>(() => StorageService.loadOverlays());
  const [weather, setWeather] = useState<WeatherSettings>(() => StorageService.loadWeather());
  const [customMarkers, setCustomMarkers] = useState<CustomMapMarker[]>(() => StorageService.loadMarkers());
  const [customMortars, setCustomMortars] = useState<CustomMortarConfig[]>(() => StorageService.loadCustomMortars());

  // 2. Modals & Menu State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThreeDotOpen, setIsThreeDotOpen] = useState(false);
  const [isMarkerModalOpen, setIsMarkerModalOpen] = useState(false);
  const [markerModalCoords, setMarkerModalCoords] = useState<{ x: number; z: number }>({ x: 0, z: 0 });
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [fitMissionTrigger, setFitMissionTrigger] = useState<number>(0);
  const [isRulerActive, setIsRulerActive] = useState<boolean>(false);

  // 3. Operational Map & Weapon State
  const [activeTerrainId, setActiveTerrainId] = useState<TerrainId>('everon');
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('topo');
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponConfig>(WEAPONS[0]);
  const [selectedAmmoId, setSelectedAmmoId] = useState<string>('M821_HE');
  const [selectedCharge, setSelectedCharge] = useState<number>(-1); // -1 = Auto optimal ring
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);
  const [terrainNotice, setTerrainNotice] = useState<string | null>(null);

  const currentTerrain = TERRAINS[activeTerrainId];

  // Gun and Target coordinates (meters in game world)
  const [gunPos, setGunPos] = useState<{ x: number; z: number; alt: number }>({
    x: currentTerrain.defaultWeapon[0],
    z: currentTerrain.defaultWeapon[1],
    alt: 65,
  });

  const [targetPos, setTargetPos] = useState<{ x: number; z: number; alt: number }>({
    x: currentTerrain.defaultTarget[0],
    z: currentTerrain.defaultTarget[1],
    alt: 72,
  });

  // Diagnostics state
  const [diagnostics, setDiagnostics] = useState<TileDiagnostics>({
    terrainId: 'everon',
    urlTemplate: currentTerrain.layers.topo,
    currentZoom: 2,
    loadedCount: 0,
    failedCount: 0,
    lastError: null,
    isReachable: null,
    pingMs: null,
    httpStatus: null,
  });

  // Combine standard weapons with custom user-defined mortars
  const allWeapons: WeaponConfig[] = useMemo(() => {
    if (customMortars.length === 0) return WEAPONS;

    const convertedCustoms: WeaponConfig[] = customMortars.map((cm) => {
      // Find matching base charges from American or Soviet baseline
      const base = cm.milsPerCircle === 6000 ? WEAPONS[1] : WEAPONS[0];
      return {
        id: cm.id,
        name: cm.name,
        shortName: cm.shortName,
        faction: cm.milsPerCircle === 6000 ? 'Soviet Army' : 'US Army',
        caliber: cm.caliber,
        milSystem: cm.milSystem,
        milsPerCircle: cm.milsPerCircle,
        minElevation: cm.minElevation,
        maxElevation: cm.maxElevation,
        minElevationDeg: cm.minElevationDeg,
        maxElevationDeg: cm.maxElevationDeg,
        verificationStatus: cm.verificationStatus,
        sourceInfo: cm.sourceInfo,
        description: cm.description,
        charges: base.charges,
        ammunition: base.ammunition,
      };
    });

    return [...WEAPONS, ...convertedCustoms];
  }, [customMortars]);

  // Update Settings with auto-persistence
  const handleUpdateSettings = useCallback((partial: Partial<AppCustomizationSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      StorageService.saveSettings(next);
      return next;
    });
  }, []);

  // Update Overlays with auto-persistence
  const handleUpdateOverlays = useCallback((partial: Partial<MapOverlaySettings>) => {
    setOverlays((prev) => {
      const next = { ...prev, ...partial };
      StorageService.saveOverlays(next);
      return next;
    });
  }, []);

  // Update Weather with auto-persistence
  const handleUpdateWeather = useCallback((partial: Partial<WeatherSettings>) => {
    setWeather((prev) => {
      const next = { ...prev, ...partial };
      StorageService.saveWeather(next);
      return next;
    });
  }, []);

  // Custom Markers operations
  const handleAddMarker = useCallback((marker: CustomMapMarker) => {
    setCustomMarkers((prev) => {
      const next = [...prev, marker];
      StorageService.saveMarkers(next);
      return next;
    });
  }, []);

  const handleDeleteMarker = useCallback((id: string) => {
    setCustomMarkers((prev) => {
      const next = prev.filter((m) => m.id !== id);
      StorageService.saveMarkers(next);
      return next;
    });
  }, []);

  // Custom Mortars operations
  const handleAddMortar = useCallback((mortar: CustomMortarConfig) => {
    setCustomMortars((prev) => {
      const next = [...prev, mortar];
      StorageService.saveCustomMortars(next);
      return next;
    });
  }, []);

  const handleDeleteMortar = useCallback((id: string) => {
    setCustomMortars((prev) => {
      const next = prev.filter((m) => m.id !== id);
      StorageService.saveCustomMortars(next);
      return next;
    });
  }, []);

  // Import Backup operation
  const handleImportBackup = useCallback((backup: AppExportData) => {
    if (backup.settings) {
      setSettings(backup.settings);
      StorageService.saveSettings(backup.settings);
    }
    if (backup.overlaySettings) {
      setOverlays(backup.overlaySettings);
      StorageService.saveOverlays(backup.overlaySettings);
    }
    if (backup.weatherSettings) {
      setWeather(backup.weatherSettings);
      StorageService.saveWeather(backup.weatherSettings);
    }
    if (backup.customMarkers) {
      setCustomMarkers(backup.customMarkers);
      StorageService.saveMarkers(backup.customMarkers);
    }
    if (backup.customMortars) {
      setCustomMortars(backup.customMortars);
      StorageService.saveCustomMortars(backup.customMortars);
    }
  }, []);

  // Granular Reset operations
  const handleResetSection = useCallback((section: 'appearance' | 'map' | 'mortar' | 'language' | 'all' | 'userData' | 'factory' | 'visibility') => {
    if (section === 'appearance') {
      setSettings((prev) => StorageService.resetAppearance(prev));
    } else if (section === 'map') {
      setOverlays(StorageService.resetMapDisplay());
    } else if (section === 'mortar') {
      setSettings((prev) => StorageService.resetMortarDisplay(prev));
    } else if (section === 'language') {
      setSettings((prev) => StorageService.resetLanguage(prev));
    } else if (section === 'all') {
      setSettings(StorageService.resetAllSettings());
      setOverlays(StorageService.resetMapDisplay());
      setWeather(StorageService.loadWeather());
    } else if (section === 'userData') {
      const { markers, mortars } = StorageService.clearUserData();
      setCustomMarkers(markers);
      setCustomMortars(mortars);
    } else if (section === 'visibility') {
      setSettings((prev) => StorageService.resetVisibility(prev));
    } else if (section === 'factory') {
      StorageService.factoryReset();
      setSettings(StorageService.loadSettings());
      setOverlays(StorageService.loadOverlays());
      setWeather(StorageService.loadWeather());
      setCustomMarkers([]);
      setCustomMortars([]);
    }
  }, []);

  const handleQuickMapOnly = useCallback(() => {
    setSettings((prev) => StorageService.setMapOnly(prev));
  }, []);

  const handleQuickShowAll = useCallback(() => {
    setSettings((prev) => StorageService.setShowAll(prev));
  }, []);

  const handleQuickRestoreDefault = useCallback(() => {
    setSettings((prev) => StorageService.resetVisibility(prev));
  }, []);

  const handleFitMission = useCallback(() => {
    setFitMissionTrigger((v) => v + 1);
  }, []);

  const toggleLang = useCallback(() => {
    handleUpdateSettings({ language: settings.language === 'en' ? 'ar' : 'en' });
  }, [settings.language, handleUpdateSettings]);

  // Switch weapon and reset charge to Auto and ammo to default
  const handleSelectWeapon = useCallback((weapon: WeaponConfig) => {
    setSelectedWeapon(weapon);
    setSelectedCharge(-1);
    if (weapon.ammunition && weapon.ammunition.length > 0) {
      setSelectedAmmoId(weapon.ammunition[0].id);
    }
  }, []);

  // Switch terrain
  const handleSelectTerrain = (id: TerrainId) => {
    setActiveTerrainId(id);
    const newTerrain = TERRAINS[id];
    
    const gunInside = gunPos.x >= 0 && gunPos.x <= newTerrain.worldSize && gunPos.z >= 0 && gunPos.z <= newTerrain.worldSize;
    const targetInside = targetPos.x >= 0 && targetPos.x <= newTerrain.worldSize && targetPos.z >= 0 && targetPos.z <= newTerrain.worldSize;

    if (!gunInside || !targetInside) {
      setGunPos({
        x: newTerrain.defaultWeapon[0],
        z: newTerrain.defaultWeapon[1],
        alt: 50,
      });
      setTargetPos({
        x: newTerrain.defaultTarget[0],
        z: newTerrain.defaultTarget[1],
        alt: 60,
      });
      setTerrainNotice('Markers repositioned within new terrain bounds');
      setTimeout(() => setTerrainNotice(null), 3500);
    }

    if (id === 'kolguyev' && activeLayer === 'drawn') {
      setActiveLayer('topo');
    }
  };

  const handleDiagnosticsUpdate = useCallback((partial: Partial<TileDiagnostics>) => {
    setDiagnostics((prev) => ({ ...prev, ...partial }));
  }, []);

  // Ballistic solution calculation
  const solution = useMemo(() => {
    return calculateFiringSolution(selectedWeapon, gunPos, targetPos, selectedCharge, selectedAmmoId);
  }, [selectedWeapon, gunPos, targetPos, selectedCharge, selectedAmmoId]);

  const activeAmmo = selectedWeapon.ammunition?.find((a) => a.id === selectedAmmoId) || selectedWeapon.ammunition?.[0];
  const activeCharges = activeAmmo ? activeAmmo.charges : selectedWeapon.charges;
  const currentChargeObj = activeCharges[solution.charge] || activeCharges[0];
  const chargeMinRange = currentChargeObj?.minRange || 0;
  const chargeMaxRange = currentChargeObj?.maxRange || 0;

  const handleRetry = useCallback(() => {
    setReloadTrigger((v) => v + 1);
  }, []);

  const [mobileTab, setMobileTab] = useState<'map' | 'calc'>('map');

  // Trigger custom marker modal with given coords
  const handleOpenMarkerModal = useCallback((coords: { x: number; z: number }) => {
    setMarkerModalCoords(coords);
    setIsMarkerModalOpen(true);
  }, []);

  // Theme styling classes
  const themeClass = settings.theme === 'night_ops'
    ? 'theme-night-ops'
    : settings.theme === 'forest_slate'
    ? 'theme-forest'
    : settings.theme === 'desert_camo'
    ? 'theme-desert'
    : settings.theme === 'high_contrast'
    ? 'theme-high-contrast'
    : 'theme-dark-tactical';

  const isAr = settings.language === 'ar';

  return (
    <div 
      className={`flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans ${themeClass}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Top Header (Controlled by settings.visibility.showHeader) */}
      {settings.visibility.showHeader && (
        <Header
          terrains={TERRAINS}
          activeTerrainId={activeTerrainId}
          onSelectTerrain={handleSelectTerrain}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleFcs={() => handleUpdateSettings({ fcsPanelOpen: !settings.fcsPanelOpen })}
          isFcsOpen={settings.fcsPanelOpen}
          diagnostics={diagnostics}
          solution={solution}
          selectedWeapon={selectedWeapon}
          lang={settings.language}
          onToggleLang={toggleLang}
          visibility={settings.visibility}
        />
      )}

      {/* Mobile Mode Switcher Bar (< lg, Controlled by settings.visibility.showMobileTabs) */}
      {settings.visibility.showMobileTabs && (
        <div className="lg:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-3 py-1.5 shrink-0 z-20">
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setMobileTab('map')}
              className={`px-3 py-1 text-xs font-mono font-bold rounded transition-all ${
                mobileTab === 'map'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'الخارطة التكتيكية' : 'Tactical Map'}
            </button>
            <button
              onClick={() => setMobileTab('calc')}
              className={`px-3 py-1 text-xs font-mono font-bold rounded transition-all ${
                mobileTab === 'calc'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'الحاسبة والحل' : 'Calculator & Sol'}
            </button>
          </div>

          {/* Quick Solution Pill for Mobile */}
          {settings.visibility.showLiveSolutionPill && (
            <div 
              onClick={() => setMobileTab('calc')}
              className="flex items-center gap-2 cursor-pointer font-mono text-[11px] bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800 hover:border-sky-500"
            >
              <span className="text-sky-400 font-bold">AZ: {solution.azimuthMils}</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-bold">
                EL: {solution.elevationDeg !== null ? `${solution.elevationDeg.toFixed(1)}°` : '---'}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">Ring {solution.charge}</span>
            </div>
          )}
        </div>
      )}

      {/* Floating Accessible Three-Dot Settings & Visibility Menu Button */}
      <ThreeDotMenu
        isOpen={isThreeDotOpen}
        onToggle={() => setIsThreeDotOpen((v) => !v)}
        onClose={() => setIsThreeDotOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onQuickMapOnly={handleQuickMapOnly}
        onQuickShowAll={handleQuickShowAll}
        onQuickRestoreDefault={handleQuickRestoreDefault}
        onOpenFullSettings={() => setIsSettingsOpen(true)}
        onToggleFcs={() => handleUpdateSettings({ fcsPanelOpen: !settings.fcsPanelOpen })}
        isFcsOpen={settings.fcsPanelOpen}
        onToggleWeather={() => handleUpdateSettings({ weatherPanelOpen: !settings.weatherPanelOpen })}
        isWeatherOpen={settings.weatherPanelOpen}
        onToggleRuler={() => setIsRulerActive((v) => !v)}
        isRulerActive={isRulerActive}
        onFitMission={handleFitMission}
        onToggleLang={toggleLang}
        lang={settings.language}
      />

      {/* Main Workspace Layout (Map-Only Primary Interface with Collapsible Sidebar) */}
      <div className={`flex-1 flex min-h-0 overflow-hidden relative ${
        settings.panelPosition === 'left' ? 'flex-col lg:flex-row-reverse' : 'flex-col lg:flex-row'
      }`}>
        {/* Tactical Map (Primary view - expands to 100% when FCS is closed) */}
        <div className={`flex-1 h-full relative ${mobileTab === 'calc' ? 'hidden lg:block' : 'block'}`}>
          <TacticalMap
            terrain={currentTerrain}
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            gunPos={gunPos}
            targetPos={targetPos}
            onGunChange={setGunPos}
            onTargetChange={setTargetPos}
            chargeMinRange={chargeMinRange}
            chargeMaxRange={chargeMaxRange}
            inRange={solution.inRange}
            onDiagnosticsUpdate={handleDiagnosticsUpdate}
            reloadTrigger={reloadTrigger}
            onRetry={handleRetry}
            terrainNotice={terrainNotice}
            overlays={overlays}
            settings={settings}
            customMarkers={customMarkers}
            onAddCustomMarker={handleAddMarker}
            onDeleteCustomMarker={handleDeleteMarker}
            onOpenMarkerModal={handleOpenMarkerModal}
            weather={weather}
            onToggleWeather={() => handleUpdateSettings({ weatherPanelOpen: !settings.weatherPanelOpen })}
            onToggleFcs={() => handleUpdateSettings({ fcsPanelOpen: !settings.fcsPanelOpen })}
            onToggleSettings={() => setIsSettingsOpen(true)}
            lang={settings.language}
            fitMissionTrigger={fitMissionTrigger}
          />

          {/* Floating Weather & Wind HUD Overlay (When enabled) */}
          {settings.weatherPanelOpen && (
            <div className="absolute top-16 right-3 sm:right-4 z-[1001] animate-in fade-in slide-in-from-top-2 duration-150">
              <WeatherWidget
                weather={weather}
                onChange={handleUpdateWeather}
                onClose={() => handleUpdateSettings({ weatherPanelOpen: false })}
                lang={settings.language}
              />
            </div>
          )}
        </div>

        {/* Fire Control Calculator Sidebar (Collapsible & Resizable on Desktop) */}
        {settings.fcsPanelOpen && (
          <div 
            style={{ width: `${settings.panelWidth}px` }}
            className={`w-full h-full shrink-0 z-10 shadow-2xl transition-all duration-200 ${
              mobileTab === 'map' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <FireControlPanel
              terrain={currentTerrain}
              weapons={allWeapons}
              selectedWeapon={selectedWeapon}
              onSelectWeapon={handleSelectWeapon}
              selectedAmmoId={selectedAmmoId}
              onSelectAmmo={setSelectedAmmoId}
              selectedCharge={selectedCharge}
              onSelectCharge={setSelectedCharge}
              gunPos={gunPos}
              targetPos={targetPos}
              onGunChange={setGunPos}
              onTargetChange={setTargetPos}
              solution={solution}
              lang={settings.language}
            />
          </div>
        )}
      </div>

      {/* Comprehensive Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        overlays={overlays}
        onUpdateOverlays={handleUpdateOverlays}
        weather={weather}
        onUpdateWeather={handleUpdateWeather}
        customMarkers={customMarkers}
        onAddMarker={handleAddMarker}
        onDeleteMarker={handleDeleteMarker}
        customMortars={customMortars}
        onAddMortar={handleAddMortar}
        onDeleteMortar={handleDeleteMortar}
        onImportBackup={handleImportBackup}
        onResetSection={handleResetSection}
        onQuickMapOnly={handleQuickMapOnly}
        onQuickShowAll={handleQuickShowAll}
        onQuickRestoreDefault={handleQuickRestoreDefault}
      />

      {/* Custom Tactical Marker Modal */}
      <CustomMarkerModal
        isOpen={isMarkerModalOpen}
        onClose={() => setIsMarkerModalOpen(false)}
        onSave={handleAddMarker}
        defaultCoords={markerModalCoords}
        lang={settings.language}
      />

      {/* Developer Diagnostics Modal */}
      <DiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        diagnostics={diagnostics}
        terrain={currentTerrain}
        activeLayer={activeLayer}
        onRetry={handleRetry}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
