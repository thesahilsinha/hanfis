export const revalidate = 0
import { createAdminSupabase } from '@/lib/supabase-server'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

export default async function AccessoriesPage({ searchParams }: { searchParams: Promise<any> }) {
  const supabase = createAdminSupabase()
  const sp = await searchParams

  let query = supabase.from('products').select('*').eq('category', 'Accessory').eq('in_stock', true)
  if (sp.type) query = query.eq('accessory_type', sp.type)
  if (sp.brand) query = query.eq('brand', sp.brand)

  const { data: products } = await query.order('created_at', { ascending: false })

  const types = ['Charger', 'Earphones', 'TWS/Buds', 'Smartwatch', 'Case', 'Screen Guard']

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 16px 64px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>ACCESSORIES</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, marginBottom: 12 }}>
          Phone Accessories
        </h1>
        <p style={{ color: '#888', fontSize: 15 }}>Chargers, earphones, smartwatches, cases & more</p>
      </div>

      {/* Type filter pills */}
      <div className="cats-scroll" style={{ marginBottom: 32, justifyContent: 'center' }}>
        <a href="/accessories" className={`cat-pill${!sp.type ? ' active' : ''}`}>
          <span>All</span>
        </a>
        {types.map(t => (
          <a key={t} href={`/accessories?type=${encodeURIComponent(t)}`} className={`cat-pill${sp.type === t ? ' active' : ''}`}>
            <span>{t}</span>
          </a>
        ))}
      </div>

      <p style={{ color: '#888', marginBottom: 24, textAlign: 'center' }}>{products?.length || 0} accessories found</p>

      {!products?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
          No accessories found. Check back soon!
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p: Product) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}