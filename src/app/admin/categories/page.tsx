import React from 'react';
import prisma from '@/lib/prisma';
import AdminCategoryManager from './AdminCategoryManager';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Category Management</h1>
        <p className="text-xs text-stone-500 mt-1">
          Organize Indian fashion categories, subcategories, banners and ordering.
        </p>
      </div>

      <AdminCategoryManager initialCategories={categories} />
    </div>
  );
}
