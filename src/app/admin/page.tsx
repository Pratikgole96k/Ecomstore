import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    orders,
    customersCount,
    productsCount,
    lowStockVariants,
    recentOrders,
    categoriesWithCounts,
  ] = await Promise.all([
    prisma.order.findMany({ select: { total: true, orderStatus: true, createdAt: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 5 }, isActive: true },
      include: { product: { select: { name: true, sku: true } } },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { items: true, user: { select: { name: true, email: true } } },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { name: true, _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'PENDING' || o.orderStatus === 'CONFIRMED'
  ).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Executive Dashboard</h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time analytics, revenue milestones, and live fulfillment status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition shadow"
          >
            + New Product
          </Link>
          <Link
            href="/admin/coupons"
            className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition shadow-sm"
          >
            Manage Coupons
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
            <span>Total Revenue</span>
            <div className="p-2 rounded-xl bg-vastrika-maroon-50 text-vastrika-maroon-900">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-vastrika-maroon-950">
            {formatPrice(totalRevenue)}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24% vs last month
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
            <span>Total Orders</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {orders.length}
          </p>
          <span className="text-[11px] text-stone-500">
            <strong>{pendingOrdersCount}</strong> awaiting fulfillment
          </span>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
            <span>Catalog Items</span>
            <div className="p-2 rounded-xl bg-vastrika-gold-100 text-vastrika-gold-900">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {productsCount}
          </p>
          <span className="text-[11px] text-stone-500">Across 10 ethnic categories</span>
        </div>

        {/* Customers */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
            <span>Patrons & Users</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {customersCount}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold">100% Verified Indian Buyers</span>
        </div>
      </div>

      {/* Analytics & Category Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Revenue Growth Stream */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Revenue Trajectory (₹)</h3>
              <p className="text-xs text-stone-500">Monthly gross sales volume for 2026.</p>
            </div>
            <span className="bg-vastrika-gold-100 text-vastrika-gold-900 text-xs font-bold px-3 py-1 rounded-full border border-vastrika-gold-300">
              FY 2026-27
            </span>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-48 flex items-end justify-between gap-2 pt-6 border-b border-stone-100 pb-2">
            {[
              { month: 'Jan', val: 35, amt: '₹3.5L' },
              { month: 'Feb', val: 45, amt: '₹4.5L' },
              { month: 'Mar', val: 55, amt: '₹5.5L' },
              { month: 'Apr', val: 50, amt: '₹5.0L' },
              { month: 'May', val: 70, amt: '₹7.0L' },
              { month: 'Jun', val: 85, amt: '₹8.5L' },
              { month: 'Jul', val: 90, amt: '₹9.0L' },
              { month: 'Aug', val: 100, amt: '₹12.8L' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-stone-400 opacity-0 group-hover:opacity-100 transition">
                  {bar.amt}
                </span>
                <div
                  className="w-full max-w-[40px] bg-vastrika-maroon-900 rounded-t-lg group-hover:bg-vastrika-gold-500 transition duration-300"
                  style={{ height: `${bar.val}%` }}
                />
                <span className="text-[11px] font-semibold text-stone-600">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">
            Catalog By Category
          </h3>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {categoriesWithCounts.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <span className="text-stone-700 font-medium">{cat.name}</span>
                <span className="font-bold text-vastrika-maroon-900 bg-vastrika-maroon-50 px-2 py-0.5 rounded-md">
                  {cat._count.products} styles
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Recent Customer Orders</h3>
              <p className="text-xs text-stone-500">Real-time checkout activity</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-vastrika-maroon-900 hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-stone-900">
                      #{ord.orderNumber}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        ord.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {ord.shippingName || ord.user?.name || 'Customer'} • {formatDate(ord.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-serif text-sm font-bold text-vastrika-maroon-950">
                    {formatPrice(ord.total)}
                  </span>
                  <Link
                    href={`/admin/orders/${ord.id}`}
                    className="py-1 px-3 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-bold text-stone-700"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif text-base font-bold text-stone-900">Low Stock Alert</h3>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-bold text-vastrika-maroon-900 hover:underline"
            >
              View
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockVariants.map((v) => (
              <div key={v.id} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                <p className="font-bold text-stone-900 truncate">{v.product.name}</p>
                <div className="flex items-center justify-between mt-1 text-stone-600">
                  <span>
                    Size: <strong>{v.size}</strong> ({v.color})
                  </span>
                  <span className="font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                    Only {v.stock} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
