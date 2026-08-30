export const revalidate = 0
import { createAdminSupabase } from '@/lib/supabase-server'
import ProductCard from '@/components/product/ProductCard'
import ProductsPagination from '@/components/product/ProductsPagination'
import type { Product } from '@/types'

const PAGE_SIZE = 24

export default async function ProductsPage({ searchParams }: { searchParams: Promise<any> }) {
  const supabase = createAdminSupabase()
  const sp = await searchParams
  const page = parseInt(sp.page || '1')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('in_stock', true)
    .neq('category', 'Accessory')

  if (sp.brand) query = query.eq('brand', sp.brand)
  if (sp.badge) query = query.eq('badge', sp.badge)
  if (sp.max) query = query.lte('price', parseInt(sp.max))
  if (sp.q) query = query.or(`name.ilike.%${sp.q}%,brand.ilike.%${sp.q}%,description.ilike.%${sp.q}%`)

  const { data: products, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  // Build current URL params for pagination links
  const params = new URLSearchParams()
  if (sp.brand) params.set('brand', sp.brand)
  if (sp.badge) params.set('badge', sp.badge)
  if (sp.max) params.set('max', sp.max)
  if (sp.q) params.set('q', sp.q)

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 16px 64px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, marginBottom: 6 }}>
          {sp.brand ? `${sp.brand} Phones` : sp.q ? `Results for "${sp.q}"` : 'All Phones'}
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          {count || 0} phones found
          {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
        </p>
      </div>

      {!products?.length ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
          No phones found. Try a different search.
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((p: Product) => <ProductCard key={p.id} product={p} />)}
          </div>
          <ProductsPagination
            currentPage={page}
            totalPages={totalPages}
            baseParams={params.toString()}
          />
        </>
      )}
    </div>
  )
}