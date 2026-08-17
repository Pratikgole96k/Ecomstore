import React from 'react';
import prisma from '@/lib/prisma';
import AdminCouponManager from './AdminCouponManager';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Coupons & Discount Promotions</h1>
        <p className="text-xs text-stone-500 mt-1">
          Create percentage or flat discounts with minimum spend constraints and usage limits.
        </p>
      </div>

      <AdminCouponManager initialCoupons={coupons} />
    </div>
  );
}
