'use client'
import { useState } from 'react'
import { Mail, Send, CheckCircle } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) { setError('Please enter a valid email'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name }) })
      const data = await res.json()
      if (data.success) setSuccess(true)
      else setError(data.error || 'Something went wrong')
    } catch { setError('Failed to subscribe. Try again.') }
    finally { setLoading(false) }
  }

  return (
    <section style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', position: 'relative' }}>
      {/* bg decoration */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(40,116,240,0.15)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-40px', left: '10%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(192,57,43,0.12)', filter: 'blur(30px)', pointerEvents: 'none' }} />

      <div style={{ padding: 'clamp(24px,4vw,48px)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '56px', height: '56px', background: 'rgba(40,116,240,0.2)', border: '1px solid rgba(40,116,240,0.3)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Mail size={24} color="#2874f0" />
        </div>

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <CheckCircle size={48} color="#4caf50" />
            <h3 style={{ fontFamily: 'var(--font-outfit)', fontWeight: 800, fontSize: '1.4rem', color: '#fff' }}>You're in! 🎉</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Thanks for subscribing. Expect exclusive deals in your inbox!</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: 'var(--font-outfit)', fontWeight: 900, fontSize: 'clamp(1.3rem,3vw,1.8rem)', color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Get Exclusive Deals First 🎯
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
              Subscribe and be the first to know about new arrivals, flash sales, and special offers from Hanfi's Collection.
            </p>

            <div style={{ display: 'flex', gap: '10px', maxWidth: '520px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ flex: '1', minWidth: '160px', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: '14px', outline: 'none', backdropFilter: 'blur(10px)' }}
              />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                style={{ flex: '2', minWidth: '200px', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${error ? '#e74c3c' : 'rgba(255,255,255,0.1)'}`, background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: '14px', outline: 'none', backdropFilter: 'blur(10px)' }}
              />
              <button onClick={handleSubmit} disabled={loading}
                style={{ padding: '12px 24px', background: loading ? '#666' : 'linear-gradient(135deg,#C0392B,#e74c3c)', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(192,57,43,0.4)', whiteSpace: 'nowrap' }}>
                {loading ? 'Subscribing...' : <><Send size={15} /> Subscribe</>}
              </button>
            </div>

            {error && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '10px' }}>{error}</p>}
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '14px' }}>No spam. Unsubscribe anytime. 🔒</p>
          </>
        )}
      </div>
    </section>
  )
}