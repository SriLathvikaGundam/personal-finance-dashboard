import { Home, CreditCard, Wallet, PieChart, LogOut, Moon, Sun } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import useFinanceStore from '../store/useFinanceStore'

const menuItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/transactions', icon: CreditCard, label: 'Transactions' },
  { path: '/budgets', icon: Wallet, label: 'Budgets' },
  { path: '/reports', icon: PieChart, label: 'Reports' },
]

export default function Sidebar() {
  const { isDarkMode, toggleDarkMode } = useFinanceStore()

  return (
    <div className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col transition-colors">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-emerald-600">
          💰 FinanceFlow
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Personal Finance</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-1 rounded-2xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-emerald-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Dark Mode Toggle + Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-2xl text-sm font-medium transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )
}