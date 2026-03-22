'use client'
import Image from 'next/image'
import { useCartStore } from '@/hooks/useCart'
import type { Product } from '@/types/database'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  onClick: () => void
  variant?: 'grid' | 'scroll'
}

export function ProductCard({ product, onClick, variant = 'grid' }: ProductCardProps) {
  const addItem = useCartStore(s => s.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 700)
  }

  const isScroll = variant === 'scroll'

  return (
    <div onClick={onClick}
         className={`bg-white rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform border`}
         style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow)', width: isScroll ? '155px' : undefined, flexShrink: isScroll ? 0 : undefined }}>
      {/* Image */}
      <div className="relative flex items-center justify-center"
           style={{ height: isScroll ? '105px' : '115px', background: 'var(--green-pale)' }}>
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover"/>
        ) : (
          <span className="text-5xl">{product.emoji}</span>
        )}
        {product.is_promo && (
          <span className="absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--green)' }}>PROMO</span>
        )}
      </div>
      {/* Body */}
      <div className="p-3">
        <p className="text-sm font-semibold mb-0.5 truncate" style={{ color: 'var(--text)' }}>{product.name}</p>
        <p className="text-[10px] mb-2 truncate" style={{ color: 'var(--text-muted)' }}>{product.short_description}</p>
        <div className="flex items-center justify-between">
          <span className="font-serif text-base font-bold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
            {product.price.toFixed(2).replace('.', ',')}€
          </span>
          <button onClick={handleAdd}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-lg transition-all"
                  style={{
                    background: added ? 'var(--green)' : 'var(--green-pale)',
                    border: '1px solid var(--green-border)',
                    color: added ? '#fff' : 'var(--green)',
                  }}>
            {added ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}
