import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtMoney = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/accounts'),
      axios.get('/transactions'),
      axios.get('/notifications'),
    ]).then(([a, t, n]) => {
      setAccounts(a.data.accounts || []);
      setTransactions(t.data.transactions || []);
      setNotifications(n.data.notifications?.slice(0, 3) || []);
      setUnread(n.data.unread_count || 0);
    }).finally(() => setLoading(false));
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + parseFloat(a.balance), 0);
  const recent = transactions.slice(0, 5);

  // Build mini chart data
  const chartData = [...transactions].reverse().slice(-7).map((t, i) => ({
    day: fmtDate(t.created_at),
    amount: parseFloat(t.amount),
  }));

  const getTxnType = (t, userAccIds) => {
    if (t.type === 'deposit') return 'credit';
    if (t.type === 'withdrawal') return 'debit';
    return userAccIds.includes(t.from_account_id) ? 'debit' : 'credit';
  };

  const accIds = accounts.map(a => a.id);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return <div className="page-header"><div className="page-sub">Loading dashboard...</div></div>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">{greeting}, {user?.full_name?.split(' ')[0]} 👋</div>
            <div className="page-sub">Here's your financial overview</div>
          </div>
          {unread > 0 && (
            <div style={{ background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.3)',
              borderRadius: 10, padding: '8px 14px', fontSize: '0.82rem', color: '#14B8A6' }}>
              🔔 {unread} new notification{unread > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card stat-card-teal">
          <div className="stat-label">Total Balance</div>
          <div className="stat-value">${fmtMoney(totalBalance)}</div>
          <div className="stat-change" style={{ color: '#6EE7B7' }}>↑ Across all accounts</div>
          <div className="stat-icon">💰</div>
        </div>
        <div className="stat-card stat-card-gold">
          <div className="stat-label">Active Accounts</div>
          <div className="stat-value">{accounts.length}</div>
          <div className="stat-change" style={{ color: '#FCD34D' }}>Savings & Checking</div>
          <div className="stat-icon">🏦</div>
        </div>
        <div className="stat-card stat-card-blue">
          <div className="stat-label">Transactions</div>
          <div className="stat-value">{transactions.length}</div>
          <div className="stat-change" style={{ color: '#93C5FD' }}>Total history</div>
          <div className="stat-icon">📊</div>
        </div>
        <div className="stat-card stat-card-purple">
          <div className="stat-label">Member Since</div>
          <div className="stat-value" style={{ fontSize: '1.2rem' }}>
            {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
          <div className="stat-change" style={{ color: '#C4B5FD' }}>Verified Account</div>
          <div className="stat-icon">✅</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Accounts */}
        <div>
          <div className="section-header">
            <div className="section-title">Your Accounts</div>
            <span className="section-link" onClick={() => navigate('/transfer')}>+ Transfer</span>
          </div>
          {accounts.map(acc => (
            <div className="bank-card" key={acc.id} style={{ marginBottom: 16 }}>
              <div className="bank-card-chip"></div>
              <div className="bank-card-type">{acc.account_type} account</div>
              <div className="bank-card-balance">${fmtMoney(acc.balance)}</div>
              <div className="bank-card-num">{acc.account_number}</div>
            </div>
          ))}
          {accounts.length === 0 && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
              No accounts found.
            </div>
          )}
        </div>

        {/* Chart */}
        <div>
          <div className="section-header">
            <div className="section-title">Recent Activity</div>
          </div>
          <div className="card">
            {chartData.length > 0 ? (
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0F2044', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#F8FAFC' }} />
                    <Line type="monotone" dataKey="amount" stroke="#0D9488" strokeWidth={2.5} dot={{ fill: '#0D9488', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No activity yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ marginTop: 24 }}>
        <div className="section-header">
          <div className="section-title">Recent Transactions</div>
          <span className="section-link" onClick={() => navigate('/transactions')}>View all →</span>
        </div>
        <div className="card">
          <div className="txn-list">
            {recent.map(t => {
              const type = getTxnType(t, accIds);
              const icons = { credit: '⬇️', debit: '⬆️', transfer: '↔️' };
              const icon = t.type === 'transfer' ? '↔️' : icons[type];
              return (
                <div className="txn-item" key={t.id}>
                  <div className={`txn-icon txn-icon-${type === 'credit' ? 'credit' : type === 'debit' ? 'debit' : 'transfer'}`}>
                    {icon}
                  </div>
                  <div className="txn-desc">
                    <div className="txn-title">{t.description}</div>
                    <div className="txn-date">{fmtDate(t.created_at)}</div>
                  </div>
                  <div className={`txn-amount ${type === 'credit' ? 'amount-credit' : 'amount-debit'}`}>
                    {type === 'credit' ? '+' : '-'}${fmtMoney(t.amount)}
                  </div>
                </div>
              );
            })}
            {recent.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>No transactions yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div className="section-header">
            <div className="section-title">Notifications</div>
          </div>
          <div className="card">
            {notifications.map(n => (
              <div className="notif-item" key={n.id}>
                <div className="notif-dot" style={{ background: n.type === 'success' ? 'var(--success)' : n.type === 'error' ? 'var(--danger)' : 'var(--teal)' }}></div>
                <div>
                  <div className="notif-text">{n.message}</div>
                  <div className="notif-time">{fmtDate(n.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
