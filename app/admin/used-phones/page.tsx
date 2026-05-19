import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import UsedPhoneActions from './UsedPhoneActions'

export default async function AdminUsedPhones() {
  const supabase = createAdminSupabase()
  const { data: phones } = await supabase.from('used_phones').select('*').order('created_at', { ascending: false })

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Used Phones ({phones?.length || 0})</h1>
        <Link href="/admin/used-phones/new" style={{ padding: '12px 24px', background: '#0a0a0a', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          + Add Listing
        </Link>
      </div>
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8e8e8', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9' }}>
              {['Phone', 'Type', 'Condition', 'Price', 'Seller', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {phones?.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f4f4f4' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{p.brand} · {p.storage ? p.storage + 'GB' : ''}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: p.type === 'buy' ? '#dbeafe' : '#fce7f3', color: p.type === 'buy' ? '#1e40af' : '#9d174d', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>{p.type}</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.condition}</td>
                <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700 }}>{formatPrice(p.price)}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.seller_name || '-'}<br />{p.seller_phone && <span style={{ fontSize: 12, color: '#888' }}>{p.seller_phone}</span>}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: p.status === 'active' ? '#dcfce7' : '#f4f4f4', color: p.status === 'active' ? '#166534' : '#888', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{p.status}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <UsedPhoneActions phone={p} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}