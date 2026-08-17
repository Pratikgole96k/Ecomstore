'use client';

import React from 'react';
import { ProductItem } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: ProductItem[];
  loading?: boolean;
  emptyMessage?: string;
  columns?: '3' | '4';
}

export default function ProductGrid({
  products,
  loading = false,
  emptyMessage = 'No products found.',
  columns = '4',
}: ProductGridProps) {
  if (loading) {
    return (
      <div
        className={`grid grid-cols-2 md:grid-cols-3 ${
          columns === '4' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
        } gap-4 sm:gap-6`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 border border-vastrika-ivory-300 animate-pulse space-y-3"
          >
            <div className="aspect-[3/4] bg-stone-200 rounded-xl" />
            <div className="h-4 bg-stone-200 rounded w-3/4" />
            <div className="h-3 bg-stone-100 rounded w-1/2" />
            <div className="h-5 bg-stone-200 rounded w-1/3 pt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-vastrika-ivory-300 p-8">
        <p className="font-serif text-lg text-stone-700 font-bold">{emptyMessage}</p>
        <p className="text-xs text-stone-500 mt-1">Try adjusting your filters or search keywords.</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 ${
        columns === '4' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      } gap-4 sm:gap-6`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
