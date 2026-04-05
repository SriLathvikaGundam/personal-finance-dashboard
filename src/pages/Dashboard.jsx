import { useEffect } from 'react'
import useFinanceStore from '../store/useFinanceStore'
import { format } from 'date-fns'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { 
  PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'

export default function Dashboard() {
  const { 
    transactions, 
    budgets, 
    getBalance, 
    getTotalIncome, 
    getTotalExpense, 
    addTransaction 
  } = useFinanceStore()

  // Add realistic sample data on first load
  useEffect(() => {
    if (transactions.length === 0) {
      const samples = [
        { type: 'income', amount: 85000, category: 'Salary', description: 'April Salary' },
        { type: 'expense', amount: 18500, category: 'Rent', description: 'Monthly Rent' },
        { type: 'expense', amount: 4500, category: 'Food', description: 'Groceries & Vegetables' },
        { type: 'expense', amount: 2200, category: 'Transport', description: 'Fuel & Ola' },
        { type: 'income', amount: 12000, category: 'Freelance', description: 'Web Development Project' },
        { type: 'expense', amount: 1800, category: 'Entertainment', description: 'Movie & Dinner' },
      ]
      samples.forEach(data => addTransaction(data))
    }
  }, [transactions.length, addTransaction])

  const balance = getBalance()
  const income = getTotalIncome()
  const expense = getTotalExpense()

  const monthlyData = [
    { month: 'Jan', income: 72000, expense: 48500 },
    { month: 'Feb', income: 68000, expense: 52000 },
    { month: 'Mar', income: 91000, expense: 41000 },
    { month: 'Apr', income: 85000, expense: 46500 },
  ]

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }))

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1']

  return (
    <div className="p-8 dark:bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Balance</p>
              <p className={`text-4xl font-bold mt-3 ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                ₹{balance.toLocaleString('en-IN')}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Income</p>
              <p className="text-4xl font-bold text-emerald-600 mt-3">+₹{income.toLocaleString('en-IN')}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Expense</p>
              <p className="text-4xl font-bold text-red-600 mt-3">-₹{expense.toLocaleString('en-IN')}</p>
            </div>
            <TrendingDown className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">Income vs Expense Trend</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']} />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={4} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">Spending by Category</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData.length > 0 ? pieData : [{ name: 'No Data', value: 100 }]}
                cx="50%"
                cy="50%"
                outerRadius={110}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">Recent Transactions</h2>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex justify-between items-center py-4">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{t.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(t.date), 'dd MMM yyyy')}</p>
              </div>
              <div className={`font-semibold text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}