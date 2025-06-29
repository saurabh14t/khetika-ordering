import { supabase } from './supabase'
import type { Database } from './supabase'

type Customer = Database['public']['Tables']['customers']['Row']
type CustomerInsert = Database['public']['Tables']['customers']['Insert']
type CustomerUpdate = Database['public']['Tables']['customers']['Update']

type Inventory = Database['public']['Tables']['inventory']['Row']
type InventoryInsert = Database['public']['Tables']['inventory']['Insert']
type InventoryUpdate = Database['public']['Tables']['inventory']['Update']

type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderUpdate = Database['public']['Tables']['orders']['Update']

type OrderItem = Database['public']['Tables']['order_items']['Row']
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

// Customer functions
export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(customer: CustomerInsert): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: CustomerUpdate): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Inventory functions
export const inventoryService = {
  async getAll(): Promise<Inventory[]> {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Inventory | null> {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(item: InventoryInsert): Promise<Inventory> {
    const { data, error } = await supabase
      .from('inventory')
      .insert(item)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: InventoryUpdate): Promise<Inventory> {
    const { data, error } = await supabase
      .from('inventory')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async getLowStock(): Promise<Inventory[]> {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .or('status.eq.low-stock,status.eq.out-of-stock')
      .order('quantity', { ascending: true })
    
    if (error) throw error
    return data || []
  }
}

// Order functions
export const orderService = {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(order: OrderInsert): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: OrderUpdate): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async getByStatus(status: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getOrderWithItems(orderId: string) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    
    if (orderError) throw orderError

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
    
    if (itemsError) throw itemsError

    return { order, items: items || [] }
  }
}

// Order Items functions
export const orderItemService = {
  async create(item: OrderItemInsert): Promise<OrderItem> {
    const { data, error } = await supabase
      .from('order_items')
      .insert(item)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getByOrderId(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
    
    if (error) throw error
    return data || []
  }
}

// Analytics functions
export const analyticsService = {
  async getDashboardStats() {
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('total_orders, total_spent')
    
    if (customersError) throw customersError

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total, status')
    
    if (ordersError) throw ordersError

    const { data: inventory, error: inventoryError } = await supabase
      .from('inventory')
      .select('quantity, price, status')
    
    if (inventoryError) throw inventoryError

    const totalRevenue = customers?.reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0
    const totalOrders = customers?.reduce((sum, c) => sum + (c.total_orders || 0), 0) || 0
    const activeCustomers = customers?.filter(c => c.total_orders > 0).length || 0
    const inventoryItems = inventory?.length || 0
    const lowStockItems = inventory?.filter(i => i.status === 'low-stock' || i.status === 'out-of-stock').length || 0
    const totalInventoryValue = inventory?.reduce((sum, i) => sum + (i.quantity * i.price), 0) || 0

    return {
      totalRevenue,
      totalOrders,
      activeCustomers,
      inventoryItems,
      lowStockItems,
      totalInventoryValue
    }
  },

  async getSalesData() {
    const { data, error } = await supabase
      .from('orders')
      .select('order_date, total, status')
      .gte('order_date', new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0])
      .order('order_date')
    
    if (error) throw error

    // Group by month
    const monthlyData = data?.reduce((acc, order) => {
      const month = new Date(order.order_date).toLocaleDateString('en-US', { month: 'short' })
      if (!acc[month]) {
        acc[month] = { sales: 0, orders: 0 }
      }
      acc[month].sales += order.total
      acc[month].orders += 1
      return acc
    }, {} as Record<string, { sales: number; orders: number }>)

    return Object.entries(monthlyData || {}).map(([month, data]) => ({
      month,
      sales: Math.round(data.sales),
      orders: data.orders
    }))
  }
} 