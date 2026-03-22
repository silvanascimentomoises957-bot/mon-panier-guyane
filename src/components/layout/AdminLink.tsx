import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export async function AdminLink() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return null

  return (
    <Link href="/admin"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: 'white', border: '1.5px solid rgba(255,255,255,0.4)', color: 'var(--green)' }}>
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
      Admin
    </Link>
  )
}
