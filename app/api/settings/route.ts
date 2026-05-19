import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function GET() {
  const supabase = createAdminSupabase()
  const { data } = await supabase.from('site_settings').select('*').single()
  return NextResponse.json(data || { online_payment_enabled: true, cod_enabled: true, announcement_text: '', whatsapp_number: '919876543210' })
}

export async function PUT(req: NextRequest) {
  const supabase = createAdminSupabase()
  const body = await req.json()
  const { data: existing } = await supabase.from('site_settings').select('id').single()
  let result
  if (existing) {
    result = await supabase.from('site_settings').update({ ...body, updated_at: new Date().toISOString() }).eq('id', existing.id).select().single()
  } else {
    result = await supabase.from('site_settings').insert({ ...body, updated_at: new Date().toISOString() }).select().single()
  }
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json(result.data)
}