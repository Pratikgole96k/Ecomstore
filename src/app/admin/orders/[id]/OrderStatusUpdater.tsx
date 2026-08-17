'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Send } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function OrderStatusUpdater({ order }: { order: any }) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('Mumbai National Hub, India');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const statuses = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
    'RETURNED',
    'REFUNDED',
  ];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus,
          paymentStatus,
          message: message.trim() || undefined,
          location: location.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Order status successfully updated to ${orderStatus}!`);
        setMessage('');
        router.refresh();
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (e) {
      alert('Error updating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4 text-xs">
      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-stone-700 font-semibold mb-1">Order Status</label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-stone-700 font-semibold mb-1">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800"
          >
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-stone-700 font-semibold mb-1">
          Tracking Milestone Message (Dispatched to Customer)
        </label>
        <input
          type="text"
          placeholder="Leave blank to use default stage message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800"
        />
      </div>

      <div>
        <label className="block text-stone-700 font-semibold mb-1">Hub Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Updating Status...</span>
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>Save & Dispatch Milestone</span>
          </>
        )}
      </button>
    </form>
  );
}
