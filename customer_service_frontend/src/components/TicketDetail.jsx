import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import MessageThread from './MessageThread';

// PUBLIC_INTERFACE
export default function TicketDetail({ ticketId, fallbackTicket }) {
  /** Shows ticket details and message thread */
  const [ticket, setTicket] = useState(fallbackTicket || null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  async function loadTicket() {
    if (!ticketId) return;
    setLoading(true);
    try {
      const data = await api.get(`/tickets/${ticketId}`);
      setTicket(data);
    } catch {
      // fallback to provided ticket if endpoint not available
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages() {
    if (!ticketId) return;
    try {
      const res = await api.get(`/tickets/${ticketId}/messages`);
      setMessages(Array.isArray(res) ? res : (res.items || res.messages || []));
    } catch {
      setMessages([]);
    }
  }

  useEffect(() => { loadTicket(); }, [ticketId]);
  useEffect(() => { loadMessages(); }, [ticketId]);

  if (!ticketId) {
    return <div className="detail"><div className="subtitle">Select a ticket to view details.</div></div>;
  }

  return (
    <div className="detail">
      {loading ? <div>Loading ticket...</div> : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="title">{ticket?.title || `Ticket #${ticketId}`}</div>
              <div className="subtitle">Status: {ticket?.status || 'open'}</div>
            </div>
            <div>
              <span className="badge">{ticket?.priority || 'normal'}</span>
            </div>
          </div>

          <div className="messages">
            <MessageThread
              ticketId={ticketId}
              messages={messages}
              onMessagePosted={(m) => setMessages(prev => [m, ...prev])}
            />
          </div>
        </>
      )}
    </div>
  );
}
