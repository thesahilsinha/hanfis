export default function WarrantyPolicy() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 800, marginBottom: 8 }}>Warranty Information</h1>
      <p style={{ color: '#888', marginBottom: 40 }}>Last updated: January 2025</p>
      {[
        { title: 'New Phones — Manufacturer Warranty', body: 'All new phones sold at Hanfi\'s Collection come with the full manufacturer\'s warranty. Apple products carry a 1-year warranty. Samsung, OnePlus, Xiaomi and other brands carry a 1-year manufacturer warranty. Warranty claims can be made at any authorized service center.' },
        { title: 'Certified Refurbished — 6 Month Warranty', body: 'All certified refurbished phones from Hanfi\'s Collection carry a 6-month warranty against manufacturing defects. This covers battery issues, display defects, camera malfunctions, and charging port problems.' },
        { title: 'What is Covered', body: 'Manufacturing defects, hardware failures, battery degradation below 80% within warranty period, display issues not caused by physical damage, and software issues are all covered under warranty.' },
        { title: 'What is Not Covered', body: 'Physical damage including cracked screens and dents, water damage, unauthorized repairs or modifications, damage from improper use, and accessories are not covered under warranty.' },
        { title: 'How to Claim Warranty', body: 'Contact us via WhatsApp at +91 98765 43210 with your order number and description of the issue. For manufacturer warranty, we will guide you to the nearest authorized service center. For refurbished phone warranty, bring the device to any of our branches.' },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{s.title}</h2>
          <p style={{ fontSize: 15, color: '#4a4a4a', lineHeight: 1.8 }}>{s.body}</p>
        </div>
      ))}
      <div style={{ background: '#f9f9f9', borderRadius: 16, padding: 24, marginTop: 40 }}>
        <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Warranty claim support</p>
        <a href="https://wa.me/919876543210" style={{ color: '#25d366', fontWeight: 700 }}>💬 WhatsApp us at +91 98765 43210</a>
      </div>
    </div>
  )
}