import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminDashClient } from '@/components/admin/AdminDashClient'

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/')

  const [{ data: orders }, { data: products }] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('products').select('*').order('created_at', { ascending: false }),
  ])

  const today = new Date().toISOString().split('T')[0]
  const todayOrders = (orders || []).filter(o => o.created_at.startsWith(today))
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0)

  return (
    <AdminDashClient
      orders={orders || []}
      products={products || []}
      stats={{
        todayOrders: todayOrders.length,
        todayRevenue,
        activeDeliveries: (orders || []).filter(o => o.status === 'route').length,
      }}
    />
  )
}
