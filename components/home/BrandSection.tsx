import Link from 'next/link'

const brands = [
  { name: 'Apple', href: '/products?brand=Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Samsung', href: '/products?brand=Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'OnePlus', href: '/products?brand=OnePlus', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/OnePlus_logo.svg/512px-OnePlus_logo.svg.png' },
  { name: 'Xiaomi', href: '/products?brand=Xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg' },
  { name: 'Vivo', href: '/products?brand=Vivo', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Vivo_logo.png' },
  { name: 'OPPO', href: '/products?brand=OPPO', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/OPPO_LOGO_2019.svg' },
  { name: 'Realme', href: '/products?brand=Realme', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Realme_logo.svg/512px-Realme_logo.svg.png' },
  { name: 'Motorola', href: '/products?brand=Motorola', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Motorola_logo_2014.svg/512px-Motorola_logo_2014.svg.png' },
  { name: 'Nokia', href: '/products?brand=Nokia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nokia_wordmark.svg/512px-Nokia_wordmark.svg.png' },
  { name: 'Google', href: '/products?brand=Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/512px-Google_2015_logo.svg.png' },
  { name: 'iQOO', href: '/products?brand=iQOO', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/IQoo_logo.png/512px-IQoo_logo.png' },
  { name: 'Nothing', href: '/products?brand=Nothing', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Nothing_Technology_logo.svg/512px-Nothing_Technology_logo.svg.png' },
]

export default function BrandSection() {
  return (
    <section className="section" style={{ background: '#f9f9f9' }}>
      <div className="page-inner">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>OFFICIAL AUTHORISED DEALER</div>
        </div>
        <div className="brands-grid">
          {brands.map(b => (
            <Link key={b.name} href={b.href} className="brand-card" style={{ textDecoration: 'none' }}>
              <img src={b.logo} alt={b.name} style={{ height: 36, objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.6, maxWidth: '100%' }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}