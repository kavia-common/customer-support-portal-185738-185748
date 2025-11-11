import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
  localStorage.clear();
});

// Helper to render App with a specific initial route
function renderWithRoute(route = '/login') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}

// Assert the Login screen renders by default (no token)
test('renders login page heading', async () => {
  renderWithRoute('/login');
  const heading = await screen.findByText(/Welcome back/i);
  expect(heading).toBeInTheDocument();
});
