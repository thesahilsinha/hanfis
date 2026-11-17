import { createAdminSupabase } from '@/lib/supabase-server'
import { getProductList } from '@/lib/cache'
import ProductCard from '@/components/product/ProductCard'
import ProductsPagination from '@/components/product/ProductsPagination'
import type { Product } from '@/types'

const PAGE_SIZE = 24

export default async function ProductsPage({ searchParams }: { searchParams: Promise<any> }) {
  const sp = await searchParams
  const page = parseInt(sp.page || '1')

  let products: any[] = []
  let count = 0

  if (sp.q) {
    // search results are not cached (too many possible keys)
    const from = (page - 1) * PAGE_SIZE
    const q = String(sp.q).replace(/[,%()]/g, ' ')
    const res = await createAdminSupabase().from('products').select('*', { count: 'exact' })
      .eq('in_stock', true).neq('category', 'Accessory')
      .or(`name.ilike.%${q}%,brand.ilike.%${q}%`)
      .order('created_at', { ascending: false }).range(from, from + PAGE_SIZE - 1)
    products = res.data || []; count = res.count || 0
  } else {
    const r = await getProductList({
      brand: sp.brand, badge: sp.badge, max: sp.max ? parseInt(sp.max) : undefined, page, size: PAGE_SIZE,
    })
    products = r.products; count = r.count
  }

  const totalPages = Math.ceil(count / PAGE_SIZE)
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
        <p style={{ color: '#888', fontSize: 14 }}>{count} phones found{totalPages > 1 && ` · Page ${page} of ${totalPages}`}</p>
      </div>
      {!products.length ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>No phones found. Try a different search.</div>
      ) : (
        <>
          <div className="products-grid">{products.map((p: Product) => <ProductCard key={p.id} product={p} />)}</div>
          <ProductsPagination currentPage={page} totalPages={totalPages} baseParams={params.toString()} />
        </>
      )}
    </div>
  )
}