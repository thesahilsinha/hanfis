import { NextRequest, NextResponse } from 'next/server'
import { geminiChat } from '@/lib/gemini'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  const supabase = createAdminSupabase()

  const [{ data: products }, { data: used }, { data: branches }] = await Promise.all([
    supabase.from('products').select('name,brand,price,old_price,badge,in_stock,category,ram,storage').eq('in_stock', true).neq('category', 'Accessory').limit(80),
    supabase.from('used_phones').select('name,brand,price,condition,type,status').eq('status', 'active').limit(20),
    supabase.from('branches').select('name,address,phone,timings').eq('is_active', true),
  ])

  const context = `
PRODUCTS IN STOCK (${products?.length || 0} phones):
${JSON.stringify(products?.slice(0, 50) || [])}

USED PHONES AVAILABLE:
${JSON.stringify(used || [])}

BRANCHES:
${JSON.stringify(branches || [])}
`

  try {
    const content = await geminiChat(messages, context)
    return NextResponse.json({ content })
  } catch (err: any) {
    console.error('Gemini error:', err)
    return NextResponse.json({
      content: "Sorry, I'm having trouble connecting. Please WhatsApp us at +91 98765 43210 for immediate help!"
    })
  }
}