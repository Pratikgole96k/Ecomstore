import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { productId, rating, title, comment } = body;

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    // Default to session user or fallback to demo customer
    let userId = session?.id;
    if (!userId) {
      const demoUser = await prisma.user.findFirst({
        where: { role: 'CUSTOMER' },
      });
      userId = demoUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Please log in to write a review' }, { status: 401 });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: Math.min(Math.max(1, rating), 5),
        title,
        comment,
        isVerified: true,
        isActive: true,
      },
      include: {
        user: { select: { name: true, avatar: true } },
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Review Error:', error);
    return NextResponse.json({ error: 'Failed to post review' }, { status: 500 });
  }
}
