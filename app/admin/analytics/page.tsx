'use client'
import { useState, useEffect } from 'react'

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#888' }}>
      Loading analytics...
    </div>
  )

  const conversionRate = data?.totalViews > 0 ? ((data?.checkouts / data?.totalViews) * 100).toFixed(1) : '0'

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <span style={{ fontSize: 13, color: '#888', background: '#f4f4f4', padding: '6px 12px', borderRadius: 8 }}>Last 30 days</span>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {[
          { label: 'Product Views', value: data?.totalViews || 0, icon: '👁️', color: '#0071e3' },
          { label: 'Add to Cart', value: data?.cartAdds || 0, icon: '🛒', color: '#8b5cf6' },
          { label: 'Checkout Started', value: data?.checkouts || 0, icon: '💳', color: '#f97316' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, icon: '📈', color: '#1a8a4a' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#888' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top Products */}
      <div className="admin-table-wrap" style={{ marginBottom: 24 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e8e8', fontWeight: 700, fontSize: 15 }}>
          🔥 Most Viewed Products (Last 30 days)
        </div>
        {!data?.topProducts?.length ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#888' }}>No data yet. Views will appear here as customers browse.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Views</th>
                <th>Popularity</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.map((p: any, i: number) => {
                const maxViews = data.topProducts[0]?.views || 1
                const pct = Math.round((p.views / maxViews) * 100)
                return (
                  <tr key={p.name}>
                    <td style={{ fontWeight: 700, color: i < 3 ? '#c8102e' : '#888' }}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ fontWeight: 700 }}>{p.views}</td>
                    <td style={{ minWidth: 160 }}>
                      <div style={{ background: '#f4f4f4', borderRadius: 50, height: 8, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: '#c8102e', borderRadius: 50, transition: 'width .5s' }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Events */}
      <div className="admin-table-wrap">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e8e8', fontWeight: 700, fontSize: 15 }}>
          📋 Recent Events
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Product</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentEvents?.map((e: any) => {
                const eventLabel: Record<string, string> = {
                  product_view: '👁️ Product View',
                  add_to_cart: '🛒 Add to Cart',
                  checkout_start: '💳 Checkout',
                }
                return (
                  <tr key={e.id}>
                    <td><span className="badge-status" style={{ background: '#f4f4f4', color: '#0a0a0a' }}>{eventLabel[e.event_type] || e.event_type}</span></td>
                    <td style={{ color: '#4a4a4a', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.product_name || e.page || '—'}</td>
                    <td style={{ color: '#888', fontSize: 12 }}>{new Date(e.created_at).toLocaleString('en-IN')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vercel Analytics note */}
      <div style={{ marginTop: 20, padding: 20, background: '#f9f9f9', borderRadius: 14, fontSize: 13, color: '#666', lineHeight: 1.7 }}>
        💡 <strong>Pro tip:</strong> For deeper analytics including page views, countries, devices, and real-time visitors — go to your <a href="https://vercel.com" target="_blank" rel="noreferrer" style={{ color: '#0071e3' }}>Vercel Dashboard → Analytics tab</a>. It's free and already enabled.
      </div>
    </div>
  )
}