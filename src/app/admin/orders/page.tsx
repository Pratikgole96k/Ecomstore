import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Package, Eye, ArrowRight } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Order Management & Fulfillment</h1>
        <p className="text-xs text-stone-500 mt-1">
          Track customer purchases, update order stages, and dispatch tracking milestones.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-4 px-6 font-serif font-bold text-stone-900">
                    #{ord.orderNumber}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-stone-800">
                      {ord.shippingName || ord.user?.name || 'Customer'}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      {ord.shippingCity ? `${ord.shippingCity}, ${ord.shippingState}` : 'India'}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-stone-500">{formatDate(ord.createdAt)}</td>
                  <td className="py-4 px-6 font-serif text-sm font-bold text-vastrika-maroon-950">
                    {formatPrice(ord.total)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 uppercase">
                      {ord.paymentMethod} ({ord.paymentStatus})
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        ord.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.orderStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="py-1.5 px-3 bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1 transition shadow-sm"
                    >
                      <span>Update</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
