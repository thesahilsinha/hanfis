export default function AnnouncementBar() {
  const items = ['Free delivery on orders above ₹999', 'No Cost EMI via Bajaj Finance', 'Certified Refurbished Phones up to 60% off', 'Same day delivery in Mumbai', 'Sell your old phone — instant quote', '7-day easy returns', 'Official warranty on all new phones']
  const doubled = [...items, ...items]
  return (
    <div style={{ background: '#0a0a0a', color: '#fff', padding: '10px 0', overflow: 'hidden' }}>
      <div className="announce-track">
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#c8102e', fontSize: 8 }}>✦</span>{item}
          </span>
        ))}
      </div>
    </div>
  )
}