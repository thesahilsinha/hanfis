import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import type { UsedPhone } from '@/types'
import UsedPhoneActions from './UsedPhoneActions'

export default async function AdminUsedPhones() {
  const supabase = createAdminSupabase()
  const { data: phones } = await supabase.from('used_phones').select('*').order('created_at', { ascending: false })

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Used Phones ({phones?.length || 0})</h1>
        <Link href="/admin/used-phones/new" className="btn-primary">+ Add Listing</Link>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>{['Phone', 'Type', 'Condition', 'Price', 'Seller', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {phones?.map((p: UsedPhone) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{p.brand}{p.storage ? ` · ${p.storage}GB` : ''}</div>
                  </td>
                  <td><span className="badge-status" style={{ background: p.type === 'buy' ? '#dbeafe' : '#fce7f3', color: p.type === 'buy' ? '#1e40af' : '#9d174d', textTransform: 'uppercase' }}>{p.type}</span></td>
                  <td>{p.condition}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(p.price)}</td>
                  <td>
                    <div>{p.seller_name || '-'}</div>
                    {p.seller_phone && <div style={{ fontSize: 11, color: '#888' }}>{p.seller_phone}</div>}
                  </td>
                  <td><span className="badge-status" style={{ background: p.status === 'active' ? '#dcfce7' : '#f4f4f4', color: p.status === 'active' ? '#166534' : '#888' }}>{p.status}</span></td>
                  <td><UsedPhoneActions phone={p} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}