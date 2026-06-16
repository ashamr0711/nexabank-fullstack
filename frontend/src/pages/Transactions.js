import React, { useEffect, useState } from 'react';
import axios from 'axios';

const fmtDate = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const fmtMoney = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get('/transactions'), axios.get('/accounts')]).then(([t, a]) => {
      setTransactions(t.data.transactions || []);
      setAccounts(a.data.accounts || []);
    }).finally(() => setLoading(false));
  }, []);

  const accIds = accounts.map(a => a.id);

  const getTxnType = (t) => {
    if (t.type === 'deposit') return 'credit';
    if (t.type === 'withdrawal') return 'debit';
    return accIds.includes(t.from_account_id) ? 'debit' : 'credit';
  };

  const filtered = filter === 'all' ? transactions
    : transactions.filter(t => t.type === filter);

  const typeIcons = { deposit: '⬇️', withdrawal: '⬆️', transfer: '↔️', payment: '💳' };
  const typeColors = { credit: '#10B981', debit: '#EF4444' };

  if (loading) return <div className="page-sub">Loading transactions...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Transactions</div>
        <div className="page-sub">Complete history of your account activity</div>
      </div>

      {/* Summary Row */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Credits', val: transactions.filter(t => getTxnType(t) === 'credit').reduce((s, t) => s + parseFloat(t.amount), 0), color: '#10B981', icon: '⬇️' },
          { label: 'Total Debits', val: transactions.filter(t => getTxnType(t) === 'debit').reduce((s, t) => s + parseFloat(t.amount), 0), color: '#EF4444', icon: '⬆️' },
          { label: 'Total Transactions', val: null, count: transactions.length, icon: '📋' },
        ].map((s, i) => (
          <div className="card" key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color || 'var(--white)' }}>
              {s.val !== undefined ? `$${fmtMoney(s.val)}` : s.count}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="tabs">
        {['all', 'deposit', 'withdrawal', 'transfer'].map(f => (
          <button key={f} className={`tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="txn-list">
          {filtered.map(t => {
            const type = getTxnType(t);
            return (
              <div className="txn-item" key={t.id}>
                <div className={`txn-icon txn-icon-${type === 'credit' ? 'credit' : 'debit'}`}>
                  {typeIcons[t.type] || '💳'}
                </div>
                <div className="txn-desc">
                  <div className="txn-title">{t.description || t.type}</div>
                  <div className="txn-date">
                    {t.from_acc && t.to_acc ? `${t.from_acc} → ${t.to_acc}` : t.to_acc || t.from_acc || '—'}
                  </div>
                  <div className="txn-date">{fmtDate(t.created_at)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`txn-amount ${type === 'credit' ? 'amount-credit' : 'amount-debit'}`}>
                    {type === 'credit' ? '+' : '-'}${fmtMoney(t.amount)}
                  </div>
                  <span className={`badge badge-${t.status === 'completed' ? 'success' : t.status === 'pending' ? 'pending' : 'error'}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
              No {filter !== 'all' ? filter : ''} transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
