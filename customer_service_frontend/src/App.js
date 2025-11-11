import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Simple AuthContext to manage JWT and user state
export const AuthContext = React.createContext({
  token: null,
  user: null,
  login: (_t, _u) => {},
  logout: () => {},
});

// ProtectedRoute component to guard private routes
function ProtectedRoute({ children }) {
  const { token } = React.useContext(AuthContext);
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [token, setToken] = useState(() => localStorage.getItem('jwt') || null);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  });

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist auth changes
  useEffect(() => {
    if (token) localStorage.setItem('jwt', token);
    else localStorage.removeItem('jwt');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const authValue = useMemo(() => ({
    token,
    user,
    // PUBLIC_INTERFACE
    login: (newToken, userInfo) => {
      setToken(newToken);
      setUser(userInfo || null);
    },
    // PUBLIC_INTERFACE
    logout: () => {
      setToken(null);
      setUser(null);
    }
  }), [token, user]);

  return (
    <AuthContext.Provider value={authValue}>
      <div className="App">
        <header className="App-header" style={{ minHeight: 'auto', padding: 0 }}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </header>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
