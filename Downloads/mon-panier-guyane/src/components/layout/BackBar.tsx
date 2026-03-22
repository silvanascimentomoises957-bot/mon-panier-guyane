'use client'
import { useRouter } from 'next/navigation'

interface BackBarProps {
  title: string
  right?: React.ReactNode
}

export function BackBar({ title, right }: BackBarProps) {
  const router = useRouter()
  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 flex items-center gap-3 px-4 border-b bg-white"
         style={{ paddingTop: 'env(safe-area-inset-top, 46px)', paddingBottom: '10px', borderColor: 'var(--border)' }}>
      <button onClick={() => router.back()}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--green-pale)', border: '1.5px solid var(--green-border)' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth={2.5} className="w-4 h-4">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <span className="font-serif text-lg font-bold flex-1" style={{ fontFamily: 'Fraunces, serif', color: 'var(--text)' }}>
        {title}
      </span>
      {right}
    </div>
  )
}
