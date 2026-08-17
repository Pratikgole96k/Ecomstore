'use client';

import React, { useState } from 'react';
import { Plus, Tag, X, CheckCircle2 } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function AdminCouponManager({ initialCoupons }: { initialCoupons: any[] }) {
  const router = useRouter();
  const [coupons, setCoupons] = useState(initialCoupons);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '',
    minimumOrder: '999',
    maximumDiscount: '1000',
    usageLimit: '500',
  });

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.value) return;

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.coupon) {
        setCoupons([data.coupon, ...coupons]);
        setShowAddModal(false);
        setFormData({
          code: '',
          type: 'PERCENTAGE',
          value: '',
          minimumOrder: '999',
          maximumDiscount: '1000',
          usageLimit: '500',
        });
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition shadow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-4 px-6">Coupon Code</th>
                <th className="py-4 px-6">Discount Value</th>
                <th className="py-4 px-6">Min Order</th>
                <th className="py-4 px-6">Max Discount</th>
                <th className="py-4 px-6">Used Count / Limit</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {coupons.map((coup) => (
                <tr key={coup.id} className="hover:bg-stone-50/60">
                  <td className="py-4 px-6">
                    <span className="font-mono font-bold text-vastrika-maroon-900 bg-vastrika-maroon-50 px-2.5 py-1 rounded-lg border border-vastrika-maroon-200 text-xs">
                      {coup.code}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-stone-900">
                    {coup.type === 'PERCENTAGE' ? `${coup.value}% OFF` : `₹${coup.value} FLAT`}
                  </td>
                  <td className="py-4 px-6 text-stone-600">{formatPrice(coup.minimumOrder)}</td>
                  <td className="py-4 px-6 text-stone-600">
                    {coup.maximumDiscount ? formatPrice(coup.maximumDiscount) : 'No Cap'}
                  </td>
                  <td className="py-4 px-6 text-stone-600">
                    {coup.usedCount} / {coup.usageLimit || '∞'}
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">New Promo Code</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  placeholder="e.g. DIWALI20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Value *</label>
                  <input
                    type="number"
                    placeholder="10 or 500"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={formData.minimumOrder}
                    onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.maximumDiscount}
                    onChange={(e) => setFormData({ ...formData, maximumDiscount: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold uppercase rounded-xl transition"
              >
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
