'use client'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const statusColors: Record<string, string> = {
    pending: '#f59e0b', confirmed: '#0071e3', processing: '#8b5cf6',
    shipped: '#f97316', delivered: '#1a8a4a', cancelled: '#c8102e'
  }

  const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

  async function search() {
    if (!phone.trim()) return
    setLoading(true)
    const res = await fetch(`/api/orders/track?phone=${phone}`)
    const data = await res.json()
    setOrders(data || [])
    setSearched(true)
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '64px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>ORDER TRACKING</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, marginBottom: 12 }}>Track Your Order</h1>
        <p style={{ color: '#888', fontSize: 15 }}>Enter your phone number to find your orders</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 48 }}>
        <input
          className="form-input"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Enter your phone number"
          type="tel"
          style={{ flex: 1 }}
        />
        <button onClick={search} disabled={loading} className="btn-primary" style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
          {loading ? 'Searching...' : 'Track →'}
        </button>
      </div>

      {searched && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#888' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No orders found</p>
          <p style={{ fontSize: 14 }}>Try a different phone number or <a href="https://wa.me/919876543210" style={{ color: '#c8102e' }}>WhatsApp us</a></p>
        </div>
      )}

      {orders.map(order => (
        <div key={order.id} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8e8e8', overflow: 'hidden', marginBottom: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f4f4f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{order.order_number}</div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ background: statusColors[order.order_status] + '20', color: statusColors[order.order_status], borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>
                {order.order_status}
              </span>
              <span style={{ fontSize: 18, fontWeight: 800 }}>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Progress bar */}
          {order.order_status !== 'cancelled' && (
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f4f4f4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, left: '10%', right: '10%', height: 2, background: '#e8e8e8', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: 12, left: '10%', height: 2, background: '#1a8a4a', zIndex: 0, width: `${(statusSteps.indexOf(order.order_status) / (statusSteps.length - 1)) * 80}%`, transition: 'width .5s' }} />
                {statusSteps.map((step, i) => {
                  const done = statusSteps.indexOf(order.order_status) >= i
                  return (
                    <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1, flex: 1 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: done ? '#1a8a4a' : '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 700 }}>
                        {done ? '✓' : i + 1}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: done ? '#1a8a4a' : '#888', textTransform: 'capitalize', textAlign: 'center' }}>{step}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ padding: '16px 24px' }}>
            {order.items?.map((item: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                {item.image && <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'contain', background: '#f9f9f9', borderRadius: 8, padding: 4, flexShrink: 0 }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>Qty: {item.quantity} × {formatPrice(item.price)}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f4f4f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>{order.payment_method}</span>
              <a href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi! I want to check status of order ${order.order_number}`)}`} target="_blank" rel="noreferrer"
                style={{ fontSize: 13, fontWeight: 600, color: '#25d366', textDecoration: 'none' }}>
                💬 WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}