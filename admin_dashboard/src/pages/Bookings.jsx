import { useEffect, useState, useMemo } from 'react';
import { getAllBookings, updateBookingStatus } from '../services/firestoreService';

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

const STATUS_CFG = {
  pending:   { cls: 'badge-pending',   dot: '#D97706', label: 'Pending'   },
  confirmed: { cls: 'badge-confirmed', dot: '#059669', label: 'Confirmed' },
  cancelled: { cls: 'badge-cancelled', dot: '#DC2626', label: 'Cancelled' },
  completed: { cls: 'badge-completed', dot: '#4F46E5', label: 'Completed' },
};

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getAllBookings()
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return bookings.filter((b) => {
      const matchSearch = !q
        || b.userName?.toLowerCase().includes(q)
        || b.bookingId?.toLowerCase().includes(q)
        || b.mobileNumber?.includes(q);
      const matchStatus  = !filterStatus  || b.bookingStatus === filterStatus;
      const matchPayment = !filterPayment || b.paymentStatus === filterPayment;
      return matchSearch && matchStatus && matchPayment;
    });
  }, [bookings, search, filterStatus, filterPayment]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => b.bookingId === bookingId ? { ...b, bookingStatus: newStatus } : b)
      );
    } catch {
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCsv = () => {
    const headers = ['Booking ID', 'Customer', 'Mobile', 'Persons', 'Date', 'Time Slot', 'Notes', 'Payment', 'Amount', 'Status'];
    const rows = filtered.map((b) => [
      b.bookingId, b.userName, b.mobileNumber, b.numberOfPersons,
      fmtDate(b.date), b.timeSlot, (b.notes || '').replace(/,/g, ';'),
      b.paymentStatus, `₹${b.paymentAmount || 100}`, b.bookingStatus,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => { setSearch(''); setFilterStatus(''); setFilterPayment(''); };
  const hasFilters = search || filterStatus || filterPayment;

  return (
    <div>
      <div className="table-card">
        {/* Header */}
        <div className="table-header">
          <div>
            <span className="table-title">Bookings</span>
            <span className="table-count">
              {filtered.length}{filtered.length !== bookings.length ? ` of ${bookings.length}` : ''} reservations
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--text-4)' }}>🔍</span>
              <input
                className="search-input"
                style={{ paddingLeft: 30 }}
                placeholder="Name, ID, mobile…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>

            <select className="filter-select" value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
              <option value="">All Payments</option>
              <option value="success">Paid</option>
              <option value="failed">Failed</option>
            </select>

            {hasFilters && (
              <button className="btn btn-ghost" onClick={clearFilters}>Clear</button>
            )}

            <button className="btn btn-primary" onClick={exportCsv}>
              ↓ Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 0' }}>
            <div className="spinner spinner-dark" style={{ width: 24, height: 24 }} />
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th style={{ textAlign: 'center' }}>Guests</th>
                  <th>Payment</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9}>
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>No bookings found</h3>
                        <p>{hasFilters ? 'Try adjusting your search or filters' : 'Bookings will appear here'}</p>
                      </div>
                    </td>
                  </tr>
                )}

                {filtered.map((b) => {
                  const sc = STATUS_CFG[b.bookingStatus] || STATUS_CFG.pending;
                  const isUpdating = updatingId === b.bookingId;

                  return (
                    <tr key={b.bookingId} style={{ opacity: isUpdating ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand)', fontSize: 12, letterSpacing: '0.02em' }}>
                          {b.bookingId}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar" style={{ background: 'linear-gradient(135deg,#D97706,#92400E)', fontSize: 11 }}>
                            {b.userName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{b.userName}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-4)' }}>+91 {b.mobileNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>{fmtDate(b.date)}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{b.timeSlot}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{b.numberOfPersons}</td>
                      <td>
                        <span className={`badge ${b.paymentStatus === 'success' ? 'badge-success' : 'badge-failed'}`}>
                          {b.paymentStatus === 'success' ? '✓ Paid' : 'Failed'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--text)' }}>₹{b.paymentAmount || 100}</td>
                      <td>
                        <span className={`badge ${sc.cls}`}>
                          <span className="status-dot" style={{ background: sc.dot }} />
                          {sc.label}
                        </span>
                      </td>
                      <td>
                        {b.bookingStatus === 'pending' && (
                          <div style={{ display: 'flex', gap: 5 }}>
                            <button
                              className="btn btn-success"
                              onClick={() => handleStatusUpdate(b.bookingId, 'confirmed')}
                              disabled={isUpdating}
                            >
                              {isUpdating ? '…' : '✓ Confirm'}
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleStatusUpdate(b.bookingId, 'cancelled')}
                              disabled={isUpdating}
                            >
                              ✕ Cancel
                            </button>
                          </div>
                        )}
                        {b.bookingStatus === 'confirmed' && (
                          <div style={{ display: 'flex', gap: 5 }}>
                            <button
                              className="btn btn-warning"
                              onClick={() => handleStatusUpdate(b.bookingId, 'completed')}
                              disabled={isUpdating}
                            >
                              {isUpdating ? '…' : '★ Complete'}
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleStatusUpdate(b.bookingId, 'cancelled')}
                              disabled={isUpdating}
                            >
                              ✕ Cancel
                            </button>
                          </div>
                        )}
                        {(b.bookingStatus === 'completed' || b.bookingStatus === 'cancelled') && (
                          <span style={{ fontSize: 12, color: 'var(--text-4)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
