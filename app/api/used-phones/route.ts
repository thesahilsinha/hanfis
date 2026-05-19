import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = createAdminSupabase()
  const { searchParams } = new URL(req.url)
  let query = supabase.from('used_phones').select('*')
  if (searchParams.get('type')) query = query.eq('type', searchParams.get('type')!)
  if (searchParams.get('status')) query = query.eq('status', searchParams.get('status')!)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabase()
  const body = await req.json()
  const { data, error } = await supabase.from('used_phones').insert(body).select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const supabase = createAdminSupabase()
  const { id, ...body } = await req.json()
  const { data, error } = await supabase.from('used_phones').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}