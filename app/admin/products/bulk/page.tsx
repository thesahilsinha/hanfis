'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'

export default function BulkUploadPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [fileName, setFileName] = useState('')

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws)
        setRows(data as any[])
      } catch (err) {
        alert('Error reading file. Make sure it is a valid .xlsx file')
      }
    }
    reader.readAsBinaryString(file)
  }

  async function upload() {
    if (!rows.length) return alert('No data to upload')
    setLoading(true)
    let success = 0
    let failed = 0
    for (const row of rows) {
      try {
        const name = String(row.name || '')
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4)
        const product = {
          name,
          slug,
          brand: String(row.brand || 'Unknown'),
          category: String(row.category || 'Smartphone'),
          price: parseInt(String(row.price)) || 0,
          old_price: row.old_price ? parseInt(String(row.old_price)) : null,
          description: String(row.description || ''),
          badge: row.badge ? String(row.badge) : null,
          in_stock: row.in_stock !== 'false' && row.in_stock !== false && row.in_stock !== 0,
          featured: row.featured === 'true' || row.featured === true || row.featured === 1,
          emi_available: row.emi_available !== 'false' && row.emi_available !== false,
          images: row.image ? [String(row.image)] : [],
          specs: (() => {
            try { return row.specs ? JSON.parse(String(row.specs)) : {} }
            catch { return {} }
          })(),
        }
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        })
        if (res.ok) success++
        else failed++
      } catch {
        failed++
      }
    }
    setResults({ success, failed, total: rows.length })
    setLoading(false)
  }

  function downloadTemplate() {
    const template = [
      {
        name: 'iPhone 16 Pro Max 256GB',
        brand: 'Apple',
        category: 'Smartphone',
        price: 144900,
        old_price: 159900,
        description: 'The most powerful iPhone ever with A18 Pro chip',
        badge: 'sale',
        in_stock: true,
        featured: true,
        emi_available: true,
        image: 'https://store.storeimages.cdn-apple.com/iphone.jpg',
        specs: '{"Display":"6.9 inch OLED","RAM":"8GB","Battery":"4685mAh"}',
      },
      {
        name: 'Samsung Galaxy S25 Ultra 256GB',
        brand: 'Samsung',
        category: 'Smartphone',
        price: 129999,
        old_price: 149999,
        description: 'Ultimate Android flagship with S Pen',
        badge: 'hot',
        in_stock: true,
        featured: false,
        emi_available: true,
        image: 'https://images.samsung.com/samsung.jpg',
        specs: '{"Display":"6.9 inch QHD+","RAM":"12GB","Battery":"5000mAh"}',
      },
    ]
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Products')
    XLSX.writeFile(wb, 'hanfis-products-template.xlsx')
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900 }}>
      <div className="page-header">
        <h1 className="page-title">Bulk Upload Products</h1>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: '#888' }}>
          ← Back
        </button>
      </div>

      {/* Step 1 */}
      <div className="admin-form-card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Step 1 — Download Template</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          Download the Excel template, fill in your products, then upload below. Required columns: name, brand, price.
        </p>
        <button onClick={downloadTemplate} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          ⬇ Download Excel Template
        </button>
      </div>

      {/* Step 2 */}
      <div className="admin-form-card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Step 2 — Upload Your Excel File</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
          Supported formats: .xlsx, .xls, .csv
        </p>

        {/* Custom file button */}
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFile}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, overflow: 'hidden' }}
          tabIndex={-1}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => fileRef.current?.click()}
            style={{ padding: '12px 24px', background: '#f4f4f4', color: '#0a0a0a', border: '1.5px solid #e8e8e8', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            📂 Choose File
          </button>
          <span style={{ fontSize: 14, color: fileName ? '#0a0a0a' : '#888' }}>
            {fileName || 'No file chosen'}
          </span>
        </div>

        {rows.length > 0 && (
          <div style={{ background: '#f9f9f9', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Preview — {rows.length} products found</p>
              <button onClick={() => { setRows([]); setFileName('') }} style={{ background: 'none', border: 'none', color: '#c8102e', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                Clear
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 600 }}>
                <thead>
                  <tr>
                    {Object.keys(rows[0]).map(k => (
                      <th key={k} style={{ padding: '8px 12px', background: '#e8e8e8', textAlign: 'left', whiteSpace: 'nowrap', borderRadius: 0 }}>
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                      {Object.values(r).map((v, j) => (
                        <td key={j} style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 5 && (
              <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>...and {rows.length - 5} more rows</p>
            )}
          </div>
        )}

        <button
          onClick={upload}
          disabled={loading || !rows.length}
          className="btn-primary"
          style={{ opacity: rows.length === 0 ? 0.5 : 1 }}
        >
          {loading ? `Uploading... please wait` : `⬆ Upload ${rows.length} Products`}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div style={{ background: results.failed === 0 ? '#dcfce7' : '#fef3c7', borderRadius: 16, padding: 24, border: `1px solid ${results.failed === 0 ? '#86efac' : '#fde68a'}` }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
            {results.failed === 0 ? '✅ Upload Complete!' : '⚠️ Upload finished with some errors'}
          </h3>
          <p style={{ fontSize: 14, marginBottom: 4 }}>✅ {results.success} of {results.total} products uploaded successfully</p>
          {results.failed > 0 && (
            <p style={{ fontSize: 14, color: '#c8102e', marginBottom: 4 }}>
              ❌ {results.failed} products failed — check for duplicate names or missing required fields
            </p>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button onClick={() => router.push('/admin/products')} className="btn-primary">
              View All Products
            </button>
            <button onClick={() => { setResults(null); setRows([]); setFileName('') }}
              style={{ padding: '13px 24px', background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Upload More
            </button>
          </div>
        </div>
      )}
    </div>
  )
}