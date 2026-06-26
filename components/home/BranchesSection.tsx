"use client"
import Link from 'next/link'
import type { Branch } from '@/types'
import { MapPin, Phone } from 'lucide-react'

export default function BranchesSection({ branches }: { branches: Branch[] }) {
  return (
    <section className="section">
      <div className="page-inner">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>FIND US</div>
          <h2 className="section-title">Our Branches</h2>
        </div>
        {branches.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Branches coming soon. Call us at +91 98765 43210</p>
        ) : (
          <div className="branches-grid" style={{ marginBottom: 32 }}>
            {branches.map(b => (
              <div key={b.id} className="branch-card">
                {b.image_url ? <img src={b.image_url} alt={b.name} className="branch-img" /> : <div className="branch-img-placeholder">🏪</div>}
                <div className="branch-body">
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{b.name}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, fontSize: 13, color: '#4a4a4a' }}>
                    <MapPin size={14} style={{ marginTop: 1, flexShrink: 0, color: '#c8102e' }} />{b.address}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, fontSize: 13, color: '#4a4a4a' }}>
                    <Phone size={14} style={{ color: '#c8102e' }} />{b.phone}
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>🕐 {b.timings}</div>
                  <div className="branch-actions">
                    {b.google_map_url && <a href={b.google_map_url} target="_blank" rel="noreferrer" className="branch-btn" style={{ background: '#0a0a0a', color: '#fff' }}>📍 Directions</a>}
                    <a href={`https://wa.me/${(b.whatsapp || b.phone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="branch-btn" style={{ background: '#25d366', color: '#fff' }}>WhatsApp</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <Link href="/branches" className="btn-hero-primary" style={{ background: '#0a0a0a', color: '#fff' }}>View All Branches →</Link>
        </div>
      </div>
    </section>
  )
}