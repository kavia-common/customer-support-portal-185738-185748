import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
  localStorage.clear();
});

// Helper to render App with a specific initial route
function renderWithRoute(route = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}

// App should route to Dashboard and show brand header
test('renders dashboard by default', async () => {
  renderWithRoute('/');
  const brand = await screen.findByText(/customer support portal/i);
  expect(brand).toBeInTheDocument();
});
