// "use client"
import Link from 'next/link'
import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'

export default async function Hero() {
  const supabase = createAdminSupabase()
  const { data: topProducts } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('price', { ascending: false })
    .limit(3)

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow">✦ New Arrivals 2025</div>
          <h1 className="hero-title">Marathwada's<br /><em>Premium</em><br />Phone Store</h1>
          <p className="hero-desc">2000+ phones in stock. No Cost EMI. Official warranty. Certified refurbished devices. Same-day delivery across Marathwada.</p>
          <div className="hero-ctas">
            <Link href="/products" className="btn-hero-primary">Shop Now →</Link>
            <Link href="/sell-phone" className="btn-hero-secondary">Sell Your Phone</Link>
          </div>
          <div className="hero-stats">
            {[['2000+', 'Phones in Stock'], ['50K+', 'Happy Customers'], ['15+', 'Years Experience'], ['4.9★', 'Google Rating']].map(([n, l]) => (
              <div key={l}>
                <div className="hero-stat-n">{n}</div>
                <div className="hero-stat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-right" style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', minHeight: 420 }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(https://contentstatic.techgig.com/thumb/msid-108136370,width-800,resizemode-4/Best-smartphones-under-Rs-8000-check-specs-inside.jpg?44244)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 100%)',
          }} />
          <div style={{ position: 'relative', zIndex: 2, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center', height: '100%' }}>
            {topProducts && topProducts.length > 0 ? topProducts.map(p => {
              const discount = p.old_price ? Math.round(((p.old_price - p.price) / p.old_price) * 100) : null
              return (
                <Link href={`/products/${p.slug}`} key={p.id} className="hero-card" style={{ textDecoration: 'none' }}>
                  <img
                    src={p.images?.[0] || '/images/phone-placeholder.png'}
                    alt={p.name}
                    width={72}
                    height={72}
                    style={{ objectFit: 'contain', borderRadius: 8, background: 'rgba(255,255,255,0.06)', padding: 6, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{p.brand}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                      {formatPrice(p.price)}
                      {p.old_price && <del style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>{formatPrice(p.old_price)}</del>}
                    </div>
                  </div>
                  {discount && (
                    <div style={{ marginLeft: 'auto', flexShrink: 0, background: '#c8102e', color: '#fff', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>
                      {discount}% OFF
                    </div>
                  )}
                </Link>
              )
            }) : (
              // Fallback if no products in DB yet
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 14, padding: 40 }}>
                Add products to see them here
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}