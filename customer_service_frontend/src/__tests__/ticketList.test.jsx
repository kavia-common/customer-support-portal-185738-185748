import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

jest.mock('../api/client', () => {
  return {
    api: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    },
  };
});
import { api } from '../api/client';
import TicketList from '../components/TicketList';

beforeEach(() => {
  jest.resetAllMocks();
});

test('renders tickets list', async () => {
  api.get.mockResolvedValue([
    { id: 1, title: 'First ticket', status: 'open' },
    { id: 2, title: 'Second ticket', status: 'closed' },
  ]);

  const onSelect = jest.fn();
  render(<TicketList selectedId={2} onSelect={onSelect} />);

  expect(screen.getByText(/loading tickets/i)).toBeInTheDocument();
  await waitFor(() => expect(api.get).toHaveBeenCalledWith('/tickets'));

  // Use async findByText to ensure elements are rendered
  expect(await screen.findByText(/first ticket/i)).toBeInTheDocument();
  expect(await screen.findByText(/second ticket/i)).toBeInTheDocument();

  // Click a ticket
  fireEvent.click(screen.getByText(/first ticket/i));
  expect(onSelect).toHaveBeenCalledWith(1, expect.objectContaining({ id: 1 }));
});

test('shows error when API fails', async () => {
  api.get.mockRejectedValue(new Error('Boom'));
  render(<TicketList onSelect={() => {}} />);

  // Await error text reliably
  expect(await screen.findByText(/boom/i)).toBeInTheDocument();
});
