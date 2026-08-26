'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

const BRANDS = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'OPPO', 'Realme', 'Motorola', 'Nothing', 'iQOO', 'Google', 'Infinix']

export default function AdminProductsClient({
  currentSearch,
  currentBrand
}: {
  currentSearch: string
  currentBrand: string
}) {
  const router = useRouter()
  const [search, setSearch] = useState(currentSearch)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) params.set('q', search.trim())
    if (currentBrand) params.set('brand', currentBrand)
    router.push(`/admin/products?${params.toString()}`)
  }

  function handleBrand(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams()
    if (currentSearch) params.set('q', currentSearch)
    if (e.target.value) params.set('brand', e.target.value)
    router.push(`/admin/products?${params.toString()}`)
  }

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
      <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 200, display: 'flex', gap: 8 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="form-input"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-primary" style={{ padding: '11px 20px', whiteSpace: 'nowrap' }}>
          Search
        </button>
        {currentSearch && (
          <Link href="/admin/products" className="btn-danger" style={{ padding: '11px 16px', display: 'flex', alignItems: 'center' }}>
            ✕
          </Link>
        )}
      </form>
      <select
        value={currentBrand}
        onChange={handleBrand}
        className="form-select"
        style={{ minWidth: 140 }}
      >
        <option value="">All Brands</option>
        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
    </div>
  )
}