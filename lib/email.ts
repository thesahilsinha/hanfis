import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    await transporter.sendMail({
      from: `"Hanfi's Collection" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    })
  } catch (err) {
    console.error('Email send failed:', err)
  }
}

export function orderConfirmationTemplate(order: any) {
  const items = order.items?.map((item: any) => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;">
        <div style="font-weight:600;font-size:14px;color:#0a0a0a;">${item.name}</div>
        <div style="font-size:12px;color:#888;margin-top:2px;">${item.brand} · Qty: ${item.quantity}</div>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700;font-size:14px;">
        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('') || ''

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#0a0a0a;padding:32px 40px;text-align:center;">
      <div style="font-size:24px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
        Hanfi's <span style="color:#c8102e;">Collection</span>
      </div>
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px;">Premium Mobile Store · Marathwada</div>
    </div>

    <!-- Status banner -->
    <div style="background:#c8102e;padding:20px 40px;text-align:center;">
      <div style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Order Confirmed</div>
      <div style="font-size:28px;font-weight:800;color:#fff;">${order.order_number}</div>
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">
      <p style="font-size:16px;color:#0a0a0a;margin:0 0 8px;font-weight:600;">Hi ${order.customer_name}! 👋</p>
      <p style="font-size:14px;color:#666;margin:0 0 28px;line-height:1.7;">Thank you for your order! We've received it and our team is preparing it for you. You'll receive another update when it's shipped.</p>

      <!-- Order details -->
      <div style="background:#f9f9f9;border-radius:12px;padding:20px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;">Order Number</span>
          <span style="font-size:13px;font-weight:700;color:#0a0a0a;">${order.order_number}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;">Payment</span>
          <span style="font-size:13px;font-weight:700;color:#0a0a0a;text-transform:uppercase;">${order.payment_method === 'cod' ? 'Cash on Delivery' : '💳 Paid Online'}</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;">Delivery To</span>
          <span style="font-size:13px;font-weight:700;color:#0a0a0a;">${order.customer_phone}</span>
        </div>
      </div>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr style="background:#f4f4f4;">
            <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;">Item</th>
            <th style="padding:10px 16px;text-align:right;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;">Amount</th>
          </tr>
        </thead>
        <tbody>${items}</tbody>
      </table>

      <!-- Total -->
      <div style="border-top:2px solid #0a0a0a;padding-top:16px;margin-bottom:28px;">
        ${order.discount > 0 ? `
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:13px;color:#888;">Subtotal</span>
          <span style="font-size:13px;color:#888;">₹${order.subtotal?.toLocaleString('en-IN')}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:13px;color:#1a8a4a;">Discount</span>
          <span style="font-size:13px;color:#1a8a4a;">-₹${order.discount?.toLocaleString('en-IN')}</span>
        </div>` : ''}
        <div style="display:flex;justify-content:space-between;">
          <span style="font-size:18px;font-weight:800;color:#0a0a0a;">Total</span>
          <span style="font-size:18px;font-weight:800;color:#0a0a0a;">₹${order.total?.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:28px;">
        <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I want to check status of order ${order.order_number}`)}"
          style="display:inline-block;background:#25d366;color:#fff;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:700;text-decoration:none;margin-right:8px;">
          💬 WhatsApp Us
        </a>
        <a href="https://hanfis.vercel.app/orders"
          style="display:inline-block;background:#0a0a0a;color:#fff;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:700;text-decoration:none;">
          📦 Track Order
        </a>
      </div>

      <p style="font-size:13px;color:#888;text-align:center;line-height:1.7;margin:0;">Questions? Call us at <strong>+91 98765 43210</strong> or visit any of our branches in Ch.Sambhajinagar.</p>
    </div>

    <!-- Footer -->
    <div style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #e8e8e8;">
      <p style="font-size:12px;color:#aaa;margin:0;">© 2025 Hanfi's Collection · Marathwada's Most Trusted Mobile Store</p>
      <p style="font-size:11px;color:#bbb;margin:6px 0 0;">This is an automated email. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`
}

export function orderStatusTemplate(order: any, status: string) {
  const statusConfig: Record<string, { emoji: string; color: string; message: string }> = {
    confirmed: { emoji: '✅', color: '#1a8a4a', message: 'Your order has been confirmed and is being prepared.' },
    processing: { emoji: '⚙️', color: '#8b5cf6', message: 'Your order is currently being processed.' },
    shipped: { emoji: '🚚', color: '#f97316', message: 'Great news! Your order has been shipped and is on its way.' },
    delivered: { emoji: '🎉', color: '#1a8a4a', message: 'Your order has been delivered! We hope you love it.' },
    cancelled: { emoji: '❌', color: '#c8102e', message: 'Your order has been cancelled. Contact us if you have questions.' },
  }
  const config = statusConfig[status] || { emoji: '📦', color: '#0071e3', message: 'Your order status has been updated.' }

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#0a0a0a;padding:28px 40px;text-align:center;">
      <div style="font-size:22px;font-weight:800;color:#fff;">Hanfi's <span style="color:#c8102e;">Collection</span></div>
    </div>
    <div style="padding:40px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">${config.emoji}</div>
      <h1 style="font-size:24px;font-weight:800;color:#0a0a0a;margin:0 0 8px;text-transform:capitalize;">Order ${status}</h1>
      <p style="font-size:14px;color:#666;margin:0 0 24px;line-height:1.7;">${config.message}</p>
      <div style="background:#f9f9f9;border-radius:12px;padding:16px;margin-bottom:28px;display:inline-block;">
        <span style="font-size:13px;color:#888;">Order: </span>
        <span style="font-size:13px;font-weight:800;color:#0a0a0a;">${order.order_number}</span>
      </div>
      <br/>
      <a href="https://hanfis.vercel.app/orders" style="display:inline-block;background:#0a0a0a;color:#fff;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:700;text-decoration:none;">Track Order →</a>
    </div>
    <div style="background:#f9f9f9;padding:16px 40px;text-align:center;border-top:1px solid #e8e8e8;">
      <p style="font-size:12px;color:#aaa;margin:0;">© 2025 Hanfi's Collection · Ch.Sambhajinagar, Marathwada</p>
    </div>
  </div>
</body>
</html>`
}

export function adminNewOrderTemplate(order: any) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#c8102e;padding:24px 32px;text-align:center;">
      <div style="font-size:14px;font-weight:700;color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:2px;">New Order Received</div>
      <div style="font-size:28px;font-weight:800;color:#fff;margin-top:4px;">${order.order_number}</div>
    </div>
    <div style="padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ['Customer', order.customer_name],
          ['Phone', order.customer_phone],
          ['Email', order.customer_email || 'Not provided'],
          ['Address', order.customer_address || 'Not provided'],
          ['Payment', order.payment_method?.toUpperCase()],
          ['Total', `₹${order.total?.toLocaleString('en-IN')}`],
        ].map(([k, v]) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f4f4f4;font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;width:35%;">${k}</td>
            <td style="padding:10px 0;border-bottom:1px solid #f4f4f4;font-size:14px;font-weight:600;color:#0a0a0a;">${v}</td>
          </tr>
        `).join('')}
      </table>
      <div style="margin-top:20px;">
        <div style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Items Ordered</div>
        ${order.items?.map((item: any) => `
          <div style="padding:10px 12px;background:#f9f9f9;border-radius:8px;margin-bottom:6px;display:flex;justify-content:space-between;">
            <div>
              <div style="font-size:13px;font-weight:600;">${item.name}</div>
              <div style="font-size:11px;color:#888;">Qty: ${item.quantity}</div>
            </div>
            <div style="font-size:13px;font-weight:700;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
          </div>
        `).join('') || ''}
      </div>
      <div style="margin-top:20px;text-align:center;">
        <a href="https://hanfis.vercel.app/admin/orders" style="display:inline-block;background:#0a0a0a;color:#fff;padding:12px 28px;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none;">View in Admin →</a>
      </div>
    </div>
  </div>
</body>
</html>`
}