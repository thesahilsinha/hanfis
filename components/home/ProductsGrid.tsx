"use client"
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'
import Link from 'next/link'

export default function ProductsGrid({ title, label, products, dark }: { title: string; label: string; products: Product[]; dark?: boolean }) {
  if (!products.length) return null
  return (
    <section className="section" style={{ background: dark ? '#0a0a0a' : '#fff' }}>
      <div className="page-inner">
        <div className="section-head">
          <div>
            <div className="section-label">{label}</div>
            <h2 className={`section-title${dark ? ' section-title-white' : ''}`}>{title}</h2>
          </div>
          <Link href="/products" className="view-all" style={{ color: dark ? '#fff' : undefined, borderColor: dark ? '#fff' : undefined }}>View All →</Link>
        </div>
        <div className="products-grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}