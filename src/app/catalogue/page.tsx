import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/layout/BottomNav'
import { CatalogueClient } from '@/components/client/CatalogueClient'

export default async function CataloguePage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <main className="pb-nav min-h-screen" style={{ background: 'var(--cream)' }}>
      <CatalogueClient products={products || []} />
      <BottomNav />
    </main>
  )
}
