'use client'
import { useRouter } from 'next/navigation'

export default function BlogAdminActions({ post }: { post: any }) {
  const router = useRouter()

  async function togglePublish() {
    await fetch(`/api/blog/${post.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !post.is_published, published_at: !post.is_published ? new Date().toISOString() : null })
    })
    router.refresh()
  }

  async function deletePost() {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/blog/${post.id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button onClick={togglePublish}
        style={{ padding: '5px 10px', background: post.is_published ? '#fef3c7' : '#dcfce7', color: post.is_published ? '#92400e' : '#166534', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
        {post.is_published ? 'Unpublish' : 'Publish'}
      </button>
      <button onClick={deletePost} className="btn-danger" style={{ padding: '5px 10px', fontSize: 11 }}>Del</button>
    </div>
  )
}