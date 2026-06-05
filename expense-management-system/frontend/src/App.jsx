import { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

function App() {
  const [expenses, setExpenses] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch expenses from API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/expenses')
        const data = await response.json()
        setExpenses(data)
      } catch (error) {
        console.error('Error fetching expenses:', error)
      } finally {
        setLoading(false)
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

  // Calculate stats
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const approvedCount = expenses.filter(exp => exp.status === 'Approved').length
  const draftCount = expenses.filter(exp => exp.status === 'Draft').length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Expense Manager</h1>
                <p className="text-xs text-slate-500">Track and manage your expenses</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{expenses.length}</p>
                <p className="text-xs text-slate-600">Total Claims</p>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">₹{totalAmount.toFixed(2)}</p>
                <p className="text-xs text-slate-600">Total Amount</p>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-500">{approvedCount}</p>
                <p className="text-xs text-slate-600">Approved</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Form Section */}
        <div className="mb-12">
          <ExpenseForm onExpenseAdded={handleExpenseAdded} />
        </div>

        {/* List Section */}
        <div>
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-slate-600 font-medium">Loading expenses...</p>
            </div>
          ) : (
            <ExpenseList 
              expenses={expenses} 
              onStatusUpdated={handleStatusUpdated}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-slate-600">
          <p>© 2026 Expense Management System • Streamline your reimbursement process</p>
        </div>
      </footer>
    </div>
  )
}

export default App
