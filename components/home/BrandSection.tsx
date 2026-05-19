export default function BrandSection() {
  const brands = [
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
    { name: 'OnePlus', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/OnePlus_logo.svg/512px-OnePlus_logo.svg.png' },
    { name: 'Xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg' },
    { name: 'Vivo', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Vivo_logo.png' },
    { name: 'OPPO', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/OPPO_LOGO_2019.svg' },
  ]
  return (
    <section className="section" style={{ background: '#f9f9f9' }}>
      <div className="page-inner">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>OFFICIAL AUTHORISED DEALER</div>
        </div>
        <div className="brands-grid">
          {brands.map(b => (
            <div key={b.name} className="brand-card">
              <img src={b.logo} alt={b.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}