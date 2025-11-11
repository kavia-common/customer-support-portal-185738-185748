import { api } from './client';

// PUBLIC_INTERFACE
export async function loginUser(email, password) {
  /** Attempt login; returns { token, user } if backend supports it. */
  // Adjust endpoint if backend differs; using conventional path
  const data = await api.post('/auth/login', { email, password }, { auth: false });
  return data;
}

// PUBLIC_INTERFACE
export async function registerUser(payload) {
  /** Register a new user; payload includes name/email/password */
  const data = await api.post('/auth/register', payload, { auth: false });
  return data;
}
