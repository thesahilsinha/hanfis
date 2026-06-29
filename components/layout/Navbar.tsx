'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, MapPin, Phone, Menu, X, Package } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import CartDrawer from '@/components/cart/CartDrawer'

const cats = [
  { label: 'All Phones', href: '/products' },
  { label: 'iPhone', href: '/products?brand=Apple' },
  { label: 'Samsung', href: '/products?brand=Samsung' },
  { label: 'OnePlus', href: '/products?brand=OnePlus' },
  { label: 'Xiaomi', href: '/products?brand=Xiaomi' },
  { label: 'Buy Pre-owned', href: '/buy-used' },
  { label: 'Sell Phone', href: '/sell-phone' },
  { label: 'Branches', href: '/branches' },
  { label: 'Blog', href: '/blog' },
  { label: 'Track Order', href: '/orders' },
  { label: 'Deals', href: '/products?badge=sale', sale: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const count = useCart(s => s.count())

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function doSearch() {
    if (search.trim()) { window.location.href = `/products?q=${search}`; setSearchOpen(false) }
  }

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-top">
          <div className="nav-logo">
            <Link href="/"><img src="/logo.jpg" alt="Hanfi's Collection" /></Link>
          </div>
          <div className="nav-search">
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} placeholder="Search phones, brands, models..." />
            <Search size={16} className="nav-search-icon" />
          </div>
          <div className="nav-actions">
            <Link href="/branches" className="nav-link"><MapPin size={18} /> Branches</Link>
            <Link href="/orders" className="nav-link"><Package size={18} /> Track Order</Link>
            <a href="tel:+919876543210" className="nav-link"><Phone size={18} /> Call Us</a>
            <button className="nav-cart" onClick={() => setCartOpen(true)}>
              <ShoppingCart size={16} />
              <span>Cart</span>
              {count > 0 && <span className="cart-pill">{count}</span>}
            </button>
            <button className="nav-mobile-search-btn" onClick={() => setSearchOpen(!searchOpen)}>
              <Search size={20} />
            </button>
            <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <div className={`mobile-search-bar${searchOpen ? ' open' : ''}`}>
          <div style={{ position: 'relative' }}>
            <input autoFocus={searchOpen} value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} placeholder="Search phones, brands..." />
            <Search size={16} className="nav-search-icon" />
          </div>
        </div>
        <nav className="nav-cats">
          <ul className="nav-cats-inner">
            {cats.map(c => (
              <li key={c.href}>
                <Link href={c.href} className={c.sale ? 'sale' : ''}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="mobile-menu-inner">
          <div className="mobile-menu-label">Menu</div>
          {cats.map(c => (
            <Link key={c.href} href={c.href} className={`mobile-menu-link${c.sale ? ' sale' : ''}`} onClick={() => setMenuOpen(false)}>
              {c.label}
            </Link>
          ))}
          <div className="mobile-menu-actions">
            <a href="tel:+919876543210" className="mobile-menu-btn" style={{ background: '#f4f4f4', color: '#0a0a0a' }}>
              <Phone size={20} /> Call Us
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="mobile-menu-btn" style={{ background: '#25d366', color: '#fff' }}>
              WhatsApp Us
            </a>
            <Link href="/branches" className="mobile-menu-btn" style={{ background: '#f4f4f4', color: '#0a0a0a' }} onClick={() => setMenuOpen(false)}>
              <MapPin size={20} /> Find a Branch
            </Link>
          </div>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}