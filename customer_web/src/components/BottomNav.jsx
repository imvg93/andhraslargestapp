import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/home',     icon: '⌂',  label: 'Home' },
  { path: '/bookings', icon: '◫',  label: 'Bookings' },
  { path: '/profile',  icon: '◎',  label: 'Profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <nav className="bottom-nav">
      {tabs.map((t) => (
        <button key={t.path} className={`nav-tab ${pathname === t.path ? 'active' : ''}`} onClick={() => navigate(t.path)}>
          <span className="nav-icon">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
