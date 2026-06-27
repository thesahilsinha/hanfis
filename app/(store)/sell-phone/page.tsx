'use client'
export const revalidate = 0
import { useState } from 'react'

export default function SellPhonePage() {
  const [form, setForm] = useState({ name: '', phone: '', brand: '', model: '', storage: '', condition: 'Good', description: '' })
  const [done, setDone] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/used-phones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, type: 'sell', price: 0, status: 'pending' }) })
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'
    const msg = `Hi Hanfi's! I want to sell my phone.\n\nBrand: ${form.brand}\nModel: ${form.model}\nStorage: ${form.storage}\nCondition: ${form.condition}\nName: ${form.name}\nPhone: ${form.phone}`
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank')
    setDone(true)
  }

  if (done) return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 32px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>💸</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Request Submitted!</h1>
      <p style={{ color: '#888' }}>We've opened WhatsApp for you. Our team will provide an instant quote within minutes!</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '64px 32px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#c8102e', marginBottom: 8 }}>INSTANT QUOTE</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 800, marginBottom: 12 }}>Sell Your Phone</h1>
        <p style={{ color: '#888', fontSize: 15 }}>Get the best price for your old phone. Instant quote, same-day payment.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
        {[['📸', 'Share Details', 'Fill the form below'], ['💬', 'Get Instant Quote', 'Via WhatsApp in minutes'], ['💰', 'Get Paid', 'UPI payment same day']].map(([e, t, s]) => (
          <div key={t} style={{ background: '#f9f9f9', borderRadius: 16, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{e}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{t}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{s}</div>
          </div>
        ))}
      </div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[['name', 'Your Name *', 'text'], ['phone', 'Phone Number *', 'tel']].map(([k, l, t]) => (
            <div key={k}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{l}</label>
              <input required type={t} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[['brand', 'Brand *'], ['model', 'Model *'], ['storage', 'Storage (GB)']].map(([k, l]) => (
            <div key={k}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{l}</label>
              <input value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none' }} />
            </div>
          ))}
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Condition *</label>
          <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}
            style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff' }}>
            {['Excellent', 'Good', 'Fair', 'Poor'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Additional Details</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Any accessories included, scratches, issues..."
            style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'vertical' }} />
        </div>
        <button type="submit" style={{ padding: 16, background: '#25d366', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          💬 Get Instant Quote on WhatsApp
        </button>
      </form>
    </div>
  )
}