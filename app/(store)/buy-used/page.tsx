export const revalidate = 0
import { createAdminSupabase } from '@/lib/supabase-server'
import { formatPrice } from '@/lib/utils'
import type { UsedPhone } from '@/types'

export default async function BuyUsedPage() {
  const supabase = createAdminSupabase()
  const { data: phones } = await supabase.from('used_phones').select('*').eq('type', 'buy').eq('status', 'active').order('created_at', { ascending: false })
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'
  const conditionColors: Record<string, string> = { Excellent: '#1a8a4a', Good: '#0071e3', Fair: '#f59e0b', Poor: '#c8102e' }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 16px 64px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>CERTIFIED REFURBISHED</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, marginBottom: 12 }}>Buy Used Phones</h1>
        <p style={{ color: '#888', fontSize: 15 }}>30-point quality check · 6-month warranty · 7-day returns</p>
      </div>
      {!phones?.length && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#888', fontSize: 16 }}>
          No used phones listed right now. Check back soon or <a href={`https://wa.me/${waNumber}`} style={{ color: '#c8102e' }}>WhatsApp us</a>.
        </div>
      )}
      <div className="used-grid">
        {phones?.map((p: UsedPhone) => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e8e8e8', overflow: 'hidden' }}>
            <div style={{ height: 180, background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {p.images?.[0]
                ? <img src={p.images[0]} alt={p.name} style={{ height: '100%', width: '100%', objectFit: 'contain', padding: 16 }} />
                : <div style={{ fontSize: 40 }}>📱</div>}
              <span style={{ position: 'absolute', top: 10, right: 10, background: conditionColors[p.condition] || '#888', color: '#fff', borderRadius: 6, padding: '3px 9px', fontSize: 10, fontWeight: 700 }}>{p.condition}</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#888', marginBottom: 4 }}>{p.brand}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
              {p.storage && <div style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>{p.storage}GB</div>}
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 14 }}>{formatPrice(p.price)}</div>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi! I'm interested in: ${p.name} (${p.condition}) for ₹${p.price.toLocaleString('en-IN')}. Available?`)}`}
                target="_blank" rel="noreferrer"
                style={{ display: 'block', width: '100%', padding: 10, background: '#25d366', color: '#fff', borderRadius: 10, fontSize: 12, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                💬 Enquire on WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 48, background: '#f9f9f9', borderRadius: 20, padding: '32px 24px' }}>
        <div className="sell-steps" style={{ marginBottom: 0 }}>
          {[['♻️', '30-Point Check', 'Every device tested thoroughly'], ['🛡️', '6-Month Warranty', 'Peace of mind guaranteed'], ['↩️', '7-Day Returns', 'No questions asked'], ['⚡', 'Fast Delivery', 'Same day in Marathwada']].map(([e, t, s]) => (
            <div key={t} style={{ textAlign: 'center', background: '#fff', borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{e}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{t}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}