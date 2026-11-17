import { NextRequest, NextResponse } from 'next/server'
import { chat } from '@/lib/chat-providers'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const messages = (body.messages || []).slice(-6)
  const supabase = createAdminSupabase()

  const [{ data: products }, { data: used }, { data: branches }] = await Promise.all([
    supabase.from('products').select('name,brand,price,old_price,ram,storage').eq('in_stock', true).neq('category', 'Accessory').gt('price', 0).limit(150),
    supabase.from('used_phones').select('name,brand,price,condition').eq('status', 'active').limit(20),
    supabase.from('branches').select('name,address,phone,timings').eq('is_active', true),
  ])

  const lastQ = (messages[messages.length - 1]?.content || '').toLowerCase()
  const words = lastQ.split(/\W+/).filter((w: string) => w.length > 2)
  const all = products || []
  const relevant = all.filter((p: any) => words.some((w: string) => `${p.name} ${p.brand}`.toLowerCase().includes(w)))
  const slice = (relevant.length ? relevant : all).slice(0, 40)

  const context = `PHONES: ${JSON.stringify(slice)}\nUSED: ${JSON.stringify(used || [])}\nBRANCHES: ${JSON.stringify(branches || [])}`

  const content = await chat(messages, context, all)
  return NextResponse.json({ content })
}