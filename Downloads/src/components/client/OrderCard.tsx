'use client'
import type { Order } from '@/types/database'

const STATUS_CONFIG = {
  attente:     { label: 'En attente',  cls: 'pill-attente', steps: [true, false, false, false] },
  preparation: { label: 'Préparation', cls: 'pill-prep',    steps: [true, true,  false, false] },
  route:       { label: 'En route 🛵', cls: 'pill-route',   steps: [true, true,  true,  false] },
  livre:       { label: 'Livré ✓',     cls: 'pill-livre',   steps: [true, true,  true,  true]  },
}

const STEP_LABELS = ['Confirmé', 'Préparé', 'En route', 'Livré']

export function OrderCard({ order }: { order: Order }) {
  const cfg = STATUS_CONFIG[order.status]
  const date = new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-white rounded-xl p-4" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
      {/* Top */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{date}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.cls}`}>{cfg.label}</span>
      </div>

      {/* Items */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {order.items.map((item, i) => (
          <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: 'var(--green-pale)', color: 'var(--green)' }}>
            {item.emoji} {item.name}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
          {order.delivery_type === 'retrait' ? '🏪 Retrait en magasin' : `📍 ${order.delivery_address?.split(',')[1]?.trim() || 'Livraison'}`}
        </p>
        <span className="text-base font-bold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
          {order.total.toFixed(2).replace('.', ',')}€
        </span>
      </div>

      {/* Progress track */}
      {order.status !== 'livre' && (
        <div className="flex items-center">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className="w-5 h-5 rounded-full flex items-center justify-center"
                     style={{
                       background: cfg.steps[i] ? 'var(--green)' : 'var(--border)',
                       boxShadow: cfg.steps[i] && i === cfg.steps.filter(Boolean).length - 1
                         ? '0 0 0 4px rgba(26,107,47,0.15)' : 'none',
                     }}>
                  {cfg.steps[i] && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} className="w-2.5 h-2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className="text-[8px] font-medium" style={{ color: cfg.steps[i] ? 'var(--green)' : 'var(--text-sub)' }}>
                  {label}
                </span>
              </div>
              {i < 3 && (
                <div className="flex-1 h-0.5 mx-1 mb-3"
                     style={{ background: cfg.steps[i] && cfg.steps[i+1] ? 'var(--green)' : 'var(--border)' }}/>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
