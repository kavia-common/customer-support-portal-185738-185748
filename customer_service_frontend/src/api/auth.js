import { api } from './client';

/**
 * Backend OpenAPI requires:
 * - POST /auth/login with application/x-www-form-urlencoded: { username, password, grant_type?, scope?, client_id?, client_secret? }
 * - POST /auth/register with JSON: { email, full_name?, password, is_agent? }
 */

// PUBLIC_INTERFACE
export async function loginUser(email, password) {
  /** Attempt login; returns token response from backend. */
  // Send as form-encoded to meet OpenAPI for /auth/login
  const formBody = new URLSearchParams();
  formBody.set('username', email);
  formBody.set('password', password);
  // Optionally include grant_type=password if backend enforces; OpenAPI shows it's optional.
  // formBody.set('grant_type', 'password');

  const data = await api.post('/auth/login', formBody, { auth: false, form: true });
  return data;
}

// PUBLIC_INTERFACE
export async function registerUser({ name, email, password, is_agent = false }) {
  /** Register a new user; backend expects { email, full_name?, password, is_agent? } */
  const payload = { email, full_name: name || null, password, is_agent };
  const data = await api.post('/auth/register', payload, { auth: false });
  return data;
}
