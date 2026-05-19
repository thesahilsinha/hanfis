'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewBranchPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', address: '', city: 'Mumbai', phone: '', whatsapp: '', image_url: '', google_map_url: '', google_map_embed: '', timings: '10 AM – 9 PM' })
  const [loading, setLoading] = useState(false)

  async function save() {
    if (!form.name || !form.address || !form.phone) return alert('Name, address and phone are required')
    setLoading(true)
    await fetch('/api/branches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setLoading(false)
    router.push('/admin/branches')
  }

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Add New Branch</h1>
        <button onClick={() => router.push('/admin/branches')} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: '#888' }}>← Back</button>
      </div>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1.5px solid #e8e8e8', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[['name', 'Branch Name *', 'text'], ['address', 'Full Address *', 'text'], ['city', 'City', 'text'], ['phone', 'Phone Number *', 'tel'], ['whatsapp', 'WhatsApp Number', 'tel'], ['timings', 'Opening Timings', 'text'], ['image_url', 'Branch Photo URL', 'url'], ['google_map_url', 'Google Maps Share Link', 'url'], ['google_map_embed', 'Google Maps Embed URL', 'url']].map(([k, l, t]) => (
          <div key={k}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{l}</label>
            <input type={t} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none' }} />
            {k === 'google_map_embed' && <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe code</p>}
          </div>
        ))}
        <button onClick={save} disabled={loading} style={{ padding: 14, background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Saving...' : 'Add Branch'}
        </button>
      </div>
    </div>
  )
}