'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OrderActions({ order }: { order: any }) {
  const router = useRouter()
  const [status, setStatus] = useState(order.order_status)
  const [loading, setLoading] = useState(false)

  async function updateStatus() {
    setLoading(true)
    await fetch(`/api/orders/${order.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_status: status }) })
    setLoading(false)
    router.refresh()
  }

  async function confirmOrder() {
    setLoading(true)
    await fetch(`/api/orders/${order.id}/confirm`, { method: 'POST' })
    setLoading(false)
    router.refresh()
  }

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1.5px solid #e8e8e8' }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Actions</h3>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Update Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ padding: '11px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff', textTransform: 'capitalize' }}>
            {statuses.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
          </select>
        </div>
        <button onClick={updateStatus} disabled={loading}
          style={{ padding: '11px 24px', background: '#0071e3', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Update Status
        </button>
        {order.order_status === 'pending' && (
          <button onClick={confirmOrder} disabled={loading}
            style={{ padding: '11px 24px', background: '#1a8a4a', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            ✓ One-Click Confirm
          </button>
        )}
      </div>
    </div>
  )
}