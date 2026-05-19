import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = createAdminSupabase()
  const { searchParams } = new URL(req.url)
  let query = supabase.from('products').select('*')
  if (searchParams.get('brand')) query = query.eq('brand', searchParams.get('brand')!)
  if (searchParams.get('featured')) query = query.eq('featured', true)
  if (searchParams.get('in_stock')) query = query.eq('in_stock', true)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabase()
  const body = await req.json()
  const { data, error } = await supabase.from('products').insert(body).select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}