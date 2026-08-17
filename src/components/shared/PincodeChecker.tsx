'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle2, Truck, AlertCircle } from 'lucide-react';

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [checked, setChecked] = useState(false);
  const [valid, setValid] = useState(false);
  const [estimate, setEstimate] = useState('');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setChecked(true);
      setValid(false);
      return;
    }

    setChecked(true);
    setValid(true);

    // Calculate delivery date (3-5 business days from now)
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 4);

    const formattedDate = new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(deliveryDate);

    setEstimate(formattedDate);
  };

  return (
    <div className="bg-vastrika-ivory-100/70 rounded-xl p-4 border border-vastrika-ivory-300">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-vastrika-maroon-900 mb-2">
        <MapPin className="w-4 h-4 text-vastrika-gold-600" />
        <span>Delivery Pincode & Availability</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Indian PIN code (e.g. 400050)"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value);
            if (checked) setChecked(false);
          }}
          className="bg-white border border-vastrika-ivory-300 text-xs px-3.5 py-2 rounded-lg focus:outline-none focus:border-vastrika-gold-600 text-stone-900 flex-1 font-mono tracking-wider"
        />
        <button
          type="submit"
          className="bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-semibold px-4 py-2 rounded-lg text-xs transition"
        >
          Check
        </button>
      </form>

      {checked && valid && (
        <div className="mt-3 space-y-1.5 animate-in fade-in">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <span>Delivery Available for PIN {pincode}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <Truck className="w-3.5 h-3.5 text-vastrika-gold-600" />
            <span>Estimated Delivery by <strong>{estimate}</strong></span>
          </div>
          <p className="text-[11px] text-stone-500">
            ✓ Cash on Delivery available &nbsp;|&nbsp; ✓ Free returns & exchanges within 7 days
          </p>
        </div>
      )}

      {checked && !valid && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-red-600 animate-in fade-in">
          <AlertCircle className="w-4 h-4" />
          <span>Please enter a valid 6-digit postal code.</span>
        </div>
      )}
    </div>
  );
}
