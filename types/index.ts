export interface Product {
  id: string
  name: string
  slug: string
  brand: string
  category: string
  description: string
  price: number
  old_price?: number
  images: string[]
  specs: Record<string, string>
  badge?: string
  in_stock: boolean
  featured: boolean
  emi_available: boolean
  rating: number
  review_count: number
  created_at: string
  color_variants?: Array<{ color: string; hex: string; slug: string }>
related_group?: string
}

export interface UsedPhone {
  id: string
  type: 'buy' | 'sell'
  name: string
  brand: string
  model: string
  storage?: string
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  price: number
  images: string[]
  description?: string
  seller_name?: string
  seller_phone?: string
  seller_whatsapp?: string
  status: 'active' | 'sold' | 'pending'
  created_at: string
}

export interface Branch {
  id: string
  name: string
  address: string
  city: string
  phone: string
  whatsapp?: string
  image_url?: string
  google_map_url?: string
  google_map_embed?: string
  timings: string
  is_active: boolean
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_address?: string
  items: CartItem[]
  subtotal: number
  discount: number
  coupon_code?: string
  total: number
  payment_method: 'online' | 'cod'
  payment_status: 'pending' | 'paid' | 'failed'
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  notes?: string
  created_at: string
}

export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  image: string
  quantity: number
  slug: string
}

export interface Coupon {
  id: string
  code: string
  discount_type: 'percent' | 'flat'
  discount_value: number
  min_order?: number
  max_uses?: number
  used_count: number
  expires_at?: string
  is_active: boolean
  created_at: string
}

export interface SiteSettings {
  id: string
  online_payment_enabled: boolean
  cod_enabled: boolean
  announcement_text: string
  whatsapp_number: string
  updated_at: string
}