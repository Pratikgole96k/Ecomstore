'use client';

import React from 'react';
import { Sparkles, Truck, RotateCcw } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-vastrika-maroon-900 text-vastrika-gold-200 text-xs font-medium py-2 px-4 border-b border-vastrika-maroon-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center">
          <Sparkles className="w-3.5 h-3.5 text-vastrika-gold-400 animate-pulse" />
          <span className="tracking-wider uppercase font-semibold">FESTIVE EDIT 2026</span>
          <span className="hidden md:inline text-vastrika-gold-400/60">|</span>
          <span className="hidden md:inline">Use code <strong className="text-white bg-vastrika-maroon-800 px-1.5 py-0.5 rounded border border-vastrika-gold-500/40">VASTRIKA10</strong> for 10% Off</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 text-white/90">
            <Truck className="w-3.5 h-3.5 text-vastrika-gold-400" />
            <span>FREE SHIPPING ABOVE ₹1,999</span>
          </div>
          <span className="text-vastrika-gold-400/40">•</span>
          <div className="flex items-center gap-1.5 text-white/90">
            <RotateCcw className="w-3.5 h-3.5 text-vastrika-gold-400" />
            <span>EASY 7-DAY RETURNS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
