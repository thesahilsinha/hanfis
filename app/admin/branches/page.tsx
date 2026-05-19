import { createAdminSupabase } from '@/lib/supabase-server'
import Link from 'next/link'
import BranchActions from './BranchActions'

export default async function AdminBranches() {
  const supabase = createAdminSupabase()
  const { data: branches } = await supabase.from('branches').select('*').order('created_at')

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Branches ({branches?.length || 0})</h1>
        <Link href="/admin/branches/new" style={{ padding: '12px 24px', background: '#0a0a0a', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          + Add Branch
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {branches?.map(b => (
          <div key={b.id} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8e8e8', overflow: 'hidden' }}>
            {b.image_url ? <img src={b.image_url} alt={b.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} /> : <div style={{ height: 200, background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>🏪</div>}
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>{b.name}</h2>
                <span style={{ background: b.is_active ? '#dcfce7' : '#fee2e2', color: b.is_active ? '#166534' : '#991b1b', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{b.is_active ? 'Active' : 'Inactive'}</span>
              </div>
              <p style={{ fontSize: 13, color: '#4a4a4a', marginBottom: 6 }}>📍 {b.address}</p>
              <p style={{ fontSize: 13, color: '#4a4a4a', marginBottom: 6 }}>📞 {b.phone}</p>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>🕐 {b.timings}</p>
              <BranchActions branch={b} />
            </div>
          </div>
        ))}
        {!branches?.length && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: '#888' }}>No branches yet. Add your first branch!</div>}
      </div>
    </div>
  )
}