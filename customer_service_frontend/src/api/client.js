/**
 * Lightweight API client for anonymous access.
 * Removes Authorization headers and any 401 redirect behavior.
 */
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the configured API base URL. */
  return BASE_URL;
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', headers = {}, body, form = false } = {}) {
  /**
   * Perform an API HTTP request using window.fetch with JSON handling.
   * - No Authorization headers or token storage
   * - Parses JSON response
   * - Supports form-encoded posts via form=true with URLSearchParams body
   */
  const finalHeaders = {
    ...headers,
  };

  let requestBody = undefined;

  if (form) {
    // Expect body as URLSearchParams
    finalHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
    requestBody = body;
  } else if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: requestBody,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const msg = (data && (data.detail?.[0]?.msg || data.detail || data.message)) || (typeof data === 'string' ? data : 'Request failed');
    const error = new Error(msg);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Helper for messages API alignment with backend
// PUBLIC_INTERFACE
export const messagesApi = {
  /** List messages for a ticket using backend path /messages/ticket/{ticket_id} */
  listByTicket: (ticketId) => apiRequest(`/messages/ticket/${ticketId}`, { method: 'GET' }),
  /** Post a message using backend path /messages with JSON body: { content, ticket_id, author_id } */
  post: (payload) => apiRequest('/messages', { method: 'POST', body: payload }),
};

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
