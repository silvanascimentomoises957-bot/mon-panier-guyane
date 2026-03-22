export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
      <div className="flex flex-col items-center gap-3">
        <span className="text-4xl animate-bounce">🧺</span>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Chargement…</p>
      </div>
    </main>
  )
}
