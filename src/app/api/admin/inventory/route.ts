import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: { select: { id: true, name: true, sku: true, category: { select: { name: true } } } },
      },
      orderBy: { stock: 'asc' },
    });

    return NextResponse.json({ variants });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { variantId, stock } = await req.json();

    if (!variantId || stock === undefined) {
      return NextResponse.json({ error: 'Variant ID and stock are required' }, { status: 400 });
    }

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: parseInt(stock) },
    });

    return NextResponse.json({ success: true, variant: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
