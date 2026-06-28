'use client'
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
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>💸</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Request Submitted!</h1>
      <p style={{ color: '#888' }}>We've opened WhatsApp. Our team will give an instant quote!</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 16px 64px' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>INSTANT QUOTE</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800, marginBottom: 12 }}>Sell Your Phone</h1>
        <p style={{ color: '#888', fontSize: 15 }}>Get the best price for your old phone. Instant quote, same-day payment.</p>
      </div>

      <div className="sell-steps">
        {[['📸', 'Share Details', 'Fill the form below'], ['💬', 'Get Instant Quote', 'Via WhatsApp in minutes'], ['💰', 'Get Paid', 'UPI payment same day']].map(([e, t, s]) => (
          <div key={t} className="sell-step">
            <div style={{ fontSize: 24, marginBottom: 8 }}>{e}</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{t}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{s}</div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Your Name *</label>
            <input required className="form-input" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input required className="form-input" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Brand *</label>
            <input className="form-input" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Model *</label>
            <input className="form-input" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Storage (GB)</label>
            <input className="form-input" value={form.storage} onChange={e => setForm({ ...form, storage: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Condition *</label>
          <select className="form-select" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
            {['Excellent', 'Good', 'Fair', 'Poor'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Additional Details</label>
          <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Any accessories, scratches, issues..." />
        </div>
        <button type="submit" style={{ padding: 16, background: '#25d366', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
          💬 Get Instant Quote on WhatsApp
        </button>
      </form>
    </div>
  )
}