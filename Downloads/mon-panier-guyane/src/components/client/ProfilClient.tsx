'use client'
import type { Profile } from '@/types/database'

const LEVEL_CONFIG = {
  bronze:  { label: 'Bronze',  next: 200,  color: '#cd7f32' },
  silver:  { label: 'Argent',  next: 500,  color: '#a8a9ad' },
  or:      { label: 'Or',      next: 1000, color: '#c9a84c' },
  platine: { label: 'Platine', next: 9999, color: '#5a9e6f' },
}

interface ProfilClientProps {
  profile: Profile | null
}

export function ProfilClient({ profile }: ProfilClientProps) {
  const lvl = LEVEL_CONFIG[profile?.loyalty_level || 'bronze']
  const pts = profile?.loyalty_points || 0
  const pct = Math.min(100, Math.round(pts / lvl.next * 100))

  const rows = [
    { ico: '📍', title: 'Adresses de livraison',  sub: 'Cayenne, Guyane' },
    { ico: '💳', title: 'Moyens de paiement',     sub: 'Carte, Mobile Money' },
    { ico: '📦', title: 'Historique commandes',   sub: 'Voir toutes vos commandes' },
    { ico: '🔔', title: 'Notifications',          sub: 'Livraison, promos, nouveautés' },
  ]

  return (
    <div style={{ paddingTop: '90px' }}>
      {/* Avatar + name */}
      <div className="text-center px-5 pb-6">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold"
             style={{ background: 'var(--green-pale)', border: '3px solid var(--green-border)', color: 'var(--green)', fontFamily: 'Fraunces, serif' }}>
          {profile?.full_name?.slice(0,2).toUpperCase() || 'ML'}
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
          {profile?.full_name || 'Mon compte'}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{profile?.email || ''}</p>
      </div>

      {/* Loyalty card */}
      <div className="mx-5 mb-5 rounded-xl p-5" style={{ background: 'var(--green)', boxShadow: 'var(--shadow-md)' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-0.5">🌟 Carte Fidélité</h3>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Niveau {lvl.label}</p>
          </div>
        </div>
        <div className="text-4xl font-bold text-white mb-0.5" style={{ fontFamily: 'Fraunces, serif' }}>{pts}</div>
        <div className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px' }}>POINTS DISPONIBLES</div>
        <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div className="h-1 rounded-full bg-white transition-all" style={{ width: `${pct}%` }}/>
        </div>
        <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {lvl.next - pts} pts pour atteindre le niveau suivant
        </p>
      </div>

      {/* Account rows */}
      <div className="px-5">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-sub)' }}>Mon compte</p>
        <div className="flex flex-col gap-2 mb-5">
          {rows.slice(0, 3).map(r => (
            <div key={r.title} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer"
                 style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                     style={{ background: 'var(--green-pale)' }}>{r.ico}</div>
                <div>
                  <p className="text-sm font-semibold">{r.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.sub}</p>
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" strokeWidth={2} className="w-4 h-4">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          ))}
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-sub)' }}>Préférences</p>
        <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer mb-5"
             style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                 style={{ background: 'var(--green-pale)' }}>🔔</div>
            <div>
              <p className="text-sm font-semibold">{rows[3].title}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{rows[3].sub}</p>
            </div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" strokeWidth={2} className="w-4 h-4">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
