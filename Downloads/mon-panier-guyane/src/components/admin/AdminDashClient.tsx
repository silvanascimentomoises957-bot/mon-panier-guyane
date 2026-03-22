
'use client'

import { useState } from 'react'
import type { Order } from '@/types/database'
import { OrderDetailSheet } from './OrderDetailSheet'
import { ProductFormSheet } from './ProductFormSheet'
import { createClient } from '@/lib/supabase/client'

type Product = {
  id: string
  is_active: boolean
}

const STATUS_CONFIG = {
  attente:     { label: 'En attente',  bg: '#e8f0fe', color: '#1a56d4' },
  preparation: { label: 'Préparation', bg: '#fef3c7', color: '#b45309' },
  route:       { label: 'En route',    bg: 'rgba(26,107,47,0.10)', color: 'var(--green)' },
  livre:       { label: 'Livré ✓',     bg: 'rgba(26,107,47,0.08)', color: 'var(--green-mid)' },
}

const TABS = ['Dashboard', 'Commandes', 'Produits']

interface Props {
  orders: Order[]
  products: Product[]
  stats: { todayOrders: number; todayRevenue: number; activeDeliveries: number }
}

export function AdminDashClient({ orders: initialOrders, products: initialProducts, stats }: Props) {
  const [tab, setTab] = useState(0)
  const [orders, setOrders] = useState(initialOrders)
  const [products, setProducts] = useState(initialProducts)
  const [orderFilter, setOrderFilter] = useState('tous')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null | 'new'>(null)

  const filteredOrders = orderFilter === 'tous' ? orders : orders.filter(o => o.status === orderFilter)

  const handleOrderUpdate = (updated: Order) => {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
    setSelectedOrder(null)
  }

  const handleProductSave = (saved: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === saved.id)
      return exists ? prev.map(p => p.id === saved.id ? saved : p) : [saved, ...prev]
    })
    setEditProduct(null)
  }

  const handleProductDelete = async (id: string) => {
    const supabase = createClient()
    await supabase.from('products').update({ is_active: false }).eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--cream)', paddingBottom: '30px' }}>
      {/* Header */}
      <div style={{ background: 'var(--green)', padding: '52px 20px 0' }}>
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Fraunces, serif' }}>Mon Panier Guyane</h1>
        <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>Administration · Tableau de bord</p>
        <div className="flex gap-0.5 p-0.5 rounded-full mb-0" style={{ background: 'rgba(0,0,0,0.15)' }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
                    className="flex-1 py-2 rounded-full text-xs font-semibold transition-all"
                    style={{ background: tab === i ? '#fff' : 'transparent', color: tab === i ? 'var(--green)' : 'rgba(255,255,255,0.6)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5">
        {/* DASHBOARD */}
        {tab === 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { v: stats.todayOrders, l: 'Commandes aujourd\'hui', d: '↑ +12% vs hier' },
                { v: `${stats.todayRevenue.toFixed(0)}€`, l: 'CA du jour', d: '↑ +8%' },
                { v: orders.length, l: 'Total commandes', d: 'Toutes périodes' },
                { v: stats.activeDeliveries, l: 'En livraison', d: '⚡ En cours' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-4" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>{s.v}</div>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{s.l}</div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--green-light)' }}>{s.d}</div>
                </div>
              ))}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-sub)' }}>Commandes récentes</p>
            {orders.slice(0, 4).map(o => <OrderRow key={o.id} order={o} onClick={() => setSelectedOrder(o)} />)}
          </>
        )}

        {/* COMMANDES */}
        {tab === 1 && (
          <>
            <div className="flex gap-2 pb-4 overflow-x-auto">
              {['tous', 'attente', 'preparation', 'route', 'livre'].map(f => (
                <button key={f} onClick={() => setOrderFilter(f)}
                        className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{
                          background: orderFilter === f ? 'var(--green)' : 'white',
                          color: orderFilter === f ? '#fff' : 'var(--text-muted)',
                          border: `1.5px solid ${orderFilter === f ? 'var(--green)' : 'var(--border)'}`,
                        }}>
                  {f === 'tous' ? 'Toutes' : STATUS_CONFIG[f as keyof typeof STATUS_CONFIG]?.label}
                </button>
              ))}
            </div>
            {filteredOrders.length === 0
              ? <div className="text-center py-16 text-sm" style={{ color: 'var(--text-sub)' }}>Aucune commande</div>
              : filteredOrders.map(o => <OrderRow key={o.id} order={o} onClick={() => setSelectedOrder(o)} />)}
          </>
        )}

        {/* PRODUITS */}
        {tab === 2 && (
          <>
            <button onClick={() => setEditProduct('new')}
                    className="w-full py-3 rounded-full text-sm font-bold text-white mb-4"
                    style={{ background: 'var(--green)', boxShadow: '0 4px 14px rgba(26,107,47,0.25)' }}>
              + Ajouter un panier
            </button>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-sub)' }}>Gestion des paniers</p>
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-xl p-3 flex items-center gap-3 mb-2"
                   style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl overflow-hidden relative flex-shrink-0"
                     style={{ background: 'var(--green-pale)' }}>
                  {p.image_url
                    ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover"/>
                    : p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    {p.price.toFixed(2).replace('.', ',')}€ · {p.stock} unité{p.stock > 1 ? 's' : ''}{p.stock <= 3 ? ' ⚠' : ''}
                  </p>
                  <div className="h-1 rounded-full" style={{ background: 'var(--border)', width: '100%' }}>
                    <div className="h-1 rounded-full transition-all"
                         style={{ width: `${Math.min(100, Math.round(p.stock / 30 * 100))}%`,
                                  background: p.stock <= 3 ? '#c0392b' : 'var(--green-light)' }}/>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => setEditProduct(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ border: '1.5px solid var(--border)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth={2} className="w-3.5 h-3.5">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button onClick={() => handleProductDelete(p.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ border: '1.5px solid var(--border)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth={2} className="w-3.5 h-3.5">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailSheet order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={handleOrderUpdate} />
      )}
      {editProduct && (
        <ProductFormSheet
          product={editProduct === 'new' ? null : editProduct}
          onClose={() => setEditProduct(null)}
          onSave={handleProductSave}
        />
      )}
    </main>
  )
}

function OrderRow({ order, onClick }: { order: Order; onClick: () => void }) {
  const cfg = STATUS_CONFIG[order.status]
  const date = new Date(order.created_at)
  const timeStr = `${date.getHours().toString().padStart(2,'0')}h${date.getMinutes().toString().padStart(2,'0')}`
  const loc = order.delivery_type === 'retrait' ? 'Retrait magasin' : (order.delivery_address?.split(',')[1]?.trim() || '')

  return (
    <div onClick={onClick} className="bg-white rounded-xl p-3 flex items-center gap-3 mb-2 cursor-pointer active:scale-[0.98] transition-transform"
         style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
      <span className="text-xl w-9 text-center">{order.items[0]?.emoji || '🧺'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{order.items.map(i => i.name).join(', ')}</p>
        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
          #{order.id.slice(0,8).toUpperCase()} · {timeStr} · {loc}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold mb-1" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
          {order.total.toFixed(2).replace('.', ',')}€
        </p>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
      </div>
    </div>
  )
}
