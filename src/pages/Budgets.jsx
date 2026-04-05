import useFinanceStore from '../store/useFinanceStore'

export default function Budgets() {
  const { budgets } = useFinanceStore()

  return (
    <div className="p-8 dark:bg-gray-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Budgets</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your monthly spending limits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, index) => {
          const percentage = budget.budget > 0 
            ? Math.min(Math.round((budget.spent / budget.budget) * 100), 100) 
            : 0
          
          const isOverBudget = percentage > 100

          return (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-900 rounded-3xl p-7 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{budget.category}</h3>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  ₹{budget.spent.toLocaleString('en-IN')} / ₹{budget.budget.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full transition-all duration-300 rounded-full ${
                    isOverBudget ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600 dark:text-gray-400">{percentage}% used</span>
                {isOverBudget ? (
                  <span className="text-red-600 font-medium">Over Budget!</span>
                ) : (
                  <span className="text-emerald-600">
                    ₹{(budget.budget - budget.spent).toLocaleString('en-IN')} left
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}