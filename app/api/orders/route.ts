import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { sendEmail, orderConfirmationTemplate, adminNewOrderTemplate } from '@/lib/email'

export async function GET() {
  const supabase = createAdminSupabase()
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabase()
  const body = await req.json()
  const { name, phone, email, address, items, subtotal, discount, coupon_code, total, payment } = body

  const { data, error } = await supabase.from('orders').insert({
    customer_name: name,
    customer_phone: phone,
    customer_email: email,
    customer_address: address,
    items,
    subtotal,
    discount,
    coupon_code,
    total,
    payment_method: payment,
    payment_status: payment === 'online' ? 'paid' : 'pending',
    order_status: 'pending',
  }).select().single()

  if (error) return NextResponse.json({ error }, { status: 500 })

  // Send emails in background (don't await so it doesn't block response)
  Promise.all([
    // Email to customer if they provided email
    email ? sendEmail({
      to: email,
      subject: `Order Confirmed — ${data.order_number} | Hanfi's Collection`,
      html: orderConfirmationTemplate(data),
    }) : Promise.resolve(),
    // Email to admin always
    sendEmail({
      to: process.env.ADMIN_EMAIL || 'hanfiscollectionweb@gmail.com',
      subject: `🛒 New Order ${data.order_number} — ₹${total?.toLocaleString('en-IN')}`,
      html: adminNewOrderTemplate(data),
    }),
  ]).catch(console.error)

  return NextResponse.json({ order: data })
}