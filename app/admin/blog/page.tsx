export const revalidate = 0

import { createAdminSupabase } from '@/lib/supabase-server'
import Link from 'next/link'
import BlogAdminActions from './BlogAdminActions'

interface BlogPost {
  id: string
  title: string
  slug: string
  cover_image?: string
  category: string
  author: string
  is_published: boolean
  created_at: string
}

export default async function AdminBlog() {
  const supabase = createAdminSupabase()
  const { data: posts } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Blog Posts ({posts?.length || 0})</h1>
        <Link href="/admin/blog/new" className="btn-primary">+ New Post</Link>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>{['Cover', 'Title', 'Category', 'Author', 'Status', 'Date', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {posts?.map((p: BlogPost) => (
                <tr key={p.id}>
                  <td>
                    {p.cover_image
                      ? <img src={p.cover_image} alt="" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                      : <div style={{ width: 56, height: 40, background: '#f4f4f4', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📝</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{p.slug}</div>
                  </td>
                  <td><span className="badge-status" style={{ background: '#f4f4f4', color: '#0a0a0a' }}>{p.category}</span></td>
                  <td style={{ fontSize: 13 }}>{p.author}</td>
                  <td>
                    <span className="badge-status" style={{ background: p.is_published ? '#dcfce7' : '#fef3c7', color: p.is_published ? '#166534' : '#92400e' }}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ color: '#888', fontSize: 12 }}>{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Link href={`/admin/blog/${p.id}`} style={{ color: '#0071e3', fontWeight: 600, fontSize: 13 }}>Edit</Link>
                      {p.is_published && <Link href={`/blog/${p.slug}`} target="_blank" style={{ color: '#888', fontWeight: 600, fontSize: 13 }}>View</Link>}
                      <BlogAdminActions post={p} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}