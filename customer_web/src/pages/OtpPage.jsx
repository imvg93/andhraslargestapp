import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createUserProfile } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/Toast';

const N = 6;

export default function OtpPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setUserProfile } = useAuth();

  const [digits, setDigits] = useState(Array(N).fill(''));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const refs = useRef([]);

  useEffect(() => {
    if (!state?.formData) { navigate('/register', { replace: true }); return; }
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const verify = (code) => {
    if (code.length < N || loading) return;
    setLoading(true);
    setTimeout(() => {
      const { formData } = state;
      const profile = createUserProfile({ name: formData.name, mobileNumber: formData.mobile, state: formData.state, city: formData.city });
      setUserProfile(profile);
      showToast('Welcome to Rayudu Gari Hotel 🎉', 'success');
      navigate('/home', { replace: true });
    }, 900);
  };

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < N - 1) refs.current[i + 1]?.focus();
    if (next.filter(Boolean).length === N) verify(next.join(''));
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, N);
    if (p.length === N) { setDigits(p.split('')); verify(p); }
  };

  const mobile = state?.formData?.mobile;

  return (
    <div className="page-bare" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ padding: '48px 24px 28px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 22, cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 4 }}>←</button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, marginBottom: 6 }}>
          Verify your number
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.55 }}>
          Enter the 6-digit code sent to +91 {mobile}
        </p>
      </div>

      <div style={{ padding: '40px 24px' }}>
        {/* Demo hint */}
        <div style={{
          background: 'var(--success-bg)',
          border: '1px solid rgba(5,150,105,0.2)',
          borderRadius: 'var(--r-lg)',
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 36,
        }}>
          <span style={{ fontSize: 18 }}>🎭</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>Demo Mode</p>
            <p style={{ fontSize: 12, color: 'var(--success)', opacity: 0.8 }}>Enter any 6 digits — try <strong>1 2 3 4 5 6</strong></p>
          </div>
        </div>

        {/* OTP boxes */}
        <div className="otp-row" onPaste={handlePaste} style={{ marginBottom: 40 }}>
          {digits.map((d, i) => (
            <input key={i} ref={(el) => (refs.current[i] = el)}
              className={`otp-cell ${d ? 'filled' : ''}`}
              type="tel" inputMode="numeric" maxLength={1}
              value={d}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              disabled={loading}
            />
          ))}
        </div>

        <button className="btn btn-primary" onClick={() => verify(digits.join(''))}
          disabled={loading || digits.filter(Boolean).length < N}>
          {loading
            ? <><span className="spinner" />Verifying</>
            : 'Verify & Continue'}
        </button>

        {/* Resend */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          {timer > 0 ? (
            <p style={{ fontSize: 14, color: 'var(--text-3)' }}>
              Resend code in <span style={{ fontWeight: 600, color: 'var(--text)' }}>{timer}s</span>
            </p>
          ) : (
            <button onClick={() => { setTimer(30); setDigits(Array(N).fill('')); refs.current[0]?.focus(); showToast('Code resent (Demo: any 6 digits)', 'info'); }}
              style={{ background: 'none', border: 'none', color: 'var(--text)', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Resend code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
