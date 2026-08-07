'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { formatPrice, formatDiscount, getWhatsAppLink } from '@/lib/utils'
import ProductCard from './ProductCard'
import type { Product } from '@/types'

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

  // Group variants by RAM+Storage combos
  const storageVariants = variants?.filter(v => v.id !== product.id) || []

  // Get unique storage options
  const uniqueStorages = variants
    ? [...new Map(variants.map(v => [v.storage, v])).values()].sort((a, b) => {
        const parse = (s: string) => parseInt(s?.replace(/[^0-9]/g, '') || '0')
        return parse(a.storage) - parse(b.storage)
      })
    : []

  // Get unique RAM options
  const uniqueRAMs = variants
    ? [...new Map(variants.map(v => [v.ram, v])).values()].sort((a, b) => {
        const parse = (s: string) => parseInt(s?.replace(/[^0-9]/g, '') || '0')
        return parse(a.ram) - parse(b.ram)
      })
    : []

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
          <h1 style={{ fontSize: 'clamp(20px,4vw,30px)', fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800 }}>{formatPrice(product.price)}</span>
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

          {/* RAM SELECTOR */}
          {uniqueRAMs.length > 1 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                RAM: <span style={{ color: '#c8102e' }}>{product.ram || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {uniqueRAMs.map(v => (
                  <button
                    key={v.id}
                    onClick={() => router.push(`/products/${v.slug}`)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: `2px solid ${v.ram === product.ram ? '#0a0a0a' : '#e8e8e8'}`,
                      background: v.ram === product.ram ? '#0a0a0a' : '#fff',
                      color: v.ram === product.ram ? '#fff' : '#0a0a0a',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all .2s'
                    }}>
                    {v.ram}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STORAGE SELECTOR */}
          {uniqueStorages.length > 1 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                Storage: <span style={{ color: '#c8102e' }}>{product.storage || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {uniqueStorages.map(v => (
                  <button
                    key={v.id}
                    onClick={() => router.push(`/products/${v.slug}`)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: `2px solid ${v.storage === product.storage ? '#0a0a0a' : '#e8e8e8'}`,
                      background: v.storage === product.storage ? '#0a0a0a' : '#fff',
                      color: v.storage === product.storage ? '#fff' : '#0a0a0a',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all .2s'
                    }}>
                    {v.storage}
                    <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>{formatPrice(v.price)}</div>
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
                {/* Show RAM and Storage from columns first */}
                {product.ram && (
                  <div style={{ background: '#f9f9f9', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>RAM</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{product.ram}</div>
                  </div>
                )}
                {product.storage && (
                  <div style={{ background: '#f9f9f9', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Storage</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{product.storage}</div>
                  </div>
                )}
                {Object.entries(product.specs)
                  .filter(([k]) => !['RAM', 'Storage', 'ram', 'storage'].includes(k))
                  .map(([k, v]) => (
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
              onClick={() => addItem({
                id: product.id, name: product.name, brand: product.brand,
                price: product.price, image: product.images?.[0] || '',
                quantity: 1, slug: product.slug
              })}
              style={{ flex: 1, padding: 14, background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Add to Cart
            </button>
            <a href={waLink} target="_blank" rel="noreferrer"
              style={{ padding: '14px 18px', background: '#25d366', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              WhatsApp
            </a>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            {['✅ Official Warranty', '🚚 Same Day Delivery', '↩️ 7-Day Returns', '🔒 Secure Payment'].map(b => (
              <span key={b} style={{ fontSize: 11, color: '#888' }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, marginBottom: 20 }}>
            Related Products
          </h2>
          <div className="products-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}