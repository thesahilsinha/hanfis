'use client'
import { useRouter } from 'next/navigation'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQty, total } = useCart()
  const router = useRouter()
  if (!open) return null
  return (
    <div className="cart-overlay">
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} />
      <div className="cart-drawer">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Cart ({items.length})</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {items.length === 0 && <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>Your cart is empty</div>}
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f4f4f4' }}>
              <img src={item.image || '/images/phone-placeholder.png'} alt={item.name} style={{ width: 72, height: 72, objectFit: 'contain', background: '#f9f9f9', borderRadius: 10, padding: 8, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>{item.brand}</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{formatPrice(item.price)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f4f4f4', borderRadius: 8, padding: '4px 8px' }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Minus size={14} /></button>
                    <span style={{ fontSize: 14, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c8102e', display: 'flex' }}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ padding: 24, borderTop: '1px solid #e8e8e8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 800 }}>{formatPrice(total())}</span>
            </div>
            <button onClick={() => { onClose(); router.push('/checkout') }} className="btn-primary" style={{ width: '100%', padding: 14, fontSize: 14, borderRadius: 12 }}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}