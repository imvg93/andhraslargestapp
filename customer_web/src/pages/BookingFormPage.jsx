import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/Toast';
import { createBooking } from '../services/firestoreService';
import ArrivedConfirmationModal from '../components/ArrivedConfirmationModal';

const toInput = (d) => d.toISOString().split('T')[0];
const fmtDate = (s) => new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

export default function BookingFormPage() {
  const navigate = useNavigate();
  const [persons, setPersons] = useState(2);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);

  const validate = () => {
    const e = {};
    if (!name || !name.trim()) e.name = 'Enter your name';
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); if (errs.mobile) showToast(errs.mobile, 'error'); return; }

    const booking = {
      userName: name.trim(),
      mobileNumber: mobile.trim(),
      numberOfPersons: persons,
      notes: notes.trim(),
      // No date/time for demo
    };

    setPendingBooking(booking);
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    setSubmitting(true);
    try {
      const bookingId = await createBooking(pendingBooking);
      setShowModal(false);
      setSubmitting(false);
      navigate('/confirmation', { state: { bookingId, booking: pendingBooking } });
    } catch (err) {
      showToast('Failed to create booking', 'error');
      setSubmitting(false);
    }
  };

  return (
    <div className="page-bare" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '52px 20px 20px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 22, cursor: 'pointer', marginBottom: 16 }}>←</button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Reserve a Table</h1>
        <p style={{ fontSize: 14, color: 'var(--text-3)' }}>Booking fee ₹100 · Confirmed instantly</p>
      </div>

      <form onSubmit={submit} style={{ padding: '24px 20px' }}>
        {/* Persons */}
        <div className="field">
          <label className="field-label">Guests</label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{persons} {persons === 1 ? 'Person' : 'People'}</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Maximum 20 guests per booking</p>
            </div>
            <div className="stepper">
              <button type="button" className="stepper-btn" onClick={() => setPersons(p => Math.max(1, p - 1))} disabled={persons <= 1}>−</button>
              <span className="stepper-val">{persons}</span>
              <button type="button" className="stepper-btn" onClick={() => setPersons(p => Math.min(20, p + 1))} disabled={persons >= 20}>+</button>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Name */}
        <div className="field">
          <label className="field-label">Name</label>
          <input className={`input ${errors.name ? 'error' : ''}`} placeholder="Your name"
            value={name} onChange={(e) => { setName(e.target.value); setErrors(er => ({ ...er, name: undefined })); }}
          />
          {errors.name && <p className="field-error">⚠ {errors.name}</p>}
        </div>

        <div className="divider" />

        {/* Mobile */}
        <div className="field">
          <label className="field-label">Mobile Number</label>
          <input className={`input ${errors.mobile ? 'error' : ''}`} placeholder="10-digit mobile number"
            value={mobile} onChange={(e) => { setMobile(e.target.value.replace(/[^0-9]/g, '')); setErrors(er => ({ ...er, mobile: undefined })); }}
            maxLength={10}
          />
          {errors.mobile && <p className="field-error">⚠ {errors.mobile}</p>}
        </div>

        <div className="divider" />

        {/* Notes */}
        <div className="field">
          <label className="field-label">Special Requests <span style={{ textTransform: 'none', fontWeight: 400, color: 'var(--text-4)' }}>(optional)</span></label>
          <textarea className="input" rows={3} maxLength={300}
            placeholder="e.g. Window seat, birthday celebration, dietary requirements…"
            value={notes} onChange={(e) => setNotes(e.target.value)}
            style={{ height: 'auto', padding: '14px 16px', resize: 'none' }}
          />
          <p style={{ fontSize: 11, color: 'var(--text-4)', textAlign: 'right', marginTop: 4 }}>{notes.length} / 300</p>
        </div>
        <div style={{
          background: 'var(--ink-50)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          padding: '16px',
          marginBottom: 20,
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Summary</p>
          {[['Guests', `${persons} person${persons > 1 ? 's' : ''}`], ['Name', name || '—'], ['Mobile', mobile ? `+91 ${mobile}` : '—']].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{l}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{v}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" type="submit">
          Confirm Reservation
        </button>
      </form>

      {/* Arrival acknowledgment modal */}
      <ArrivedConfirmationModal
        isOpen={showModal}
        bookingId={pendingBooking?.bookingId || 'Your Booking'}
        onConfirm={handleModalConfirm}
        onCancel={() => {
          setShowModal(false);
          setPendingBooking(null);
        }}
        isLoading={submitting}
      />
    </div>
  );
}
