import React, { useState, useEffect } from 'react';
import { TileDiagnostics, TerrainConfig, MapLayerType } from '../types';
import { 
  Activity, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink,
  Wifi,
  Radio,
  Server
} from 'lucide-react';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnostics: TileDiagnostics;
  terrain: TerrainConfig;
  activeLayer: MapLayerType;
  onRetry: () => void;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  isOpen,
  onClose,
  diagnostics,
  terrain,
  activeLayer,
  onRetry,
}) => {
  const [copied, setCopied] = useState(false);
  const [pingStatus, setPingStatus] = useState<{
    testing: boolean;
    reachable: boolean | null;
    status: number | null;
    latencyMs: number | null;
    checkedAt: string | null;
  }>({
    testing: false,
    reachable: null,
    status: null,
    latencyMs: null,
    checkedAt: null,
  });

  // Test map source reachability
  const testReachability = async () => {
    setPingStatus((prev) => ({ ...prev, testing: true }));
    const startTime = performance.now();
    try {
      // Test the root tile (0/0/0.webp)
      const testUrl = `https://enfumap.com/tiles/${terrain.id}/0/0/0.webp`;
      const res = await fetch(testUrl, { method: 'HEAD', mode: 'cors' });
      const latency = Math.round(performance.now() - startTime);

      setPingStatus({
        testing: false,
        reachable: res.ok,
        status: res.status,
        latencyMs: latency,
        checkedAt: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      setPingStatus({
        testing: false,
        reachable: false,
        status: 0,
        latencyMs: null,
        checkedAt: new Date().toLocaleTimeString(),
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      testReachability();
    }
  }, [isOpen, terrain.id]);

  if (!isOpen) return null;

  const copyReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      terrain: terrain.name,
      terrainId: terrain.id,
      worldSize: `${terrain.worldSize}m`,
      activeLayer,
      urlTemplate: diagnostics.urlTemplate,
      currentZoom: diagnostics.currentZoom.toFixed(2),
      loadedTiles: diagnostics.loadedCount,
      failedTiles: diagnostics.failedCount,
      lastError: diagnostics.lastError || 'None',
      sourceReachable: pingStatus.reachable ? `Reachable (HTTP ${pingStatus.status}, ${pingStatus.latencyMs}ms)` : 'Unreachable / Testing',
    };
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-sky-950 text-sky-400 rounded-lg border border-sky-800">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Map Engine Diagnostics
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Real-time tile telemetry and source reachability inspector
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {/* Reachability Status */}
          <div className="p-3.5 rounded-lg border bg-slate-950/70 border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Server className="w-4 h-4 text-sky-400" />
                <span>TILE PROVIDER REACHABILITY</span>
              </div>
              <button
                onClick={testReachability}
                disabled={pingStatus.testing}
                className="flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${pingStatus.testing ? 'animate-spin' : ''}`} />
                <span>Ping Source</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {pingStatus.testing ? (
                <div className="flex items-center gap-2 text-amber-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></div>
                  <span>Pinging remote CDN tile endpoint...</span>
                </div>
              ) : pingStatus.reachable ? (
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-bold">ONLINE & RESPONSIVE</span>
                  <span className="text-slate-400 text-[10px]">
                    (HTTP {pingStatus.status} OK • {pingStatus.latencyMs}ms latency)
                  </span>
                </div>
              ) : pingStatus.reachable === false ? (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-bold">UNREACHABLE OR BLOCKED</span>
                </div>
              ) : (
                <div className="text-slate-500">Checking connection...</div>
              )}
            </div>
          </div>

          {/* Diagnostics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase">Selected Terrain</div>
              <div className="text-white font-bold text-sm mt-0.5 uppercase tracking-wide">
                {terrain.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                World: {terrain.worldSize}m × {terrain.worldSize}m
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase">Current Zoom Level</div>
              <div className="text-sky-400 font-bold text-sm mt-0.5">
                {diagnostics.currentZoom.toFixed(2)}x
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Native: 0..{terrain.maxNativeZoom} | Max: {terrain.maxZoom}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase">Loaded Tiles</div>
              <div className="text-emerald-400 font-bold text-base mt-0.5 flex items-center gap-1.5">
                <span>{diagnostics.loadedCount}</span>
                <span className="text-[10px] text-emerald-600 font-normal">rendered</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase">Failed Tiles</div>
              <div className={`font-bold text-base mt-0.5 flex items-center gap-1.5 ${diagnostics.failedCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                <span>{diagnostics.failedCount}</span>
                <span className="text-[10px] font-normal">errors</span>
              </div>
            </div>
          </div>

          {/* Tile Host & License Status */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase mb-1">Tile Host & License Status</div>
            <div className="text-[11px] text-slate-200 flex items-center justify-between">
              <span className="font-semibold">{terrain.tileHost || 'enfumap.com'}</span>
              <span className="text-[10px] bg-amber-950/60 border border-amber-600/50 text-amber-400 px-2 py-0.5 rounded font-mono">
                NOT VERIFIED
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Attribution: {terrain.attribution || '© Bohemia Interactive a.s.'} — Note: Public CDN tile endpoint availability and license permission have not been verified.
            </div>
          </div>

          {/* Active URL Template */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase mb-1">Configured Tile Template ({activeLayer})</div>
            <div className="text-[11px] text-sky-300 break-all bg-slate-900/80 p-2 rounded border border-slate-800 select-all">
              {diagnostics.urlTemplate}
            </div>
          </div>

          {/* Last Error Status */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase mb-1">Last Loading Status / Error</div>
            {diagnostics.lastError ? (
              <div className="text-red-400 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{diagnostics.lastError}</span>
              </div>
            ) : (
              <div className="text-emerald-400 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>All requested tiles loaded successfully with HTTP 200</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <button
            onClick={copyReport}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Diagnostics'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onRetry();
                testReachability();
              }}
              className="flex items-center gap-1.5 text-xs text-white bg-sky-600 hover:bg-sky-500 px-3 py-1.5 rounded font-bold transition-colors shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry & Reload Tiles</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
