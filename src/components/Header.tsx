import React from 'react';
import { TerrainId, TerrainConfig, TileDiagnostics, WeaponConfig, BallisticSolution, InterfaceVisibilitySettings } from '../types';
import { 
  Crosshair, 
  Activity, 
  Map as MapIcon, 
  Info,
  Globe
} from 'lucide-react';

interface HeaderProps {
  terrains: Record<TerrainId, TerrainConfig>;
  activeTerrainId: TerrainId;
  onSelectTerrain: (id: TerrainId) => void;
  onOpenDiagnostics: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  onToggleFcs: () => void;
  isFcsOpen: boolean;
  diagnostics: TileDiagnostics;
  solution?: BallisticSolution;
  selectedWeapon?: WeaponConfig;
  lang: 'en' | 'ar';
  onToggleLang: () => void;
  visibility?: InterfaceVisibilitySettings;
}

export const Header: React.FC<HeaderProps> = ({
  terrains,
  activeTerrainId,
  onSelectTerrain,
  onOpenDiagnostics,
  onOpenHelp,
  onOpenSettings,
  onToggleFcs,
  isFcsOpen,
  diagnostics,
  solution,
  selectedWeapon,
  lang,
  onToggleLang,
  visibility,
}) => {
  const isSoviet = selectedWeapon?.milSystem === 'SOVIET';

  const azMilFormatted = solution 
    ? (isSoviet 
        ? `${String(Math.floor(solution.azimuthMils / 100)).padStart(2, '0')}-${String(solution.azimuthMils % 100).padStart(2, '0')}`
        : `${solution.azimuthMils}`)
    : '----';

  const elMilFormatted = solution && solution.elevationMils !== null
    ? (isSoviet
        ? `${String(Math.floor(solution.elevationMils / 100)).padStart(2, '0')}-${String(solution.elevationMils % 100).padStart(2, '0')}`
        : `${solution.elevationMils}`)
    : '----';

  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between z-10 shrink-0 gap-2">
      {/* Brand & Title */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
          <Crosshair className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold tracking-wider text-white font-mono uppercase">
              Arma Reforger <span className="text-sky-400">FCS</span>
            </h1>
            <span className="text-[10px] bg-slate-800 text-sky-300 font-mono px-1.5 py-0.2 rounded border border-slate-700 hidden sm:inline-block">
              Vanilla v1.2+
            </span>
          </div>
          <p className="text-[10px] text-slate-400 tracking-tight hidden md:block">
            {lang === 'ar' 
              ? 'منظومة إدارة النيران وحسابات الهاون التكتيكية'
              : 'Fire Control System & Tactical Artillery Planner'}
          </p>
        </div>
      </div>

      {/* Top Status Bar (Elevation in Degrees, Azimuth, and Ring) - Desktop & Tablet */}
      {(!visibility || visibility.showLiveSolutionPill) && solution && (
        <div className="hidden md:flex items-center gap-2 font-mono text-[11px] bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg shadow-inner">
          <span className="text-sky-400 font-bold flex items-center gap-1">
            <span>AZ:</span>
            <span>{azMilFormatted}</span>
            <span className="text-slate-400 text-[10px] font-normal">({solution.azimuthDeg.toFixed(1)}°)</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span>EL:</span>
            <span>{solution.elevationDeg !== null ? `${solution.elevationDeg.toFixed(1)}°` : '---'}</span>
            {solution.elevationMils !== null && (
              <span className="text-slate-400 text-[10px] font-normal">({elMilFormatted} mil)</span>
            )}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-semibold">
            {lang === 'ar' ? `حلقة ${solution.charge}` : `Ring ${solution.charge}`}
          </span>
        </div>
      )}

      {/* Terrain Selector Tabs */}
      {(!visibility || visibility.showTerrainTabs) && (
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 sm:p-1">
          {(Object.keys(terrains) as TerrainId[]).map((id) => {
            const terrain = terrains[id];
            const isActive = id === activeTerrainId;
            return (
              <button
                key={id}
                onClick={() => onSelectTerrain(id)}
                className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-mono font-bold rounded-md transition-all flex items-center gap-1 sm:gap-1.5 ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MapIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="uppercase">{terrain.name}</span>
                <span className="text-[9px] opacity-75 hidden lg:inline">
                  ({terrain.worldSize === 4096 ? '4.1k' : '12.8k'})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Right Tools, Diagnostics, Settings & Language Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* FCS Panel Toggle Button */}
        {(!visibility || visibility.showFcsButton) && (
          <button
            onClick={onToggleFcs}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
              isFcsOpen
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow'
                : 'bg-slate-900 border-slate-700 text-sky-400 hover:bg-slate-800'
            }`}
            title={lang === 'ar' ? 'إظهار / إخفاء حاسبة الرماية' : 'Toggle Fire Control Panel (FCS)'}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'الحاسبة' : 'FCS'}</span>
          </button>
        )}

        {/* System Settings Button */}
        {(!visibility || visibility.showSettingsButton) && (
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono font-bold rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title={lang === 'ar' ? 'الإعدادات والتخصيص الشامل' : 'System Settings & Customization'}
          >
            <Crosshair className="w-3.5 h-3.5 hidden" />
            <span>⚙️</span>
            <span className="hidden md:inline">{lang === 'ar' ? 'الإعدادات' : 'Settings'}</span>
          </button>
        )}

        {/* Arabic / English Language Toggle */}
        <button
          onClick={onToggleLang}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono font-bold rounded-lg border border-slate-700 bg-slate-900 text-sky-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={lang === 'ar' ? 'التحويل إلى الإنجليزية (English)' : 'Switch to Arabic (العربية)'}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
        </button>

        {/* Developer Diagnostics Button */}
        <button
          onClick={onOpenDiagnostics}
          className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-mono rounded-lg border transition-all ${
            diagnostics.failedCount > 0
              ? 'bg-red-950/60 border-red-500 text-red-300 hover:bg-red-900/60'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Open Developer Map Diagnostics"
        >
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">{lang === 'ar' ? 'التشخيص' : 'Diagnostics'}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              diagnostics.failedCount > 0 ? 'bg-red-500 text-white' : 'bg-slate-800 text-emerald-400'
            }`}
          >
            {diagnostics.failedCount > 0 ? `! ${diagnostics.failedCount}` : 'LIVE'}
          </span>
        </button>

        {/* Quick Help Modal Button */}
        <button
          onClick={onOpenHelp}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="FCS Operation Guide"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
