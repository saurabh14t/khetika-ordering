'use client'

import { useEffect, useState } from 'react'
import { 
  BanknotesIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  CubeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CogIcon,
  DocumentTextIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  AreaChart,
  Area
} from 'recharts'
import { analyticsService } from '@/lib/database'
import { supabase } from '@/lib/supabase'

interface DolibarrStats {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  outstandingInvoices: number
  overdueInvoices: number
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  averageOrderValue: number
  totalInventoryValue: number
  lowStockItems: number
  outOfStockItems: number
  totalCustomers: number
  activeCustomers: number
  totalSuppliers: number
  totalEmployees: number
  activeProjects: number
  completedProjects: number
}

interface FinancialData {
  month: string
  revenue: number
  expenses: number
  profit: number
}

interface Order {
  id?: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  items: OrderItem[]
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed'
  order_date: string
  delivery_date?: string
  notes?: string
  created_at?: string
}

interface OrderItem {
  id?: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

const financialMetrics = [
  {
    name: 'Total Revenue',
    key: 'totalRevenue' as keyof DolibarrStats,
    change: '+15.2%',
    changeType: 'positive' as const,
    icon: CurrencyDollarIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    name: 'Net Profit',
    key: 'netProfit' as keyof DolibarrStats,
    change: '+8.7%',
    changeType: 'positive' as const,
    icon: BanknotesIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Outstanding Invoices',
    key: 'outstandingInvoices' as keyof DolibarrStats,
    change: '-12.3%',
    changeType: 'negative' as const,
    icon: DocumentTextIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    name: 'Inventory Value',
    key: 'totalInventoryValue' as keyof DolibarrStats,
    change: '+5.1%',
    changeType: 'positive' as const,
    icon: CubeIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
]

const mockFinancialData: FinancialData[] = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
  { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
  { month: 'Jun', revenue: 67000, expenses: 42000, profit: 25000 },
]

export default function DolibarrDashboard() {
  const [stats, setStats] = useState<DolibarrStats | null>(null)
  const [financialData, setFinancialData] = useState<FinancialData[]>(mockFinancialData)
  const [salesData, setSalesData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Form state for new order
  const [formData, setFormData] = useState<Order>({
    order_number: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    items: [{ product_name: '', quantity: 1, unit_price: 0, total_price: 0 }],
    total_amount: 0,
    status: 'pending',
    payment_status: 'pending',
    order_date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [dashboardStats, salesData] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getSalesData()
        ])
        
        const dolibarrStats: DolibarrStats = {
          totalRevenue: dashboardStats.totalRevenue,
          totalExpenses: dashboardStats.totalRevenue * 0.7,
          netProfit: dashboardStats.totalRevenue * 0.3,
          outstandingInvoices: Math.floor(dashboardStats.totalRevenue * 0.15),
          overdueInvoices: Math.floor(dashboardStats.totalRevenue * 0.05),
          totalOrders: dashboardStats.totalOrders,
          pendingOrders: Math.floor(dashboardStats.totalOrders * 0.2),
          completedOrders: Math.floor(dashboardStats.totalOrders * 0.8),
          averageOrderValue: dashboardStats.totalRevenue / dashboardStats.totalOrders || 0,
          totalInventoryValue: dashboardStats.totalInventoryValue,
          lowStockItems: dashboardStats.lowStockItems,
          outOfStockItems: Math.floor(dashboardStats.lowStockItems * 0.3),
          totalCustomers: dashboardStats.activeCustomers,
          activeCustomers: Math.floor(dashboardStats.activeCustomers * 0.8),
          totalSuppliers: 25,
          totalEmployees: 12,
          activeProjects: 4,
          completedProjects: 8
        }
        
        setStats(dolibarrStats)
        setSalesData(salesData)
      } catch (error) {
        console.error('Error fetching Dolibarr dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const generateOrderNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `ORD-${year}${month}${day}-${random}`
  }

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product_name: '', quantity: 1, unit_price: 0, total_price: 0 }]
    }))
  }

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.items]
      newItems[index] = { ...newItems[index], [field]: value }
      
      // Calculate total price for this item
      if (field === 'quantity' || field === 'unit_price') {
        newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price
      }
      
      // Calculate total amount
      const totalAmount = newItems.reduce((sum, item) => sum + item.total_price, 0)
      
      return {
        ...prev,
        items: newItems,
        total_amount: totalAmount
      }
    })
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const orderData = {
        ...formData,
        order_number: formData.order_number || generateOrderNumber()
      }

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()

      if (error) throw error

      setShowOrderModal(false)
      setFormData({
        order_number: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        items: [{ product_name: '', quantity: 1, unit_price: 0, total_price: 0 }],
        total_amount: 0,
        status: 'pending',
        payment_status: 'pending',
        order_date: new Date().toISOString().split('T')[0],
        notes: ''
      })
      
      fetchOrders()
      // Refresh dashboard stats
      const [dashboardStats] = await Promise.all([
        analyticsService.getDashboardStats()
      ])
      
      // Update stats with new order data
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          totalOrders: prev.totalOrders + 1,
          pendingOrders: prev.pendingOrders + 1
        } : null)
      }
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)

      if (error) throw error
      fetchOrders()
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      
      return matchesSearch && matchesStatus
    })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dolibarr ERP Dashboard</h1>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dolibarr ERP Dashboard</h1>
          <p className="text-sm text-gray-500">Comprehensive Business Management System</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="btn-primary flex items-center"
          >
            <CogIcon className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Dolibarr Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* General Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input 
                      type="text" 
                      defaultValue="Khetika Business Solutions"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Zone
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Low stock alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Overdue invoice reminders</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">New order notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Weekly reports</span>
                  </label>
                </div>
              </div>

              {/* Integration Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Integrations</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Enable AI Chatbot</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Email integration</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Save settings logic here
                  setShowSettings(false)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Management Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Order Form */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Order</h3>
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customer_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.customer_email}
                        onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customer_phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Order Items */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Order Items</label>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        + Add Item
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {formData.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-5">
                            <input
                              type="text"
                              placeholder="Product name"
                              required
                              value={item.product_name}
                              onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              min="1"
                              placeholder="Qty"
                              required
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Price"
                              required
                              value={item.unit_price}
                              onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              value={item.total_price}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                          </div>
                          <div className="col-span-1">
                            {formData.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.order_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, order_date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Status
                      </label>
                      <select
                        value={formData.payment_status}
                        onChange={(e) => setFormData(prev => ({ ...prev, payment_status: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Total Amount */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                      <span className="text-2xl font-bold text-gray-900">₹{formData.total_amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Order
                  </button>
                </form>
              </div>

              {/* Orders List */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                
                {/* Search and Filter */}
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Orders Table */}
                <div className="overflow-y-auto max-h-96">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.slice(0, 10).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm font-medium text-gray-900">{order.order_number}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{order.customer_name}</td>
                          <td className="px-3 py-2 text-sm font-medium text-gray-900">₹{order.total_amount.toLocaleString()}</td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => handleDeleteOrder(order.id!)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No orders found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric) => {
          const Icon = metric.icon
          const value = stats?.[metric.key]
          const displayValue = metric.key === 'totalRevenue' || metric.key === 'netProfit' || metric.key === 'outstandingInvoices' || metric.key === 'totalInventoryValue'
            ? `₹${value?.toLocaleString() || '0'}`
            : value?.toLocaleString() || '0'
          
          return (
            <div key={metric.name} className={`card ${metric.bgColor}`}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
                  <p className={`text-sm font-medium ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change} from last month
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value?.toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="expenses" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Area type="monotone" dataKey="profit" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Performance */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" />
              <Bar dataKey="orders" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowOrderModal(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingCartIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">New Order</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <DocumentTextIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Create Invoice</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <UsersIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Add Customer</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CubeIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Update Inventory</p>
          </button>
        </div>
      </div>

      {/* System Alerts */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-orange-800">Low Stock Alert</p>
              <p className="text-sm text-orange-700">5 items are running low on stock</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <ClockIcon className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-800">Overdue Invoices</p>
              <p className="text-sm text-red-700">3 invoices are overdue for payment</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800">System Status</p>
              <p className="text-sm text-green-700">All systems are running normally</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 