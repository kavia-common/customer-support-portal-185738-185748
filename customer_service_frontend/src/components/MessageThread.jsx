import React, { useState } from 'react';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function MessageThread({ ticketId, messages, onMessagePosted }) {
  /** Shows messages and provides a form to post a new message */
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const post = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    setError('');
    try {
      // Backend expects: { content, ticket_id, author_id }
      const userRaw = localStorage.getItem('user');
      let author_id = undefined;
      try {
        const parsed = userRaw ? JSON.parse(userRaw) : null;
        author_id = parsed?.id;
      } catch { /* ignore parse errors */ }

      const payload = { content, ticket_id: Number(ticketId) };
      if (author_id) payload.author_id = author_id;

      const created = await api.post('/messages', payload);
      onMessagePosted && onMessagePosted(created);
      setContent('');
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
        {(messages || []).map((m, idx) => (
          <div key={m.id || idx} className="message">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{m.author?.name || m.author || m.author_id || 'User'}</strong>
              <span className="subtitle">{new Date(m.created_at || m.timestamp || Date.now()).toLocaleString()}</span>
            </div>
            <div style={{ marginTop: 6 }}>{m.content || m.text}</div>
          </div>
        ))}
      </div>
      {error && <div style={{ color: 'var(--color-error)', marginBottom: 8 }}>{error}</div>}
      <form onSubmit={post} style={{ display: 'grid', gap: 8 }}>
        <textarea
          className="textarea"
          rows={3}
          placeholder="Write a reply..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn" type="submit" disabled={posting || !content.trim()}>
            {posting ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
