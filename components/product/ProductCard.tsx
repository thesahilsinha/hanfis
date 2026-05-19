'use client'
import Link from 'next/link'
import { formatPrice, formatDiscount } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types'

const badgeColors: Record<string, string> = { sale: '#c8102e', new: '#0a0a0a', hot: '#ff6d00', featured: '#0071e3' }

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart(s => s.addItem)
  return (
    <div className="prod-card">
      <Link href={`/products/${product.slug}`}>
        <div className="prod-img-wrap">
          <img src={product.images?.[0] || '/images/phone-placeholder.png'} alt={product.name} />
          {product.badge && (
            <span className="prod-badge" style={{ background: badgeColors[product.badge] || '#0a0a0a', color: '#fff' }}>{product.badge}</span>
          )}
        </div>
      </Link>
      <div className="prod-body">
        <div className="prod-brand">{product.brand}</div>
        <Link href={`/products/${product.slug}`} className="prod-name">{product.name}</Link>
        <div className="prod-price-row">
          <span className="prod-price">{formatPrice(product.price)}</span>
          {product.old_price && <span className="prod-price-old">{formatPrice(product.old_price)}</span>}
          {product.old_price && <span className="prod-off">{formatDiscount(product.old_price, product.price)}% off</span>}
        </div>
        {product.emi_available && <div className="prod-emi">No Cost EMI from {formatPrice(Math.ceil(product.price / 12))}/mo</div>}
        <button className="btn-atc" onClick={() => addItem({ id: product.id, name: product.name, brand: product.brand, price: product.price, image: product.images?.[0] || '', quantity: 1, slug: product.slug })}>
          Add to Cart
        </button>
      </div>
    </div>
  )
}