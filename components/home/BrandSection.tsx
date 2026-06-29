"use client"
import Link from 'next/link'

const brands = [
  { name: 'Apple', href: '/products?brand=Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Samsung', href: '/products?brand=Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Samsung_Orig_Wordmark_BLACK_RGB.png/960px-Samsung_Orig_Wordmark_BLACK_RGB.png' },
  { name: 'OnePlus', href: '/products?brand=OnePlus', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Logo_entreprise_OnePlus.png/960px-Logo_entreprise_OnePlus.png' },
  { name: 'Xiaomi', href: '/products?brand=Xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg' },
  { name: 'Vivo', href: '/products?brand=Vivo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Vivo_mobile_logo.png/960px-Vivo_mobile_logo.png' },
  { name: 'OPPO', href: '/products?brand=OPPO', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/OPPO_LOGO.jpg/960px-OPPO_LOGO.jpg' },
  { name: 'Realme', href: '/products?brand=Realme', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Realme-realme-_logo_box-RGB-01.svg/960px-Realme-realme-_logo_box-RGB-01.svg.png' },
  { name: 'Motorola', href: '/products?brand=Motorola', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Motorola-logo-black-and-white.png/960px-Motorola-logo-black-and-white.png' },
  { name: 'Nokia', href: '/products?brand=Nokia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Nokia_2023.svg/960px-Nokia_2023.svg.png' },
  { name: 'Google', href: '/products?brand=Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/960px-Google_2015_logo.svg.png' },
  { name: 'iQOO', href: '/products?brand=iQOO', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/IQOO_logo.svg/960px-IQOO_logo.svg.png' },
  { name: 'Nothing', href: '/products?brand=Nothing', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Nothing_Tech.jpg/960px-Nothing_Tech.jpg' },
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