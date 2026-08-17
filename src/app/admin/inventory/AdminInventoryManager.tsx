'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Check, Loader2, Save } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminInventoryManager({ initialVariants }: { initialVariants: any[] }) {
  const router = useRouter();
  const [variants, setVariants] = useState(initialVariants);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [filterLowOnly, setFilterLowOnly] = useState(false);

  const displayedVariants = filterLowOnly
    ? variants.filter((v) => v.stock <= 5)
    : variants;

  const handleStartEdit = (variant: any) => {
    setEditingId(variant.id);
    setNewStock(variant.stock);
  };

  const handleSaveStock = async (variantId: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, stock: newStock }),
      });

      if (res.ok) {
        setVariants(
          variants.map((v) => (v.id === variantId ? { ...v, stock: newStock } : v))
        );
        setEditingId(null);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filterLowOnly}
            onChange={(e) => setFilterLowOnly(e.target.checked)}
            className="rounded text-vastrika-maroon-900 focus:ring-vastrika-maroon-900"
          />
          <span>Show Low Stock Variants Only (&le; 5 units)</span>
        </label>
        <span className="text-xs text-stone-500">
          Showing {displayedVariants.length} of {variants.length} variant items
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-4 px-6">Product & Category</th>
                <th className="py-4 px-6">Variant SKU</th>
                <th className="py-4 px-6">Size / Color</th>
                <th className="py-4 px-6">Unit Price</th>
                <th className="py-4 px-6">Current Stock</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayedVariants.map((v) => {
                const isEditing = editingId === v.id;
                const isLow = v.stock <= 5;

                return (
                  <tr key={v.id} className="hover:bg-stone-50/60">
                    <td className="py-4 px-6">
                      <p className="font-serif text-sm font-bold text-stone-900 line-clamp-1">
                        {v.product.name}
                      </p>
                      <span className="text-[11px] text-stone-400">
                        {v.product.category.name}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-mono text-stone-600 text-[11px]">{v.sku}</td>

                    <td className="py-4 px-6">
                      <span className="font-bold text-stone-800">
                        {v.size} ({v.color})
                      </span>
                    </td>

                    <td className="py-4 px-6 font-serif font-bold text-stone-900">
                      {formatPrice(v.price)}
                    </td>

                    <td className="py-4 px-6 font-mono font-bold">
                      {isEditing ? (
                        <input
                          type="number"
                          value={newStock}
                          onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                          className="w-20 p-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                        />
                      ) : (
                        <span className={isLow ? 'text-red-700 text-sm' : 'text-stone-800'}>
                          {v.stock} units
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {v.stock <= 0 ? (
                        <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                          OUT OF STOCK
                        </span>
                      ) : isLow ? (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> LOW STOCK
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          HEALTHY
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveStock(v.id)}
                            disabled={saving}
                            className="p-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
                            title="Save"
                          >
                            {saving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(v)}
                          className="py-1 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-bold text-[11px]"
                        >
                          Quick Adjust
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
