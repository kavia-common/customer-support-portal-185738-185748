import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

// PUBLIC_INTERFACE
export default function Header() {
  /** Header with brand and user actions */
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="card" style={{ margin: '16px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-primary)' }} />
        <div>
          <div className="title">Customer Support Portal</div>
          <div className="subtitle">Ocean Professional</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user ? <span className="subtitle">Hi, {user.name || user.email}</span> : null}
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
