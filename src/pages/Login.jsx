import { useState } from 'react';
import { login, setToken } from '../utils/api';

export default function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login({
        email: credentials.email,
        password: credentials.password,
      });

      setToken(response.token);
      onLogin();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--brand-800) 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px 32px',
        boxShadow: 'var(--shadow-xl)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <img
            src="/stmarys.png"
            alt="FixMyCampus logo"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-lg)',
              objectFit: 'cover',
              margin: '0 auto 16px',
              boxShadow: '0 0 0 4px rgba(255,255,255,0.06)'
            }}
          />
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            color: 'var(--brand-800)',
            margin: '0 0 8px',
            fontWeight: 700
          }}>FixMyCampus</h1>
          <p style={{
            color: 'var(--gray-500)',
            fontSize: '14px',
            margin: 0
          }}>Maintenance Portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Email address"
              value={credentials.email}
              onChange={handleChange('email')}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                outline: 'none',
                marginBottom: '12px',
                background: 'var(--surface-alt)',
                color: 'var(--gray-800)',
                boxSizing: 'border-box'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange('password')}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                outline: 'none',
                background: 'var(--surface-alt)',
                color: 'var(--gray-800)',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              color: 'var(--red-600)',
              fontSize: '14px',
              marginBottom: '16px',
              padding: '8px',
              background: 'var(--red-50)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--red-200)'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: 'var(--brand-600)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10
            }}
          >
            <img
              src="/stmarys.png"
              alt="Logo"
              style={{ width: 18, height: 18, display: 'inline-block' }}
            />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'var(--brand-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--brand-200)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: '8px'
          }}>
          <img
            src="/stmarys.png"
            alt="University logo"
            style={{ width: 18, height: 18, objectFit: 'cover' }}
          />
          <div style={{
            fontSize: '12px',
            color: 'var(--brand-700)',
            fontWeight: 600,
          }}>Demo Credentials:</div>
        </div>
        <div style={{
            fontSize: '12px',
            color: 'var(--gray-600)',
            fontFamily: 'monospace'
          }}>
            Email: admin@fixmycampus.com<br/>
            Password: admin123
          </div>
        </div>
      </div>
    </div>
  );
}