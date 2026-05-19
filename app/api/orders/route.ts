import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

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
    customer_name: name, customer_phone: phone, customer_email: email, customer_address: address,
    items, subtotal, discount, coupon_code, total, payment_method: payment,
    payment_status: 'pending', order_status: 'pending'
  }).select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ order: data })
}