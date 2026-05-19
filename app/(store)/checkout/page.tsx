'use client'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { formatPrice, getOrderWhatsApp } from '@/lib/utils'
import { useSettings } from '@/hooks/useSettings'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const settings = useSettings()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', payment: 'cod', coupon: '' })
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)

  const subtotal = total()
  const finalTotal = subtotal - discount

  async function validateCoupon() {
    const res = await fetch('/api/coupons/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: form.coupon, order_total: subtotal }) })
    const data = await res.json()
    if (data.valid) { setDiscount(data.discount); setCouponMsg(`✓ ${data.message}`) }
    else { setDiscount(0); setCouponMsg(`✗ ${data.message}`) }
  }

  async function placeOrder() {
    if (!form.name || !form.phone) return alert('Please fill name and phone')
    setLoading(true)
    const res = await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, items: items, subtotal, discount, total: finalTotal })
    })
    const data = await res.json()
    if (data.order) {
      setOrder(data.order); clearCart()
      const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'
      window.open(getOrderWhatsApp(data.order, waNumber), '_blank')
    }
    setLoading(false)
  }

  if (order) return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 32px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Order Placed!</h1>
      <p style={{ color: '#888', marginBottom: 8 }}>Order #{order.order_number}</p>
      <p style={{ color: '#888', marginBottom: 32 }}>We've opened WhatsApp so you can confirm directly with our team.</p>
      <button onClick={() => router.push('/')} style={{ padding: '14px 32px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Continue Shopping</button>
    </div>
  )

  if (!items.length) return (
    <div style={{ textAlign: 'center', padding: '80px 32px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Your cart is empty</h2>
      <button onClick={() => router.push('/products')} style={{ padding: '13px 28px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 50, cursor: 'pointer', fontWeight: 600 }}>Shop Now</button>
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Checkout</h1>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Delivery Details</h3>
          {[['name', 'Full Name *', 'text'], ['phone', 'Phone Number *', 'tel'], ['email', 'Email', 'email'], ['address', 'Delivery Address', 'text']].map(([k, label, type]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
              <input type={type} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none' }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Payment Method</h3>
          <div style={{ display: 'flex', gap: 12 }}>
            {(settings?.online_payment_enabled !== false) && (
              <button onClick={() => setForm({ ...form, payment: 'online' })}
                style={{ flex: 1, padding: 16, border: `2px solid ${form.payment === 'online' ? '#0a0a0a' : '#e8e8e8'}`, borderRadius: 12, background: form.payment === 'online' ? '#0a0a0a' : '#fff', color: form.payment === 'online' ? '#fff' : '#0a0a0a', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                💳 Online Payment
              </button>
            )}
            {(settings?.cod_enabled !== false) && (
              <button onClick={() => setForm({ ...form, payment: 'cod' })}
                style={{ flex: 1, padding: 16, border: `2px solid ${form.payment === 'cod' ? '#0a0a0a' : '#e8e8e8'}`, borderRadius: 12, background: form.payment === 'cod' ? '#0a0a0a' : '#fff', color: form.payment === 'cod' ? '#fff' : '#0a0a0a', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                💵 Cash on Delivery
              </button>
            )}
          </div>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Coupon Code</h3>
          <div style={{ display: 'flex', gap: 12 }}>
            <input value={form.coupon} onChange={e => setForm({ ...form, coupon: e.target.value })} placeholder="Enter coupon code"
              style={{ flex: 1, padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none' }} />
            <button onClick={validateCoupon} style={{ padding: '12px 20px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Apply</button>
          </div>
          {couponMsg && <div style={{ fontSize: 13, marginTop: 8, color: couponMsg.startsWith('✓') ? '#1a8a4a' : '#c8102e' }}>{couponMsg}</div>}
        </div>
      </div>
      <div>
        <div style={{ background: '#f9f9f9', borderRadius: 20, padding: 28, position: 'sticky', top: 100 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'contain', background: '#fff', borderRadius: 8, padding: 4 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>Qty: {item.quantity}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 16, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: '#888' }}>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: '#1a8a4a' }}>Discount</span><span style={{ color: '#1a8a4a' }}>-{formatPrice(discount)}</span>
            </div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, marginTop: 12 }}>
              <span>Total</span><span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
          <button onClick={placeOrder} disabled={loading}
            style={{ width: '100%', padding: 16, background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 20 }}>
            {loading ? 'Placing Order...' : 'Place Order →'}
          </button>
          <div style={{ fontSize: 12, color: '#888', textAlign: 'center', marginTop: 12 }}>
            🔒 Secure checkout · WhatsApp confirmation
          </div>
        </div>
      </div>
    </div>
  )
}