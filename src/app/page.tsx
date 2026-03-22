import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/layout/BottomNav'
import { HomeClient } from '@/components/client/HomeClient'

export default async function HomePage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <main className="pb-nav min-h-screen" style={{ background: 'var(--cream)' }}>
      <HomeClient products={products || []} />
      <BottomNav />
    </main>
  )
}
