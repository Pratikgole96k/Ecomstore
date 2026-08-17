'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Heart, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-vastrika-charcoal-950 text-vastrika-ivory-200 pt-16 pb-12 border-t border-vastrika-maroon-900/60">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-vastrika-maroon-900/80 text-vastrika-gold-400 border border-vastrika-gold-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white tracking-wide">100% Authentic Handloom</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Directly sourced from heritage artisan clusters in Varanasi, Kanchipuram & Awadh.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-vastrika-maroon-900/80 text-vastrika-gold-400 border border-vastrika-gold-500/20 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white tracking-wide">Complimentary Express Shipping</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Free insured delivery across all 28 Indian states on orders above ₹1,999.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-vastrika-maroon-900/80 text-vastrika-gold-400 border border-vastrika-gold-500/20 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white tracking-wide">Hassle-Free 7-Day Returns</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Easy doorstep pick-up and instant store credit or original payment refunds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-vastrika-maroon-900/80 text-vastrika-gold-400 border border-vastrika-gold-500/20 shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white tracking-wide">Artisan Weaver Royalty</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Every purchase contributes directly to sustainable weaver co-operatives in India.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-[0.25em] text-white">
                VASTRIKA
              </span>
              <p className="text-[10px] tracking-[0.25em] text-vastrika-gold-400 uppercase font-semibold">
                Tradition Woven Into Every Story
              </p>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              VASTRIKA celebrates India’s timeless textile legacy. From regal Banarasi brocades to delicate Lucknowi Chikankari, each garment is handcrafted by master artisans to adorn your life’s most cherished celebrations.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-vastrika-gold-300 uppercase tracking-wider mb-2">
                Join the Royal Circle
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-stone-900 border border-stone-700 text-xs px-3.5 py-2.5 rounded-l-lg focus:outline-none focus:border-vastrika-gold-500 text-white flex-1"
                  required
                />
                <button
                  type="submit"
                  className="bg-vastrika-gold-500 hover:bg-vastrika-gold-600 text-vastrika-charcoal-950 font-bold px-4 py-2.5 rounded-r-lg text-xs transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </form>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Welcome to the VASTRIKA family! Use code VASTRIKA10 for 10% off.</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links: Heritage Collections */}
          <div>
            <h5 className="font-serif text-base font-bold text-white tracking-wider mb-4 border-b border-vastrika-gold-500/20 pb-2">
              COLLECTIONS
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/shop/sarees" className="hover:text-vastrika-gold-300 transition">
                  Banarasi & Kanjivaram Sarees
                </Link>
              </li>
              <li>
                <Link href="/shop/lehengas" className="hover:text-vastrika-gold-300 transition">
                  Bridal & Velvet Lehengas
                </Link>
              </li>
              <li>
                <Link href="/shop/kurtis" className="hover:text-vastrika-gold-300 transition">
                  Lucknowi Chikankari Kurtis
                </Link>
              </li>
              <li>
                <Link href="/shop/kurta-sets" className="hover:text-vastrika-gold-300 transition">
                  Sharara & Kurta Sets
                </Link>
              </li>
              <li>
                <Link href="/shop/anarkalis" className="hover:text-vastrika-gold-300 transition">
                  Kalidar Anarkali Gowns
                </Link>
              </li>
              <li>
                <Link href="/shop/mens-kurtas" className="hover:text-vastrika-gold-300 transition">
                  Men’s Silk Kurtas
                </Link>
              </li>
              <li>
                <Link href="/shop/nehru-jackets" className="hover:text-vastrika-gold-300 transition">
                  Handcrafted Nehru Jackets
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Customer Care */}
          <div>
            <h5 className="font-serif text-base font-bold text-white tracking-wider mb-4 border-b border-vastrika-gold-500/20 pb-2">
              CUSTOMER CARE
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/account/orders" className="hover:text-vastrika-gold-300 transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account/addresses" className="hover:text-vastrika-gold-300 transition">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-vastrika-gold-300 transition">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-vastrika-gold-300 transition">
                  Indian Size Guide
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-vastrika-gold-300 transition">
                  Fabric & Care Guide
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-vastrika-gold-300 transition">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Experience & Admin */}
          <div>
            <h5 className="font-serif text-base font-bold text-white tracking-wider mb-4 border-b border-vastrika-gold-500/20 pb-2">
              VASTRIKA
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/account" className="hover:text-vastrika-gold-300 transition">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-vastrika-gold-300 transition">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-vastrika-gold-300 transition">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-vastrika-gold-400 hover:underline font-semibold flex items-center gap-1">
                  <span>Admin Studio</span>
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-stone-500">
                Customer Support: <br />
                <span className="text-white font-medium">+91 (022) 8765-4321</span>
                <br />
                care@vastrika.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Trust */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <p>© {new Date().getFullYear()} VASTRIKA Heritage Pvt. Ltd. All rights reserved. Handcrafted with pride in India 🇮🇳</p>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="bg-stone-900 border border-stone-800 px-2 py-1 rounded text-stone-300">UPI</span>
          <span className="bg-stone-900 border border-stone-800 px-2 py-1 rounded text-stone-300">Razorpay</span>
          <span className="bg-stone-900 border border-stone-800 px-2 py-1 rounded text-stone-300">Visa / Mastercard</span>
          <span className="bg-stone-900 border border-stone-800 px-2 py-1 rounded text-stone-300">RuPay</span>
          <span className="bg-stone-900 border border-stone-800 px-2 py-1 rounded text-stone-300">Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
}
