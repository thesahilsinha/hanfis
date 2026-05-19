'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewUsedPhonePage() {
  const router = useRouter()
  const [form, setForm] = useState({ type: 'buy', name: '', brand: '', model: '', storage: '', condition: 'Good', price: '', description: '', seller_name: '', seller_phone: '', images: '', status: 'active' })
  const [loading, setLoading] = useState(false)

  async function save() {
    if (!form.name || !form.price) return alert('Name and price required')
    setLoading(true)
    await fetch('/api/used-phones', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseInt(form.price), images: form.images ? form.images.split('\n').map((s: string) => s.trim()).filter(Boolean) : [] })
    })
    setLoading(false)
    router.push('/admin/used-phones')
  }

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Add Used Phone</h1>
        <button onClick={() => router.push('/admin/used-phones')} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: '#888' }}>← Back</button>
      </div>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1.5px solid #e8e8e8', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Listing Type</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {['buy', 'sell'].map(t => (
              <button key={t} onClick={() => setForm({ ...form, type: t })}
                style={{ flex: 1, padding: 12, border: `2px solid ${form.type === t ? '#0a0a0a' : '#e8e8e8'}`, background: form.type === t ? '#0a0a0a' : '#fff', color: form.type === t ? '#fff' : '#0a0a0a', borderRadius: 10, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', fontSize: 13 }}>
                {t === 'buy' ? '🛒 For Sale (Buy)' : '📋 Sell Request'}
              </button>
            ))}
          </div>
        </div>
        {[['name', 'Display Name *', 'text'], ['brand', 'Brand *', 'text'], ['model', 'Model', 'text'], ['storage', 'Storage (GB)', 'text'], ['price', 'Price (₹) *', 'number'], ['seller_name', 'Seller Name', 'text'], ['seller_phone', 'Seller Phone', 'tel']].map(([k, l, t]) => (
          <div key={k}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{l}</label>
            <input type={t} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none' }} />
          </div>
        ))}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Condition</label>
          <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff' }}>
            {['Excellent', 'Good', 'Fair', 'Poor'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Image URLs (one per line)</label>
          <textarea value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} rows={3} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'vertical' }} />
        </div>
        <button onClick={save} disabled={loading} style={{ padding: 14, background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Saving...' : 'Add Listing'}
        </button>
      </div>
    </div>
  )
}