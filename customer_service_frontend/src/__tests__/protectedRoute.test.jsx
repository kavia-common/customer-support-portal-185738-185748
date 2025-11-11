import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

// Mock BrowserRouter to MemoryRouter and start at /dashboard to test protected route redirect
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => <MemoryRouter initialEntries={['/dashboard']}>{children}</MemoryRouter>,
  };
});

beforeEach(() => {
  localStorage.clear();
});

test('redirects to /login when no token', async () => {
  render(<App />);

  // Await the login headline as the redirect effect resolves
  const heading = await screen.findByText(/welcome back/i);
  expect(heading).toBeInTheDocument();
});
