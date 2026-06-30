export const revalidate = 0
import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import type { Product } from '@/types'

export default async function AdminAccessories() {
  const supabase = createAdminSupabase()
  const { data: accessories } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'Accessory')
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Accessories ({accessories?.length || 0})</h1>
        <Link href="/admin/accessories/new" className="btn-primary">+ Add Accessory</Link>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>{['Product', 'Brand', 'Type', 'Price', 'Stock', 'Featured', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {accessories?.map((p: any) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={p.images?.[0] || '/images/phone-placeholder.png'} alt={p.name} style={{ width: 40, height: 40, objectFit: 'contain', background: '#f9f9f9', borderRadius: 8, padding: 4, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#888' }}>{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.brand}</td>
                  <td><span className="badge-status" style={{ background: '#f4f4f4', color: '#0a0a0a' }}>{p.accessory_type || '-'}</span></td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(p.price)}</td>
                  <td><span className="badge-status" style={{ background: p.in_stock ? '#dcfce7' : '#fee2e2', color: p.in_stock ? '#166534' : '#991b1b' }}>{p.in_stock ? 'In Stock' : 'Out'}</span></td>
                  <td>{p.featured ? '⭐' : '-'}</td>
                  <td><Link href={`/admin/products/${p.id}`} style={{ color: '#0071e3', fontWeight: 600, fontSize: 13 }}>Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!accessories?.length && (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#888' }}>No accessories yet. Add your first one!</div>
        )}
      </div>
    </div>
  )
}