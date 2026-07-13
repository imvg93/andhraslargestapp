import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { indiaStatesAndCities } from '../constants/indiaData';
import { useAuth } from '../contexts/AuthContext';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  if (userProfile) { navigate('/home', { replace: true }); return null; }

  const [form, setForm] = useState({ name: '', mobile: '', state: '', city: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const cities = form.state ? indiaStatesAndCities[form.state] || [] : [];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'At least 2 characters';
    if (!form.mobile) e.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit Indian number';
    if (!form.state) e.state = 'Please select your state';
    if (!form.city) e.city = 'Please select your city';
    return e;
  };

  const set = (field) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [field]: val, ...(field === 'state' ? { city: '' } : {}) }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      navigate('/otp', { state: { formData: { name: form.name.trim(), mobile: form.mobile, state: form.state, city: form.city } } });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="page-bare" style={{ background: 'var(--bg)' }}>
      {/* Header section */}
      <div style={{ padding: '56px 24px 32px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: '#0C0A09',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, marginBottom: 20,
        }}>🍛</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
          Create account
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.55 }}>
          Tell us a bit about yourself to get started
        </p>
      </div>

      {/* Demo notice */}
      <div className="demo-banner">
        <span>🎭</span>
        <span><strong>Demo mode</strong> — use any number, OTP code is 123456</span>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ padding: '28px 20px' }} className="stagger">
        {/* Name */}
        <div className="field fade-up">
          <label className="field-label">Full Name</label>
          <input className={`input ${errors.name ? 'error' : ''}`} placeholder="e.g. Ravi Kumar"
            value={form.name} onChange={set('name')} autoComplete="name" />
          {errors.name && <p className="field-error"><span>⚠</span>{errors.name}</p>}
        </div>

        {/* Mobile */}
        <div className="field fade-up">
          <label className="field-label">Mobile Number</label>
          <div className={`phone-row ${errors.mobile ? 'error' : ''}`}>
            <span className="phone-prefix">+91</span>
            <input type="tel" inputMode="numeric" maxLength={10} placeholder="9876 543 210"
              value={form.mobile}
              onChange={(e) => set('mobile')({ target: { value: e.target.value.replace(/\D/g, '') } })} />
          </div>
          {errors.mobile && <p className="field-error"><span>⚠</span>{errors.mobile}</p>}
        </div>

        {/* State */}
        <div className="field fade-up">
          <label className="field-label">State</label>
          <select className={`input ${errors.state ? 'error' : ''}`} value={form.state} onChange={set('state')}>
            <option value="">Select your state</option>
            {Object.keys(indiaStatesAndCities).sort().map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="field-error"><span>⚠</span>{errors.state}</p>}
        </div>

        {/* City */}
        <div className="field fade-up">
          <label className="field-label">City</label>
          <select className={`input ${errors.city ? 'error' : ''}`} value={form.city} onChange={set('city')} disabled={!form.state}>
            <option value="">Select your city</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <p className="field-error"><span>⚠</span>{errors.city}</p>}
        </div>

        <div style={{ height: 8 }} />
        <button className="btn btn-primary fade-up" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" />Please wait</> : 'Continue'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-4)', marginTop: 16, lineHeight: 1.6 }}>
          An OTP will be sent to verify your number
        </p>
      </form>
    </div>
  );
}
