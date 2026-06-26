'use client'
import { useState } from 'react'
import Link from 'next/link'

const cats = [
  { label: 'All Phones', href: '/products' },
  { label: 'iPhone', href: '/products?brand=Apple' },
  { label: 'Samsung', href: '/products?brand=Samsung' },
  { label: 'OnePlus', href: '/products?brand=OnePlus' },
  { label: 'Xiaomi', href: '/products?brand=Xiaomi' },
  { label: 'Vivo', href: '/products?brand=Vivo' },
  { label: 'OPPO', href: '/products?brand=OPPO' },
  { label: 'Realme', href: '/products?brand=Realme' },
  { label: 'Motorola', href: '/products?brand=Motorola' },
  { label: 'Nokia', href: '/products?brand=Nokia' },
  { label: 'Under 20K', href: '/products?max=20000' },
  { label: 'Under 50K', href: '/products?max=50000' },
  { label: 'Refurbished', href: '/buy-used' },
]

export default function CategoryPills() {
  const [active, setActive] = useState(0)
  return (
    <section className="cats-section">
      <div className="page-inner">
        <div className="cats-scroll">
          {cats.map((c, i) => (
            <Link key={c.label} href={c.href} onClick={() => setActive(i)} className={`cat-pill${active === i ? ' active' : ''}`}>
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}