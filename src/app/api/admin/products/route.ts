import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      shortDescription,
      price,
      mrp,
      discount,
      sku,
      categoryId,
      brand = 'VASTRIKA',
      fabric,
      occasion,
      pattern,
      gender = 'WOMEN',
      isFeatured = false,
      isNew = false,
      isBestSeller = false,
      images = [], // array of imageUrl strings
      variants = [], // array of { size, color, sku, price, stock }
    } = body;

    if (!name || !price || !categoryId || !sku) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const slug = slugify(name) + '-' + Math.floor(100 + Math.random() * 900);

    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name,
          slug,
          description: description || name,
          shortDescription: shortDescription || null,
          price: parseFloat(price),
          mrp: parseFloat(mrp || price),
          discount: discount ? parseFloat(discount) : 0,
          sku,
          categoryId,
          brand,
          fabric: fabric || null,
          occasion: occasion || null,
          pattern: pattern || null,
          gender,
          isFeatured: !!isFeatured,
          isNew: !!isNew,
          isBestSeller: !!isBestSeller,
          isActive: true,
        },
      });

      // Insert images
      for (let i = 0; i < images.length; i++) {
        await tx.productImage.create({
          data: {
            productId: newProduct.id,
            imageUrl: images[i],
            sortOrder: i,
          },
        });
      }

      // Insert variants & inventory
      for (const v of variants) {
        const variant = await tx.productVariant.create({
          data: {
            productId: newProduct.id,
            size: v.size || 'Free Size',
            color: v.color || 'Standard',
            sku: v.sku || `${sku}-${v.size || 'STD'}`,
            price: parseFloat(v.price || price),
            stock: parseInt(v.stock || '10'),
            isActive: true,
          },
        });

        await tx.inventory.create({
          data: {
            productId: newProduct.id,
            variantId: variant.id,
            quantity: parseInt(v.stock || '10'),
            lowStockThreshold: 5,
          },
        });
      }

      return newProduct;
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Admin create product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
