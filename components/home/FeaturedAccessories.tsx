import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

export default function FeaturedAccessories({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <section className="section" style={{ background: '#0a0a0a' }}>
      <div className="page-inner">
        <div className="section-head">
          <div>
            <div className="section-label">MUST-HAVE ESSENTIALS</div>
            <h2 className="section-title section-title-white">Featured <span>Accessories</span></h2>
          </div>
          <Link href="/accessories" className="view-all" style={{ color: '#fff', borderColor: '#fff' }}>View All →</Link>
        </div>
        <div className="products-grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}