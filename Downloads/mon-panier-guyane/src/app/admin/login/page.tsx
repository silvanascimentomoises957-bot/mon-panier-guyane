'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) { setError('Email et mot de passe obligatoires'); return }
    setLoading(true); setError('')
    const supabase = createClient()

    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })
    if (authErr) { setError('Email ou mot de passe incorrect'); setLoading(false); return }

    // Check if admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Erreur de connexion'); setLoading(false); return }

    const { data: profile } = await supabase
      .from('profiles').select('is_admin').eq('id', user.id).single()

    if (!profile?.is_admin) {
      await supabase.auth.signOut()
      setError('Accès refusé — compte non administrateur')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)',
    fontSize: '14px', fontFamily: 'inherit', color: '#fff', outline: 'none',
  } as React.CSSProperties

  return (
    <main className="min-h-screen flex flex-col justify-center px-5"
          style={{ background: 'var(--green)', maxWidth: '430px', margin: '0 auto' }}>

      {/* Logo */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
             style={{ background: 'rgba(255,255,255,0.15)' }}>🧺</div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Fraunces, serif' }}>
          Administration
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Mon Panier Guyane · Accès réservé
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5"
                   style={{ color: 'rgba(255,255,255,0.6)' }}>Email administrateur</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                   placeholder="admin@monpanierguyane.fr" style={inputStyle}/>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5"
                   style={{ color: 'rgba(255,255,255,0.6)' }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                   placeholder="••••••••" style={inputStyle}
                   onKeyDown={e => e.key === 'Enter' && handleLogin()}/>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-xs font-medium"
                 style={{ background: 'rgba(192,57,43,0.3)', color: '#fca5a5', border: '1px solid rgba(192,57,43,0.4)' }}>
              ⚠ {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading}
                  className="w-full py-4 rounded-full text-sm font-bold mt-1 disabled:opacity-50"
                  style={{ background: '#fff', color: 'var(--green)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            {loading ? 'Vérification…' : 'Accéder au panneau admin'}
          </button>
        </div>
      </div>

      {/* Back to client */}
      <div className="text-center mt-6">
        <a href="/auth" className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
          ← Retour à l'espace client
        </a>
      </div>

      {/* Security notice */}
      <div className="text-center mt-4">
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          🔒 Connexion sécurisée · Tentatives surveillées
        </p>
      </div>
    </main>
  )
}
