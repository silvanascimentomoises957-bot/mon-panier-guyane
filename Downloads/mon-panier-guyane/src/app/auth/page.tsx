'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'signup' | 'reset'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const reset = () => { setError(''); setMessage('') }

  const handleSubmit = async () => {
    if (!email) { setError('Email obligatoire'); return }
    setLoading(true); reset()
    const supabase = createClient()

    if (mode === 'reset') {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })
      setLoading(false)
      if (err) { setError(err.message); return }
      setMessage('Email envoyé ! Vérifiez votre boîte mail.')
      return
    }

    if (mode === 'signup') {
      if (!password || password.length < 6) { setError('Mot de passe minimum 6 caractères'); setLoading(false); return }
      const { error: err } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      })
      setLoading(false)
      if (err) { setError(err.message); return }
      setMessage('Compte créé ! Vérifiez votre email pour confirmer.')
      return
    }

    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError('Email ou mot de passe incorrect'); return }
    router.push('/')
    router.refresh()
  }

  const handleGoogle = async () => {
    setLoadingGoogle(true); reset()
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid var(--border)', background: 'var(--cream)',
    fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none',
  } as React.CSSProperties

  return (
    <main className="min-h-screen flex flex-col justify-center px-5 py-8"
          style={{ background: 'var(--cream)', maxWidth: '430px', margin: '0 auto' }}>

      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
             style={{ background: 'var(--green)' }}>🧺</div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
          Mon Panier <em>Guyane</em>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Paniers frais livrés en Guyane</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>

        {mode !== 'reset' && (
          <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'var(--cream)' }}>
            {(['login', 'signup'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); reset() }}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        background: mode === m ? '#fff' : 'transparent',
                        color: mode === m ? 'var(--green)' : 'var(--text-muted)',
                        boxShadow: mode === m ? 'var(--shadow)' : 'none',
                      }}>
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>
        )}

        {mode === 'reset' && (
          <div className="mb-5">
            <button onClick={() => { setMode('login'); reset() }}
                    className="flex items-center gap-2 text-sm font-semibold mb-3"
                    style={{ color: 'var(--green)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Retour
            </button>
            <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>Mot de passe oublié</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Entrez votre email pour recevoir un lien de réinitialisation</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {mode === 'signup' && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-sub)' }}>Nom complet</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Marie-Louise K." style={inputStyle}/>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-sub)' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="exemple@email.fr" style={inputStyle}/>
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-sub)' }}>Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                     placeholder="••••••••" style={inputStyle} onKeyDown={e => e.key === 'Enter' && handleSubmit()}/>
            </div>
          )}

          {mode === 'login' && (
            <button onClick={() => { setMode('reset'); reset() }}
                    className="text-xs text-right -mt-1 font-semibold" style={{ color: 'var(--green)' }}>
              Mot de passe oublié ?
            </button>
          )}

          {error && (
            <div className="px-4 py-3 rounded-xl text-xs font-medium"
                 style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #fecaca' }}>⚠ {error}</div>
          )}
          {message && (
            <div className="px-4 py-3 rounded-xl text-xs font-medium"
                 style={{ background: 'var(--green-pale)', color: 'var(--green)', border: '1px solid var(--green-border)' }}>✓ {message}</div>
          )}

          <button onClick={handleSubmit} disabled={loading}
                  className="w-full py-4 rounded-full text-white text-sm font-bold mt-1 disabled:opacity-50"
                  style={{ background: 'var(--green)', boxShadow: '0 4px 16px rgba(26,107,47,0.28)' }}>
            {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : mode === 'signup' ? 'Créer mon compte' : 'Envoyer le lien'}
          </button>

          {mode !== 'reset' && (
            <>
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }}/>
                <span className="text-xs" style={{ color: 'var(--text-sub)' }}>ou</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }}/>
              </div>
              <button onClick={handleGoogle} disabled={loadingGoogle}
                      className="w-full py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-3 disabled:opacity-50"
                      style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
                {loadingGoogle ? 'Redirection…' : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuer avec Google
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="text-center mt-5">
        <a href="/admin/login" className="text-xs font-medium" style={{ color: 'var(--text-sub)' }}>
          Accès administrateur →
        </a>
      </div>
    </main>
  )
}
