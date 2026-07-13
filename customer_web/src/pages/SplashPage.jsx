import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SplashPage() {
  const navigate = useNavigate();
  const { userProfile, loading } = useAuth();
  const didNav = useRef(false);

  useEffect(() => {
    if (loading || didNav.current) return;
    const t = setTimeout(() => {
      didNav.current = true;
      navigate(userProfile ? '/home' : '/register', { replace: true });
    }, 2400);
    return () => clearTimeout(t);
  }, [loading, userProfile]);

  return (
    <div style={{
      minHeight: '100vh', minHeight: '100dvh',
      background: '#0C0A09',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '35%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(217,119,6,0.18) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'glow-pulse 2.5s ease-in-out infinite alternate',
      }} />

      {/* Logo mark */}
      <div style={{
        width: 80, height: 80,
        borderRadius: 22,
        background: 'linear-gradient(135deg, #292524 0%, #1C1917 100%)',
        border: '1px solid rgba(217,119,6,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28,
        animation: 'logo-in 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        boxShadow: '0 0 0 1px rgba(217,119,6,0.15), 0 8px 32px rgba(0,0,0,0.6)',
      }}>
        <span style={{ fontSize: 38, lineHeight: 1 }}>🍛</span>
      </div>

      {/* Brand name */}
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 28, fontWeight: 700,
        color: '#FAFAF9',
        letterSpacing: '-0.01em',
        marginBottom: 8,
        textAlign: 'center',
        animation: 'text-in 0.7s 0.2s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        Rayudu Gari Hotel
      </h1>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 13, fontWeight: 400,
        color: 'rgba(250,250,249,0.45)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        animation: 'text-in 0.7s 0.35s cubic-bezier(0.16,1,0.3,1) both',
        marginBottom: 72,
      }}>
        Authentic Andhra Cuisine
      </p>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 2,
        background: 'rgba(255,255,255,0.06)',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, transparent, #D97706, transparent)',
          animation: 'progress-sweep 2.4s linear forwards',
        }} />
      </div>

      <style>{`
        @keyframes glow-pulse { from { opacity: 0.6; transform: translate(-50%,-50%) scale(0.9); } to { opacity: 1; transform: translate(-50%,-50%) scale(1.1); } }
        @keyframes logo-in { from { opacity: 0; transform: scale(0.75); } to { opacity: 1; transform: scale(1); } }
        @keyframes text-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes progress-sweep { from { width: 0; } to { width: 100%; } }
      `}</style>
    </div>
  );
}
