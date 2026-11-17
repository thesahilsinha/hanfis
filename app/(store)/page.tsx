import { getHomeData } from '@/lib/cache'
import Hero from '@/components/home/Hero'
import CategoryPills from '@/components/home/CategoryPills'
import ProductsGrid from '@/components/home/ProductsGrid'
import BrandSection from '@/components/home/BrandSection'
import FeaturedAccessories from '@/components/home/FeaturedAccessories'
import BranchesSection from '@/components/home/BranchesSection'
import Newsletter from '@/components/home/Newsletter'
import BlogSection from '@/components/home/BlogSection'
import GallerySection from '@/components/home/GallerySection'

export const revalidate = 300

export default async function HomePage() {
  const d = await getHomeData()
  const featured = d.featured.length ? d.featured : d.latest
  const deals = d.deals.length ? d.deals : d.latest.filter((p: any) => p.old_price)

  return (
    <>
      <Hero />
      <CategoryPills />
      <ProductsGrid title="Featured Phones" label="BEST SELLERS" products={featured} />
      <BrandSection />
      <ProductsGrid title="Latest Arrivals" label="NEW IN STORE" products={d.latest} dark />
      {deals.length > 0 && <ProductsGrid title="Today's Deals" label="LIMITED TIME" products={deals} />}
      <FeaturedAccessories products={d.accessories} />
      <BlogSection posts={d.blog} />
      <GallerySection images={d.gallery} />
      <BranchesSection branches={d.branches} />
      <Newsletter />
    </>
  )
}