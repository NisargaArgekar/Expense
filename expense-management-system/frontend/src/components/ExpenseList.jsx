import { useState } from 'react'
import { updateExpenseStatus } from '../services/api'

export default function ExpenseList({ expenses, onStatusUpdated }) {
  const [updating, setUpdating] = useState(null)
  const [error, setError] = useState('')

  const statuses = ['Draft', 'Submitted', 'Approved', 'Rejected']

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Format currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800'
      case 'Submitted':
        return 'bg-blue-100 text-blue-800'
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Handle status change
  const handleStatusChange = async (expenseId, newStatus) => {
    setUpdating(expenseId)
    setError('')

    try {
      await updateExpenseStatus(expenseId, newStatus)
      onStatusUpdated()
    } catch (err) {
      setError(`Failed to update status: ${err.message}`)
      setTimeout(() => setError(''), 3000)
    } finally {
      setUpdating(null)
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Expense List</h2>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No expenses yet. Create one to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Expense List</h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Table - Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-sm text-gray-700">{formatDate(expense.date)}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{expense.category}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-semibold text-right">
                  {formatAmount(expense.amount)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(expense.status)}`}>
                    {expense.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={expense.status}
                    onChange={(e) => handleStatusChange(expense.id, e.target.value)}
                    disabled={updating === expense.id}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold text-gray-900">{formatDate(expense.date)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(expense.status)}`}>
                {expense.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold text-gray-900">{expense.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-semibold text-gray-900">{formatAmount(expense.amount)}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-gray-900 text-sm line-clamp-2">{expense.description}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Update Status</label>
              <select
                value={expense.status}
                onChange={(e) => handleStatusChange(expense.id, e.target.value)}
                disabled={updating === expense.id}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-gray-600 text-sm">Total Expenses</p>
            <p className="text-xl font-bold text-gray-900">{expenses.length}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Amount</p>
            <p className="text-xl font-bold text-gray-900">
              {formatAmount(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Approved</p>
            <p className="text-xl font-bold text-green-600">
              {expenses.filter(exp => exp.status === 'Approved').length}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-xl font-bold text-yellow-600">
              {expenses.filter(exp => exp.status === 'Draft' || exp.status === 'Submitted').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
