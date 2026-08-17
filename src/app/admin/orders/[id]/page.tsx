import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ArrowLeft, MapPin, CreditCard, Calendar, User, Package } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import OrderStatusUpdater from './OrderStatusUpdater';

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
      tracking: { orderBy: { timestamp: 'desc' } },
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="p-2 bg-white rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Fulfill Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-stone-500">
            Placed on {formatDate(order.createdAt)} • Total {formatPrice(order.total)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Status Updater & Tracking History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Update Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">
              Update Order & Payment Lifecycle
            </h3>
            <OrderStatusUpdater order={order} />
          </div>

          {/* Ordered Items */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Items to Dispatch ({order.items.length})
            </h3>
            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                  <div className="w-14 h-18 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-serif font-bold text-stone-900 text-sm">{item.productName}</p>
                    {item.variantInfo && <p className="text-stone-500">{item.variantInfo}</p>}
                    <p className="text-stone-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-serif font-bold text-sm text-vastrika-maroon-950">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Customer & Shipping Details */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h4 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Shipping Destination
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

          {/* Payment & Receipt Details */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h4 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Payment Summary
            </h4>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-bold text-stone-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-bold text-emerald-700">{order.paymentStatus}</span>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between font-mono text-[10px]">
                  <span>Payment ID</span>
                  <span>{order.razorpayPaymentId}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-100 flex justify-between font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="font-serif text-base text-vastrika-maroon-950">
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
