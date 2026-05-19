import { createAdminSupabase } from '@/lib/supabase-server'
import ProductCard from '@/components/product/ProductCard'

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const supabase = createAdminSupabase()
  const sp = await searchParams
  let query = supabase.from('products').select('*').eq('in_stock', true)
  if (sp.brand) query = query.eq('brand', sp.brand)
  if (sp.badge) query = query.eq('badge', sp.badge)
  if (sp.max) query = query.lte('price', parseInt(sp.max))
  if (sp.q) query = query.ilike('name', `%${sp.q}%`)
  const { data: products } = await query.order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 32px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
        {sp.brand ? `${sp.brand} Phones` : sp.q ? `Results for "${sp.q}"` : 'All Phones'}
      </h1>
      <p style={{ color: '#888', marginBottom: 40 }}>{products?.length || 0} phones found</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {products?.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {!products?.length && <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>No phones found. Try a different search.</div>}
    </div>
  )
}