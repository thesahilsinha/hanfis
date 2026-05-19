import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice, getWhatsAppLink } from '@/lib/utils'
import { notFound } from 'next/navigation'
import OrderActions from './OrderActions'

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const supabase = createAdminSupabase()
  const { data: order } = await supabase.from('orders').select('*').eq('id', (await params).id).single()
  if (!order) return notFound()
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{order.order_number}</h1>
          <p style={{ color: '#888', fontSize: 14 }}>{new Date(order.created_at).toLocaleString('en-IN')}</p>
        </div>
        <a href={getWhatsAppLink(order.customer_phone, `Hi ${order.customer_name}! Your order ${order.order_number} for ${formatPrice(order.total)} has been confirmed. Thank you for shopping with Hanfi's Collection! 🎉`)} target="_blank" rel="noreferrer"
          style={{ padding: '12px 24px', background: '#25d366', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          💬 WhatsApp Customer
        </a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1.5px solid #e8e8e8' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Customer</h3>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{order.customer_name}</p>
          <p style={{ fontSize: 14, color: '#4a4a4a', marginBottom: 4 }}>📞 {order.customer_phone}</p>
          {order.customer_email && <p style={{ fontSize: 14, color: '#4a4a4a', marginBottom: 4 }}>✉️ {order.customer_email}</p>}
          {order.customer_address && <p style={{ fontSize: 14, color: '#4a4a4a' }}>📍 {order.customer_address}</p>}
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1.5px solid #e8e8e8' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Payment</h3>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>{order.payment_method}</p>
          <p style={{ fontSize: 14, color: '#4a4a4a', marginBottom: 4 }}>Status: {order.payment_status}</p>
          <p style={{ fontSize: 22, fontWeight: 800 }}>Total: {formatPrice(order.total)}</p>
          {order.discount > 0 && <p style={{ fontSize: 13, color: '#1a8a4a' }}>Discount applied: -{formatPrice(order.discount)}</p>}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1.5px solid #e8e8e8', marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Items</h3>
        {order.items?.map((item: any, i: number) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f4f4f4' }}>
            <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'contain', background: '#f9f9f9', borderRadius: 8, padding: 4 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 13, color: '#888' }}>Qty: {item.quantity} × {formatPrice(item.price)}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</div>
          </div>
        ))}
      </div>
      <OrderActions order={order} />
    </div>
  )
}