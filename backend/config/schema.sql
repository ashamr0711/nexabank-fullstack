-- =============================================
-- NEXABANK - Banking Application Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS nexabank;
USE nexabank;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  account_number VARCHAR(20) UNIQUE NOT NULL,
  account_type ENUM('savings', 'checking', 'fixed_deposit') DEFAULT 'savings',
  balance DECIMAL(15,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_account_id INT,
  to_account_id INT,
  type ENUM('deposit', 'withdrawal', 'transfer', 'payment') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description VARCHAR(255),
  status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id),
  FOREIGN KEY (to_account_id) REFERENCES accounts(id)
);

-- Beneficiaries Table
CREATE TABLE IF NOT EXISTS beneficiaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  bank_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Loans Table
CREATE TABLE IF NOT EXISTS loans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  loan_type ENUM('personal', 'home', 'auto', 'education') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  tenure_months INT NOT NULL,
  emi DECIMAL(15,2),
  status ENUM('pending', 'approved', 'rejected', 'active', 'closed') DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Sample Users (password: Test@1234)
INSERT INTO users (full_name, email, password_hash, phone, address) VALUES
('John Carter', 'john@nexabank.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '555-0101', '123 Oak Lane, NY'),
('Sarah Mitchell', 'sarah@nexabank.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '555-0102', '456 Maple Ave, CA');

-- Sample Accounts
INSERT INTO accounts (user_id, account_number, account_type, balance) VALUES
(1, 'NXB-001-2024', 'savings', 15750.00),
(1, 'NXB-002-2024', 'checking', 3200.00),
(2, 'NXB-003-2024', 'savings', 22400.00);

-- Sample Transactions
INSERT INTO transactions (from_account_id, to_account_id, type, amount, description, status) VALUES
(NULL, 1, 'deposit', 5000.00, 'Initial Deposit', 'completed'),
(1, 3, 'transfer', 1200.00, 'Transfer to Sarah', 'completed'),
(NULL, 1, 'deposit', 3000.00, 'Salary Credit', 'completed'),
(1, NULL, 'withdrawal', 500.00, 'ATM Withdrawal', 'completed'),
(NULL, 1, 'deposit', 9250.00, 'Investment Return', 'completed');

-- Sample Notifications
INSERT INTO notifications (user_id, message, type) VALUES
(1, 'Welcome to NexaBank! Your account is ready.', 'success'),
(1, 'Transfer of $1,200 to NXB-003-2024 was successful.', 'info'),
(1, 'Your monthly statement is available.', 'info');
