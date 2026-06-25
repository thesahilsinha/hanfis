import { createAdminSupabase } from '@/lib/supabase-server'
import { MapPin, Phone } from 'lucide-react'
import type { Branch } from '@/types'

export default async function BranchesPage() {
  const supabase = createAdminSupabase()
  const { data: branches } = await supabase.from('branches').select('*').eq('is_active', true).order('created_at')

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>FIND US</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 44, fontWeight: 800, marginBottom: 12 }}>Our Branches</h1>
        <p style={{ color: '#888', fontSize: 16 }}>Visit us at any of our locations</p>
      </div>
      {!branches?.length && <p style={{ textAlign: 'center', color: '#888', fontSize: 16 }}>Branches coming soon. Call us at +91 98765 43210</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
        {branches?.map((b: Branch) => (
          <div key={b.id} style={{ borderRadius: 24, overflow: 'hidden', border: '1.5px solid #e8e8e8', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            {b.image_url ? <img src={b.image_url} alt={b.name} style={{ width: '100%', height: 260, objectFit: 'cover' }} /> : <div style={{ width: '100%', height: 260, background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>🏪</div>}
            <div style={{ padding: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>{b.name}</h2>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                <MapPin size={16} style={{ color: '#c8102e', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#4a4a4a', lineHeight: 1.5 }}>{b.address}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <Phone size={16} style={{ color: '#c8102e' }} />
                <a href={`tel:${b.phone}`} style={{ fontSize: 14, color: '#4a4a4a' }}>{b.phone}</a>
              </div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>🕐 {b.timings}</div>
              {b.google_map_embed && (
                <div style={{ marginBottom: 20, borderRadius: 12, overflow: 'hidden' }}>
                  <iframe src={b.google_map_embed} width="100%" height="200" style={{ border: 0, display: 'block' }} loading="lazy" />
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                {b.google_map_url && <a href={b.google_map_url} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '12px', background: '#0a0a0a', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>📍 Directions</a>}
                <a href={`tel:${b.phone}`} style={{ flex: 1, padding: '12px', background: '#fff', color: '#0a0a0a', borderRadius: 12, fontSize: 14, fontWeight: 600, textAlign: 'center', border: '1.5px solid #e8e8e8', textDecoration: 'none' }}>📞 Call</a>
                {b.whatsapp && <a href={`https://wa.me/${b.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '12px', background: '#25d366', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>💬 WhatsApp</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}