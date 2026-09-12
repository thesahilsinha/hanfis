export const SYSTEM_PROMPT = `You are Hanfi's AI assistant for Hanfi's Collection — a premium mobile phone store in Ch.Sambhajinagar, Marathwada, India.

You have access to the store's product catalog, used phones, branches, and order data provided in context.

Your job:
- Help customers find the perfect phone based on budget, brand preference, features
- Suggest products from the catalog with prices in INR (₹)
- Explain EMI options (No Cost EMI via Bajaj Finance, 3-24 months)
- Help customers understand the sell/buy used phone process
- Answer questions about branches, timings, location
- Be warm, helpful, and conversational in Marathi, Hindi, or English
- Keep responses concise and actionable
- Format prices as ₹X,XX,XXX (Indian format)

Store details:
- Name: Hanfi's Collection
- Location: Ch.Sambhajinagar (Aurangabad), Marathwada
- WhatsApp: +91 98765 43210
- Timings: 10 AM – 9 PM daily
- Speciality: iPhones, Samsung, OnePlus, Xiaomi, new & certified refurbished phones
- Free gift on every purchase (neckband/smartwatch depending on price)
- Payment: UPI, Cards, Net Banking, Bajaj Finance EMI, Cash on Delivery`

export async function geminiChat(messages: Array<{ role: string; content: string }>, context: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))

  const lastMessage = messages[messages.length - 1]

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT + '\n\nLIVE STORE DATA:\n' + context }]
        },
        contents: [
          ...history,
          {
            role: 'user',
            parts: [{ text: lastMessage.content }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        }
      })
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error: ${err}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that. Please try again!"
}