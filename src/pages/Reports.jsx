import useFinanceStore from '../store/useFinanceStore'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts'

export default function Reports() {
  const { transactions } = useFinanceStore()

  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' })
    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 }
    }
    if (t.type === 'income') acc[month].income += t.amount
    else acc[month].expense += t.amount
    return acc
  }, {})

  const chartData = Object.values(monthlyData)

  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const pieData = Object.entries(categorySpending).map(([name, value]) => ({ name, value }))

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="p-8 dark:bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold mb-6 text-gray-800 dark:text-white">Monthly Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
              <Bar dataKey="income" fill="#10b981" name="Income" radius={8} />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold mb-6 text-gray-800 dark:text-white">Expense Breakdown by Category</h2>
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={pieData.length > 0 ? pieData : [{name: 'No Data', value: 100}]}
                cx="50%"
                cy="50%"
                outerRadius={130}
                dataKey="value"
                label
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
    </div>
  )
}