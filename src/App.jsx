import React, { useState } from 'react';
import { useApp } from './context/appContext';
import Homepage from './pages/home';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const { user, loading, login, register, logout } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  async function handleAuth(e) {
    e.preventDefault();
    setError('');
    try {
      if (authMode === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      setShowAuthModal(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Ustawi...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Homepage onLoginClick={() => setShowAuthModal(true)} />
        {showAuthModal && (
          <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setShowAuthModal(false)}>×</button>
              <div className="auth-modal-header">
                <h1>Ustawi</h1>
                <p className="tagline">...your therapist</p>
              </div>
              <h2>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleAuth}>
                {authMode === 'register' && (
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  {authMode === 'login' ? 'Login' : 'Sign Up'}
                </button>
              </form>
              <p className="toggle-auth">
                {authMode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('register'); }}>
                      Sign up
                    </a>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('login'); }}>
                      Login
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  return <Dashboard user={user} onLogout={logout} />;
}

export default App;
