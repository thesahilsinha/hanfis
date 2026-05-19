'use client'
import { useRouter } from 'next/navigation'

export default function CouponActions({ coupon }: { coupon: any }) {
  const router = useRouter()
  async function toggle() {
    await fetch('/api/coupons', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: coupon.id, is_active: !coupon.is_active }) })
    router.refresh()
  }
  return (
    <button onClick={toggle} style={{ padding: '6px 14px', background: coupon.is_active ? '#fef3c7' : '#dcfce7', color: coupon.is_active ? '#92400e' : '#166534', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
      {coupon.is_active ? 'Disable' : 'Enable'}
    </button>
  )
}