# NexaBank — Manual Test Case Document
**Project:** NexaBank Digital Banking Application  
**Tech Stack:** React.js | Node.js | MySQL  
**Version:** 1.0.0  
**Date:** June 2024  
**Tester:** _________________  

---

## Test Environment

| Parameter | Value |
|-----------|-------|
| Frontend URL | http://localhost:3000 |
| Backend URL | http://localhost:5000 |
| Database | MySQL — nexabank |
| Browser | Chrome / Firefox / Edge |
| Demo User | john@nexabank.com / Test@1234 |

---

## MODULE 1: USER AUTHENTICATION

### TC-AUTH-001 — Successful Login
- **Priority:** High  
- **Precondition:** User registered in DB  
- **Steps:**
  1. Navigate to http://localhost:3000/login
  2. Enter email: john@nexabank.com
  3. Enter password: Test@1234
  4. Click "Sign In"
- **Expected:** Redirected to Dashboard. Greeting message shows user's first name.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-AUTH-002 — Login with Wrong Password
- **Priority:** High  
- **Steps:**
  1. Navigate to /login
  2. Enter valid email, wrong password: WrongPass123
  3. Click "Sign In"
- **Expected:** Error message "Invalid credentials" shown. No redirect.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-AUTH-003 — Login with Unregistered Email
- **Priority:** Medium  
- **Steps:**
  1. Enter email: fake@notreal.com with any password
  2. Click "Sign In"
- **Expected:** Error message displayed. Stay on login page.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-AUTH-004 — Login with Empty Fields
- **Priority:** Medium  
- **Steps:**
  1. Leave email and password empty
  2. Click "Sign In"
- **Expected:** HTML5 validation prevents submission. Fields highlighted.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-AUTH-005 — User Registration — Valid Data
- **Priority:** High  
- **Steps:**
  1. Navigate to /register
  2. Fill: Full Name = "Test User", Email = test123@bank.com, Password = Pass@123, Phone = 999-0000
  3. Click "Open My Account"
- **Expected:** Success message. Redirected to login within 1.5s. Account created in DB.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-AUTH-006 — Register with Duplicate Email
- **Priority:** High  
- **Steps:**
  1. Try registering with email: john@nexabank.com (already exists)
- **Expected:** Error "Email already registered".
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-AUTH-007 — Register with Short Password
- **Priority:** Medium  
- **Steps:**
  1. Enter password: "123" (less than 6 chars)
  2. Submit form
- **Expected:** Frontend error: "Password must be at least 6 characters".
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-AUTH-008 — Logout
- **Priority:** High  
- **Steps:**
  1. Login successfully
  2. Click the ⏻ logout button in sidebar
- **Expected:** Redirected to /login. Token cleared. Cannot access dashboard without re-login.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-AUTH-009 — Session Persistence (Page Refresh)
- **Priority:** Medium  
- **Steps:**
  1. Login successfully
  2. Press F5 / Ctrl+R to refresh
- **Expected:** Still logged in. Dashboard loads normally.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-AUTH-010 — Direct URL Access Without Login
- **Priority:** High  
- **Steps:**
  1. Log out
  2. Manually type http://localhost:3000/ in browser
- **Expected:** Redirected to /login. Protected route enforced.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

## MODULE 2: DASHBOARD

### TC-DASH-001 — Dashboard Data Loads
- **Priority:** High  
- **Steps:**
  1. Login as john@nexabank.com
  2. Observe Dashboard
- **Expected:** Accounts, total balance, transaction count, and greeting visible. Activity chart displays.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-DASH-002 — Total Balance Calculation
- **Priority:** High  
- **Steps:**
  1. Note individual account balances
  2. Note "Total Balance" stat card value
- **Expected:** Total Balance = sum of all account balances.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-DASH-003 — Recent Transactions Listed
- **Priority:** Medium  
- **Steps:**
  1. View "Recent Transactions" section
- **Expected:** Up to 5 latest transactions shown with icon, description, date, and +/- amount.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-DASH-004 — Greeting by Time of Day
- **Priority:** Low  
- **Steps:**
  1. Login at different times: morning, afternoon, evening
- **Expected:** "Good morning / Good afternoon / Good evening" displayed accordingly.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-DASH-005 — Notification Badge Shown
- **Priority:** Medium  
- **Steps:**
  1. Have unread notifications in DB
  2. Load dashboard
- **Expected:** "🔔 X new notification(s)" badge visible in header area.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

## MODULE 3: TRANSACTIONS

### TC-TXN-001 — View All Transactions
- **Priority:** High  
- **Steps:**
  1. Navigate to /transactions
  2. Observe list
- **Expected:** All transactions for user's accounts listed. Each shows description, date, amount (colored), status badge.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-TXN-002 — Filter by Deposit
- **Priority:** Medium  
- **Steps:**
  1. On Transactions page, click "Deposit" tab
- **Expected:** Only deposit-type transactions shown.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-TXN-003 — Filter by Withdrawal
- **Priority:** Medium  
- **Steps:**
  1. Click "Withdrawal" tab
- **Expected:** Only withdrawal transactions shown.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-TXN-004 — Filter by Transfer
- **Priority:** Medium  
- **Steps:**
  1. Click "Transfer" tab
- **Expected:** Only transfer transactions shown.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-TXN-005 — Summary Stats Accurate
- **Priority:** High  
- **Steps:**
  1. Open Transactions page
  2. Note "Total Credits" and "Total Debits"
- **Expected:** Correctly sums credit transactions vs debit transactions.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

## MODULE 4: MONEY MOVEMENT (TRANSFER PAGE)

### TC-TRF-001 — Fund Transfer — Valid
- **Priority:** High  
- **Steps:**
  1. Navigate to /transfer
  2. Select "Transfer" tab
  3. From: NXB-001-2024, To: NXB-003-2024, Amount: 100, Description: "Test Transfer"
  4. Click "Send Money"
- **Expected:** Success message. Source balance decreases by $100. Destination balance increases by $100.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-TRF-002 — Transfer — Insufficient Balance
- **Priority:** High  
- **Steps:**
  1. Transfer amount greater than available balance (e.g., $999999)
- **Expected:** Error "Insufficient balance". No balance change.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-TRF-003 — Transfer — Invalid Destination Account
- **Priority:** High  
- **Steps:**
  1. Enter destination account number: INVALID-ACC-000
  2. Click "Send Money"
- **Expected:** Error "Destination account not found". No debit.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-TRF-004 — Deposit — Valid Amount
- **Priority:** High  
- **Steps:**
  1. Click "Deposit" tab
  2. Select account, enter Amount: 500
  3. Click "Deposit Funds"
- **Expected:** Success message. Account balance increases by $500. Transaction recorded.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-TRF-005 — Deposit — Zero or Negative Amount
- **Priority:** Medium  
- **Steps:**
  1. Enter amount: 0 or -100
- **Expected:** HTML5 min validation prevents submit (min=1). Or API returns error.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-TRF-006 — Withdrawal — Valid
- **Priority:** High  
- **Steps:**
  1. Click "Withdraw" tab
  2. Select account with sufficient balance, enter Amount: 200
  3. Click "Withdraw Funds"
- **Expected:** Success. Balance decreases by $200. Transaction logged.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-TRF-007 — Withdrawal — Insufficient Funds
- **Priority:** High  
- **Steps:**
  1. Try withdrawing more than balance
- **Expected:** Error "Insufficient balance". No change.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-TRF-008 — Transfer Updates Transaction History
- **Priority:** High  
- **Steps:**
  1. Complete a successful transfer
  2. Navigate to /transactions
- **Expected:** New transfer transaction appears at top of list.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

## MODULE 5: LOANS

### TC-LOAN-001 — EMI Preview Calculation
- **Priority:** High  
- **Steps:**
  1. Navigate to /loans
  2. Select "Personal" loan, enter $10,000, 12 months
- **Expected:** EMI preview appears showing monthly EMI, total repayment, and total interest.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-LOAN-002 — Loan Application Submission
- **Priority:** High  
- **Steps:**
  1. Fill loan form: Home Loan, $50,000, 60 months
  2. Click "Apply Now"
- **Expected:** Success message with EMI. Application appears in "My Applications" list with status "pending".
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-LOAN-003 — Multiple Loan Types Available
- **Priority:** Medium  
- **Steps:**
  1. Click each of 4 loan type cards (Personal, Home, Auto, Education)
- **Expected:** Selected card highlights. Interest rate shown. Form reflects selected type.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-LOAN-004 — Loan Application Without Amount
- **Priority:** Medium  
- **Steps:**
  1. Leave amount empty
  2. Click "Apply Now"
- **Expected:** Form validation prevents submission.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-LOAN-005 — View Existing Applications
- **Priority:** High  
- **Steps:**
  1. Submit at least 2 loan applications
  2. Reload page
- **Expected:** Both applications visible in "My Applications" panel with type, amount, EMI, tenure, rate, status.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

## MODULE 6: PROFILE

### TC-PROF-001 — Profile Data Loads
- **Priority:** High  
- **Steps:**
  1. Navigate to /profile
- **Expected:** Full name, email, phone, address pre-filled from database.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-PROF-002 — Update Profile
- **Priority:** High  
- **Steps:**
  1. Change full name to "John C. Carter"
  2. Change phone to "555-9999"
  3. Click "Save Changes"
- **Expected:** Success message. Values persist on page reload.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-PROF-003 — Email Field is Read-Only
- **Priority:** Medium  
- **Steps:**
  1. Try clicking on the email field
- **Expected:** Field is disabled/greyed out. Cannot be edited.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-PROF-004 — Profile Avatar Shows Initials
- **Priority:** Low  
- **Steps:**
  1. View profile page
- **Expected:** Avatar circle shows first letters of first and last name (e.g., JC for John Carter).
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-PROF-005 — Logout from Profile Page
- **Priority:** High  
- **Steps:**
  1. Click "Sign Out of NexaBank" button
- **Expected:** Redirected to /login. Cannot access any protected page.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

## MODULE 7: NAVIGATION & UI

### TC-NAV-001 — Sidebar Navigation Works
- **Priority:** High  
- **Steps:**
  1. Click each sidebar item: Dashboard, Transactions, Transfer, Loans, Profile
- **Expected:** Correct page loads. Active item highlighted in sidebar.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-NAV-002 — Active Link Highlight
- **Priority:** Low  
- **Steps:**
  1. Navigate to Transactions page
  2. Observe sidebar
- **Expected:** "Transactions" nav item has active highlight (teal background + color).
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-NAV-003 — Page Loading State
- **Priority:** Medium  
- **Steps:**
  1. Login slowly (throttle network in DevTools)
  2. Observe initial app load
- **Expected:** Splash screen with "NexaBank" shown. Transitions smoothly to dashboard once data loads.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

## MODULE 8: API / DATABASE VALIDATION

### TC-API-001 — Protected Routes Require Token
- **Priority:** High  
- **Steps:**
  1. Call GET http://localhost:5000/api/accounts without Authorization header (use Postman/curl)
- **Expected:** HTTP 401 — "Access token required"
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-API-002 — Expired / Invalid Token Rejected
- **Priority:** High  
- **Steps:**
  1. Send request with Authorization: Bearer INVALID_TOKEN
- **Expected:** HTTP 403 — "Invalid or expired token"
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-API-003 — Transaction Recorded in MySQL
- **Priority:** High  
- **Steps:**
  1. Perform a deposit via UI
  2. Check MySQL: SELECT * FROM transactions ORDER BY id DESC LIMIT 1;
- **Expected:** Row present with correct amount, type='deposit', status='completed'.
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

### TC-API-004 — Account Balance Updated in DB
- **Priority:** High  
- **Steps:**
  1. Note account balance before deposit
  2. Deposit $200
  3. Run: SELECT balance FROM accounts WHERE id = ?
- **Expected:** balance = previous + 200
- **Status:** [ ] Pass  [ ] Fail  
- **Remarks:** _______________

---

## TEST SUMMARY

| Module | Total TCs | Passed | Failed | Blocked |
|--------|-----------|--------|--------|---------|
| Authentication | 10 | | | |
| Dashboard | 5 | | | |
| Transactions | 5 | | | |
| Money Movement | 8 | | | |
| Loans | 5 | | | |
| Profile | 5 | | | |
| Navigation/UI | 3 | | | |
| API/Database | 4 | | | |
| **TOTAL** | **45** | | | |

---

**Tested By:** ________________________  
**Date:** _____________________________  
**Sign-off:** _________________________  
