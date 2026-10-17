import React, { useState } from 'react';
import { WeaponConfig, BallisticSolution, TerrainConfig } from '../types';
import { formatGridCoord } from '../data/ballistics';
import { MortarInfoCard } from './MortarInfoCard';
import { 
  Crosshair, 
  Target, 
  Compass, 
  Clock, 
  ArrowUpRight, 
  Copy,
  Check,
  Zap,
  Layers,
  MapPin
} from 'lucide-react';

interface FireControlPanelProps {
  terrain: TerrainConfig;
  weapons: WeaponConfig[];
  selectedWeapon: WeaponConfig;
  onSelectWeapon: (weapon: WeaponConfig) => void;
  selectedAmmoId?: string;
  onSelectAmmo?: (ammoId: string) => void;
  selectedCharge: number;
  onSelectCharge: (charge: number) => void;
  gunPos: { x: number; z: number; alt: number };
  targetPos: { x: number; z: number; alt: number };
  onGunChange: (pos: { x: number; z: number; alt: number }) => void;
  onTargetChange: (pos: { x: number; z: number; alt: number }) => void;
  solution: BallisticSolution;
  lang?: 'en' | 'ar';
}

export const FireControlPanel: React.FC<FireControlPanelProps> = ({
  terrain,
  weapons,
  selectedWeapon,
  onSelectWeapon,
  selectedAmmoId,
  onSelectAmmo,
  selectedCharge,
  onSelectCharge,
  gunPos,
  targetPos,
  onGunChange,
  onTargetChange,
  solution,
  lang = 'en',
}) => {
  const [gridInputGun, setGridInputGun] = useState('');
  const [gridInputTarget, setGridInputTarget] = useState('');
  const [copied, setCopied] = useState(false);

  const activeAmmo = selectedWeapon.ammunition?.find((a) => a.id === selectedAmmoId) || selectedWeapon.ammunition?.[0];
  const activeCharges = activeAmmo ? activeAmmo.charges : selectedWeapon.charges;

  // Apply typed 6-digit or 8-digit grid (e.g. "048 071", "048071", "0482 0715")
  const applyGridCoord = (input: string, isGun: boolean) => {
    const clean = input.replace(/\s+/g, '');
    if (clean.length === 6) {
      const east = parseInt(clean.substring(0, 3), 10) * 100 + 50;
      const north = parseInt(clean.substring(3, 6), 10) * 100 + 50;
      if (!isNaN(east) && !isNaN(north)) {
        if (isGun) {
          onGunChange({ x: east, z: north, alt: gunPos.alt });
          setGridInputGun('');
        } else {
          onTargetChange({ x: east, z: north, alt: targetPos.alt });
          setGridInputTarget('');
        }
      }
    } else if (clean.length === 8) {
      const east = parseInt(clean.substring(0, 4), 10) * 10 + 5;
      const north = parseInt(clean.substring(4, 8), 10) * 10 + 5;
      if (!isNaN(east) && !isNaN(north)) {
        if (isGun) {
          onGunChange({ x: east, z: north, alt: gunPos.alt });
          setGridInputGun('');
        } else {
          onTargetChange({ x: east, z: north, alt: targetPos.alt });
          setGridInputTarget('');
        }
      }
    }
  };

  // Copy Fire Mission callout for in-game squad communication
  const copyFireMission = () => {
    const azMilStr = selectedWeapon.milSystem === 'SOVIET'
      ? `${String(Math.floor(solution.azimuthMils / 100)).padStart(2, '0')}-${String(solution.azimuthMils % 100).padStart(2, '0')}`
      : `${solution.azimuthMils}`;

    const elevMilStr = solution.elevationMils !== null
      ? (selectedWeapon.milSystem === 'SOVIET'
          ? `${String(Math.floor(solution.elevationMils / 100)).padStart(2, '0')}-${String(solution.elevationMils % 100).padStart(2, '0')}`
          : `${solution.elevationMils}`)
      : 'OUT OF RANGE';

    const ysStr = solution.peakAlt ? ` | Ys: ${solution.peakAlt}m` : '';
    const dhwStr = solution.dElevPer100m ? ` | ΔHw: ${solution.dElevPer100m}` : '';
    const ammoLabel = activeAmmo ? `${activeAmmo.name} (${activeAmmo.weightKg}kg)` : solution.ammoType;

    const text = `[FIRE MISSION - ${terrain.name.toUpperCase()}] ${selectedWeapon.name} [${ammoLabel}] | RING: ${solution.charge} | AZ: ${azMilStr} mils (${solution.azimuthDeg}°) | EL: ${elevMilStr} mils (${solution.elevationDeg !== null ? `${solution.elevationDeg.toFixed(1)}°` : '--'}) | RNG: ${solution.horizontalDistance}m (ΔH: ${solution.heightDifference >= 0 ? '+' : ''}${solution.heightDifference}m) | TOF: ${solution.timeOfFlight || 0}s${ysStr}${dhwStr} | GUN: ${formatGridCoord(gunPos.x, gunPos.z, 6)} | TGT: ${formatGridCoord(targetPos.x, targetPos.z, 6)}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const isAutoMode = selectedCharge === -1;

  // Localized dictionary
  const isAr = lang === 'ar';
  const t = {
    panelTitle: isAr ? 'منظومة إدارة النيران (FCS)' : 'Fire Control System',
    panelSubtitle: isAr 
      ? 'محرك حسابات باليستية دقيق للهاونات مع دعم كامل لمستويات الارتفاع بالدرجات والمل.' 
      : 'Dual-mortar ballistic engine with comprehensive ammunition registry and live elevation resolver.',
    ordnance: isAr ? 'منظومة الهاون / السلاح' : 'Ordnance / Mortar System',
    ammoType: isAr ? 'نوع الذخيرة' : 'Ammunition Type',
    weight: isAr ? 'الوزن' : 'Weight',
    propellantCharges: isAr ? 'حلقات الدفع والتعمير (Rings)' : 'Propellant Charge Rings',
    activeRing: isAr ? 'الحلقة النشطة: رينغ' : 'Active: Ring',
    bracket: isAr ? 'نطاق المدى' : 'Bracket',
    autoOpt: isAr ? 'تلقائي' : 'AUTO',
    readyToFire: isAr ? '● جاهز للإطلاق' : '● READY TO FIRE',
    outOfRange: isAr ? '▲ خارج المدى' : '▲ OUT OF RANGE',
    ammo: isAr ? 'الذخيرة:' : 'Ammo:',
    azimuthDir: isAr ? 'زاوية السمت (الاتجاه)' : 'AZIMUTH (DIR)',
    elevationTube: isAr ? 'زاوية الارتفاع (الماسورة)' : 'ELEVATION (TUBE)',
    trueDeg: isAr ? 'حقيقي' : 'True',
    targetDist: isAr ? 'المسافة للهدف' : 'Target Dist',
    slant: isAr ? 'مائل' : 'Slant',
    timeOfFlight: isAr ? 'زمن التحليق' : 'Time of Flight',
    toImpact: isAr ? 'حتى الارتطام' : 'To impact',
    deltaAlt: isAr ? 'فرق الارتفاع (ΔH)' : 'Delta Alt (ΔH)',
    tgtMinusGun: isAr ? 'الهدف - المدفع' : 'Tgt - Gun',
    peakAlt: isAr ? 'أقصى ارتفاع (Ys)' : 'Peak Alt (Ys)',
    deltaHw: isAr ? 'معامل ΔHw (لكل 100م)' : 'ΔHw (per 100m)',
    impactAngle: isAr ? 'زاوية السقوط' : 'Impact Angle',
    radioCallout: isAr ? 'نداء الراديو للسرية:' : 'Squad Radio Callout:',
    copyMission: isAr ? 'نسخ أمر الرماية' : 'Copy Fire Mission',
    copied: isAr ? 'تم نسخ الأمر!' : 'Copied Mission!',
    gunBattery: isAr ? 'موقع المدفع / المربض' : 'GUN / BATTERY POSITION',
    primaryTarget: isAr ? 'موقع الهدف الرئيسي (T1)' : 'PRIMARY TARGET (T1)',
    apply: isAr ? 'تطبيق' : 'Apply',
    tacticalLocations: isAr ? 'مواقع تكتيكية على خارطة' : 'Tactical Locations on',
    minElev: isAr ? 'الارتفاع الأدنى:' : 'Min Elev:',
    maxElev: isAr ? 'الارتفاع الأقصى:' : 'Max Elev:',
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border-l border-slate-800 text-slate-200 overflow-y-auto">
      {/* Panel Header */}
      <div className="p-3.5 md:p-4 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="text-sm font-bold tracking-wider text-sky-400 uppercase font-mono">
              {t.panelTitle}
            </h2>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700">
            {selectedWeapon.milSystem === 'SOVIET' ? '6000 MILS (RU)' : '6400 MILS (US)'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {t.panelSubtitle}
        </p>
      </div>

      <div className="p-3.5 md:p-4 space-y-4 md:space-y-5 flex-1">
        {/* Weapon Selection: American M252 vs Russian 2B14 */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
            <span>{t.ordnance}</span>
            <span className="text-sky-400 font-mono text-[10px]">{selectedWeapon.caliber}</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {weapons.map((w) => {
              const isSelected = w.id === selectedWeapon.id;
              const isAmerican = w.id.includes('m252');
              const isRussian = w.id.includes('2b14');

              return (
                <button
                  key={w.id}
                  onClick={() => {
                    onSelectWeapon(w);
                  }}
                  className={`text-left p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-sky-950/50 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">
                        {isAmerican ? '🇺🇸' : isRussian ? '🇷🇺' : '⚔️'}
                      </span>
                      <span className="text-xs font-bold text-white">{w.name}</span>
                    </div>
                    <span className="text-[10px] text-sky-400 font-mono font-semibold">
                      {w.caliber}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {w.description}
                  </div>

                  {/* Required Angular Display for Elevation Limits */}
                  <div className="mt-2 pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">{t.minElev}</span>
                      <span className="text-sky-300 font-bold">
                        {isAmerican ? '800 mil ≈ 45.0°' : isRussian ? '748 mil ≈ 44.9°' : `${w.minElevation} mil`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">{t.maxElev}</span>
                      <span className="text-emerald-300 font-bold">
                        {isAmerican ? '1515 mil ≈ 85.2°' : isRussian ? '1415 mil ≈ 84.9°' : `${w.maxElevation} mil`}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dedicated Mortar Information Panel (Section 1 & Section 2 Requirements) */}
        <MortarInfoCard
          weapon={selectedWeapon}
          selectedAmmo={activeAmmo}
          lang={lang}
        />

        {/* Ammunition Type Selector (HE, ILLUM, SMOKE, TRAINING) */}
        {selectedWeapon.ammunition && selectedWeapon.ammunition.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.ammoType}</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                {activeAmmo ? `${activeAmmo.weightKg.toFixed(2)} kg` : ''}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="relative">
                <select
                  value={selectedAmmoId || activeAmmo?.id || ''}
                  onChange={(e) => onSelectAmmo && onSelectAmmo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-semibold text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 appearance-none cursor-pointer pr-8"
                >
                  {selectedWeapon.ammunition.map((ammo) => (
                    <option key={ammo.id} value={ammo.id}>
                      [{ammo.category}] {ammo.name} ({ammo.weightKg.toFixed(2)} kg)
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>

              {/* Dynamic shell attributes badge */}
              {activeAmmo && (
                <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                        activeAmmo.category === 'HE'
                          ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                          : activeAmmo.category === 'ILLUM'
                          ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                          : activeAmmo.category === 'SMOKE'
                          ? 'bg-slate-800 border-slate-600 text-slate-300'
                          : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      }`}
                    >
                      {activeAmmo.category}
                    </span>
                    <span className="text-slate-300 font-mono font-semibold text-[11px]">
                      {activeAmmo.code}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {t.weight}: {activeAmmo.weightKg.toFixed(2)} kg
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Charge Ring Selector (0 to 4 Rings + Automatic Selector) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>{t.propellantCharges}</span>
              <span className="text-[10px] text-sky-400 font-mono font-semibold">
                {t.activeRing} {solution.charge}
              </span>
            </label>
            <span className="text-slate-400 text-[10px] font-mono">
              {t.bracket}: {activeCharges[solution.charge]?.minRange}m – {activeCharges[solution.charge]?.maxRange}m
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1">
            {/* Auto Mode Button */}
            <button
              onClick={() => onSelectCharge(-1)}
              className={`py-1.5 px-1 rounded border text-center transition-all flex flex-col items-center justify-center min-h-[46px] ${
                isAutoMode
                  ? 'bg-emerald-600 text-slate-950 font-bold border-emerald-400 shadow-md'
                  : 'bg-slate-950/70 border-slate-800 text-emerald-400 hover:border-emerald-600'
              }`}
              title="Automatically select optimal charge ring based on target distance"
            >
              <Zap className="w-3.5 h-3.5 mb-0.5" />
              <span className="text-[10px] font-bold">{t.autoOpt}</span>
              <span className="text-[8px] opacity-80">Opt.</span>
            </button>

            {/* Manual Rings 0 to 4 */}
            {activeCharges.map((c, idx) => {
              const isSelected = !isAutoMode && selectedCharge === idx;
              const isRecommended = solution.recommendedCharge === idx;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectCharge(idx)}
                  className={`py-1.5 px-1 rounded border text-center transition-all flex flex-col items-center justify-center min-h-[46px] relative ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md'
                      : isRecommended && isAutoMode
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                      : isRecommended
                      ? 'bg-slate-800 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold">R{c.charge}</span>
                  <span className="text-[8px] opacity-75 font-mono">{c.maxRange}m</span>
                  {isRecommended && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 right-1"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* PRIMARY BALLISTIC SOLUTION CARD */}
        <div className="bg-slate-950 border-2 border-sky-500/60 rounded-xl p-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-sky-500/20 text-sky-400 text-[10px] font-mono px-2 py-0.5 rounded-bl font-bold border-b border-l border-sky-500/30">
            {selectedWeapon.milSystem === 'SOVIET' ? 'RUSSIAN SIGHT (60-00)' : 'US NATO SIGHT (6400)'}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                solution.inRange
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60'
                  : 'bg-red-950 text-red-400 border border-red-700/60'
              }`}
            >
              {solution.inRange ? t.readyToFire : t.outOfRange}
            </span>
            <span className="text-[10px] text-sky-300 font-mono">
              {t.ammo} <b>{solution.ammoType}</b>
            </span>
          </div>

          {solution.warning && (
            <div className="mb-2 text-[10px] text-amber-400 font-mono bg-amber-950/30 p-1.5 rounded border border-amber-800/50">
              ⚠️ {solution.warning}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Azimuth Box: Both Degrees and Mils */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>{t.azimuthDir}</span>
                <Compass className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-xl font-bold font-mono text-sky-400 mt-1">
                {selectedWeapon.milSystem === 'SOVIET'
                  ? `${String(Math.floor(solution.azimuthMils / 100)).padStart(2, '0')}-${String(
                      solution.azimuthMils % 100
                    ).padStart(2, '0')} mils`
                  : `${solution.azimuthMils} mils`}
              </div>
              <div className="text-[11px] font-mono text-slate-300 mt-0.5 font-bold">
                {solution.azimuthDeg.toFixed(1)}° {t.trueDeg}
              </div>
            </div>

            {/* Elevation Box: Both Degrees and Mils */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>{t.elevationTube}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              {/* PRIMARY GREEN DISPLAY: Degrees with mathematical degree symbol and 1 decimal place */}
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {solution.elevationDeg !== null ? `${solution.elevationDeg.toFixed(1)}°` : '---'}
              </div>
              <div className="text-[11px] font-mono text-slate-300 mt-0.5 font-bold flex items-center justify-between">
                <span>
                  {solution.elevationMils !== null
                    ? (selectedWeapon.milSystem === 'SOVIET'
                        ? `${String(Math.floor(solution.elevationMils / 100)).padStart(2, '0')}-${String(
                            solution.elevationMils % 100
                          ).padStart(2, '0')} mils`
                        : `${solution.elevationMils} mils`)
                    : '---'}
                </span>
                <span className="text-[10px] text-sky-400">Ring {solution.charge}</span>
              </div>
            </div>
          </div>

          {/* Secondary Ballistic Telemetry */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center font-mono">
            <div>
              <div className="text-[9px] text-slate-500 uppercase">{t.targetDist}</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5">{solution.horizontalDistance} m</div>
              <div className="text-[9px] text-slate-500">{t.slant}: {solution.slantDistance}m</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-500 uppercase">{t.timeOfFlight}</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{solution.timeOfFlight ? `${solution.timeOfFlight}s` : '---'}</span>
              </div>
              <div className="text-[9px] text-slate-500">{t.toImpact}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-500 uppercase">{t.deltaAlt}</div>
              <div className={`text-sm font-bold mt-0.5 ${solution.heightDifference >= 0 ? 'text-sky-300' : 'text-slate-400'}`}>
                {solution.heightDifference >= 0 ? `+${solution.heightDifference}` : solution.heightDifference} m
              </div>
              <div className="text-[9px] text-slate-500">{t.tgtMinusGun}</div>
            </div>
          </div>

          {/* Tertiary Tactical Parameters: Peak Alt (Ys), Delta Hw, Impact Angle */}
          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/40 text-center font-mono text-[10px]">
            <div className="bg-slate-900/50 p-1 rounded">
              <span className="text-[8px] text-slate-500 block uppercase">{t.peakAlt}</span>
              <span className="font-bold text-sky-300">{solution.peakAlt ? `${solution.peakAlt}m` : '---'}</span>
            </div>
            <div className="bg-slate-900/50 p-1 rounded">
              <span className="text-[8px] text-slate-500 block uppercase">{t.deltaHw}</span>
              <span className="font-bold text-emerald-300">{solution.dElevPer100m ? `${solution.dElevPer100m} mil` : '---'}</span>
            </div>
            <div className="bg-slate-900/50 p-1 rounded">
              <span className="text-[8px] text-slate-500 block uppercase">{t.impactAngle}</span>
              <span className="font-bold text-slate-300">{solution.angleImpact ? `${solution.angleImpact}°` : '---'}</span>
            </div>
          </div>

          {/* One-Click Copy Fire Mission */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">{t.radioCallout}</span>
            <button
              onClick={copyFireMission}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copied : t.copyMission}</span>
            </button>
          </div>
        </div>

        {/* Gun & Target Coordinate Inspector */}
        <div className="space-y-3">
          {/* Gun Position */}
          <div className="bg-slate-950/60 border border-sky-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold font-mono">
                <Crosshair className="w-3.5 h-3.5" />
                <span>{t.gunBattery}</span>
              </div>
              <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800">
                {formatGridCoord(gunPos.x, gunPos.z, 6)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">X (East)</span>
                <input
                  type="number"
                  value={gunPos.x}
                  onChange={(e) => onGunChange({ ...gunPos, x: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Z (North)</span>
                <input
                  type="number"
                  value={gunPos.z}
                  onChange={(e) => onGunChange({ ...gunPos, z: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Alt (ASL)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={gunPos.alt}
                    onChange={(e) => onGunChange({ ...gunPos, alt: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1.5 text-slate-200 text-center"
                  />
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => onGunChange({ ...gunPos, alt: gunPos.alt + 5 })}
                      className="p-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[9px] text-slate-300"
                      title="+5m"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => onGunChange({ ...gunPos, alt: Math.max(0, gunPos.alt - 5) })}
                      className="p-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[9px] text-slate-300"
                      title="-5m"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Grid input */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <input
                type="text"
                placeholder="6-digit grid (e.g. 048 071)"
                value={gridInputGun}
                onChange={(e) => setGridInputGun(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyGridCoord(gridInputGun, true)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-[11px] font-mono placeholder:text-slate-600"
              />
              <button
                onClick={() => applyGridCoord(gridInputGun, true)}
                className="px-2.5 py-1.5 bg-sky-900 hover:bg-sky-800 text-sky-200 text-[11px] font-mono font-bold rounded"
              >
                {t.apply}
              </button>
            </div>
          </div>

          {/* Target Position */}
          <div className="bg-slate-950/60 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold font-mono">
                <Target className="w-3.5 h-3.5" />
                <span>{t.primaryTarget}</span>
              </div>
              <span className="text-[10px] font-mono bg-red-950 text-red-300 px-1.5 py-0.5 rounded border border-red-800">
                {formatGridCoord(targetPos.x, targetPos.z, 6)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">X (East)</span>
                <input
                  type="number"
                  value={targetPos.x}
                  onChange={(e) => onTargetChange({ ...targetPos, x: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Z (North)</span>
                <input
                  type="number"
                  value={targetPos.z}
                  onChange={(e) => onTargetChange({ ...targetPos, z: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Alt (ASL)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={targetPos.alt}
                    onChange={(e) => onTargetChange({ ...targetPos, alt: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1.5 text-slate-200 text-center"
                  />
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => onTargetChange({ ...targetPos, alt: targetPos.alt + 5 })}
                      className="p-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[9px] text-slate-300"
                      title="+5m"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => onTargetChange({ ...targetPos, alt: Math.max(0, targetPos.alt - 5) })}
                      className="p-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[9px] text-slate-300"
                      title="-5m"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Grid input */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <input
                type="text"
                placeholder="6-digit grid (e.g. 057 070)"
                value={gridInputTarget}
                onChange={(e) => setGridInputTarget(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyGridCoord(gridInputTarget, false)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-[11px] font-mono placeholder:text-slate-600"
              />
              <button
                onClick={() => applyGridCoord(gridInputTarget, false)}
                className="px-2.5 py-1.5 bg-red-900 hover:bg-red-800 text-red-200 text-[11px] font-mono font-bold rounded"
              >
                {t.apply}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Terrain Presets */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            {t.tacticalLocations} {terrain.name}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {terrain.pois.slice(0, 8).map((poi) => (
              <button
                key={poi.name}
                onClick={() => onTargetChange({ x: poi.x, z: poi.z, alt: poi.elevation || 20 })}
                className="text-[10px] font-mono bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 px-2 py-1 rounded transition-all flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-red-400" />
                <span>{poi.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
