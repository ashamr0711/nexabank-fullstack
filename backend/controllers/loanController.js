const db = require('../config/db');

// Apply for loan
exports.applyLoan = async (req, res) => {
  try {
    const { loan_type, amount, tenure_months } = req.body;
    const rates = { personal: 10.5, home: 7.5, auto: 9.0, education: 8.0 };
    const rate = rates[loan_type] || 10.0;
    const monthlyRate = rate / 100 / 12;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure_months)) /
                (Math.pow(1 + monthlyRate, tenure_months) - 1);

    await db.query(
      'INSERT INTO loans (user_id, loan_type, amount, interest_rate, tenure_months, emi) VALUES (?,?,?,?,?,?)',
      [req.user.id, loan_type, amount, rate, tenure_months, emi.toFixed(2)]
    );
    await db.query(
      'INSERT INTO notifications (user_id, message, type) VALUES (?,?,?)',
      [req.user.id, `Loan application of $${amount} (${loan_type}) submitted. EMI: $${emi.toFixed(2)}/month.`, 'info']
    );

    res.status(201).json({
      success: true,
      message: 'Loan application submitted',
      emi: emi.toFixed(2),
      interest_rate: rate
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get loans
exports.getLoans = async (req, res) => {
  try {
    const [loans] = await db.query('SELECT * FROM loans WHERE user_id = ? ORDER BY applied_at DESC', [req.user.id]);
    res.json({ success: true, loans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get notifications
exports.getNotifications = async (req, res) => {
  try {
    const [notifs] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    const [unread] = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [req.user.id]
    );
    res.json({ success: true, notifications: notifs, unread_count: unread[0].count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark notifications read
exports.markRead = async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Beneficiaries
exports.getBeneficiaries = async (req, res) => {
  try {
    const [bens] = await db.query('SELECT * FROM beneficiaries WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, beneficiaries: bens });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addBeneficiary = async (req, res) => {
  try {
    const { name, account_number, bank_name } = req.body;
    await db.query(
      'INSERT INTO beneficiaries (user_id, name, account_number, bank_name) VALUES (?,?,?,?)',
      [req.user.id, name, account_number, bank_name]
    );
    res.status(201).json({ success: true, message: 'Beneficiary added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
