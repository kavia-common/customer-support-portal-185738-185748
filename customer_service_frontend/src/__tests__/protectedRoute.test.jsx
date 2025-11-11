import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
  localStorage.clear();
});

test('redirects to /login when no token', async () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <App />
    </MemoryRouter>
  );

  // Await the login headline as the redirect effect resolves
  const heading = await screen.findByText(/welcome back/i);
  expect(heading).toBeInTheDocument();
});
