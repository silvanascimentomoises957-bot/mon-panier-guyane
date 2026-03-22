export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          short_description: string
          price: number
          stock: number
          category: 'fruits' | 'legumes' | 'mix' | 'bio' | 'solo' | 'smoothie'
          image_url: string | null
          emoji: string
          is_promo: boolean
          tags: string[]
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: {
          id: string
          created_at: string
          client_id: string
          status: 'attente' | 'preparation' | 'route' | 'livre'
          delivery_type: 'livraison' | 'retrait'
          delivery_address: string | null
          store_location: string | null
          payment_method: 'carte' | 'mobile' | 'livraison'
          payment_status: 'pending' | 'paid' | 'failed'
          total: number
          items: OrderItem[]
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          full_name: string
          email: string
          phone: string | null
          loyalty_points: number
          loyalty_level: 'bronze' | 'silver' | 'or' | 'platine'
          addresses: Address[]
          is_admin: boolean
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
    }
  }
}

export interface OrderItem {
  product_id: string
  name: string
  emoji: string
  image_url: string | null
  quantity: number
  unit_price: number
}

export interface Address {
  id: string
  label: string
  street: string
  city: string
  zip: string
  is_default: boolean
}

// Convenience types
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
