'use client'

import { 
  HomeIcon, 
  ShoppingCartIcon, 
  CubeIcon, 
  UsersIcon, 
  ChartBarIcon,
  CogIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  currentView: string
  setCurrentView: (view: string) => void
}

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
  { id: 'dolibarr', name: 'Dolibarr ERP', icon: BuildingOfficeIcon },
  // { id: 'crm', name: 'CRM', icon: UsersIcon },
  { id: 'orders', name: 'Orders', icon: ShoppingCartIcon },
  // { id: 'inventory', name: 'Inventory', icon: CubeIcon },
  // { id: 'customers', name: 'Customers', icon: UsersIcon },
  { id: 'reports', name: 'Reports', icon: ChartBarIcon },
  { id: 'settings', name: 'Settings', icon: CogIcon },
]

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 bg-primary-600">
        <h1 className="text-white text-xl font-bold">ERP System</h1>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            )
          })}
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">admin@erp.com</p>
          </div>
        </div>
      </div>
    </div>
  )
} 