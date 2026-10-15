import React from 'react';
import { TerrainId, TerrainConfig, TileDiagnostics } from '../types';
import { 
  Crosshair, 
  Activity, 
  Map as MapIcon, 
  Info, 
  Layers, 
  RotateCcw,
  ShieldCheck,
  Radio
} from 'lucide-react';

interface HeaderProps {
  terrains: Record<TerrainId, TerrainConfig>;
  activeTerrainId: TerrainId;
  onSelectTerrain: (id: TerrainId) => void;
  onOpenDiagnostics: () => void;
  onOpenHelp: () => void;
  diagnostics: TileDiagnostics;
}

export const Header: React.FC<HeaderProps> = ({
  terrains,
  activeTerrainId,
  onSelectTerrain,
  onOpenDiagnostics,
  onOpenHelp,
  diagnostics,
}) => {
  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between z-10 shrink-0">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
          <Crosshair className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-wider text-white font-mono uppercase">
              Arma Reforger <span className="text-sky-400">FCS</span>
            </h1>
            <span className="text-[10px] bg-slate-800 text-sky-300 font-mono px-1.5 py-0.2 rounded border border-slate-700 hidden sm:inline-block">
              Vanilla v1.2+
            </span>
          </div>
          <p className="text-[10px] text-slate-400 tracking-tight hidden md:block">
            Fire Control System & Tactical Artillery Planner
          </p>
        </div>
      </div>

      {/* Terrain Selector Tabs (Step 3: Support all three vanilla maps) */}
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

      {/* Right Tools & Diagnostics */}
      <div className="flex items-center gap-2">
        {/* Developer Diagnostics Button */}
        <button
          onClick={onOpenDiagnostics}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border transition-all ${
            diagnostics.failedCount > 0
              ? 'bg-red-950/60 border-red-500 text-red-300 hover:bg-red-900/60'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Open Developer Map Diagnostics"
        >
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Diagnostics</span>
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
