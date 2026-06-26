import { createAdminSupabase } from '@/lib/supabase-server'
import { MapPin, Phone } from 'lucide-react'
import type { Branch } from '@/types'

export default async function BranchesPage() {
  const supabase = createAdminSupabase()
  const { data: branches } = await supabase.from('branches').select('*').eq('is_active', true).order('created_at')

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>FIND US</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, marginBottom: 12 }}>Our Branches</h1>
        <p style={{ color: '#888', fontSize: 16 }}>Visit us at any of our locations</p>
      </div>
      {!branches?.length && <p style={{ textAlign: 'center', color: '#888' }}>Branches coming soon.</p>}
      <div className="branches-grid">
        {branches?.map((b: Branch) => (
          <div key={b.id} style={{ borderRadius: 20, overflow: 'hidden', border: '1.5px solid #e8e8e8', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', background: '#fff' }}>
            {b.image_url
              ? <img src={b.image_url} alt={b.name} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: 180, background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>🏪</div>}
            <div style={{ padding: '20px 20px 24px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14, lineHeight: 1.3, wordBreak: 'break-word' }}>{b.name}</h2>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                <MapPin size={15} style={{ color: '#c8102e', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#4a4a4a', lineHeight: 1.5, wordBreak: 'break-word' }}>{b.address}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <Phone size={15} style={{ color: '#c8102e', flexShrink: 0 }} />
                <a href={`tel:${b.phone}`} style={{ fontSize: 13, color: '#4a4a4a' }}>{b.phone}</a>
              </div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>🕐 {b.timings}</div>
              {b.google_map_embed && (
                <div style={{ marginBottom: 16, borderRadius: 10, overflow: 'hidden' }}>
                  <iframe src={b.google_map_embed} width="100%" height="180" style={{ border: 0, display: 'block' }} loading="lazy" />
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {b.google_map_url && <a href={b.google_map_url} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 80, padding: '10px', background: '#0a0a0a', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>📍 Directions</a>}
                <a href={`tel:${b.phone}`} style={{ flex: 1, minWidth: 60, padding: '10px', background: '#fff', color: '#0a0a0a', borderRadius: 10, fontSize: 13, fontWeight: 600, textAlign: 'center', border: '1.5px solid #e8e8e8', textDecoration: 'none' }}>📞 Call</a>
                {b.whatsapp && <a href={`https://wa.me/${b.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 80, padding: '10px', background: '#25d366', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>WhatsApp</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}