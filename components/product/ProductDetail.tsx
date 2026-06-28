'use client'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { formatPrice, formatDiscount, getWhatsAppLink } from '@/lib/utils'
import ProductCard from './ProductCard'
import type { Product } from '@/types'

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [imgIdx, setImgIdx] = useState(0)
  const addItem = useCart(s => s.addItem)
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'
  const waLink = getWhatsAppLink(waNumber, `Hi! I want to buy ${product.name} (₹${product.price.toLocaleString('en-IN')}). Is it available?`)

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 16px 64px' }}>
      <div className="product-detail-grid">
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
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>{product.brand}</div>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>{product.name}</h1>
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
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, marginBottom: 20 }}>Related Products</h2>
          <div className="product-detail-related">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}