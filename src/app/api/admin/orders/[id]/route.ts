import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        user: { select: { name: true, email: true, phone: true } },
        tracking: { orderBy: { timestamp: 'desc' } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { orderStatus, paymentStatus, message, location } = body;

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.update({
        where: { id: params.id },
        data: {
          orderStatus: orderStatus || undefined,
          paymentStatus: paymentStatus || undefined,
        },
      });

      // Automatically create tracking milestone if status was changed
      if (orderStatus && orderStatus !== order.orderStatus) {
        const defaultMessages: Record<string, string> = {
          PENDING: 'Order is under verification.',
          CONFIRMED: 'Order verified and confirmed by boutique studio.',
          PROCESSING: 'Artisanal tailoring, quality inspection and luxury packaging in progress.',
          PACKED: 'Order packed in royal keepsake box with heritage seal.',
          SHIPPED: 'Package handed over to express courier partner.',
          OUT_FOR_DELIVERY: 'Courier executive is out for delivery in your area.',
          DELIVERED: 'Package successfully delivered to patron.',
          CANCELLED: 'Order cancelled.',
          RETURNED: 'Return parcel received at boutique fulfillment hub.',
          REFUNDED: 'Refund processed to original payment method.',
        };

        await tx.orderTracking.create({
          data: {
            orderId: params.id,
            status: orderStatus,
            message: message || defaultMessages[orderStatus] || `Status updated to ${orderStatus}`,
            location: location || 'National Hub, India',
          },
        });
      }

      return ord;
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}
