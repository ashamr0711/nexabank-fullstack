import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">NexaBank</div>
        <div className="auth-tagline">Open your account in under 2 minutes</div>
        {[
          { icon: '🎁', text: 'No monthly fees on savings accounts' },
          { icon: '📱', text: 'Full-featured mobile banking' },
          { icon: '💳', text: 'Free virtual debit card' },
          { icon: '🏆', text: 'Award-winning customer support' },
        ].map((f, i) => (
          <div className="auth-feature" key={i}>
            <div className="auth-feature-icon">{f.icon}</div>
            <div className="auth-feature-text">{f.text}</div>
          </div>
        ))}
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <div className="auth-title">Create account</div>
          <div className="auth-sub">Join thousands of NexaBank customers</div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="John Carter"
                  value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="555-0101"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Address (optional)</label>
              <input className="form-input" placeholder="123 Main St, City"
                value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Open My Account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
