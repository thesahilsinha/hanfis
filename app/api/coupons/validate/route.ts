import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabase()
  const { code, order_total } = await req.json()
  const { data: coupon, error } = await supabase.from('coupons').select('*').eq('code', code.toUpperCase()).eq('is_active', true).single()
  if (error || !coupon) return NextResponse.json({ valid: false, message: 'Invalid coupon code' })
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return NextResponse.json({ valid: false, message: 'Coupon has expired' })
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return NextResponse.json({ valid: false, message: 'Coupon usage limit reached' })
  if (coupon.min_order && order_total < coupon.min_order) return NextResponse.json({ valid: false, message: `Minimum order of ₹${coupon.min_order.toLocaleString('en-IN')} required` })
  const discount = coupon.discount_type === 'percent' ? Math.round(order_total * coupon.discount_value / 100) : coupon.discount_value
  await supabase.from('coupons').update({ used_count: coupon.used_count + 1 }).eq('id', coupon.id)
  return NextResponse.json({ valid: true, discount, message: `${coupon.discount_type === 'percent' ? coupon.discount_value + '%' : '₹' + coupon.discount_value} discount applied!` })
}