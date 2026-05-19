'use client'
import { useState } from 'react'
import Link from 'next/link'

const cats = [
  { label: 'All Phones', href: '/products', emoji: '📱' },
  { label: 'iPhone', href: '/products?brand=Apple', emoji: '🍎' },
  { label: 'Samsung', href: '/products?brand=Samsung', emoji: '💫' },
  { label: 'OnePlus', href: '/products?brand=OnePlus', emoji: '🔴' },
  { label: 'Xiaomi', href: '/products?brand=Xiaomi', emoji: '⚡' },
  { label: 'Vivo', href: '/products?brand=Vivo', emoji: '📷' },
  { label: 'OPPO', href: '/products?brand=OPPO', emoji: '🌸' },
  { label: 'Realme', href: '/products?brand=Realme', emoji: '🎯' },
  { label: 'Under ₹20K', href: '/products?max=20000', emoji: '💰' },
  { label: 'Under ₹50K', href: '/products?max=50000', emoji: '🏷️' },
  { label: 'Refurbished', href: '/buy-used', emoji: '♻️' },
]

export default function CategoryPills() {
  const [active, setActive] = useState(0)
  return (
    <section className="cats-section">
      <div className="page-inner">
        <div className="cats-scroll">
          {cats.map((c, i) => (
            <Link key={c.label} href={c.href} onClick={() => setActive(i)} className={`cat-pill${active === i ? ' active' : ''}`}>
              <span style={{ fontSize: 18 }}>{c.emoji}</span>
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}