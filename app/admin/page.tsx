import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createAdminSupabase()
  const [{ count: totalProducts }, { count: totalOrders }, { data: recentOrders }, { count: pendingOrders }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'pending'),
  ])

  const statusColors: any = { pending: '#f59e0b', confirmed: '#0071e3', processing: '#8b5cf6', shipped: '#f97316', delivered: '#1a8a4a', cancelled: '#c8102e' }

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p style={{ color: '#888', fontSize: 14 }}>Welcome back!</p>
      </div>
      <div className="stats-grid">
        {[
          { label: 'Total Products', value: totalProducts || 0, icon: '📱', color: '#0071e3' },
          { label: 'Total Orders', value: totalOrders || 0, icon: '📦', color: '#8b5cf6' },
          { label: 'Pending Orders', value: pendingOrders || 0, icon: '⏳', color: '#f59e0b' },
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
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>{['Order #', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {recentOrders?.map(o => (
                <tr key={o.id}>
                  <td><Link href={`/admin/orders/${o.id}`} style={{ color: '#c8102e', fontWeight: 700 }}>{o.order_number}</Link></td>
                  <td>{o.customer_name}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(o.total)}</td>
                  <td style={{ textTransform: 'uppercase', fontWeight: 600 }}>{o.payment_method}</td>
                  <td><span className="badge-status" style={{ background: statusColors[o.order_status] + '20', color: statusColors[o.order_status] }}>{o.order_status}</span></td>
                  <td style={{ color: '#888' }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}