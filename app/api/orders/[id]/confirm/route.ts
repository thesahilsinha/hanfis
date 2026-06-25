import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminSupabase()
  const { id } = await params
  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: 'confirmed', payment_status: 'paid' })
    .eq('id', id)
    .select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ order: data })
}