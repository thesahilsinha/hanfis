import { unstable_cache } from 'next/cache'
import { createAdminSupabase } from '@/lib/supabase-server'

export const getHomeData = unstable_cache(
  async () => {
    const s = createAdminSupabase()
    const [featured, latest, deals, accessories, branches, blog, gallery] = await Promise.all([
      s.from('products').select('*').eq('in_stock', true).eq('featured', true).neq('category', 'Accessory').limit(8),
      s.from('products').select('*').eq('in_stock', true).neq('category', 'Accessory').order('created_at', { ascending: false }).limit(8),
      s.from('products').select('*').eq('in_stock', true).eq('badge', 'sale').neq('category', 'Accessory').limit(8),
      s.from('products').select('*').eq('in_stock', true).eq('category', 'Accessory').eq('featured', true).limit(8),
      s.from('branches').select('*').eq('is_active', true).limit(3),
      s.from('blog_posts').select('*').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
      s.from('gallery_images').select('*').eq('is_active', true).order('sort_order').limit(9),
    ])
    return {
      featured: featured.data || [], latest: latest.data || [], deals: deals.data || [],
      accessories: accessories.data || [], branches: branches.data || [],
      blog: blog.data || [], gallery: gallery.data || [],
    }
  },
  ['home-data'],
  { revalidate: 300, tags: ['products', 'branches', 'blog', 'gallery'] }
)

export const getTopProducts = unstable_cache(
  async () => {
    const { data } = await createAdminSupabase().from('products').select('*').eq('in_stock', true).order('price', { ascending: false }).limit(3)
    return data || []
  },
  ['top-products'],
  { revalidate: 300, tags: ['products'] }
)

export async function getProductList(args: { brand?: string; badge?: string; max?: number; page: number; size: number }) {
  return unstable_cache(
    async () => {
      const from = (args.page - 1) * args.size
      let q = createAdminSupabase().from('products').select('*', { count: 'exact' }).eq('in_stock', true).neq('category', 'Accessory')
      if (args.brand) q = q.eq('brand', args.brand)
      if (args.badge) q = q.eq('badge', args.badge)
      if (args.max) q = q.lte('price', args.max)
      const { data, count } = await q.order('created_at', { ascending: false }).range(from, from + args.size - 1)
      return { products: data || [], count: count || 0 }
    },
    ['product-list', JSON.stringify(args)],
    { revalidate: 300, tags: ['products'] }
  )()
}