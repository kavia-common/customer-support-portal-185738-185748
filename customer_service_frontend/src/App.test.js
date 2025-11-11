import { render, screen } from '@testing-library/react';
import App from './App';

// Update test to assert on actual UI text from Login page rendered by default
test('renders login page heading', async () => {
  render(<App />);
  const heading = await screen.findByText(/Welcome back/i);
  expect(heading).toBeInTheDocument();
});
