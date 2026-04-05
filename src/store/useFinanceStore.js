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
        { category: 'Food', budget: 400, spent: 0 },
        { category: 'Transport', budget: 200, spent: 0 },
        { category: 'Rent', budget: 1200, spent: 0 },
        { category: 'Entertainment', budget: 150, spent: 0 },
        { category: 'Utilities', budget: 100, spent: 0 },
      ],

      // Dark Mode
      isDarkMode: false,

      // Add new transaction
      addTransaction: (transaction) => {
        const newTrans = {
          ...transaction,
          id: nanoid(),
          date: transaction.date || new Date().toISOString(),
        }

        set((state) => {
          const updatedTransactions = [newTrans, ...state.transactions]

          // Update budget spent if it's an expense
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

      // Delete transaction
      deleteTransaction: (id) => {
        set((state) => {
          const transactionToDelete = state.transactions.find((t) => t.id === id)
          
          const updatedTransactions = state.transactions.filter((t) => t.id !== id)

          // Revert budget if it was an expense
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

      // Calculate totals
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

      // Dark Mode Toggle
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
      name: 'finance-storage', // localStorage key
    }
  )
)

export default useFinanceStore