export const revalidate = 0
import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import ProductsPagination from '@/components/product/ProductsPagination'

const PAGE_SIZE = 30

export default async function AdminAccessories({ searchParams }: { searchParams: Promise<any> }) {
  const supabase = createAdminSupabase()
  const sp = await searchParams
  const page = parseInt(sp.page || '1')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('category', 'Accessory')

  if (sp.q) query = query.ilike('name', `%${sp.q}%`)

  const { data: accessories, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)
  const params = new URLSearchParams()
  if (sp.q) params.set('q', sp.q)

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Accessories ({count || 0})</h1>
        <Link href="/admin/accessories/new" className="btn-primary">+ Add Accessory</Link>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <form style={{ display: 'flex', gap: 8, flex: 1 }}>
          <input name="q" defaultValue={sp.q || ''} placeholder="Search accessories..." className="form-input" style={{ flex: 1 }} />
          <button type="submit" className="btn-primary" style={{ padding: '11px 20px' }}>Search</button>
          {sp.q && <Link href="/admin/accessories" className="btn-danger" style={{ padding: '11px 16px', display: 'flex', alignItems: 'center' }}>✕</Link>}
        </form>
      </div>

      <div className="admin-table-wrap">
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e8e8e8', fontSize: 13, color: '#888' }}>
          Showing {from + 1}–{Math.min(to + 1, count || 0)} of {count || 0} accessories
        </div>
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
                      <img src={p.images?.[0] || '/images/phone-placeholder.png'} alt={p.name}
                        style={{ width: 40, height: 40, objectFit: 'contain', background: '#f9f9f9', borderRadius: 8, padding: 4, flexShrink: 0 }} />
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
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
      </div>

      <ProductsPagination currentPage={page} totalPages={totalPages} baseParams={params.toString()} basePath="/admin/accessories" />
    </div>
  )
}