'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/hooks/useCart'

const navItems = [
  { href: '/', label: 'Accueil', icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2 : 1.6} stroke="currentColor" className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { href: '/catalogue', label: 'Catalogue', icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2 : 1.6} stroke="currentColor" className="w-5 h-5">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )},
  { href: '/panier', label: 'Panier', icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2 : 1.6} stroke="currentColor" className="w-5 h-5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  )},
  { href: '/livraisons', label: 'Livraisons', icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2 : 1.6} stroke="currentColor" className="w-5 h-5">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )},
  { href: '/profil', label: 'Profil', icon: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2 : 1.6} stroke="currentColor" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )},
]

export function BottomNav() {
  const pathname = usePathname()
  const itemCount = useCartStore(s => s.getItemCount())

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t z-50 flex"
         style={{ borderColor: 'var(--border)', paddingBottom: 'env(safe-area-inset-bottom, 20px)', paddingTop: '10px' }}>
      {navItems.map(item => {
        const active = pathname === item.href
        return (
          <Link key={item.href} href={item.href}
                className="flex-1 flex flex-col items-center gap-1 py-1 relative"
                style={{ color: active ? 'var(--green)' : 'var(--text-sub)' }}>
            <div className="relative">
              {item.icon(active)}
              {item.href === '/panier' && itemCount > 0 && (
                <span className="absolute -top-1 -right-2 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--green)' }}>
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
