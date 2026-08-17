import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  Package,
  Heart,
  MapPin,
  Clock,
  ShieldCheck,
  User,
  LogOut,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?redirect=/account');
  }

  const [orders, addressCount, wishlistCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.address.count({ where: { userId: session.id } }),
    prisma.wishlist.count({ where: { userId: session.id } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vastrika-ivory-300 shadow-luxury flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-vastrika-maroon-900 text-vastrika-gold-300 font-serif font-bold text-2xl flex items-center justify-center border-2 border-vastrika-gold-500/40 shadow">
            {session.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-stone-900">{session.name}</h1>
              {session.role === 'ADMIN' && (
                <span className="bg-vastrika-gold-100 text-vastrika-gold-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-vastrika-gold-300">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">{session.email}</p>
            {session.phone && <p className="text-[11px] text-stone-400">{session.phone}</p>}
          </div>
        </div>

        {session.role === 'ADMIN' && (
          <Link
            href="/admin"
            className="bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition shadow flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-vastrika-gold-400" />
            <span>Open Admin Panel</span>
          </Link>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/account/orders"
          className="p-6 bg-white rounded-3xl border border-vastrika-ivory-300 shadow-luxury hover:border-vastrika-maroon-700 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">My Orders</span>
            <Package className="w-5 h-5 text-vastrika-maroon-800" />
          </div>
          <p className="font-serif text-3xl font-bold text-vastrika-maroon-950 mt-2">
            {orders.length}
          </p>
          <span className="text-[11px] text-vastrika-maroon-800 font-semibold mt-1 inline-block group-hover:underline">
            View Order History →
          </span>
        </Link>

        <Link
          href="/wishlist"
          className="p-6 bg-white rounded-3xl border border-vastrika-ivory-300 shadow-luxury hover:border-vastrika-maroon-700 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Wishlist</span>
            <Heart className="w-5 h-5 text-vastrika-maroon-800" />
          </div>
          <p className="font-serif text-3xl font-bold text-vastrika-maroon-950 mt-2">
            {wishlistCount}
          </p>
          <span className="text-[11px] text-vastrika-maroon-800 font-semibold mt-1 inline-block group-hover:underline">
            View Saved Items →
          </span>
        </Link>

        <Link
          href="/account/addresses"
          className="p-6 bg-white rounded-3xl border border-vastrika-ivory-300 shadow-luxury hover:border-vastrika-maroon-700 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Addresses</span>
            <MapPin className="w-5 h-5 text-vastrika-maroon-800" />
          </div>
          <p className="font-serif text-3xl font-bold text-vastrika-maroon-950 mt-2">
            {addressCount}
          </p>
          <span className="text-[11px] text-vastrika-maroon-800 font-semibold mt-1 inline-block group-hover:underline">
            Manage Saved Addresses →
          </span>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vastrika-ivory-300 shadow-luxury space-y-6">
        <div className="flex items-center justify-between border-b border-vastrika-ivory-200 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Recent Orders</h3>
            <p className="text-xs text-stone-500">Track and view your latest purchases.</p>
          </div>
          <Link
            href="/account/orders"
            className="text-xs font-bold text-vastrika-maroon-800 hover:underline flex items-center gap-1"
          >
            <span>All Orders</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-stone-500">
            <Package className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-semibold">You have not placed any orders yet.</p>
            <Link
              href="/shop"
              className="inline-block mt-3 bg-vastrika-maroon-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-vastrika-ivory-200">
            {orders.map((order) => (
              <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-bold text-stone-900">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        order.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Placed on {formatDate(order.createdAt)} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="font-serif text-base font-bold text-vastrika-maroon-950">
                    {formatPrice(order.total)}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="py-2 px-4 rounded-xl bg-vastrika-ivory-100 hover:bg-vastrika-ivory-200 border border-vastrika-ivory-300 text-xs font-bold text-stone-800 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
