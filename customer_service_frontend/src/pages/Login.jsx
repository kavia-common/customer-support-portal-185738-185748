import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { AuthContext } from '../App';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login page with email/password form */
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const data = await loginUser(email, password);
      const token = data?.token || data?.access_token;
      const user = data?.user || { email };
      if (!token) throw new Error('No token received');
      login(token, user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: 20 }}>
        <h2 className="title">Welcome back</h2>
        <div className="subtitle">Sign in to your support portal</div>
        {error && <div style={{ color: 'var(--color-error)', marginTop: 8 }}>{error}</div>}
        <form onSubmit={submit} style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          <label htmlFor="login-email">
            <div className="subtitle">Email</div>
          </label>
          <input
            id="login-email"
            className="input"
            type="email"
            aria-label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label htmlFor="login-password">
            <div className="subtitle">Password</div>
          </label>
          <input
            id="login-password"
            className="input"
            type="password"
            aria-label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="subtitle" style={{ marginTop: 10 }}>
          No account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
