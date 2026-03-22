import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ background: 'var(--cream)' }}>
      <span className="text-6xl mb-4">🧺</span>
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fraunces, serif', color: 'var(--green)' }}>
        Page introuvable
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link href="/"
            className="px-6 py-3 rounded-full text-white text-sm font-bold"
            style={{ background: 'var(--green)' }}>
        Retour à l'accueil
      </Link>
    </main>
  )
}
