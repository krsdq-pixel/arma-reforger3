import React from 'react';
import { WeatherSettings, WindUnit } from '../types';
import { Wind, Compass, AlertCircle, X, RotateCcw } from 'lucide-react';

interface WeatherWidgetProps {
  weather: WeatherSettings;
  onChange: (updated: Partial<WeatherSettings>) => void;
  onClose: () => void;
  lang: 'en' | 'ar';
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  onChange,
  onClose,
  lang,
}) => {
  const isAr = lang === 'ar';

  const units: WindUnit[] = ['m/s', 'km/h', 'knots', 'mph'];

  return (
    <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 sm:p-4 shadow-2xl w-72 sm:w-80 text-slate-200 text-xs font-mono z-30 transition-all select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white uppercase text-[11px] tracking-wide">
              {isAr ? 'رصد الطقس والرياح' : 'Weather & Wind HUD'}
            </h3>
            <span className="text-[9px] text-amber-400/90 font-sans block">
              {isAr ? 'بيانات رصد ميداني يدوي' : 'Manual Field Observation'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Wind Speed Section with flexible numeric input */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">
              {isAr ? 'سرعة الرياح' : 'Wind Speed'}
            </label>
            <div className="flex gap-1">
              {units.map((u) => (
                <button
                  key={u}
                  onClick={() => onChange({ windUnit: u })}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                    weather.windUnit === u
                      ? 'bg-sky-500 text-slate-950 shadow'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="200"
              step="0.5"
              value={weather.windSpeed}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChange({ windSpeed: isNaN(val) ? 0 : Math.max(0, val) });
              }}
              className="w-24 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-bold text-sm text-center focus:border-sky-500 focus:outline-none"
            />
            <span className="text-slate-400 font-bold">{weather.windUnit}</span>

            {/* Quick preset chips for rapid entry */}
            <div className="flex items-center gap-1 ml-auto">
              {[0, 5, 10, 15, 25].map((preset) => (
                <button
                  key={preset}
                  onClick={() => onChange({ windSpeed: preset })}
                  className={`px-1.5 py-1 rounded text-[9px] border transition-all ${
                    weather.windSpeed === preset
                      ? 'bg-sky-950 border-sky-400 text-sky-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wind Direction Section */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>{isAr ? 'اتجاه الرياح (قادمة من)' : 'Wind Direction (Bearing)'}</span>
            </label>
            <span className="text-[10px] text-sky-300 font-bold">
              {weather.windDirectionDeg}°
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="359"
              value={weather.windDirectionDeg}
              onChange={(e) => onChange({ windDirectionDeg: parseInt(e.target.value, 10) })}
              className="flex-1 accent-sky-500 cursor-pointer"
            />
            <input
              type="number"
              min="0"
              max="359"
              value={weather.windDirectionDeg}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onChange({ windDirectionDeg: isNaN(val) ? 0 : ((val % 360) + 360) % 360 });
              }}
              className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center font-bold text-xs"
            />
          </div>

          {/* Compass Dial Indicator */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-850 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-4 h-4 text-center text-sky-400 font-bold transition-transform"
                style={{ transform: `rotate(${weather.windDirectionDeg}deg)` }}
              >
                ↓
              </span>
              <span>
                {weather.windDirectionDeg >= 337.5 || weather.windDirectionDeg < 22.5
                  ? (isAr ? 'شمالية (N)' : 'North (N)')
                  : weather.windDirectionDeg < 67.5
                  ? (isAr ? 'شمالية شرقية (NE)' : 'Northeast (NE)')
                  : weather.windDirectionDeg < 112.5
                  ? (isAr ? 'شرقية (E)' : 'East (E)')
                  : weather.windDirectionDeg < 157.5
                  ? (isAr ? 'جنوبية شرقية (SE)' : 'Southeast (SE)')
                  : weather.windDirectionDeg < 202.5
                  ? (isAr ? 'جنوبية (S)' : 'South (S)')
                  : weather.windDirectionDeg < 247.5
                  ? (isAr ? 'جنوبية غربية (SW)' : 'Southwest (SW)')
                  : weather.windDirectionDeg < 292.5
                  ? (isAr ? 'غربية (W)' : 'West (W)')
                  : (isAr ? 'شمالية غربية (NW)' : 'Northwest (NW)')}
              </span>
            </span>

            <button
              onClick={() => onChange({ windSpeed: 0, windDirectionDeg: 0 })}
              className="text-[9px] text-slate-400 hover:text-white flex items-center gap-1"
              title={isAr ? 'إعادة ضبط الرياح' : 'Reset Wind'}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isAr ? 'تصفير' : 'Calm'}</span>
            </button>
          </div>
        </div>

        {/* Data Integrity Disclaimer Notice */}
        <div className="p-2 bg-amber-950/40 border border-amber-900/50 rounded-lg flex items-start gap-2 text-[9px] text-amber-300/90 leading-tight">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            {isAr
              ? 'ملاحظة باليستية: بيانات الطقس هذه هي رصد تقديري يدوي. محرك اللعبة الأساسي يعتمد جداول الرماية المعتمدة، ولا يتم تلفيق تصحيحات غير مؤكدة.'
              : 'Integrity Notice: Weather data is for tactical advisory and manual observation. Game ballistics strictly follow verified firing tables without fabricated offsets.'}
          </p>
        </div>
      </div>
    </div>
  );
};
