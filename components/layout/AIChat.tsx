'use client'
import { useState, useRef, useEffect } from 'react'

interface Msg { role: 'user' | 'assistant'; content: string }

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: "👋 Hi! I'm Hanfi's AI assistant. I can help you find the perfect phone, check EMI options, or assist with selling your old device!" }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight }, [messages, loading])

  async function send() {
    const msg = input.trim(); if (!msg || loading) return
    const newMsgs: Msg[] = [...messages, { role: 'user', content: msg }]
    setMessages(newMsgs); setInput(''); setLoading(true)
    try {
      const res = await fetch('/api/ai-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMsgs }) })
      const data = await res.json()
      setMessages([...newMsgs, { role: 'assistant', content: data.content }])
    } catch { setMessages([...newMsgs, { role: 'assistant', content: 'Sorry, something went wrong!' }]) }
    setLoading(false)
  }

  const chips = ['Best iPhone under ₹80k?', 'Samsung deals today?', 'How to sell my phone?', 'EMI options?']

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fab" style={{ position: 'fixed', bottom: 84, right: 24, zIndex: 9999, background: '#c8102e' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" width="22" height="22">
          <path d="M12 2a8 8 0 0 1 8 8c0 5.25-5.5 10-8 12-2.5-2-8-6.75-8-12a8 8 0 0 1 8-8z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      </button>
      {open && (
        <div className="chat-wrap">
          <div style={{ background: '#0a0a0a', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#c8102e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Hanfi's Assistant</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}></span>Online — AI Powered
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>
          <div ref={bodyRef} className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'msg-user' : 'msg-bot'}>
                <div className={m.role === 'user' ? 'bubble-user' : 'bubble-bot'}>{m.content}</div>
                {i === 0 && (
                  <div className="qr-chips">
                    {chips.map(c => <button key={c} className="qr-chip" onClick={() => { setInput(c); setTimeout(send, 50) }}>{c}</button>)}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="msg-bot">
                <div className="bubble-bot"><div className="typing">{[0,1,2].map(i => <div key={i} className="dot" />)}</div></div>
              </div>
            )}
          </div>
          <div style={{ padding: '12px 14px', borderTop: '1px solid #e8e8e8', display: 'flex', gap: 10, background: '#fff' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type your message..."
              style={{ flex: 1, padding: '10px 14px', background: '#f4f4f4', border: '1.5px solid transparent', borderRadius: 50, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={send} style={{ width: 38, height: 38, borderRadius: '50%', background: '#0a0a0a', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="16" height="16"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}