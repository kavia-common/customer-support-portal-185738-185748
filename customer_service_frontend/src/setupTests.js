/**
 * Global Jest setup for CRA tests.
 * - Adds jest-dom matchers
 * - Stubs window.location.replace to avoid jsdom navigation errors during tests
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
