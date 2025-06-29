import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please create a .env.local file with your Supabase credentials.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Database types
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          company: string
          total_orders: number
          total_spent: number
          last_order: string | null
          status: 'active' | 'inactive' | 'vip'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          company: string
          total_orders?: number
          total_spent?: number
          last_order?: string | null
          status?: 'active' | 'inactive' | 'vip'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          company?: string
          total_orders?: number
          total_spent?: number
          last_order?: string | null
          status?: 'active' | 'inactive' | 'vip'
          created_at?: string
          updated_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          name: string
          sku: string
          category: string
          quantity: number
          min_quantity: number
          price: number
          status: 'in-stock' | 'low-stock' | 'out-of-stock'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sku: string
          category: string
          quantity: number
          min_quantity: number
          price: number
          status?: 'in-stock' | 'low-stock' | 'out-of-stock'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sku?: string
          category?: string
          quantity?: number
          min_quantity?: number
          price?: number
          status?: 'in-stock' | 'low-stock' | 'out-of-stock'
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          customer_name: string
          order_date: string
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          items_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          customer_name: string
          order_date: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          items_count: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          customer_name?: string
          order_date?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total?: number
          items_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          inventory_id: string
          product_name: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          inventory_id: string
          product_name: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          inventory_id?: string
          product_name?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
    }
  }
} 