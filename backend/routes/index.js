const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authCtrl = require('../controllers/authController');
const accCtrl = require('../controllers/accountController');
const loanCtrl = require('../controllers/loanController');

// Auth Routes
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/profile', auth, authCtrl.getProfile);
router.put('/auth/profile', auth, authCtrl.updateProfile);

// Account Routes
router.get('/accounts', auth, accCtrl.getAccounts);
router.get('/accounts/:accountId', auth, accCtrl.getAccountDetails);
router.post('/accounts/deposit', auth, accCtrl.deposit);
router.post('/accounts/withdraw', auth, accCtrl.withdraw);
router.post('/accounts/transfer', auth, accCtrl.transfer);
router.get('/transactions', auth, accCtrl.getTransactions);

// Loan Routes
router.post('/loans/apply', auth, loanCtrl.applyLoan);
router.get('/loans', auth, loanCtrl.getLoans);

// Notification Routes
router.get('/notifications', auth, loanCtrl.getNotifications);
router.put('/notifications/read', auth, loanCtrl.markRead);

// Beneficiary Routes
router.get('/beneficiaries', auth, loanCtrl.getBeneficiaries);
router.post('/beneficiaries', auth, loanCtrl.addBeneficiary);

module.exports = router;
