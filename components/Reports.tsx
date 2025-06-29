'use client'

import { useState } from 'react'
import { 
  CalendarIcon,
  ArrowDownTrayIcon
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
  PieChart,
  Pie,
  Cell
} from 'recharts'

const salesData = [
  { month: 'Jan', sales: 4000, orders: 2400, customers: 120 },
  { month: 'Feb', sales: 3000, orders: 1398, customers: 98 },
  { month: 'Mar', sales: 2000, orders: 9800, customers: 180 },
  { month: 'Apr', sales: 2780, orders: 3908, customers: 150 },
  { month: 'May', sales: 1890, orders: 4800, customers: 200 },
  { month: 'Jun', sales: 2390, orders: 3800, customers: 160 },
]

const categoryData = [
  { name: 'Electronics', value: 400, color: '#3b82f6' },
  { name: 'Clothing', value: 300, color: '#10b981' },
  { name: 'Books', value: 200, color: '#f59e0b' },
  { name: 'Home & Garden', value: 150, color: '#ef4444' },
]

const topProducts = [
  { name: 'Laptop Pro X1', sales: 45, revenue: 58450 },
  { name: 'Wireless Mouse', sales: 32, revenue: 959 },
  { name: 'USB Cable', sales: 28, revenue: 280 },
  { name: 'Monitor 24"', sales: 25, revenue: 4999 },
]

export default function Reports() {
  const [dateRange, setDateRange] = useState('last-30-days')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-90-days">Last 90 days</option>
            <option value="last-year">Last year</option>
          </select>
          <button className="btn-secondary flex items-center">
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">₹45,231</p>
          <p className="text-sm text-green-600">+20.1% from last month</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">2,350</p>
          <p className="text-sm text-green-600">+180.1% from last month</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
          <p className="text-2xl font-bold text-gray-900">₹19.25</p>
          <p className="text-sm text-red-600">-2.3% from last month</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Customer Acquisition</h3>
          <p className="text-2xl font-bold text-gray-900">573</p>
          <p className="text-sm text-green-600">+19% from last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Trend</h3>
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

        {/* Orders Trend */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders Trend</h3>
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

      {/* Category Distribution and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium text-sm">
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₹{product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Analytics */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Analytics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 