import Link from 'next/link'

export default function ProductsPagination({
  currentPage,
  totalPages,
  baseParams,
  basePath = '/products'
}: {
  currentPage: number
  totalPages: number
  baseParams: string
  basePath?: string
}) {
  if (totalPages <= 1) return null

  function getHref(page: number) {
    const params = new URLSearchParams(baseParams)
    params.set('page', String(page))
    return `${basePath}?${params.toString()}`
  }

  // Build page numbers to show
  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 48, flexWrap: 'wrap' }}>
      {/* Prev */}
      {currentPage > 1 ? (
        <Link href={getHref(currentPage - 1)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '9px 16px', borderRadius: 10, border: '1.5px solid #e8e8e8', fontSize: 13, fontWeight: 600, color: '#0a0a0a', textDecoration: 'none', background: '#fff', transition: 'all .2s' }}>
          ← Prev
        </Link>
      ) : (
        <span style={{ padding: '9px 16px', borderRadius: 10, border: '1.5px solid #f4f4f4', fontSize: 13, fontWeight: 600, color: '#ccc', background: '#fafafa' }}>
          ← Prev
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) => p === '...' ? (
        <span key={`dots-${i}`} style={{ padding: '9px 6px', fontSize: 13, color: '#888' }}>···</span>
      ) : (
        <Link key={p} href={getHref(p as number)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38, borderRadius: 10,
            border: `1.5px solid ${p === currentPage ? '#0a0a0a' : '#e8e8e8'}`,
            background: p === currentPage ? '#0a0a0a' : '#fff',
            color: p === currentPage ? '#fff' : '#0a0a0a',
            fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'all .2s'
          }}>
          {p}
        </Link>
      ))}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link href={getHref(currentPage + 1)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '9px 16px', borderRadius: 10, border: '1.5px solid #e8e8e8', fontSize: 13, fontWeight: 600, color: '#0a0a0a', textDecoration: 'none', background: '#fff', transition: 'all .2s' }}>
          Next →
        </Link>
      ) : (
        <span style={{ padding: '9px 16px', borderRadius: 10, border: '1.5px solid #f4f4f4', fontSize: 13, fontWeight: 600, color: '#ccc', background: '#fafafa' }}>
          Next →
        </span>
      )}

      <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  )
}