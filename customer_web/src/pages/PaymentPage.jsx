import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createBooking } from '../services/firestoreService';
import { showToast } from '../components/Toast';

const fmtDate = (s) => new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const b = state?.bookingData;

  if (!b) { navigate('/book', { replace: true }); return null; }

  const pay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    try {
      const booking = {
        uid: userProfile.uid, userName: userProfile.name, mobileNumber: userProfile.mobileNumber,
        numberOfPersons: b.numberOfPersons, date: b.date, timeSlot: b.timeSlot,
        notes: b.notes || '', paymentStatus: 'success',
        paymentId: 'demo_' + Date.now(), paymentAmount: 100,
      };
      const id = await createBooking(booking);
      showToast('Payment successful', 'success');
      navigate('/confirmation', { state: { bookingId: id, booking: { ...booking, bookingId: id } }, replace: true });
    } catch { showToast('Something went wrong', 'error'); setLoading(false); }
  };

  return (
    <div className="page-bare" style={{ background: 'var(--bg)' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '52px 20px 20px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 22, cursor: 'pointer', marginBottom: 16 }}>←</button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Payment</h1>
        <p style={{ fontSize: 14, color: 'var(--text-3)' }}>Review your reservation details</p>
      </div>

      <div style={{ padding: '20px 20px' }}>
        {/* Booking summary card */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>Reservation Details</p>
          </div>
          <div style={{ padding: '16px 18px' }}>
            {[
              ['Guest', userProfile?.name],
              ['Mobile', `+91 ${userProfile?.mobileNumber}`],
              ['Persons', `${b.numberOfPersons} person${b.numberOfPersons > 1 ? 's' : ''}`],
              ['Date', fmtDate(b.date)],
              ['Time', b.timeSlot],
              ...(b.notes ? [['Note', b.notes]] : []),
            ].map(([l, v]) => (
              <div className="info-row" key={l}>
                <span className="info-label">{l}</span>
                <span className="info-value">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ padding: '16px 18px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>Payment Summary</p>
            <div className="info-row"><span className="info-label">Booking Fee</span><span className="info-value">₹100.00</span></div>
            <div className="info-row"><span className="info-label">Tax & Charges</span><span className="info-value" style={{ color: 'var(--success)' }}>₹0 (incl.)</span></div>
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0 14px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Playfair Display', serif" }}>Total Due</span>
              <span style={{ fontWeight: 700, fontSize: 26, fontFamily: "'Playfair Display', serif" }}>₹100</span>
            </div>
          </div>
        </div>

        {/* Demo notice */}
        <div className="demo-banner" style={{ marginLeft: 0, marginRight: 0, marginBottom: 20 }}>
          <span>🎭</span>
          <span style={{ fontSize: 12 }}><strong>Demo Mode</strong> — Click below to simulate a payment. No real charge.</span>
        </div>

        {/* Pay button — Razorpay style */}
        <button onClick={pay} disabled={loading} style={{
          width: '100%', height: 54,
          background: loading ? 'var(--ink-200)' : '#2D6AF5',
          color: 'white', border: 'none', borderRadius: 14,
          fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'opacity 0.15s',
          letterSpacing: '0.01em',
          boxShadow: loading ? 'none' : '0 4px 16px rgba(45,106,245,0.35)',
        }}>
          {loading ? (
            <><div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.65s linear infinite' }} />Processing</>
          ) : (
            <><span style={{ fontSize: 18 }}>🔒</span> Pay ₹100 with Razorpay</>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 }}>
          <span style={{ fontSize: 18, opacity: 0.4 }}>🔐</span>
          <span style={{ fontSize: 11, color: 'var(--text-4)' }}>256-bit SSL encrypted · Powered by Razorpay</span>
        </div>
      </div>
    </div>
  );
}
