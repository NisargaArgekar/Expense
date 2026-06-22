import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const EXPENSES_FILE = path.join(__dirname, '../data/expenses.json')

// Helper function to read expenses from JSON file
const readExpenses = () => {
  try {
    if (!fs.existsSync(EXPENSES_FILE)) {
      fs.writeFileSync(EXPENSES_FILE, JSON.stringify([]))
    }
    const data = fs.readFileSync(EXPENSES_FILE, 'utf-8')
    return JSON.parse(data || '[]')
  } catch (error) {
    console.error('Error reading expenses:', error)
    return []
  }
}

// Helper function to write expenses to JSON file
const writeExpenses = (expenses) => {
  try {
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2))
  } catch (error) {
    console.error('Error writing expenses:', error)
  }
}

// GET all expenses
export const getAllExpenses = (req, res) => {
  try {
    const expenses = readExpenses()
    res.json(expenses)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message })
  }
}

// POST create new expense
export const createExpense = (req, res) => {
  try {
    const { date, category, amount, description } = req.body
    const receipt = req.file ? req.file.filename : null

    // Validation
    if (!date || !category || !amount || !description) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' })
    }

    // Create expense object
    const expenses = readExpenses()
    const newExpense = {
      id: Date.now().toString(),
      date,
      category,
      amount: parseFloat(amount),
      description,
      receipt,
      status: 'Draft',
      createdAt: new Date().toISOString()
    }

    expenses.push(newExpense)
    writeExpenses(expenses)

    res.status(201).json({
      message: 'Expense created successfully',
      expense: newExpense
    })
  } catch (error) {
    res.status(500).json({ message: 'Error creating expense', error: error.message })
  }
}

// PUT update expense status
export const updateExpenseStatus = (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Validate status
    const validStatuses = ['Draft', 'Submitted', 'Approved', 'Rejected']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: Draft, Submitted, Approved, Rejected' 
      })
    }

    const expenses = readExpenses()
    const expenseIndex = expenses.findIndex(exp => exp.id === id)

    if (expenseIndex === -1) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    expenses[expenseIndex].status = status
    writeExpenses(expenses)

    res.json({
      message: 'Expense status updated successfully',
      expense: expenses[expenseIndex]
    })
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message })
  }
}

// PUT upload receipt for existing expense
export const uploadReceiptForExpense = (req, res) => {
  try {
    const { id } = req.params

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const expenses = readExpenses()
    const expenseIndex = expenses.findIndex(exp => exp.id === id)

    if (expenseIndex === -1) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    expenses[expenseIndex].receipt = req.file.filename
    writeExpenses(expenses)

    res.json({
      message: 'Receipt uploaded successfully',
      expense: expenses[expenseIndex]
    })
  } catch (error) {
    res.status(500).json({ message: 'Error uploading receipt', error: error.message })
  }
}
