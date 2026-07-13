import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getAllBookings } from '../services/firestoreService';

/* ── Simple SVG bar chart ── */
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 480, H = 140, PAD = { top: 10, right: 10, bottom: 30, left: 30 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const barW = Math.floor(chartW / data.length) - 6;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Y gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const y = PAD.top + chartH * (1 - f);
        return (
          <g key={f}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#E5E7EB" strokeWidth={1} />
            <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize={9} fill="#9CA3AF">
              {Math.round(max * f)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const barH = (d.value / max) * chartH || 0;
        const x = PAD.left + i * (chartW / data.length) + 3;
        const y = PAD.top + chartH - barH;
        return (
          <g key={i}>
            <rect
              x={x} y={y} width={barW} height={barH}
              rx={3}
              fill={barH === 0 ? '#F3F4F6' : 'url(#barGrad)'}
            />
            <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize={9} fill="#9CA3AF">
              {d.label}
            </text>
          </g>
        );
      })}

      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#D97706" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.65} />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Simple SVG donut chart ── */
function DonutChart({ segments }) {
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  const r = 50, cx = 70, cy = 70, stroke = 16;

  let offset = 0;
  const circumference = 2 * Math.PI * r;

  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const arc = { ...seg, pct, offset: offset * circumference };
    offset += pct;
    return arc;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <svg width={140} height={140} viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={stroke}
            strokeDasharray={`${arc.pct * circumference} ${circumference}`}
            strokeDashoffset={-arc.offset}
            transform="rotate(-90 70 70)"
            strokeLinecap="butt"
          />
        ))}
        {/* Center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={20} fontWeight={700} fill="#111827">
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="#9CA3AF">
          Total
        </text>
      </svg>

      {/* Legend */}
      <div style={{ flex: 1 }}>
        {segments.map((seg) => (
          <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--text-2)', flex: 1 }}>{seg.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function fmtCreated(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_CFG = {
  pending:   { dot: '#D97706', cls: 'badge-pending'   },
  confirmed: { dot: '#059669', cls: 'badge-confirmed' },
  cancelled: { dot: '#DC2626', cls: 'badge-cancelled' },
  completed: { dot: '#4F46E5', cls: 'badge-completed' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, totalRevenue: 0, pendingBookings: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getAllBookings()])
      .then(([s, b]) => {
        setStats({
          ...s,
          pendingBookings: b.filter((x) => x.bookingStatus === 'pending').length,
        });
        setBookings(b);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* Build bar chart data — last 7 days */
  const barData = (() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        label: d.toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 2),
        dateStr: d.toISOString().split('T')[0],
        value: 0,
      };
    });
    bookings.forEach((b) => {
      const day = days.find((d) => d.dateStr === b.date);
      if (day) day.value++;
    });
    return days;
  })();

  /* Donut data */
  const donutData = [
    { label: 'Pending',   value: bookings.filter((b) => b.bookingStatus === 'pending').length,   color: '#D97706' },
    { label: 'Confirmed', value: bookings.filter((b) => b.bookingStatus === 'confirmed').length, color: '#059669' },
    { label: 'Completed', value: bookings.filter((b) => b.bookingStatus === 'completed').length, color: '#4F46E5' },
    { label: 'Cancelled', value: bookings.filter((b) => b.bookingStatus === 'cancelled').length, color: '#DC2626' },
  ].filter((d) => d.value > 0);

  const recent = bookings.slice(0, 6);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <div className="spinner spinner-dark" style={{ width: 28, height: 28 }} />
    </div>
  );

  return (
    <div>
      {/* KPI row */}
      <div className="kpi-grid">
        {[
          {
            icon: '👥', iconBg: '#EFF6FF', label: 'Customers',
            value: stats.totalUsers, sub: 'Registered accounts',
          },
          {
            icon: '📋', iconBg: '#F0FDF4', label: 'Bookings',
            value: stats.totalBookings, sub: 'All time reservations',
          },
          {
            icon: '💰', iconBg: '#FFFBEB', label: 'Revenue',
            value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, sub: 'From booking fees',
          },
          {
            icon: '⏳', iconBg: '#FEF2F2', label: 'Pending',
            value: stats.pendingBookings, sub: 'Awaiting confirmation',
          },
        ].map(({ icon, iconBg, label, value, sub }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-icon" style={{ background: iconBg }}>{icon}</div>
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
            <div className="kpi-sub">{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="charts-grid">
        {/* Bar chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Bookings by Date</div>
              <div className="chart-sub">Reservations per day (last 7 days)</div>
            </div>
          </div>
          <div className="chart-body">
            <BarChart data={barData} />
          </div>
        </div>

        {/* Donut chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Booking Status</div>
              <div className="chart-sub">Distribution overview</div>
            </div>
          </div>
          <div className="chart-body">
            {donutData.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>No bookings yet</p>
            ) : (
              <DonutChart segments={donutData} />
            )}
          </div>
        </div>
      </div>

      {/* Recent bookings table */}
      <div className="table-card">
        <div className="table-header">
          <div>
            <span className="table-title">Recent Bookings</span>
            <span className="table-count">Last {recent.length}</span>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/bookings')}>
            View all →
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Date &amp; Time</th>
                <th>Guests</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-icon">📋</div>
                      <h3>No bookings yet</h3>
                      <p>Reservations will appear here</p>
                    </div>
                  </td>
                </tr>
              )}
              {recent.map((b) => {
                const sc = STATUS_CFG[b.bookingStatus] || STATUS_CFG.pending;
                return (
                  <tr key={b.bookingId} style={{ cursor: 'pointer' }} onClick={() => navigate('/bookings')}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand)', fontSize: 12 }}>
                        {b.bookingId}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ background: 'linear-gradient(135deg,#D97706,#92400E)', fontSize: 12 }}>
                          {b.userName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{b.userName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-4)' }}>+91 {b.mobileNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{fmtDate(b.date)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-4)' }}>{b.timeSlot}</div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{b.numberOfPersons}</td>
                    <td>
                      <span className={`badge ${b.paymentStatus === 'success' ? 'badge-success' : 'badge-failed'}`}>
                        {b.paymentStatus === 'success' ? '✓ Paid' : 'Failed'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${sc.cls}`}>
                        <span className="status-dot" style={{ background: sc.dot }} />
                        {b.bookingStatus?.charAt(0).toUpperCase() + b.bookingStatus?.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
