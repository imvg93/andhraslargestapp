import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const fmtDate = (s) => {
  if (!s) return '—';
  return new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export default function BookingConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const did = useRef(false);

  useEffect(() => {
    if (!state?.bookingId && !did.current) { did.current = true; navigate('/home', { replace: true }); }
  }, []);

  if (!state?.bookingId) return null;
  const { bookingId, booking: bk } = state;

  return (
    <div className="page-bare" style={{ background: 'var(--bg)' }}>
      {/* Success header */}
      <div style={{
        background: 'linear-gradient(160deg, #064E3B 0%, #059669 100%)',
        padding: '60px 24px 80px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 160, height: 160, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div className="check-circle" style={{
          width: 76, height: 76,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: 36,
        }}>✓</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: 'white', marginBottom: 6 }}>
          Booking Confirmed!
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>Your table has been successfully reserved</p>
      </div>

      {/* Booking ID card — overlaps header */}
      <div style={{ padding: '0 20px', marginTop: -40 }}>
        <div style={{
          background: 'var(--surface)',
          borderRadius: 20,
          padding: '22px 20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)',
          marginBottom: 16,
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Booking Reference
          </p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32, fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '0.04em',
            marginBottom: 6,
          }}>{bookingId}</p>
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Show this at the restaurant</p>
        </div>

        {/* Details */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Reservation Details</p>
          </div>
          <div style={{ padding: '4px 18px 8px' }}>
            {[
              ['Guest', bk?.userName],
              ['Mobile', `+91 ${bk?.mobileNumber}`],
              ['Persons', `${bk?.numberOfPersons} person${bk?.numberOfPersons > 1 ? 's' : ''}`],
              ['Date', fmtDate(bk?.date)],
              ['Time', bk?.timeSlot],
              ['Amount Paid', bk?.amountPaid ? `₹${bk.amountPaid}` : '—'],
              ['Status', <span className="badge badge-pending">Pending confirmation</span>],
            ].map(([l, v]) => (
              <div className="info-row" key={l}>
                <span className="info-label">{l}</span>
                <span className="info-value">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/home', { replace: true })} style={{ marginBottom: 12 }}>
          Back to Home
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/bookings')}>
          View My Bookings
        </button>
        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
