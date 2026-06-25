'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { generateSlug } from '@/lib/utils'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => r.json()).then(data => {
      setForm({ ...data, images: (data.images || []).join('\n'), specs: JSON.stringify(data.specs || {}, null, 2), price: String(data.price), old_price: String(data.old_price || '') })
    })
  }, [id])

  async function save() {
    setLoading(true)
    await fetch(`/api/products/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slug: generateSlug(form.name), price: parseInt(form.price), old_price: form.old_price ? parseInt(form.old_price) : null, images: form.images ? form.images.split('\n').map((s: string) => s.trim()).filter(Boolean) : [], specs: JSON.parse(form.specs || '{}') })
    })
    setLoading(false)
    router.push('/admin/products')
  }

  async function deleteProduct() {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    router.push('/admin/products')
  }

  if (!form) return <div style={{ padding: 40 }}>Loading...</div>

  return (
    <div style={{ padding: '24px 20px', maxWidth: 800 }}>
      <div className="page-header">
        <h1 className="page-title">Edit Product</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={deleteProduct} className="btn-danger">Delete</button>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: '#888' }}>← Back</button>
        </div>
      </div>
      <div className="admin-form-card">
        <div className="form-group">
          <label className="form-label">Product Name</label>
          <input className="form-input" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input className="form-input" type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Old Price (₹)</label>
            <input className="form-input" type="number" value={form.old_price || ''} onChange={e => setForm({ ...form, old_price: e.target.value })} />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Brand</label>
            <select className="form-select" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}>
              {['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'OPPO', 'Realme', 'Motorola', 'Nokia', 'Google'].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Badge</label>
            <select className="form-select" value={form.badge || ''} onChange={e => setForm({ ...form, badge: e.target.value })}>
              <option value="">No Badge</option>
              {['sale', 'new', 'hot', 'featured'].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" rows={3} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Image URLs (one per line)</label>
          <textarea className="form-textarea" rows={3} value={form.images || ''} onChange={e => setForm({ ...form, images: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Specs (JSON)</label>
          <textarea className="form-textarea" rows={5} value={form.specs || ''} onChange={e => setForm({ ...form, specs: e.target.value })} style={{ fontFamily: 'monospace', fontSize: 13 }} />
        </div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
          {[['in_stock', 'In Stock'], ['featured', 'Featured'], ['emi_available', 'EMI Available']].map(([k, l]) => (
            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!form[k]} onChange={e => setForm({ ...form, [k]: e.target.checked })} />{l}
            </label>
          ))}
        </div>
        <button onClick={save} disabled={loading} className="btn-primary" style={{ width: '100%', padding: 14 }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}