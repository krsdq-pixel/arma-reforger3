import React from 'react';
import { X, Target, Crosshair, Compass, Layers, ShieldCheck, Map } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-950 text-sky-400 rounded-lg border border-sky-800">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase">
                Arma Reforger FCS Quick Manual
              </h3>
              <p className="text-xs text-slate-400">
                Operating procedures for vanilla artillery & indirect fire control
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-xs text-slate-300">
          {/* Quick Start */}
          <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
            <h4 className="text-sm font-bold text-sky-400 font-mono mb-2 flex items-center gap-2">
              <Crosshair className="w-4 h-4" />
              <span>1. POSITIONING BATTERY & TARGET</span>
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>
                <strong className="text-white">Mouse Dragging:</strong> Grab the blue <b>GUN</b> marker or red <b>T1</b> marker directly on the terrain map to reposition.
              </li>
              <li>
                <strong className="text-white">Click-to-Place:</strong> Use <b>Place Gun</b> or <b>Place Target</b> buttons in the map HUD, then click on the map.
              </li>
              <li>
                <strong className="text-white">Numeric / 6-digit Grid Input:</strong> Enter standard 6-digit grid coordinates (e.g. <i>048 071</i>) or exact meter coordinates (X, Z, Alt) in the sidebar.
              </li>
              <li>
                <strong className="text-white">Terrain Landmarks:</strong> Click any town name or landmark on the map to set it as target or battery position.
              </li>
            </ul>
          </div>

          {/* Ballistic & Mils Systems */}
          <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
            <h4 className="text-sm font-bold text-emerald-400 font-mono mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>2. MIL SYSTEMS & ELEVATION CORRECTION</span>
            </h4>
            <div className="space-y-2">
              <p>
                Arma Reforger accurately differentiates between NATO and Soviet angular mil systems:
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] mt-1">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <div className="text-sky-400 font-bold">NATO 6400 Mils</div>
                  <div className="text-slate-400 text-[10px] mt-1">M252 81mm Mortar</div>
                  <div className="text-slate-300 mt-1">Circle: 6400 mils</div>
                  <div className="text-slate-300">Elev: 800 - 1515 mils</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <div className="text-red-400 font-bold">Soviet 6000 Mils (60-00)</div>
                  <div className="text-slate-400 text-[10px] mt-1">2B14 82mm / SPG-9</div>
                  <div className="text-slate-300 mt-1">Circle: 60-00 (6000 mils)</div>
                  <div className="text-slate-300">Elev: 800 - 1510 mils</div>
                </div>
              </div>
              <p className="mt-2 text-slate-400">
                <strong className="text-slate-200">Height Difference (ΔH):</strong> When firing uphill (target is higher than gun), the mortar tube angle must be depressed slightly (lower mils) to compensate for trajectory intersection. The FCS solver computes this dynamically.
              </p>
            </div>
          </div>

          {/* Supported Vanilla Terrains */}
          <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
            <h4 className="text-sm font-bold text-amber-400 font-mono mb-2 flex items-center gap-2">
              <Map className="w-4 h-4" />
              <span>3. THREE OFFICIAL VANILLA TERRAINS</span>
            </h4>
            <div className="space-y-1.5 text-slate-300">
              <div>
                <strong className="text-white">Everon (12.8 km × 12.8 km):</strong> The flagship terrain featuring 18 towns, Montignac, Saint-Philippe, military airfields, and high-relief hills.
              </div>
              <div>
                <strong className="text-white">Arland (4.1 km × 4.1 km):</strong> High-density tactical island with Arleville, Beauregard, and coastal naval ports.
              </div>
              <div>
                <strong className="text-white">Kolguyev (12.8 km × 12.8 km):</strong> Volcanic terrain with Pobeda base, dormant volcano crater, and geothermal valleys.
              </div>
            </div>
          </div>

          {/* Attribution & Legal */}
          <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 font-mono mb-1.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>4. LEGAL ATTRIBUTION & LICENSING</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Arma Reforger and Enfusion are registered trademarks of Bohemia Interactive a.s. All terrain assets, elevations, and game imagery are property of Bohemia Interactive a.s. Map tiles are rendered from game data via Enfumap under authorized community fair use for player planning and fire control calculation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
