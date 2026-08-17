'use client';

import React from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeItem,
    updateQuantity,
    subtotal,
    freeShippingProgress,
    amountForFreeShipping,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-vastrika-ivory-300">
          {/* Header */}
          <div>
            <div className="p-4 sm:p-5 border-b border-vastrika-ivory-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-vastrika-maroon-800" />
                <h3 className="font-serif text-lg font-bold text-vastrika-maroon-900">
                  Your Shopping Bag ({items.length})
                </h3>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-vastrika-ivory-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-vastrika-ivory-100 p-3.5 border-b border-vastrika-ivory-300">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                {amountForFreeShipping > 0 ? (
                  <span className="text-stone-700">
                    Add <strong>{formatPrice(amountForFreeShipping)}</strong> more for <strong>FREE Shipping</strong>!
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-vastrika-gold-500" />
                    <span>🎉 Congratulations! Free Shipping Unlocked!</span>
                  </span>
                )}
                <span className="text-vastrika-maroon-900 font-bold">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-vastrika-ivory-300 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-vastrika-gold-500 to-vastrika-maroon-700 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-vastrika-ivory-200">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-vastrika-maroon-50 flex items-center justify-center text-vastrika-maroon-700 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-800">Your bag is empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mt-1 mb-6">
                  Explore our royal collection of sarees, lehengas, and kurtas.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="bg-vastrika-maroon-900 text-white text-xs font-semibold px-6 py-2.5 rounded-xl hover:bg-vastrika-maroon-800 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-3.5 first:pt-0 last:pb-0">
                  <div className="w-20 h-24 bg-stone-100 rounded-xl overflow-hidden shrink-0 border border-vastrika-ivory-300">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="font-serif text-xs sm:text-sm font-bold text-stone-900 hover:text-vastrika-maroon-800 line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 hover:text-red-600 transition p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        {item.size && <span>Size: <strong className="text-stone-700">{item.size}</strong></span>}
                        {item.color && <span>• Color: <strong className="text-stone-700">{item.color}</strong></span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-vastrika-ivory-300 rounded-lg overflow-hidden bg-vastrika-ivory-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2 text-stone-600 hover:bg-vastrika-ivory-200 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 px-2 text-stone-600 hover:bg-vastrika-ivory-200 transition disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-serif text-sm font-bold text-vastrika-maroon-950">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-vastrika-ivory-300 bg-vastrika-ivory-50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-serif text-base font-bold text-vastrika-maroon-950">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Taxes, coupons, and final shipping calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full text-center py-2.5 px-3 rounded-xl border border-vastrika-maroon-900 text-vastrika-maroon-900 hover:bg-vastrika-maroon-50 text-xs font-bold transition"
                >
                  View Full Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full text-center py-2.5 px-3 rounded-xl bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-vastrika-maroon-950/10"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
