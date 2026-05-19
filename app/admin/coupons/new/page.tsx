'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCouponPage() {
  const router = useRouter()
  const [form, setForm] = useState({ code: '', discount_type: 'percent', discount_value: '', min_order: '', max_uses: '', expires_at: '', is_active: true })
  const [loading, setLoading] = useState(false)

  async function save() {
    if (!form.code || !form.discount_value) return alert('Code and discount value required')
    setLoading(true)
    await fetch('/api/coupons', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, code: form.code.toUpperCase(), discount_value: parseInt(form.discount_value), min_order: form.min_order ? parseInt(form.min_order) : null, max_uses: form.max_uses ? parseInt(form.max_uses) : null, expires_at: form.expires_at || null })
    })
    setLoading(false)
    router.push('/admin/coupons')
  }

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Create Coupon</h1>
        <button onClick={() => router.push('/admin/coupons')} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: '#888' }}>← Back</button>
      </div>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1.5px solid #e8e8e8', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Coupon Code *</label>
          <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. HANFI20"
            style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 16, fontWeight: 700, fontFamily: 'monospace', outline: 'none', letterSpacing: 2 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Type</label>
            <select value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff' }}>
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Value * {form.discount_type === 'percent' ? '(%)' : '(₹)'}</label>
            <input type="number" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Min Order Amount (₹)</label>
            <input type="number" value={form.min_order} onChange={e => setForm({ ...form, min_order: e.target.value })} placeholder="Optional"
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Max Uses</label>
            <input type="number" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })} placeholder="Unlimited"
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none' }} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Expiry Date</label>
          <input type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })}
            style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none' }} />
        </div>
        <button onClick={save} disabled={loading} style={{ padding: 14, background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Creating...' : 'Create Coupon'}
        </button>
      </div>
    </div>
  )
}