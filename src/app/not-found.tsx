import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-vastrika-ivory-300 shadow-luxury">
        <div className="w-16 h-16 rounded-full bg-vastrika-maroon-50 text-vastrika-maroon-900 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-vastrika-gold-700">
            404 • Page Not Found
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-vastrika-maroon-950">
            Lost in Heritage
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed">
            The creation or page you are seeking might have been moved, renamed, or is currently unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-vastrika-ivory-100 hover:bg-vastrika-ivory-200 text-stone-800 border border-vastrika-ivory-300 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
