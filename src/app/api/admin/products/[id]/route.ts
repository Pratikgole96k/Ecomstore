import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      shortDescription,
      price,
      mrp,
      discount,
      categoryId,
      brand,
      fabric,
      occasion,
      pattern,
      gender,
      isFeatured,
      isNew,
      isBestSeller,
      isActive,
    } = body;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        shortDescription,
        price: price ? parseFloat(price) : undefined,
        mrp: mrp ? parseFloat(mrp) : undefined,
        discount: discount !== undefined ? parseFloat(discount) : undefined,
        categoryId,
        brand,
        fabric,
        occasion,
        pattern,
        gender,
        isFeatured: isFeatured !== undefined ? !!isFeatured : undefined,
        isNew: isNew !== undefined ? !!isNew : undefined,
        isBestSeller: isBestSeller !== undefined ? !!isBestSeller : undefined,
        isActive: isActive !== undefined ? !!isActive : undefined,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
