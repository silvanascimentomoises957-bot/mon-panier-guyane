'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/hooks/useCart'
import { createClient } from '@/lib/supabase/client'

const STORES = [
  { id: 'cayenne', name: 'Mon Panier Guyane — Cayenne', address: '12 Rue Lalouette · Ouvert 7h–19h' },
  { id: 'kourou',  name: 'Mon Panier Guyane — Kourou',  address: '8 Av. des Roches · Ouvert 7h–19h' },
]

export function CheckoutSheet({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { items, deliveryType, paymentMethod, getTotal, setDeliveryType, setPaymentMethod, setStoreLocation, clearCart } = useCartStore()
  const [store, setStore] = useState('cayenne')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    const supabase = createClient()
    const total = getTotal()
    const orderItems = items.map(i => ({
      product_id: i.product.id,
      name: i.product.name,
      emoji: i.product.emoji,
      image_url: i.product.image_url,
      quantity: i.quantity,
      unit_price: i.product.price,
    }))

    const { error } = await supabase.from('orders').insert({
      status: 'attente',
      delivery_type: deliveryType,
      store_location: deliveryType === 'retrait' ? store : null,
      payment_method: paymentMethod,
      payment_status: 'pending',
      total,
      items: orderItems,
      client_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous',
      delivery_address: deliveryType === 'livraison' ? '12 Rue des Palétuviers, Cayenne 97300' : null,
      notes: null,
    })

    setLoading(false)
    if (!error) {
      clearCart()
      onClose()
      router.push('/livraisons?success=1')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(15,46,23,0.5)', backdropFilter: 'blur(4px)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-[430px] mx-auto rounded-t-3xl overflow-y-auto"
           style={{ maxHeight: '88vh', borderTop: '2px solid var(--green-border)', padding: '20px 22px 44px' }}>
        <div className="w-9 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border)' }}/>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>Finaliser la commande 🧺</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2.5} className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center px-4 py-3 rounded-xl mb-5"
             style={{ background: 'var(--green-pale)', border: '1.5px solid var(--green-border)' }}>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Total commande</span>
          <span className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
            {getTotal().toFixed(2).replace('.', ',')}€
          </span>
        </div>

        {/* Delivery mode */}
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-sub)' }}>Mode de réception</p>
        <div className="flex flex-col gap-2 mb-4">
          {[
            { key: 'livraison', icon: '🛵', title: 'Livraison à domicile', sub: 'Cayenne & communes · ~2h' },
            { key: 'retrait',   icon: '🏪', title: 'Retrait en magasin',   sub: 'Gratuit · Prêt dans 1h' },
          ].map(opt => (
            <div key={opt.key} onClick={() => setDeliveryType(opt.key as 'livraison' | 'retrait')}
                 className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                 style={{
                   border: `1.5px solid ${deliveryType === opt.key ? 'var(--green)' : 'var(--border)'}`,
                   background: deliveryType === opt.key ? 'var(--green-pale)' : 'var(--cream)',
                 }}>
              <span className="text-2xl">{opt.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{opt.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{opt.sub}</p>
              </div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center"
                   style={{ border: `2px solid ${deliveryType === opt.key ? 'var(--green)' : 'var(--border)'}`,
                            background: deliveryType === opt.key ? 'var(--green)' : 'transparent' }}>
                {deliveryType === opt.key && <div className="w-2 h-2 rounded-full bg-white"/>}
              </div>
            </div>
          ))}
        </div>

        {/* Store selector */}
        {deliveryType === 'retrait' && (
          <div className="rounded-xl p-3 mb-4" style={{ background: 'var(--green-pale)', border: '1.5px solid var(--green-border)' }}>
            <p className="text-xs font-bold mb-2" style={{ color: 'var(--green)' }}>📍 Choisir un magasin</p>
            {STORES.map(s => (
              <div key={s.id} onClick={() => { setStore(s.id); setStoreLocation(s.id) }}
                   className="bg-white rounded-xl p-3 mb-2 last:mb-0 cursor-pointer"
                   style={{ border: `1.5px solid ${store === s.id ? 'var(--green)' : 'var(--border)'}` }}>
                <p className="text-sm font-bold">{s.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.address}</p>
              </div>
            ))}
          </div>
        )}

        {/* Payment */}
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-sub)' }}>Moyen de paiement</p>
        <div className="flex flex-col gap-2 mb-5">
          {[
            { key: 'carte',    icon: '💳', title: 'Carte bancaire',      sub: 'Visa, Mastercard · Stripe' },
            { key: 'mobile',   icon: '📱', title: 'Mobile Money',        sub: 'Orange Money · Wave' },
            { key: 'livraison',icon: '💶', title: 'À la livraison',      sub: 'Espèces ou TPE' },
          ].map(opt => (
            <div key={opt.key} onClick={() => setPaymentMethod(opt.key as 'carte' | 'mobile' | 'livraison')}
                 className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                 style={{
                   border: `1.5px solid ${paymentMethod === opt.key ? 'var(--green)' : 'var(--border)'}`,
                   background: paymentMethod === opt.key ? 'var(--green-pale)' : 'var(--cream)',
                 }}>
              <span className="text-xl">{opt.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{opt.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{opt.sub}</p>
              </div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center"
                   style={{ border: `2px solid ${paymentMethod === opt.key ? 'var(--green)' : 'var(--border)'}`,
                            background: paymentMethod === opt.key ? 'var(--green)' : 'transparent' }}>
                {paymentMethod === opt.key && <div className="w-2 h-2 rounded-full bg-white"/>}
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleConfirm} disabled={loading}
                className="w-full py-4 rounded-full text-white text-sm font-bold disabled:opacity-60"
                style={{ background: 'var(--green)', boxShadow: '0 4px 16px rgba(26,107,47,0.28)' }}>
          {loading ? 'Traitement…' : 'Confirmer la commande'}
        </button>
      </div>
    </div>
  )
}
