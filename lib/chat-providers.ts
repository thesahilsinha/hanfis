export const SYSTEM_PROMPT = `You are Hanfi's AI assistant for Hanfi's Collection, a mobile phone store in Ch.Sambhajinagar, Marathwada, India.
- Help customers pick phones by budget, brand and features using ONLY the live store data provided.
- Prices in INR (₹). Never invent products or prices not in the data.
- Mention No Cost EMI (Bajaj Finance, 3-24 months), free gift on every purchase, and used phone buy/sell when relevant.
- Reply in the user's language (English, Hindi, Marathi or Hinglish). Keep answers short.
- Store: WhatsApp +91 98765 43210, open 10 AM - 9 PM daily.`

type Msg = { role: string; content: string }

async function withTimeout(url: string, init: RequestInit, ms = 12000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try { return await fetch(url, { ...init, signal: ctrl.signal }) }
  finally { clearTimeout(t) }
}

// Chat must start with a user turn
function cleanMessages(messages: Msg[]) {
  const m = [...messages]
  while (m.length && m[0].role !== 'user') m.shift()
  return m
}

async function gemini(messages: Msg[], context: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('no gemini key')
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  const res = await withTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT + '\n\nLIVE STORE DATA:\n' + context }] },
        contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
        generationConfig: { maxOutputTokens: 500, temperature: 0.6 },
      }),
    }
  )
  if (!res.ok) throw new Error('gemini ' + res.status)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('gemini empty')
  return text
}

async function openrouter(messages: Msg[], context: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error('no openrouter key')
  const res = await withTimeout('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
      max_tokens: 500,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + '\n\nLIVE STORE DATA:\n' + context },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    }),
  })
  if (!res.ok) throw new Error('openrouter ' + res.status)
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('openrouter empty')
  return text
}

// No-AI fallback: keyword + budget search over your own products
export function offlineReply(question: string, products: any[]): string {
  const q = question.toLowerCase()
  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

  if (/(sell|exchange|old phone)/.test(q))
    return 'To sell your old phone, open the Sell Phone page or WhatsApp us a photo at +91 98765 43210. We give an instant quote and pay via UPI.'
  if (/(emi|installment|bajaj)/.test(q))
    return 'We offer No Cost EMI via Bajaj Finance and major bank cards, 3 to 24 months, on phones above ₹5,000. Visit any branch or WhatsApp us to check eligibility.'
  if (/(branch|address|location|where|timing|open)/.test(q))
    return 'We are open 10 AM to 9 PM daily. See all branches and directions on the Branches page, or call +91 98765 43210.'

  let max = Infinity
  const k = q.match(/(\d+(?:\.\d+)?)\s*k\b/)
  const n = q.match(/\b(\d{4,6})\b/)
  if (k) max = parseFloat(k[1]) * 1000
  else if (n) max = parseInt(n[1])

  const brands = ['apple', 'iphone', 'samsung', 'oneplus', 'xiaomi', 'redmi', 'vivo', 'oppo', 'realme', 'motorola', 'moto', 'nothing', 'iqoo', 'google', 'pixel', 'infinix']
  const wanted = brands.find(b => q.includes(b))

  let list = products.filter(p => p.price > 0 && p.price <= max)
  if (wanted) {
    const w = wanted === 'iphone' ? 'apple' : wanted === 'redmi' ? 'xiaomi' : wanted === 'moto' ? 'motorola' : wanted === 'pixel' ? 'google' : wanted
    list = list.filter(p => (p.brand || '').toLowerCase().includes(w) || (p.name || '').toLowerCase().includes(wanted))
  }
  if (!wanted && max === Infinity) {
    const words = q.split(/\W+/).filter(w => w.length > 2)
    const hit = products.filter(p => words.some(w => (p.name || '').toLowerCase().includes(w)))
    if (hit.length) list = hit
  }
  list = list.sort((a, b) => b.price - a.price).slice(0, 5)

  if (!list.length)
    return 'I could not find an exact match. Tell me your budget and preferred brand, or WhatsApp us at +91 98765 43210 and our team will help.'
  return 'Here are some options from our store:\n' + list.map(p => `• ${p.name}: ${fmt(p.price)}`).join('\n') + '\n\nTap Add to Cart on the Products page, or WhatsApp us to book.'
}

export async function chat(messages: Msg[], context: string, products: any[]): Promise<string> {
  const msgs = cleanMessages(messages)
  if (!msgs.length) return 'Hi! Tell me your budget or preferred brand and I will suggest phones.'
  for (const provider of [gemini, openrouter]) {
    try { return await provider(msgs, context) }
    catch (e) { console.error('chat provider failed:', (e as Error).message) }
  }
  return offlineReply(msgs[msgs.length - 1].content, products)
}