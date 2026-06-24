import { NextRequest, NextResponse } from 'next/server'
// import { supabaseAdmin } from '@/lib/supabase'
import { createAdminSupabase } from '@/lib/supabase-server'



export async function POST(req: NextRequest) {
  const { email, name } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const { error } = await createAdminSupabase
    .from('newsletter_subscribers')
    .upsert({ email, name }, { onConflict: 'email' })

  if (error) return NextResponse.json({ error: 'Already subscribed or invalid email' }, { status: 400 })
  return NextResponse.json({ success: true })
}