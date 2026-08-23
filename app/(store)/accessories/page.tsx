export const revalidate = 0
import { createAdminSupabase } from '@/lib/supabase-server'
import ProductCard from '@/components/product/ProductCard'
import ProductsPagination from '@/components/product/ProductsPagination'
import type { Product } from '@/types'

const PAGE_SIZE = 24

export default async function AccessoriesPage({ searchParams }: { searchParams: Promise<any> }) {
  const supabase = createAdminSupabase()
  const sp = await searchParams
  const page = parseInt(sp.page || '1')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('category', 'Accessory')
    .eq('in_stock', true)

  if (sp.type) query = query.eq('accessory_type', sp.type)
  if (sp.brand) query = query.eq('brand', sp.brand)

  const { data: products, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)
  const params = new URLSearchParams()
  if (sp.type) params.set('type', sp.type)
  if (sp.brand) params.set('brand', sp.brand)

  const types = ['Charger', 'Earphones', 'TWS/Buds', 'Smartwatch', 'Case', 'Screen Guard']

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 16px 64px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>ACCESSORIES</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, marginBottom: 8 }}>Phone Accessories</h1>
        <p style={{ color: '#888', fontSize: 14 }}>{count || 0} items{totalPages > 1 && ` · Page ${page} of ${totalPages}`}</p>
      </div>

      <div className="cats-scroll" style={{ marginBottom: 32 }}>
        <a href="/accessories" className={`cat-pill${!sp.type ? ' active' : ''}`}><span>All</span></a>
        {types.map(t => (
          <a key={t} href={`/accessories?type=${encodeURIComponent(t)}`} className={`cat-pill${sp.type === t ? ' active' : ''}`}>
            <span>{t}</span>
          </a>
        ))}
      </div>

      {!products?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>No accessories found.</div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((p: Product) => <ProductCard key={p.id} product={p} />)}
          </div>
          <ProductsPagination currentPage={page} totalPages={totalPages} baseParams={params.toString()} basePath="/accessories" />
        </>
      )}
    </div>
  )
}