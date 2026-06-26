export default function ReturnsPolicy() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 800, marginBottom: 8 }}>Returns Policy</h1>
      <p style={{ color: '#888', marginBottom: 40 }}>Last updated: January 2025</p>
      {[
        { title: '7-Day Return Policy', body: 'We offer a hassle-free 7-day return policy on all new phones purchased from Hanfi\'s Collection. If you are not satisfied with your purchase, you can return it within 7 days of delivery for a full refund or exchange.' },
        { title: 'Conditions for Return', body: 'The phone must be in its original condition with all accessories and packaging. The device should not have any physical damage, scratches, or water damage. The IMEI number must match the original invoice.' },
        { title: 'How to Initiate a Return', body: 'WhatsApp us at +91 98765 43210 with your order number and reason for return. Our team will arrange a free pickup from your location within 24 hours. Refund will be processed within 3-5 business days after we receive the device.' },
        { title: 'Refurbished Phones', body: 'Certified refurbished phones also come with a 7-day return policy. Additionally, all refurbished phones have a 6-month warranty against manufacturing defects.' },
        { title: 'Non-Returnable Items', body: 'Accessories such as cases, screen protectors, and earphones cannot be returned once opened. Phones with physical damage or water damage are not eligible for return.' },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#0a0a0a' }}>{s.title}</h2>
          <p style={{ fontSize: 15, color: '#4a4a4a', lineHeight: 1.8 }}>{s.body}</p>
        </div>
      ))}
      <div style={{ background: '#f9f9f9', borderRadius: 16, padding: 24, marginTop: 40 }}>
        <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Need help with a return?</p>
        <a href="https://wa.me/919876543210" style={{ color: '#25d366', fontWeight: 700 }}>💬 WhatsApp us at +91 98765 43210</a>
      </div>
    </div>
  )
}