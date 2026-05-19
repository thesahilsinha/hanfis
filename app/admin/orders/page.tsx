import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminOrders() {
  const supabase = createAdminSupabase()
  const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  const statusColors: any = { pending: '#f59e0b', confirmed: '#0071e3', processing: '#8b5cf6', shipped: '#f97316', delivered: '#1a8a4a', cancelled: '#c8102e' }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Orders ({orders?.length || 0})</h1>
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8e8e8', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9' }}>
              {['Order #', 'Customer', 'Phone', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders?.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid #f4f4f4' }}>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700 }}>{o.order_number}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{o.customer_name}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{o.customer_phone}</td>
                <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700 }}>{formatPrice(o.total)}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>{o.payment_method}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: statusColors[o.order_status] + '20', color: statusColors[o.order_status], borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{o.order_status}</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#888' }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Link href={`/admin/orders/${o.id}`} style={{ fontSize: 13, fontWeight: 600, color: '#0071e3', marginRight: 8 }}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}