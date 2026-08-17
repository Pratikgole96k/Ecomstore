import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import ConfettiBurst from './ConfettiBurst';

export const dynamic = 'force-dynamic';

export default async function OrderSuccessPage({
  params,
}: {
  params: { id: string };
}) {
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Confetti Trigger Client Component */}
      <ConfettiBurst />

      {/* Success Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-vastrika-ivory-300 shadow-luxury text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vastrika-gold-100 text-vastrika-gold-800 text-xs font-bold uppercase tracking-wider border border-vastrika-gold-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Order Confirmed & Secured</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-vastrika-maroon-950">
          Thank You for Your Order!
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
          Your order <strong>#{order.orderNumber}</strong> has been received by our master atelier. We are preparing your handcrafted Indian drape with bespoke luxury packaging.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href={`/account/orders/${order.id}`}
            className="bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition shadow-md flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </Link>
          <Link
            href="/shop"
            className="bg-vastrika-ivory-100 hover:bg-vastrika-ivory-200 text-stone-800 border border-vastrika-ivory-300 font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Summary & Delivery Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping & Payment Meta */}
        <div className="bg-white rounded-3xl p-6 border border-vastrika-ivory-300 shadow-luxury space-y-4">
          <h3 className="font-serif text-lg font-bold text-vastrika-maroon-900 border-b border-vastrika-ivory-200 pb-2">
            Delivery & Payment Details
          </h3>

          <div className="space-y-3 text-xs text-stone-600">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-vastrika-gold-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block">{order.shippingName}</strong>
                <p>{order.shippingAddress}</p>
                <p>
                  {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
                </p>
                <p className="text-stone-400 mt-0.5">Phone: {order.shippingPhone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2 border-t border-vastrika-ivory-200">
              <CreditCard className="w-4 h-4 text-vastrika-gold-600" />
              <div>
                <span className="text-stone-500">Payment: </span>
                <strong className="text-stone-900">
                  {order.paymentMethod} ({order.paymentStatus})
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-vastrika-gold-600" />
              <div>
                <span className="text-stone-500">Ordered On: </span>
                <strong className="text-stone-900">{formatDate(order.createdAt)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-vastrika-ivory-300 shadow-luxury space-y-4">
          <h3 className="font-serif text-lg font-bold text-vastrika-maroon-900 border-b border-vastrika-ivory-200 pb-2">
            Order Receipt Summary
          </h3>

          <div className="space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-stone-900">{formatPrice(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({order.couponCode || 'Promo'})</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Express Shipping</span>
              <span className="font-semibold text-stone-900">
                {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-semibold text-stone-900">{formatPrice(order.tax)}</span>
            </div>

            <div className="pt-3 border-t border-vastrika-ivory-200 flex justify-between items-baseline text-stone-900">
              <span className="font-bold text-sm">Total Paid</span>
              <span className="font-serif text-2xl font-bold text-vastrika-maroon-950">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="bg-white rounded-3xl p-6 border border-vastrika-ivory-300 shadow-luxury space-y-4">
        <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-vastrika-ivory-200 pb-2">
          Ordered Creations ({order.items.length})
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
    </div>
  );
}
