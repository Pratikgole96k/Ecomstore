import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import {
  generateOrderNumber,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  GST_RATE,
} from '@/lib/utils';
import { createRazorpayOrder, verifyRazorpaySignature } from '@/lib/razorpay';
import { sendEmail, generateOrderConfirmationEmail } from '@/lib/email';
import { OrderDetail } from '@/types';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();

    const {
      items, // array of { productId, variantId, quantity }
      shippingAddress, // { fullName, phone, addressLine1, addressLine2, city, state, pincode, country }
      paymentMethod, // 'RAZORPAY' | 'COD' | 'UPI' | 'CARD'
      couponCode,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.pincode) {
      return NextResponse.json({ error: 'Incomplete shipping address' }, { status: 400 });
    }

    // 1. Server-side validation of stock and authoritative price recalculation
    let serverSubtotal = 0;
    const validatedItems: {
      productId: string;
      variantId?: string | null;
      productName: string;
      variantInfo?: string;
      quantity: number;
      price: number;
      imageUrl?: string;
    }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId, isActive: true },
        include: { images: true, variants: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.name || item.productId}" is no longer available.` },
          { status: 400 }
        );
      }

      let itemPrice = product.price;
      let variantInfo = '';
      let availableStock = 10;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId && v.isActive);
        if (!variant) {
          return NextResponse.json(
            { error: `Selected variant for "${product.name}" is no longer available.` },
            { status: 400 }
          );
        }
        if (variant.stock < item.quantity) {
          return NextResponse.json(
            {
              error: `Only ${variant.stock} units available for ${product.name} (${variant.size}, ${variant.color}).`,
            },
            { status: 400 }
          );
        }
        itemPrice = variant.price;
        variantInfo = `Size: ${variant.size}, Color: ${variant.color}`;
        availableStock = variant.stock;
      }

      serverSubtotal += itemPrice * item.quantity;
      validatedItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        productName: product.name,
        variantInfo,
        quantity: item.quantity,
        price: itemPrice,
        imageUrl: product.images[0]?.imageUrl,
      });
    }

    // 2. Server-side Coupon validation & discount recalculation
    let serverDiscount = 0;
    let validCouponId: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive && (!coupon.expiryDate || new Date(coupon.expiryDate) >= new Date())) {
        if (serverSubtotal >= coupon.minimumOrder) {
          if (coupon.type === 'PERCENTAGE') {
            serverDiscount = (serverSubtotal * coupon.value) / 100;
            if (coupon.maximumDiscount && serverDiscount > coupon.maximumDiscount) {
              serverDiscount = coupon.maximumDiscount;
            }
          } else {
            serverDiscount = Math.min(coupon.value, serverSubtotal);
          }
          validCouponId = coupon.id;
        }
      }
    }

    // 3. Server-side Shipping & Tax Calculation
    const serverShippingFee =
      serverSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const taxableAmount = Math.max(serverSubtotal - serverDiscount, 0);
    const serverTax = Math.round(taxableAmount * GST_RATE * 100) / 100;
    const serverTotal = Math.round((taxableAmount + serverShippingFee + serverTax) * 100) / 100;

    // 4. Payment verification if Razorpay
    const isPaidOnline = paymentMethod !== 'COD';
    let paymentStatus = isPaidOnline ? 'PAID' : 'PENDING';

    if (isPaidOnline && razorpaySignature && razorpayOrderId && razorpayPaymentId) {
      const isValidSig = verifyRazorpaySignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      });

      if (!isValidSig) {
        return NextResponse.json(
          { error: 'Payment signature verification failed' },
          { status: 400 }
        );
      }
    }

    // 5. Create Order & Decrease Inventory atomically
    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      // Save address if user logged in
      let savedAddressId: string | null = null;
      if (session?.id) {
        const address = await tx.address.create({
          data: {
            userId: session.id,
            fullName: shippingAddress.fullName,
            phone: shippingAddress.phone,
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2 || null,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode,
            country: shippingAddress.country || 'India',
          },
        });
        savedAddressId = address.id;
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.id || null,
          addressId: savedAddressId,
          shippingName: shippingAddress.fullName,
          shippingPhone: shippingAddress.phone,
          shippingAddress: `${shippingAddress.addressLine1}${shippingAddress.addressLine2 ? ', ' + shippingAddress.addressLine2 : ''}`,
          shippingCity: shippingAddress.city,
          shippingState: shippingAddress.state,
          shippingPincode: shippingAddress.pincode,
          subtotal: serverSubtotal,
          discount: serverDiscount,
          shippingFee: serverShippingFee,
          tax: serverTax,
          total: serverTotal,
          paymentMethod: paymentMethod || 'COD',
          paymentStatus: paymentStatus,
          orderStatus: 'CONFIRMED',
          razorpayOrderId: razorpayOrderId || null,
          razorpayPaymentId: razorpayPaymentId || null,
          couponId: validCouponId,
          couponCode: couponCode || null,
        },
      });

      // Create Order Items & Decrement Stock
      for (const item of validatedItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variantInfo: item.variantInfo,
            quantity: item.quantity,
            price: item.price,
            imageUrl: item.imageUrl,
          },
        });

        // Decrement Variant stock
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: { decrement: item.quantity },
            },
          });

          // Sync inventory table
          await tx.inventory.updateMany({
            where: { variantId: item.variantId },
            data: {
              quantity: { decrement: item.quantity },
            },
          });
        }
      }

      // Increment coupon usage count
      if (validCouponId) {
        await tx.coupon.update({
          where: { id: validCouponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Initial Order Tracking Event
      await tx.orderTracking.create({
        data: {
          orderId: newOrder.id,
          status: 'CONFIRMED',
          message: 'Your royal order has been confirmed and forwarded to the artisan studio.',
          location: 'National Fulfillment Hub',
        },
      });

      return newOrder;
    });

    // 6. Send Order Confirmation Email asynchronously
    const fullOrderDetails = (await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    })) as unknown as OrderDetail;

    if (fullOrderDetails) {
      const recipientEmail = session?.email || body.email || 'customer@vastrika.com';
      const emailHtml = generateOrderConfirmationEmail(fullOrderDetails);
      sendEmail({
        to: recipientEmail,
        subject: `Order Confirmation #${order.orderNumber} - VASTRIKA Couture`,
        html: emailHtml,
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      message: 'Order placed successfully!',
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to place order. Please try again.' },
      { status: 500 }
    );
  }
}
