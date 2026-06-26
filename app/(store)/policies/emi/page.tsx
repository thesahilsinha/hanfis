export default function EMIOptions() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 800, marginBottom: 8 }}>EMI Options</h1>
      <p style={{ color: '#888', marginBottom: 40 }}>Buy now, pay in easy installments</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 48 }}>
        {[
          { name: 'Bajaj Finance', desc: 'No Cost EMI, instant approval, 3-24 months', color: '#0071e3' },
          { name: 'HDFC Bank', desc: 'Credit & Debit card EMI, 3-24 months', color: '#004c8f' },
          { name: 'ICICI Bank', desc: 'Credit card EMI, 3-18 months', color: '#f58220' },
          { name: 'SBI Card', desc: 'Credit card EMI, 3-12 months', color: '#22409a' },
          { name: 'Axis Bank', desc: 'Credit card EMI, 3-18 months', color: '#97144d' },
          { name: 'Kotak Bank', desc: 'Credit card EMI, 3-12 months', color: '#ef3e42' },
        ].map(e => (
          <div key={e.name} style={{ background: '#f9f9f9', borderRadius: 16, padding: 24, borderLeft: `4px solid ${e.color}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{e.name}</div>
            <div style={{ fontSize: 13, color: '#666' }}>{e.desc}</div>
          </div>
        ))}
      </div>
      {[
        { title: 'No Cost EMI — What does it mean?', body: 'No Cost EMI means you pay exactly the price of the phone split into equal monthly installments with zero interest. There are no hidden charges or processing fees. Available on phones above ₹5,000 via Bajaj Finance.' },
        { title: 'How to Avail EMI', body: 'Visit any of our branches with your Bajaj Finance card or any bank credit card. Our staff will process the EMI on the spot in under 5 minutes. You can also call us to check eligibility before visiting.' },
        { title: 'EMI Tenure Options', body: 'We offer flexible EMI tenures of 3, 6, 9, 12, 18, and 24 months. The longer the tenure, the smaller the monthly payment. Use our EMI calculator on the home page to calculate your monthly installment.' },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{s.title}</h2>
          <p style={{ fontSize: 15, color: '#4a4a4a', lineHeight: 1.8 }}>{s.body}</p>
        </div>
      ))}
      <div style={{ background: '#0a0a0a', borderRadius: 16, padding: 24, marginTop: 40, color: '#fff' }}>
        <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Questions about EMI?</p>
        <a href="https://wa.me/919876543210" style={{ color: '#25d366', fontWeight: 700 }}>💬 WhatsApp us at +91 98765 43210</a>
      </div>
    </div>
  )
}