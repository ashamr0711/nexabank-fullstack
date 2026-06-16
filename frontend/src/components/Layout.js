import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', icon: '⬛', label: 'Dashboard', exact: true },
  { path: '/transactions', icon: '📋', label: 'Transactions' },
  { path: '/transfer', icon: '↗️', label: 'Transfer Money' },
  { path: '/loans', icon: '🏦', label: 'Loans' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-name">NexaBank</div>
          <div className="sidebar-brand-tag">Smart Digital Banking</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu</div>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">{initials}</div>
            <div>
              <div className="user-name">{user?.full_name?.split(' ')[0]}</div>
              <div className="user-role">Account Holder</div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">⏻</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
