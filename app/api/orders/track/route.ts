import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = createAdminSupabase()
  const phone = req.nextUrl.searchParams.get('phone')
  if (!phone) return NextResponse.json([])
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_phone', phone)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json([])
  return NextResponse.json(data)
}