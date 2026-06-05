import { useState } from 'react'
import { createExpense } from '../services/api'

export default function ExpenseForm({ onExpenseAdded }) {
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    amount: '',
    description: '',
    receipt: null
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const categories = [
    'Food',
    'Transport',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Shopping',
    'Travel',
    'Other'
  ]

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({
      ...prev,
      receipt: file
    }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required'
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSuccessMessage('')

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('date', formData.date)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('amount', formData.amount)
      formDataToSend.append('description', formData.description)
      if (formData.receipt) {
        formDataToSend.append('receipt', formData.receipt)
      }

      await createExpense(formDataToSend)

      setSuccessMessage('Expense created successfully!')
      
      // Reset form
      setFormData({
        date: '',
        category: '',
        amount: '',
        description: '',
        receipt: null
      })

      // Reset file input
      const fileInput = document.getElementById('receipt')
      if (fileInput) fileInput.value = ''

      // Notify parent to refresh expenses
      onExpenseAdded()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
        <h2 className="text-xl font-bold text-slate-900">Submit Expense Claim</h2>
        <p className="text-sm text-slate-600 mt-1">Fill in the details below to submit a new expense claim</p>
      </div>

      <div className="p-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-lg flex items-start gap-3">
            <span className="text-xl mt-0.5">✓</span>
            <div>
              <p className="text-emerald-900 font-semibold text-sm">{successMessage}</p>
              <p className="text-emerald-700 text-xs mt-1">Your expense has been added to the list</p>
            </div>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3">
            <span className="text-xl mt-0.5">✕</span>
            <div>
              <p className="text-red-900 font-semibold text-sm">{errors.submit}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date & Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Expense Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.date ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.date && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.date}</p>}
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.category ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                }`}
              >
                <option value="">Choose a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.category}</p>}
            </div>
          </div>

          {/* Amount & Receipt Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-500 font-semibold">₹</span>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.amount ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                  }`}
                />
              </div>
              {errors.amount && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.amount}</p>}
            </div>

            {/* Receipt Upload Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Attach Receipt <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="file"
                id="receipt"
                name="receipt"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400 transition cursor-pointer text-sm text-slate-600 file:mr-3 file:px-3 file:py-1.5 file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium file:rounded file:cursor-pointer"
              />
              <p className="text-slate-500 text-xs mt-1.5">PDF, JPG, PNG • Up to 5MB</p>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter expense details..."
              rows="4"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition ${
                errors.description ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
              }`}
            />
            {errors.description && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.description}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:shadow-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>Submit Claim</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
