'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true); setError(''); setMessage('')
    const supabase = createClient()

    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      })
      if (err) { setError(err.message); setLoading(false); return }
      setMessage('Vérifiez votre email pour confirmer votre compte.')
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) { setError('Email ou mot de passe incorrect'); setLoading(false); return }
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid var(--border)', background: 'var(--cream)',
    fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none'
  }

  return (
    <main className="min-h-screen flex flex-col justify-center px-6" style={{ background: 'var(--cream)' }}>
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
             style={{ background: 'var(--green)' }}>🧺</div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
          Mon Panier <em>Guyane</em>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Paniers frais livrés en Guyane</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'var(--cream)' }}>
          {(['login', 'signup'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setMessage('') }}
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

        <div className="flex flex-col gap-3">
          {mode === 'signup' && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5"
                     style={{ color: 'var(--text-sub)' }}>Nom complet</label>
              <input value={name} onChange={e => setName(e.target.value)}
                     placeholder="Marie-Louise K." style={inputStyle}/>
            </div>
          )}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5"
                   style={{ color: 'var(--text-sub)' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                   placeholder="exemple@email.fr" style={inputStyle}/>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5"
                   style={{ color: 'var(--text-sub)' }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                   placeholder="••••••••" style={inputStyle}/>
          </div>

          {error && <p className="text-xs font-medium text-center" style={{ color: '#c0392b' }}>⚠ {error}</p>}
          {message && <p className="text-xs font-medium text-center" style={{ color: 'var(--green)' }}>✓ {message}</p>}

          <button onClick={handleSubmit} disabled={loading || !email || !password}
                  className="w-full py-4 rounded-full text-white text-sm font-bold mt-2 disabled:opacity-50"
                  style={{ background: 'var(--green)', boxShadow: '0 4px 16px rgba(26,107,47,0.28)' }}>
            {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </div>
      </div>

      <p className="text-center text-xs mt-6" style={{ color: 'var(--text-sub)' }}>
        En continuant, vous acceptez nos conditions d'utilisation.
      </p>
    </main>
  )
}
