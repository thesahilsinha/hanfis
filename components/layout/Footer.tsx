import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="page-inner">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: 18, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
              Hanfi's <span style={{ color: '#c8102e' }}>Collection</span>
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
            <Link href="/products" prefetch={false} className="footer-link">All Phones</Link>
            <Link href="/products?brand=Apple" prefetch={false} className="footer-link">iPhone</Link>
            <Link href="/accessories" prefetch={false} className="footer-link">Accessories</Link>
            <Link href="/products?brand=Samsung" prefetch={false} className="footer-link">Samsung</Link>
            <Link href="/products?brand=OnePlus" prefetch={false} className="footer-link">OnePlus</Link>
            <Link href="/products?brand=Xiaomi" prefetch={false} className="footer-link">Xiaomi</Link>
            <Link href="/buy-used" prefetch={false} className="footer-link">Buy Used Phone</Link>
            <Link href="/sell-phone" prefetch={false} className="footer-link">Sell Your Phone</Link>
          </div>

          <div>
            <div className="footer-col-title">Help</div>
            <Link href="/orders" prefetch={false} className="footer-link">Track Order</Link>
            <Link href="/policies/returns" prefetch={false} className="footer-link">Returns Policy</Link>
            <Link href="/policies/warranty" prefetch={false} className="footer-link">Warranty Info</Link>
            <Link href="/policies/emi" prefetch={false} className="footer-link">EMI Options</Link>
            <Link href="/branches" prefetch={false} className="footer-link">Contact Us</Link>
            <Link href="/branches" prefetch={false} className="footer-link">Branches</Link>
          </div>

          <div>
            <div className="footer-col-title">Contact</div>
            {[
              { text: 'Call: +91 98765 43210', href: 'tel:+919876543210' },
              { text: 'WhatsApp Us', href: 'https://wa.me/919876543210' },
              { text: 'hello@hanfiscollection.com', href: 'mailto:hello@hanfiscollection.com' },
              { text: 'Multiple locations, Marathwada', href: '/branches' },
              { text: '10 AM - 9 PM, All days', href: '#' },
            ].map(c => (
              <a key={c.text} href={c.href} style={{ display: 'block', marginBottom: 10, fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
                {c.text}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">&copy; 2026 Hanfi's Collection. All rights reserved. Built in Marathwada.</div>
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