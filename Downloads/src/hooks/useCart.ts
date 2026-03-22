import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types/database'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  deliveryType: 'livraison' | 'retrait'
  storeLocation: string | null
  paymentMethod: 'carte' | 'mobile' | 'livraison'
  deliveryAddress: string | null
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  setDeliveryType: (type: 'livraison' | 'retrait') => void
  setStoreLocation: (loc: string) => void
  setPaymentMethod: (method: 'carte' | 'mobile' | 'livraison') => void
  setDeliveryAddress: (addr: string) => void
  getSubtotal: () => number
  getDeliveryFee: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryType: 'livraison',
      storeLocation: null,
      paymentMethod: 'carte',
      deliveryAddress: null,

      addItem: (product) => set((state) => {
        const existing = state.items.find(i => i.product.id === product.id)
        if (existing) {
          return { items: state.items.map(i =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          )}
        }
        return { items: [...state.items, { product, quantity: 1 }] }
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i.product.id !== productId)
      })),

      updateQty: (productId, qty) => set((state) => {
        if (qty <= 0) return { items: state.items.filter(i => i.product.id !== productId) }
        return { items: state.items.map(i =>
          i.product.id === productId ? { ...i, quantity: qty } : i
        )}
      }),

      clearCart: () => set({ items: [] }),
      setDeliveryType: (type) => set({ deliveryType: type }),
      setStoreLocation: (loc) => set({ storeLocation: loc }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setDeliveryAddress: (addr) => set({ deliveryAddress: addr }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      getDeliveryFee: () => {
        const { deliveryType, getSubtotal } = get()
        if (deliveryType === 'retrait') return 0
        return getSubtotal() >= 30 ? 0 : 2.50
      },
      getTotal: () => get().getSubtotal() + get().getDeliveryFee(),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'mpg-cart' }
  )
)
