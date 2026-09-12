import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminSupabase()
    const body = await req.json()
    await supabase.from('analytics_events').insert({
      event_type: body.event,
      product_id: body.product_id || null,
      product_name: body.product_name || null,
      page: body.page || null,
      metadata: body.metadata || {},
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}

export async function GET() {
  const supabase = createAdminSupabase()
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { data: topProducts },
    { data: recentEvents },
    { count: totalViews },
    { count: checkouts },
    { count: cartAdds },
  ] = await Promise.all([
    supabase.from('analytics_events').select('product_name, product_id').eq('event_type', 'product_view').gte('created_at', thirtyDaysAgo),
    supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(50),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'product_view').gte('created_at', thirtyDaysAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'checkout_start').gte('created_at', thirtyDaysAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'add_to_cart').gte('created_at', thirtyDaysAgo),
  ])

  // Count product views
  const productCounts: Record<string, { name: string; views: number }> = {}
  topProducts?.forEach(e => {
    if (!e.product_name) return
    if (!productCounts[e.product_name]) productCounts[e.product_name] = { name: e.product_name, views: 0 }
    productCounts[e.product_name].views++
  })
  const sortedProducts = Object.values(productCounts).sort((a, b) => b.views - a.views).slice(0, 10)

  return NextResponse.json({
    totalViews: totalViews || 0,
    checkouts: checkouts || 0,
    cartAdds: cartAdds || 0,
    topProducts: sortedProducts,
    recentEvents: recentEvents || [],
  })
}