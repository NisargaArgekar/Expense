import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
})

// GET all expenses
export const getExpenses = async () => {
  try {
    const response = await api.get('/expenses')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch expenses')
  }
}

// POST new expense
export const createExpense = async (formData) => {
  try {
    const response = await api.post('/expenses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create expense')
  }
}

// PUT update expense status
export const updateExpenseStatus = async (expenseId, status) => {
  try {
    const response = await api.put(`/expenses/${expenseId}/status`, { status })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update status')
  }
}

// PUT upload receipt for existing expense
export const uploadReceiptForExpense = async (expenseId, file) => {
  try {
    const formData = new FormData()
    formData.append('receipt', file)
    const response = await api.put(`/expenses/${expenseId}/receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload receipt')
  }
}

export default api
