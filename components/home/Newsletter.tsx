'use client'
import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <section className="newsletter-section">
      <div className="page-inner">
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>STAY UPDATED</div>
          <h2 className="section-title section-title-white" style={{ marginBottom: 16 }}>Get Exclusive Deals</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>Be the first to know about flash sales, new arrivals, and exclusive offers. No spam, unsubscribe anytime.</p>
          <div className="newsletter-form">
            <input className="newsletter-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
            <button className="newsletter-btn" onClick={() => { if (email.includes('@')) { setDone(true); setEmail('') } }}>
              {done ? '✓ Subscribed!' : 'Subscribe →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}