import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ChevronRight,
  Clock,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
      tracking: { orderBy: { timestamp: 'desc' } },
    },
  });

  if (!order) {
    notFound();
  }

  // Define Standard Timeline Stages
  const stages = [
    { status: 'CONFIRMED', label: 'Order Confirmed', desc: 'Order verified by boutique' },
    { status: 'PROCESSING', label: 'Crafting & QC', desc: 'Quality inspection & packaging' },
    { status: 'SHIPPED', label: 'Shipped', desc: 'Handed over to priority express courier' },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'With local courier executive' },
    { status: 'DELIVERED', label: 'Delivered', desc: 'Delivered to your doorstep' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.status === order.orderStatus);
  const activeIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500">
        <Link href="/" className="hover:text-vastrika-maroon-800">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/account/orders" className="hover:text-vastrika-maroon-800">
          Orders
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-stone-900 font-semibold">#{order.orderNumber}</span>
      </nav>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-vastrika-ivory-300 shadow-luxury">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-vastrika-maroon-950">
              Order #{order.orderNumber}
            </h1>
            <span
              className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
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
          <p className="text-xs text-stone-500 mt-1">
            Placed on {formatDate(order.createdAt)} • Payment Method: {order.paymentMethod} ({order.paymentStatus})
          </p>
        </div>

        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 border border-vastrika-ivory-300 rounded-xl px-4 py-2 bg-vastrika-ivory-50 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      {/* Order Tracking Visual Progress Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vastrika-ivory-300 shadow-luxury space-y-6">
        <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-vastrika-ivory-200 pb-3">
          Live Shipment Journey
        </h3>

        {/* Stepper Dots */}
        <div className="relative py-4">
          <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-vastrika-ivory-300 -translate-y-1/2 z-0" />
          <div
            className="hidden sm:block absolute top-1/2 left-0 h-1 bg-vastrika-maroon-900 -translate-y-1/2 z-0 transition-all duration-500"
            style={{
              width: `${(activeIndex / (stages.length - 1)) * 100}%`,
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
            {stages.map((stage, idx) => {
              const isPast = idx <= activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div key={stage.status} className="flex sm:flex-col items-center gap-3 sm:text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition ${
                      isPast
                        ? 'bg-vastrika-maroon-900 text-white shadow-md'
                        : 'bg-vastrika-ivory-200 text-stone-400'
                    } ${isCurrent ? 'ring-4 ring-vastrika-gold-400' : ''}`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5 text-vastrika-gold-400" /> : idx + 1}
                  </div>
                  <div>
                    <h5
                      className={`text-xs font-bold ${
                        isPast ? 'text-stone-900' : 'text-stone-400'
                      }`}
                    >
                      {stage.label}
                    </h5>
                    <p className="text-[10px] text-stone-500 hidden sm:block mt-0.5">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tracking Activity History */}
        {order.tracking && order.tracking.length > 0 && (
          <div className="pt-4 border-t border-vastrika-ivory-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Activity History Log
            </h4>
            <div className="space-y-3">
              {order.tracking.map((evt) => (
                <div key={evt.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-vastrika-maroon-800 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-stone-800 font-semibold">{evt.message}</p>
                    <p className="text-[11px] text-stone-400">
                      {evt.location && `${evt.location} • `}
                      {formatDate(evt.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ordered Items & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-vastrika-ivory-300 shadow-luxury space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-vastrika-ivory-200 pb-3">
            Items in This Order ({order.items.length})
          </h3>

          <div className="divide-y divide-vastrika-ivory-200">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                <div className="w-16 h-20 bg-stone-100 rounded-xl overflow-hidden shrink-0 border border-vastrika-ivory-300">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-serif text-sm font-bold text-stone-900">{item.productName}</h4>
                  {item.variantInfo && (
                    <p className="text-xs text-stone-500 mt-0.5">{item.variantInfo}</p>
                  )}
                  <p className="text-xs text-stone-400">Quantity: {item.quantity}</p>
                </div>

                <div className="font-serif text-sm font-bold text-vastrika-maroon-950">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address & Bill */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl p-6 border border-vastrika-ivory-300 shadow-luxury space-y-3">
            <h4 className="font-serif text-base font-bold text-stone-900 border-b border-vastrika-ivory-200 pb-2">
              Delivery Address
            </h4>
            <div className="text-xs text-stone-600 space-y-1">
              <strong className="text-stone-900 block">{order.shippingName}</strong>
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
              </p>
              <p className="text-stone-400 pt-1">Phone: {order.shippingPhone}</p>
            </div>
          </div>

          {/* Receipt Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-vastrika-ivory-300 shadow-luxury space-y-3">
            <h4 className="font-serif text-base font-bold text-stone-900 border-b border-vastrika-ivory-200 pb-2">
              Price Details
            </h4>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon ({order.couponCode})</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="pt-3 border-t border-vastrika-ivory-200 flex justify-between items-baseline text-stone-900">
                <span className="font-bold text-sm">Total Paid</span>
                <span className="font-serif text-xl font-bold text-vastrika-maroon-950">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
