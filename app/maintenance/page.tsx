export default function MaintenancePage({
  searchParams
}: {
  searchParams: { msg?: string }
}) {
  const message = searchParams?.msg || "We are upgrading our store to serve you better. We'll be back shortly!"

  return (
    <html lang="en">
      <head>
        <title>Hanfi's Collection — Coming Back Soon</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,16,46,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,16,46,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '32px 24px', maxWidth: 560, width: '100%' }}>

          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              Hanfi's <span style={{ color: '#c8102e' }}>Collection</span>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(200,16,46,0.15)', border: '1px solid rgba(200,16,46,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 36 }}>
              🔧
            </div>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, color: '#fff', margin: '0 0 16px', lineHeight: 1.15 }}>
            We'll Be Back<br />
            <em style={{ fontStyle: 'normal', color: '#c8102e' }}>Very Soon</em>
          </h1>

          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 40px', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
            {message}
          </p>

          <div style={{ width: 48, height: 2, background: '#c8102e', margin: '0 auto 40px', borderRadius: 2 }} />

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#25d366', color: '#fff', borderRadius: 50, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              WhatsApp Us
            </a>
            <a href="tel:+919876543210"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: 50, fontSize: 14, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
              📞 Call Us
            </a>
          </div>

          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            {['🚚 Fast Delivery', '✅ Genuine Products', '💳 No Cost EMI', '↩️ 7-Day Returns'].map(f => (
              <span key={f} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{f}</span>
            ))}
          </div>

          <a href="/admin" style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', textDecoration: 'none' }}>
            Admin →
          </a>
        </div>
      </body>
    </html>
  )
}