import React, { Suspense } from 'react';
import prisma from '@/lib/prisma';
import ProductGrid from '@/components/product/ProductGrid';
import ShopFilterSidebar from './ShopFilterSidebar';
import SortSelector from './SortSelector';
import { ProductItem } from '@/types';
import { Sparkles } from 'lucide-react';

interface ShopPageProps {
  searchParams: {
    category?: string;
    gender?: string;
    fabric?: string;
    occasion?: string;
    color?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    filter?: string;
    page?: string;
    q?: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const {
    category,
    gender,
    fabric,
    occasion,
    color,
    size,
    minPrice,
    maxPrice,
    sort = 'featured',
    filter,
    page = '1',
    q,
  } = searchParams;

  const fabricsArray = fabric ? fabric.split(',') : [];
  const occasionsArray = occasion ? occasion.split(',') : [];
  const colorsArray = color ? color.split(',') : [];
  const sizesArray = size ? size.split(',') : [];
  const currentPage = parseInt(page) || 1;
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  // Build Prisma Where query
  const where: any = { isActive: true };

  if (category) {
    where.category = { slug: category };
  }

  if (gender) {
    where.gender = gender.toUpperCase();
  }

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { fabric: { contains: q } },
      { occasion: { contains: q } },
    ];
  }

  if (filter === 'new') where.isNew = true;
  if (filter === 'bestseller') where.isBestSeller = true;
  if (filter === 'sale') where.discount = { gt: 0 };

  if (fabricsArray.length > 0) {
    where.fabric = { in: fabricsArray };
  }

  if (occasionsArray.length > 0) {
    where.occasion = { in: occasionsArray };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  if (colorsArray.length > 0 || sizesArray.length > 0) {
    where.variants = {
      some: {
        isActive: true,
        ...(colorsArray.length > 0 ? { color: { in: colorsArray } } : {}),
        ...(sizesArray.length > 0 ? { size: { in: sizesArray } } : {}),
      },
    };
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { price: 'asc' };
  if (sort === 'price-desc') orderBy = { price: 'desc' };
  if (sort === 'newest') orderBy = { createdAt: 'desc' };
  if (sort === 'discount') orderBy = { discount: 'desc' };
  if (sort === 'featured') orderBy = { isFeatured: 'desc' };

  const [productsRaw, totalCount, allCategories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
        category: true,
        reviews: { select: { rating: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  const products: ProductItem[] = productsRaw.map((prod) => ({
    ...prod,
    reviews: prod.reviews as any,
    averageRating:
      prod.reviews.length > 0
        ? prod.reviews.reduce((s, r) => s + r.rating, 0) / prod.reviews.length
        : 4.9,
    reviewCount: prod.reviews.length || 14,
  })) as unknown as ProductItem[];

  const activeCategory = allCategories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Category Hero / Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-vastrika-ivory-300 shadow-luxury mb-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-vastrika-gold-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handloom & Heritage Catalog</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-vastrika-maroon-950">
            {activeCategory ? activeCategory.name : 'All Collections'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {activeCategory?.description ||
              'Explore handcrafted pure silk sarees, royal bridal lehengas, authentic Chikankari kurtis and festive men’s couture.'}
          </p>
        </div>
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <ShopFilterSidebar
            categories={allCategories}
            activeCategory={category}
            selectedFabrics={fabricsArray}
            selectedOccasions={occasionsArray}
            selectedColors={colorsArray}
            selectedSizes={sizesArray}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sort={sort}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-vastrika-ivory-300 text-xs text-stone-600">
            <div>
              Showing <strong className="text-stone-900">{products.length}</strong> of{' '}
              <strong className="text-stone-900">{totalCount}</strong> exquisite styles
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline font-medium">Sort by:</span>
              <SortSelector currentSort={sort} />
            </div>
          </div>

          <ProductGrid products={products} columns="3" />

          {/* Pagination */}
          {totalCount > limit && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {Array.from({ length: Math.ceil(totalCount / limit) }).map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <a
                    key={pageNum}
                    href={`?page=${pageNum}${category ? `&category=${category}` : ''}${
                      sort ? `&sort=${sort}` : ''
                    }`}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border transition ${
                      isCurrent
                        ? 'bg-vastrika-maroon-900 text-white border-vastrika-maroon-900 shadow'
                        : 'bg-white text-stone-700 border-vastrika-ivory-300 hover:bg-vastrika-ivory-100'
                    }`}
                  >
                    {pageNum}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
