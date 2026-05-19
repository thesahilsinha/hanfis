'use client'
import { useRouter } from 'next/navigation'

export default function BranchActions({ branch }: { branch: any }) {
  const router = useRouter()

  async function toggle() {
    await fetch('/api/branches', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: branch.id, is_active: !branch.is_active }) })
    router.refresh()
  }

  async function deleteBranch() {
    if (!confirm('Delete this branch?')) return
    await fetch('/api/branches', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: branch.id }) })
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <button onClick={toggle} style={{ flex: 1, padding: '10px', background: branch.is_active ? '#fef3c7' : '#dcfce7', color: branch.is_active ? '#92400e' : '#166534', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        {branch.is_active ? 'Deactivate' : 'Activate'}
      </button>
      <button onClick={deleteBranch} style={{ padding: '10px 16px', background: '#fee2e2', color: '#c8102e', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        Delete
      </button>
    </div>
  )
}