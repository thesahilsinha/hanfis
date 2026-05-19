import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createAdminSupabase()
  const { data, error } = await supabase.from('orders')
    .update({ order_status: 'confirmed', payment_status: 'paid' })
    .eq('id', (await params).id).select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ order: data })
}