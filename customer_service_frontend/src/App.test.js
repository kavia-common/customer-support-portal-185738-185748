import { render, screen } from '@testing-library/react';
import App from './App';

// Update test to assert on actual UI text from Login page rendered by default
test('renders login page heading', () => {
  render(<App />);
  const heading = screen.getByText(/Welcome back/i);
  expect(heading).toBeInTheDocument();
});
