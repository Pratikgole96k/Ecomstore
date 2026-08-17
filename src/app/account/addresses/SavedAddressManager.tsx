'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { AddressItem } from '@/types';

export default function SavedAddressManager({
  initialAddresses,
  userId,
}: {
  initialAddresses: any[];
  userId: string;
}) {
  const [addresses, setAddresses] = useState<any[]>(initialAddresses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    isDefault: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.pincode) return;

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.address) {
        setAddresses([data.address, ...addresses]);
        setShowAddModal(false);
        setFormData({
          fullName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: 'Maharashtra',
          pincode: '',
          isDefault: false,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/addresses?id=${id}`, { method: 'DELETE' });
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition shadow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white rounded-3xl p-6 border shadow-luxury relative space-y-3 ${
              addr.isDefault ? 'border-vastrika-gold-500/60 ring-2 ring-vastrika-gold-200' : 'border-vastrika-ivory-300'
            }`}
          >
            {addr.isDefault && (
              <span className="inline-flex items-center gap-1 bg-vastrika-gold-100 text-vastrika-gold-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-vastrika-gold-300">
                <CheckCircle2 className="w-3 h-3" />
                <span>DEFAULT ADDRESS</span>
              </span>
            )}

            <div className="text-xs text-stone-700 space-y-1">
              <strong className="text-stone-900 text-sm block">{addr.fullName}</strong>
              <p>{addr.addressLine1}</p>
              {addr.addressLine2 && <p>{addr.addressLine2}</p>}
              <p>
                {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
              </p>
              <p className="text-stone-400 pt-1">Phone: {addr.phone}</p>
            </div>

            <div className="pt-3 border-t border-vastrika-ivory-200 flex justify-end">
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-stone-400 hover:text-red-600 text-xs font-semibold flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-vastrika-ivory-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-vastrika-ivory-200">
              <h3 className="font-serif text-lg font-bold text-vastrika-maroon-900">
                Add Delivery Address
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  placeholder="House/Flat number, Street name"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className="w-full text-xs p-2.5 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="addressLine2"
                  placeholder="Apartment, Landmark, Area"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="w-full text-xs p-2.5 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full text-xs p-2.5 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
