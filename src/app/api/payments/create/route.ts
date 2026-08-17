import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const { amount, currency = 'INR' } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    const receipt = `rcpt_${generateOrderNumber()}`;
    const razorpayOrder = await createRazorpayOrder({
      amount: parseFloat(amount),
      receipt,
      notes: { brand: 'VASTRIKA' },
    });

    return NextResponse.json({
      success: true,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      order: razorpayOrder,
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
