import React, { useState } from 'react';
import { 
  AppCustomizationSettings, 
  MapOverlaySettings, 
  WeatherSettings, 
  CustomMapMarker, 
  CustomMortarConfig, 
  AppTheme, 
  LayoutPreset,
  DistanceUnit,
  ElevationDisplayFormat,
  TextSize
} from '../types';
import { StorageService } from '../services/storageService';
import { TRANSLATIONS } from '../locales/translations';
import { 
  X, 
  Settings, 
  Sliders, 
  Map, 
  Type, 
  MapPin, 
  Crosshair, 
  Wind, 
  Ruler, 
  Languages, 
  Layout, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Trash2, 
  Plus, 
  Copy, 
  AlertTriangle,
  Info,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppCustomizationSettings;
  onUpdateSettings: (updated: Partial<AppCustomizationSettings>) => void;
  overlays: MapOverlaySettings;
  onUpdateOverlays: (updated: Partial<MapOverlaySettings>) => void;
  weather: WeatherSettings;
  onUpdateWeather: (updated: Partial<WeatherSettings>) => void;
  customMarkers: CustomMapMarker[];
  onAddMarker: (marker: CustomMapMarker) => void;
  onDeleteMarker: (id: string) => void;
  customMortars: CustomMortarConfig[];
  onAddMortar: (mortar: CustomMortarConfig) => void;
  onDeleteMortar: (id: string) => void;
  onImportBackup: (importedData: any) => void;
  onResetSection: (section: 'appearance' | 'map' | 'mortar' | 'language' | 'all' | 'userData' | 'factory' | 'visibility') => void;
  onQuickMapOnly?: () => void;
  onQuickShowAll?: () => void;
  onQuickRestoreDefault?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  overlays,
  onUpdateOverlays,
  weather,
  onUpdateWeather,
  customMarkers,
  onAddMarker,
  onDeleteMarker,
  customMortars,
  onAddMortar,
  onDeleteMortar,
  onImportBackup,
  onResetSection,
  onQuickMapOnly,
  onQuickShowAll,
  onQuickRestoreDefault,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[settings.language];
  const isAr = settings.language === 'ar';

  // Active expanded accordion categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    general: true,
    interfaceVisibility: true,
    mapAppearance: false,
    mapLabels: false,
    markers: false,
    mortarConfig: false,
    weather: false,
    measurementUnits: false,
    language: false,
    interfaceLayout: false,
    storagePrivacy: false,
    importExport: false,
    resetRecovery: false,
  });

  const toggleCategory = (key: string) => {
    setExpandedCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // State for adding custom mortar record
  const [newMortarName, setNewMortarName] = useState('');
  const [newMortarCaliber, setNewMortarCaliber] = useState('81 mm');
  const [newMortarMils, setNewMortarMils] = useState<6400 | 6000>(6400);
  const [newMortarMinElev, setNewMortarMinElev] = useState(800);
  const [newMortarMaxElev, setNewMortarMaxElev] = useState(1515);

  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExport = () => {
    StorageService.exportBackupFile(
      settings,
      overlays,
      weather,
      customMarkers,
      customMortars
    );
    notify(t.storage.exportSuccess);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = StorageService.validateAndParseImport(content);
      if (parsed) {
        onImportBackup(parsed);
        notify(t.storage.importSuccess);
      } else {
        alert(t.storage.importError);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCreateMortar = () => {
    if (!newMortarName.trim()) return;
    const degPerMil = 360 / newMortarMils;
    const minDeg = Math.round(((newMortarMinElev * degPerMil) * 10)) / 10;
    const maxDeg = Math.round(((newMortarMaxElev * degPerMil) * 10)) / 10;

    const custom: CustomMortarConfig = {
      id: `custom_${Date.now()}`,
      name: newMortarName.trim(),
      shortName: newMortarName.trim().slice(0, 8),
      caliber: newMortarCaliber.trim(),
      milSystem: newMortarMils === 6000 ? 'SOVIET' : 'NATO',
      milsPerCircle: newMortarMils,
      minElevation: newMortarMinElev,
      maxElevation: newMortarMaxElev,
      minElevationDeg: minDeg,
      maxElevationDeg: maxDeg,
      verificationStatus: 'User-Defined Configuration Profile',
      sourceInfo: 'Manual user custom configuration entry',
      description: `Custom ${newMortarCaliber} mortar system profile with ${newMortarMils} mil circular division.`,
      isUserDefined: true,
    };

    onAddMortar(custom);
    setNewMortarName('');
    notify(isAr ? 'تمت إضافة سجل الهاون المخصص بنجاح' : 'Custom mortar profile added successfully');
  };

  const handlePresetSelect = (preset: LayoutPreset) => {
    let panelWidth = 420;
    let fcsPanelOpen = true;

    if (preset === 'minimal_map') {
      fcsPanelOpen = false;
      panelWidth = 360;
    } else if (preset === 'compact') {
      panelWidth = 360;
      fcsPanelOpen = true;
    } else if (preset === 'standard') {
      panelWidth = 420;
      fcsPanelOpen = true;
    } else if (preset === 'info_rich') {
      panelWidth = 500;
      fcsPanelOpen = true;
    }

    onUpdateSettings({
      layoutPreset: preset,
      panelWidth,
      fcsPanelOpen,
    });
    notify(isAr ? `تم تطبيق المظهر المسبق: ${preset}` : `Applied layout preset: ${preset}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col w-full max-w-3xl max-h-[92vh] overflow-hidden text-slate-200"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white uppercase font-mono tracking-wide">
                {t.settingsTitle}
              </h2>
              <p className="text-[10px] text-slate-400">
                {isAr ? 'تخصيص كامل للواجهة، طبقات الخريطة، مواصفات الهاون والبيانات' : 'Complete control over UI, map layers, mortar records & storage'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Temporary Notification Banner */}
        {notification && (
          <div className="bg-emerald-950/90 border-b border-emerald-500 text-emerald-300 px-4 py-2 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-150">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Scrollable Categories List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 font-mono text-xs">
          
          {/* 1. GENERAL SETTINGS */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => toggleCategory('general')}
              className="w-full p-3 bg-slate-950/80 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-sky-400" />
                <span>{t.settingsCategories.general}</span>
              </div>
              {expandedCategories.general ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.general && (
              <div className="p-4 space-y-4 border-t border-slate-800/80">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
                    {isAr ? 'أنماط التخطيط السريعة (Layout Presets)' : 'Layout Presets'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['minimal_map', 'compact', 'standard', 'info_rich'] as LayoutPreset[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePresetSelect(p)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          settings.layoutPreset === p
                            ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="capitalize block text-[11px]">{p.replace('_', ' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-850">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">
                      {isAr ? 'حجم الخط والنصوص' : 'UI Text Size'}
                    </label>
                    <div className="flex gap-2">
                      {(['sm', 'md', 'lg'] as TextSize[]).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => onUpdateSettings({ textSize: sz })}
                          className={`flex-1 py-1.5 rounded border text-center uppercase font-bold text-xs ${
                            settings.textSize === sz
                              ? 'bg-sky-500 text-slate-950 border-sky-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">
                      {isAr ? 'عرض لوحة التحكم (بالبكسل)' : 'Panel Width (px)'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="340"
                        max="560"
                        step="10"
                        value={settings.panelWidth}
                        onChange={(e) => onUpdateSettings({ panelWidth: parseInt(e.target.value, 10) })}
                        className="flex-1 accent-sky-500 cursor-pointer"
                      />
                      <span className="w-12 text-center font-bold text-sky-400">{settings.panelWidth}px</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INTERFACE VISIBILITY & CONTROLS */}
          <div className="border border-sky-500/40 rounded-xl overflow-hidden bg-slate-950/60 shadow-lg">
            <button
              onClick={() => toggleCategory('interfaceVisibility')}
              className="w-full p-3 bg-slate-950/90 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <span className="text-sky-300 font-bold">{t.settingsCategories.interfaceVisibility}</span>
              </div>
              {expandedCategories.interfaceVisibility ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.interfaceVisibility && (
              <div className="p-4 space-y-4 border-t border-slate-800/80">
                <p className="text-[11px] text-slate-400">
                  {t.visibility.description}
                </p>

                {/* Quick Presets */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-2 uppercase">
                    {t.visibility.quickActions}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => {
                        if (onQuickMapOnly) {
                          onQuickMapOnly();
                        } else {
                          onUpdateSettings(StorageService.setMapOnly(settings));
                        }
                        notify(t.visibility.mapOnly);
                      }}
                      className="p-2.5 rounded-lg border border-sky-500/30 bg-sky-950/40 hover:bg-sky-900/50 text-left flex flex-col justify-between transition-all"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-sky-300 text-xs mb-1">
                        <EyeOff className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{t.visibility.mapOnly}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">100% Full Map</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onQuickMapOnly) {
                          onQuickMapOnly();
                        } else {
                          onUpdateSettings(StorageService.setMapOnly(settings));
                        }
                        notify(t.visibility.hideAll);
                      }}
                      className="p-2.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-left flex flex-col justify-between transition-all"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-slate-200 text-xs mb-1">
                        <EyeOff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{t.visibility.hideAll}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Hide Optional Bars</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onQuickShowAll) {
                          onQuickShowAll();
                        } else {
                          onUpdateSettings(StorageService.setShowAll(settings));
                        }
                        notify(t.visibility.showAll);
                      }}
                      className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50 text-left flex flex-col justify-between transition-all"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-xs mb-1">
                        <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{t.visibility.showAll}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">All Elements & Panels</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onQuickRestoreDefault) {
                          onQuickRestoreDefault();
                        } else {
                          onUpdateSettings(StorageService.resetVisibility(settings));
                        }
                        notify(t.visibility.restoreDefaults);
                      }}
                      className="p-2.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-left flex flex-col justify-between transition-all"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs mb-1">
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{t.visibility.restoreDefaults}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Map-Only Default</span>
                    </button>
                  </div>
                </div>

                {/* Individual Component Toggles */}
                <div className="border-t border-slate-800/80 pt-3">
                  <label className="text-[11px] font-bold text-slate-400 block mb-2 uppercase">
                    {t.visibility.componentsTitle}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { key: 'showHeader', label: t.visibility.showHeader },
                      { key: 'showTerrainTabs', label: t.visibility.showTerrainTabs },
                      { key: 'showMobileTabs', label: t.visibility.showMobileTabs },
                      { key: 'showLiveSolutionPill', label: t.visibility.showLiveSolutionPill },
                      { key: 'showMapTypeSelector', label: t.visibility.showMapTypeSelector },
                      { key: 'showMarkerControls', label: t.visibility.showMarkerControls },
                      { key: 'showMapTools', label: t.visibility.showMapTools },
                      { key: 'showFcsButton', label: t.visibility.showFcsButton },
                      { key: 'showSettingsButton', label: t.visibility.showSettingsButton },
                      { key: 'showZoomControls', label: t.visibility.showZoomControls },
                      { key: 'showBottomCoordinatesHud', label: t.visibility.showBottomCoordinatesHud },
                    ].map((item) => {
                      const isChecked = !!(settings.visibility as any)[item.key];
                      return (
                        <div
                          key={item.key}
                          onClick={() => {
                            onUpdateSettings({
                              visibility: {
                                ...settings.visibility,
                                [item.key]: !isChecked,
                              },
                            });
                          }}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-850 border border-slate-800 cursor-pointer transition-colors"
                        >
                          <span className="text-xs text-slate-300 select-none">
                            {item.label}
                          </span>
                          <div
                            className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center shrink-0 ${
                              isChecked ? 'bg-sky-500 justify-end' : 'bg-slate-700 justify-start'
                            }`}
                          >
                            <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Three-Dot Menu Button Position & Size Customization */}
                <div className="border-t border-slate-800/80 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
                        {t.visibility.menuPosition}
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {[
                          { id: 'top-right', label: isAr ? 'أعلى اليمين' : 'Top Right' },
                          { id: 'top-left', label: isAr ? 'أعلى اليسار' : 'Top Left' },
                          { id: 'bottom-right', label: isAr ? 'أسفل اليمين' : 'Bottom Right' },
                          { id: 'bottom-left', label: isAr ? 'أسفل اليسار' : 'Bottom Left' },
                        ].map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              onUpdateSettings({
                                visibility: {
                                  ...settings.visibility,
                                  menuButtonPosition: p.id as any,
                                },
                              });
                            }}
                            className={`p-2 rounded border text-xs font-semibold ${
                              settings.visibility.menuButtonPosition === p.id
                                ? 'bg-sky-500/20 text-sky-300 border-sky-400'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
                        {t.visibility.menuSize}
                      </label>
                      <div className="flex gap-2">
                        {[
                          { id: 'sm', label: isAr ? 'صغير' : 'Small' },
                          { id: 'md', label: isAr ? 'متوسط' : 'Medium' },
                          { id: 'lg', label: isAr ? 'كبير' : 'Large' },
                        ].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              onUpdateSettings({
                                visibility: {
                                  ...settings.visibility,
                                  menuButtonSize: s.id as any,
                                },
                              });
                            }}
                            className={`flex-1 py-2 rounded border text-xs font-semibold ${
                              settings.visibility.menuButtonSize === s.id
                                ? 'bg-sky-500 text-slate-950 font-bold border-sky-400'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. MAP APPEARANCE */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => toggleCategory('mapAppearance')}
              className="w-full p-3 bg-slate-950/80 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-emerald-400" />
                <span>{t.settingsCategories.mapAppearance}</span>
              </div>
              {expandedCategories.mapAppearance ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.mapAppearance && (
              <div className="p-4 space-y-4 border-t border-slate-800/80">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
                    {isAr ? 'سمة الواجهة والمظهر (Theme)' : 'Color Theme'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'dark_tactical', label: 'Dark Tactical' },
                      { id: 'night_ops', label: 'Night Ops (OLED)' },
                      { id: 'forest_slate', label: 'Forest Woodland' },
                      { id: 'desert_camo', label: 'Desert Camo' },
                      { id: 'high_contrast', label: 'High Contrast' },
                    ].map((th) => (
                      <button
                        key={th.id}
                        onClick={() => onUpdateSettings({ theme: th.id as AppTheme })}
                        className={`p-2 rounded border text-left text-xs transition-all ${
                          settings.theme === th.id
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {th.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-850">
                  <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <span>{isAr ? 'عرض شبكة 1 كم الرئيسية' : '1 km Major Tactical Grid'}</span>
                    <input
                      type="checkbox"
                      checked={overlays.showGrid}
                      onChange={(e) => onUpdateOverlays({ showGrid: e.target.checked })}
                      className="w-4 h-4 accent-sky-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <span>{isAr ? 'عرض شبكة 100 م الدقيقة' : '100m Minor Tactical Grid'}</span>
                    <input
                      type="checkbox"
                      checked={overlays.show100mGrid}
                      onChange={(e) => onUpdateOverlays({ show100mGrid: e.target.checked })}
                      className="w-4 h-4 accent-sky-500 rounded"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 3. MAP LABELS & TEXT */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => toggleCategory('mapLabels')}
              className="w-full p-3 bg-slate-950/80 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-sky-400" />
                <span>{t.settingsCategories.mapLabels}</span>
              </div>
              {expandedCategories.mapLabels ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.mapLabels && (
              <div className="p-4 space-y-3 border-t border-slate-800/80">
                <p className="text-[11px] text-slate-400 mb-2">
                  {isAr 
                    ? 'التحكم المستقل في إظهار أو إخفاء تسميات المواقع، المدن، القرى، والتلال دون التأثير على طبقات الخريطة الأساسية.'
                    : 'Independent visibility controls for geographic place names, towns, villages, and elevation landmarks.'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <span>{isAr ? 'العواصم والمدن الكبرى' : 'Capitals'}</span>
                    <input
                      type="checkbox"
                      checked={overlays.showCapitals}
                      onChange={(e) => onUpdateOverlays({ showCapitals: e.target.checked })}
                      className="w-4 h-4 accent-sky-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <span>{isAr ? 'البلدات' : 'Towns'}</span>
                    <input
                      type="checkbox"
                      checked={overlays.showTowns}
                      onChange={(e) => onUpdateOverlays({ showTowns: e.target.checked })}
                      className="w-4 h-4 accent-sky-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <span>{isAr ? 'القرى والمزارع' : 'Villages'}</span>
                    <input
                      type="checkbox"
                      checked={overlays.showVillages}
                      onChange={(e) => onUpdateOverlays({ showVillages: e.target.checked })}
                      className="w-4 h-4 accent-sky-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <span>{isAr ? 'التلال والارتفاعات' : 'Hills / Elevations'}</span>
                    <input
                      type="checkbox"
                      checked={overlays.showHills}
                      onChange={(e) => onUpdateOverlays({ showHills: e.target.checked })}
                      className="w-4 h-4 accent-sky-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <span>{isAr ? 'المعالم العسكرية والمنشآت' : 'Military Landmarks'}</span>
                    <input
                      type="checkbox"
                      checked={overlays.showLandmarks}
                      onChange={(e) => onUpdateOverlays({ showLandmarks: e.target.checked })}
                      className="w-4 h-4 accent-sky-500 rounded"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 4. MARKERS & LOCATIONS */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => toggleCategory('markers')}
              className="w-full p-3 bg-slate-950/80 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>{t.settingsCategories.markers}</span>
                <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.2 rounded border border-rose-800">
                  {customMarkers.length} {isAr ? 'علامات' : 'Custom'}
                </span>
              </div>
              {expandedCategories.markers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.markers && (
              <div className="p-4 space-y-4 border-t border-slate-800/80">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <span>{isAr ? 'مربض الهاون' : 'Gun Position'}</span>
                    <input
                      type="checkbox"
                      checked={overlays.showGunMarker}
                      onChange={(e) => onUpdateOverlays({ showGunMarker: e.target.checked })}
                      className="w-4 h-4 accent-sky-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <span>{isAr ? 'موقع الهدف' : 'Target Marker'}</span>
                    <input
                      type="checkbox"
                      checked={overlays.showTargetMarker}
                      onChange={(e) => onUpdateOverlays({ showTargetMarker: e.target.checked })}
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <span>{isAr ? 'خط المسار الباليستي' : 'Trajectory Line'}</span>
                    <input
                      type="checkbox"
                      checked={overlays.showTrajectoryLine}
                      onChange={(e) => onUpdateOverlays({ showTrajectoryLine: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                    <span>{isAr ? 'دوائر المدى (Rings)' : 'Range Rings'}</span>
                    <input
                      type="checkbox"
                      checked={overlays.showRangeRings}
                      onChange={(e) => onUpdateOverlays({ showRangeRings: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                  </label>
                </div>

                {/* Custom Markers Management */}
                <div className="pt-3 border-t border-slate-850">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-300">
                      {isAr ? 'سجل العلامات التكتيكية المخصصة' : 'Tactical Custom Markers Registry'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {customMarkers.length} {isAr ? 'علامة محفوظة' : 'saved in browser'}
                    </span>
                  </div>

                  {customMarkers.length === 0 ? (
                    <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-xs">
                      {isAr 
                        ? 'لا توجد علامات مخصصة حالياً. يمكنك استخدام زر "إضافة علامة" على الخارطة لإسقاط نقاط تكتيكية.'
                        : 'No custom tactical markers created yet. Use the Tactical Marker button on the map to place custom waypoints.'}
                    </div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {customMarkers.map((m) => (
                        <div
                          key={m.id}
                          className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: m.color }}
                            />
                            <span className="font-bold text-white">{m.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({m.x.toFixed(0)}, {m.z.toFixed(0)})
                            </span>
                          </div>
                          <button
                            onClick={() => onDeleteMarker(m.id)}
                            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/60 transition-colors"
                            title={t.deleteMarker}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 5. MORTAR CONFIGURATION & PROFILES */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => toggleCategory('mortarConfig')}
              className="w-full p-3 bg-slate-950/80 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-amber-400" />
                <span>{t.settingsCategories.mortarConfig}</span>
              </div>
              {expandedCategories.mortarConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.mortarConfig && (
              <div className="p-4 space-y-4 border-t border-slate-800/80">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-300 block text-xs uppercase">
                    {isAr ? 'المواصفات المرجعية الأساسية للهاونات' : 'Standard Weapon Reference Baselines'}
                  </span>
                  
                  {/* American M252 Baseline Box */}
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>🇺🇸</span>
                        <span>M252 (81 mm)</span>
                        <span className="text-[9px] bg-sky-950 text-sky-400 px-1 rounded">6400 mil</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {isAr ? 'الحد الأدنى: 800 مل ≈ 45.0° | الحد الأقصى: 1515 مل ≈ 85.2°' : 'Min: 800 mil ≈ 45.0° | Max: 1515 mil ≈ 85.2°'}
                      </div>
                    </div>
                    <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                      {isAr ? 'يتطلب التحقق من اللعبة' : 'Requires verification'}
                    </span>
                  </div>

                  {/* Russian 2B14 Baseline Box */}
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>🇷🇺</span>
                        <span>2B14 (82 mm)</span>
                        <span className="text-[9px] bg-rose-950 text-rose-400 px-1 rounded">6000 mil</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {isAr ? 'الحد الأدنى: 748 مل ≈ 44.9° | الحد الأقصى: 1415 مل ≈ 84.9°' : 'Min: 748 mil ≈ 44.9° | Max: 1415 mil ≈ 84.9°'}
                      </div>
                    </div>
                    <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                      {isAr ? 'يتطلب التحقق من اللعبة' : 'Requires verification'}
                    </span>
                  </div>
                </div>

                {/* Display Formatting & Precision */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-850">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">
                      {isAr ? 'صيغة عرض زاوية الارتفاع' : 'Elevation Display Format'}
                    </label>
                    <select
                      value={settings.elevationDisplayFormat}
                      onChange={(e) => onUpdateSettings({ elevationDisplayFormat: e.target.value as ElevationDisplayFormat })}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"
                    >
                      <option value="both">{isAr ? 'الدرجات والمل معاً (Both)' : 'Both (Degrees & Mils)'}</option>
                      <option value="degrees_first">{isAr ? 'الدرجات أولاً (Degrees First)' : 'Degrees First'}</option>
                      <option value="mils_first">{isAr ? 'المل أولاً (Mils First)' : 'Mils First'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">
                      {isAr ? 'دقة المنازل العشرية (Decimal Precision)' : 'Decimal Precision'}
                    </label>
                    <div className="flex gap-2">
                      {[0, 1, 2].map((dec) => (
                        <button
                          key={dec}
                          onClick={() => onUpdateSettings({ decimalPrecision: dec })}
                          className={`flex-1 py-1.5 rounded border text-center font-bold text-xs ${
                            settings.decimalPrecision === dec
                              ? 'bg-sky-500 text-slate-950 border-sky-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {dec} {isAr ? 'منازل' : 'dec'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add User-Defined Custom Mortar Form */}
                <div className="pt-3 border-t border-slate-850 space-y-2">
                  <span className="font-bold text-slate-300 block text-xs">
                    {isAr ? 'إضافة سجل هاون مخصص جديد (User-Defined)' : 'Add User-Defined Custom Mortar Record'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder={isAr ? 'اسم الهاون' : 'Mortar Name'}
                      value={newMortarName}
                      onChange={(e) => setNewMortarName(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder={isAr ? 'العيار (مثال: 81mm)' : 'Caliber (e.g. 81mm)'}
                      value={newMortarCaliber}
                      onChange={(e) => setNewMortarCaliber(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"
                    />
                    <select
                      value={newMortarMils}
                      onChange={(e) => setNewMortarMils(parseInt(e.target.value, 10) as 6400 | 6000)}
                      className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"
                    >
                      <option value="6400">6400 Mils (NATO)</option>
                      <option value="6000">6000 Mils (Warsaw)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] text-slate-500">
                      {isAr ? 'يحفظ كملف تعريف مخصص في المتصفح' : 'Saves profile in browser local storage'}
                    </span>
                    <button
                      onClick={handleCreateMortar}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'حفظ السجل' : 'Add Profile'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. WEATHER & WIND DISPLAY */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => toggleCategory('weather')}
              className="w-full p-3 bg-slate-950/80 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-sky-400" />
                <span>{t.settingsCategories.weather}</span>
              </div>
              {expandedCategories.weather ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.weather && (
              <div className="p-4 space-y-3 border-t border-slate-800/80">
                <label className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                  <span>{isAr ? 'تفعيل نافذة رصد الطقس والرياح على الخارطة' : 'Show Weather HUD on Map'}</span>
                  <input
                    type="checkbox"
                    checked={settings.weatherPanelOpen}
                    onChange={(e) => onUpdateSettings({ weatherPanelOpen: e.target.checked })}
                    className="w-4 h-4 accent-sky-500 rounded"
                  />
                </label>

                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>{isAr ? 'السرعة الحالية:' : 'Current Speed:'}</span>
                    <span className="text-white font-bold">{weather.windSpeed} {weather.windUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isAr ? 'الاتجاه:' : 'Direction:'}</span>
                    <span className="text-sky-300 font-bold">{weather.windDirectionDeg}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isAr ? 'التصنيف:' : 'Category:'}</span>
                    <span className="text-amber-400 font-bold">{isAr ? 'رصد ميداني يدوي' : 'Manual User Observation'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 7. MEASUREMENT UNITS */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => toggleCategory('measurementUnits')}
              className="w-full p-3 bg-slate-950/80 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-indigo-400" />
                <span>{t.settingsCategories.measurementUnits}</span>
              </div>
              {expandedCategories.measurementUnits ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.measurementUnits && (
              <div className="p-4 space-y-3 border-t border-slate-800/80">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
                    {isAr ? 'وحدة قياس المسافة' : 'Distance Measurement Unit'}
                  </label>
                  <div className="flex gap-2">
                    {(['meters', 'kilometers'] as DistanceUnit[]).map((u) => (
                      <button
                        key={u}
                        onClick={() => onUpdateSettings({ distanceUnit: u })}
                        className={`flex-1 py-2 rounded border text-center font-bold capitalize text-xs ${
                          settings.distanceUnit === u
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 8. LANGUAGE & TRANSLATION */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => toggleCategory('language')}
              className="w-full p-3 bg-slate-950/80 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-sky-400" />
                <span>{t.settingsCategories.language}</span>
                <span className="text-[10px] bg-slate-800 text-sky-300 px-1.5 py-0.2 rounded border border-slate-700">
                  {settings.language === 'ar' ? 'العربية' : 'English'}
                </span>
              </div>
              {expandedCategories.language ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.language && (
              <div className="p-4 space-y-3 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onUpdateSettings({ language: 'en' })}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      settings.language === 'en'
                        ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">English (US)</div>
                      <div className="text-[10px] opacity-75">Left-to-Right (LTR)</div>
                    </div>
                    {settings.language === 'en' && <Check className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onUpdateSettings({ language: 'ar' })}
                    className={`p-3 rounded-xl border text-right flex items-center justify-between transition-all ${
                      settings.language === 'ar'
                        ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">العربية (Arabic)</div>
                      <div className="text-[10px] opacity-75">من اليمين لليسار (RTL)</div>
                    </div>
                    {settings.language === 'ar' && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 9. INTERFACE LAYOUT */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => toggleCategory('interfaceLayout')}
              className="w-full p-3 bg-slate-950/80 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-purple-400" />
                <span>{t.settingsCategories.interfaceLayout}</span>
              </div>
              {expandedCategories.interfaceLayout ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.interfaceLayout && (
              <div className="p-4 space-y-3 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">
                      {isAr ? 'موقع لوحة الحاسبة (FCS)' : 'FCS Panel Docking'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateSettings({ panelPosition: 'left' })}
                        className={`flex-1 py-1.5 rounded border text-xs font-bold ${
                          settings.panelPosition === 'left'
                            ? 'bg-purple-600 text-white border-purple-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {isAr ? 'اليسار' : 'Left'}
                      </button>
                      <button
                        onClick={() => onUpdateSettings({ panelPosition: 'right' })}
                        className={`flex-1 py-1.5 rounded border text-xs font-bold ${
                          settings.panelPosition === 'right'
                            ? 'bg-purple-600 text-white border-purple-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {isAr ? 'اليمين' : 'Right'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">
                      {isAr ? 'شفافية اللوحات' : 'Panel Opacity'}
                    </label>
                    <div className="flex gap-2">
                      {[80, 90, 95, 100].map((op) => (
                        <button
                          key={op}
                          onClick={() => onUpdateSettings({ panelOpacity: op })}
                          className={`flex-1 py-1.5 rounded border text-xs font-bold ${
                            settings.panelOpacity === op
                              ? 'bg-purple-600 text-white border-purple-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {op}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 10. DATA STORAGE & PRIVACY */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => toggleCategory('storagePrivacy')}
              className="w-full p-3 bg-slate-950/80 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                <span>{t.settingsCategories.storagePrivacy}</span>
              </div>
              {expandedCategories.storagePrivacy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.storagePrivacy && (
              <div className="p-4 space-y-3 border-t border-slate-800/80 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isAr ? 'الخصوصية والتخزين المحلي الحصري' : 'Zero-Telemetry & 100% Client-Side Privacy'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {t.storage.description}
                  </p>
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-lg flex items-start gap-2 text-amber-300/90 text-[11px] leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>{t.storage.siteDataNotice}</p>
                </div>
              </div>
            )}
          </div>

          {/* 11. IMPORT & EXPORT */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => toggleCategory('importExport')}
              className="w-full p-3 bg-slate-950/80 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{t.settingsCategories.importExport}</span>
              </div>
              {expandedCategories.importExport ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.importExport && (
              <div className="p-4 space-y-3 border-t border-slate-800/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleExport}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500 text-left flex items-center gap-3 transition-all"
                  >
                    <Download className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-bold text-white text-xs">{t.storage.exportButton}</div>
                      <div className="text-[10px] text-slate-400">Download portable JSON backup</div>
                    </div>
                  </button>

                  <label className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-sky-500 text-left flex items-center gap-3 transition-all cursor-pointer">
                    <Upload className="w-5 h-5 text-sky-400" />
                    <div>
                      <div className="font-bold text-white text-xs">{t.storage.importButton}</div>
                      <div className="text-[10px] text-slate-400">Upload & validate JSON backup</div>
                    </div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 12. RESET & RECOVERY */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => toggleCategory('resetRecovery')}
              className="w-full p-3 bg-slate-950/80 flex items-center justify-between font-bold text-slate-200 hover:text-white text-left"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>{t.settingsCategories.resetRecovery}</span>
              </div>
              {expandedCategories.resetRecovery ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedCategories.resetRecovery && (
              <div className="p-4 space-y-2.5 border-t border-slate-800/80">
                <p className="text-[11px] text-slate-400 mb-2">
                  {isAr 
                    ? 'عمليات إعادة الضبط الحبيبية تسمح باستعادة المظهر أو الإعدادات دون حذف العلامات والبيانات التي أنشأتها.'
                    : 'Granular resets allow reverting appearance or map display without deleting your custom created markers.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onResetSection('appearance');
                      notify(isAr ? 'تمت استعادة إعدادات مظهر الواجهة الافتراضية' : 'Restored default interface appearance');
                    }}
                    className="p-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-left flex items-center justify-between"
                  >
                    <span>{isAr ? 'استعادة مظهر الواجهة' : 'Reset Interface Appearance'}</span>
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      onResetSection('map');
                      notify(isAr ? 'تمت استعادة إعدادات عرض الخريطة الافتراضية' : 'Restored default map display settings');
                    }}
                    className="p-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-left flex items-center justify-between"
                  >
                    <span>{isAr ? 'استعادة طبقات وتسميات الخريطة' : 'Reset Map Overlays & Labels'}</span>
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      onResetSection('userData');
                      notify(isAr ? 'تم مسح العلامات وسجلات الهاون المخصصة' : 'Cleared custom markers and user mortars');
                    }}
                    className="p-2.5 rounded bg-amber-950/40 hover:bg-amber-900/40 border border-amber-900/60 text-amber-300 text-left flex items-center justify-between"
                  >
                    <span>{t.storage.clearUserDataOnly}</span>
                    <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(isAr ? 'هل أنت متأكد من رغبتك في إعادة ضبط المصنع ومسح جميع البيانات المحلية؟' : 'Are you sure you want to perform a factory reset? This will erase all local settings and custom markers.')) {
                        onResetSection('factory');
                        notify(isAr ? 'تمت إعادة ضبط المصنع بنجاح' : 'Factory reset completed');
                      }
                    }}
                    className="p-2.5 rounded bg-red-950/60 hover:bg-red-900/60 border border-red-800 text-red-300 text-left flex items-center justify-between"
                  >
                    <span>{t.storage.clearStorageButton}</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-500 font-mono">
            Arma Reforger FCS v1.3.0 • LocalStorage Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs shadow-md transition-all"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
