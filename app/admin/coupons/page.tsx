import { createAdminSupabase } from '@/lib/supabase-server'
import Link from 'next/link'
import CouponActions from './CouponActions'

export default async function AdminCoupons() {
  const supabase = createAdminSupabase()
  const { data: coupons } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Coupons ({coupons?.length || 0})</h1>
        <Link href="/admin/coupons/new" style={{ padding: '12px 24px', background: '#0a0a0a', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          + Create Coupon
        </Link>
      </div>
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8e8e8', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9' }}>
              {['Code', 'Type', 'Value', 'Min Order', 'Used', 'Expires', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons?.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f4f4f4' }}>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 800, fontFamily: 'monospace', letterSpacing: 1 }}>{c.code}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.discount_type}</td>
                <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#1a8a4a' }}>{c.discount_type === 'percent' ? `${c.discount_value}%` : `₹${c.discount_value}`}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.min_order ? `₹${c.min_order.toLocaleString('en-IN')}` : '-'}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.used_count}{c.max_uses ? `/${c.max_uses}` : ''}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#888' }}>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-IN') : 'No expiry'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: c.is_active ? '#dcfce7' : '#fee2e2', color: c.is_active ? '#166534' : '#991b1b', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{c.is_active ? 'Active' : 'Inactive'}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <CouponActions coupon={c} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}