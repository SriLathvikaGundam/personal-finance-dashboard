import { useState } from 'react'
import useFinanceStore from '../store/useFinanceStore'
import { X } from 'lucide-react'

const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
const expenseCategories = ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Bills', 'Other']

export default function AddTransactionModal({ isOpen, onClose }) {
  const addTransaction = useFinanceStore((state) => state.addTransaction)

  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const categories = type === 'income' ? incomeCategories : expenseCategories

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || !category || !description) return

    addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
    })

    // Reset form
    setAmount('')
    setCategory('')
    setDescription('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Add Transaction</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-3 bg-gray-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-3 rounded-xl font-medium ${type === 'expense' ? 'bg-white shadow-sm' : ''}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-3 rounded-xl font-medium ${type === 'income' ? 'bg-white shadow-sm' : ''}`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-5 py-4 text-2xl font-medium border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Groceries, Salary, etc."
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-medium hover:bg-emerald-700"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}