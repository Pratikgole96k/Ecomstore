import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        orders: { select: { id: true, total: true, orderStatus: true, createdAt: true } },
        addresses: { select: { city: true, state: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = users.map((u) => {
      const totalSpent = u.orders.reduce((sum, ord) => sum + ord.total, 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        avatar: u.avatar,
        ordersCount: u.orders.length,
        totalSpent,
        location: u.addresses[0] ? `${u.addresses[0].city}, ${u.addresses[0].state}` : 'India',
        createdAt: u.createdAt,
      };
    });

    return NextResponse.json({ customers: formatted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
