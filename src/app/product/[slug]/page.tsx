import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ImageGallery from '@/components/product/ImageGallery';
import ProductActionSection from './ProductActionSection';
import ProductTabs from './ProductTabs';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductItem } from '@/types';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findFirst({
    where: { slug: params.slug, isActive: true },
  });

  if (!product) return { title: 'Product Not Found | VASTRIKA' };

  return {
    title: `${product.name} | VASTRIKA Couture`,
    description: product.shortDescription || product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findFirst({
    where: { slug: params.slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true } },
      category: true,
      reviews: {
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Related products from the same category
  const relatedRaw = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true } },
      category: true,
      reviews: { select: { rating: true } },
    },
    take: 4,
  });

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 4.9;

  const enrichedProduct: ProductItem = {
    ...product,
    averageRating,
    reviewCount: product.reviews.length || 18,
  };

  const relatedProducts: ProductItem[] = relatedRaw.map((p) => ({
    ...p,
    reviews: p.reviews as any,
    averageRating:
      p.reviews.length > 0
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        : 4.9,
    reviewCount: p.reviews.length || 12,
  })) as unknown as ProductItem[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500">
        <Link href="/" className="hover:text-vastrika-maroon-800">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link href="/shop" className="hover:text-vastrika-maroon-800">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-vastrika-maroon-800"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
        {/* Left: Gallery & Zoom */}
        <div>
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Actions, Variants, Pincode & Purchasing */}
        <div>
          <ProductActionSection product={enrichedProduct} />
        </div>
      </div>

      {/* Product Details, Fabric Care & Verified Reviews Tabs */}
      <div className="pt-8 border-t border-vastrika-ivory-300">
        <ProductTabs product={enrichedProduct} />
      </div>

      {/* Related Heirloom Styles */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-vastrika-ivory-300 space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-vastrika-gold-700">
              Curated Recommendations
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-vastrika-maroon-950 mt-1">
              You May Also Adore
            </h3>
          </div>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
