'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditBlogPost() {
  const router = useRouter()
  const { id } = useParams()
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/blog').then(r => r.json()).then((posts: any[]) => {
      const post = posts.find(p => p.id === id)
      if (post) setForm(post)
    })
  }, [id])

  async function save(publish?: boolean) {
    if (!form.title) return alert('Title is required')
    setLoading(true)
    const updates: any = { ...form }
    if (publish !== undefined) {
      updates.is_published = publish
      updates.published_at = publish ? new Date().toISOString() : null
    }
    await fetch(`/api/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    setLoading(false)
    router.push('/admin/blog')
  }

  if (!form) return <div style={{ padding: 40 }}>Loading...</div>

  return (
    <div style={{ padding: '24px 20px', maxWidth: 860 }}>
      <div className="page-header">
        <h1 className="page-title">Edit Post</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          {form.is_published && (
            <Link href={`/blog/${form.slug}`} target="_blank" style={{ padding: '10px 16px', background: '#f4f4f4', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#0a0a0a', textDecoration: 'none' }}>
              View Live ↗
            </Link>
          )}
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: '#888' }}>← Back</button>
        </div>
      </div>
      <div className="admin-form-card">
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {['News', 'Review', 'Comparison', 'Buying Guide', 'Tips'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Author</label>
            <input className="form-input" value={form.author || ''} onChange={e => setForm({ ...form, author: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Cover Image URL</label>
          <input className="form-input" value={form.cover_image || ''} onChange={e => setForm({ ...form, cover_image: e.target.value })} />
          {form.cover_image && (
            <img src={form.cover_image} alt="preview" style={{ marginTop: 10, height: 140, width: '100%', objectFit: 'cover', borderRadius: 10 }} onError={e => (e.currentTarget.style.display = 'none')} />
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Excerpt</label>
          <textarea className="form-textarea" rows={2} value={form.excerpt || ''} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Content (HTML)</label>
          <textarea className="form-textarea" rows={14} value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} style={{ fontFamily: 'monospace', fontSize: 13 }} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          <button onClick={() => save()} disabled={loading} style={{ flex: 1, minWidth: 120, padding: 14, background: '#f4f4f4', color: '#0a0a0a', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Save Changes
          </button>
          <button onClick={() => save(!form.is_published)} disabled={loading} className="btn-primary" style={{ flex: 1, minWidth: 120, padding: 14 }}>
            {form.is_published ? 'Unpublish' : 'Publish Now'}
          </button>
        </div>
      </div>
    </div>
  )
}