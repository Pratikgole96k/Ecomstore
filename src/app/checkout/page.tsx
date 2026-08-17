'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { UserSession } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shippingFee, tax, total, appliedCoupon, clearCart } = useCart();

  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    country: 'India',
    paymentMethod: 'COD' as 'COD' | 'RAZORPAY' | 'UPI' | 'CARD',
  });

  // Prepopulate if logged in
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setFormData((prev) => ({
              ...prev,
              fullName: data.user.name || '',
              email: data.user.email || '',
              phone: data.user.phone || '',
            }));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadUser();
  }, []);

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi NCR',
  ];

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">No items to checkout</h2>
        <p className="text-xs text-stone-500 mb-6">Your bag is empty. Please add products to proceed.</p>
        <Link
          href="/shop"
          className="inline-block bg-vastrika-maroon-900 text-white text-xs font-bold px-6 py-3 rounded-xl uppercase tracking-wider"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Validate form
      if (
        !formData.fullName ||
        !formData.phone ||
        !formData.addressLine1 ||
        !formData.city ||
        !formData.pincode
      ) {
        throw new Error('Please fill in all mandatory delivery address fields.');
      }

      // If Razorpay is chosen, handle Razorpay order flow
      let razorpayData = null;
      if (formData.paymentMethod === 'RAZORPAY' || formData.paymentMethod === 'UPI' || formData.paymentMethod === 'CARD') {
        const createRes = await fetch('/api/payments/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total }),
        });

        const payOrder = await createRes.json();
        if (!createRes.ok || !payOrder.order) {
          throw new Error('Payment gateway error. Please try Cash on Delivery or retry.');
        }

        // Razorpay order simulation or checkout response
        razorpayData = {
          razorpayOrderId: payOrder.order.id,
          razorpayPaymentId: `pay_${Date.now()}`,
          razorpaySignature: 'sig_verified_mock_success',
        };
      }

      // Authoritative server-side checkout
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            quantity: i.quantity,
          })),
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country,
          },
          paymentMethod: formData.paymentMethod,
          couponCode: appliedCoupon?.code,
          email: formData.email,
          ...(razorpayData || {}),
        }),
      });

      const orderResult = await checkoutRes.json();

      if (!checkoutRes.ok || !orderResult.success) {
        throw new Error(orderResult.error || 'Failed to place order.');
      }

      // Clear Cart and Redirect
      clearCart();
      router.push(`/order-success/${orderResult.orderId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Checkout Title */}
      <div className="flex items-center justify-between border-b border-vastrika-ivory-300 pb-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-vastrika-maroon-950">
            Express Checkout
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Handcrafted luxury delivered with supreme safety & insurance.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Contact & Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Contact Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vastrika-ivory-300 shadow-luxury space-y-4">
            <div className="flex items-center justify-between border-b border-vastrika-ivory-200 pb-3">
              <h2 className="font-serif text-lg font-bold text-stone-900">
                1. Contact Information
              </h2>
              {!user && (
                <Link
                  href="/login?redirect=/checkout"
                  className="text-xs font-bold text-vastrika-maroon-800 hover:underline"
                >
                  Already have an account? Sign In
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Priya Sharma"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl focus:outline-none focus:border-vastrika-maroon-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number (For Delivery Updates) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl focus:outline-none focus:border-vastrika-maroon-800"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address (For Order Invoice & Tracking) *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. priya@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl focus:outline-none focus:border-vastrika-maroon-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vastrika-ivory-300 shadow-luxury space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-vastrika-ivory-200 pb-3">
              2. Delivery Address
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Flat, House No., Building, Street *
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  placeholder="Flat 402, Lotus Grandeur, Linking Road"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl focus:outline-none focus:border-vastrika-maroon-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Area, Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  placeholder="Near National College, Bandra West"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl focus:outline-none focus:border-vastrika-maroon-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl focus:outline-none focus:border-vastrika-maroon-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl focus:outline-none focus:border-vastrika-maroon-800"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    name="pincode"
                    placeholder="400050"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-vastrika-ivory-50 border border-vastrika-ivory-300 rounded-xl focus:outline-none focus:border-vastrika-maroon-800 font-mono"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vastrika-ivory-300 shadow-luxury space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-vastrika-ivory-200 pb-3">
              3. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cash On Delivery */}
              <label
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                  formData.paymentMethod === 'COD'
                    ? 'border-vastrika-maroon-900 bg-vastrika-maroon-50/50'
                    : 'border-vastrika-ivory-300 bg-white hover:border-vastrika-maroon-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleInputChange}
                  className="mt-1 text-vastrika-maroon-900 focus:ring-vastrika-maroon-900"
                />
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-stone-500 mt-0.5 block leading-tight">
                    Pay with cash or UPI QR code at your doorstep upon delivery.
                  </span>
                </div>
              </label>

              {/* Online Payment / Razorpay */}
              <label
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                  formData.paymentMethod === 'RAZORPAY'
                    ? 'border-vastrika-maroon-900 bg-vastrika-maroon-50/50'
                    : 'border-vastrika-ivory-300 bg-white hover:border-vastrika-maroon-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={formData.paymentMethod === 'RAZORPAY'}
                  onChange={handleInputChange}
                  className="mt-1 text-vastrika-maroon-900 focus:ring-vastrika-maroon-900"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-900">Razorpay Secure</span>
                    <span className="bg-vastrika-gold-100 text-vastrika-gold-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                      UPI / CARDS
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 mt-0.5 block leading-tight">
                    Google Pay, PhonePe, Paytm, Credit/Debit Cards, NetBanking.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary & Place Order CTA */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vastrika-ivory-300 shadow-luxury space-y-4 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-vastrika-ivory-200 pb-3">
              Order Review ({items.length} Items)
            </h3>

            {/* Mini items list */}
            <div className="max-h-56 overflow-y-auto space-y-3 divide-y divide-vastrika-ivory-200 pr-1">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                  <div className="w-12 h-16 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-stone-500">
                      Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                    </p>
                    <p className="font-serif text-xs font-bold text-vastrika-maroon-900 mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-vastrika-ivory-200 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-stone-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-semibold text-stone-900">{formatPrice(tax)}</span>
              </div>

              <div className="pt-3 border-t border-vastrika-ivory-200 flex justify-between items-baseline text-stone-900">
                <span className="font-bold text-sm">Amount Payable</span>
                <span className="font-serif text-2xl font-bold text-vastrika-maroon-950">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 flex flex-col items-center gap-1 text-[11px] text-stone-400 text-center">
              <span>By placing order you agree to VASTRIKA&apos;s Terms of Heritage Service.</span>
              <span className="text-stone-500 font-medium">✨ Authentic Handloom Guaranteed</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
