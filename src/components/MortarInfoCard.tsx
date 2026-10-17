import React, { useState } from 'react';
import { WeaponConfig, AmmoConfig } from '../types';
import { Shield, Info, ChevronDown, ChevronUp, Layers, CheckCircle, AlertTriangle } from 'lucide-react';

interface MortarInfoCardProps {
  weapon: WeaponConfig;
  selectedAmmo?: AmmoConfig;
  lang: 'en' | 'ar';
}

export const MortarInfoCard: React.FC<MortarInfoCardProps> = ({
  weapon,
  selectedAmmo,
  lang,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const isAmerican = weapon.id.includes('m252');
  const isRussian = weapon.id.includes('2b14');

  // Strict reference values according to Arma Reforger FCS specification
  const mortarName = isAmerican ? 'M252' : isRussian ? '2B14' : weapon.name;
  const caliber = isAmerican ? '81 mm' : isRussian ? '82 mm' : weapon.caliber;
  const angularSystem = isAmerican ? '6400 mil per full circle' : isRussian ? '6000 mil per full circle' : `${weapon.milsPerCircle} mil per full circle`;
  
  const minElevMils = weapon.minElevation; // 800 for M252, 748 for 2B14
  const maxElevMils = weapon.maxElevation; // 1515 for M252, 1415 for 2B14

  // Angular conversions:
  // American M252: degrees = mils * 360 / 6400 -> 800 mils = 45.0°, 1515 mils = 85.2°
  // Russian 2B14: degrees = mils * 360 / 6000 -> 748 mils = 44.9°, 1415 mils = 84.9°
  const minElevDeg = weapon.minElevationDeg !== undefined 
    ? weapon.minElevationDeg 
    : Math.round(((minElevMils * 360) / weapon.milsPerCircle) * 10) / 10;

  const maxElevDeg = weapon.maxElevationDeg !== undefined 
    ? weapon.maxElevationDeg 
    : Math.round(((maxElevMils * 360) / weapon.milsPerCircle) * 10) / 10;

  const verificationStatus = weapon.verificationStatus || 'Requires verification against the existing game implementation';
  const sourceInfo = weapon.sourceInfo || (isAmerican 
    ? 'Arma Reforger Vanilla Mortar & M67 Sight Unit (NATO standard 6400 mils)'
    : 'Arma Reforger Vanilla Mortar & MPM-44M Warsaw Pact Sight Unit (6000 mils)');

  // Ammunition reference list
  const availableAmmunition = weapon.ammunition || [];

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all">
      {/* Header with toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{isAmerican ? '🇺🇸' : isRussian ? '🇷🇺' : '🎯'}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                {lang === 'ar' ? `معلومات هاون ${mortarName}` : `${mortarName} Mortar Information`}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-sky-950 text-sky-400 border border-sky-800">
                {caliber}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {lang === 'ar' 
                ? `نظام القياس: ${weapon.milsPerCircle} مل (${isAmerican ? 'حلف الناتو' : 'حلف وارسو'})`
                : `Angular System: ${angularSystem}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-amber-400/90 hidden sm:inline-block bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40">
            {lang === 'ar' ? 'بيانات المرجع' : 'Reference Specs'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded Content Body */}
      {isExpanded && (
        <div className="p-3.5 space-y-3.5 text-xs font-mono">
          {/* Elevation Limits Display (Primary Requirement) */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{lang === 'ar' ? 'حدود زوايا الارتفاع المعتمدة' : 'Elevation Limits (Mils & Degrees)'}</span>
              <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60">
                {weapon.milsPerCircle === 6400 ? 'NATO 6400' : 'SOVIET 6000'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              {/* Minimum Elevation Box */}
              <div className="bg-slate-950/90 p-2 rounded border border-slate-800">
                <span className="text-[9px] text-slate-500 block uppercase font-sans font-semibold">
                  {lang === 'ar' ? 'الحد الأدنى للارتفاع' : 'Minimum Elevation'}
                </span>
                <div className="text-sm font-bold text-sky-400 mt-1">
                  {minElevMils} mil ≈ {minElevDeg.toFixed(1)}°
                </div>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  {lang === 'ar' ? 'زاوية الرمي الأدنى' : 'Low quadrant limit'}
                </span>
              </div>

              {/* Maximum Elevation Box */}
              <div className="bg-slate-950/90 p-2 rounded border border-slate-800">
                <span className="text-[9px] text-slate-500 block uppercase font-sans font-semibold">
                  {lang === 'ar' ? 'الحد الأقصى للارتفاع' : 'Maximum Elevation'}
                </span>
                <div className="text-sm font-bold text-emerald-400 mt-1">
                  {maxElevMils} mil ≈ {maxElevDeg.toFixed(1)}°
                </div>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  {lang === 'ar' ? 'زاوية الرمي الأقصى' : 'High quadrant limit'}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Mortar Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
              <span className="text-[9px] text-slate-500 uppercase block">
                {lang === 'ar' ? 'اسم المدفع / الهاون' : 'Mortar Name'}
              </span>
              <span className="text-white font-bold">{mortarName}</span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
              <span className="text-[9px] text-slate-500 uppercase block">
                {lang === 'ar' ? 'العيار' : 'Caliber'}
              </span>
              <span className="text-sky-300 font-bold">{caliber}</span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
              <span className="text-[9px] text-slate-500 uppercase block">
                {lang === 'ar' ? 'نظام قياس الزوايا' : 'Angular Measurement System'}
              </span>
              <span className="text-amber-300 font-bold">{angularSystem}</span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
              <span className="text-[9px] text-slate-500 uppercase block">
                {lang === 'ar' ? 'الذخيرة المحددة حالياً' : 'Selected Ammunition'}
              </span>
              <span className="text-emerald-300 font-bold">
                {selectedAmmo ? `${selectedAmmo.name} (${selectedAmmo.weightKg.toFixed(2)} kg)` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Available Ammunition Reference Information */}
          {availableAmmunition.length > 0 && (
            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>{lang === 'ar' ? 'مرجع الذخائر المتوفرة' : 'Available Ammunition Reference'}</span>
              </div>
              <div className="space-y-1.5">
                {availableAmmunition.map((ammo) => {
                  const isSelected = selectedAmmo?.id === ammo.id;
                  return (
                    <div
                      key={ammo.id}
                      className={`p-2 rounded text-[10px] flex items-center justify-between border transition-all ${
                        isSelected
                          ? 'bg-sky-950/50 border-sky-500 text-white font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[8px] font-bold px-1.5 py-0.2 rounded border uppercase ${
                            ammo.category === 'HE'
                              ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                              : ammo.category === 'ILLUM'
                              ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                              : ammo.category === 'SMOKE'
                              ? 'bg-slate-800 border-slate-600 text-slate-300'
                              : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                          }`}
                        >
                          {ammo.category}
                        </span>
                        <span>{ammo.name}</span>
                        <span className="text-slate-500 text-[9px]">({ammo.code})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400">{ammo.weightKg.toFixed(2)} kg</span>
                        {isSelected && (
                          <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950 px-1 py-0.2 rounded">
                            {lang === 'ar' ? 'محدد' : 'ACTIVE'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Verification Status & Source Info */}
          <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80 space-y-2">
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>{lang === 'ar' ? 'حالة التحقق من البيانات' : 'Data Verification Status'}</span>
              </span>
              <p className="text-[10px] text-amber-300/90 mt-0.5 leading-relaxed bg-amber-950/30 p-1.5 rounded border border-amber-900/40">
                {lang === 'ar'
                  ? 'يتطلب التحقق من مطابقة الحسابات مع التطبيق الفعلي داخل لعبة Arma Reforger'
                  : verificationStatus}
              </p>
            </div>

            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-semibold flex items-center gap-1">
                <Info className="w-3 h-3 text-sky-400" />
                <span>{lang === 'ar' ? 'المعلومات المرجعية للمصدر' : 'Source Information'}</span>
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed bg-slate-950/60 p-1.5 rounded border border-slate-800">
                {sourceInfo}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
