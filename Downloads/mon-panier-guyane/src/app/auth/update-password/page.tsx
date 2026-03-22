'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleUpdate = async () => {
    if (!password || password.length < 6) { setError('Minimum 6 caractères'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/auth'), 2000)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid var(--border)', background: 'var(--cream)',
    fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none',
  } as React.CSSProperties

  return (
    <main className="min-h-screen flex flex-col justify-center px-5"
          style={{ background: 'var(--cream)', maxWidth: '430px', margin: '0 auto' }}>

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
             style={{ background: 'var(--green)' }}>🔑</div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
          Nouveau mot de passe
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Choisissez un mot de passe sécurisé</p>
      </div>

      <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
        {success ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-bold text-lg mb-1" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
              Mot de passe mis à jour !
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Redirection en cours…</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5"
                     style={{ color: 'var(--text-sub)' }}>Nouveau mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                     placeholder="Minimum 6 caractères" style={inputStyle}/>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5"
                     style={{ color: 'var(--text-sub)' }}>Confirmer le mot de passe</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                     placeholder="Répétez le mot de passe" style={inputStyle}/>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-xs font-medium"
                   style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #fecaca' }}>
                ⚠ {error}
              </div>
            )}

            <button onClick={handleUpdate} disabled={loading}
                    className="w-full py-4 rounded-full text-white text-sm font-bold disabled:opacity-50"
                    style={{ background: 'var(--green)', boxShadow: '0 4px 16px rgba(26,107,47,0.28)' }}>
              {loading ? 'Mise à jour…' : 'Confirmer le nouveau mot de passe'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
