'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingProgress,
    amountForFreeShipping,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError('');
    const res = await applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
    setCouponLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-10 rounded-3xl border border-vastrika-ivory-300 shadow-luxury space-y-4">
          <div className="w-20 h-20 rounded-full bg-vastrika-maroon-50 text-vastrika-maroon-900 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Your Bag is Empty</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Your shopping bag awaits handcrafted Indian heirlooms. Discover our master-woven sarees, bridal lehengas, and silk kurtas.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-vastrika-maroon-950">
          Shopping Bag ({items.length})
        </h1>
        <p className="text-xs text-stone-500 mt-1">Review your selections before secure checkout.</p>
      </div>

      {/* Free shipping progress bar */}
      <div className="bg-vastrika-ivory-100 p-4 rounded-2xl border border-vastrika-ivory-300">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          {amountForFreeShipping > 0 ? (
            <span className="text-stone-700">
              Add <strong>{formatPrice(amountForFreeShipping)}</strong> more to unlock <strong>FREE Express Shipping</strong>!
            </span>
          ) : (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-vastrika-gold-600" />
              <span>🎉 Congratulations! Free Express Shipping Unlocked!</span>
            </span>
          )}
          <span className="text-vastrika-maroon-900 font-bold">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-vastrika-ivory-300 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-vastrika-gold-500 to-vastrika-maroon-800 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-vastrika-ivory-300 shadow-luxury divide-y divide-vastrika-ivory-200">
            {items.map((item) => (
              <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex gap-4 sm:gap-6">
                <div className="w-24 h-32 sm:w-28 sm:h-36 bg-stone-100 rounded-2xl overflow-hidden shrink-0 border border-vastrika-ivory-300">
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
                        className="font-serif text-base sm:text-lg font-bold text-stone-900 hover:text-vastrika-maroon-800 transition"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-red-600 transition p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                      {item.size && (
                        <span>
                          Size: <strong className="text-stone-800">{item.size}</strong>
                        </span>
                      )}
                      {item.color && (
                        <span>
                          Color: <strong className="text-stone-800">{item.color}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-vastrika-ivory-100 mt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-vastrika-ivory-300 rounded-xl overflow-hidden bg-vastrika-ivory-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 px-3 text-stone-600 hover:bg-vastrika-ivory-200 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 px-3 text-stone-600 hover:bg-vastrika-ivory-200 transition disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="font-serif text-lg font-bold text-vastrika-maroon-950">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      {item.mrp > item.price && (
                        <div className="text-xs text-stone-400 line-through">
                          {formatPrice(item.mrp * item.quantity)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl p-6 border border-vastrika-ivory-300 shadow-luxury space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-vastrika-maroon-900">
              <Tag className="w-4 h-4 text-vastrika-gold-600" />
              <span>Apply Promo Code</span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800">{appliedCoupon.code}</span>
                  <p className="text-[11px] text-emerald-600">
                    {appliedCoupon.type === 'PERCENTAGE'
                      ? `${appliedCoupon.value}% discount applied`
                      : `₹${appliedCoupon.value} flat discount applied`}
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-emerald-700 hover:text-red-600"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. VASTRIKA10"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      if (couponError) setCouponError('');
                    }}
                    className="flex-1 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl p-2.5 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-vastrika-maroon-800"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold text-xs px-4 rounded-xl transition disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                <div className="text-[11px] text-stone-500 pt-1">
                  Try <strong>VASTRIKA10</strong> for 10% off or <strong>FESTIVE500</strong> for ₹500 off.
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl p-6 border border-vastrika-ivory-300 shadow-luxury space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-vastrika-ivory-200 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Express Shipping</span>
                <span className="font-semibold text-stone-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 uppercase font-bold">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Applicable Taxes (5% GST)</span>
                <span className="font-semibold text-stone-900">{formatPrice(tax)}</span>
              </div>

              <div className="pt-3 border-t border-vastrika-ivory-200 flex justify-between items-baseline text-stone-900">
                <span className="font-bold text-sm">Grand Total</span>
                <span className="font-serif text-xl font-bold text-vastrika-maroon-950">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 px-6 rounded-xl bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
