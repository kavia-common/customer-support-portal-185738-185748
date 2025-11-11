/**
 * Global Jest setup for CRA tests.
 * - Adds jest-dom matchers
 * - Stubs window.location.replace to avoid jsdom navigation errors during tests
 * - Provides a default JWT and user in localStorage so components hitting protected routes
 *   don't immediately redirect to /login unless a test clears it.
 */
import '@testing-library/jest-dom';

// Stub window.location.replace to avoid navigation errors in JSDOM when code calls redirects.
if (typeof window !== 'undefined' && window.location) {
  // eslint-disable-next-line no-undef
  const originalLocation = window.location;
  // Keep other properties intact, override only replace with a jest.fn
  Object.defineProperty(window, 'location', {
    configurable: true,
    enumerable: true,
    value: {
      ...originalLocation,
      replace: jest.fn(), // eslint-disable-line no-undef
    },
  });
}

// Provide a default auth token and user so auth-protected views can render in tests by default.
// Individual tests can clear or override localStorage as needed.
try {
  if (!localStorage.getItem('jwt')) {
    localStorage.setItem('jwt', 'test-jwt-token');
  }
  if (!localStorage.getItem('user')) {
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com', name: 'Test User' }));
  }
} catch {
  // ignore if localStorage not available
}
