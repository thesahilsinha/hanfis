export const revalidate = 0
import { createAdminSupabase } from '@/lib/supabase-server'
import ProductDetail from '@/components/product/ProductDetail'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = createAdminSupabase()
  const { slug } = await params

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) return notFound()

  // Fetch storage variants (same related_group = same phone different storage)
  const { data: variants } = product.related_group
    ? await supabase
        .from('products')
        .select('id, name, price, slug, images')
        .eq('related_group', product.related_group)
        .eq('in_stock', true)
        .order('price', { ascending: true })
    : { data: [] }

  // Fetch related products (same brand, different product)
  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('brand', product.brand)
    .neq('id', product.id)
    .eq('in_stock', true)
    .not('related_group', 'eq', product.related_group || '')
    .limit(4)

  return (
    <ProductDetail
      product={product}
      related={related || []}
      variants={variants || []}
    />
  )
}