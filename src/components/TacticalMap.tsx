import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { TerrainConfig, TerrainPOI, MapLayerType, TileDiagnostics } from '../types';
import { formatGridCoord } from '../data/ballistics';
import { 
  Crosshair, 
  Target, 
  Layers, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Ruler, 
  MapPin, 
  RefreshCw,
  Compass,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';

interface TacticalMapProps {
  terrain: TerrainConfig;
  activeLayer: MapLayerType;
  onLayerChange: (layer: MapLayerType) => void;
  gunPos: { x: number; z: number; alt: number };
  targetPos: { x: number; z: number; alt: number };
  onGunChange: (pos: { x: number; z: number; alt: number }) => void;
  onTargetChange: (pos: { x: number; z: number; alt: number }) => void;
  chargeMinRange: number;
  chargeMaxRange: number;
  inRange: boolean;
  onDiagnosticsUpdate: (diag: Partial<TileDiagnostics>) => void;
  reloadTrigger: number;
  onRetry: () => void;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  terrain,
  activeLayer,
  onLayerChange,
  gunPos,
  targetPos,
  onGunChange,
  onTargetChange,
  chargeMinRange,
  chargeMaxRange,
  inRange,
  onDiagnosticsUpdate,
  reloadTrigger,
  onRetry,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const gridLayerRef = useRef<L.FeatureGroup | null>(null);
  const poiLayerRef = useRef<L.FeatureGroup | null>(null);
  const trajectoryLayerRef = useRef<L.FeatureGroup | null>(null);
  const rulerLayerRef = useRef<L.FeatureGroup | null>(null);
  const gunMarkerRef = useRef<L.Marker | null>(null);
  const targetMarkerRef = useRef<L.Marker | null>(null);

  // Dragging state refs to decouple Leaflet internal drag from React state updates
  const isDraggingGunRef = useRef(false);
  const isDraggingTargetRef = useRef(false);

  const [mouseCoords, setMouseCoords] = useState<{ x: number; z: number; grid: string } | null>(null);
  const [placementMode, setPlacementMode] = useState<'none' | 'gun' | 'target'>('none');
  const [showGrid, setShowGrid] = useState(true);
  const [showPOIs, setShowPOIs] = useState(true);
  const [showRangeRings, setShowRangeRings] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRulerActive, setIsRulerActive] = useState(false);
  const [rulerPoints, setRulerPoints] = useState<Array<{ x: number; z: number }>>([]);
  const [rulerMeasurement, setRulerMeasurement] = useState<{ dist: number; azDeg: string; azMils: number } | null>(null);
  const [currentZoom, setCurrentZoom] = useState(2);
  const [tileErrorCount, setTileErrorCount] = useState(0);
  const [tileSuccessCount, setTileSuccessCount] = useState(0);

  // Initialize and destroy map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const container = mapContainerRef.current;
    const worldSize = terrain.worldSize;
    const tileSize = terrain.tileSize;

    // Custom CRS for Arma Reforger 1:1 meter coordinates
    const scaleFactor = tileSize / worldSize;
    const customCRS = L.extend({}, L.CRS.Simple, {
      transformation: new L.Transformation(scaleFactor, 0, -scaleFactor, tileSize),
    });

    const mapBounds = L.latLngBounds([0, 0], [worldSize, worldSize]);

    // Create map instance with optimized zoom snap for crisp tiles
    const map = L.map(container, {
      crs: customCRS,
      minZoom: terrain.minZoom,
      maxZoom: terrain.maxZoom,
      zoomSnap: 0.5,
      zoomDelta: 1,
      wheelPxPerZoomLevel: 100,
      maxBounds: mapBounds.pad(0.1),
      maxBoundsViscosity: 0.8,
      attributionControl: true,
      zoomControl: false,
    });

    // Set initial view at center
    map.setView([terrain.defaultCenter[1], terrain.defaultCenter[0]], 2);
    setCurrentZoom(map.getZoom());

    // Feature groups for annotations
    const gridGroup = L.featureGroup().addTo(map);
    const poiGroup = L.featureGroup().addTo(map);
    const trajGroup = L.featureGroup().addTo(map);
    const rulerGroup = L.featureGroup().addTo(map);

    gridLayerRef.current = gridGroup;
    poiLayerRef.current = poiGroup;
    trajectoryLayerRef.current = trajGroup;
    rulerLayerRef.current = rulerGroup;
    mapInstanceRef.current = map;

    // Event listeners
    map.on('zoom', () => {
      setCurrentZoom(map.getZoom());
      onDiagnosticsUpdate({ currentZoom: map.getZoom() });
    });

    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const x = Math.max(0, Math.min(worldSize, Math.round(e.latlng.lng)));
      const z = Math.max(0, Math.min(worldSize, Math.round(e.latlng.lat)));
      setMouseCoords({
        x,
        z,
        grid: formatGridCoord(x, z, 8),
      });
    });

    map.on('mouseout', () => {
      setMouseCoords(null);
    });

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      // Reset marker refs when destroying map instance to prevent orphaned references
      gunMarkerRef.current = null;
      targetMarkerRef.current = null;
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [terrain.id]);

  // Handle tile layer creation & updating
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    let urlTemplate = terrain.layers.topo;
    if (activeLayer === 'sat' && terrain.layers.sat) {
      urlTemplate = terrain.layers.sat;
    } else if (activeLayer === 'drawn' && terrain.layers.drawn) {
      urlTemplate = terrain.layers.drawn;
    }

    let loaded = 0;
    let failed = 0;
    setTileSuccessCount(0);
    setTileErrorCount(0);

    onDiagnosticsUpdate({
      terrainId: terrain.id,
      urlTemplate,
      loadedCount: 0,
      failedCount: 0,
      lastError: null,
    });

    const mapBounds = L.latLngBounds([0, 0], [terrain.worldSize, terrain.worldSize]);

    // Create TileLayer with performance buffer options
    const tileLayer = L.tileLayer(urlTemplate, {
      maxNativeZoom: terrain.maxNativeZoom,
      maxZoom: terrain.maxZoom,
      bounds: mapBounds,
      noWrap: true,
      crossOrigin: 'anonymous',
      keepBuffer: 4,
      updateWhenIdle: false,
      updateWhenZooming: true,
      attribution: '© Bohemia Interactive a.s. | Arma Reforger FCS',
    });

    tileLayer.on('tileload', () => {
      loaded += 1;
      setTileSuccessCount(loaded);
      onDiagnosticsUpdate({ loadedCount: loaded });
    });

    tileLayer.on('tileerror', (err: L.TileErrorEvent) => {
      failed += 1;
      setTileErrorCount(failed);
      const errMsg = `Failed to load tile: (${err.coords.z}/${err.coords.x}/${err.coords.y})`;
      onDiagnosticsUpdate({
        failedCount: failed,
        lastError: errMsg,
      });
    });

    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    // Bring vector layers to front
    gridLayerRef.current?.bringToFront();
    poiLayerRef.current?.bringToFront();
    trajectoryLayerRef.current?.bringToFront();
    rulerLayerRef.current?.bringToFront();
  }, [terrain.id, activeLayer, reloadTrigger]);

  // Draw Tactical Grid (1km major and 100m minor)
  useEffect(() => {
    const gridGroup = gridLayerRef.current;
    if (!gridGroup) return;

    gridGroup.clearLayers();
    if (!showGrid) return;

    const size = terrain.worldSize;

    // 1km Major Grid lines
    for (let pos = 0; pos <= size; pos += 1000) {
      // Easting line (vertical)
      const vLine = L.polyline([[0, pos], [size, pos]], {
        color: '#38bdf8',
        weight: 1.2,
        opacity: 0.45,
        interactive: false,
      });
      gridGroup.addLayer(vLine);

      // Northing line (horizontal)
      const hLine = L.polyline([[pos, 0], [pos, size]], {
        color: '#38bdf8',
        weight: 1.2,
        opacity: 0.45,
        interactive: false,
      });
      gridGroup.addLayer(hLine);

      // Grid coordinate label
      if (pos < size) {
        const gridNum = String(Math.floor(pos / 100)).padStart(2, '0');
        const labelIcon = L.divIcon({
          className: 'poi-label',
          html: `<div style="color: #38bdf8; opacity: 0.8; font-size: 10px; font-family: monospace; font-weight: bold; background: rgba(11,15,20,0.6); padding: 1px 3px; border-radius: 2px;">${gridNum}</div>`,
          iconSize: [24, 14],
          iconAnchor: [-4, -4],
        });
        gridGroup.addLayer(L.marker([pos, 20], { icon: labelIcon, interactive: false }));
        gridGroup.addLayer(L.marker([20, pos], { icon: labelIcon, interactive: false }));
      }
    }

    // 100m Minor Grid lines (visible when zoomed in)
    if (currentZoom >= 3.5) {
      for (let pos = 100; pos < size; pos += 100) {
        if (pos % 1000 === 0) continue;
        const vLine = L.polyline([[0, pos], [size, pos]], {
          color: '#38bdf8',
          weight: 0.5,
          opacity: 0.18,
          interactive: false,
        });
        const hLine = L.polyline([[pos, 0], [pos, size]], {
          color: '#38bdf8',
          weight: 0.5,
          opacity: 0.18,
          interactive: false,
        });
        gridGroup.addLayer(vLine);
        gridGroup.addLayer(hLine);
      }
    }
  }, [terrain.worldSize, showGrid, currentZoom]);

  // Draw POIs
  useEffect(() => {
    const poiGroup = poiLayerRef.current;
    if (!poiGroup) return;

    poiGroup.clearLayers();
    if (!showPOIs) return;

    terrain.pois.forEach((poi: TerrainPOI) => {
      const isCapital = poi.kind === 'capital';
      const isMilitary = poi.kind === 'military';
      const isHill = poi.kind === 'hill';

      let color = '#94a3b8';
      let symbol = '•';
      if (isCapital) {
        color = '#38bdf8';
        symbol = '★';
      } else if (isMilitary) {
        color = '#f87171';
        symbol = '▲';
      } else if (isHill) {
        color = '#fbbf24';
        symbol = '▲';
      }

      const poiIcon = L.divIcon({
        className: 'poi-label',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <span style="color: ${color}; font-size: 13px; line-height: 1;">${symbol}</span>
            <span style="color: ${color}; font-size: 10px; font-weight: 700; white-space: nowrap; text-shadow: 0 0 3px #000, 1px 1px 2px #000; letter-spacing: 0.05em;">
              ${poi.name} ${poi.elevation ? `[${poi.elevation}m]` : ''}
            </span>
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });

      const marker = L.marker([poi.z, poi.x], { icon: poiIcon });
      marker.bindPopup(`
        <div style="font-family: monospace; font-size: 11px; color: #0f172a; padding: 4px;">
          <div style="font-weight: bold; font-size: 13px; margin-bottom: 4px;">${poi.name}</div>
          <div>Grid: <b>${formatGridCoord(poi.x, poi.z, 6)}</b></div>
          <div>Coords: X: ${Math.round(poi.x)}, Z: ${Math.round(poi.z)}</div>
          <div>Elevation: ${poi.elevation || 20}m ASL</div>
          <div style="margin-top: 8px; display: flex; gap: 4px;">
            <button id="set-gun-${poi.name.replace(/\s+/g, '')}" style="background: #0284c7; color: white; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">Set Gun</button>
            <button id="set-target-${poi.name.replace(/\s+/g, '')}" style="background: #dc2626; color: white; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">Set Target</button>
          </div>
        </div>
      `);

      marker.on('popupopen', () => {
        const idSafe = poi.name.replace(/\s+/g, '');
        const gunBtn = document.getElementById(`set-gun-${idSafe}`);
        const targetBtn = document.getElementById(`set-target-${idSafe}`);

        gunBtn?.addEventListener('click', () => {
          onGunChange({ x: poi.x, z: poi.z, alt: poi.elevation || 20 });
          marker.closePopup();
        });

        targetBtn?.addEventListener('click', () => {
          onTargetChange({ x: poi.x, z: poi.z, alt: poi.elevation || 20 });
          marker.closePopup();
        });
      });

      poiGroup.addLayer(marker);
    });
  }, [terrain.pois, showPOIs, onGunChange, onTargetChange]);

  // Update Weapon and Target Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Create or update Gun marker
    if (!gunMarkerRef.current) {
      const gunIcon = L.divIcon({
        className: 'marker-pulse-weapon',
        html: `
          <div style="width: 42px; height: 42px; border: 2.5px solid #38bdf8; background: rgba(14, 165, 233, 0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px #0284c7; cursor: grab; touch-action: none;">
            <div style="width: 10px; height: 10px; background: #38bdf8; border-radius: 50%;"></div>
            <div style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); background: #0284c7; color: white; font-size: 10px; font-weight: 800; padding: 1.5px 5px; border-radius: 4px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">GUN</div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });

      const marker = L.marker([gunPos.z, gunPos.x], {
        icon: gunIcon,
        draggable: true,
        zIndexOffset: 1000,
      }).addTo(map);

      marker.on('dragstart', () => {
        isDraggingGunRef.current = true;
        map.dragging.disable();
      });

      marker.on('drag', (e: L.LeafletEvent) => {
        const latlng = (e.target as L.Marker).getLatLng();
        const clampedX = Math.max(0, Math.min(terrain.worldSize, Math.round(latlng.lng)));
        const clampedZ = Math.max(0, Math.min(terrain.worldSize, Math.round(latlng.lat)));
        onGunChange({
          x: clampedX,
          z: clampedZ,
          alt: gunPos.alt,
        });
      });

      marker.on('dragend', () => {
        isDraggingGunRef.current = false;
        map.dragging.enable();
      });

      marker.bindTooltip(`Gun: ${formatGridCoord(gunPos.x, gunPos.z, 6)} (${gunPos.alt}m)`, {
        className: 'tactical-tooltip',
        direction: 'top',
        offset: [0, -22],
      });

      gunMarkerRef.current = marker;
    } else {
      // Only reposition if marker is NOT currently being dragged by user
      if (!isDraggingGunRef.current) {
        gunMarkerRef.current.setLatLng([gunPos.z, gunPos.x]);
      }
      gunMarkerRef.current.setTooltipContent(`Gun: ${formatGridCoord(gunPos.x, gunPos.z, 6)} (${gunPos.alt}m)`);
    }

    // Create or update Target marker
    if (!targetMarkerRef.current) {
      const targetIcon = L.divIcon({
        className: 'marker-pulse-target',
        html: `
          <div style="width: 42px; height: 42px; border: 2.5px solid #ef4444; background: rgba(239, 68, 68, 0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px #dc2626; cursor: grab; touch-action: none;">
            <div style="width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></div>
            <div style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); background: #dc2626; color: white; font-size: 10px; font-weight: 800; padding: 1.5px 5px; border-radius: 4px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">T1</div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });

      const marker = L.marker([targetPos.z, targetPos.x], {
        icon: targetIcon,
        draggable: true,
        zIndexOffset: 1000,
      }).addTo(map);

      marker.on('dragstart', () => {
        isDraggingTargetRef.current = true;
        map.dragging.disable();
      });

      marker.on('drag', (e: L.LeafletEvent) => {
        const latlng = (e.target as L.Marker).getLatLng();
        const clampedX = Math.max(0, Math.min(terrain.worldSize, Math.round(latlng.lng)));
        const clampedZ = Math.max(0, Math.min(terrain.worldSize, Math.round(latlng.lat)));
        onTargetChange({
          x: clampedX,
          z: clampedZ,
          alt: targetPos.alt,
        });
      });

      marker.on('dragend', () => {
        isDraggingTargetRef.current = false;
        map.dragging.enable();
      });

      marker.bindTooltip(`T1: ${formatGridCoord(targetPos.x, targetPos.z, 6)} (${targetPos.alt}m)`, {
        className: 'tactical-tooltip',
        direction: 'top',
        offset: [0, -22],
      });

      targetMarkerRef.current = marker;
    } else {
      // Only reposition if marker is NOT currently being dragged by user
      if (!isDraggingTargetRef.current) {
        targetMarkerRef.current.setLatLng([targetPos.z, targetPos.x]);
      }
      targetMarkerRef.current.setTooltipContent(`T1: ${formatGridCoord(targetPos.x, targetPos.z, 6)} (${targetPos.alt}m)`);
    }
  }, [gunPos, targetPos, terrain.worldSize, onGunChange, onTargetChange]);

  // Draw Trajectory and Range Rings
  useEffect(() => {
    const trajGroup = trajectoryLayerRef.current;
    if (!trajGroup) return;

    trajGroup.clearLayers();

    // 1. Line connecting Gun to Target
    const lineColor = inRange ? '#22c55e' : '#f59e0b';
    const trajLine = L.polyline([[gunPos.z, gunPos.x], [targetPos.z, targetPos.x]], {
      color: lineColor,
      weight: 2.5,
      dashArray: '6, 6',
      opacity: 0.9,
    });
    trajGroup.addLayer(trajLine);

    // 2. Range Rings around Gun
    if (showRangeRings && chargeMaxRange > 0) {
      // Max range ring
      const maxRing = L.circle([gunPos.z, gunPos.x], {
        radius: chargeMaxRange,
        color: '#38bdf8',
        weight: 1.5,
        dashArray: '4, 4',
        fill: false,
        opacity: 0.7,
      });
      trajGroup.addLayer(maxRing);

      // Min range ring
      if (chargeMinRange > 0) {
        const minRing = L.circle([gunPos.z, gunPos.x], {
          radius: chargeMinRange,
          color: '#ef4444',
          weight: 1,
          dashArray: '2, 4',
          fill: true,
          fillColor: '#ef4444',
          fillOpacity: 0.05,
          opacity: 0.6,
        });
        trajGroup.addLayer(minRing);
      }
    }
  }, [gunPos, targetPos, inRange, showRangeRings, chargeMinRange, chargeMaxRange]);

  // Render Ruler Line and Measurement Badge
  useEffect(() => {
    const rulerGroup = rulerLayerRef.current;
    if (!rulerGroup) return;

    rulerGroup.clearLayers();

    if (rulerPoints.length === 1) {
      const p = rulerPoints[0];
      const ptIcon = L.divIcon({
        className: 'poi-label',
        html: `<div style="width: 10px; height: 10px; background: #f59e0b; border: 2px solid white; border-radius: 50%;"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });
      rulerGroup.addLayer(L.marker([p.z, p.x], { icon: ptIcon }));
      setRulerMeasurement(null);
    } else if (rulerPoints.length === 2) {
      const [p1, p2] = rulerPoints;
      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const dist = Math.round(Math.sqrt(dx * dx + dz * dz));
      const azRad = (Math.atan2(dx, dz) + 2 * Math.PI) % (2 * Math.PI);
      const azDeg = ((azRad * 180) / Math.PI).toFixed(1);
      const azMils = Math.round((azRad / (2 * Math.PI)) * 6400);

      setRulerMeasurement({ dist, azDeg, azMils });

      // Draw dashed measurement line
      const line = L.polyline([[p1.z, p1.x], [p2.z, p2.x]], {
        color: '#f59e0b',
        weight: 2.5,
        dashArray: '5, 5',
      });
      rulerGroup.addLayer(line);

      // Start and End dots
      const dotIcon = L.divIcon({
        className: 'poi-label',
        html: `<div style="width: 10px; height: 10px; background: #f59e0b; border: 2px solid white; border-radius: 50%;"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });
      rulerGroup.addLayer(L.marker([p1.z, p1.x], { icon: dotIcon }));
      rulerGroup.addLayer(L.marker([p2.z, p2.x], { icon: dotIcon }));

      // Midpoint measurement badge
      const midZ = (p1.z + p2.z) / 2;
      const midX = (p1.x + p2.x) / 2;
      const badgeIcon = L.divIcon({
        className: 'ruler-badge',
        html: `<span>📏 ${dist}m • ${azDeg}° (${azMils} mils)</span>`,
        iconSize: [180, 24],
        iconAnchor: [90, 12],
      });
      rulerGroup.addLayer(L.marker([midZ, midX], { icon: badgeIcon }));
    } else {
      setRulerMeasurement(null);
    }
  }, [rulerPoints]);

  // Click-to-place handler
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const clickX = Math.round(e.latlng.lng);
      const clickZ = Math.round(e.latlng.lat);

      if (isRulerActive) {
        setRulerPoints((prev) => {
          if (prev.length >= 2) return [{ x: clickX, z: clickZ }];
          return [...prev, { x: clickX, z: clickZ }];
        });
        return;
      }

      if (placementMode === 'gun') {
        onGunChange({ x: clickX, z: clickZ, alt: gunPos.alt });
        setPlacementMode('none');
      } else if (placementMode === 'target') {
        onTargetChange({ x: clickX, z: clickZ, alt: targetPos.alt });
        setPlacementMode('none');
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [placementMode, isRulerActive, gunPos.alt, targetPos.alt, onGunChange, onTargetChange]);

  // Quick Action: Center on mission (Gun & Target)
  const fitMission = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const bounds = L.latLngBounds([[gunPos.z, gunPos.x], [targetPos.z, targetPos.x]]);
    map.fitBounds(bounds.pad(0.3), { maxZoom: 5.5, animate: true });
  }, [gunPos, targetPos]);

  // Zoom handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 select-none overflow-hidden">
      {/* Top Map HUD Bar - Mobile Optimized & Responsive */}
      <div className="absolute top-2.5 left-2.5 right-2.5 sm:right-auto z-[1000] flex flex-wrap items-center gap-1.5 md:gap-2 pointer-events-auto">
        {/* Layer Switcher */}
        <div className="flex bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-lg p-0.5 md:p-1 shadow-xl">
          <button
            onClick={() => onLayerChange('topo')}
            className={`px-2 py-1 md:px-2.5 text-xs font-semibold rounded transition-all ${
              activeLayer === 'topo'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Topo
          </button>
          {terrain.layers.sat && (
            <button
              onClick={() => onLayerChange('sat')}
              className={`px-2 py-1 md:px-2.5 text-xs font-semibold rounded transition-all ${
                activeLayer === 'sat'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Satellite
            </button>
          )}
          {terrain.layers.drawn && (
            <button
              onClick={() => onLayerChange('drawn')}
              className={`px-2 py-1 md:px-2.5 text-xs font-semibold rounded transition-all ${
                activeLayer === 'drawn'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Drawn
            </button>
          )}
        </div>

        {/* Quick Placement Toggles */}
        <div className="flex bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-lg p-0.5 md:p-1 shadow-xl">
          <button
            onClick={() => setPlacementMode((prev) => (prev === 'gun' ? 'none' : 'gun'))}
            className={`flex items-center gap-1 px-2 py-1 md:px-2.5 text-xs font-semibold rounded transition-all ${
              placementMode === 'gun'
                ? 'bg-sky-500 text-slate-950 animate-pulse'
                : 'text-sky-400 hover:bg-slate-800'
            }`}
            title="Click map to position Gun"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Place Gun</span>
            <span className="xs:hidden">Gun</span>
          </button>
          <button
            onClick={() => setPlacementMode((prev) => (prev === 'target' ? 'none' : 'target'))}
            className={`flex items-center gap-1 px-2 py-1 md:px-2.5 text-xs font-semibold rounded transition-all ${
              placementMode === 'target'
                ? 'bg-red-500 text-slate-950 animate-pulse'
                : 'text-red-400 hover:bg-slate-800'
            }`}
            title="Click map to position Target"
          >
            <Target className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Place Target</span>
            <span className="xs:hidden">T1</span>
          </button>
        </div>

        {/* View toggles & Ruler */}
        <div className="flex bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-lg p-0.5 md:p-1 shadow-xl items-center">
          <button
            onClick={() => {
              setIsRulerActive((v) => !v);
              if (isRulerActive) setRulerPoints([]);
            }}
            className={`p-1.5 rounded transition-all flex items-center gap-1 ${
              isRulerActive ? 'text-amber-400 bg-amber-950/70 ring-1 ring-amber-500' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Ruler & Distance Measurement"
          >
            <Ruler className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowGrid((v) => !v)}
            className={`p-1.5 rounded transition-all ${
              showGrid ? 'text-sky-400 bg-sky-950/60' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Tactical Grid"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowPOIs((v) => !v)}
            className={`p-1.5 rounded transition-all ${
              showPOIs ? 'text-amber-400 bg-amber-950/60' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Towns & Landmarks"
          >
            <MapPin className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowRangeRings((v) => !v)}
            className={`p-1.5 rounded transition-all ${
              showRangeRings ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Range Rings"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={fitMission}
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            title="Center on Gun and Target"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-all hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile-Friendly Zoom Buttons */}
        <div className="flex bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-lg p-0.5 shadow-xl">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Placement Prompt Banner */}
      {placementMode !== 'none' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-sky-900/90 border border-sky-400 text-sky-100 text-xs font-semibold px-4 py-2 rounded-full shadow-2xl backdrop-blur flex items-center gap-2 pointer-events-auto animate-bounce max-w-[90vw]">
          <Crosshair className="w-4 h-4 animate-spin shrink-0" />
          <span className="truncate">Click map to place {placementMode.toUpperCase()} position</span>
          <button
            onClick={() => setPlacementMode('none')}
            className="ml-2 text-slate-300 hover:text-white text-xs underline shrink-0"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Ruler Active Notification Banner */}
      {isRulerActive && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-amber-950/95 border border-amber-500 text-amber-200 text-xs font-mono px-4 py-2 rounded-full shadow-2xl backdrop-blur flex items-center gap-3 pointer-events-auto max-w-[90vw]">
          <Ruler className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {rulerPoints.length === 0 && 'Click map to place 1st measurement point'}
            {rulerPoints.length === 1 && 'Click map to place 2nd measurement point'}
            {rulerPoints.length === 2 && rulerMeasurement && (
              <span>Distance: <b>{rulerMeasurement.dist}m</b> • Bearing: <b>{rulerMeasurement.azDeg}°</b></span>
            )}
          </span>
          {rulerPoints.length > 0 && (
            <button
              onClick={() => setRulerPoints([])}
              className="text-amber-300 hover:text-white text-xs underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
          <button
            onClick={() => {
              setIsRulerActive(false);
              setRulerPoints([]);
            }}
            className="text-slate-400 hover:text-slate-200 text-xs"
          >
            Done
          </button>
        </div>
      )}

      {/* Bottom Coordinates & Stats HUD */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-[1000] bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 shadow-xl pointer-events-auto flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-4">
        <div>
          <span className="text-slate-500 mr-1.5">MAP:</span>
          <span className="text-sky-400 font-bold uppercase">{terrain.name}</span>
          <span className="text-slate-500 text-[10px] ml-1">({terrain.worldSize}m)</span>
        </div>
        {mouseCoords ? (
          <>
            <div>
              <span className="text-slate-500 mr-1">GRID:</span>
              <span className="text-emerald-400 font-bold">{mouseCoords.grid}</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-slate-500 mr-1">MTR:</span>
              <span>X:{mouseCoords.x} Z:{mouseCoords.z}</span>
            </div>
          </>
        ) : (
          <div className="text-slate-500 hidden sm:block">Move cursor or tap terrain to inspect grid</div>
        )}
        <div className="border-l border-slate-700 pl-3 hidden md:flex items-center gap-2 text-[11px]">
          <span className="text-slate-400">Zoom: {currentZoom.toFixed(1)}x</span>
          <span className="text-emerald-500">● {tileSuccessCount} tiles</span>
          {tileErrorCount > 0 && <span className="text-red-400">▲ {tileErrorCount} err</span>}
        </div>
      </div>

      {/* Tile Loading Warning & Retry Bar */}
      {tileErrorCount > 3 && (
        <div className="absolute bottom-14 left-3 right-3 sm:right-auto z-[1000] bg-red-950/90 border border-red-500/80 text-red-200 text-xs px-4 py-2.5 rounded-lg shadow-2xl backdrop-blur flex items-center justify-between gap-3 pointer-events-auto">
          <div>
            <div className="font-bold text-red-100 flex items-center gap-1.5">
              <span>Map imagery loading warning</span>
            </div>
            <div className="text-[11px] text-red-300">
              {tileErrorCount} terrain tiles failed to respond. Check network connectivity or reload tiles.
            </div>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded font-bold text-xs shadow transition-all whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Tiles</span>
          </button>
        </div>
      )}

      {/* Main Leaflet Map Container */}
      <div
        ref={mapContainerRef}
        id="arma-map-canvas"
        className="w-full h-full flex-1 z-0 cursor-crosshair min-h-[380px]"
      />
    </div>
  );
};
