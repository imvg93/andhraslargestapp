import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserBookings } from '../services/firestoreService';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   cls: 'badge-pending',   dot: '#D97706', icon: '⏳' },
  confirmed: { label: 'Confirmed', cls: 'badge-confirmed', dot: '#059669', icon: '✓' },
  cancelled: { label: 'Cancelled', cls: 'badge-cancelled', dot: '#DC2626', icon: '✕' },
  completed: { label: 'Completed', cls: 'badge-completed', dot: '#6366F1', icon: '★' },
};

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtCreated(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function SkeletonCard() {
  return (
    <div className="card" style={{ marginBottom: 14, padding: '18px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div className="skeleton" style={{ width: 100, height: 14, borderRadius: 6, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 70, height: 11, borderRadius: 4 }} />
        </div>
        <div className="skeleton" style={{ width: 72, height: 24, borderRadius: 20 }} />
      </div>
      <div style={{ height: 1, background: 'var(--border)', marginBottom: 14 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="skeleton" style={{ width: 50, height: 10, borderRadius: 4, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: 80, height: 13, borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const load = () => {
    if (!user) return;
    setLoading(true);
    setError('');
    getUserBookings(user.uid)
      .then((data) => { setBookings(data); setLoading(false); })
      .catch(() => { setError('Failed to load bookings'); setLoading(false); });
  };

  useEffect(() => { load(); }, [user]);

  return (
    <div className="page" style={{ animation: 'page-in 0.4s var(--ease) both' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '52px 20px 20px',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
          My Bookings
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Your table reservation history</p>
      </div>

      <div style={{ padding: '20px 16px', paddingBottom: 100 }}>
        {/* Loading skeletons */}
        {loading && [1, 2, 3].map((i) => <SkeletonCard key={i} />)}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Couldn't Load Bookings</p>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>{error}</p>
            <button className="btn btn-outline" style={{ width: 'auto', padding: '10px 24px' }} onClick={load}>Try Again</button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && bookings.length === 0 && (
          <div className="empty" style={{ marginTop: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🍽️</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No Reservations Yet</h3>
            <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 28, lineHeight: 1.6 }}>
              You haven't made any table reservations. Book your first table today.
            </p>
            <button className="btn btn-primary" style={{ width: 'auto', padding: '12px 28px' }} onClick={() => navigate('/book')}>
              Reserve a Table
            </button>
          </div>
        )}

        {/* Booking cards */}
        {!loading && !error && bookings.map((b, idx) => {
          const sc = STATUS_CONFIG[b.bookingStatus] || STATUS_CONFIG.pending;
          const isExpanded = expandedId === b.bookingId;

          return (
            <div
              key={b.bookingId}
              className="card"
              style={{
                marginBottom: 14,
                overflow: 'hidden',
                animation: `fade-up 0.4s var(--ease) ${idx * 0.06}s both`,
                cursor: 'pointer',
              }}
              onClick={() => setExpandedId(isExpanded ? null : b.bookingId)}
            >
              {/* Status bar */}
              <div style={{ height: 3, background: sc.dot, opacity: 0.8 }} />

              {/* Card header */}
              <div style={{ padding: '16px 18px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 17, fontWeight: 700, color: 'var(--text)',
                    letterSpacing: '0.02em', marginBottom: 3,
                  }}>
                    {b.bookingId}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-4)' }}>
                    Booked {fmtCreated(b.createdAt)}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`badge ${sc.cls}`}>{sc.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-4)', transition: 'transform 0.25s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </div>
              </div>

              {/* Summary row — always visible */}
              <div style={{ padding: '0 18px 16px', display: 'flex', gap: 20 }}>
                <div style={{ display: 'flex', align: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>📅</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>{fmtDate(b.date)}</span>
                </div>
                <div style={{ display: 'flex', align: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>⏰</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>{b.timeSlot}</span>
                </div>
                <div style={{ display: 'flex', align: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>👥</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>{b.numberOfPersons}</span>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  <div style={{ padding: '14px 18px 4px' }}>
                    {[
                      ['Guest', b.userName],
                      ['Mobile', `+91 ${b.mobileNumber}`],
                      ['Guests', `${b.numberOfPersons} person${b.numberOfPersons > 1 ? 's' : ''}`],
                      ['Date', fmtDate(b.date)],
                      ['Time', b.timeSlot],
                      ['Amount', '₹100'],
                      ['Payment', b.paymentStatus === 'success' ? 'Paid' : 'Pending'],
                    ].map(([l, v]) => (
                      <div className="info-row" key={l}>
                        <span className="info-label">{l}</span>
                        <span className="info-value">{v}</span>
                      </div>
                    ))}
                    {b.notes && (
                      <div style={{ background: 'var(--ink-50)', borderRadius: 10, padding: '10px 14px', marginTop: 4, marginBottom: 8 }}>
                        <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Note</p>
                        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{b.notes}</p>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '8px 18px 16px' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', textAlign: 'center' }}>
                      Show booking ID <strong>{b.bookingId}</strong> at the restaurant
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Count footer */}
        {!loading && !error && bookings.length > 0 && (
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-4)', padding: '8px 0 4px' }}>
            {bookings.length} reservation{bookings.length !== 1 ? 's' : ''} total
          </p>
        )}
      </div>

    </div>
  );
}
