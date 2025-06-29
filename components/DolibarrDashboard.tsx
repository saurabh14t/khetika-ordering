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
  DocumentTextIcon
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
  }, [])

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
          <button className="btn-primary flex items-center">
            <CogIcon className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

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
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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