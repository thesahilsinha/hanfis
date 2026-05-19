'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📱' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/used-phones', label: 'Used Phones', icon: '♻️' },
  { href: '/admin/branches', label: 'Branches', icon: '🏪' },
  { href: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function AdminSidebar() {
  const path = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function logout() {
    document.cookie = 'hanfi-admin-auth=; max-age=0; path=/'
    router.push('/admin-login')
  }

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {links.map(l => (
        <Link key={l.href} href={l.href} onClick={onClick}
          className={`admin-sidebar-link${path === l.href ? ' active' : ''}`}>
          <span style={{ fontSize: 18 }}>{l.icon}</span>{l.label}
        </Link>
      ))}
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ padding: '0 20px', marginBottom: 32 }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 800, color: '#fff', textDecoration: 'none' }}>
            Hanfi's <span style={{ color: '#c8102e' }}>Admin</span>
          </Link>
        </div>
        <nav style={{ flex: 1 }}>
          <NavLinks />
        </nav>
        <div style={{ padding: '0 20px', marginTop: 16 }}>
          <Link href="/" target="_blank" style={{ display: 'block', padding: '10px 16px', background: 'rgba(255,255,255,0.07)', borderRadius: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textAlign: 'center', textDecoration: 'none' }}>
            View Store ↗
          </Link>
          <button onClick={logout} style={{ width: '100%', padding: '10px 16px', background: 'rgba(200,16,46,0.2)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: 10, fontSize: 13, color: '#c8102e', cursor: 'pointer', fontFamily: 'inherit' }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="admin-topbar">
        <Link href="/" style={{ fontSize: 16, fontWeight: 800, color: '#fff', textDecoration: 'none' }}>
          Hanfi's <span style={{ color: '#c8102e' }}>Admin</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`admin-mobile-menu${mobileOpen ? ' open' : ''}`}>
        <NavLinks onClick={() => setMobileOpen(false)} />
        <div style={{ padding: '16px 20px', marginTop: 16 }}>
          <Link href="/" target="_blank" style={{ display: 'block', padding: '12px 16px', background: 'rgba(255,255,255,0.07)', borderRadius: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textAlign: 'center', textDecoration: 'none' }}>
            View Store ↗
          </Link>
          <button onClick={logout} style={{ width: '100%', padding: '12px 16px', background: 'rgba(200,16,46,0.2)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: 10, fontSize: 14, color: '#c8102e', cursor: 'pointer', fontFamily: 'inherit' }}>
            Logout
          </button>
        </div>
      </div>
    </>
  )
}