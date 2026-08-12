'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, MapPin, Phone, Menu, X, ChevronDown } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import CartDrawer from '@/components/cart/CartDrawer'

const brands = [
  { name: 'Apple', emoji: '' },
  { name: 'Samsung', emoji: '' },
  { name: 'OnePlus', emoji: '' },
  { name: 'Xiaomi', emoji: '' },
  { name: 'Vivo', emoji: '' },
  { name: 'OPPO', emoji: '' },
  { name: 'Realme', emoji: '' },
  { name: 'Motorola', emoji: '〽' },
  { name: 'Nothing', emoji: '' },
  { name: 'iQOO', emoji: '' },
  { name: 'Nokia', emoji: '' },
  { name: 'Google', emoji: '' },
  { name: 'Infinix', emoji: '' },
  { name: 'Poco', emoji: '' },
]

const cats = [
  { label: 'All Phones', href: '/products' },
  { label: 'Accessories', href: '/accessories' },
  { label: 'Buy Used', href: '/buy-used' },
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
  const [brandOpen, setBrandOpen] = useState(false)
  const [mobileBrandOpen, setMobileBrandOpen] = useState(false)
  const [search, setSearch] = useState('')
  const count = useCart(s => s.count())
  const brandRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setBrandOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function doSearch() {
    if (search.trim()) {
      window.location.href = `/products?q=${search}`
      setSearchOpen(false)
    }
  }

  return (
    <>
      <style>{`
        .brand-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          border: 1.5px solid #e8e8e8;
          border-radius: 16px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.12);
          padding: 12px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          min-width: 340px;
          z-index: 9999;
          animation: dropIn .18s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .brand-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 8px;
          border-radius: 10px;
          text-decoration: none;
          color: #0a0a0a;
          font-size: 12px;
          font-weight: 600;
          transition: all .15s;
          cursor: pointer;
          border: none;
          background: none;
          font-family: inherit;
        }
        .brand-item:hover {
          background: #f4f4f4;
          color: #c8102e;
        }
        .brand-item-emoji {
          font-size: 20px;
          line-height: 1;
        }
        .brand-trigger {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #4a4a4a;
          border-bottom: 2px solid transparent;
          transition: all .15s;
          white-space: nowrap;
          cursor: pointer;
          background: none;
          border-top: none;
          border-left: none;
          border-right: none;
          font-family: inherit;
        }
        .brand-trigger:hover, .brand-trigger.open {
          color: #0a0a0a;
          border-bottom-color: #0a0a0a;
        }
        .brand-trigger svg {
          transition: transform .2s;
        }
        .brand-trigger.open svg {
          transform: rotate(180deg);
        }
      `}</style>

      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-top">
          <div className="nav-logo">
            <Link href="/"><img src="/logo.jpg" alt="Hanfi's Collection" /></Link>
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
            <Link href="/branches" className="nav-link"><MapPin size={18} /> Branches</Link>
            <Link href="/orders" className="nav-link"><span>📦</span> Track</Link>
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

        {/* Mobile search bar */}
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

        {/* Desktop category bar */}
        <nav className="nav-cats">
          <ul className="nav-cats-inner">
            {/* Brands dropdown */}
            <li style={{ position: 'relative' }} ref={brandRef}>
              <button
                className={`brand-trigger${brandOpen ? ' open' : ''}`}
                onClick={() => setBrandOpen(!brandOpen)}
              >
                Brands <ChevronDown size={13} />
              </button>
              {brandOpen && (
                <div className="brand-dropdown">
                  {brands.map(b => (
                    <Link
                      key={b.name}
                      href={`/products?brand=${b.name}`}
                      className="brand-item"
                      onClick={() => setBrandOpen(false)}
                    >
                      <span className="brand-item-emoji">{b.emoji}</span>
                      <span>{b.name}</span>
                    </Link>
                  ))}
                  <Link
                    href="/products"
                    className="brand-item"
                    onClick={() => setBrandOpen(false)}
                    style={{ gridColumn: '1 / -1', flexDirection: 'row', gap: 6, justifyContent: 'center', background: '#f9f9f9', marginTop: 4 }}
                  >
                    <span>📱</span>
                    <span>View All Phones</span>
                  </Link>
                </div>
              )}
            </li>

            {cats.map(c => (
              <li key={c.href}>
                <Link href={c.href} className={c.sale ? 'sale' : ''}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="mobile-menu-inner">

          {/* Brands section */}
          <div style={{ marginBottom: 8 }}>
            <button
              onClick={() => setMobileBrandOpen(!mobileBrandOpen)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 0', borderBottom: '1px solid #f4f4f4', fontSize: 16, fontWeight: 600, color: '#0a0a0a', background: 'none', border: 'none', borderBottom: '1px solid #f4f4f4', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span>Brands</span>
              <ChevronDown size={18} style={{ transform: mobileBrandOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', color: '#888' }} />
            </button>
            {mobileBrandOpen && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '12px 0', borderBottom: '1px solid #f4f4f4' }}>
                {brands.map(b => (
                  <Link
                    key={b.name}
                    href={`/products?brand=${b.name}`}
                    onClick={() => setMenuOpen(false)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 8px', borderRadius: 10, background: '#f9f9f9', textDecoration: 'none', color: '#0a0a0a' }}
                  >
                    <span style={{ fontSize: 22 }}>{b.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{b.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mobile-menu-label" style={{ marginTop: 8 }}>Menu</div>
          {cats.map(c => (
            <Link
              key={c.href}
              href={c.href}
              className={`mobile-menu-link${c.sale ? ' sale' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
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