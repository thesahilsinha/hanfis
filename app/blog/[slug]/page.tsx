import { createAdminSupabase } from '@/lib/supabase-server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = createAdminSupabase()
  const { slug } = await params
  const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('is_published', true).single()
  if (!post) return notFound()

  const { data: related } = await supabase.from('blog_posts').select('id,title,slug,cover_image,category,published_at').eq('is_published', true).eq('category', post.category).neq('id', post.id).limit(2)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
      <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#c8102e', fontWeight: 600, fontSize: 14, marginBottom: 32 }}>
        ← Back to Blog
      </Link>
      <article>
        {post.cover_image && (
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 36, height: 400 }}>
            <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ background: '#c8102e', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 50 }}>{post.category}</span>
          <span style={{ fontSize: 13, color: '#888' }}>{new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span style={{ fontSize: 13, color: '#888' }}>By {post.author}</span>
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, lineHeight: 1.25, marginBottom: 24, color: '#0a0a0a' }}>{post.title}</h1>
        {post.excerpt && (
          <p style={{ fontSize: 18, color: '#4a4a4a', lineHeight: 1.7, marginBottom: 32, padding: '20px 24px', background: '#f9f9f9', borderRadius: 14, borderLeft: '4px solid #c8102e', fontStyle: 'italic' }}>
            {post.excerpt}
          </p>
        )}
        {post.content
          ? <div style={{ fontSize: 16, color: '#333', lineHeight: 1.85 }} dangerouslySetInnerHTML={{ __html: post.content }} />
          : <p style={{ fontSize: 16, color: '#555', lineHeight: 1.85 }}>{post.excerpt}</p>}
      </article>
      {related && related.length > 0 && (
        <div style={{ marginTop: 64, paddingTop: 48, borderTop: '1px solid #e8e8e8' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Related Articles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
            {related.map(r => (
              <Link key={r.id} href={`/blog/${r.slug}`} style={{ textDecoration: 'none', background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1.5px solid #e8e8e8' }}>
                {r.cover_image && <img src={r.cover_image} alt={r.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />}
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{new Date(r.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a', lineHeight: 1.4 }}>{r.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}