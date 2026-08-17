import React from 'react';
import prisma from '@/lib/prisma';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductItem } from '@/types';
import { Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim() || '';

  let products: ProductItem[] = [];
  if (query) {
    const raw = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { fabric: { contains: query } },
          { occasion: { contains: query } },
          { pattern: { contains: query } },
          { sku: { contains: query } },
          { category: { name: { contains: query } } },
        ],
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
        category: true,
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    products = raw.map((prod) => ({
      ...prod,
      reviews: prod.reviews as any,
      averageRating:
        prod.reviews.length > 0
          ? prod.reviews.reduce((s, r) => s + r.rating, 0) / prod.reviews.length
          : 4.9,
      reviewCount: prod.reviews.length || 15,
    })) as unknown as ProductItem[];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-vastrika-ivory-300 shadow-luxury">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-vastrika-gold-700">
            <Search className="w-3.5 h-3.5" />
            <span>Search Results</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-vastrika-maroon-950">
            {query ? (
              <span>
                Search results for &ldquo;<span className="text-vastrika-gold-700">{query}</span>&rdquo;
              </span>
            ) : (
              'Search Our Heirloom Collections'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {products.length} {products.length === 1 ? 'creation' : 'creations'} discovered across sarees, lehengas, kurtis, and menswear.
          </p>
        </div>
      </div>

      {/* Grid or Empty */}
      {products.length > 0 ? (
        <ProductGrid products={products} columns="4" />
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-vastrika-ivory-300 shadow-luxury space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-vastrika-maroon-50 text-vastrika-maroon-800 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            No matching creations found
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            We couldn&apos;t find any pieces matching &ldquo;{query}&rdquo;. Try browsing our most popular handcrafted categories below.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Link
              href="/shop/sarees"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-vastrika-ivory-100 text-vastrika-maroon-900 border border-vastrika-ivory-300 hover:bg-vastrika-ivory-200"
            >
              Pure Silk Sarees
            </Link>
            <Link
              href="/shop/lehengas"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-vastrika-ivory-100 text-vastrika-maroon-900 border border-vastrika-ivory-300 hover:bg-vastrika-ivory-200"
            >
              Bridal Lehengas
            </Link>
            <Link
              href="/shop/kurtis"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-vastrika-ivory-100 text-vastrika-maroon-900 border border-vastrika-ivory-300 hover:bg-vastrika-ivory-200"
            >
              Chikankari Kurtis
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
