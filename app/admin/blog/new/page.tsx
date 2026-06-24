'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewBlogPost() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', cover_image: '', author: "Hanfi's Team", category: 'News', is_published: false })
  const [loading, setLoading] = useState(false)

  async function save(publish = false) {
    if (!form.title) return alert('Title is required')
    setLoading(true)
    await fetch('/api/blog', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, is_published: publish, published_at: publish ? new Date().toISOString() : null })
    })
    setLoading(false)
    router.push('/admin/blog')
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 860 }}>
      <div className="page-header">
        <h1 className="page-title">New Blog Post</h1>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: '#888' }}>← Back</button>
      </div>
      <div className="admin-form-card">
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. iPhone 16 Pro Max Review" />
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
            <input className="form-input" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Cover Image URL</label>
          <input className="form-input" value={form.cover_image} onChange={e => setForm({ ...form, cover_image: e.target.value })} placeholder="https://images.unsplash.com/..." />
          {form.cover_image && <img src={form.cover_image} alt="preview" style={{ marginTop: 10, height: 140, width: '100%', objectFit: 'cover', borderRadius: 10 }} onError={e => (e.currentTarget.style.display = 'none')} />}
        </div>
        <div className="form-group">
          <label className="form-label">Excerpt (short summary)</label>
          <textarea className="form-textarea" rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description shown on blog listing page..." />
        </div>
        <div className="form-group">
          <label className="form-label">Content (HTML supported)</label>
          <textarea className="form-textarea" rows={14} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder={'<p>Write your article here...</p>\n<h2>Section Title</h2>\n<p>More content...</p>'} style={{ fontFamily: 'monospace', fontSize: 13 }} />
          <p style={{ fontSize: 11, color: '#888', marginTop: 6 }}>You can use HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;</p>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button onClick={() => save(false)} disabled={loading} style={{ flex: 1, padding: 14, background: '#f4f4f4', color: '#0a0a0a', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Save as Draft
          </button>
          <button onClick={() => save(true)} disabled={loading} className="btn-primary" style={{ flex: 1, padding: 14 }}>
            {loading ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </div>
    </div>
  )
}