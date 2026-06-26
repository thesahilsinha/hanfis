import { createAdminSupabase } from '@/lib/supabase-server'
import Link from 'next/link'

const categoryColors: Record<string, string> = {
  Comparison: '#0071e3', 'Buying Guide': '#c8102e', Tips: '#1a8a4a', News: '#f97316', Review: '#8b5cf6',
}

export default async function BlogPage() {
  const supabase = createAdminSupabase()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <>
      <style>{`
        .blog-card { transition: all .25s; }
        .blog-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); border-color: transparent !important; }
        .blog-card img { transition: transform .4s; }
        .blog-card:hover img { transform: scale(1.05); }
      `}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>OUR BLOG</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, marginBottom: 12 }}>Tips, Guides & News</h1>
          <p style={{ color: '#888', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>Phone buying guides, comparisons, and the latest from the mobile world.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {(posts || []).map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card" style={{ textDecoration: 'none', background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #e8e8e8', display: 'flex', flexDirection: 'column' }}>
              {post.cover_image && (
                <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                  <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: 12, left: 12, background: categoryColors[post.category] || '#0a0a0a', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 50 }}>
                    {post.category}
                  </span>
                </div>
              )}
              <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>
                  {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · By {post.author}
                </div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 18, color: '#0a0a0a', lineHeight: 1.4, marginBottom: 8 }}>{post.title}</h2>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, color: '#c8102e', fontSize: 13, fontWeight: 700 }}>Read Article →</span>
              </div>
            </Link>
          ))}
          {!posts?.length && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: '#888' }}>No posts yet. Add some from the admin panel.</div>
          )}
        </div>
      </div>
    </>
  )
}