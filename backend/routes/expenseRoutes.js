import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { 
  getAllExpenses, 
  createExpense, 
  updateExpenseStatus,
  uploadReceiptForExpense 
} from '../controllers/expenseController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

const router = express.Router()

// GET all expenses
router.get('/expenses', getAllExpenses)

// POST create new expense (with optional file upload)
router.post('/expenses', upload.single('receipt'), createExpense)

// PUT update expense status
router.put('/expenses/:id/status', updateExpenseStatus)

// PUT upload receipt for existing expense
router.put('/expenses/:id/receipt', upload.single('receipt'), uploadReceiptForExpense)

export default router
