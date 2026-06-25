import { createAdminSupabase } from '@/lib/supabase-server'
import ProductDetail from '@/components/product/ProductDetail'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = createAdminSupabase()
  const { slug } = await params
  const { data: product } = await supabase.from('products').select('*').eq('slug', slug).single()
  if (!product) return notFound()
  const { data: related } = await supabase.from('products').select('*').eq('brand', product.brand).neq('id', product.id).limit(4)
  return <ProductDetail product={product} related={related || []} />
}