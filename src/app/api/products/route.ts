import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const gender = searchParams.get('gender') || '';
    const fabric = searchParams.get('fabric')?.split(',').filter(Boolean) || [];
    const occasion = searchParams.get('occasion')?.split(',').filter(Boolean) || [];
    const color = searchParams.get('color')?.split(',').filter(Boolean) || [];
    const size = searchParams.get('size')?.split(',').filter(Boolean) || [];
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const minDiscount = searchParams.get('minDiscount') ? parseFloat(searchParams.get('minDiscount')!) : undefined;
    const filter = searchParams.get('filter') || ''; // 'new', 'bestseller', 'featured', 'sale'
    const sort = searchParams.get('sort') || 'featured';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // Text Search
    if (search.trim()) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { shortDescription: { contains: search } },
        { fabric: { contains: search } },
        { occasion: { contains: search } },
        { pattern: { contains: search } },
        { sku: { contains: search } },
        { category: { name: { contains: search } } },
      ];
    }

    // Category Filter
    if (category) {
      where.category = {
        slug: category,
      };
    }

    // Gender
    if (gender) {
      where.gender = gender.toUpperCase();
    }

    // Fabric
    if (fabric.length > 0) {
      where.fabric = {
        in: fabric,
      };
    }

    // Occasion
    if (occasion.length > 0) {
      where.occasion = {
        in: occasion,
      };
    }

    // Filter Badges
    if (filter === 'new') where.isNew = true;
    if (filter === 'bestseller') where.isBestSeller = true;
    if (filter === 'featured') where.isFeatured = true;
    if (filter === 'sale') where.discount = { gt: 0 };

    // Price Range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Discount
    if (minDiscount !== undefined) {
      where.discount = { gte: minDiscount };
    }

    // Variants (color / size)
    if (color.length > 0 || size.length > 0) {
      where.variants = {
        some: {
          isActive: true,
          ...(color.length > 0 ? { color: { in: color } } : {}),
          ...(size.length > 0 ? { size: { in: size } } : {}),
        },
      };
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    if (sort === 'discount') orderBy = { discount: 'desc' };
    if (sort === 'featured') orderBy = { isFeatured: 'desc' };

    const [products, total] = await Promise.all([
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
    ]);

    // Calculate ratings average
    const enrichedProducts = products.map((prod) => {
      const avg =
        prod.reviews.length > 0
          ? prod.reviews.reduce((s, r) => s + r.rating, 0) / prod.reviews.length
          : 4.9;
      return {
        ...prod,
        averageRating: avg,
        reviewCount: prod.reviews.length || 12,
      };
    });

    return NextResponse.json({
      products: enrichedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
