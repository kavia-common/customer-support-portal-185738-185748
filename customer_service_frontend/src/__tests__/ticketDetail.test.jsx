import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

jest.mock('../api/client', () => {
  const actual = jest.requireActual('../api/client');
  return {
    ...actual,
    api: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    },
    messagesApi: {
      listByTicket: jest.fn(),
      post: jest.fn(),
    },
  };
});

import { api, messagesApi } from '../api/client';
import TicketDetail from '../components/TicketDetail';

beforeEach(() => {
  jest.resetAllMocks();
  localStorage.setItem('user', JSON.stringify({ id: 10, email: 'x@y.com' }));
  localStorage.setItem('jwt', 'token');
});

test('loads ticket and messages', async () => {
  api.get.mockResolvedValue({ id: 5, title: 'Loaded ticket', status: 'open' });
  messagesApi.listByTicket.mockResolvedValue([
    { id: 1, content: 'Hello', author_id: 10, created_at: new Date().toISOString() },
  ]);

  render(<TicketDetail ticketId={5} />);

  await waitFor(() => expect(api.get).toHaveBeenCalledWith('/tickets/5'));
  // Use async findBy* to assert rendered title
  expect(await screen.findByText(/loaded ticket/i)).toBeInTheDocument();

  await waitFor(() => expect(messagesApi.listByTicket).toHaveBeenCalledWith(5));
  expect(await screen.findByText(/hello/i)).toBeInTheDocument();
});

test('posting a message appends to UI', async () => {
  api.get.mockResolvedValue({ id: 7, title: 'Msg Ticket', status: 'open' });
  messagesApi.listByTicket.mockResolvedValue([]);
  // Since TicketDetail uses api.post('/messages') internally through MessageThread, we ensure api.post returns created message
  api.post.mockResolvedValue({
    id: 99,
    content: 'New message',
    author_id: 10,
    ticket_id: 7,
    created_at: new Date().toISOString(),
  });

  render(<TicketDetail ticketId={7} />);

  await waitFor(() => expect(api.get).toHaveBeenCalled());
  await waitFor(() => expect(messagesApi.listByTicket).toHaveBeenCalled());

  const textarea = await screen.findByPlaceholderText(/write a reply/i);
  fireEvent.change(textarea, { target: { value: 'New message' } });
  fireEvent.click(screen.getByRole('button', { name: /send/i }));

  await waitFor(() =>
    expect(api.post).toHaveBeenCalledWith('/messages', {
      content: 'New message',
      ticket_id: 7,
      author_id: 10,
    })
  );

  // The UI prepends new message
  expect(await screen.findByText(/new message/i)).toBeInTheDocument();
});
