import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { Product } from '@/types/database'

type AdminProfile = { is_admin: boolean }

export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data ?? []) as Product[])
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const typedProfile = profile as AdminProfile | null
  if (!typedProfile?.is_admin) {
    return NextResponse.json({ error: 'Admin requis' }, { status: 403 })
  }

  const body = await request.json()
  const { data, error } = await supabase.from('products').insert(body).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data as Product, { status: 201 })
}
