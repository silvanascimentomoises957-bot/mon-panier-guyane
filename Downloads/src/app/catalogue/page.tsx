import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/layout/BottomNav'
import { CatalogueClient } from '@/components/client/CatalogueClient'
import type { Product } from '@/types/database'

export default async function CataloguePage() {
  const supabase = createClient()
  const { data: rawProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const products = (rawProducts ?? []) as Product[]

  return (
    <main className="pb-nav min-h-screen" style={{ background: 'var(--cream)' }}>
      <CatalogueClient products={products} />
      <BottomNav />
    </main>
  )
}
