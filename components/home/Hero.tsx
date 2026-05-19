import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow">✦ New Arrivals 2025</div>
          <h1 className="hero-title">Mumbai's<br /><em>Premium</em><br />Phone Store</h1>
          <p className="hero-desc">2000+ phones in stock. No Cost EMI. Official warranty. Certified refurbished devices. Same-day delivery across Mumbai.</p>
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
        <div className="hero-right">
          {[
            { brand: 'APPLE', name: 'iPhone 16 Pro Max', price: '₹1,44,900', old: '₹1,59,900', badge: '9% OFF', img: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=200&hei=200&fmt=jpeg&qlt=95' },
            { brand: 'SAMSUNG', name: 'Galaxy S25 Ultra', price: '₹1,29,999', old: '₹1,49,999', badge: '13% OFF', img: 'https://images.samsung.com/is/image/samsung/p6pim/in/2501/gallery/in-galaxy-s25-ultra-s938-sm-s938bztqins-thumb-542931753' },
            { brand: 'ONEPLUS', name: 'OnePlus 13', price: '₹69,999', old: '₹79,999', badge: '12% OFF', img: 'https://image01.oneplus.net/epfront/media/wysiwyg/2024/OnePlus_13/specifications/colorways-black.png' },
          ].map(c => (
            <div key={c.name} className="hero-card">
              <img src={c.img} alt={c.name} width={72} height={72} style={{ objectFit: 'contain', borderRadius: 8, background: 'rgba(255,255,255,0.06)', padding: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{c.brand}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{c.price} <del style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>{c.old}</del></div>
              </div>
              <div style={{ marginLeft: 'auto', flexShrink: 0, background: '#c8102e', color: '#fff', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>{c.badge}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}