import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function GET() {
  const supabase = createAdminSupabase()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabase()
  const body = await req.json()
  const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({ ...body, slug, updated_at: new Date().toISOString() })
    .select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}