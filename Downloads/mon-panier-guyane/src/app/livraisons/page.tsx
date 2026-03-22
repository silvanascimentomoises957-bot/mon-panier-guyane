import { createClient } from '@/lib/supabase/server'
import { BackBar } from '@/components/layout/BackBar'
import { BottomNav } from '@/components/layout/BottomNav'
import { OrderCard } from '@/components/client/OrderCard'
import type { Order } from '@/types/database'

export default async function LivraisonsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: ordersData } = user
    ? await supabase.from('orders').select('*').eq('client_id', user.id).order('created_at', { ascending: false })
    : { data: null }

  const orders = (ordersData ?? []) as Order[]

  return (
    <main className="pb-nav min-h-screen" style={{ background: 'var(--cream)' }}>
      <BackBar title="Livraisons" />
      <div style={{ paddingTop: '90px' }}>
        <p className="px-5 pb-4 text-sm" style={{ color: 'var(--text-muted)' }}>Suivi de vos commandes</p>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <span className="text-5xl opacity-20">📦</span>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="px-5 flex flex-col gap-3">
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  )
}
