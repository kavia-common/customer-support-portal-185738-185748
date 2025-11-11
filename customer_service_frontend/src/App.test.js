import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

// Mock BrowserRouter to use MemoryRouter in tests to control initialEntries and ensure routes mount.
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => <MemoryRouter initialEntries={['/login']}>{children}</MemoryRouter>,
  };
});

beforeEach(() => {
  localStorage.clear();
});

// Assert the Login screen renders by default (no token)
test('renders login page heading', async () => {
  render(<App />);
  const heading = await screen.findByText(/Welcome back/i);
  expect(heading).toBeInTheDocument();
});
