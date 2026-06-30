'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateSlug } from '@/lib/utils'

const accessoryTypes = ['Charger', 'Earphones', 'TWS/Buds', 'Smartwatch', 'Case', 'Screen Guard', 'Power Bank', 'Cable', 'Other']
const brands = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'OPPO', 'Realme', 'Motorola', 'Nothing', 'iQOO', 'Generic', 'Other']

export default function NewAccessoryPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', brand: 'Generic', accessory_type: 'Charger', description: '',
    price: '', old_price: '', badge: '', in_stock: true, featured: false,
    images: '', specs: '{}'
  })
  const [loading, setLoading] = useState(false)

  async function save() {
    if (!form.name || !form.price) return alert('Name and price are required')
    setLoading(true)
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        slug: generateSlug(form.name) + '-' + Date.now(),
        category: 'Accessory',
        emi_available: false,
        price: parseInt(form.price),
        old_price: form.old_price ? parseInt(form.old_price) : null,
        images: form.images ? form.images.split('\n').map(s => s.trim()).filter(Boolean) : [],
        specs: JSON.parse(form.specs || '{}')
      })
    })
    setLoading(false)
    router.push('/admin/accessories')
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 800 }}>
      <div className="page-header">
        <h1 className="page-title">Add New Accessory</h1>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: '#888' }}>← Back</button>
      </div>
      <div className="admin-form-card">
        <div className="form-group">
          <label className="form-label">Product Name *</label>
          <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Boat Rockerz Neckband" />
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Price (₹) *</label>
            <input className="form-input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Old Price (₹)</label>
            <input className="form-input" type="number" value={form.old_price} onChange={e => setForm({ ...form, old_price: e.target.value })} />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.accessory_type} onChange={e => setForm({ ...form, accessory_type: e.target.value })}>
              {accessoryTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Brand</label>
            <select className="form-select" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}>
              {brands.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Badge</label>
          <select className="form-select" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })}>
            <option value="">No Badge</option>
            {['sale', 'new', 'hot', 'featured'].map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Image URLs (one per line)</label>
          <textarea className="form-textarea" rows={3} value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} placeholder="https://example.com/image.jpg" />
        </div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
          {[['in_stock', 'In Stock'], ['featured', 'Featured on Homepage']].map(([k, l]) => (
            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.checked })} />{l}
            </label>
          ))}
        </div>
        <button onClick={save} disabled={loading} className="btn-primary" style={{ width: '100%', padding: 14 }}>
          {loading ? 'Saving...' : 'Save Accessory'}
        </button>
      </div>
    </div>
  )
}