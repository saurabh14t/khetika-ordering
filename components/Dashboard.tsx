'use client'

import { useEffect, useState } from 'react'
import { 
  BanknotesIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { analyticsService } from '@/lib/database'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  activeCustomers: number
  inventoryItems: number
  lowStockItems: number
  totalInventoryValue: number
}

interface SalesData {
  month: string
  sales: number
  orders: number
}

const metrics = [
  {
    name: 'Total Revenue',
    key: 'totalRevenue' as keyof DashboardStats,
    change: '+20.1%',
    changeType: 'positive' as const,
    icon: BanknotesIcon,
  },
  {
    name: 'Total Orders',
    key: 'totalOrders' as keyof DashboardStats,
    change: '+180.1%',
    changeType: 'positive' as const,
    icon: ShoppingCartIcon,
  },
  {
    name: 'Active Customers',
    key: 'activeCustomers' as keyof DashboardStats,
    change: '+19%',
    changeType: 'positive' as const,
    icon: UsersIcon,
  },
  {
    name: 'Inventory Items',
    key: 'inventoryItems' as keyof DashboardStats,
    change: '-2.3%',
    changeType: 'negative' as const,
    icon: CubeIcon,
  },
]

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [dashboardStats, salesData] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getSalesData()
        ])
        
        setStats(dashboardStats)
        setSalesData(salesData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const value = stats?.[metric.key]
          const displayValue = metric.key === 'totalRevenue' 
            ? `₹${value?.toLocaleString() || '0'}`
            : value?.toLocaleString() || '0'
          
          return (
            <div key={metric.name} className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{metric.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{displayValue}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.changeType === 'positive' ? (
                          <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowTrendingDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                        )}
                        <span className="sr-only">{metric.changeType === 'positive' ? 'Increased' : 'Decreased'} by</span>
                        {metric.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New order received', customer: 'John Doe', time: '2 minutes ago', type: 'order' },
            { action: 'Inventory updated', item: 'Product XYZ', time: '5 minutes ago', type: 'inventory' },
            { action: 'Customer registered', customer: 'Jane Smith', time: '10 minutes ago', type: 'customer' },
            { action: 'Payment processed', amount: '₹1,234', time: '15 minutes ago', type: 'payment' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 