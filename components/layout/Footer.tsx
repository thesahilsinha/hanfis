import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="page-inner">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                Hanfi's <span style={{ color: '#c8102e' }}>Collection</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
              Marathwada's most trusted mobile store. Premium phones, certified refurbished devices, and unbeatable prices since 2010.
            </p>
            <div className="social-row">
              {[
                { l: 'I', href: 'https://instagram.com' },
                { l: 'F', href: 'https://facebook.com' },
                { l: 'Y', href: 'https://youtube.com' },
                { l: 'W', href: 'https://wa.me/919876543210' },
              ].map(s => (
                <a key={s.l} href={s.href} target="_blank" rel="noreferrer" className="social-ic">{s.l}</a>
              ))}
            </div>
          </div>

          <div>
            <div className="footer-col-title">Shop</div>
            <Link href="/products" className="footer-link">All Phones</Link>
            <Link href="/products?brand=Apple" className="footer-link">iPhone</Link>
            <Link href="/products?brand=Samsung" className="footer-link">Samsung</Link>
            <Link href="/products?brand=OnePlus" className="footer-link">OnePlus</Link>
            <Link href="/products?brand=Xiaomi" className="footer-link">Xiaomi</Link>
            <Link href="/buy-used" className="footer-link">Buy Used Phone</Link>
            <Link href="/sell-phone" className="footer-link">Sell Your Phone</Link>
            <Link href="/accessories" className="footer-link">Accessories</Link>
          </div>

          <div>
            <div className="footer-col-title">Help</div>
            <Link href="/orders" className="footer-link">Track Order</Link>
            <Link href="/policies/returns" className="footer-link">Returns Policy</Link>
            <Link href="/policies/warranty" className="footer-link">Warranty Info</Link>
            <Link href="/policies/emi" className="footer-link">EMI Options</Link>
            <Link href="/branches" className="footer-link">Contact Us</Link>
            <Link href="/branches" className="footer-link">Branches</Link>
          </div>

          <div>
            <div className="footer-col-title">Contact</div>
            {[
              { icon: '📞', text: '+91 98765 43210', href: 'tel:+919876543210' },
              { icon: '💬', text: 'WhatsApp Us', href: 'https://wa.me/919876543210' },
              { icon: '📧', text: 'hello@hanfiscollection.com', href: 'mailto:hello@hanfiscollection.com' },
              { icon: '📍', text: 'Multiple locations, Marathwada', href: '/branches' },
              { icon: '🕐', text: '10 AM – 9 PM, All days', href: '#' },
            ].map(c => (
              <a key={c.text} href={c.href} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
                <span>{c.icon}</span><span>{c.text}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">© 2025 Hanfi's Collection. All rights reserved. Built with ❤️ in Marathwada.</div>
          <div className="pay-badges">
            {['UPI', 'Visa', 'Mastercard', 'Bajaj Finance', 'Net Banking', 'Cash on Delivery'].map(p => (
              <div key={p} className="pay-badge">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}