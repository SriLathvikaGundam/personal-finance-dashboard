import { useState } from 'react'
import useFinanceStore from '../store/useFinanceStore'
import { Plus, Target, Trash2, Edit } from 'lucide-react'
import { format } from 'date-fns'

export default function Goals() {
  const { goals, addGoal, updateGoalProgress, deleteGoal } = useFinanceStore()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: ''
  })

  const handleAddGoal = (e) => {
    e.preventDefault()
    if (!newGoal.name || !newGoal.targetAmount) return

    addGoal({
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      targetDate: newGoal.targetDate || null,
    })

    setNewGoal({ name: '', targetAmount: '', targetDate: '' })
    setIsModalOpen(false)
  }

  return (
    <div className="p-8 dark:bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Savings Goals</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Turn your dreams into financial targets</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800">
          <Target className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Goals Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first savings goal to track progress</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl hover:bg-emerald-700"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0 
              ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
              : 0

            return (
              <div 
                key={goal.id} 
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl">
                      <Target className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{goal.name}</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-400">
                    <span>Progress</span>
                    <span>₹{goal.currentAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-emerald-600">{progress}% Achieved</span>
                  {goal.targetDate && (
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      By {format(new Date(goal.targetDate), 'dd MMM yyyy')}
                    </span>
                  )}
                </div>

                {/* Progress Slider */}
                <div className="mt-6">
                  <input
                    type="range"
                    min="0"
                    max={goal.targetAmount}
                    step="100"
                    value={goal.currentAmount}
                    onChange={(e) => updateGoalProgress(goal.id, parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <p className="text-center text-xs text-gray-500 mt-1">Slide to update progress</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add New Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md mx-4 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create New Savings Goal</h2>
            
            <form onSubmit={handleAddGoal} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g. New MacBook, Goa Trip, Emergency Fund"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  placeholder="50000"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Target Date (Optional)</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border border-gray-300 dark:border-gray-700 rounded-2xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-medium hover:bg-emerald-700"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}