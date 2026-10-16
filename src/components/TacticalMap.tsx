import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { TerrainConfig, TerrainPOI, MapLayerType, TileDiagnostics } from '../types';
import { formatGridCoord } from '../data/ballistics';
import { gameToLatLng, createTerrainCRS } from '../services/mapCoordinates';
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
  Trash2,
  AlertCircle
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
  terrainNotice?: string | null;
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
  terrainNotice,
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
  const pendingRetriesRef = useRef<number[]>([]);
  const labelDebounceTimerRef = useRef<number | null>(null);

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

  // Layer-specific zoom limits
  const activeLimits = terrain.layerZoomLimits?.[activeLayer] ?? {
    maxNativeZoom: terrain.maxNativeZoom,
    maxZoom: terrain.maxZoom,
  };

  // 1. Initialize Leaflet Map ONCE on mount (Section 6.1: Keep ONE L.map instance)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const container = mapContainerRef.current;

    const initialCRS = createTerrainCRS(terrain);
    const initialBounds = L.latLngBounds([0, 0], [terrain.worldSize, terrain.worldSize]);

    // Section 1 S1: integer zoom (zoomSnap 1, zoomDelta 1) prevents fractional zoom blur
    const map = L.map(container, {
      crs: initialCRS,
      minZoom: terrain.minZoom,
      maxZoom: activeLimits.maxZoom,
      zoomSnap: 1,
      zoomDelta: 1,
      wheelPxPerZoomLevel: 120,
      maxBounds: initialBounds.pad(0.1),
      maxBoundsViscosity: 0.8,
      attributionControl: true,
      zoomControl: false,
    });

    map.setView([terrain.defaultCenter[1], terrain.defaultCenter[0]], 2);
    setCurrentZoom(Math.round(map.getZoom()));

    // Dedicated feature groups
    gridLayerRef.current = L.featureGroup().addTo(map);
    poiLayerRef.current = L.featureGroup().addTo(map);
    trajectoryLayerRef.current = L.featureGroup().addTo(map);
    rulerLayerRef.current = L.featureGroup().addTo(map);
    mapInstanceRef.current = map;

    // Zoom and coordinate tracking
    map.on('zoomend', () => {
      const z = Math.round(map.getZoom());
      setCurrentZoom(z);
      onDiagnosticsUpdate({ currentZoom: z });
    });

    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const x = Math.max(0, Math.min(terrain.worldSize, Math.round(e.latlng.lng)));
      const z = Math.max(0, Math.min(terrain.worldSize, Math.round(e.latlng.lat)));
      setMouseCoords({
        x,
        z,
        grid: formatGridCoord(x, z, 8),
      });
    });

    map.on('mouseout', () => {
      setMouseCoords(null);
    });

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      pendingRetriesRef.current.forEach((id) => window.clearTimeout(id));
      pendingRetriesRef.current = [];
      if (labelDebounceTimerRef.current) {
        window.clearTimeout(labelDebounceTimerRef.current);
      }
      gunMarkerRef.current = null;
      targetMarkerRef.current = null;
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Terrain Switch handler on EXISTING map instance (Section 6: No map recreation)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Cancel pending retries from prior terrain
    pendingRetriesRef.current.forEach((id) => window.clearTimeout(id));
    pendingRetriesRef.current = [];

    // Reset tile counters
    setTileSuccessCount(0);
    setTileErrorCount(0);

    // Update CRS and bounds for new terrain
    const newCRS = createTerrainCRS(terrain);
    (map.options as any).crs = newCRS;

    const newBounds = L.latLngBounds([0, 0], [terrain.worldSize, terrain.worldSize]);
    map.setMaxBounds(newBounds.pad(0.1));
    map.setMinZoom(terrain.minZoom);
    map.setMaxZoom(activeLimits.maxZoom);

    // Re-center on terrain default
    map.setView([terrain.defaultCenter[1], terrain.defaultCenter[0]], 2);
    setCurrentZoom(Math.round(map.getZoom()));
    map.invalidateSize();

    // Clear previous ruler points on terrain switch
    setRulerPoints([]);
    setRulerMeasurement(null);
  }, [terrain.id]);

  // 3. Tile Layer Lifecycle & Error Handling with 2-attempt backoff retry (Section 3)
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
      currentZoom: Math.round(map.getZoom()),
    });

    const mapBounds = L.latLngBounds([0, 0], [terrain.worldSize, terrain.worldSize]);
    const limits = terrain.layerZoomLimits?.[activeLayer] ?? {
      maxNativeZoom: terrain.maxNativeZoom,
      maxZoom: terrain.maxZoom,
    };

    map.setMaxZoom(limits.maxZoom);

    // TileLayer with mobile-optimized buffer and transparent error tile
    const tileLayer = L.tileLayer(urlTemplate, {
      maxNativeZoom: limits.maxNativeZoom,
      maxZoom: limits.maxZoom,
      bounds: mapBounds,
      noWrap: true,
      crossOrigin: 'anonymous',
      keepBuffer: 2, // Mobile performance: retain adjacent tiles
      updateWhenIdle: true, // Mobile performance: load tiles when idle
      updateWhenZooming: false, // Prevent zoom flickering
      errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Transparent tile keeps map intact
      attribution: terrain.attribution || '© Bohemia Interactive a.s. | Enfumap',
    });

    const retryMap = new WeakMap<HTMLImageElement, number>();

    tileLayer.on('tileload', () => {
      loaded += 1;
      setTileSuccessCount(loaded);
      onDiagnosticsUpdate({ loadedCount: loaded });
    });

    tileLayer.on('tileerror', (event: L.TileErrorEvent) => {
      const img = event.tile as HTMLImageElement;
      const coords = event.coords;
      const currentRetry = retryMap.get(img) || 0;
      const originalSrc = (img as any)._originalSrc || img.src;
      if (!(img as any)._originalSrc) {
        (img as any)._originalSrc = img.src;
      }

      // Retry at most 2 times with backoff: ~500ms then ~1500ms (Section 3.3)
      if (currentRetry < 2) {
        const nextRetry = currentRetry + 1;
        retryMap.set(img, nextRetry);
        const backoffMs = nextRetry === 1 ? 500 : 1500;

        const timer = window.setTimeout(() => {
          if (img.parentNode) {
            const sep = originalSrc.includes('?') ? '&' : '?';
            img.src = `${originalSrc}${sep}_retry=${nextRetry}_${Date.now()}`;
          }
        }, backoffMs);
        pendingRetriesRef.current.push(timer);
      } else {
        // Permanent failure after 2 retries
        failed += 1;
        setTileErrorCount(failed);
        const errMsg = `HTTP tile failure: ${terrain.id} [${activeLayer}] z${coords.z} x${coords.x} y${coords.y}`;
        onDiagnosticsUpdate({
          failedCount: failed,
          lastError: errMsg,
        });
      }
    });

    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    // Keep vector annotations in front
    gridLayerRef.current?.bringToFront();
    poiLayerRef.current?.bringToFront();
    trajectoryLayerRef.current?.bringToFront();
    rulerLayerRef.current?.bringToFront();
  }, [terrain.id, activeLayer, reloadTrigger]);

  // 4. Tactical Grid (1km major, 100m minor at zoom >= 4)
  useEffect(() => {
    const gridGroup = gridLayerRef.current;
    if (!gridGroup) return;

    gridGroup.clearLayers();
    if (!showGrid) return;

    const size = terrain.worldSize;

    // 1km Major Grid lines
    for (let pos = 0; pos <= size; pos += 1000) {
      const vLine = L.polyline([[0, pos], [size, pos]], {
        color: '#38bdf8',
        weight: 1.2,
        opacity: 0.45,
        interactive: false,
      });
      gridGroup.addLayer(vLine);

      const hLine = L.polyline([[pos, 0], [pos, size]], {
        color: '#38bdf8',
        weight: 1.2,
        opacity: 0.45,
        interactive: false,
      });
      gridGroup.addLayer(hLine);

      if (pos < size) {
        const gridNum = String(Math.floor(pos / 100)).padStart(2, '0');
        const labelIcon = L.divIcon({
          className: 'poi-label pointer-events-none',
          html: `<div style="color: #38bdf8; opacity: 0.8; font-size: 10px; font-family: monospace; font-weight: bold; background: rgba(11,15,20,0.6); padding: 1px 3px; border-radius: 2px;">${gridNum}</div>`,
          iconSize: [24, 14],
          iconAnchor: [-4, -4],
        });
        gridGroup.addLayer(L.marker([pos, 20], { icon: labelIcon, interactive: false }));
        gridGroup.addLayer(L.marker([20, pos], { icon: labelIcon, interactive: false }));
      }
    }

    // 100m Minor Grid lines (at zoom >= 4)
    if (currentZoom >= 4) {
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

  // 5. Place Labels with Zoom Tiers & Collision Detection (Section 4)
  const renderPlaceLabels = useCallback(() => {
    const poiGroup = poiLayerRef.current;
    const map = mapInstanceRef.current;
    if (!poiGroup || !map) return;

    poiGroup.clearLayers();
    if (!showPOIs || terrain.pois.length === 0) return;

    const zoom = Math.round(map.getZoom());
    const bounds = map.getBounds();

    // Zoom-dependent visibility with three tiers:
    // Tier 1: Major towns and bases visible at zoom >= 1
    // Tier 2: Smaller places and landmarks visible at zoom >= 3
    // Tier 3: All places visible at zoom >= 5
    const eligiblePOIs = terrain.pois.filter((poi: TerrainPOI) => {
      const tier = poi.tier || 1;
      if (tier === 1) return zoom >= 1;
      if (tier === 2) return zoom >= 3;
      return zoom >= 5;
    });

    // Font size scales with zoom within limited 10-13px range
    const fontSize = zoom <= 2 ? 10 : zoom <= 4 ? 11 : zoom <= 6 ? 12 : 13;

    // Screen-space bounding boxes for overlap collision handling
    const placedBoxes: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

    // Sort by tier first (Tier 1 has highest priority)
    const sortedPOIs = [...eligiblePOIs].sort((a, b) => (a.tier || 1) - (b.tier || 1));

    sortedPOIs.forEach((poi: TerrainPOI) => {
      const latlng = gameToLatLng(poi.x, poi.z);
      if (!bounds.contains(latlng)) return;

      const pt = map.latLngToContainerPoint(latlng);
      const estWidth = poi.name.length * (fontSize * 0.65) + 24;
      const estHeight = fontSize + 16;
      const box = {
        x1: pt.x - estWidth / 2 - 4,
        y1: pt.y - estHeight / 2 - 4,
        x2: pt.x + estWidth / 2 + 4,
        y2: pt.y + estHeight / 2 + 4,
      };

      // Check collision with higher-tier placed labels
      const collides = placedBoxes.some((b) => {
        return !(box.x2 < b.x1 || box.x1 > b.x2 || box.y2 < b.y1 || box.y1 > b.y2);
      });

      if (collides) return; // Hide label to avoid overlap

      placedBoxes.push(box);

      const isCapital = poi.kind === 'capital';
      const isMilitary = poi.kind === 'military';
      const isHill = poi.kind === 'hill';

      let color = '#e2e8f0';
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

      // Pointer-events: none ensures labels never block map or marker dragging (Section 4.6)
      const poiIcon = L.divIcon({
        className: 'poi-label pointer-events-none',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; pointer-events: none; user-select: none;">
            <span style="color: ${color}; font-size: ${fontSize + 2}px; line-height: 1;">${symbol}</span>
            <span style="color: ${color}; font-size: ${fontSize}px; font-weight: 700; white-space: nowrap; text-shadow: 0 0 3px #000, 1px 1px 2px #000; letter-spacing: 0.05em;">
              ${poi.name}
            </span>
          </div>
        `,
        iconSize: [estWidth, estHeight],
        iconAnchor: [estWidth / 2, estHeight / 2],
      });

      const marker = L.marker([poi.z, poi.x], { icon: poiIcon, interactive: false });
      poiGroup.addLayer(marker);
    });
  }, [terrain.pois, showPOIs]);

  // Debounced label recomputation on moveend/zoomend (Section 4.5 & Section 8)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    renderPlaceLabels();

    const debouncedUpdate = () => {
      if (labelDebounceTimerRef.current) {
        window.clearTimeout(labelDebounceTimerRef.current);
      }
      labelDebounceTimerRef.current = window.setTimeout(() => {
        renderPlaceLabels();
      }, 120);
    };

    map.on('moveend', debouncedUpdate);
    map.on('zoomend', debouncedUpdate);

    return () => {
      map.off('moveend', debouncedUpdate);
      map.off('zoomend', debouncedUpdate);
    };
  }, [renderPlaceLabels]);

  // 6. Gun and Target Markers (Section 7: Mortar Functionality & Dragging Fixes)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Gun Marker
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

      // autoPan: false and map.dragging.disable ensure dragging marker never pans map (Section 7.6)
      const marker = L.marker([gunPos.z, gunPos.x], {
        icon: gunIcon,
        draggable: true,
        autoPan: false,
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
      if (!isDraggingGunRef.current) {
        gunMarkerRef.current.setLatLng([gunPos.z, gunPos.x]);
      }
      gunMarkerRef.current.setTooltipContent(`Gun: ${formatGridCoord(gunPos.x, gunPos.z, 6)} (${gunPos.alt}m)`);
    }

    // Target Marker
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
        autoPan: false,
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
      if (!isDraggingTargetRef.current) {
        targetMarkerRef.current.setLatLng([targetPos.z, targetPos.x]);
      }
      targetMarkerRef.current.setTooltipContent(`T1: ${formatGridCoord(targetPos.x, targetPos.z, 6)} (${targetPos.alt}m)`);
    }
  }, [gunPos, targetPos, terrain.worldSize, onGunChange, onTargetChange]);

  // 7. Trajectory line and Range Rings
  useEffect(() => {
    const trajGroup = trajectoryLayerRef.current;
    if (!trajGroup) return;

    trajGroup.clearLayers();

    // Line connecting Gun to Target
    const lineColor = inRange ? '#22c55e' : '#f59e0b';
    const trajLine = L.polyline([[gunPos.z, gunPos.x], [targetPos.z, targetPos.x]], {
      color: lineColor,
      weight: 2.5,
      dashArray: '6, 6',
      opacity: 0.9,
    });
    trajGroup.addLayer(trajLine);

    // Range Rings around Gun
    if (showRangeRings && chargeMaxRange > 0) {
      const maxRing = L.circle([gunPos.z, gunPos.x], {
        radius: chargeMaxRange,
        color: '#38bdf8',
        weight: 1.5,
        dashArray: '4, 4',
        fill: false,
        opacity: 0.7,
      });
      trajGroup.addLayer(maxRing);

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

  // 8. Distance Ruler (Euclidean game meters)
  useEffect(() => {
    const rulerGroup = rulerLayerRef.current;
    if (!rulerGroup) return;

    rulerGroup.clearLayers();

    if (rulerPoints.length === 1) {
      const p = rulerPoints[0];
      const ptIcon = L.divIcon({
        className: 'poi-label pointer-events-none',
        html: `<div style="width: 10px; height: 10px; background: #f59e0b; border: 2px solid white; border-radius: 50%;"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });
      rulerGroup.addLayer(L.marker([p.z, p.x], { icon: ptIcon, interactive: false }));
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

      const line = L.polyline([[p1.z, p1.x], [p2.z, p2.x]], {
        color: '#f59e0b',
        weight: 2.5,
        dashArray: '5, 5',
      });
      rulerGroup.addLayer(line);

      const dotIcon = L.divIcon({
        className: 'poi-label pointer-events-none',
        html: `<div style="width: 10px; height: 10px; background: #f59e0b; border: 2px solid white; border-radius: 50%;"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });
      rulerGroup.addLayer(L.marker([p1.z, p1.x], { icon: dotIcon, interactive: false }));
      rulerGroup.addLayer(L.marker([p2.z, p2.x], { icon: dotIcon, interactive: false }));

      const midZ = (p1.z + p2.z) / 2;
      const midX = (p1.x + p2.x) / 2;
      const badgeIcon = L.divIcon({
        className: 'ruler-badge pointer-events-none',
        html: `<span>📏 ${dist}m • ${azDeg}° (${azMils} mils)</span>`,
        iconSize: [180, 24],
        iconAnchor: [90, 12],
      });
      rulerGroup.addLayer(L.marker([midZ, midX], { icon: badgeIcon, interactive: false }));
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

  const fitMission = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const bounds = L.latLngBounds([[gunPos.z, gunPos.x], [targetPos.z, targetPos.x]]);
    map.fitBounds(bounds.pad(0.3), { maxZoom: 5, animate: true });
  }, [gunPos, targetPos]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Section 2.3: Notice when zoomed beyond maxNativeZoom
  const isOverZoomed = currentZoom > activeLimits.maxNativeZoom;

  // Section 3.5: Orange warning only when failure rate > 30% of tiles in view
  const totalTiles = tileSuccessCount + tileErrorCount;
  const failureRate = totalTiles > 0 ? tileErrorCount / totalTiles : 0;
  const showFailureWarning = totalTiles >= 4 && failureRate > 0.30;

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 select-none overflow-hidden">
      {/* Top Map HUD Bar */}
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

        {/* Zoom In / Out Buttons */}
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

      {/* Over-zoom Notice (Section 2.3) */}
      {isOverZoomed && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 border border-sky-500/60 text-sky-300 text-xs font-mono px-3 py-1.5 rounded-full shadow-xl backdrop-blur flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          <span>Maximum native detail reached</span>
        </div>
      )}

      {/* Labels Unavailable Notice for Arland & Kolguyev (Section 4.2) */}
      {showPOIs && terrain.pois.length === 0 && (
        <div className="absolute top-16 right-3 z-[1000] bg-slate-900/90 border border-slate-700 text-slate-400 text-[11px] font-mono px-2.5 py-1 rounded shadow-lg backdrop-blur pointer-events-none">
          Labels unavailable for this terrain
        </div>
      )}

      {/* Terrain Switch Notification (Section 6.4) */}
      {terrainNotice && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-[1000] bg-amber-950/95 border border-amber-500 text-amber-200 text-xs font-mono px-4 py-2 rounded-lg shadow-2xl backdrop-blur flex items-center gap-2 pointer-events-auto">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{terrainNotice}</span>
        </div>
      )}

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
          <span className="text-slate-400">Zoom: {currentZoom}x</span>
          <span className="text-emerald-500">● {tileSuccessCount} tiles</span>
          {tileErrorCount > 0 && <span className="text-red-400">▲ {tileErrorCount} err</span>}
        </div>
      </div>

      {/* High Failure Rate Warning & Retry Bar (Section 3.5: >30% failure rate) */}
      {showFailureWarning && (
        <div className="absolute bottom-14 left-3 right-3 sm:right-auto z-[1000] bg-amber-950/95 border border-amber-500/80 text-amber-200 text-xs px-4 py-2.5 rounded-lg shadow-2xl backdrop-blur flex items-center justify-between gap-3 pointer-events-auto">
          <div>
            <div className="font-bold text-amber-100 flex items-center gap-1.5">
              <span>High tile error rate detected</span>
            </div>
            <div className="text-[11px] text-amber-300">
              {tileErrorCount} of {totalTiles} tiles failed to respond ({Math.round(failureRate * 100)}%). Check network connectivity.
            </div>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold text-xs shadow transition-all whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Failed Tiles</span>
          </button>
        </div>
      )}

      {/* Main Leaflet Map Canvas */}
      <div
        ref={mapContainerRef}
        id="arma-map-canvas"
        className="w-full h-full flex-1 z-0 cursor-crosshair min-h-[380px]"
      />
    </div>
  );
};
