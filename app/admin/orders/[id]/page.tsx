import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice, getWhatsAppLink } from '@/lib/utils'
import { notFound } from 'next/navigation'
import OrderActions from './OrderActions'

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminSupabase()
  const { id } = await params
  const { data: order } = await supabase.from('orders').select('*').eq('id', id).single()
  if (!order) return notFound()
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900 }}>
      <div className="page-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">{order.order_number}</h1>
          <p style={{ color: '#888', fontSize: 14 }}>{new Date(order.created_at).toLocaleString('en-IN')}</p>
        </div>
        <a href={getWhatsAppLink(order.customer_phone, `Hi ${order.customer_name}! Your order ${order.order_number} for ${formatPrice(order.total)} has been confirmed. Thank you for shopping with Hanfi's Collection!`)} target="_blank" rel="noreferrer" className="btn-wa">
          WhatsApp Customer
        </a>
      </div>
      <div className="order-detail-grid">
        <div className="admin-form-card">
          <h3 style={{ fontSize: 12, fontWeight: 700, marginBottom: 16, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Customer</h3>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{order.customer_name}</p>
          <p style={{ fontSize: 14, color: '#4a4a4a', marginBottom: 4 }}>📞 {order.customer_phone}</p>
          {order.customer_email && <p style={{ fontSize: 14, color: '#4a4a4a', marginBottom: 4 }}>✉️ {order.customer_email}</p>}
          {order.customer_address && <p style={{ fontSize: 14, color: '#4a4a4a' }}>📍 {order.customer_address}</p>}
        </div>
        <div className="admin-form-card">
          <h3 style={{ fontSize: 12, fontWeight: 700, marginBottom: 16, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Payment</h3>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>{order.payment_method}</p>
          <p style={{ fontSize: 14, color: '#4a4a4a', marginBottom: 4 }}>Status: {order.payment_status}</p>
          <p style={{ fontSize: 22, fontWeight: 800 }}>Total: {formatPrice(order.total)}</p>
          {order.discount > 0 && <p style={{ fontSize: 13, color: '#1a8a4a' }}>Discount: -{formatPrice(order.discount)}</p>}
        </div>
      </div>
      <div className="admin-form-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, marginBottom: 16, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Items</h3>
        {order.items?.map((item: any, i: number) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f4f4f4', alignItems: 'center' }}>
            <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'contain', background: '#f9f9f9', borderRadius: 8, padding: 4, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 13, color: '#888' }}>Qty: {item.quantity} × {formatPrice(item.price)}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</div>
          </div>
        ))}
      </div>
      <OrderActions order={order} />
    </div>
  )
}