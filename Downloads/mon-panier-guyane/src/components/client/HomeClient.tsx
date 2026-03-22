'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ProductCard } from './ProductCard'
import { ProductSheet } from './ProductSheet'
import type { Product } from '@/types/database'

export function HomeClient({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null)

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
               style={{ background: 'var(--green)' }}>🧺</div>
          <div>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>📍 Cayenne, Guyane</p>
            <h1 className="text-2xl font-bold leading-none" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
              Mon Panier <em>Guyane</em>
            </h1>
          </div>
        </div>
        <Link href="/profil"
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'var(--green-pale)', border: '2px solid var(--green-border)', color: 'var(--green)' }}>
          ML
        </Link>
      </div>

      {/* Hero */}
      <div className="mx-5 mb-6 rounded-2xl overflow-hidden relative h-52 cursor-pointer"
           onClick={() => window.location.href = '/catalogue'}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #134f22 0%, #1a6b2f 50%, #2da84a 100%)' }}/>
        <div className="absolute inset-0 opacity-5"
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}/>
        <div className="absolute text-[110px] opacity-[0.06] -right-3 -top-3 rotate-12 pointer-events-none">🌿</div>
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold w-fit mb-3"
               style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
            🌿 Récolte du jour
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
            Paniers frais<br/><em>de Guyane</em>
          </h2>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>Livrés en 2h · Cayenne & communes</p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold w-fit"
                  style={{ background: '#fff', color: 'var(--green)' }}>
            Voir le catalogue →
          </button>
        </div>
      </div>

      {/* Paniers section */}
      <div className="flex justify-between items-center px-5 mb-3">
        <h3 className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>Nos paniers</h3>
        <Link href="/catalogue" className="text-xs font-semibold" style={{ color: 'var(--green)' }}>Tout voir</Link>
      </div>
      <div className="flex gap-3 px-5 pb-6 overflow-x-auto">
        {products.slice(0, 6).map(p => (
          <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} variant="scroll" />
        ))}
      </div>

      {/* Loyalty card */}
      <div className="mx-5 mb-6 rounded-xl p-5 flex items-center justify-between"
           style={{ background: 'var(--green)', boxShadow: 'var(--shadow-md)' }}>
        <div>
          <h4 className="text-sm font-bold text-white mb-1">🌟 Carte Fidélité</h4>
          <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>Niveau Or · 380 pts pour Platine</p>
          <div className="h-1 w-40 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <div className="h-1 rounded-full bg-white" style={{ width: '62%' }}/>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white" style={{ fontFamily: 'Fraunces, serif' }}>620</div>
          <div className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px' }}>POINTS</div>
        </div>
      </div>

      {/* Product sheet modal */}
      {selected && <ProductSheet product={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
