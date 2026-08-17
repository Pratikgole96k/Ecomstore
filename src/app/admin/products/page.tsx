import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Plus, Search, Edit, Trash2, Eye, Star } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import ProductDeleteButton from './ProductDeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      variants: true,
      category: true,
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Product Management</h1>
          <p className="text-xs text-stone-500 mt-1">
            Total {products.length} handcrafted products active in the catalog.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price / MRP</th>
                <th className="py-4 px-6">Variants & Stock</th>
                <th className="py-4 px-6">Badges</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => {
                const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                          {p.images[0] && (
                            <img
                              src={p.images[0].imageUrl}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif text-sm font-bold text-stone-900 line-clamp-1">
                            {p.name}
                          </p>
                          <span className="text-[10px] font-mono text-stone-400">
                            SKU: {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-stone-700">
                      {p.category.name}
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-serif text-sm font-bold text-vastrika-maroon-950 block">
                        {formatPrice(p.price)}
                      </span>
                      {p.mrp > p.price && (
                        <span className="text-[10px] text-stone-400 line-through block">
                          MRP: {formatPrice(p.mrp)}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] inline-block ${
                          totalStock <= 5
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {totalStock} in stock ({p.variants.length} sizes)
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {p.isBestSeller && (
                          <span className="text-[9px] bg-vastrika-maroon-100 text-vastrika-maroon-900 font-bold px-1.5 py-0.5 rounded">
                            BESTSELLER
                          </span>
                        )}
                        {p.isNew && (
                          <span className="text-[9px] bg-stone-900 text-white font-bold px-1.5 py-0.5 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone-400 hover:text-stone-800"
                          title="View on store"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-stone-400 hover:text-vastrika-maroon-800"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <ProductDeleteButton productId={p.id} productName={p.name} />
                      </div>
                    </td>
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
