'use client';

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

export default function SizeChartModal({
  isOpen,
  onClose,
  category = 'WOMEN',
}: {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}) {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  const womenData = [
    { size: 'XS', bust: unit === 'inches' ? '32' : '81', waist: unit === 'inches' ? '26' : '66', hip: unit === 'inches' ? '36' : '91' },
    { size: 'S', bust: unit === 'inches' ? '34' : '86', waist: unit === 'inches' ? '28' : '71', hip: unit === 'inches' ? '38' : '96' },
    { size: 'M', bust: unit === 'inches' ? '36' : '91', waist: unit === 'inches' ? '30' : '76', hip: unit === 'inches' ? '40' : '101' },
    { size: 'L', bust: unit === 'inches' ? '38' : '96', waist: unit === 'inches' ? '32' : '81', hip: unit === 'inches' ? '42' : '106' },
    { size: 'XL', bust: unit === 'inches' ? '40' : '101', waist: unit === 'inches' ? '34' : '86', hip: unit === 'inches' ? '44' : '111' },
    { size: 'XXL', bust: unit === 'inches' ? '42' : '106', waist: unit === 'inches' ? '36' : '91', hip: unit === 'inches' ? '46' : '116' },
  ];

  const menData = [
    { size: '38 (S)', chest: unit === 'inches' ? '38' : '96', shoulder: unit === 'inches' ? '17.5' : '44', length: unit === 'inches' ? '40' : '101' },
    { size: '40 (M)', chest: unit === 'inches' ? '40' : '101', shoulder: unit === 'inches' ? '18.0' : '45', length: unit === 'inches' ? '42' : '106' },
    { size: '42 (L)', chest: unit === 'inches' ? '42' : '106', shoulder: unit === 'inches' ? '18.5' : '47', length: unit === 'inches' ? '44' : '111' },
    { size: '44 (XL)', chest: unit === 'inches' ? '44' : '111', shoulder: unit === 'inches' ? '19.0' : '48', length: unit === 'inches' ? '45' : '114' },
  ];

  const isMen = category.toUpperCase().includes('MEN');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-vastrika-ivory-300 relative">
        <div className="flex items-center justify-between pb-4 border-b border-vastrika-ivory-300">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-vastrika-gold-600" />
            <h3 className="font-serif text-xl font-bold text-vastrika-maroon-900">
              Indian Standard Size Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-vastrika-ivory-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between mt-4 mb-3">
          <p className="text-xs text-stone-500">All measurements are garment dimensions.</p>
          <div className="flex items-center bg-vastrika-ivory-100 rounded-lg p-0.5 border border-vastrika-ivory-300">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                unit === 'inches'
                  ? 'bg-vastrika-maroon-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                unit === 'cm'
                  ? 'bg-vastrika-maroon-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Size Table */}
        <div className="overflow-x-auto border border-vastrika-ivory-300 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-vastrika-ivory-200/80 text-vastrika-maroon-900 uppercase font-bold border-b border-vastrika-ivory-300">
              {isMen ? (
                <tr>
                  <th className="py-2.5 px-4">Size</th>
                  <th className="py-2.5 px-4">Chest ({unit})</th>
                  <th className="py-2.5 px-4">Shoulder ({unit})</th>
                  <th className="py-2.5 px-4">Length ({unit})</th>
                </tr>
              ) : (
                <tr>
                  <th className="py-2.5 px-4">Size</th>
                  <th className="py-2.5 px-4">Bust ({unit})</th>
                  <th className="py-2.5 px-4">Waist ({unit})</th>
                  <th className="py-2.5 px-4">Hip ({unit})</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-vastrika-ivory-200">
              {isMen
                ? menData.map((row, i) => (
                    <tr key={i} className="hover:bg-vastrika-ivory-100/50">
                      <td className="py-2.5 px-4 font-bold text-vastrika-maroon-900">{row.size}</td>
                      <td className="py-2.5 px-4 text-stone-700">{row.chest}</td>
                      <td className="py-2.5 px-4 text-stone-700">{row.shoulder}</td>
                      <td className="py-2.5 px-4 text-stone-700">{row.length}</td>
                    </tr>
                  ))
                : womenData.map((row, i) => (
                    <tr key={i} className="hover:bg-vastrika-ivory-100/50">
                      <td className="py-2.5 px-4 font-bold text-vastrika-maroon-900">{row.size}</td>
                      <td className="py-2.5 px-4 text-stone-700">{row.bust}</td>
                      <td className="py-2.5 px-4 text-stone-700">{row.waist}</td>
                      <td className="py-2.5 px-4 text-stone-700">{row.hip}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-vastrika-ivory-100 rounded-xl text-[11px] text-stone-600 leading-relaxed">
          💡 <strong>Fitting Tip:</strong> Sarees come with unstitched blouse pieces with 1m fabric. For Kurtis & Anarkalis, if you prefer a relaxed fit, we recommend ordering one size up.
        </div>
      </div>
    </div>
  );
}
