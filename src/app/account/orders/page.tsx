import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Package, ArrowRight, ChevronRight, Calendar } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AccountOrdersPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?redirect=/account/orders');
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    include: {
      items: true,
      tracking: { orderBy: { timestamp: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500">
        <Link href="/" className="hover:text-vastrika-maroon-800">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/account" className="hover:text-vastrika-maroon-800">
          My Account
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-stone-900 font-semibold">Orders & Tracking</span>
      </nav>

      <div>
        <h1 className="font-serif text-3xl font-bold text-vastrika-maroon-950">
          My Orders & Shipments ({orders.length})
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review your order history, delivery milestones, and invoices.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-vastrika-ivory-300 shadow-luxury space-y-4 max-w-md mx-auto">
          <Package className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-stone-900">No Orders Found</h3>
          <p className="text-xs text-stone-500">
            You have not placed any orders yet. Discover our handcrafted ethnic attire.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-vastrika-maroon-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-vastrika-ivory-300 shadow-luxury flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-serif text-lg font-bold text-vastrika-maroon-950">
                    Order #{order.orderNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      order.orderStatus === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.orderStatus === 'SHIPPED'
                        ? 'bg-blue-100 text-blue-800'
                        : order.orderStatus === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-stone-400">
                    • {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* Items thumbnails preview */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="w-12 h-14 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-vastrika-ivory-300"
                      title={item.productName}
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  <span className="text-xs text-stone-600 font-medium pl-2">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {order.tracking?.[0] && (
                  <p className="text-xs text-stone-500 italic">
                    Latest update: &ldquo;{order.tracking[0].message}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-vastrika-ivory-200">
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                    Total Amount
                  </span>
                  <span className="font-serif text-lg font-bold text-vastrika-maroon-950">
                    {formatPrice(order.total)}
                  </span>
                </div>

                <Link
                  href={`/account/orders/${order.id}`}
                  className="bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition shadow flex items-center gap-1.5"
                >
                  <span>Track Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
