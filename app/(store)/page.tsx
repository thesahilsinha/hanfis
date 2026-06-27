export const revalidate = 0

import { createAdminSupabase } from '@/lib/supabase-server'
import Hero from '@/components/home/Hero'
import CategoryPills from '@/components/home/CategoryPills'
import ProductsGrid from '@/components/home/ProductsGrid'
import BrandSection from '@/components/home/BrandSection'
import EMICalculator from '@/components/home/EMICalculator'
import BranchesSection from '@/components/home/BranchesSection'
import Newsletter from '@/components/home/Newsletter'
import BlogSection from '@/components/home/BlogSection'
import GallerySection from '@/components/home/GallerySection'

export default async function HomePage() {
  const supabase = createAdminSupabase()
  const [
    { data: featured },
    { data: newArrivals },
    { data: deals },
    { data: branches },
    { data: blogPosts },
    { data: gallery },
  ] = await Promise.all([
    // Featured — try featured=true first, fallback to any products
    supabase.from('products').select('*').eq('in_stock', true).eq('featured', true).limit(8),
    // New arrivals — latest 8 products regardless of badge
    supabase.from('products').select('*').eq('in_stock', true).order('created_at', { ascending: false }).limit(8),
    // Deals — try badge=sale first
    supabase.from('products').select('*').eq('in_stock', true).eq('badge', 'sale').limit(8),
    supabase.from('branches').select('*').eq('is_active', true).limit(3),
    supabase.from('blog_posts').select('*').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
    supabase.from('gallery_images').select('*').eq('is_active', true).order('sort_order').limit(9),
  ])

  // If no featured products, use latest products instead
  const featuredProducts = (featured && featured.length > 0) ? featured : (newArrivals || []).slice(0, 8)
  // If no deals, use highest discount products
  const dealProducts = (deals && deals.length > 0) ? deals : (newArrivals || []).filter(p => p.old_price).slice(0, 8)

  return (
    <>
      <Hero />
      <CategoryPills />
      <ProductsGrid title="Featured Phones" label="BEST SELLERS" products={featuredProducts} />
      <BrandSection />
      <ProductsGrid title="Latest Arrivals" label="NEW IN STORE" products={newArrivals || []} dark />
      <EMICalculator />
      {dealProducts.length > 0 && <ProductsGrid title="Today's Deals" label="LIMITED TIME" products={dealProducts} />}
      <BlogSection posts={blogPosts || []} />
      <GallerySection images={gallery || []} />
      <BranchesSection branches={branches || []} />
      <Newsletter />
    </>
  )
}