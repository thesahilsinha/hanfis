'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, MapPin, Phone, Menu, X, ChevronDown } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import CartDrawer from '@/components/cart/CartDrawer'

const brands = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'OPPO', 'Realme', 'Motorola', 'Nothing', 'iQOO', 'Nokia', 'Google', 'Infinix', 'Poco']

const cats = [
  { label: 'All Phones', href: '/products', sale: false },
  { label: 'Accessories', href: '/accessories', sale: false },
  { label: 'Buy Used', href: '/buy-used', sale: false },
  { label: 'Sell Phone', href: '/sell-phone', sale: false },
  { label: 'Branches', href: '/branches', sale: false },
  { label: 'Blog', href: '/blog', sale: false },
  { label: 'Track Order', href: '/orders', sale: false },
  { label: 'Deals', href: '/products?badge=sale', sale: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [brandOpen, setBrandOpen] = useState(false)
  const [mobileBrandOpen, setMobileBrandOpen] = useState(false)
  const [search, setSearch] = useState('')
  const count = useCart(s => s.count())
  const brandRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) setBrandOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function doSearch() {
    if (search.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(search.trim())}`
      setSearchOpen(false)
    }
  }

  return (
    <>
      <style>{`
        .brand-dropdown { position: absolute; top: calc(100% + 8px); left: 0; background: #fff; border: 1.5px solid #e8e8e8; border-radius: 16px; box-shadow: 0 16px 48px rgba(0,0,0,0.12); padding: 12px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; min-width: 320px; z-index: 9999; }
        .brand-item { display: flex; align-items: center; justify-content: center; padding: 10px 8px; border-radius: 10px; text-decoration: none; color: #0a0a0a; font-size: 13px; font-weight: 600; transition: all .15s; }
        .brand-item:hover { background: #f4f4f4; color: #c8102e; }
        .brand-trigger { display: flex; align-items: center; gap: 4px; padding: 11px 16px; font-size: 13px; font-weight: 500; color: #4a4a4a; border: none; border-bottom: 2px solid transparent; background: none; cursor: pointer; font-family: inherit; white-space: nowrap; }
        .brand-trigger:hover, .brand-trigger.open { color: #0a0a0a; border-bottom-color: #0a0a0a; }
        .brand-trigger svg { transition: transform .2s; }
        .brand-trigger.open svg { transform: rotate(180deg); }
      `}</style>

      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-top">
          <div className="nav-logo">
            <Link href="/" prefetch={false}><img src="/logo.jpg" alt="Hanfi's Collection" /></Link>
          </div>
          <div className="nav-search">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="Search phones, brands, models..."
            />
            <Search size={16} className="nav-search-icon" />
          </div>
          <div className="nav-actions">
            <Link href="/branches" prefetch={false} className="nav-link"><MapPin size={18} /> Branches</Link>
            <Link href="/orders" prefetch={false} className="nav-link">Track</Link>
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
            <input
              autoFocus={searchOpen}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="Search phones, brands..."
            />
            <Search size={16} className="nav-search-icon" />
          </div>
        </div>

        <nav className="nav-cats">
          <ul className="nav-cats-inner">
            <li style={{ position: 'relative' }} ref={brandRef}>
              <button className={`brand-trigger${brandOpen ? ' open' : ''}`} onClick={() => setBrandOpen(!brandOpen)}>
                Brands <ChevronDown size={13} />
              </button>
              {brandOpen && (
                <div className="brand-dropdown">
                  {brands.map(b => (
                    <Link key={b} href={`/products?brand=${b}`} prefetch={false} className="brand-item" onClick={() => setBrandOpen(false)}>
                      {b}
                    </Link>
                  ))}
                  <Link href="/products" prefetch={false} className="brand-item" onClick={() => setBrandOpen(false)}
                    style={{ gridColumn: '1 / -1', background: '#f9f9f9', marginTop: 4 }}>
                    View All Phones
                  </Link>
                </div>
              )}
            </li>
            {cats.map(c => (
              <li key={c.href}>
                <Link href={c.href} prefetch={false} className={c.sale ? 'sale' : ''}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="mobile-menu-inner">
          <button
            onClick={() => setMobileBrandOpen(!mobileBrandOpen)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 0', fontSize: 16, fontWeight: 600, color: '#0a0a0a', background: 'none', border: 'none', borderBottom: '1px solid #f4f4f4', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <span>Brands</span>
            <ChevronDown size={18} style={{ transform: mobileBrandOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', color: '#888' }} />
          </button>
          {mobileBrandOpen && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '12px 0', borderBottom: '1px solid #f4f4f4' }}>
              {brands.map(b => (
                <Link key={b} href={`/products?brand=${b}`} prefetch={false} onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 8px', borderRadius: 10, background: '#f9f9f9', textDecoration: 'none', color: '#0a0a0a', fontSize: 12, fontWeight: 600 }}>
                  {b}
                </Link>
              ))}
            </div>
          )}

          <div className="mobile-menu-label" style={{ marginTop: 16 }}>Menu</div>
          {cats.map(c => (
            <Link key={c.href} href={c.href} prefetch={false} className={`mobile-menu-link${c.sale ? ' sale' : ''}`} onClick={() => setMenuOpen(false)}>
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
            <Link href="/branches" prefetch={false} className="mobile-menu-btn" style={{ background: '#f4f4f4', color: '#0a0a0a' }} onClick={() => setMenuOpen(false)}>
              <MapPin size={20} /> Find a Branch
            </Link>
          </div>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}