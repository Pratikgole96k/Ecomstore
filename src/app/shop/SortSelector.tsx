'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelector({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1'); // Reset to first page on sort change
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={handleSortChange}
      className="bg-vastrika-ivory-100 border border-vastrika-ivory-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer hover:border-vastrika-maroon-800 transition"
    >
      <option value="featured">Featured & Best</option>
      <option value="newest">Newest Additions</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="discount">Highest Discount</option>
    </select>
  );
}
