import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import App, { AuthContext } from '../App';

function ProtectedHarness({ token }) {
  return (
    <AuthContext.Provider value={{ token, user: null, login: () => {}, logout: () => {} }}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

test('redirects to /login when no token', () => {
  render(<ProtectedHarness token={null} />);
  // Login heading should be visible
  const heading = screen.getByText(/welcome back/i);
  expect(heading).toBeInTheDocument();
});
