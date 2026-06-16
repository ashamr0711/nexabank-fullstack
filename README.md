# 🏦 NexaBank — Full Stack Banking Application

A modern, feature-rich digital banking app built with React.js, Node.js, and MySQL.

## 🛠️ Tech Stack
- **Frontend:** React.js 18, React Router v6, Recharts, Axios
- **Backend:** Node.js, Express.js, JWT Authentication, Bcrypt
- **Database:** MySQL with relational schema

## 📁 Project Structure
```
banking-app/
├── backend/
│   ├── config/
│   │   ├── db.js           # MySQL connection
│   │   └── schema.sql      # Database + seed data
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── accountController.js
│   │   └── loanController.js
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   ├── routes/
│   │   └── index.js        # All API routes
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.js   # Sidebar layout
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Transactions.js
│   │   │   ├── Transfer.js
│   │   │   ├── Loans.js
│   │   │   └── Profile.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── MANUAL_TEST_CASES.md
```

## 🚀 Setup Instructions

### Step 1: Database
```bash
# Open MySQL and run:
mysql -u root -p < backend/config/schema.sql
```

### Step 2: Backend
```bash
cd backend
npm install
# Edit .env: set DB_HOST, DB_USER, DB_PASSWORD
npm run dev
# Runs on http://localhost:5000
```

### Step 3: Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## 🔑 Demo Credentials
- **Email:** john@nexabank.com
- **Password:** Test@1234

## 📋 Features
- ✅ JWT Authentication (Register / Login / Logout)
- ✅ Dashboard with balance overview & activity chart
- ✅ Fund Transfer between accounts
- ✅ Deposit & Withdrawal
- ✅ Loan Application with EMI Calculator
- ✅ Transaction History with filters
- ✅ Profile Management
- ✅ Notifications system
- ✅ Protected routes

## 🧪 Manual Testing
See `MANUAL_TEST_CASES.md` — 45 test cases across 8 modules.

## 🔌 API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Register new user |
| POST | /api/auth/login | ❌ | Login |
| GET | /api/auth/profile | ✅ | Get profile |
| PUT | /api/auth/profile | ✅ | Update profile |
| GET | /api/accounts | ✅ | List accounts |
| POST | /api/accounts/deposit | ✅ | Deposit |
| POST | /api/accounts/withdraw | ✅ | Withdraw |
| POST | /api/accounts/transfer | ✅ | Transfer |
| GET | /api/transactions | ✅ | All transactions |
| POST | /api/loans/apply | ✅ | Apply for loan |
| GET | /api/loans | ✅ | My loans |
| GET | /api/notifications | ✅ | Notifications |
