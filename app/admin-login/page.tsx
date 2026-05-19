'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Wrong password')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <div style={{ background: '#1f1f1f', borderRadius: 20, padding: 48, width: 380, border: '1px solid #333' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', fontFamily: 'Playfair Display, serif' }}>Hanfi's</div>
          <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>Admin Panel</div>
        </div>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', background: '#111', border: '1.5px solid #333', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', marginBottom: 12 }}
          />
          {error && <div style={{ color: '#c8102e', fontSize: 12, marginBottom: 10 }}>{error}</div>}
          <button type="submit" style={{ width: '100%', padding: '13px', background: '#c8102e', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Login to Admin
          </button>
        </form>
      </div>
    </div>
  )
}