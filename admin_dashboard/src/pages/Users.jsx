import { useEffect, useState, useMemo } from 'react';
import { getAllUsers } from '../services/firestoreService';

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const AVATAR_PALETTE = [
  ['#D97706', '#92400E'],
  ['#059669', '#065F46'],
  ['#4F46E5', '#3730A3'],
  ['#DC2626', '#991B1B'],
  ['#7C3AED', '#5B21B6'],
  ['#0891B2', '#0E7490'],
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const states = useMemo(() => [...new Set(users.map((u) => u.state).filter(Boolean))].sort(), [users]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q
        || u.name?.toLowerCase().includes(q)
        || u.mobileNumber?.includes(q)
        || u.city?.toLowerCase().includes(q);
      const matchState = !filterState || u.state === filterState;
      return matchSearch && matchState;
    });
  }, [users, search, filterState]);

  const hasFilters = search || filterState;
  const clearFilters = () => { setSearch(''); setFilterState(''); };

  return (
    <div>
      <div className="table-card">
        {/* Header */}
        <div className="table-header">
          <div>
            <span className="table-title">Customers</span>
            <span className="table-count">
              {filtered.length}{filtered.length !== users.length ? ` of ${users.length}` : ''} users
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--text-4)' }}>🔍</span>
              <input
                className="search-input"
                style={{ paddingLeft: 30 }}
                placeholder="Name, mobile, city…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select className="filter-select" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
              <option value="">All States</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {hasFilters && (
              <button className="btn btn-ghost" onClick={clearFilters}>Clear</button>
            )}
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
                  <th>#</th>
                  <th>Customer</th>
                  <th>Mobile</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <div className="empty-icon">👥</div>
                        <h3>No customers found</h3>
                        <p>{hasFilters ? 'Try adjusting your search or filter' : 'Customers will appear here after registration'}</p>
                      </div>
                    </td>
                  </tr>
                )}

                {filtered.map((u, i) => {
                  const [from, to] = AVATAR_PALETTE[i % AVATAR_PALETTE.length];
                  return (
                    <tr key={u.uid || i}>
                      <td style={{ color: 'var(--text-4)', fontSize: 12, fontWeight: 500 }}>
                        {i + 1}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                          <div
                            className="avatar"
                            style={{ background: `linear-gradient(135deg, ${from}, ${to})`, fontSize: 13 }}
                          >
                            {u.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                              {u.name || '—'}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 1 }}>
                              UID: {u.uid?.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-2)', fontWeight: 500 }}>
                        +91 {u.mobileNumber}
                      </td>
                      <td>
                        {u.state ? (
                          <span style={{
                            background: 'var(--gray-100)', color: 'var(--text-2)',
                            borderRadius: 20, padding: '3px 10px',
                            fontSize: 12, fontWeight: 500,
                          }}>
                            {u.state}
                          </span>
                        ) : <span style={{ color: 'var(--text-4)' }}>—</span>}
                      </td>
                      <td style={{ color: 'var(--text-2)' }}>
                        {u.city || '—'}
                      </td>
                      <td style={{ color: 'var(--text-3)', fontSize: 12 }}>
                        {fmtDate(u.createdAt)}
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
