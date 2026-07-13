import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/dashboard', icon: '◈', label: 'Dashboard' },
  { path: '/bookings',  icon: '⊟', label: 'Bookings'  },
  { path: '/users',     icon: '◉', label: 'Customers' },
];

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/bookings':  'Bookings',
  '/users':     'Customers',
};

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">🍛</div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">Rayudu Gari</span>
            <span className="sidebar-brand-sub">Admin Panel</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`sidebar-item ${pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div style={{ padding: '4px 12px 12px', display: 'flex', align: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28,
              background: 'linear-gradient(135deg, #D97706, #92400E)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: 'white', fontWeight: 700, flexShrink: 0,
            }}>A</div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin</p>
              <p style={{ fontSize: 10, color: 'var(--sidebar-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@demo.com</p>
            </div>
          </div>
          <button className="sidebar-item" onClick={handleLogout}>
            <span className="sidebar-icon">↩</span>
            <span className="sidebar-label">Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <div>
            <div className="topbar-title">{pageTitles[pathname] || 'Admin'}</div>
          </div>
          <div className="topbar-right">
            <span className="badge badge-demo" style={{ fontSize: 11 }}>Demo Mode</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </header>

        <div className="content-area page-enter">
          {children}
        </div>
      </div>
    </div>
  );
}
