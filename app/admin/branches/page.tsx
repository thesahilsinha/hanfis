export const revalidate = 0
import { createAdminSupabase } from '@/lib/supabase-server'
import Link from 'next/link'
import type { Branch } from '@/types'
import BranchActions from './BranchActions'

export default async function AdminBranches() {
  const supabase = createAdminSupabase()
  const { data: branches } = await supabase.from('branches').select('*').order('created_at')

  return (
    <div style={{ padding: '24px 20px' }}>
      <div className="page-header">
        <h1 className="page-title">Branches ({branches?.length || 0})</h1>
        <Link href="/admin/branches/new" className="btn-primary">+ Add Branch</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {branches?.map((b: Branch) => (
          <div key={b.id} className="admin-form-card" style={{ padding: 0, overflow: 'hidden' }}>
            {b.image_url ? <img src={b.image_url} alt={b.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} /> : <div style={{ height: 180, background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🏪</div>}
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 8 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800 }}>{b.name}</h2>
                <span className="badge-status" style={{ background: b.is_active ? '#dcfce7' : '#fee2e2', color: b.is_active ? '#166534' : '#991b1b', flexShrink: 0 }}>{b.is_active ? 'Active' : 'Inactive'}</span>
              </div>
              <p style={{ fontSize: 13, color: '#4a4a4a', marginBottom: 4 }}>📍 {b.address}</p>
              <p style={{ fontSize: 13, color: '#4a4a4a', marginBottom: 4 }}>📞 {b.phone}</p>
              <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>🕐 {b.timings}</p>
              <BranchActions branch={b} />
            </div>
          </div>
        ))}
        {!branches?.length && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: '#888' }}>No branches yet.</div>}
      </div>
    </div>
  )
}