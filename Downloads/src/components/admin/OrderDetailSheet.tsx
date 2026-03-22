'use client'
import { useState } from 'react'
import type { Order } from '@/types/database'
import { createClient } from '@/lib/supabase/client'

const STATUSES = [
  { key: 'attente',     label: '⏳ En attente',  bg: '#e8f0fe', color: '#1a56d4' },
  { key: 'preparation', label: '👨‍🍳 Préparation', bg: '#fef3c7', color: '#b45309' },
  { key: 'route',       label: '🛵 En route',    bg: 'rgba(26,107,47,0.10)', color: 'var(--green)' },
  { key: 'livre',       label: '✅ Livré',        bg: 'rgba(26,107,47,0.08)', color: 'var(--green-mid)' },
]

export function OrderDetailSheet({ order, onClose, onUpdate }: {
  order: Order
  onClose: () => void
  onUpdate: (o: Order) => void
}) {
  const [status, setStatus] = useState(order.status)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('orders').update({ status }).eq('id', order.id).select().single()
    setLoading(false)
    if (data) onUpdate(data as Order)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(15,46,23,0.5)', backdropFilter: 'blur(4px)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-[430px] mx-auto rounded-t-3xl overflow-y-auto"
           style={{ maxHeight: '88vh', borderTop: '2px solid var(--green-border)', padding: '20px 22px 44px' }}>
        <div className="w-9 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border)' }}/>

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>
              #{order.id.slice(0,8).toUpperCase()}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {new Date(order.created_at).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2.5} className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Client */}
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-sub)' }}>Client</p>
        <div className="rounded-xl p-3 mb-4" style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold mb-1">{order.client_id.slice(0,12)}…</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {order.delivery_type === 'retrait' ? `🏪 Retrait · ${order.store_location}` : `📍 ${order.delivery_address}`}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>💳 {order.payment_method}</p>
        </div>

        {/* Articles */}
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-sub)' }}>Articles</p>
        <div className="flex flex-col gap-2 mb-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl"
                 style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
              <span className="text-xl w-8 text-center">{item.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>×{item.quantity} · {item.unit_price.toFixed(2).replace('.', ',')}€/u</p>
              </div>
              <p className="text-sm font-bold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
                {(item.unit_price * item.quantity).toFixed(2).replace('.', ',')}€
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-3 py-3 rounded-xl mb-5"
             style={{ background: 'var(--green-pale)', border: '1.5px solid var(--green-border)' }}>
          <span className="text-sm font-semibold">Total commande</span>
          <span className="text-lg font-bold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
            {order.total.toFixed(2).replace('.', ',')}€
          </span>
        </div>

        {/* Status */}
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-sub)' }}>Changer le statut</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {STATUSES.map(s => (
            <button key={s.key} onClick={() => setStatus(s.key as Order['status'])}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: status === s.key ? s.bg : 'var(--cream)',
                      color: status === s.key ? s.color : 'var(--text-muted)',
                      border: `1.5px solid ${status === s.key ? s.color : 'var(--border)'}`,
                    }}>
              {s.label}
            </button>
          ))}
        </div>

        <button onClick={handleUpdate} disabled={loading || status === order.status}
                className="w-full py-3.5 rounded-full text-sm font-bold text-white disabled:opacity-50"
                style={{ background: 'var(--green)', boxShadow: '0 4px 14px rgba(26,107,47,0.25)' }}>
          {loading ? 'Mise à jour…' : 'Mettre à jour le statut'}
        </button>
      </div>
    </div>
  )
}
