import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

beforeEach(() => {
  localStorage.clear();
});

test('redirects to /login when no token', async () => {
  // Ensure we attempt to access a protected route
  window.history.pushState({}, 'Test', '/dashboard');

  render(<App />);

  // Await the login headline as the redirect effect resolves
  const heading = await screen.findByText(/welcome back/i);
  expect(heading).toBeInTheDocument();
});
