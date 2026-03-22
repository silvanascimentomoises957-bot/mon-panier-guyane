'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BackBar } from '@/components/layout/BackBar'
import { BottomNav } from '@/components/layout/BottomNav'
import { useCartStore } from '@/hooks/useCart'
import { CheckoutSheet } from '@/components/client/CheckoutSheet'

export default function PanierPage() {
  const router = useRouter()
  const { items, updateQty, removeItem, getSubtotal, getDeliveryFee, getTotal } = useCartStore()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const subtotal = getSubtotal()
  const deliveryFee = getDeliveryFee()
  const total = getTotal()

  if (items.length === 0) {
    return (
      <main className="pb-nav min-h-screen" style={{ background: 'var(--cream)' }}>
        <BackBar title="Mon Panier" />
        <div className="flex flex-col items-center justify-center pt-32 gap-4 px-5 text-center">
          <span className="text-6xl opacity-25">🧺</span>
          <h3 className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--text-muted)' }}>Panier vide</h3>
          <p className="text-sm" style={{ color: 'var(--text-sub)' }}>Parcourez le catalogue pour ajouter des paniers</p>
          <button onClick={() => router.push('/catalogue')}
                  className="mt-2 px-6 py-3 rounded-full text-sm font-bold text-white"
                  style={{ background: 'var(--green)' }}>
            Voir le catalogue
          </button>
        </div>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="pb-nav min-h-screen" style={{ background: 'var(--cream)' }}>
      <BackBar title="Mon Panier"
               right={<span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                 {items.length} article{items.length > 1 ? 's' : ''}
               </span>} />

      <div style={{ paddingTop: '90px' }}>
        {/* Items */}
        <div className="px-5 flex flex-col gap-3 mb-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-white rounded-xl p-3 flex gap-3 items-center"
                 style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
              <div className="w-14 h-14 rounded-xl flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                   style={{ background: 'var(--green-pale)' }}>
                {product.image_url
                  ? <Image src={product.image_url} alt={product.name} fill className="object-cover"/>
                  : <span className="text-2xl">{product.emoji}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{product.name}</p>
                <p className="text-xs mb-2 truncate" style={{ color: 'var(--text-muted)' }}>{product.short_description}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(product.id, quantity - 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
                          style={{ border: '1px solid var(--border)' }}>−</button>
                  <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                  <button onClick={() => updateQty(product.id, quantity + 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
                          style={{ border: '1px solid var(--border)' }}>+</button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
                  {(product.price * quantity).toFixed(2).replace('.', ',')}€
                </p>
                <button onClick={() => removeItem(product.id)}
                        className="text-xs mt-1" style={{ color: 'var(--text-sub)' }}>Retirer</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mx-5 bg-white rounded-xl p-4 mb-4"
             style={{ border: '1.5px solid var(--green-border)', boxShadow: 'var(--shadow)' }}>
          <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2).replace('.', ',')}€</span>
          </div>
          <div className="flex justify-between text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
            <span>Livraison</span>
            <span>{deliveryFee === 0 ? 'Offerte 🎉' : `${deliveryFee.toFixed(2).replace('.', ',')}€`}</span>
          </div>
          <div className="flex justify-between pt-3 font-bold text-base"
               style={{ borderTop: '1px solid var(--border)' }}>
            <span>Total</span>
            <span style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)', fontSize: '20px' }}>
              {total.toFixed(2).replace('.', ',')}€
            </span>
          </div>
        </div>

        <div className="px-5">
          <button onClick={() => setCheckoutOpen(true)}
                  className="w-full py-4 rounded-full text-white text-sm font-bold"
                  style={{ background: 'var(--green)', boxShadow: '0 4px 16px rgba(26,107,47,0.28)' }}>
            Procéder au paiement · {total.toFixed(2).replace('.', ',')}€
          </button>
        </div>
      </div>

      {checkoutOpen && <CheckoutSheet onClose={() => setCheckoutOpen(false)} />}
      <BottomNav />
    </main>
  )
}
