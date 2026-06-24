'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminGallery() {
  const [images, setImages] = useState<any[]>([])
  const [form, setForm] = useState({ image_url: '', caption: '', link_url: '', sort_order: '0' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function load() {
    const res = await fetch('/api/gallery')
    const data = await res.json()
    setImages(data || [])
  }

  useEffect(() => { load() }, [])

  async function add() {
    if (!form.image_url) return alert('Image URL required')
    setLoading(true)
    await fetch('/api/gallery', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, sort_order: parseInt(form.sort_order) || 0 })
    })
    setForm({ image_url: '', caption: '', link_url: '', sort_order: '0' })
    await load()
    setLoading(false)
  }

  async function toggle(img: any) {
    await fetch('/api/gallery', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: img.id, is_active: !img.is_active })
    })
    load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this image?')) return
    await fetch('/api/gallery', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    load()
  }

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Gallery ({images.length})</h1>
      </div>

      {/* Add new */}
      <div className="admin-form-card" style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Add New Image</h2>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Image URL *</label>
            <input className="form-input" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://example.com/image.jpg" />
          </div>
          <div className="form-group">
            <label className="form-label">Caption</label>
            <input className="form-input" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} placeholder="e.g. iPhone 16 Pro" />
          </div>
          <div className="form-group">
            <label className="form-label">Link URL (optional)</label>
            <input className="form-input" value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} placeholder="/products/iphone-16-pro" />
          </div>
          <div className="form-group">
            <label className="form-label">Sort Order</label>
            <input className="form-input" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} />
          </div>
        </div>
        {form.image_url && (
          <div style={{ marginBottom: 16 }}>
            <img src={form.image_url} alt="Preview" style={{ height: 120, width: 120, objectFit: 'cover', borderRadius: 10, border: '1.5px solid #e8e8e8' }} onError={e => (e.currentTarget.style.display = 'none')} />
          </div>
        )}
        <button onClick={add} disabled={loading} className="btn-primary">
          {loading ? 'Adding...' : '+ Add to Gallery'}
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {images.map(img => (
          <div key={img.id} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1.5px solid #e8e8e8', opacity: img.is_active ? 1 : 0.5 }}>
            <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
              <img src={img.image_url} alt={img.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <span className="badge-status" style={{ background: img.is_active ? '#dcfce7' : '#fee2e2', color: img.is_active ? '#166534' : '#991b1b' }}>
                  {img.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.caption || '—'}</div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>Order: {img.sort_order}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggle(img)} style={{ flex: 1, padding: '7px', background: img.is_active ? '#fef3c7' : '#dcfce7', color: img.is_active ? '#92400e' : '#166534', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  {img.is_active ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => remove(img.id)} className="btn-danger" style={{ padding: '7px 12px' }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}