import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';
import TicketFormModal from '../components/TicketFormModal';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Main dashboard page combining layout and ticket components */
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  return (
    <>
      <Header />
      <div className="layout">
        <Sidebar onCreate={() => setCreateOpen(true)} />
        <div className="content">
          <TicketList
            key={refreshFlag} /* force reload after create */
            selectedId={selectedId}
            onSelect={(id, ticket) => { setSelectedId(id); setSelectedTicket(ticket); }}
          />
          <TicketDetail ticketId={selectedId} fallbackTicket={selectedTicket} />
        </div>
      </div>
      <TicketFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          // trigger TicketList re-fetch by flipping key
          setRefreshFlag(v => v + 1);
        }}
      />
    </>
  );
}
