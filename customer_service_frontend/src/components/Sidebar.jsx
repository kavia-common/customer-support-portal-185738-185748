import React from 'react';

// PUBLIC_INTERFACE
export default function Sidebar({ onCreate }) {
  /** Sidebar with filters and quick actions */
  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 className="title">Tickets</h3>
        <button className="btn btn-secondary" onClick={onCreate}>+ New</button>
      </div>
      <div className="card" style={{ padding: 12 }}>
        <div className="subtitle">Filters</div>
        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          <select className="select" defaultValue="all" aria-label="Status filter">
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
          <select className="select" defaultValue="recent" aria-label="Sort by">
            <option value="recent">Most recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
