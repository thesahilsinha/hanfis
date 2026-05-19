'use client'
import { useState, useEffect } from 'react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({ online_payment_enabled: true, cod_enabled: true, announcement_text: '', whatsapp_number: '919876543210' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetch('/api/settings').then(r => r.json()).then(d => { if (d) setSettings(s => ({ ...s, ...d })) }) }, [])

  async function save() {
    setLoading(true)
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 3000)
  }

  const Toggle = ({ value, onChange, label, desc }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #f4f4f4' }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 13, color: '#888' }}>{desc}</div>
      </div>
      <button onClick={() => onChange(!value)}
        style={{ width: 52, height: 28, borderRadius: 14, background: value ? '#1a8a4a' : '#e8e8e8', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 2, left: value ? 26 : 2, width: 24, height: 24, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  )

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Settings</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Control payment methods, announcement, and store settings.</p>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1.5px solid #e8e8e8', marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Payment Methods</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Toggle which payment methods are available at checkout</p>
        <Toggle value={settings.online_payment_enabled} onChange={(v: boolean) => setSettings(s => ({ ...s, online_payment_enabled: v }))} label="Online Payment" desc="Credit/Debit cards, UPI, Net Banking" />
        <Toggle value={settings.cod_enabled} onChange={(v: boolean) => setSettings(s => ({ ...s, cod_enabled: v }))} label="Cash on Delivery" desc="Pay when you receive the phone" />
      </div>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1.5px solid #e8e8e8', marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Announcement Bar</h2>
        <input value={settings.announcement_text} onChange={e => setSettings(s => ({ ...s, announcement_text: e.target.value }))} placeholder="e.g. 🎉 Sale ends tonight! Extra 5% off on all iPhones"
          style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none' }} />
      </div>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1.5px solid #e8e8e8', marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>WhatsApp Number</h2>
        <input value={settings.whatsapp_number} onChange={e => setSettings(s => ({ ...s, whatsapp_number: e.target.value }))} placeholder="919876543210"
          style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none' }} />
        <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>Country code + number, no spaces or + (e.g. 919876543210)</p>
      </div>
      <button onClick={save} disabled={loading}
        style={{ width: '100%', padding: 16, background: saved ? '#1a8a4a' : '#0a0a0a', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'background .3s' }}>
        {saved ? '✓ Settings Saved!' : loading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}