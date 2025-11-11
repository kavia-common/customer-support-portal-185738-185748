import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock API modules
jest.mock('../api/auth', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));
import { loginUser, registerUser } from '../api/auth';

// Helper to render at a specific route
function renderAppAt(route = '/login') {
  window.history.pushState({}, 'Test page', route);
  return render(<App />);
}

beforeEach(() => {
  // Ensure clean state for every test
  localStorage.clear();
  jest.resetAllMocks();
});

test('login flow success stores token and redirects', async () => {
  loginUser.mockResolvedValue({ access_token: 'abc123', user: { email: 'a@b.com', id: 1 } });

  renderAppAt('/login');

  // Wait for input fields to be present to avoid race conditions
  const emailInput = await screen.findByLabelText(/email/i);
  const passwordInput = await screen.findByLabelText(/password/i);

  fireEvent.change(emailInput, { target: { value: 'a@b.com' } });
  fireEvent.change(passwordInput, { target: { value: 'secret12' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

  await waitFor(() => expect(loginUser).toHaveBeenCalled());

  // token persisted by App login callback (through context)
  await waitFor(() => expect(localStorage.getItem('jwt')).toBe('abc123'));
});

test('register flow success logs in if token returned', async () => {
  registerUser.mockResolvedValue({ access_token: 'xyz789', user: { email: 'c@d.com', name: 'Test' } });

  renderAppAt('/register');

  // Use async findBy* queries for stability
  const nameInput = await screen.findByLabelText(/name/i);
  const emailInput = await screen.findByLabelText(/^email$/i);
  const passwordInput = await screen.findByLabelText(/password/i);

  fireEvent.change(nameInput, { target: { value: 'Test' } });
  fireEvent.change(emailInput, { target: { value: 'c@d.com' } });
  fireEvent.change(passwordInput, { target: { value: 'secret12' } });
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  await waitFor(() => expect(registerUser).toHaveBeenCalled());
  await waitFor(() => expect(localStorage.getItem('jwt')).toBe('xyz789'));
});
