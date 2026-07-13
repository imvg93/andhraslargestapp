import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ADMIN_EMAIL = 'admin@demo.com';
const ADMIN_PASSWORD = 'admin123';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Both fields are required'); return; }
    setLoading(true);
    setTimeout(() => {
      if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        login(email.trim());
        navigate('/dashboard', { replace: true });
      } else {
        setError('Invalid credentials. Check the demo hint above.');
        setLoading(false);
      }
    }, 700);
  };

  const fillDemo = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASSWORD);
    setError('');
  };

  return (
    <div className="login-wrap">
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: -100, right: -100,
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: -60,
        width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div className="login-card" style={{ animation: 'page-in 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 16px',
            boxShadow: '0 4px 16px rgba(217,119,6,0.35)',
          }}>🍛</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22, fontWeight: 700, color: 'var(--text)',
            marginBottom: 4,
          }}>
            Rayudu Gari Hotel
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Admin Dashboard · Sign in to continue</p>
        </div>

        {/* Demo hint */}
        <div style={{
          background: 'var(--amber-bg)',
          border: '1px solid var(--amber-bd)',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
        }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>
              Demo Credentials
            </p>
            <p style={{ fontSize: 12, color: '#92400E', opacity: 0.85 }}>
              {ADMIN_EMAIL} · {ADMIN_PASSWORD}
            </p>
          </div>
          <button
            onClick={fillDemo}
            style={{
              background: '#D97706', color: 'white',
              border: 'none', borderRadius: 6,
              padding: '5px 12px', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Auto-fill
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'var(--red-bg)',
            border: '1px solid var(--red-bd)',
            borderRadius: 8, padding: '10px 14px',
            fontSize: 13, color: '#991B1B', marginBottom: 18,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 16 }}>
            <label className="login-label">Email Address</label>
            <input
              type="email"
              className="login-input"
              placeholder="admin@demo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: 26 }}>
            <label className="login-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 15, color: 'var(--text-3)', padding: 0,
                }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: 46,
              background: loading ? 'var(--gray-300)' : 'var(--brand)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.15s',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(217,119,6,0.35)',
              letterSpacing: '0.01em',
            }}
          >
            {loading ? (
              <><span className="spinner" />Signing in…</>
            ) : (
              'Sign in to Dashboard'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-4)', marginTop: 22 }}>
          Demo app · No real data is stored or transmitted
        </p>
      </div>
    </div>
  );
}
