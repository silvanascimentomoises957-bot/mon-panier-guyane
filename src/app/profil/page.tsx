import { createClient } from '@/lib/supabase/server'
import { BackBar } from '@/components/layout/BackBar'
import { BottomNav } from '@/components/layout/BottomNav'
import { ProfilClient } from '@/components/client/ProfilClient'

export default async function ProfilPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('*').eq('id', user.id).single()
    : { data: null }

  return (
    <main className="pb-nav min-h-screen" style={{ background: 'var(--cream)' }}>
      <BackBar title="Mon Profil" />
      <ProfilClient profile={profile} />
      <BottomNav />
    </main>
  )
}
