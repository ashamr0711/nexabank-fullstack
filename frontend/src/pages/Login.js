import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">NexaBank</div>
        <div className="auth-tagline">Your trusted digital banking partner</div>
        {[
          { icon: '🔒', text: 'Bank-grade 256-bit encryption' },
          { icon: '⚡', text: 'Instant transfers & payments' },
          { icon: '📊', text: 'Real-time spending analytics' },
          { icon: '🌐', text: 'Available 24/7 anywhere' },
        ].map((f, i) => (
          <div className="auth-feature" key={i}>
            <div className="auth-feature-icon">{f.icon}</div>
            <div className="auth-feature-text">{f.text}</div>
          </div>
        ))}
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">Sign in to your NexaBank account</div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
          <div className="auth-switch" style={{ marginTop: 12, fontSize: '0.8rem' }}>
            Demo: john@nexabank.com / Test@1234
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
