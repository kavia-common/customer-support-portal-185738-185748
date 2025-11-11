import React from 'react';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Header() {
  /** Header with brand and basic navigation (no auth) */
  const navigate = useNavigate();

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
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Dashboard</button>
      </div>
    </div>
  );
}
