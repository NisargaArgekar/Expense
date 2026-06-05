import express from 'express'
import { 
  getAllExpenses, 
  createExpense, 
  updateExpenseStatus 
} from '../controllers/expenseController.js'
import { upload } from '../server.js'

const router = express.Router()

// GET all expenses
router.get('/expenses', getAllExpenses)

// POST create new expense (with optional file upload)
router.post('/expenses', upload.single('receipt'), createExpense)

// PUT update expense status
router.put('/expenses/:id/status', updateExpenseStatus)

export default router
