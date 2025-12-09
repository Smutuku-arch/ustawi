import React, { useState } from 'react';
import { useApp } from '../context/appContext';
import './AuthForm.css';

function AuthForm({ mode, onSuccess, onToggleMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' 
        ? { email, password }
        : { name, email, password };

      console.log('Attempting to authenticate:', { endpoint, body });

      const response = await fetch(`${import.meta.env.VITE_API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log('Auth response:', { ok: response.ok, status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.user, data.token);
      onSuccess();
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-form">
      <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
      <p className="auth-subtitle">
        {mode === 'login' 
          ? 'Sign in to continue your wellness journey' 
          : 'Join Ustawi and start your wellness journey today'}
      </p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            minLength={6}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div className="auth-toggle">
        {mode === 'login' ? (
          <p>
            Don't have an account? {' '}
            <button onClick={onToggleMode} className="link-button">
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account? {' '}
            <button onClick={onToggleMode} className="link-button">
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
