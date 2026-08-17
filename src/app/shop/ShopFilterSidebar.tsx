'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown, Check } from 'lucide-react';

interface ShopFilterSidebarProps {
  categories: any[];
  activeCategory?: string;
  selectedFabrics: string[];
  selectedOccasions: string[];
  selectedColors: string[];
  selectedSizes: string[];
  minPrice?: string;
  maxPrice?: string;
  sort: string;
}

export default function ShopFilterSidebar({
  categories,
  activeCategory,
  selectedFabrics,
  selectedOccasions,
  selectedColors,
  selectedSizes,
  minPrice = '',
  maxPrice = '',
  sort,
}: ShopFilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fabrics, setFabrics] = useState<string[]>(selectedFabrics);
  const [occasions, setOccasions] = useState<string[]>(selectedOccasions);
  const [colors, setColors] = useState<string[]>(selectedColors);
  const [sizes, setSizes] = useState<string[]>(selectedSizes);
  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fabricOptions = [
    'Pure Katan Silk',
    'Mulberry Silk',
    'Chanderi Silk',
    'Organza Silk',
    'Micro Velvet',
    'Pure Georgette',
    'Pure Cotton',
    'Modal Silk',
    'Raw Silk',
  ];

  const occasionOptions = ['Wedding', 'Festive', 'Party', 'Casual', 'Bridal'];

  const colorOptions = [
    'Royal Crimson',
    'Midnight Wine',
    'Emerald Green',
    'Temple Gold',
    'Dusty Rose',
    'Ivory White',
    'Peach Blush',
    'Pistachio Green',
    'Midnight Navy',
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

  const applyFilters = (updatedParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updatedParams).forEach(([key, val]) => {
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    params.set('page', '1');
    router.push(`/shop?${params.toString()}`);
  };

  const toggleArrayItem = (
    currentList: string[],
    item: string,
    key: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    let updated: string[];
    if (currentList.includes(item)) {
      updated = currentList.filter((i) => i !== item);
    } else {
      updated = [...currentList, item];
    }
    setter(updated);
    applyFilters({ [key]: updated.length > 0 ? updated.join(',') : null });
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({
      minPrice: priceMin || null,
      maxPrice: priceMax || null,
    });
  };

  const clearAllFilters = () => {
    setFabrics([]);
    setOccasions([]);
    setColors([]);
    setSizes([]);
    setPriceMin('');
    setPriceMax('');
    router.push('/shop');
  };

  const hasActiveFilters =
    activeCategory ||
    fabrics.length > 0 ||
    occasions.length > 0 ||
    colors.length > 0 ||
    sizes.length > 0 ||
    priceMin ||
    priceMax;

  return (
    <>
      {/* Mobile Filter Trigger */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-vastrika-ivory-300 text-vastrika-maroon-900 font-bold text-xs shadow-sm"
        >
          <Filter className="w-4 h-4 text-vastrika-gold-600" />
          <span>Filter & Refine ({fabrics.length + occasions.length + (priceMin ? 1 : 0)})</span>
        </button>
      </div>

      {/* Sidebar Content */}
      <div
        className={`bg-white rounded-3xl p-6 border border-vastrika-ivory-300 shadow-luxury space-y-6 ${
          mobileFilterOpen
            ? 'fixed inset-0 z-50 overflow-y-auto rounded-none p-6'
            : 'hidden lg:block'
        }`}
      >
        {mobileFilterOpen && (
          <div className="flex items-center justify-between pb-4 border-b border-vastrika-ivory-300 lg:hidden">
            <h3 className="font-serif text-lg font-bold text-vastrika-maroon-900">
              Filters & Refinements
            </h3>
            <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-stone-500">
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-vastrika-maroon-900">
            <Filter className="w-4 h-4 text-vastrika-gold-600" />
            <span>Filters</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-red-700 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-2.5 pb-4 border-b border-vastrika-ivory-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Category</h4>
          <div className="space-y-1 text-xs">
            <button
              onClick={() => applyFilters({ category: null })}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg font-medium transition ${
                !activeCategory
                  ? 'bg-vastrika-maroon-900 text-white font-bold'
                  : 'text-stone-700 hover:bg-vastrika-ivory-100'
              }`}
            >
              All Collections
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => applyFilters({ category: cat.slug })}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg font-medium transition ${
                  activeCategory === cat.slug
                    ? 'bg-vastrika-maroon-900 text-white font-bold'
                    : 'text-stone-700 hover:bg-vastrika-ivory-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3 pb-4 border-b border-vastrika-ivory-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Price Range (₹)
          </h4>
          <form onSubmit={handlePriceApply} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full text-xs p-2 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-lg"
              />
              <span className="text-stone-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full text-xs p-2 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-vastrika-maroon-900 text-white rounded-lg text-xs font-bold hover:bg-vastrika-maroon-800 transition"
            >
              Apply Price
            </button>
          </form>
        </div>

        {/* Fabric Filter */}
        <div className="space-y-2.5 pb-4 border-b border-vastrika-ivory-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Fabric</h4>
          <div className="space-y-1.5">
            {fabricOptions.map((fab) => {
              const isChecked = fabrics.includes(fab);
              return (
                <label
                  key={fab}
                  className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-stone-950 select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleArrayItem(fabrics, fab, 'fabric', setFabrics)}
                    className="rounded text-vastrika-maroon-900 focus:ring-vastrika-maroon-900 border-vastrika-ivory-300"
                  />
                  <span>{fab}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Occasion Filter */}
        <div className="space-y-2.5 pb-4 border-b border-vastrika-ivory-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Occasion</h4>
          <div className="space-y-1.5">
            {occasionOptions.map((occ) => {
              const isChecked = occasions.includes(occ);
              return (
                <label
                  key={occ}
                  className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-stone-950 select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleArrayItem(occasions, occ, 'occasion', setOccasions)}
                    className="rounded text-vastrika-maroon-900 focus:ring-vastrika-maroon-900 border-vastrika-ivory-300"
                  />
                  <span>{occ}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Size Filter */}
        <div className="space-y-2.5 pb-4 border-b border-vastrika-ivory-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Size</h4>
          <div className="flex flex-wrap gap-1.5">
            {sizeOptions.map((sz) => {
              const isSelected = sizes.includes(sz);
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleArrayItem(sizes, sz, 'size', setSizes)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition ${
                    isSelected
                      ? 'bg-vastrika-maroon-900 text-white border-vastrika-maroon-900'
                      : 'bg-white text-stone-700 border-vastrika-ivory-300 hover:border-vastrika-maroon-700'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {mobileFilterOpen && (
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="w-full py-3 bg-vastrika-maroon-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Show Results
          </button>
        )}
      </div>
    </>
  );
}
