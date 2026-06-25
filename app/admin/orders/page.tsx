import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import type { Order } from '@/types'

export default async function AdminOrders() {
  const supabase = createAdminSupabase()
  const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  const statusColors: Record<string, string> = { pending: '#f59e0b', confirmed: '#0071e3', processing: '#8b5cf6', shipped: '#f97316', delivered: '#1a8a4a', cancelled: '#c8102e' }

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Orders ({orders?.length || 0})</h1>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>{['Order #', 'Customer', 'Phone', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {orders?.map((o: Order) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700 }}>{o.order_number}</td>
                  <td>{o.customer_name}</td>
                  <td>{o.customer_phone}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(o.total)}</td>
                  <td style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: 12 }}>{o.payment_method}</td>
                  <td><span className="badge-status" style={{ background: statusColors[o.order_status] + '20', color: statusColors[o.order_status] }}>{o.order_status}</span></td>
                  <td style={{ color: '#888' }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                  <td><Link href={`/admin/orders/${o.id}`} style={{ color: '#0071e3', fontWeight: 600, fontSize: 13 }}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}