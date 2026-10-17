import React from 'react';
import { 
  AppCustomizationSettings, 
  InterfaceVisibilitySettings 
} from '../types';
import { TRANSLATIONS } from '../locales/translations';
import { 
  MoreVertical, 
  X, 
  Map as MapIcon, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Ruler, 
  Wind, 
  Crosshair, 
  Settings, 
  Globe, 
  Check, 
  Sliders, 
  Eye, 
  EyeOff, 
  Layers, 
  MapPin, 
  Activity, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface ThreeDotMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  settings: AppCustomizationSettings;
  onUpdateSettings: (updated: Partial<AppCustomizationSettings>) => void;
  onQuickMapOnly: () => void;
  onQuickShowAll: () => void;
  onQuickRestoreDefault: () => void;
  onOpenFullSettings: () => void;
  onToggleFcs: () => void;
  isFcsOpen: boolean;
  onToggleWeather: () => void;
  isWeatherOpen: boolean;
  onToggleRuler: () => void;
  isRulerActive: boolean;
  onFitMission: () => void;
  onToggleLang: () => void;
  lang: 'en' | 'ar';
}

export const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({
  isOpen,
  onToggle,
  onClose,
  settings,
  onUpdateSettings,
  onQuickMapOnly,
  onQuickShowAll,
  onQuickRestoreDefault,
  onOpenFullSettings,
  onToggleFcs,
  isFcsOpen,
  onToggleWeather,
  isWeatherOpen,
  onToggleRuler,
  isRulerActive,
  onFitMission,
  onToggleLang,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';
  const v = settings.visibility;

  // Determine button placement
  const pos = v.menuButtonPosition || 'top-right';
  const posClasses = {
    'top-right': 'top-3 right-3 sm:top-4 sm:right-4',
    'top-left': 'top-3 left-3 sm:top-4 sm:left-4',
    'bottom-right': 'bottom-16 right-3 sm:bottom-4 sm:right-4',
    'bottom-left': 'bottom-16 left-3 sm:bottom-4 sm:left-4',
  }[pos];

  // Determine button size
  const size = v.menuButtonSize || 'md';
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs p-1.5',
    md: 'w-10 h-10 text-sm p-2',
    lg: 'w-12 h-12 text-base p-2.5',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  const updateVis = (key: keyof InterfaceVisibilitySettings, val: any) => {
    onUpdateSettings({
      visibility: {
        ...v,
        [key]: val,
      },
    });
  };

  return (
    <>
      {/* Small, unobtrusive floating 3-dot trigger button */}
      <div className={`fixed z-[1050] ${posClasses} pointer-events-auto`}>
        <button
          onClick={onToggle}
          className={`${sizeClasses} rounded-full bg-slate-900/90 hover:bg-slate-800 text-sky-400 hover:text-white border border-slate-700/80 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-500`}
          title={t.visibility.threeDotTooltip}
          aria-label={t.visibility.threeDotTooltip}
        >
          {isOpen ? (
            <X className={iconSizes} />
          ) : (
            <MoreVertical className={iconSizes} />
          )}
        </button>
      </div>

      {/* Floating Tactical Drawer / Popup Menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[1040] bg-slate-950/40 backdrop-blur-xs flex items-start justify-end p-2 sm:p-4 overflow-y-auto"
          onClick={onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            dir={isAr ? 'rtl' : 'ltr'}
            className="w-full max-w-sm sm:max-w-md bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-xl text-slate-200 overflow-hidden mt-12 sm:mt-14 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide font-mono">
                    {t.visibility.threeDotTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'التحكم الفوري في الواجهة والرؤية' : 'Instant Layout & Visibility Controls'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title={t.visibility.closeMenu}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto flex-1 font-sans">
              {/* Quick Display Mode Presets */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {t.visibility.quickActions}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onQuickMapOnly();
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-sky-500/30 bg-sky-950/40 hover:bg-sky-900/50 text-left flex items-start gap-2 text-xs transition-all group"
                  >
                    <EyeOff className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sky-200 group-hover:text-white">
                        {t.visibility.mapOnly}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isAr ? 'إخفاء كافة الأشرطة' : '100% Fullscreen Map'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onQuickShowAll();
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50 text-left flex items-start gap-2 text-xs transition-all group"
                  >
                    <Eye className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-200 group-hover:text-white">
                        {t.visibility.showAll}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isAr ? 'عرض كافة الأشرطة' : 'All bars & controls'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onQuickRestoreDefault();
                      onClose();
                    }}
                    className="col-span-2 p-2 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.visibility.restoreDefaults}</span>
                  </button>
                </div>
              </div>

              {/* Instant Tactical Action Buttons */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {isAr ? 'إجراءات تكتيكية فورية' : 'Quick Actions'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* FCS Calculator Panel Toggle */}
                  <button
                    onClick={onToggleFcs}
                    className={`p-2 rounded-lg border flex items-center gap-2 font-bold transition-all ${
                      isFcsOpen
                        ? 'bg-sky-500 text-slate-950 border-sky-400 shadow'
                        : 'bg-slate-800 border-slate-700 text-sky-400 hover:bg-slate-750'
                    }`}
                  >
                    <Crosshair className="w-4 h-4 shrink-0" />
                    <span className="truncate">{isAr ? 'لوحة الحاسبة (FCS)' : 'FCS Calculator'}</span>
                  </button>

                  {/* Weather & Wind HUD Toggle */}
                  <button
                    onClick={onToggleWeather}
                    className={`p-2 rounded-lg border flex items-center gap-2 font-bold transition-all ${
                      isWeatherOpen
                        ? 'bg-sky-500 text-slate-950 border-sky-400 shadow'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <Wind className="w-4 h-4 shrink-0" />
                    <span className="truncate">{isAr ? 'رصد الرياح' : 'Wind HUD'}</span>
                  </button>

                  {/* Tactical Distance Ruler */}
                  <button
                    onClick={onToggleRuler}
                    className={`p-2 rounded-lg border flex items-center gap-2 font-bold transition-all ${
                      isRulerActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                        : 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750'
                    }`}
                  >
                    <Ruler className="w-4 h-4 shrink-0" />
                    <span className="truncate">{isAr ? 'مسطرة القياس' : 'Tactical Ruler'}</span>
                  </button>

                  {/* Center Mission */}
                  <button
                    onClick={() => {
                      onFitMission();
                      onClose();
                    }}
                    className="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white flex items-center gap-2 font-semibold transition-all"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0 text-slate-400" />
                    <span className="truncate">{isAr ? 'توسيط المهمة' : 'Center Mission'}</span>
                  </button>
                </div>
              </div>

              {/* Individual Element Visibility Switches */}
              <div className="border-t border-slate-800 pt-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {t.visibility.componentsTitle}
                </label>
                <div className="space-y-1.5">
                  {[
                    { key: 'showHeader', label: t.visibility.showHeader },
                    { key: 'showTerrainTabs', label: t.visibility.showTerrainTabs },
                    { key: 'showMobileTabs', label: t.visibility.showMobileTabs },
                    { key: 'showLiveSolutionPill', label: t.visibility.showLiveSolutionPill },
                    { key: 'showMapTypeSelector', label: t.visibility.showMapTypeSelector },
                    { key: 'showMarkerControls', label: t.visibility.showMarkerControls },
                    { key: 'showMapTools', label: t.visibility.showMapTools },
                    { key: 'showFcsButton', label: t.visibility.showFcsButton },
                    { key: 'showZoomControls', label: t.visibility.showZoomControls },
                    { key: 'showBottomCoordinatesHud', label: t.visibility.showBottomCoordinatesHud },
                  ].map((item) => {
                    const isChecked = !!(v as any)[item.key];
                    return (
                      <div
                        key={item.key}
                        onClick={() => updateVis(item.key as any, !isChecked)}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer transition-colors"
                      >
                        <span className="text-xs text-slate-300 select-none">
                          {item.label}
                        </span>
                        <div
                          className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center ${
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

              {/* Three-Dot Menu Position Customizer */}
              <div className="border-t border-slate-800 pt-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {t.visibility.menuPosition}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {[
                    { id: 'top-right', label: isAr ? 'أعلى اليمين' : 'Top Right' },
                    { id: 'top-left', label: isAr ? 'أعلى اليسار' : 'Top Left' },
                    { id: 'bottom-right', label: isAr ? 'أسفل اليمين' : 'Bottom Right' },
                    { id: 'bottom-left', label: isAr ? 'أسفل اليسار' : 'Bottom Left' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => updateVis('menuButtonPosition', p.id)}
                      className={`p-2 rounded-lg border text-xs transition-all ${
                        v.menuButtonPosition === p.id
                          ? 'bg-sky-500/20 text-sky-300 border-sky-400'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Actions: Switch Language & Open All Settings */}
              <div className="border-t border-slate-800 pt-3 flex items-center gap-2">
                <button
                  onClick={onToggleLang}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 flex items-center justify-center gap-2 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{isAr ? 'English (EN)' : 'العربية (AR)'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenFullSettings();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl border border-sky-500 bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span>{t.visibility.openFullSettings}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
