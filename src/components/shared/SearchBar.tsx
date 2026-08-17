'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, TrendingUp, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { ProductItem } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function SearchBar({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = [
    'Banarasi Silk Saree',
    'Lucknowi Chikankari',
    'Bridal Velvet Lehenga',
    'Nehru Jacket',
    'Chanderi Kurta Set',
    'Mirror Work Sharara',
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    async function searchProducts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(debouncedQuery)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }

    searchProducts();
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handlePopularClick = (term: string) => {
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-start items-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden mt-6 sm:mt-12 border border-vastrika-ivory-300">
        {/* Search Input Header */}
        <form onSubmit={handleSubmit} className="relative flex items-center p-4 sm:p-5 border-b border-vastrika-ivory-300">
          <Search className="w-6 h-6 text-vastrika-maroon-800 ml-2" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by product name, fabric (silk, georgette), occasion or SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          {loading && <Loader2 className="w-5 h-5 text-vastrika-gold-600 animate-spin mr-2" />}
          {query && !loading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-700 mr-2"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-vastrika-ivory-100 hover:bg-vastrika-ivory-200 text-stone-700 border border-vastrika-ivory-300"
          >
            ESC
          </button>
        </form>

        {/* Results / Suggestions Container */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-vastrika-maroon-900">
                <TrendingUp className="w-4 h-4 text-vastrika-gold-600" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => handlePopularClick(term)}
                    className="text-xs px-3.5 py-2 rounded-full bg-vastrika-ivory-100 hover:bg-vastrika-maroon-50 hover:text-vastrika-maroon-900 border border-vastrika-ivory-300 transition text-stone-700 font-medium flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-vastrika-gold-500" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-vastrika-ivory-200">
                <span>Matching Products ({results.length})</span>
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-vastrika-maroon-800 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>View all results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-vastrika-ivory-100 border border-transparent hover:border-vastrika-ivory-300 transition group"
                  >
                    <div className="w-16 h-20 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={product.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-stone-800 truncate group-hover:text-vastrika-maroon-800">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {product.fabric || 'Heritage Weave'} • {product.occasion || 'Festive'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-vastrika-maroon-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-[10px] text-stone-400 line-through">
                            {formatPrice(product.mrp)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-stone-500">
              <p className="text-sm">No products found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-stone-400 mt-1">
                Try searching for &ldquo;Saree&rdquo;, &ldquo;Silk&rdquo;, &ldquo;Lehenga&rdquo;, or &ldquo;Kurta&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
