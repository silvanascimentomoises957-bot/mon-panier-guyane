'use client'
import Image from 'next/image'
import { useState } from 'react'
import { useCartStore } from '@/hooks/useCart'
import type { Product } from '@/types/database'

interface ProductSheetProps {
  product: Product | null
  onClose: () => void
}

export function ProductSheet({ product, onClose }: ProductSheetProps) {
  const [qty, setQty] = useState(1)
  const addItem = useCartStore(s => s.addItem)
  const updateQty = useCartStore(s => s.updateQty)

  if (!product) return null

  const handleAdd = () => {
    addItem(product)
    for (let i = 1; i < qty; i++) addItem(product)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(15,46,23,0.5)', backdropFilter: 'blur(4px)' }}
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-[430px] mx-auto rounded-t-3xl overflow-y-auto"
           style={{ maxHeight: '88vh', borderTop: '2px solid var(--green-border)', paddingBottom: '40px' }}>
        <div className="p-5">
          {/* Handle + close */}
          <div className="w-9 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border)' }}/>
          <div className="flex justify-end mb-2">
            <button onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2.5} className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Image / emoji */}
          <div className="w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden relative"
               style={{ background: 'var(--green-pale)' }}>
            {product.image_url
              ? <Image src={product.image_url} alt={product.name} fill className="object-cover"/>
              : <span className="text-5xl">{product.emoji}</span>}
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>{product.name}</h2>
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>🌍 Guyane Française · {product.short_description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.map(tag => (
              <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: 'var(--green-pale)', color: 'var(--green)', border: '1px solid var(--green-border)' }}>
                {tag}
              </span>
            ))}
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>{product.description}</p>

          {/* Price + qty */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-3xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
              {product.price.toFixed(2).replace('.', ',')}€
            </span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                      style={{ border: '1.5px solid var(--green-border)' }}>−</button>
              <span className="text-lg font-bold w-6 text-center" style={{ fontFamily: 'Fraunces, serif' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                      style={{ border: '1.5px solid var(--green-border)' }}>+</button>
            </div>
          </div>

          <button onClick={handleAdd}
                  className="w-full text-white font-bold py-4 rounded-full text-sm"
                  style={{ background: 'var(--green)', boxShadow: '0 4px 16px rgba(26,107,47,0.28)' }}>
            Ajouter au panier · {(product.price * qty).toFixed(2).replace('.', ',')}€
          </button>
        </div>
      </div>
    </div>
  )
}
