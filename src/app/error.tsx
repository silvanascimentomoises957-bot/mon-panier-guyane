'use client'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ background: 'var(--cream)' }}>
      <span className="text-5xl mb-4">⚠️</span>
      <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
        Une erreur est survenue
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Veuillez réessayer ou contacter le support.
      </p>
      <button onClick={reset}
              className="px-6 py-3 rounded-full text-white text-sm font-bold"
              style={{ background: 'var(--green)' }}>
        Réessayer
      </button>
    </main>
  )
}
