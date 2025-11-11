import React from 'react';
import { render, screen } from '@testing-library/react';
import App, { AuthContext } from '../App';

function ProtectedHarness({ token }) {
  // Render App directly; it already contains BrowserRouter.
  // Set the initial route to /dashboard to trigger ProtectedRoute.
  window.history.pushState({}, 'Test', '/dashboard');
  return (
    <AuthContext.Provider value={{ token, user: null, login: () => {}, logout: () => {} }}>
      <App />
    </AuthContext.Provider>
  );
}

test('redirects to /login when no token', () => {
  render(<ProtectedHarness token={null} />);
  // Login heading should be visible
  const heading = screen.getByText(/welcome back/i);
  expect(heading).toBeInTheDocument();
});
