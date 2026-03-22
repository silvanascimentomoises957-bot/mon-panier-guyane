'use client'
import { useState, useMemo } from 'react'
import { BackBar } from '@/components/layout/BackBar'
import { ProductCard } from './ProductCard'
import { ProductSheet } from './ProductSheet'
import type { Product } from '@/types/database'

const FILTERS = [
  { key: 'tous', label: 'Tous' },
  { key: 'promo', label: '🏷️ Promo' },
  { key: 'bio', label: '🌿 Bio' },
  { key: 'fruits', label: '🍍 Fruits' },
  { key: 'legumes', label: '🥦 Légumes' },
  { key: 'mix', label: '🔀 Mix' },
  { key: 'solo', label: '👤 Solo' },
]

export function CatalogueClient({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('tous')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchFilter =
        filter === 'tous' ||
        (filter === 'promo' && p.is_promo) ||
        p.tags.map(t => t.toLowerCase()).includes(filter.toLowerCase()) ||
        p.category === filter
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
      return matchFilter && matchSearch
    })
  }, [products, filter, search])

  return (
    <>
      <BackBar title="Catalogue" />
      <div style={{ paddingTop: '90px' }}>
        {/* Sub-title */}
        <p className="px-5 pb-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          Paniers frais, préparés chaque matin
        </p>

        {/* Search */}
        <div className="mx-5 mb-3 flex items-center gap-3 bg-white rounded-full px-4 py-3"
             style={{ border: '1.5px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" strokeWidth={2} className="w-4 h-4 flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
                 placeholder="Rechercher un panier…"
                 className="flex-1 text-sm outline-none bg-transparent"
                 style={{ color: 'var(--text)', fontFamily: 'inherit' }}/>
        </div>

        {/* Filters */}
        <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
                    className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: filter === f.key ? 'var(--green)' : 'white',
                      color: filter === f.key ? '#fff' : 'var(--text-muted)',
                      border: `1.5px solid ${filter === f.key ? 'var(--green)' : 'var(--border)'}`,
                      fontWeight: filter === f.key ? 700 : 500,
                    }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <span className="text-6xl opacity-20">🧺</span>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Aucun panier trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-5 pb-5">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
            ))}
          </div>
        )}
      </div>

      {selected && <ProductSheet product={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
