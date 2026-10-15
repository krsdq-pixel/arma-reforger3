import React, { useState, useMemo, useCallback } from 'react';
import { TERRAINS } from './data/maps';
import { WEAPONS, calculateFiringSolution } from './data/ballistics';
import { TerrainId, MapLayerType, TileDiagnostics, WeaponConfig } from './types';
import { Header } from './components/Header';
import { TacticalMap } from './components/TacticalMap';
import { FireControlPanel } from './components/FireControlPanel';
import { DiagnosticsModal } from './components/DiagnosticsModal';
import { HelpModal } from './components/HelpModal';

export default function App() {
  const [activeTerrainId, setActiveTerrainId] = useState<TerrainId>('everon');
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('topo');
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponConfig>(WEAPONS[0]);
  const [selectedCharge, setSelectedCharge] = useState<number>(-1); // -1 = Auto optimal ring
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

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

  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Switch terrain
  const handleSelectTerrain = (id: TerrainId) => {
    setActiveTerrainId(id);
    const newTerrain = TERRAINS[id];
    
    // Reset positions to new map default points of interest
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

    // If Kolguyev doesn't have drawn layer, fall back to topo
    if (id === 'kolguyev' && activeLayer === 'drawn') {
      setActiveLayer('topo');
    }
  };

  // Diagnostics updater
  const handleDiagnosticsUpdate = useCallback((partial: Partial<TileDiagnostics>) => {
    setDiagnostics((prev) => ({ ...prev, ...partial }));
  }, []);

  // Ballistic solution calculation
  const solution = useMemo(() => {
    return calculateFiringSolution(selectedWeapon, gunPos, targetPos, selectedCharge);
  }, [selectedWeapon, gunPos, targetPos, selectedCharge]);

  // Current charge min/max ranges for range ring display (adapts dynamically to active ring)
  const currentChargeObj = selectedWeapon.charges[solution.charge] || selectedWeapon.charges[0];
  const chargeMinRange = currentChargeObj?.minRange || 0;
  const chargeMaxRange = currentChargeObj?.maxRange || 0;

  const handleRetry = useCallback(() => {
    setReloadTrigger((v) => v + 1);
  }, []);

  const [mobileTab, setMobileTab] = useState<'map' | 'calc'>('map');

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Top Header */}
      <Header
        terrains={TERRAINS}
        activeTerrainId={activeTerrainId}
        onSelectTerrain={handleSelectTerrain}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        diagnostics={diagnostics}
      />

      {/* Mobile Mode Switcher Bar (< lg) */}
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
            Tactical Map
          </button>
          <button
            onClick={() => setMobileTab('calc')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded transition-all ${
              mobileTab === 'calc'
                ? 'bg-sky-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Calculator & Sol
          </button>
        </div>

        {/* Quick Solution Pill for Mobile */}
        <div 
          onClick={() => setMobileTab('calc')}
          className="flex items-center gap-2 cursor-pointer font-mono text-[11px] bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800 hover:border-sky-500"
        >
          <span className="text-sky-400 font-bold">AZ: {solution.azimuthMils}</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">EL: {solution.elevationMils ?? '---'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Ring {solution.charge}</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
        {/* Tactical Map (Primary view) */}
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
          />
        </div>

        {/* Fire Control Calculator Sidebar */}
        <div className={`w-full lg:w-[420px] xl:w-[460px] h-full shrink-0 z-10 shadow-2xl ${mobileTab === 'map' ? 'hidden lg:flex' : 'flex'}`}>
          <FireControlPanel
            terrain={currentTerrain}
            weapons={WEAPONS}
            selectedWeapon={selectedWeapon}
            onSelectWeapon={setSelectedWeapon}
            selectedCharge={selectedCharge}
            onSelectCharge={setSelectedCharge}
            gunPos={gunPos}
            targetPos={targetPos}
            onGunChange={setGunPos}
            onTargetChange={setTargetPos}
            solution={solution}
          />
        </div>
      </div>

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
