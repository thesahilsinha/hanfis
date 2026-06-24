import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createAdminSupabase()
  const body = await req.json()
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', (await params).id)
    .select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createAdminSupabase()
  const { error } = await supabase.from('blog_posts').delete().eq('id', (await params).id)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}