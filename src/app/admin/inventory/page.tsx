import React from 'react';
import prisma from '@/lib/prisma';
import AdminInventoryManager from './AdminInventoryManager';

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
  const variants = await prisma.productVariant.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { stock: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Inventory & Stock Tracking</h1>
        <p className="text-xs text-stone-500 mt-1">
          Monitor size/color variant stock thresholds, prevent overselling and perform real-time adjustments.
        </p>
      </div>

      <AdminInventoryManager initialVariants={variants} />
    </div>
  );
}
