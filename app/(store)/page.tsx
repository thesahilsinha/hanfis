import { createAdminSupabase } from '@/lib/supabase-server'
import Hero from '@/components/home/Hero'
import CategoryPills from '@/components/home/CategoryPills'
import ProductsGrid from '@/components/home/ProductsGrid'
import BrandSection from '@/components/home/BrandSection'
import EMICalculator from '@/components/home/EMICalculator'
import BranchesSection from '@/components/home/BranchesSection'
import Newsletter from '@/components/home/Newsletter'

export default async function HomePage() {
  const supabase = createAdminSupabase()
  const [{ data: featured }, { data: deals }, { data: branches }] = await Promise.all([
    supabase.from('products').select('*').eq('featured', true).eq('in_stock', true).limit(8),
    supabase.from('products').select('*').eq('badge', 'sale').eq('in_stock', true).limit(8),
    supabase.from('branches').select('*').eq('is_active', true).limit(3),
  ])

  return (
    <>
      <Hero />
      <CategoryPills />
      <ProductsGrid title="Featured Phones" label="BEST SELLERS" products={featured || []} />
      <BrandSection />
      <ProductsGrid title="Today's Deals" label="LIMITED TIME" products={deals || []} dark />
      <EMICalculator />
      <BranchesSection branches={branches || []} />
      <Newsletter />
    </>
  )
}