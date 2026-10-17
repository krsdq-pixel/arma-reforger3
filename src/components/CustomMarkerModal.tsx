import React, { useState } from 'react';
import { CustomMapMarker } from '../types';
import { TRANSLATIONS } from '../locales/translations';
import { MapPin, X, Check } from 'lucide-react';

interface CustomMarkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (marker: CustomMapMarker) => void;
  defaultCoords: { x: number; z: number };
  lang: 'en' | 'ar';
}

const COLOR_PRESETS = [
  { id: '#ef4444', label: 'Red (Hostile)' },
  { id: '#38bdf8', label: 'Blue (Friendly)' },
  { id: '#10b981', label: 'Green (Safe/LZ)' },
  { id: '#f59e0b', label: 'Amber (Observation)' },
  { id: '#a855f7', label: 'Purple (Objective)' },
];

export const CustomMarkerModal: React.FC<CustomMarkerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultCoords,
  lang,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'observation' | 'enemy' | 'friendly' | 'objective' | 'waypoint'>('observation');
  const [color, setColor] = useState('#ef4444');
  const [posX, setPosX] = useState(defaultCoords.x);
  const [posZ, setPosZ] = useState(defaultCoords.z);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const marker: CustomMapMarker = {
      id: `marker_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      x: Math.round(posX),
      z: Math.round(posZ),
      color,
      category,
      notes: notes.trim() || undefined,
      createdAt: Date.now(),
    };

    onSave(marker);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-slate-200 font-mono text-xs"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">
              {t.customMarkerModalTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              {t.markerName}
            </label>
            <input
              type="text"
              required
              placeholder={isAr ? 'مثال: نقطة مراقبة، رتل معادٍ، كمين' : 'e.g. OP Echo, Hostile BTR, Rally Point'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-sans text-xs focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                {t.markerCategory}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs"
              >
                <option value="observation">{isAr ? 'نقطة مراقبة (Observation)' : 'Observation'}</option>
                <option value="enemy">{isAr ? 'هدف معادٍ (Enemy)' : 'Enemy Contact'}</option>
                <option value="friendly">{isAr ? 'قوات صديقة (Friendly)' : 'Friendly Force'}</option>
                <option value="objective">{isAr ? 'هدف عملياتي (Objective)' : 'Objective'}</option>
                <option value="waypoint">{isAr ? 'نقطة مسار (Waypoint)' : 'Waypoint'}</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                {t.markerColor}
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      color === c.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.id }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                X (Easting)
              </label>
              <input
                type="number"
                value={posX}
                onChange={(e) => setPosX(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs text-center font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                Z (Northing)
              </label>
              <input
                type="number"
                value={posZ}
                onChange={(e) => setPosZ(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs text-center font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              {t.markerNotes}
            </label>
            <textarea
              rows={2}
              placeholder={isAr ? 'ملاحظات تكتيكية اختيارية...' : 'Optional tactical notes...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-sans text-xs focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{t.saveMarker}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
