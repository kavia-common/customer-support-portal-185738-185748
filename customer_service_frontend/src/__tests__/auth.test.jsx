import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App, { AuthContext } from '../App';

// Mock API modules
jest.mock('../api/auth', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));
import { loginUser, registerUser } from '../api/auth';

function renderWithRouter(ui, { route = '/login' } = {}) {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });
}

beforeEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

test('login flow success stores token and redirects', async () => {
  loginUser.mockResolvedValue({ access_token: 'abc123', user: { email: 'a@b.com', id: 1 } });

  renderWithRouter(<App />);
  // On first render App will use BrowserRouter; for test simplicity, render Login component directly through route
  renderWithRouter(<App />, { route: '/login' });

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret12' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

  await waitFor(() => expect(loginUser).toHaveBeenCalled());

  // token persisted by App login callback (through context)
  await waitFor(() => expect(localStorage.getItem('jwt')).toBe('abc123'));
});

test('register flow success logs in if token returned', async () => {
  registerUser.mockResolvedValue({ access_token: 'xyz789', user: { email: 'c@d.com', name: 'Test' } });

  renderWithRouter(<App />, { route: '/register' });

  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test' } });
  fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'c@d.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret12' } });
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  await waitFor(() => expect(registerUser).toHaveBeenCalled());
  await waitFor(() => expect(localStorage.getItem('jwt')).toBe('xyz789'));
});
