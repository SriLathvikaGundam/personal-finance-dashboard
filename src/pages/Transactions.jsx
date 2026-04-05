import { useState } from 'react'
import useFinanceStore from '../store/useFinanceStore'
import { format } from 'date-fns'
import { Plus, Trash2, Search } from 'lucide-react'
import AddTransactionModal from '../components/AddTransactionModal'

export default function Transactions() {
  const { transactions, deleteTransaction } = useFinanceStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTransactions = transactions
    .filter((t) => {
      if (filterType === 'all') return true
      return t.type === filterType
    })
    .filter((t) =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="p-8 dark:bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {transactions.length} total transactions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 mb-6 shadow-sm flex flex-wrap items-center gap-4 border border-gray-100 dark:border-gray-800">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'income', 'expense'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-medium transition-all capitalize ${
                filterType === type 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="text-left px-8 py-5 text-gray-500 dark:text-gray-400 font-medium">Date</th>
              <th className="text-left px-8 py-5 text-gray-500 dark:text-gray-400 font-medium">Description</th>
              <th className="text-left px-8 py-5 text-gray-500 dark:text-gray-400 font-medium">Category</th>
              <th className="text-right px-8 py-5 text-gray-500 dark:text-gray-400 font-medium">Amount</th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(t.date), 'dd MMM yyyy')}
                  </td>
                  <td className="px-8 py-5 font-medium text-gray-800 dark:text-white">{t.description}</td>
                  <td className="px-8 py-5">
                    <span className="inline-block px-4 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-3xl">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-8 py-5 text-right font-semibold text-lg ${
                    t.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {t.type === 'income' ? '+' : '-' }₹{t.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-8 py-5">
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center text-gray-400 dark:text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}