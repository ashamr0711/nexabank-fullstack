const db = require('../config/db');

// Get all accounts for user
exports.getAccounts = async (req, res) => {
  try {
    const [accounts] = await db.query(
      'SELECT * FROM accounts WHERE user_id = ? AND is_active = TRUE',
      [req.user.id]
    );
    res.json({ success: true, accounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get account details + recent transactions
exports.getAccountDetails = async (req, res) => {
  try {
    const { accountId } = req.params;
    const [accounts] = await db.query(
      'SELECT * FROM accounts WHERE id = ? AND user_id = ?',
      [accountId, req.user.id]
    );
    if (accounts.length === 0)
      return res.status(404).json({ success: false, message: 'Account not found' });

    const [txns] = await db.query(
      `SELECT t.*, 
        fa.account_number as from_acc, ta.account_number as to_acc
       FROM transactions t
       LEFT JOIN accounts fa ON t.from_account_id = fa.id
       LEFT JOIN accounts ta ON t.to_account_id = ta.id
       WHERE t.from_account_id = ? OR t.to_account_id = ?
       ORDER BY t.created_at DESC LIMIT 20`,
      [accountId, accountId]
    );
    res.json({ success: true, account: accounts[0], transactions: txns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Deposit
exports.deposit = async (req, res) => {
  try {
    const { account_id, amount, description } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ success: false, message: 'Invalid amount' });

    const [accs] = await db.query(
      'SELECT * FROM accounts WHERE id = ? AND user_id = ?',
      [account_id, req.user.id]
    );
    if (accs.length === 0)
      return res.status(404).json({ success: false, message: 'Account not found' });

    await db.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, account_id]);
    await db.query(
      'INSERT INTO transactions (to_account_id, type, amount, description) VALUES (?,?,?,?)',
      [account_id, 'deposit', amount, description || 'Deposit']
    );
    await db.query(
      'INSERT INTO notifications (user_id, message, type) VALUES (?,?,?)',
      [req.user.id, `Deposit of $${amount} to account ${accs[0].account_number} was successful.`, 'success']
    );

    res.json({ success: true, message: `$${amount} deposited successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Withdraw
exports.withdraw = async (req, res) => {
  try {
    const { account_id, amount, description } = req.body;
    const [accs] = await db.query(
      'SELECT * FROM accounts WHERE id = ? AND user_id = ?',
      [account_id, req.user.id]
    );
    if (accs.length === 0)
      return res.status(404).json({ success: false, message: 'Account not found' });
    if (parseFloat(accs[0].balance) < parseFloat(amount))
      return res.status(400).json({ success: false, message: 'Insufficient balance' });

    await db.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, account_id]);
    await db.query(
      'INSERT INTO transactions (from_account_id, type, amount, description) VALUES (?,?,?,?)',
      [account_id, 'withdrawal', amount, description || 'Withdrawal']
    );

    res.json({ success: true, message: `$${amount} withdrawn successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Transfer
exports.transfer = async (req, res) => {
  try {
    const { from_account_id, to_account_number, amount, description } = req.body;

    const [fromAcc] = await db.query(
      'SELECT * FROM accounts WHERE id = ? AND user_id = ?',
      [from_account_id, req.user.id]
    );
    if (fromAcc.length === 0)
      return res.status(404).json({ success: false, message: 'Source account not found' });
    if (parseFloat(fromAcc[0].balance) < parseFloat(amount))
      return res.status(400).json({ success: false, message: 'Insufficient balance' });

    const [toAcc] = await db.query(
      'SELECT * FROM accounts WHERE account_number = ? AND is_active = TRUE',
      [to_account_number]
    );
    if (toAcc.length === 0)
      return res.status(404).json({ success: false, message: 'Destination account not found' });

    await db.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, from_account_id]);
    await db.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, toAcc[0].id]);
    await db.query(
      'INSERT INTO transactions (from_account_id, to_account_id, type, amount, description) VALUES (?,?,?,?,?)',
      [from_account_id, toAcc[0].id, 'transfer', amount, description || 'Fund Transfer']
    );
    await db.query(
      'INSERT INTO notifications (user_id, message, type) VALUES (?,?,?)',
      [req.user.id, `Transfer of $${amount} to ${to_account_number} completed.`, 'info']
    );

    res.json({ success: true, message: `$${amount} transferred to ${to_account_number}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const [accounts] = await db.query('SELECT id FROM accounts WHERE user_id = ?', [req.user.id]);
    const ids = accounts.map(a => a.id);
    if (ids.length === 0) return res.json({ success: true, transactions: [] });

    const placeholders = ids.map(() => '?').join(',');
    const [txns] = await db.query(
      `SELECT t.*, fa.account_number as from_acc, ta.account_number as to_acc
       FROM transactions t
       LEFT JOIN accounts fa ON t.from_account_id = fa.id
       LEFT JOIN accounts ta ON t.to_account_id = ta.id
       WHERE t.from_account_id IN (${placeholders}) OR t.to_account_id IN (${placeholders})
       ORDER BY t.created_at DESC LIMIT 50`,
      [...ids, ...ids]
    );
    res.json({ success: true, transactions: txns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
