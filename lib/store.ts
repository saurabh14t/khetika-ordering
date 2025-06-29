import { create } from 'zustand'

export interface Order {
  id: string
  customerName: string
  orderDate: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: number
  itemsList: OrderItem[]
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  minQuantity: number
  price: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  status: 'active' | 'inactive' | 'vip'
}

interface ERPStore {
  // Orders
  orders: Order[]
  addOrder: (order: Omit<Order, 'id'>) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  deleteOrder: (id: string) => void
  
  // Inventory
  inventory: InventoryItem[]
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void
  deleteInventoryItem: (id: string) => void
  
  // Customers
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, 'id'>) => void
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  
  // UI State
  currentView: string
  setCurrentView: (view: string) => void
}

export const useERPStore = create<ERPStore>((set, get) => ({
  // Initial state
  orders: [],
  inventory: [],
  customers: [],
  currentView: 'dashboard',

  // Orders actions
  addOrder: (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${Date.now()}`,
    }
    set((state) => ({
      orders: [...state.orders, newOrder],
    }))
  },

  updateOrder: (id, updates) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, ...updates } : order
      ),
    }))
  },

  deleteOrder: (id) => {
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    }))
  },

  // Inventory actions
  addInventoryItem: (item) => {
    const newItem = {
      ...item,
      id: `INV-${Date.now()}`,
    }
    set((state) => ({
      inventory: [...state.inventory, newItem],
    }))
  },

  updateInventoryItem: (id, updates) => {
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }))
  },

  deleteInventoryItem: (id) => {
    set((state) => ({
      inventory: state.inventory.filter((item) => item.id !== id),
    }))
  },

  // Customers actions
  addCustomer: (customer) => {
    const newCustomer = {
      ...customer,
      id: `CUST-${Date.now()}`,
    }
    set((state) => ({
      customers: [...state.customers, newCustomer],
    }))
  },

  updateCustomer: (id, updates) => {
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id ? { ...customer, ...updates } : customer
      ),
    }))
  },

  deleteCustomer: (id) => {
    set((state) => ({
      customers: state.customers.filter((customer) => customer.id !== id),
    }))
  },

  // UI actions
  setCurrentView: (view) => {
    set({ currentView: view })
  },
})) 