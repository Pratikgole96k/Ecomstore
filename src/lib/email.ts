import { OrderDetail } from '@/types';
import { formatPrice } from './utils';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'VASTRIKA <orders@vastrika.com>';

  // If no live key is supplied, log to console for development tracking
  if (!apiKey || apiKey === 're_placeholder_api_key') {
    console.log(`\n📨 [Simulated Email Dispatch]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Status: Sent (Simulated)\n`);
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Failed to dispatch transactional email:', error);
    return { success: false, error };
  }
}

/**
 * Generate Order Confirmation Email HTML
 */
export function generateOrderConfirmationEmail(order: OrderDetail) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f0e6d6;">
        <td style="padding: 12px 0;">
          <strong style="color: #480B19; font-size: 15px;">${item.productName}</strong>
          ${item.variantInfo ? `<br/><span style="color: #666; font-size: 13px;">${item.variantInfo}</span>` : ''}
          <br/><span style="color: #888; font-size: 12px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #111;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 20px; color: #222; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #EADDC8; box-shadow: 0 4px 20px rgba(72,11,25,0.05); }
          .header { background: #7E132B; padding: 30px 20px; text-align: center; color: #FAF2D7; }
          .logo { font-size: 28px; letter-spacing: 4px; font-weight: bold; margin: 0; font-family: Georgia, serif; }
          .tagline { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #DCB947; margin-top: 5px; }
          .content { padding: 30px; }
          .greeting { font-size: 18px; font-weight: 600; color: #480B19; margin-bottom: 10px; }
          .order-box { background: #FAF8F5; border-radius: 8px; padding: 15px; margin: 20px 0; border: 1px solid #EADDC8; }
          .summary-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .footer { background: #FAF8F5; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #EADDC8; }
          .btn { display: inline-block; background: #7E132B; color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: 600; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="logo">VASTRIKA</h1>
            <div class="tagline">Tradition Woven Into Every Story</div>
          </div>
          <div class="content">
            <div class="greeting">Thank You for Your Order! ✨</div>
            <p>We are delighted to confirm that your order <strong>#${order.orderNumber}</strong> has been received and is being prepared with supreme craftsmanship.</p>
            
            <div class="order-box">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span><strong>Order ID:</strong> #${order.orderNumber}</span>
                <span><strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})</span>
              </div>
              <div>
                <strong>Shipping To:</strong><br/>
                ${order.shippingName || ''}<br/>
                ${order.shippingAddress || ''}, ${order.shippingCity || ''}, ${order.shippingState || ''} - ${order.shippingPincode || ''}
              </div>
            </div>

            <table class="summary-table">
              <thead>
                <tr style="border-bottom: 2px solid #7E132B; text-align: left; font-size: 13px; color: #7E132B; text-transform: uppercase;">
                  <th style="padding-bottom: 8px;">Item Details</th>
                  <th style="padding-bottom: 8px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; border-top: 1px solid #EADDC8; padding-top: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #666;">
                <span>Subtotal</span>
                <span>${formatPrice(order.subtotal)}</span>
              </div>
              ${
                order.discount > 0
                  ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #16a34a;">
                      <span>Coupon Discount</span>
                      <span>-${formatPrice(order.discount)}</span>
                    </div>`
                  : ''
              }
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #666;">
                <span>Shipping</span>
                <span>${order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 18px; font-weight: bold; color: #480B19;">
                <span>Total Paid</span>
                <span>${formatPrice(order.total)}</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/orders/${order.id}" class="btn">
                Track Your Order
              </a>
            </div>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} VASTRIKA Couture. Handcrafted Indian Heritage.<br/>
            Need assistance? Reach out to support@vastrika.com
          </div>
        </div>
      </body>
    </html>
  `;
}
