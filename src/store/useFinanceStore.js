import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

const useFinanceStore = create(
  persist(
    (set, get) => ({
      // Transactions
      transactions: [],

      // Budgets
      budgets: [
        { category: 'Food', budget: 4000, spent: 0 },
        { category: 'Transport', budget: 2500, spent: 0 },
        { category: 'Rent', budget: 18000, spent: 0 },
        { category: 'Entertainment', budget: 2000, spent: 0 },
        { category: 'Utilities', budget: 1500, spent: 0 },
        { category: 'Shopping', budget: 3000, spent: 0 },
      ],

      // Savings Goals
      goals: [],

      // Dark Mode
      isDarkMode: false,

      // ==================== TRANSACTIONS ====================
      addTransaction: (transaction) => {
        const newTrans = {
          ...transaction,
          id: nanoid(),
          date: transaction.date || new Date().toISOString(),
        }

        set((state) => {
          const updatedTransactions = [newTrans, ...state.transactions]

          // Update budget if it's an expense
          const updatedBudgets = state.budgets.map((budget) => {
            if (budget.category === newTrans.category && newTrans.type === 'expense') {
              return { ...budget, spent: budget.spent + newTrans.amount }
            }
            return budget
          })

          return {
            transactions: updatedTransactions,
            budgets: updatedBudgets,
          }
        })
      },

      deleteTransaction: (id) => {
        set((state) => {
          const transactionToDelete = state.transactions.find((t) => t.id === id)

          const updatedTransactions = state.transactions.filter((t) => t.id !== id)

          // Revert budget spent if expense
          const updatedBudgets = state.budgets.map((budget) => {
            if (
              transactionToDelete &&
              transactionToDelete.category === budget.category &&
              transactionToDelete.type === 'expense'
            ) {
              return {
                ...budget,
                spent: Math.max(0, budget.spent - transactionToDelete.amount),
              }
            }
            return budget
          })

          return {
            transactions: updatedTransactions,
            budgets: updatedBudgets,
          }
        })
      },

      // ==================== CALCULATIONS ====================
      getBalance: () => {
        const { transactions } = get()
        return transactions.reduce((acc, t) => {
          return t.type === 'income' ? acc + t.amount : acc - t.amount
        }, 0)
      },

      getTotalIncome: () => {
        const { transactions } = get()
        return transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)
      },

      getTotalExpense: () => {
        const { transactions } = get()
        return transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
      },

      // ==================== SAVINGS GOALS ====================
      addGoal: (goal) => {
        const newGoal = {
          ...goal,
          id: nanoid(),
          currentAmount: goal.currentAmount || 0,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          goals: [...state.goals, newGoal],
        }))
      },

      updateGoalProgress: (id, newAmount) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, currentAmount: Math.min(newAmount, goal.targetAmount) }
              : goal
          ),
        }))
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }))
      },

      // ==================== INSIGHTS ====================
      getInsights: () => {
        const { transactions, getTotalIncome, getTotalExpense } = get()
        const insights = []

        if (transactions.length === 0) {
          insights.push({
            type: 'info',
            message: "Start adding transactions to get personalized financial insights",
            icon: '📊',
          })
          return insights
        }

        const totalIncome = getTotalIncome()
        const totalExpense = getTotalExpense()
        const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0

        // Savings Rate Insight
        if (savingsRate < 15) {
          insights.push({
            type: 'warning',
            message: `Your savings rate is low (${savingsRate}%). Consider reducing expenses.`,
            icon: '⚠️',
          })
        } else if (savingsRate >= 40) {
          insights.push({
            type: 'success',
            message: `Great job! You're saving ${savingsRate}% of your income.`,
            icon: '🎉',
          })
        } else {
          insights.push({
            type: 'info',
            message: `You're saving ${savingsRate}% of your income this month.`,
            icon: '📈',
          })
        }

        // Top Spending Category
        const expenseByCategory = transactions
          .filter((t) => t.type === 'expense')
          .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount
            return acc
          }, {})

        const topCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0]

        if (topCategory) {
          insights.push({
            type: 'info',
            message: `Highest spending: ${topCategory[0]} (₹${topCategory[1].toLocaleString('en-IN')})`,
            icon: '🔥',
          })
        }

        // Spending vs Income Warning
        if (totalExpense > totalIncome * 0.85) {
          insights.push({
            type: 'warning',
            message: "You're spending more than 85% of your income. Time to review your budget.",
            icon: '💸',
          })
        }

        return insights
      },

      // ==================== DARK MODE ====================
      toggleDarkMode: () => {
        set((state) => {
          const newMode = !state.isDarkMode
          if (newMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { isDarkMode: newMode }
        })
      },
    }),

    {
      name: 'finance-storage',
    }
  )
)

export default useFinanceStore