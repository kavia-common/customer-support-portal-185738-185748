import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { AuthContext } from '../App';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration page */
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const data = await registerUser({ name, email, password });
      // Some backends log in immediately; if token returned, log user in.
      const token = data?.token || data?.access_token;
      const user = data?.user || { name, email };
      if (token) {
        login(token, user);
        navigate('/dashboard', { replace: true });
      } else {
        // Otherwise, navigate to login
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: 20 }}>
        <h2 className="title">Create account</h2>
        <div className="subtitle">Join the support portal</div>
        {error && <div style={{ color: 'var(--color-error)', marginTop: 8 }}>{error}</div>}
        <form onSubmit={submit} style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          <label htmlFor="register-name">
            <div className="subtitle">Name</div>
          </label>
          <input
            id="register-name"
            className="input"
            aria-label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <label htmlFor="register-email">
            <div className="subtitle">Email</div>
          </label>
          <input
            id="register-email"
            className="input"
            type="email"
            aria-label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="register-password">
            <div className="subtitle">Password</div>
          </label>
          <input
            id="register-password"
            className="input"
            type="password"
            aria-label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <div className="subtitle" style={{ marginTop: 10 }}>
          Have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
