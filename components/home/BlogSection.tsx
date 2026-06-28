import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  cover_image?: string
  author: string
  category: string
  published_at: string
}

const categoryColors: Record<string, string> = {
  Comparison: '#0071e3', 'Buying Guide': '#c8102e', Tips: '#1a8a4a', News: '#f97316', Review: '#8b5cf6',
}

export default function BlogSection({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null
  const [featured, ...rest] = posts

  return (
    <section className="section" style={{ background: '#f9f9f9' }}>
      <div className="page-inner">
        <div className="section-head">
          <div>
            <div className="section-label">FROM THE BLOG</div>
            <h2 className="section-title">Latest <span>Articles</span></h2>
          </div>
          <Link href="/blog" className="view-all">View All →</Link>
        </div>
        <div className="blog-section-grid">
          <Link href={`/blog/${featured.slug}`} className="blog-featured-card">
            {featured.cover_image && (
              <div style={{ height: 220, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                <img src={featured.cover_image} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
                <span style={{ position: 'absolute', top: 12, left: 12, background: categoryColors[featured.category] || '#0a0a0a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>
                  {featured.category}
                </span>
              </div>
            )}
            <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>
                {new Date(featured.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · By {featured.author}
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(16px,2.5vw,22px)', fontWeight: 800, color: '#0a0a0a', lineHeight: 1.35, marginBottom: 10 }}>{featured.title}</h3>
              <p style={{ fontSize: 13, color: '#4a4a4a', lineHeight: 1.7, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{featured.excerpt}</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 14, color: '#c8102e', fontSize: 13, fontWeight: 700 }}>Read Article →</span>
            </div>
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {rest.slice(0, 2).map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="blog-side-card">
                {post.cover_image && (
                  <div style={{ width: 88, height: 88, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <span style={{ background: categoryColors[post.category] || '#0a0a0a', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 50 }}>{post.category}</span>
                    <span style={{ fontSize: 11, color: '#bbb' }}>{new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h3>
                  <p style={{ fontSize: 11, color: '#888', marginTop: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}