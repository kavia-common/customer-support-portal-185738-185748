//
// Lightweight API client with interceptor-like behavior for fetch
//

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the configured API base URL. */
  return BASE_URL;
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', headers = {}, body, auth = true } = {}) {
  /**
   * Perform an API HTTP request using window.fetch with JSON handling.
   * - Attaches Authorization Bearer token from localStorage when auth = true
   * - Parses JSON response
   * - On 401, redirects to /login
   */
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth) {
    const token = localStorage.getItem('jwt');
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle 401 globally
  if (res.status === 401) {
    // purge token and redirect
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    if (window.location.pathname !== '/login') {
      window.location.replace('/login');
    }
    throw new Error('Unauthorized');
  }

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const msg = (data && data.detail) || (typeof data === 'string' ? data : 'Request failed');
    const error = new Error(msg);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** Shorthand JSON GET */
  get: (path, opts = {}) => apiRequest(path, { ...opts, method: 'GET' }),
  /** Shorthand JSON POST */
  post: (path, body, opts = {}) => apiRequest(path, { ...opts, method: 'POST', body }),
  /** Shorthand JSON PUT */
  put: (path, body, opts = {}) => apiRequest(path, { ...opts, method: 'PUT', body }),
  /** Shorthand JSON DELETE */
  delete: (path, opts = {}) => apiRequest(path, { ...opts, method: 'DELETE' }),
};
