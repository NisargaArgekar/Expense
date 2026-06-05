import { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

function App() {
  const [expenses, setExpenses] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Fetch expenses from API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('/api/expenses')
        const data = await response.json()
        setExpenses(data)
      } catch (error) {
        console.error('Error fetching expenses:', error)
      }
    }

    fetchExpenses()
  }, [refreshTrigger])

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleStatusUpdated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Expense Management System
          </h1>
          <p className="text-gray-600">Manage and track your expenses efficiently</p>
        </div>

        {/* Form Section */}
        <div className="mb-8">
          <ExpenseForm onExpenseAdded={handleExpenseAdded} />
        </div>

        {/* List Section */}
        <div>
          <ExpenseList 
            expenses={expenses} 
            onStatusUpdated={handleStatusUpdated}
          />
        </div>
      </div>
    </div>
  )
}

export default App
