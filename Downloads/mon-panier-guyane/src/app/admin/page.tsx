import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminDashClient } from '@/components/admin/AdminDashClient'
import type { Order, Product } from '@/types/database'

type AdminProfile = { is_admin: boolean }

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const typedProfile = profile as AdminProfile | null
  if (!typedProfile?.is_admin) redirect('/')

  const [{ data: orders }, { data: products }] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('products').select('*').order('created_at', { ascending: false }),
  ])

  const safeOrders = (orders ?? []) as Order[]
  const safeProducts = (products ?? []) as Product[]
  const today = new Date().toISOString().split('T')[0]
  const todayOrders = safeOrders.filter(order => order.created_at.startsWith(today))
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0)

  return (
    <AdminDashClient
      orders={safeOrders}
      products={safeProducts}
      stats={{
        todayOrders: todayOrders.length,
        todayRevenue,
        activeDeliveries: safeOrders.filter(order => order.status === 'route').length,
      }}
    />
  )
}
