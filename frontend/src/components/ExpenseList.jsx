import { useState } from 'react'
import { updateExpenseStatus, uploadReceiptForExpense } from '../services/api'
import ReceiptPreview from './ReceiptPreview'

export default function ExpenseList({ expenses, onStatusUpdated }) {
  const [updating, setUpdating] = useState(null)
  const [error, setError] = useState('')
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [uploadingReceipt, setUploadingReceipt] = useState(null)
  const [fileInputs, setFileInputs] = useState({})

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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      'Draft': { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Draft' },
      'Submitted': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pending Review' },
      'Approved': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved' },
      'Rejected': { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' }
    }
    return badges[status] || badges['Draft']
  }

  // Handle status change
  const handleStatusChange = async (expenseId, newStatus) => {
    setUpdating(expenseId)
    setError('')

    try {
      await updateExpenseStatus(expenseId, newStatus)
      onStatusUpdated()
    } catch (err) {
      setError(`Failed to update: ${err.message}`)
      setTimeout(() => setError(''), 4000)
    } finally {
      setUpdating(null)
    }
  }

  // Handle receipt preview
  const handleReceiptClick = (receipt) => {
    setSelectedReceipt(receipt)
    setReceiptModalOpen(true)
  }

  // Handle receipt upload for existing expense
  const handleReceiptUpload = async (expenseId, file) => {
    if (!file) return

    setUploadingReceipt(expenseId)
    setError('')

    try {
      await uploadReceiptForExpense(expenseId, file)
      onStatusUpdated() // Refresh the list
      // Clear the file input
      if (fileInputs[expenseId]) {
        fileInputs[expenseId].value = ''
      }
    } catch (err) {
      setError(`Failed to upload receipt: ${err.message}`)
      setTimeout(() => setError(''), 4000)
    } finally {
      setUploadingReceipt(null)
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Your Claims</h2>
        </div>
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-lg mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">No claims yet</p>
          <p className="text-slate-500 text-sm mt-1">Submit your first expense claim using the form above</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
        <h2 className="text-xl font-bold text-slate-900">Your Claims ({expenses.length})</h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="m-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3">
          <span className="text-lg mt-0.5">⚠</span>
          <p className="text-red-700 font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wide">Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wide">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wide">Description</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-900 uppercase tracking-wide">Amount</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-900 uppercase tracking-wide">Receipt</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wide">Status</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-900 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {expenses.map((expense) => {
              const badge = getStatusBadge(expense.status)
              return (
                <tr key={expense.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{formatDate(expense.date)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{expense.category}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={expense.description}>{expense.description}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{formatAmount(expense.amount)}</td>
                  <td className="px-6 py-4 text-center">
                    {expense.receipt ? (
                      <button
                        onClick={() => handleReceiptClick(expense.receipt)}
                        className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition"
                        title="View receipt"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </button>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              handleReceiptUpload(expense.id, e.target.files[0])
                            }
                          }}
                          ref={(el) => setFileInputs(prev => ({...prev, [expense.id]: el}))}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputs[expense.id]?.click()}
                          disabled={uploadingReceipt === expense.id}
                          className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-200 text-slate-600 rounded-lg transition disabled:opacity-50 cursor-pointer"
                          title="Upload receipt"
                        >
                          {uploadingReceipt === expense.id ? (
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={expense.status}
                      onChange={(e) => handleStatusChange(expense.id, e.target.value)}
                      disabled={updating === expense.id}
                      className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 cursor-pointer font-medium"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden divide-y divide-slate-200">
        {expenses.map((expense) => {
          const badge = getStatusBadge(expense.status)
          return (
            <div key={expense.id} className="p-6 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Date</p>
                  <p className="text-sm font-bold text-slate-900">{formatDate(expense.date)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Category</p>
                  <p className="text-sm font-semibold text-slate-900">{expense.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Amount</p>
                  <p className="text-sm font-bold text-slate-900">{formatAmount(expense.amount)}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Description</p>
                <p className="text-sm text-slate-600 line-clamp-2">{expense.description}</p>
              </div>

              {expense.receipt ? (
                <div className="mb-4">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-2">Receipt</p>
                  <button
                    onClick={() => handleReceiptClick(expense.receipt)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    View Receipt
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-2">Receipt</p>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleReceiptUpload(expense.id, e.target.files[0])
                        }
                      }}
                      ref={(el) => setFileInputs(prev => ({...prev, [expense.id]: el}))}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputs[expense.id]?.click()}
                      disabled={uploadingReceipt === expense.id}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-200 border border-slate-200 text-slate-600 rounded-lg transition disabled:opacity-50 cursor-pointer font-medium text-sm"
                    >
                      {uploadingReceipt === expense.id ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Upload Receipt
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-500 uppercase font-bold block mb-2">Update Status</label>
                <select
                  value={expense.status}
                  onChange={(e) => handleStatusChange(expense.id, e.target.value)}
                  disabled={updating === expense.id}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 cursor-pointer font-medium"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Footer */}
      <div className="px-6 py-6 bg-slate-50 border-t border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-600 font-bold uppercase">Total Claims</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{expenses.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 font-bold uppercase">Total Amount</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{formatAmount(expenses.reduce((sum, exp) => sum + exp.amount, 0))}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 font-bold uppercase">Approved</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{expenses.filter(exp => exp.status === 'Approved').length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 font-bold uppercase">Pending</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{expenses.filter(exp => exp.status !== 'Approved' && exp.status !== 'Rejected').length}</p>
          </div>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      <ReceiptPreview 
        receipt={selectedReceipt} 
        isOpen={receiptModalOpen} 
        onClose={() => setReceiptModalOpen(false)}
      />
    </div>
  )
}
