'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Dashboard from '@/components/Dashboard'
import DolibarrDashboard from '@/components/DolibarrDashboard'
import Orders from '@/components/Orders'
import Customers from '@/components/Customers'
import Reports from '@/components/Reports'
import Chatbot from '@/components/Chatbot'
// import Inventory from '@/components/Inventory'

export default function Home() {
  const [currentView, setCurrentView] = useState('dashboard')

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'dolibarr':
        return <DolibarrDashboard />
      case 'orders':
        return <Orders />
      // case 'inventory':
      //   return <Inventory />
      case 'customers':
        return <Customers />
      case 'reports':
        return <Reports />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>
      <Chatbot />
    </div>
  )
} 