import React, { useEffect, useState } from 'react';
import axios from 'axios';

const fmtMoney = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });

const loanTypes = [
  { key: 'personal', label: '👤 Personal', rate: '10.5%', max: '$50,000' },
  { key: 'home', label: '🏠 Home', rate: '7.5%', max: '$500,000' },
  { key: 'auto', label: '🚗 Auto', rate: '9.0%', max: '$100,000' },
  { key: 'education', label: '🎓 Education', rate: '8.0%', max: '$75,000' },
];

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [form, setForm] = useState({ loan_type: 'personal', amount: '', tenure_months: 12 });
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/loans').then(r => setLoans(r.data.loans || []));
  }, []);

  const calcEMI = (amount, type, months) => {
    const rates = { personal: 10.5, home: 7.5, auto: 9.0, education: 8.0 };
    const r = (rates[type] || 10) / 100 / 12;
    const emi = (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return emi;
  };

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    const updated = { ...form, [field]: val };
    setForm(updated);
    if (updated.amount && updated.tenure_months) {
      const emi = calcEMI(parseFloat(updated.amount), updated.loan_type, parseInt(updated.tenure_months));
      setPreview({ emi: emi.toFixed(2), total: (emi * updated.tenure_months).toFixed(2) });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg({ type: '', text: '' });
    try {
      const res = await axios.post('/loans/apply', {
        loan_type: form.loan_type,
        amount: parseFloat(form.amount),
        tenure_months: parseInt(form.tenure_months)
      });
      setMsg({ type: 'success', text: `Loan application submitted! Estimated EMI: $${res.data.emi}/month` });
      setForm({ loan_type: 'personal', amount: '', tenure_months: 12 });
      setPreview(null);
      axios.get('/loans').then(r => setLoans(r.data.loans || []));
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Application failed' });
    } finally {
      setLoading(false);
    }
  };

  const statusColors = { pending: 'pending', approved: 'success', rejected: 'error', active: 'success', closed: 'pending' };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Loan Center</div>
        <div className="page-sub">Apply for a loan and track your applications</div>
      </div>

      <div className="grid-2">
        {/* Loan Type Cards */}
        <div>
          <div className="section-header"><div className="section-title">Loan Products</div></div>
          <div className="grid-2" style={{ marginBottom: 24 }}>
            {loanTypes.map(l => (
              <div key={l.key} className="card card-sm" style={{
                cursor: 'pointer', border: form.loan_type === l.key ? '1px solid var(--teal)' : '1px solid var(--border)',
                background: form.loan_type === l.key ? 'var(--teal-glow)' : 'var(--card-bg)',
                transition: 'all 0.2s'
              }} onClick={() => setForm(f => ({ ...f, loan_type: l.key }))}>
                <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{l.label.split(' ')[0]}</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{l.label.split(' ').slice(1).join(' ')} Loan</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>Rate: {l.rate} p.a.</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--teal-light)' }}>Up to {l.max}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Apply for a Loan</div>
            {msg.text && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label">Loan Type</label>
                <select className="form-input" value={form.loan_type} onChange={handleChange('loan_type')}>
                  {loanTypes.map(l => <option key={l.key} value={l.key}>{l.label.split(' ').slice(1).join(' ')} Loan</option>)}
                </select>
              </div>
              <div className="input-row">
                <div className="form-group">
                  <label className="form-label">Loan Amount ($)</label>
                  <input type="number" className="form-input" placeholder="10000" min="1000" step="100"
                    value={form.amount} onChange={handleChange('amount')} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Tenure (Months)</label>
                  <select className="form-input" value={form.tenure_months} onChange={handleChange('tenure_months')}>
                    {[6, 12, 24, 36, 48, 60, 84, 120].map(m => (
                      <option key={m} value={m}>{m} months</option>
                    ))}
                  </select>
                </div>
              </div>

              {preview && (
                <div style={{ background: 'var(--teal-glow)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Monthly EMI</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--teal-light)' }}>${fmtMoney(preview.emi)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Total Repayment</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>${fmtMoney(preview.total)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Interest</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold)' }}>
                        ${fmtMoney((parseFloat(preview.total) - parseFloat(form.amount)).toFixed(2))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-gold" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Submitting...' : 'Apply Now'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Loans */}
        <div>
          <div className="section-header"><div className="section-title">My Applications ({loans.length})</div></div>
          {loans.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🏦</div>
              No loan applications yet. Apply for your first loan!
            </div>
          ) : loans.map(l => (
            <div className="loan-card" key={l.id}>
              <div className="loan-header">
                <div className="loan-type">{l.loan_type} Loan</div>
                <span className={`badge badge-${statusColors[l.status] || 'pending'}`}>{l.status}</span>
              </div>
              <div className="loan-detail">
                <div>
                  <div className="loan-meta">Amount</div>
                  <div className="loan-val">${fmtMoney(l.amount)}</div>
                </div>
                <div>
                  <div className="loan-meta">EMI / Month</div>
                  <div className="loan-val" style={{ color: 'var(--teal-light)' }}>${fmtMoney(l.emi)}</div>
                </div>
                <div>
                  <div className="loan-meta">Tenure</div>
                  <div className="loan-val">{l.tenure_months} mo</div>
                </div>
                <div>
                  <div className="loan-meta">Rate</div>
                  <div className="loan-val">{l.interest_rate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loans;
