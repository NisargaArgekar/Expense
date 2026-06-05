# Expense Management System

A simple yet powerful expense management system built with React, Node.js, and JSON file storage. This application allows users to submit expenses, categorize them, upload receipts, and manage their status through an intuitive workflow.

## 🎯 Features

- **Expense Submission Form**
  - Date, Category, Amount, Description fields (all mandatory)
  - Optional receipt file upload (PDF, JPG, PNG - max 5MB)
  - Real-time form validation with error messages
  - Success feedback after submission

- **Expense List & Management**
  - Display all submitted expenses in a responsive table (desktop) or card layout (mobile)
  - View expense details: Date, Category, Amount, Status
  - Quick currency formatting (USD)
  - Summary statistics: Total expenses, total amount, approved count, pending count

- **Expense Workflow**
  - Status options: Draft → Submitted → Approved/Rejected
  - Update status via dropdown in each expense row
  - Real-time status updates reflected in the UI
  - Color-coded status badges for easy identification

- **Responsive Design**
  - Desktop: Professional table view with inline status dropdowns
  - Mobile: Card-based layout for optimal viewing on small screens
  - Consistent styling with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

### Database
- **JSON File Storage** - Simple, lightweight data persistence (no database server needed)

## 📁 Project Structure

```
expense-management-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx          # Form for submitting new expenses
│   │   │   └── ExpenseList.jsx          # Table/Cards displaying expenses
│   │   ├── services/
│   │   │   └── api.js                   # Axios API integration layer
│   │   ├── App.jsx                      # Main app component
│   │   ├── main.jsx                     # React entry point
│   │   └── index.css                    # Global styles with Tailwind
│   ├── index.html                       # HTML template
│   ├── vite.config.js                   # Vite configuration
│   ├── tailwind.config.js               # Tailwind CSS config
│   ├── postcss.config.js                # PostCSS config
│   ├── package.json                     # Frontend dependencies
│   └── .gitignore
│
└── backend/
    ├── controllers/
    │   └── expenseController.js         # Business logic for expenses
    ├── routes/
    │   └── expenseRoutes.js             # API route definitions
    ├── data/
    │   └── expenses.json                # JSON database (expenses storage)
    ├── uploads/                         # Receipt files storage
    │   └── .gitkeep
    ├── server.js                        # Express server setup
    ├── package.json                     # Backend dependencies
    └── .gitignore
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd expense-management-system/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   - Server runs on `http://localhost:5000`
   - You should see: `Server running on http://localhost:5000`

### Frontend Setup

1. **Open a new terminal and navigate to frontend folder:**
   ```bash
   cd expense-management-system/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   - Frontend runs on `http://localhost:5173`
   - API requests are proxied to backend at `http://localhost:5000`

4. **Open in browser:**
   - Visit `http://localhost:5173`

## 🔗 API Endpoints

### Base URL
```
http://localhost:5000
```

### 1. Get All Expenses
```
GET /expenses
```
**Response:**
```json
[
  {
    "id": "1717584000000",
    "date": "2026-06-05",
    "category": "Food",
    "amount": 50.99,
    "description": "Lunch at restaurant",
    "receipt": "1717584000000-123456789.pdf",
    "status": "Draft",
    "createdAt": "2026-06-05T10:00:00.000Z"
  }
]
```

### 2. Create New Expense
```
POST /expenses
Content-Type: multipart/form-data
```
**Request Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| date | String (YYYY-MM-DD) | ✅ | Expense date |
| category | String | ✅ | Food, Transport, Entertainment, etc. |
| amount | Number | ✅ | Must be positive |
| description | String | ✅ | Expense details |
| receipt | File | ❌ | PDF, JPG, PNG (max 5MB) |

**Response:**
```json
{
  "message": "Expense created successfully",
  "expense": {
    "id": "1717584000000",
    "date": "2026-06-05",
    "category": "Food",
    "amount": 50.99,
    "description": "Lunch at restaurant",
    "receipt": "1717584000000-123456789.pdf",
    "status": "Draft",
    "createdAt": "2026-06-05T10:00:00.000Z"
  }
}
```

### 3. Update Expense Status
```
PUT /expenses/:id/status
Content-Type: application/json
```
**Request Body:**
```json
{
  "status": "Submitted"
}
```

**Valid Status Values:**
- `Draft` - Initial status when expense is created
- `Submitted` - Expense submitted for review
- `Approved` - Expense approved
- `Rejected` - Expense rejected

**Response:**
```json
{
  "message": "Expense status updated successfully",
  "expense": {
    "id": "1717584000000",
    "date": "2026-06-05",
    "category": "Food",
    "amount": 50.99,
    "description": "Lunch at restaurant",
    "receipt": "1717584000000-123456789.pdf",
    "status": "Submitted",
    "createdAt": "2026-06-05T10:00:00.000Z"
  }
}
```

## ✅ Validation Rules

### Expense Creation Validation

| Field | Rule |
|-------|------|
| Date | Required, must be a valid date |
| Category | Required, must be selected from predefined list |
| Amount | Required, must be numeric and positive (> 0) |
| Description | Required, cannot be empty |
| Receipt | Optional, max 5MB, accepts PDF/JPG/PNG |

### Error Responses

**400 Bad Request - Validation Error:**
```json
{
  "message": "All fields are required"
}
```

**404 Not Found - Expense not found:**
```json
{
  "message": "Expense not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Error creating expense",
  "error": "Detailed error message"
}
```

## 🎨 UI Components

### ExpenseForm Component
- Displays form with 5 input fields
- Real-time validation with error messages
- File upload with format restrictions
- Success message after submission
- Loading state during request
- Form reset after successful submission

### ExpenseList Component
- **Desktop:** Responsive table with 5 columns
- **Mobile:** Card-based layout
- Status dropdowns for quick updates
- Color-coded status badges
- Summary section with statistics
- Empty state message when no expenses

### App Component (Main)
- Fetches expenses on component mount
- Manages refresh trigger for data synchronization
- Passes callbacks to child components
- Layout: Form on top, List below

## 📊 Data Storage

Expenses are stored in `backend/data/expenses.json`:

```json
[
  {
    "id": "1717584000000",
    "date": "2026-06-05",
    "category": "Food",
    "amount": 50.99,
    "description": "Lunch at restaurant",
    "receipt": "1717584000000-123456789.pdf",
    "status": "Draft",
    "createdAt": "2026-06-05T10:00:00.000Z"
  }
]
```

**Field Descriptions:**
- `id` - Unique identifier (timestamp-based)
- `date` - Expense date (YYYY-MM-DD format)
- `category` - Expense category
- `amount` - Expense amount (numeric)
- `description` - Expense details
- `receipt` - Uploaded receipt filename (null if not uploaded)
- `status` - Current expense status
- `createdAt` - Timestamp when expense was created

**Receipt Files:**
- Stored in `backend/uploads/` folder
- Filename format: `[timestamp]-[random].ext`
- Accessible via `http://localhost:5000/uploads/[filename]`

## 🔄 Workflow Example

1. **Create Expense:**
   - Fill form → Validate → Submit
   - Status set to "Draft" by default

2. **Review:**
   - View in expense list
   - Update status from dropdown to "Submitted"

3. **Approve/Reject:**
   - Admin/Manager reviews expense
   - Changes status to "Approved" or "Rejected"
   - UI updates immediately with color-coded badge

## 📱 Responsive Design

- **Desktop (md and above):** Table layout with all details visible
- **Mobile (below md):** Card layout with collapsible information
- **Breakpoint:** Tailwind's `md` breakpoint (768px)

## 🚨 Common Issues & Solutions

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify proxy setting in `vite.config.js`

### File upload not working
- Check file size (max 5MB)
- Verify file format (PDF, JPG, PNG only)
- Ensure `uploads/` folder exists and is writable

### Port already in use
```bash
# Frontend (change port in vite.config.js)
# Or kill process on port 5173

# Backend (change PORT in server.js or set environment variable)
PORT=5001 npm start
```

## 🔮 Future Improvements

While keeping the system simple, these features could be added later:

- **User Authentication** - Login/logout with user profiles
- **Filtering & Sorting** - Filter by status, date range, category
- **Export Reports** - Export expenses to CSV/PDF
- **Search Functionality** - Search expenses by description
- **Date Range Filter** - Filter expenses by date range
- **Category Statistics** - Pie/bar charts by category
- **Email Notifications** - Notify on status changes
- **Bulk Actions** - Approve/reject multiple expenses at once
- **Expense Comments** - Add notes to expenses
- **Audit Trail** - Track all expense modifications
- **Database Migration** - Replace JSON with MongoDB/PostgreSQL
- **Docker Support** - Containerize frontend and backend
- **CI/CD Pipeline** - Automated testing and deployment

## 📝 License

This project is built as a learning assignment and is provided as-is for educational purposes.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review console logs for error messages
3. Verify API endpoints using tools like Postman
4. Check file permissions for uploads folder

---

**Built with ❤️ as a simple and practical expense management solution.**
