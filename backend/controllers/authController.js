const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, address } = req.body;

    if (!full_name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ success: false, message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password_hash, phone, address) VALUES (?,?,?,?,?)',
      [full_name, email, hash, phone || null, address || null]
    );

    // Create default savings account
    const accNum = `NXB-${result.insertId.toString().padStart(4,'0')}-${new Date().getFullYear()}`;
    await db.query(
      'INSERT INTO accounts (user_id, account_number, account_type, balance) VALUES (?,?,?,?)',
      [result.insertId, accNum, 'savings', 0.00]
    );

    // Welcome notification
    await db.query(
      'INSERT INTO notifications (user_id, message, type) VALUES (?,?,?)',
      [result.insertId, `Welcome to NexaBank, ${full_name}! Your savings account ${accNum} is ready.`, 'success']
    );

    res.status(201).json({ success: true, message: 'Account created successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query('SELECT * FROM users WHERE email = ? AND is_active = TRUE', [email]);
    if (users.length === 0)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, full_name, email, phone, address, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone, address } = req.body;
    await db.query(
      'UPDATE users SET full_name=?, phone=?, address=? WHERE id=?',
      [full_name, phone, address, req.user.id]
    );
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
