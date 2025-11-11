import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function TicketList({ selectedId, onSelect }) {
  /** Lists tickets from GET /tickets */
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTickets() {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/tickets');
      // normalize tickets array
      const list = Array.isArray(data) ? data : (data.items || data.tickets || []);
      setTickets(list);
    } catch (e) {
      setError(e.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTickets(); }, []);

  if (loading) return <div className="card" style={{ padding: 12 }}>Loading tickets...</div>;
  if (error) return <div className="card" style={{ padding: 12, color: 'var(--color-error)' }}>{error}</div>;

  return (
    <div className="card ticket-list">
      {tickets.length === 0 && <div style={{ padding: 12 }} className="subtitle">No tickets found.</div>}
      {tickets.map(t => (
        <div
          key={t.id || t.ticket_id}
          className={`ticket-item ${selectedId === (t.id || t.ticket_id) ? 'active' : ''}`}
          onClick={() => onSelect(t.id || t.ticket_id, t)}
          role="button"
          tabIndex={0}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{t.title || `Ticket #${t.id || t.ticket_id}`}</strong>
            <span className={`badge ${String(t.status).toLowerCase() === 'closed' ? 'closed' : 'open'}`}>
              {t.status || 'open'}
            </span>
          </div>
          <div className="subtitle">{t.category || t.priority || 'General'}</div>
        </div>
      ))}
    </div>
  );
}
