'use client'
import { useRouter } from 'next/navigation'

export default function UsedPhoneActions({ phone }: { phone: any }) {
  const router = useRouter()
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'

  async function markSold() {
    await fetch('/api/used-phones', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: phone.id, status: 'sold' }) })
    router.refresh()
  }

  const waMsg = phone.seller_phone
    ? `Hi ${phone.seller_name || 'there'}! Regarding your ${phone.name} listed with Hanfi's Collection. Please contact us at your earliest convenience.`
    : `Enquiry about ${phone.name}`

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {phone.seller_phone && (
        <a href={`https://wa.me/${phone.seller_phone.replace(/\D/g, '')}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noreferrer"
          style={{ padding: '6px 12px', background: '#dcfce7', color: '#166534', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
          WhatsApp
        </a>
      )}
      {phone.status !== 'sold' && (
        <button onClick={markSold} style={{ padding: '6px 12px', background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          Mark Sold
        </button>
      )}
    </div>
  )
}