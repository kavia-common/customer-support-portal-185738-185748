import React, { useState } from 'react';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function TicketFormModal({ open, onClose, onCreated }) {
  /** Modal form to create a new ticket via POST /tickets */
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { title, category, description };
      const created = await api.post('/tickets', payload);
      onCreated && onCreated(created);
      setTitle(''); setCategory('General'); setDescription('');
      onClose && onClose();
    } catch (err) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 className="title">New Ticket</h3>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>
        {error && <div style={{ color: 'var(--color-error)', marginBottom: 8 }}>{error}</div>}
        <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
          <label>
            <div className="subtitle">Title</div>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} required />
          </label>
          <label>
            <div className="subtitle">Category</div>
            <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
              <option>General</option>
              <option>Billing</option>
              <option>Technical</option>
              <option>Account</option>
            </select>
          </label>
          <label>
            <div className="subtitle">Description</div>
            <textarea className="textarea" rows={5} value={description} onChange={e => setDescription(e.target.value)} />
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn" disabled={submitting}>{submitting ? 'Creating...' : 'Create Ticket'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
