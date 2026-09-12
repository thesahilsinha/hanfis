import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { sendEmail, orderStatusTemplate } from '@/lib/email'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminSupabase()
  const { id } = await params
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminSupabase()
  const { id } = await params
  const body = await req.json()

  const { data, error } = await supabase
    .from('orders')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })

  // Send status update email to customer if status changed and they have email
  if (body.order_status && data.customer_email) {
    sendEmail({
      to: data.customer_email,
      subject: `Order ${body.order_status} — ${data.order_number} | Hanfi's Collection`,
      html: orderStatusTemplate(data, body.order_status),
    }).catch(console.error)
  }

  return NextResponse.json(data)
}