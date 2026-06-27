export const revalidate = 0

import { createAdminSupabase } from '@/lib/supabase-server'
import Link from 'next/link'
import type { Coupon } from '@/types'
import CouponActions from './CouponActions'

export default async function AdminCoupons() {
  const supabase = createAdminSupabase()
  const { data: coupons } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Coupons ({coupons?.length || 0})</h1>
        <Link href="/admin/coupons/new" className="btn-primary">+ Create Coupon</Link>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>{['Code', 'Type', 'Value', 'Min Order', 'Used', 'Expires', 'Status', 'Action'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {coupons?.map((c: Coupon) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 800, fontFamily: 'monospace', letterSpacing: 1 }}>{c.code}</td>
                  <td>{c.discount_type}</td>
                  <td style={{ fontWeight: 700, color: '#1a8a4a' }}>{c.discount_type === 'percent' ? `${c.discount_value}%` : `₹${c.discount_value}`}</td>
                  <td>{c.min_order ? `₹${c.min_order.toLocaleString('en-IN')}` : '-'}</td>
                  <td>{c.used_count}{c.max_uses ? `/${c.max_uses}` : ''}</td>
                  <td style={{ color: '#888' }}>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-IN') : 'No expiry'}</td>
                  <td><span className="badge-status" style={{ background: c.is_active ? '#dcfce7' : '#fee2e2', color: c.is_active ? '#166534' : '#991b1b' }}>{c.is_active ? 'Active' : 'Off'}</span></td>
                  <td><CouponActions coupon={c} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}