import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminDashboard() {
  const supabase = createAdminSupabase()
  const [
    { count: totalProducts },
    { count: totalOrders },
    { data: recentOrders },
    { count: pendingOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'pending'),
  ])

  const statusColors: Record<string, string> = {
    pending: '#f59e0b', confirmed: '#0071e3', processing: '#8b5cf6',
    shipped: '#f97316', delivered: '#1a8a4a', cancelled: '#c8102e'
  }

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p style={{ color: '#888', fontSize: 14 }}>Welcome back!</p>
      </div>
      <div className="stats-grid">
        {[
          { label: 'Total Products', value: totalProducts ?? 0, icon: '📱', color: '#0071e3' },
          { label: 'Total Orders', value: totalOrders ?? 0, icon: '📦', color: '#8b5cf6' },
          { label: 'Pending Orders', value: pendingOrders ?? 0, icon: '⏳', color: '#f59e0b' },
          { label: 'Store Status', value: 'Live ✓', icon: '🟢', color: '#1a8a4a' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#888' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="admin-table-wrap">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Orders</h2>
          <Link href="/admin/orders" style={{ fontSize: 13, fontWeight: 600, color: '#c8102e' }}>View All →</Link>
        </div>
        {!recentOrders?.length ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#888' }}>No orders yet</div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>{['Order #', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {recentOrders.map((o: any) => (
                  <tr key={o.id}>
                    <td><Link href={`/admin/orders/${o.id}`} style={{ color: '#c8102e', fontWeight: 700 }}>{o.order_number}</Link></td>
                    <td>{o.customer_name}</td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(o.total)}</td>
                    <td style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: 12 }}>{o.payment_method}</td>
                    <td><span className="badge-status" style={{ background: (statusColors[o.order_status] || '#888') + '20', color: statusColors[o.order_status] || '#888' }}>{o.order_status}</span></td>
                    <td style={{ color: '#888' }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginTop: 24 }}>
        {[
          { label: 'Add Product', href: '/admin/products/new', icon: '➕', color: '#0071e3' },
          { label: 'Bulk Upload', href: '/admin/products/bulk', icon: '📊', color: '#8b5cf6' },
          { label: 'Add Branch', href: '/admin/branches/new', icon: '🏪', color: '#f97316' },
          { label: 'Create Coupon', href: '/admin/coupons/new', icon: '🎟️', color: '#1a8a4a' },
          { label: 'New Blog Post', href: '/admin/blog/new', icon: '📝', color: '#c8102e' },
          { label: 'Settings', href: '/admin/settings', icon: '⚙️', color: '#888' },
        ].map(a => (
          <Link key={a.href} href={a.href} style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1.5px solid #e8e8e8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, transition: 'all .2s' }}>
            <span style={{ fontSize: 24 }}>{a.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: a.color }}>{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}