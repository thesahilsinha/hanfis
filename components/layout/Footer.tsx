import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="page-inner">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: 18 }}>
              <img src="/logo.jpg" alt="Hanfi's Collection" style={{ height: 44, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
              Mumbai's most trusted mobile store. Premium phones, certified refurbished devices, and unbeatable prices since 2010.
            </p>
            <div className="social-row">
              {['I', 'F', 'Y', 'W'].map((s, i) => <div key={i} className="social-ic">{s}</div>)}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Shop</div>
            {[['All Phones', '/products'], ['iPhone', '/products?brand=Apple'], ['Samsung', '/products?brand=Samsung'], ['Buy Used Phone', '/buy-used'], ['Sell Your Phone', '/sell-phone']].map(([l, h]) => (
              <Link key={l} href={h} className="footer-link">{l}</Link>
            ))}
          </div>
          <div>
            <div className="footer-col-title">Help</div>
            {[['Track Order', '/orders'], ['Returns Policy', '/'], ['Warranty Info', '/'], ['EMI Options', '/'], ['Contact Us', '/branches'], ['Branches', '/branches']].map(([l, h]) => (
              <Link key={l} href={h} className="footer-link">{l}</Link>
            ))}
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            {[['📞', '+91 98765 43210'], ['💬', 'WhatsApp: +91 98765 43210'], ['📧', 'hello@hanfiscollection.com'], ['📍', 'Multiple locations, Mumbai'], ['🕐', '10 AM – 9 PM, All days']].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2025 Hanfi's Collection. All rights reserved. Built with ❤️ in Mumbai.</div>
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