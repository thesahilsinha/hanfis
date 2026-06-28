'use client'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'

export default function EMICalculator() {
  const [price, setPrice] = useState(50000)
  const [tenure, setTenure] = useState(12)
  const emi = Math.ceil(price / tenure)

  return (
    <section className="emi-section">
      <div className="page-inner">
        <div className="emi-grid">
          <div>
            <div className="section-label">NO COST EMI</div>
            <h2 className="section-title section-title-white" style={{ marginBottom: 16 }}>EMI Calculator</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 28 }}>
              Zero interest. Zero processing fee. Instant approval via Bajaj Finance, HDFC, ICICI & more.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Instant 2-minute approval', 'Available on phones above ₹5,000', 'Tenures from 3 to 24 months', 'Major banks & Bajaj Finance accepted'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#c8102e', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
          <div className="emi-card">
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Phone Price</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{formatPrice(price)}</span>
              </div>
              <input type="range" min={5000} max={200000} step={1000} value={price} onChange={e => setPrice(+e.target.value)}
                style={{ width: '100%', accentColor: '#c8102e' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 10 }}>Tenure</div>
              <div className="tenure-btns">
                {[3, 6, 9, 12, 18, 24].map(t => (
                  <button key={t} onClick={() => setTenure(t)} className={`t-btn${tenure === t ? ' active' : ''}`}>{t}m</button>
                ))}
              </div>
            </div>
            <div className="emi-result">
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Monthly EMI</div>
              <div style={{ fontSize: 'clamp(32px,6vw,48px)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{formatPrice(emi)}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>{formatPrice(emi)} × {tenure} months = {formatPrice(price)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}