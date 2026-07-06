'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { formatPrice, getOrderWhatsApp } from '@/lib/utils'
import { useSettings } from '@/hooks/useSettings'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const settings = useSettings()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '',
    payment: 'cod', coupon: ''
  })
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [rzpReady, setRzpReady] = useState(false)

  const subtotal = total()
  const finalTotal = subtotal - discount

  // Check Razorpay loaded
  useEffect(() => {
    const check = () => {
      if (window.Razorpay) {
        setRzpReady(true)
      } else {
        // Load it dynamically if not loaded
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => setRzpReady(true)
        script.onerror = () => console.error('Razorpay failed to load')
        document.head.appendChild(script)
      }
    }
    check()
  }, [])

  async function validateCoupon() {
    if (!form.coupon.trim()) return
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: form.coupon, order_total: subtotal })
    })
    const data = await res.json()
    if (data.valid) { setDiscount(data.discount); setCouponMsg('✓ ' + data.message) }
    else { setDiscount(0); setCouponMsg('✗ ' + data.message) }
  }

  async function createDBOrder(razorpay_payment_id?: string, razorpay_order_id?: string) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        items,
        subtotal,
        discount,
        total: finalTotal,
        razorpay_payment_id: razorpay_payment_id || null,
        razorpay_order_id: razorpay_order_id || null,
      })
    })
    return await res.json()
  }

  async function placeOrder() {
    if (!form.name || !form.phone) return alert('Please fill your name and phone number')
    setLoading(true)

    try {
      if (form.payment === 'online') {
        // Check Razorpay is available
        if (!window.Razorpay) {
          alert('Payment gateway is loading. Please try again in a moment.')
          setLoading(false)
          return
        }

        // Create Razorpay order from backend
        const rzpRes = await fetch('/api/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalTotal })
        })
        const rzpOrder = await rzpRes.json()

        if (!rzpOrder.id) {
          alert('Payment initialization failed. Please try COD or contact us.')
          setLoading(false)
          return
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: rzpOrder.amount,
          currency: 'INR',
          name: "Hanfi's Collection",
          description: `Order for ${items.length} item(s)`,
          image: '/logo.jpg',
          order_id: rzpOrder.id,
          prefill: {
            name: form.name,
            contact: form.phone,
            email: form.email || '',
          },
          theme: { color: '#c8102e' },
          handler: async function (response: any) {
            // Payment SUCCESS — save order to DB
            const data = await createDBOrder(
              response.razorpay_payment_id,
              response.razorpay_order_id
            )
            if (data.order) {
              clearCart()
              setOrder(data.order)
              // Open WhatsApp confirmation
              const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'
              window.open(getOrderWhatsApp(data.order, waNumber), '_blank')
            }
            setLoading(false)
          },
          modal: {
            ondismiss: function () {
              // User closed Razorpay without paying
              setLoading(false)
            }
          }
        }

        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', function (response: any) {
          alert('Payment failed: ' + response.error.description)
          setLoading(false)
        })
        rzp.open()

      } else {
        // COD flow
        const data = await createDBOrder()
        if (data.order) {
          clearCart()
          setOrder(data.order)
          const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'
          window.open(getOrderWhatsApp(data.order, waNumber), '_blank')
        }
        setLoading(false)
      }
    } catch (err) {
      console.error('Order error:', err)
      alert('Something went wrong. Please try again or WhatsApp us.')
      setLoading(false)
    }
  }

  if (order) return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Order Placed!</h1>
      <p style={{ color: '#888', marginBottom: 4 }}>Order #{order.order_number}</p>
      <p style={{ color: '#888', marginBottom: 32 }}>
        {form.payment === 'online' ? '✅ Payment received!' : '📦 Cash on Delivery confirmed.'}
        {' '}WhatsApp opened for confirmation.
      </p>
      <button onClick={() => router.push('/')} className="btn-primary" style={{ padding: '14px 32px' }}>
        Continue Shopping
      </button>
    </div>
  )

  if (!items.length) return (
    <div style={{ textAlign: 'center', padding: '80px 16px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Your cart is empty</h2>
      <button onClick={() => router.push('/products')} className="btn-primary" style={{ padding: '13px 28px' }}>
        Shop Now
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px 64px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Checkout</h1>
      <div className="checkout-grid">

        {/* LEFT */}
        <div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1.5px solid #e8e8e8', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Delivery Details</h3>
            {([
              ['name', 'Full Name *', 'text'],
              ['phone', 'Phone Number *', 'tel'],
              ['email', 'Email', 'email'],
              ['address', 'Delivery Address', 'text']
            ] as const).map(([k, l, t]) => (
              <div key={k} className="form-group">
                <label className="form-label">{l}</label>
                <input
                  className="form-input"
                  type={t}
                  value={(form as any)[k]}
                  onChange={e => setForm({ ...form, [k]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1.5px solid #e8e8e8', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Payment Method</h3>
            <div className="payment-btns">
              {settings?.online_payment_enabled !== false && (
                <button
                  onClick={() => setForm({ ...form, payment: 'online' })}
                  className={`payment-btn${form.payment === 'online' ? ' active' : ''}`}
                >
                  💳 Online Payment
                  {!rzpReady && <span style={{ fontSize: 10, display: 'block', opacity: 0.6 }}>Loading...</span>}
                </button>
              )}
              {settings?.cod_enabled !== false && (
                <button
                  onClick={() => setForm({ ...form, payment: 'cod' })}
                  className={`payment-btn${form.payment === 'cod' ? ' active' : ''}`}
                >
                  💵 Cash on Delivery
                </button>
              )}
            </div>
            {form.payment === 'online' && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#f0fdf4', borderRadius: 10, fontSize: 12, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                🔒 Secured by Razorpay — Cards, UPI, Net Banking, Wallets
              </div>
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1.5px solid #e8e8e8' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Coupon Code</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="form-input"
                value={form.coupon}
                onChange={e => setForm({ ...form, coupon: e.target.value })}
                placeholder="Enter coupon code"
                style={{ flex: 1 }}
                onKeyDown={e => e.key === 'Enter' && validateCoupon()}
              />
              <button onClick={validateCoupon} className="btn-primary" style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
                Apply
              </button>
            </div>
            {couponMsg && (
              <div style={{ fontSize: 13, marginTop: 8, color: couponMsg.startsWith('✓') ? '#1a8a4a' : '#c8102e' }}>
                {couponMsg}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div>
          <div style={{ background: '#f9f9f9', borderRadius: 16, padding: 24, position: 'sticky', top: 70 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
            <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 16 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <img
                    src={item.image || '/images/phone-placeholder.png'}
                    alt={item.name}
                    style={{ width: 52, height: 52, objectFit: 'contain', background: '#fff', borderRadius: 8, padding: 4, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>Qty: {item.quantity}</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: '#888' }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                  <span style={{ color: '#1a8a4a' }}>Coupon Discount</span>
                  <span style={{ color: '#1a8a4a' }}>-{formatPrice(discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, marginTop: 10, paddingTop: 10, borderTop: '1px solid #e8e8e8' }}>
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
            <button
              onClick={placeOrder}
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: 16, fontSize: 15, marginTop: 20, borderRadius: 14, opacity: loading ? 0.7 : 1 }}
            >
              {loading
                ? form.payment === 'online' ? 'Opening Payment...' : 'Placing Order...'
                : form.payment === 'online' ? '💳 Pay Now' : '📦 Place Order'
              }
            </button>
            <div style={{ fontSize: 11, color: '#888', textAlign: 'center', marginTop: 10 }}>
              {form.payment === 'online'
                ? '🔒 100% secure payment via Razorpay'
                : '🔒 Secure checkout · WhatsApp confirmation'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}