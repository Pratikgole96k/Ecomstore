'use client';

import React from 'react';
import { ProductVariantItem } from '@/types';
import { Ruler, AlertCircle } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariantItem[];
  selectedVariant: ProductVariantItem | null;
  onSelectVariant: (variant: ProductVariantItem) => void;
  onOpenSizeGuide: () => void;
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
  onOpenSizeGuide,
}: VariantSelectorProps) {
  // Extract unique sizes and colors
  const sizes = Array.from(new Set(variants.map((v) => v.size)));
  const colors = Array.from(new Set(variants.map((v) => v.color)));

  const currentColor = selectedVariant?.color || colors[0];
  const currentSize = selectedVariant?.size || sizes[0];

  const handleColorChange = (color: string) => {
    const match =
      variants.find((v) => v.color === color && v.size === currentSize) ||
      variants.find((v) => v.color === color);
    if (match) onSelectVariant(match);
  };

  const handleSizeChange = (size: string) => {
    const match =
      variants.find((v) => v.size === size && v.color === currentColor) ||
      variants.find((v) => v.size === size);
    if (match) onSelectVariant(match);
  };

  // Stock status text
  const stock = selectedVariant?.stock ?? 10;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div className="space-y-5">
      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-stone-500 font-medium">Color:</span>
            <span className="font-bold text-vastrika-maroon-900">{currentColor}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = currentColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    isSelected
                      ? 'bg-vastrika-maroon-900 text-white border-vastrika-maroon-900 shadow-sm'
                      : 'bg-white text-stone-700 border-vastrika-ivory-300 hover:border-vastrika-maroon-700'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 font-medium">Select Size:</span>
              <span className="font-bold text-vastrika-maroon-900">{currentSize}</span>
            </div>
            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="text-vastrika-maroon-800 hover:underline flex items-center gap-1 font-semibold text-xs"
            >
              <Ruler className="w-3.5 h-3.5 text-vastrika-gold-600" />
              <span>Size Guide</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variantForSize = variants.find(
                (v) => v.size === size && v.color === currentColor
              );
              const isSelected = currentSize === size;
              const sizeOutOfStock = (variantForSize?.stock ?? 0) <= 0;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={sizeOutOfStock}
                  onClick={() => handleSizeChange(size)}
                  className={`min-w-[44px] h-10 px-3 rounded-lg text-xs font-bold border transition flex items-center justify-center relative ${
                    isSelected
                      ? 'bg-vastrika-maroon-900 text-white border-vastrika-maroon-900 shadow'
                      : sizeOutOfStock
                      ? 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed line-through'
                      : 'bg-white text-stone-800 border-vastrika-ivory-300 hover:border-vastrika-maroon-700'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Real-time stock status badge */}
      <div className="pt-1">
        {isOutOfStock ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4" />
            <span>Currently Out of Stock. Join waitlist or select another size.</span>
          </div>
        ) : isLowStock ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Hurry! Only {stock} items left in stock.</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>In Stock — Ready to Dispatch within 24 Hours</span>
          </div>
        )}
      </div>
    </div>
  );
}
