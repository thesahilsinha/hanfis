export const revalidate = 0
import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import type { Product } from '@/types'
import ProductsPagination from '@/components/product/ProductsPagination'
import AdminProductsClient from './AdminProductsClient'

const PAGE_SIZE = 30

export default async function AdminProducts({ searchParams }: { searchParams: Promise<any> }) {
  const supabase = createAdminSupabase()
  const sp = await searchParams
  const page = parseInt(sp.page || '1')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const search = sp.q || ''
  const brand = sp.brand || ''

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .neq('category', 'Accessory')

  if (search) query = query.ilike('name', `%${search}%`)
  if (brand) query = query.eq('brand', brand)

  const { data: products, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)
  const params = new URLSearchParams()
  if (search) params.set('q', search)
  if (brand) params.set('brand', brand)

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Products ({count || 0})</h1>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/admin/products/bulk" style={{ padding: '11px 18px', background: '#f4f4f4', color: '#0a0a0a', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            📊 Bulk Upload
          </Link>
          <Link href="/admin/products/new" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>+ Add Product</Link>
        </div>
      </div>

      <AdminProductsClient currentSearch={search} currentBrand={brand} />

      <div className="admin-table-wrap">
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e8e8e8', fontSize: 13, color: '#888' }}>
          Showing {count === 0 ? 0 : from + 1}–{Math.min(to + 1, count || 0)} of {count || 0} products
          {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
        </div>
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
                      <img
                        src={p.images?.[0] || '/images/phone-placeholder.png'}
                        alt={p.name}
                        style={{ width: 44, height: 44, objectFit: 'contain', background: '#f9f9f9', borderRadius: 8, padding: 4, flexShrink: 0 }}
                      />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#888', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.brand}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(p.price)}</td>
                  <td>
                    <span className="badge-status" style={{ background: p.in_stock ? '#dcfce7' : '#fee2e2', color: p.in_stock ? '#166534' : '#991b1b' }}>
                      {p.in_stock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td>{p.featured ? '⭐' : '-'}</td>
                  <td style={{ textTransform: 'uppercase', fontWeight: 600, color: p.badge ? '#c8102e' : '#888', fontSize: 11 }}>{p.badge || '-'}</td>
                  <td>
                    <Link href={`/admin/products/${p.id}`} style={{ color: '#0071e3', fontWeight: 600, fontSize: 13 }}>Edit</Link>
                  </td>
                </tr>
              ))}
              {!products?.length && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px', color: '#888' }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductsPagination
        currentPage={page}
        totalPages={totalPages}
        baseParams={params.toString()}
        basePath="/admin/products"
      />
    </div>
  )
}