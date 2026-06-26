import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import type { Product } from '@/types'

export default async function AdminProducts() {
  const supabase = createAdminSupabase()
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Products ({products?.length || 0})</h1>
        <Link href="/admin/products/new" className="btn-primary">+ Add Product</Link>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link href="/admin/products/bulk" style={{ padding: '12px 20px', background: '#f4f4f4', color: '#0a0a0a', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          📊 Bulk Upload
        </Link>
        <Link href="/admin/products/new" className="btn-primary">+ Add Product</Link>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>{['Product', 'Brand', 'Price', 'Stock', 'Featured', 'Badge', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {products?.map((p: Product) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={p.images?.[0] || '/images/phone-placeholder.png'} alt={p.name} style={{ width: 44, height: 44, objectFit: 'contain', background: '#f9f9f9', borderRadius: 8, padding: 4, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#888' }}>{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.brand}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(p.price)}</td>
                  <td><span className="badge-status" style={{ background: p.in_stock ? '#dcfce7' : '#fee2e2', color: p.in_stock ? '#166534' : '#991b1b' }}>{p.in_stock ? 'In Stock' : 'Out'}</span></td>
                  <td>{p.featured ? '⭐' : '-'}</td>
                  <td style={{ textTransform: 'uppercase', fontWeight: 600, color: p.badge ? '#c8102e' : '#888', fontSize: 11 }}>{p.badge || '-'}</td>
                  <td><Link href={`/admin/products/${p.id}`} style={{ color: '#0071e3', fontWeight: 600, fontSize: 13 }}>Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}