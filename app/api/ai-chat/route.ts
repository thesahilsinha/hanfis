import { NextRequest, NextResponse } from 'next/server'
import { groq, SYSTEM_PROMPT } from '@/lib/groq'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  const supabase = createAdminSupabase()

  // Fetch live DB context
  const [{ data: products }, { data: used }, { data: branches }] = await Promise.all([
    supabase.from('products').select('name,brand,price,old_price,badge,in_stock,category').eq('in_stock', true).limit(50),
    supabase.from('used_phones').select('name,brand,price,condition,type,status').eq('status', 'active').limit(20),
    supabase.from('branches').select('name,address,phone,timings').eq('is_active', true),
  ])

  const context = `
CURRENT PRODUCTS: ${JSON.stringify(products || [])}
USED PHONES: ${JSON.stringify(used || [])}
BRANCHES: ${JSON.stringify(branches || [])}
`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT + '\n\nLIVE STORE DATA:\n' + context },
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ],
    max_tokens: 500,
    temperature: 0.7,
  })

  return NextResponse.json({ content: completion.choices[0].message.content })
}