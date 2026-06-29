'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { formatPrice, formatDiscount, getWhatsAppLink } from '@/lib/utils'
import ProductCard from './ProductCard'
import type { Product } from '@/types'

interface ColorVariant {
  color: string
  hex: string
  slug: string
}

interface StorageVariant {
  storage: string
  price: number
  slug: string
}

export default function ProductDetail({ product, related, variants }: {
  product: Product
  related: Product[]
  variants?: Product[]
}) {
  const [imgIdx, setImgIdx] = useState(0)
  const router = useRouter()
  const addItem = useCart(s => s.addItem)
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'
  const waLink = getWhatsAppLink(waNumber, `Hi! I want to buy ${product.name} (₹${product.price.toLocaleString('en-IN')}). Is it available?`)

  const colorVariants: ColorVariant[] = product.color_variants || []

  // Group variants by storage size from name
  const storageVariants: StorageVariant[] = variants?.map(v => {
    const match = v.name.match(/(\d+GB|\d+TB)/i)
    return {
      storage: match ? match[1] : v.name,
      price: v.price,
      slug: v.slug
    }
  }) || []

  // Current storage from this product name
  const currentStorage = product.name.match(/(\d+GB|\d+TB)/i)?.[1] || ''

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 16px 64px' }}>
      <div className="product-detail-grid">
        {/* LEFT — Images */}
        <div>
          <div style={{ background: '#f9f9f9', borderRadius: 20, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden' }}>
            <img
              src={product.images?.[imgIdx] || '/images/phone-placeholder.png'}
              alt={product.name}
              style={{ maxHeight: 340, maxWidth: '100%', objectFit: 'contain', padding: 20 }}
            />
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  style={{ width: 64, height: 64, borderRadius: 10, border: `2px solid ${imgIdx === i ? '#0a0a0a' : '#e8e8e8'}`, background: '#f9f9f9', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Details */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>{product.brand}</div>
          <h1 style={{ fontSize: 'clamp(20px, 4vw, 30px)', fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800 }}>{formatPrice(product.price)}</span>
            {product.old_price && <>
              <span style={{ fontSize: 16, color: '#888', textDecoration: 'line-through' }}>{formatPrice(product.old_price)}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a8a4a', background: '#f0fdf4', padding: '3px 10px', borderRadius: 8 }}>
                {formatDiscount(product.old_price, product.price)}% OFF
              </span>
            </>}
          </div>

          {product.emi_available && (
            <div style={{ fontSize: 13, color: '#0071e3', marginBottom: 20 }}>
              No Cost EMI from {formatPrice(Math.ceil(product.price / 12))}/month
            </div>
          )}

          {/* STORAGE VARIANTS */}
          {storageVariants.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#0a0a0a' }}>
                Storage: <span style={{ color: '#c8102e' }}>{currentStorage}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {storageVariants.map(v => (
                  <button
                    key={v.slug}
                    onClick={() => router.push(`/products/${v.slug}`)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: `2px solid ${v.slug === product.slug ? '#0a0a0a' : '#e8e8e8'}`,
                      background: v.slug === product.slug ? '#0a0a0a' : '#fff',
                      color: v.slug === product.slug ? '#fff' : '#0a0a0a',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all .2s'
                    }}>
                    {v.storage}
                    <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.8, marginTop: 1 }}>{formatPrice(v.price)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* COLOR VARIANTS */}
          {colorVariants.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#0a0a0a' }}>Colors</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {colorVariants.map(c => (
                  <button
                    key={c.slug}
                    onClick={() => router.push(`/products/${c.slug}`)}
                    title={c.color}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      borderRadius: 50,
                      border: `2px solid ${c.slug === product.slug ? '#0a0a0a' : '#e8e8e8'}`,
                      background: c.slug === product.slug ? '#f9f9f9' : '#fff',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all .2s'
                    }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: c.hex, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0a0a0a' }}>{c.color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.description && (
            <p style={{ fontSize: 14, color: '#4a4a4a', lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>
          )}

          {Object.keys(product.specs || {}).length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Key Specs</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} style={{ background: '#f9f9f9', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{String(v)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => addItem({ id: product.id, name: product.name, brand: product.brand, price: product.price, image: product.images?.[0] || '', quantity: 1, slug: product.slug })}
              style={{ flex: 1, padding: 14, background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Add to Cart
            </button>
            <a href={waLink} target="_blank" rel="noreferrer"
              style={{ padding: '14px 18px', background: '#25d366', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              WhatsApp
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
            {['✅ Official Warranty', '🚚 Same Day Delivery', '↩️ 7-Day Returns', '🔒 Secure Payment'].map(b => (
              <span key={b} style={{ fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, marginBottom: 20 }}>Related Products</h2>
          <div className="products-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}