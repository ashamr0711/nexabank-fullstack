import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', phone: '', address: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/auth/profile').then(r => {
      const u = r.data.user;
      setForm({ full_name: u.full_name || '', phone: u.phone || '', address: u.address || '' });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg({ type: '', text: '' });
    try {
      await axios.put('/auth/profile', form);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const initials = form.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      <div className="page-header">
        <div className="page-title">My Profile</div>
        <div className="page-sub">Manage your personal information</div>
      </div>

      <div className="grid-2">
        {/* Profile Card */}
        <div>
          <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--teal), var(--gold))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 700, margin: '0 auto 16px'
            }}>{initials}</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{form.full_name}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 4 }}>{user?.email}</div>
            <div style={{ marginTop: 12 }}>
              <span className="badge badge-success">✓ Verified Account</span>
            </div>
          </div>

          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Account Info</div>
            {[
              { label: 'Account ID', val: `#${user?.id?.toString().padStart(6, '0')}` },
              { label: 'Email', val: user?.email },
              { label: 'Member Since', val: new Date().getFullYear() },
              { label: 'Account Status', val: '✅ Active' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{item.label}</span>
                <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 20 }}>Edit Profile</div>

          {msg.text && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" value={user?.email} disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" placeholder="555-0101" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" placeholder="Your address" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-danger" style={{ width: '100%' }}
              onClick={() => { logout(); navigate('/login'); }}>
              Sign Out of NexaBank
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
