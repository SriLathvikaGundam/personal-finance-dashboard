import useFinanceStore from '../store/useFinanceStore'
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Insights() {
  const insights = useFinanceStore((state) => state.getInsights())

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      default:
        return <Lightbulb className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
      default:
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-amber-500" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Insights</h2>
      </div>

      {insights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-6 rounded-3xl border ${getBgColor(insight.type)} transition-all hover:shadow-md`}
            >
              <div className="flex gap-4">
                <div className="mt-1">
                  {getIcon(insight.type)}
                </div>
                <div>
                  <p className="text-gray-800 dark:text-white leading-relaxed">
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl text-center border border-gray-100 dark:border-gray-800">
          <Lightbulb className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No insights available yet.</p>
          <p className="text-sm text-gray-400 mt-1">Add more transactions to unlock personalized insights</p>
        </div>
      )}
    </div>
  )
}