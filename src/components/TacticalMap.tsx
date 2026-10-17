import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  TerrainConfig, 
  TerrainPOI, 
  MapLayerType, 
  TileDiagnostics,
  MapOverlaySettings,
  AppCustomizationSettings,
  CustomMapMarker,
  WeatherSettings
} from '../types';
import { formatGridCoord } from '../data/ballistics';
import { gameToLatLng, createTerrainCRS } from '../services/mapCoordinates';
import { TRANSLATIONS } from '../locales/translations';
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
  AlertCircle,
  Wind,
  Settings,
  Sliders,
  Check,
  X
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
  // Customization & Tool Props:
  overlays: MapOverlaySettings;
  settings: AppCustomizationSettings;
  customMarkers: CustomMapMarker[];
  onAddCustomMarker: (marker: CustomMapMarker) => void;
  onDeleteCustomMarker: (id: string) => void;
  onOpenMarkerModal: (coords: { x: number; z: number }) => void;
  weather: WeatherSettings;
  onToggleWeather: () => void;
  onToggleFcs: () => void;
  onToggleSettings: () => void;
  lang: 'en' | 'ar';
  fitMissionTrigger?: number;
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
  overlays,
  settings,
  customMarkers,
  onAddCustomMarker,
  onDeleteCustomMarker,
  onOpenMarkerModal,
  weather,
  onToggleWeather,
  onToggleFcs,
  onToggleSettings,
  lang,
  fitMissionTrigger,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const gridLayerRef = useRef<L.FeatureGroup | null>(null);
  const poiLayerRef = useRef<L.FeatureGroup | null>(null);
  const trajectoryLayerRef = useRef<L.FeatureGroup | null>(null);
  const rulerLayerRef = useRef<L.FeatureGroup | null>(null);
  const customMarkersLayerRef = useRef<L.FeatureGroup | null>(null);
  const gunMarkerRef = useRef<L.Marker | null>(null);
  const targetMarkerRef = useRef<L.Marker | null>(null);
  const pendingRetriesRef = useRef<number[]>([]);
  const labelDebounceTimerRef = useRef<number | null>(null);

  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  // Dragging state refs
  const isDraggingGunRef = useRef(false);
  const isDraggingTargetRef = useRef(false);

  const [mouseCoords, setMouseCoords] = useState<{ x: number; z: number; grid: string } | null>(null);
  const [placementMode, setPlacementMode] = useState<'none' | 'gun' | 'target' | 'marker'>('none');
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

  // Helper for formatted distance
  const formatDistance = (meters: number) => {
    if (settings.distanceUnit === 'kilometers') {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters} m`;
  };

  // 1. Initialize Leaflet Map ONCE on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const container = mapContainerRef.current;

    const initialCRS = createTerrainCRS(terrain);
    const initialBounds = L.latLngBounds([0, 0], [terrain.worldSize, terrain.worldSize]);

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
    customMarkersLayerRef.current = L.featureGroup().addTo(map);
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

  // 2. Terrain Switch handler
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    pendingRetriesRef.current.forEach((id) => window.clearTimeout(id));
    pendingRetriesRef.current = [];

    setTileSuccessCount(0);
    setTileErrorCount(0);

    const newCRS = createTerrainCRS(terrain);
    (map.options as any).crs = newCRS;

    const newBounds = L.latLngBounds([0, 0], [terrain.worldSize, terrain.worldSize]);
    map.setMaxBounds(newBounds.pad(0.1));
    map.setMinZoom(terrain.minZoom);
    map.setMaxZoom(activeLimits.maxZoom);

    map.setView([terrain.defaultCenter[1], terrain.defaultCenter[0]], 2);
    setCurrentZoom(Math.round(map.getZoom()));
    map.invalidateSize();

    setRulerPoints([]);
    setRulerMeasurement(null);
  }, [terrain.id]);

  // 3. Tile Layer Lifecycle & Error Handling with backoff retry
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

    const tileLayer = L.tileLayer(urlTemplate, {
      maxNativeZoom: limits.maxNativeZoom,
      maxZoom: limits.maxZoom,
      bounds: mapBounds,
      noWrap: true,
      crossOrigin: 'anonymous',
      keepBuffer: 2,
      updateWhenIdle: true,
      updateWhenZooming: false,
      errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
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

    gridLayerRef.current?.bringToFront();
    poiLayerRef.current?.bringToFront();
    trajectoryLayerRef.current?.bringToFront();
    customMarkersLayerRef.current?.bringToFront();
    rulerLayerRef.current?.bringToFront();
  }, [terrain.id, activeLayer, reloadTrigger]);

  // 4. Tactical Grid (1km major, 100m minor at zoom >= 4, filtered by overlays)
  useEffect(() => {
    const gridGroup = gridLayerRef.current;
    if (!gridGroup) return;

    gridGroup.clearLayers();
    if (!overlays.showGrid) return;

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

    // 100m Minor Grid lines (controlled independently by overlays.show100mGrid)
    if (overlays.show100mGrid && currentZoom >= 4) {
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
  }, [terrain.worldSize, overlays.showGrid, overlays.show100mGrid, currentZoom]);

  // 5. Place Labels with Zoom Tiers & Independent Category Filtering (Section 4 Requirements)
  const renderPlaceLabels = useCallback(() => {
    const poiGroup = poiLayerRef.current;
    const map = mapInstanceRef.current;
    if (!poiGroup || !map) return;

    poiGroup.clearLayers();
    if (terrain.pois.length === 0) return;

    const zoom = Math.round(map.getZoom());
    const bounds = map.getBounds();

    // Filter by independent categories configured by user
    const eligiblePOIs = terrain.pois.filter((poi: TerrainPOI) => {
      if (poi.kind === 'capital' && !overlays.showCapitals) return false;
      if (poi.kind === 'town' && !overlays.showTowns) return false;
      if (poi.kind === 'village' && !overlays.showVillages) return false;
      if (poi.kind === 'hill' && !overlays.showHills) return false;
      if ((poi.kind === 'landmark' || poi.kind === 'military' || poi.kind === 'bay') && !overlays.showLandmarks) return false;

      const tier = poi.tier || 1;
      if (tier === 1) return zoom >= 1;
      if (tier === 2) return zoom >= 3;
      return zoom >= 5;
    });

    const baseSize = overlays.labelSize === 'sm' ? 9 : overlays.labelSize === 'lg' ? 14 : 11;
    const fontSize = zoom <= 2 ? baseSize : zoom <= 4 ? baseSize + 1 : baseSize + 2;

    const placedBoxes: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
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

      const collides = placedBoxes.some((b) => {
        return !(box.x2 < b.x1 || box.x1 > b.x2 || box.y2 < b.y1 || box.y1 > b.y2);
      });

      if (collides) return;
      placedBoxes.push(box);

      const isCapital = poi.kind === 'capital';
      const isMilitary = poi.kind === 'military';
      const isHill = poi.kind === 'hill';

      let color = overlays.labelColor || '#e2e8f0';
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
  }, [terrain.pois, overlays]);

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

  // 6. Gun and Target Markers (Controlled by overlays.showGunMarker and showTargetMarker)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Gun Marker
    if (overlays.showGunMarker) {
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
    } else if (gunMarkerRef.current) {
      map.removeLayer(gunMarkerRef.current);
      gunMarkerRef.current = null;
    }

    // Target Marker
    if (overlays.showTargetMarker) {
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
    } else if (targetMarkerRef.current) {
      map.removeLayer(targetMarkerRef.current);
      targetMarkerRef.current = null;
    }
  }, [gunPos, targetPos, terrain.worldSize, overlays.showGunMarker, overlays.showTargetMarker, onGunChange, onTargetChange]);

  // 7. Trajectory line and Range Rings (Controlled by overlays.showTrajectoryLine and showRangeRings)
  useEffect(() => {
    const trajGroup = trajectoryLayerRef.current;
    if (!trajGroup) return;

    trajGroup.clearLayers();

    // Line connecting Gun to Target
    if (overlays.showTrajectoryLine && overlays.showGunMarker && overlays.showTargetMarker) {
      const lineColor = inRange ? '#22c55e' : '#f59e0b';
      const trajLine = L.polyline([[gunPos.z, gunPos.x], [targetPos.z, targetPos.x]], {
        color: lineColor,
        weight: 2.5,
        dashArray: '6, 6',
        opacity: 0.9,
      });
      trajGroup.addLayer(trajLine);
    }

    // Range Rings around Gun
    if (overlays.showRangeRings && chargeMaxRange > 0 && overlays.showGunMarker) {
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
  }, [gunPos, targetPos, inRange, overlays.showTrajectoryLine, overlays.showRangeRings, overlays.showGunMarker, overlays.showTargetMarker, chargeMinRange, chargeMaxRange]);

  // 8. Custom Tactical Markers Rendering (Controlled by overlays.showCustomMarkers)
  useEffect(() => {
    const group = customMarkersLayerRef.current;
    if (!group) return;

    group.clearLayers();
    if (!overlays.showCustomMarkers) return;

    customMarkers.forEach((m) => {
      const markerIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="width: 22px; height: 22px; background: ${m.color}; border: 2px solid white; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.6);">
              <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
            </div>
            <span style="color: white; background: rgba(11,15,20,0.85); border: 1px solid rgba(255,255,255,0.2); padding: 1px 4px; border-radius: 3px; font-size: 9px; font-family: monospace; font-weight: bold; white-space: nowrap; margin-top: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.5);">
              ${m.name}
            </span>
          </div>
        `,
        iconSize: [60, 36],
        iconAnchor: [30, 26],
      });

      const marker = L.marker([m.z, m.x], { icon: markerIcon });
      
      const popupHtml = `
        <div style="font-family: monospace; padding: 4px; min-width: 140px; color: #e2e8f0;">
          <div style="font-weight: bold; font-size: 12px; color: ${m.color}; margin-bottom: 2px;">${m.name}</div>
          <div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px;">Grid: ${formatGridCoord(m.x, m.z, 6)}</div>
          ${m.notes ? `<div style="font-size: 10px; color: #cbd5e1; font-style: italic; margin-bottom: 6px;">${m.notes}</div>` : ''}
          <div style="display: flex; gap: 4px; margin-top: 6px;">
            <button id="set-target-${m.id}" style="background: #ef4444; color: white; border: none; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer;">Set as Target</button>
            <button id="del-marker-${m.id}" style="background: #334155; color: #f87171; border: none; padding: 3px 8px; border-radius: 4px; font-size: 10px; cursor: pointer;">Delete</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btnTarget = document.getElementById(`set-target-${m.id}`);
          if (btnTarget) {
            btnTarget.onclick = () => {
              onTargetChange({ x: m.x, z: m.z, alt: targetPos.alt });
              marker.closePopup();
            };
          }
          const btnDel = document.getElementById(`del-marker-${m.id}`);
          if (btnDel) {
            btnDel.onclick = () => {
              onDeleteCustomMarker(m.id);
            };
          }
        }, 50);
      });

      group.addLayer(marker);
    });
  }, [customMarkers, overlays.showCustomMarkers, targetPos.alt, onTargetChange, onDeleteCustomMarker]);

  // 9. Distance Ruler (Multi-point distance measurement tool)
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
    } else if (rulerPoints.length >= 2) {
      // Multi-point polyline calculation
      let totalDist = 0;
      const polyCoords: Array<[number, number]> = [];

      rulerPoints.forEach((p, idx) => {
        polyCoords.push([p.z, p.x]);
        const dotIcon = L.divIcon({
          className: 'poi-label pointer-events-none',
          html: `<div style="width: 14px; height: 14px; background: #f59e0b; color: #000; border: 1.5px solid white; border-radius: 50%; font-size: 9px; font-weight: 800; display: flex; align-items: center; justify-content: center;">${idx + 1}</div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        rulerGroup.addLayer(L.marker([p.z, p.x], { icon: dotIcon, interactive: false }));

        if (idx > 0) {
          const prev = rulerPoints[idx - 1];
          const segDx = p.x - prev.x;
          const segDz = p.z - prev.z;
          totalDist += Math.sqrt(segDx * segDx + segDz * segDz);
        }
      });

      const p1 = rulerPoints[0];
      const p2 = rulerPoints[rulerPoints.length - 1];
      const overallDx = p2.x - p1.x;
      const overallDz = p2.z - p1.z;
      const azRad = (Math.atan2(overallDx, overallDz) + 2 * Math.PI) % (2 * Math.PI);
      const azDeg = ((azRad * 180) / Math.PI).toFixed(1);
      const azMils = Math.round((azRad / (2 * Math.PI)) * 6400);

      setRulerMeasurement({ dist: Math.round(totalDist), azDeg, azMils });

      const line = L.polyline(polyCoords, {
        color: '#f59e0b',
        weight: 2.5,
        dashArray: '5, 5',
      });
      rulerGroup.addLayer(line);

      const midZ = (p1.z + p2.z) / 2;
      const midX = (p1.x + p2.x) / 2;
      const distLabel = formatDistance(Math.round(totalDist));

      const badgeIcon = L.divIcon({
        className: 'ruler-badge pointer-events-none',
        html: `<span>📏 ${distLabel} • ${azDeg}° (${azMils} mils)</span>`,
        iconSize: [180, 24],
        iconAnchor: [90, 12],
      });
      rulerGroup.addLayer(L.marker([midZ, midX], { icon: badgeIcon, interactive: false }));
    } else {
      setRulerMeasurement(null);
    }
  }, [rulerPoints, settings.distanceUnit]);

  // Click-to-place handler
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const clickX = Math.round(e.latlng.lng);
      const clickZ = Math.round(e.latlng.lat);

      if (isRulerActive) {
        setRulerPoints((prev) => [...prev, { x: clickX, z: clickZ }]);
        return;
      }

      if (placementMode === 'gun') {
        onGunChange({ x: clickX, z: clickZ, alt: gunPos.alt });
        setPlacementMode('none');
      } else if (placementMode === 'target') {
        onTargetChange({ x: clickX, z: clickZ, alt: targetPos.alt });
        setPlacementMode('none');
      } else if (placementMode === 'marker') {
        onOpenMarkerModal({ x: clickX, z: clickZ });
        setPlacementMode('none');
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [placementMode, isRulerActive, gunPos.alt, targetPos.alt, onGunChange, onTargetChange, onOpenMarkerModal]);

  const fitMission = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const bounds = L.latLngBounds([[gunPos.z, gunPos.x], [targetPos.z, targetPos.x]]);
    map.fitBounds(bounds.pad(0.3), { maxZoom: 5, animate: true });
  }, [gunPos, targetPos]);

  useEffect(() => {
    if (fitMissionTrigger && fitMissionTrigger > 0) {
      fitMission();
    }
  }, [fitMissionTrigger, fitMission]);

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

  const isOverZoomed = currentZoom > activeLimits.maxNativeZoom;
  const totalTiles = tileSuccessCount + tileErrorCount;
  const failureRate = totalTiles > 0 ? tileErrorCount / totalTiles : 0;
  const showFailureWarning = totalTiles >= 4 && failureRate > 0.30;

  return (
    <div 
      className="relative w-full h-full flex flex-col bg-slate-950 select-none overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Top Map Floating HUD Control Bar (Compact, Responsive, Fully Localized) */}
      {/* Top Map Floating HUD Control Bar (Compact, Responsive, Fully Localized, Controlled by Visibility) */}
      {(settings.visibility.showMapTypeSelector ||
        settings.visibility.showMarkerControls ||
        settings.visibility.showMapTools ||
        settings.visibility.showFcsButton ||
        settings.visibility.showSettingsButton ||
        settings.visibility.showZoomControls) && (
        <div className="absolute top-2.5 left-2.5 right-12 sm:right-auto z-[1000] flex flex-wrap items-center gap-1.5 md:gap-2 pointer-events-auto max-w-[calc(100vw-5rem)]">
          {/* Layer Switcher (Topo / Satellite / Drawn) */}
          {settings.visibility.showMapTypeSelector && (
            <div className="flex bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-lg p-0.5 md:p-1 shadow-xl">
              <button
                onClick={() => onLayerChange('topo')}
                className={`px-2 py-1 md:px-2.5 text-xs font-semibold rounded transition-all ${
                  activeLayer === 'topo'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isAr ? 'طوبوغرافي' : 'Topo'}
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
                  {isAr ? 'قمر صناعي' : 'Satellite'}
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
                  {isAr ? 'مرسوم' : 'Drawn'}
                </button>
              )}
            </div>
          )}

          {/* Tactical Positions Placement Toggles (Gun, Target, Custom Marker) */}
          {settings.visibility.showMarkerControls && (
            <div className="flex bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-lg p-0.5 md:p-1 shadow-xl">
              <button
                onClick={() => setPlacementMode((prev) => (prev === 'gun' ? 'none' : 'gun'))}
                className={`flex items-center gap-1 px-2 py-1 md:px-2.5 text-xs font-semibold rounded transition-all ${
                  placementMode === 'gun'
                    ? 'bg-sky-500 text-slate-950 animate-pulse font-bold'
                    : 'text-sky-400 hover:bg-slate-800'
                }`}
                title={isAr ? 'انقر على الخريطة لتحديد موقع المدفع' : 'Click map to place Gun position'}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{isAr ? 'تثبيت المدفع' : 'Gun'}</span>
              </button>

              <button
                onClick={() => setPlacementMode((prev) => (prev === 'target' ? 'none' : 'target'))}
                className={`flex items-center gap-1 px-2 py-1 md:px-2.5 text-xs font-semibold rounded transition-all ${
                  placementMode === 'target'
                    ? 'bg-red-500 text-slate-950 animate-pulse font-bold'
                    : 'text-red-400 hover:bg-slate-800'
                }`}
                title={isAr ? 'انقر على الخريطة لتحديد موقع الهدف' : 'Click map to place Target position'}
              >
                <Target className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{isAr ? 'تثبيت الهدف' : 'Target'}</span>
              </button>

              <button
                onClick={() => setPlacementMode((prev) => (prev === 'marker' ? 'none' : 'marker'))}
                className={`flex items-center gap-1 px-2 py-1 md:px-2.5 text-xs font-semibold rounded transition-all ${
                  placementMode === 'marker'
                    ? 'bg-amber-500 text-slate-950 animate-pulse font-bold'
                    : 'text-amber-400 hover:bg-slate-800'
                }`}
                title={isAr ? 'انقر على الخريطة لإسقاط علامة تكتيكية مخصصة' : 'Click map to place a Custom Marker'}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'علامة' : 'Marker'}</span>
              </button>
            </div>
          )}

          {/* Tactical Map Tools: Ruler, Weather, Center, Fullscreen */}
          {settings.visibility.showMapTools && (
            <div className="flex bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-lg p-0.5 md:p-1 shadow-xl items-center gap-0.5">
              <button
                onClick={() => {
                  setIsRulerActive((v) => !v);
                  if (isRulerActive) setRulerPoints([]);
                }}
                className={`p-1.5 rounded transition-all flex items-center gap-1 ${
                  isRulerActive ? 'text-amber-400 bg-amber-950/70 ring-1 ring-amber-500 font-bold' : 'text-slate-400 hover:bg-slate-800'
                }`}
                title={t.rulerButton}
              >
                <Ruler className="w-4 h-4" />
              </button>

              <button
                onClick={onToggleWeather}
                className={`p-1.5 rounded transition-all ${
                  settings.weatherPanelOpen ? 'text-sky-400 bg-sky-950/70 ring-1 ring-sky-500' : 'text-slate-400 hover:bg-slate-800'
                }`}
                title={t.weatherButton}
              >
                <Wind className="w-4 h-4" />
              </button>

              <button
                onClick={fitMission}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                title={isAr ? 'توسيط الخارطة على مهمة الرماية' : 'Center on Gun & Target Mission'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-all hidden sm:block"
                title={isAr ? 'ملء الشاشة' : 'Toggle Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* Primary Action Buttons: Toggle FCS Panel & Open Settings */}
          {(settings.visibility.showFcsButton || settings.visibility.showSettingsButton) && (
            <div className="flex bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-lg p-0.5 md:p-1 shadow-xl items-center gap-1">
              {settings.visibility.showFcsButton && (
                <button
                  onClick={onToggleFcs}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded transition-all ${
                    settings.fcsPanelOpen
                      ? 'bg-sky-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800 text-sky-400 hover:bg-slate-700'
                  }`}
                  title={isAr ? 'فتح أو إخفاء حاسبة الرماية' : 'Toggle Fire Control Panel (FCS)'}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{isAr ? 'الحاسبة' : 'FCS Panel'}</span>
                </button>
              )}

              {settings.visibility.showSettingsButton && (
                <button
                  onClick={onToggleSettings}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-xs"
                  title={t.settingsButton}
                >
                  <Settings className="w-4 h-4 text-slate-300" />
                  <span className="hidden md:inline">{isAr ? 'الإعدادات' : 'Settings'}</span>
                </button>
              )}
            </div>
          )}

          {/* Zoom In / Out Buttons */}
          {settings.visibility.showZoomControls && (
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
          )}
        </div>
      )}

      {/* Over-zoom Notice */}
      {isOverZoomed && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 border border-sky-500/60 text-sky-300 text-xs font-mono px-3 py-1.5 rounded-full shadow-xl backdrop-blur flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          <span>{isAr ? 'تم الوصول لأقصى دقة تفصيلية متاحة' : 'Maximum native detail reached'}</span>
        </div>
      )}

      {/* Terrain Switch Notification */}
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
          <span className="truncate">
            {isAr 
              ? `انقر على الخارطة لتحديد موقع ${placementMode === 'gun' ? 'المدفع' : placementMode === 'target' ? 'الهدف' : 'العلامة المخصصة'}`
              : `Click map to place ${placementMode.toUpperCase()}`}
          </span>
          <button
            onClick={() => setPlacementMode('none')}
            className="ml-2 text-slate-300 hover:text-white text-xs underline shrink-0"
          >
            {t.cancel}
          </button>
        </div>
      )}

      {/* Ruler Active Notification Banner */}
      {isRulerActive && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-amber-950/95 border border-amber-500 text-amber-200 text-xs font-mono px-4 py-2 rounded-full shadow-2xl backdrop-blur flex items-center gap-3 pointer-events-auto max-w-[90vw]">
          <Ruler className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {rulerPoints.length === 0 && (isAr ? 'انقر على الخارطة لتحديد نقطة القياس الأولى' : 'Click map to place 1st measurement point')}
            {rulerPoints.length === 1 && (isAr ? 'انقر لتحديد نقطة القياس التالية' : 'Click map to place 2nd measurement point')}
            {rulerPoints.length >= 2 && rulerMeasurement && (
              <span>
                {t.rulerTotalDistance}: <b>{formatDistance(rulerMeasurement.dist)}</b> • {t.rulerBearing}: <b>{rulerMeasurement.azDeg}°</b> ({rulerMeasurement.azMils} {t.mils})
              </span>
            )}
          </span>
          {rulerPoints.length > 0 && (
            <button
              onClick={() => setRulerPoints([])}
              className="text-amber-300 hover:text-white text-xs underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.rulerClear}</span>
            </button>
          )}
          <button
            onClick={() => {
              setIsRulerActive(false);
              setRulerPoints([]);
            }}
            className="text-slate-400 hover:text-slate-200 text-xs"
          >
            {t.close}
          </button>
        </div>
      )}

      {/* Bottom Coordinates & Stats HUD (Controlled by settings.visibility & overlays.showCoordinatesHud) */}
      {(settings.visibility.showBottomCoordinatesHud ?? true) && overlays.showCoordinatesHud && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-[1000] bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 shadow-xl pointer-events-auto flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-4">
          <div>
            <span className="text-slate-500 mr-1.5">{isAr ? 'الخارطة:' : 'MAP:'}</span>
            <span className="text-sky-400 font-bold uppercase">{terrain.name}</span>
            <span className="text-slate-500 text-[10px] ml-1">({terrain.worldSize}m)</span>
          </div>
          {mouseCoords ? (
            <>
              <div>
                <span className="text-slate-500 mr-1">{isAr ? 'المربع:' : 'GRID:'}</span>
                <span className="text-emerald-400 font-bold">{mouseCoords.grid}</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-slate-500 mr-1">{isAr ? 'متر:' : 'MTR:'}</span>
                <span>X:{mouseCoords.x} Z:{mouseCoords.z}</span>
              </div>
            </>
          ) : (
            <div className="text-slate-500 hidden sm:block">
              {isAr ? 'حرك المؤشر فوق التضاريس لقراءة الإحداثيات' : 'Move cursor or tap terrain to inspect grid'}
            </div>
          )}
          <div className="border-l border-slate-700 pl-3 hidden md:flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">Zoom: {currentZoom}x</span>
            <span className="text-emerald-500">● {tileSuccessCount} tiles</span>
            {tileErrorCount > 0 && <span className="text-red-400">▲ {tileErrorCount} err</span>}
          </div>
        </div>
      )}

      {/* High Failure Rate Warning & Retry Bar */}
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
