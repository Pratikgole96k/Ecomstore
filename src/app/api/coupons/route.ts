import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.trim().toUpperCase();
    const amount = parseFloat(searchParams.get('amount') || '0');

    if (!code) {
      return NextResponse.json({ message: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ message: 'Invalid or inactive coupon code' }, { status: 404 });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ message: 'This coupon code has expired' }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ message: 'Coupon usage limit has been reached' }, { status: 400 });
    }

    if (amount < coupon.minimumOrder) {
      return NextResponse.json(
        {
          message: `This coupon requires a minimum cart value of ₹${coupon.minimumOrder}`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minimumOrder: coupon.minimumOrder,
        maximumDiscount: coupon.maximumDiscount,
      },
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ message: 'Error checking coupon' }, { status: 500 });
  }
}
