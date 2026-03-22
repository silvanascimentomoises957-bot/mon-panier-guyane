'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

export function ProfilClient({ profile }: { profile: Profile | null }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const lvlConfig = {
    bronze: { label: 'Bronze', next: 200 },
    silver: { label: 'Argent', next: 500 },
    or: { label: 'Or', next: 1000 },
    platine: { label: 'Platine', next: 9999 },
  }
  const lvl = lvlConfig[profile?.loyalty_level || 'bronze']
  const pts = profile?.loyalty_points || 0
  const pct = Math.min(100, Math.round((pts / lvl.next) * 100))

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', user.id)
    setLoading(false)
    setEditing(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    router.refresh()
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const inp = {
    style: {
      width: '100%', padding: '11px 14px', borderRadius: '12px',
      border: '1.5px solid var(--border)', background: 'var(--cream)',
      fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none',
    } as React.CSSProperties
  }

  return (
    <div style={{ paddingTop: '90px' }}>
      {success && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-sm font-semibold text-white"
             style={{ background: 'var(--green)', boxShadow: '0 4px 14px rgba(26,107,47,0.3)', whiteSpace: 'nowrap' }}>
          ✓ Profil mis à jour
        </div>
      )}

      {/* Avatar */}
      <div className="text-center px-5 pb-5">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold"
             style={{ background: 'var(--green-pale)', border: '3px solid var(--green-border)', color: 'var(--green)', fontFamily: 'Fraunces, serif' }}>
          {(profile?.full_name || 'ML').slice(0, 2).toUpperCase()}
        </div>

        {editing ? (
          <div className="flex flex-col gap-2 max-w-xs mx-auto">
            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nom complet" {...inp}/>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+594 694 00 00 00" {...inp}/>
            <div className="flex gap-2 mt-1">
              <button onClick={() => setEditing(false)}
                      className="flex-1 py-2.5 rounded-full text-sm font-medium"
                      style={{ background: 'var(--cream)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                Annuler
              </button>
              <button onClick={handleSave} disabled={loading}
                      className="flex-1 py-2.5 rounded-full text-sm font-bold text-white disabled:opacity-50"
                      style={{ background: 'var(--green)' }}>
                {loading ? 'Sauvegarde…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
              {profile?.full_name || 'Mon compte'}
            </h2>
            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{profile?.email || ''}</p>
            {profile?.phone && <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{profile.phone}</p>}
            <button onClick={() => setEditing(true)}
                    className="text-xs font-semibold px-4 py-1.5 rounded-full"
                    style={{ background: 'var(--green-pale)', color: 'var(--green)', border: '1px solid var(--green-border)' }}>
              ✏️ Modifier le profil
            </button>
          </>
        )}
      </div>

      {/* Loyalty card */}
      <div className="mx-5 mb-5 rounded-xl p-5" style={{ background: 'var(--green)', boxShadow: 'var(--shadow-md)' }}>
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white mb-0.5">🌟 Carte Fidélité</h3>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Niveau {lvl.label}</p>
        </div>
        <div className="text-4xl font-bold text-white mb-0.5" style={{ fontFamily: 'Fraunces, serif' }}>{pts}</div>
        <div className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px' }}>POINTS DISPONIBLES</div>
        <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div className="h-1 rounded-full bg-white" style={{ width: `${pct}%` }}/>
        </div>
        <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {lvl.next - pts} pts pour atteindre le niveau suivant
        </p>
      </div>

      {/* Menu rows */}
      <div className="px-5">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-sub)' }}>Mon compte</p>
        {[
          { ico: '📍', title: 'Adresses de livraison', sub: 'Gérer mes adresses', href: null },
          { ico: '💳', title: 'Moyens de paiement', sub: 'Carte, Mobile Money', href: null },
          { ico: '📦', title: 'Historique commandes', sub: 'Voir toutes mes commandes', href: '/livraisons' },
        ].map(r => (
          <div key={r.title} onClick={() => r.href && router.push(r.href)}
               className="bg-white rounded-xl px-4 py-3 flex items-center justify-between mb-2 cursor-pointer"
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

        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 mt-4" style={{ color: 'var(--text-sub)' }}>Préférences</p>
        <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between mb-5 cursor-pointer"
             style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                 style={{ background: 'var(--green-pale)' }}>🔔</div>
            <div>
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Livraison, promos, nouveautés</p>
            </div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" strokeWidth={2} className="w-4 h-4">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
                className="w-full py-3.5 rounded-full text-sm font-bold"
                style={{ background: 'var(--cream)', color: '#c0392b', border: '1.5px solid rgba(192,57,43,0.25)' }}>
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  )
}
