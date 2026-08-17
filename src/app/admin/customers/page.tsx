import React from 'react';
import prisma from '@/lib/prisma';
import { Users, Mail, Phone, ShoppingBag, IndianRupee } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    include: {
      orders: { select: { total: true } },
      addresses: { select: { city: true, state: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Registered Patrons & Customers</h1>
        <p className="text-xs text-stone-500 mt-1">
          Total {users.length} registered accounts across India.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Email & Phone</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Orders</th>
                <th className="py-4 px-6">Total Spent</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u) => {
                const totalSpent = u.orders.reduce((sum, o) => sum + o.total, 0);
                return (
                  <tr key={u.id} className="hover:bg-stone-50/60">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-vastrika-maroon-100 text-vastrika-maroon-900 font-bold text-xs flex items-center justify-center">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-stone-900">{u.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-stone-600">
                      <p>{u.email}</p>
                      {u.phone && <p className="text-[11px] text-stone-400">{u.phone}</p>}
                    </td>

                    <td className="py-4 px-6 text-stone-600">
                      {u.addresses[0] ? `${u.addresses[0].city}, ${u.addresses[0].state}` : 'India'}
                    </td>

                    <td className="py-4 px-6 font-bold text-stone-900">{u.orders.length}</td>

                    <td className="py-4 px-6 font-serif text-sm font-bold text-vastrika-maroon-950">
                      {formatPrice(totalSpent)}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'ADMIN'
                            ? 'bg-vastrika-gold-100 text-vastrika-gold-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-stone-400">{formatDate(u.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
