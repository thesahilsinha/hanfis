'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'

export default function BulkUploadPage() {
  const router = useRouter()
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: 'binary' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(ws)
      setRows(data as any[])
    }
    reader.readAsBinaryString(file)
  }

  async function upload() {
    if (!rows.length) return alert('No data to upload')
    setLoading(true)
    let success = 0, failed = 0
    for (const row of rows) {
      try {
        const slug = String(row.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        const product = {
          name: String(row.name || ''),
          slug: slug + '-' + Date.now(),
          brand: String(row.brand || 'Unknown'),
          category: String(row.category || 'Smartphone'),
          price: parseInt(row.price) || 0,
          old_price: row.old_price ? parseInt(row.old_price) : null,
          description: String(row.description || ''),
          badge: row.badge || null,
          in_stock: row.in_stock !== 'false' && row.in_stock !== false,
          featured: row.featured === 'true' || row.featured === true,
          emi_available: row.emi_available !== 'false',
          images: row.image ? [String(row.image)] : [],
          specs: row.specs ? JSON.parse(String(row.specs)) : {},
        }
        const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) })
        if (res.ok) success++
        else failed++
      } catch { failed++ }
    }
    setResults({ success, failed, total: rows.length })
    setLoading(false)
  }

  function downloadTemplate() {
    const template = [{ name: 'iPhone 16 Pro Max 256GB', brand: 'Apple', category: 'Smartphone', price: 144900, old_price: 159900, description: 'Best iPhone ever', badge: 'sale', in_stock: true, featured: true, emi_available: true, image: 'https://example.com/image.jpg', specs: '{"Display":"6.9 inch OLED","RAM":"8GB"}' }]
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Products')
    XLSX.writeFile(wb, 'hanfis-products-template.xlsx')
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900 }}>
      <div className="page-header">
        <h1 className="page-title">Bulk Upload Products</h1>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: '#888' }}>← Back</button>
      </div>

      <div className="admin-form-card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Step 1 — Download Template</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Download the Excel template, fill in your products, then upload below.</p>
        <button onClick={downloadTemplate} className="btn-primary">⬇ Download Excel Template</button>
      </div>

      <div className="admin-form-card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Step 2 — Upload Filled Excel</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Columns: name, brand, category, price, old_price, description, badge, in_stock, featured, emi_available, image, specs (JSON string)</p>
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} style={{ marginBottom: 16, display: 'block' }} />
        {rows.length > 0 && (
          <div style={{ background: '#f9f9f9', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Preview — {rows.length} products found</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>{Object.keys(rows[0]).map(k => <th key={k} style={{ padding: '6px 10px', background: '#e8e8e8', textAlign: 'left', whiteSpace: 'nowrap' }}>{k}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((r, i) => (
                    <tr key={i}>{Object.values(r).map((v, j) => <td key={j} style={{ padding: '6px 10px', borderBottom: '1px solid #f4f4f4', whiteSpace: 'nowrap', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{String(v)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 5 && <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>...and {rows.length - 5} more rows</p>}
            </div>
          </div>
        )}
        <button onClick={upload} disabled={loading || !rows.length} className="btn-primary">
          {loading ? `Uploading... (${rows.length} products)` : `Upload ${rows.length} Products`}
        </button>
      </div>

      {results && (
        <div style={{ background: results.failed === 0 ? '#dcfce7' : '#fef3c7', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Upload Complete!</h3>
          <p style={{ fontSize: 14 }}>✅ {results.success} products uploaded successfully</p>
          {results.failed > 0 && <p style={{ fontSize: 14, color: '#c8102e' }}>❌ {results.failed} products failed (check for duplicate slugs)</p>}
          <button onClick={() => router.push('/admin/products')} className="btn-primary" style={{ marginTop: 16 }}>View All Products</button>
        </div>
      )}
    </div>
  )
}