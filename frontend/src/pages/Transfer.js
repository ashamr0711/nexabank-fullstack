import React, { useEffect, useState } from 'react';
import axios from 'axios';

const fmtMoney = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });

const Transfer = () => {
  const [tab, setTab] = useState('transfer');
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    from_account_id: '', to_account_number: '', amount: '',
    description: '', account_id: ''
  });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/accounts').then(r => {
      setAccounts(r.data.accounts || []);
      if (r.data.accounts?.length) {
        setForm(f => ({ ...f, from_account_id: r.data.accounts[0].id, account_id: r.data.accounts[0].id }));
      }
    });
  }, []);

  const handle = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setLoading(true);
    try {
      let res;
      if (tab === 'transfer') {
        res = await axios.post('/accounts/transfer', {
          from_account_id: form.from_account_id,
          to_account_number: form.to_account_number,
          amount: parseFloat(form.amount),
          description: form.description || 'Fund Transfer'
        });
      } else if (tab === 'deposit') {
        res = await axios.post('/accounts/deposit', {
          account_id: form.account_id,
          amount: parseFloat(form.amount),
          description: form.description || 'Deposit'
        });
      } else {
        res = await axios.post('/accounts/withdraw', {
          account_id: form.account_id,
          amount: parseFloat(form.amount),
          description: form.description || 'Withdrawal'
        });
      }
      setMsg({ type: 'success', text: res.data.message });
      setForm(f => ({ ...f, amount: '', to_account_number: '', description: '' }));
      // Refresh accounts
      axios.get('/accounts').then(r => setAccounts(r.data.accounts || []));
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Transaction failed' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'transfer', label: '↔️ Transfer', desc: 'Send money to another account' },
    { key: 'deposit', label: '⬇️ Deposit', desc: 'Add funds to your account' },
    { key: 'withdraw', label: '⬆️ Withdraw', desc: 'Withdraw from your account' },
  ];

  const selectedAcc = accounts.find(a => a.id == (tab === 'transfer' ? form.from_account_id : form.account_id));

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Money Movement</div>
        <div className="page-sub">Transfer, deposit, or withdraw funds securely</div>
      </div>

      <div className="grid-2">
        {/* Form Card */}
        <div className="card">
          <div className="tabs">
            {tabs.map(t => (
              <button key={t.key} className={`tab${tab === t.key ? ' active' : ''}`} onClick={() => { setTab(t.key); setMsg({ type: '', text: '' }); }}>
                {t.label}
              </button>
            ))}
          </div>

          {msg.text && (
            <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>
          )}

          <form onSubmit={submit}>
            {tab === 'transfer' ? (
              <>
                <div className="form-group">
                  <label className="form-label">From Account</label>
                  <select className="form-input" value={form.from_account_id} onChange={handle('from_account_id')}>
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.account_number} — ${fmtMoney(a.balance)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Recipient Account Number</label>
                  <input className="form-input" placeholder="e.g. NXB-003-2024"
                    value={form.to_account_number} onChange={handle('to_account_number')} required />
                </div>
              </>
            ) : (
              <div className="form-group">
                <label className="form-label">Account</label>
                <select className="form-input" value={form.account_id} onChange={handle('account_id')}>
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.account_number} — ${fmtMoney(a.balance)}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Amount (USD)</label>
              <input type="number" className="form-input" placeholder="0.00" min="1" step="0.01"
                value={form.amount} onChange={handle('amount')} required />
            </div>

            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <input className="form-input" placeholder="What's this for?"
                value={form.description} onChange={handle('description')} />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : tab === 'transfer' ? 'Send Money' : tab === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </button>
          </form>
        </div>

        {/* Info Panel */}
        <div>
          {selectedAcc && (
            <div className="bank-card" style={{ marginBottom: 20 }}>
              <div className="bank-card-chip"></div>
              <div className="bank-card-type">{selectedAcc.account_type} • Selected Account</div>
              <div className="bank-card-balance">${fmtMoney(selectedAcc.balance)}</div>
              <div className="bank-card-num">{selectedAcc.account_number}</div>
            </div>
          )}

          <div className="card">
            <div style={{ marginBottom: 16, fontWeight: 600 }}>💡 Transaction Tips</div>
            {[
              { icon: '🔒', tip: 'All transfers are encrypted and secured' },
              { icon: '⚡', tip: 'Internal transfers are instant' },
              { icon: '📋', tip: 'Transactions appear immediately in history' },
              { icon: '💬', tip: 'Add a description to keep track of purpose' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1rem' }}>{t.icon}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{t.tip}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>All Your Accounts</div>
            {accounts.map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{a.account_number}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'capitalize' }}>{a.account_type}</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--teal-light)' }}>${fmtMoney(a.balance)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
