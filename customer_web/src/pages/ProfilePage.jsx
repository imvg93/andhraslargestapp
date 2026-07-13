import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile, logout } from '../services/authService';
import { indiaStatesAndCities } from '../constants/indiaData';
import { showToast } from '../components/Toast';

function Icon({ name, size = 20 }) {
  const paths = {
    edit: <><path d="m14 5 5 5M4 20l4.2-.9L19 8.3A3 3 0 0 0 14.7 4L3.9 14.8 3 19.9 4 20Z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    pin: <><path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.3" /></>,
    phone: <><path d="M21 16.4v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.6 5.2 2 2 0 0 1 4.6 3h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8l-1.3 1.3a16 16 0 0 0 5 5l1.3-1.3a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2Z" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.7 2.7 0 1 1 4.8 1.7c-1.3 1.5-2.3 1.7-2.3 3.3M12 17h.01" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M21 19V5a2 2 0 0 0-2-2h-6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function ProfilePage() {
  const { userProfile, setUserProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: userProfile?.name || '', state: userProfile?.state || '', city: userProfile?.city || '' });
  const [errors, setErrors] = useState({});
  const cities = form.state ? indiaStatesAndCities[form.state] || [] : [];
  const initial = userProfile?.name?.charAt(0)?.toUpperCase() || '?';
  const memberSince = userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Today';

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.state) nextErrors.state = 'Select a state';
    if (!form.city) nextErrors.city = 'Select a city';
    return nextErrors;
  };

  const save = () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    setLoading(true);
    setTimeout(() => {
      const updated = updateUserProfile({ name: form.name.trim(), state: form.state, city: form.city });
      setUserProfile(updated);
      setEditing(false);
      setLoading(false);
      showToast('Profile updated', 'success');
    }, 450);
  };

  const startEdit = () => { setForm({ name: userProfile?.name || '', state: userProfile?.state || '', city: userProfile?.city || '' }); setErrors({}); setEditing(true); };
  const set = (field) => (event) => { const value = event.target.value; setForm((current) => ({ ...current, [field]: value, ...(field === 'state' ? { city: '' } : {}) })); setErrors((current) => ({ ...current, [field]: undefined })); };
  const handleLogout = () => { logout(); setUserProfile(null); navigate('/register', { replace: true }); };

  return (
    <div className="page profile-page page-enter">
      <header className="profile-hero">
        <p className="profile-eyebrow">YOUR RAYUDU GARI ACCOUNT</p>
        <div className="profile-hero-row">
          <div className="profile-avatar"><span>{initial}</span><i /></div>
          <div><h1>{userProfile?.name || 'Guest'}</h1><p>Member since {memberSince}</p></div>
          <button className="profile-edit-button" type="button" onClick={startEdit} aria-label="Edit profile"><Icon name="edit" size={17} /></button>
        </div>
        <div className="profile-verified"><span>✓</span> Mobile number verified</div>
      </header>

      <main className="profile-content">
        <section className="profile-reservation-card">
          <div className="reservation-art"><Icon name="calendar" size={24} /></div>
          <div><span>DINING, MADE PERSONAL</span><h2>Plan your next visit</h2><p>Reserve a table and we’ll have it ready for you.</p></div>
          <button type="button" onClick={() => navigate('/book')}>Reserve <Icon name="chevron" size={16} /></button>
        </section>

        <section className="profile-panel">
          <div className="profile-panel-heading"><div><span>ACCOUNT DETAILS</span><h2>Personal information</h2></div>{!editing && <button type="button" onClick={startEdit}>Edit details</button>}</div>
          {!editing ? (
            <div className="profile-details">
              <ProfileDetail icon="phone" label="Mobile number" value={`+91 ${userProfile?.mobileNumber || '—'}`} />
              <ProfileDetail icon="pin" label="Your location" value={[userProfile?.city, userProfile?.state].filter(Boolean).join(', ') || '—'} />
            </div>
          ) : (
            <div className="profile-form">
              <div className="field"><label className="field-label">Full name</label><input className={`input ${errors.name ? 'error' : ''}`} value={form.name} onChange={set('name')} placeholder="Your full name" />{errors.name && <p className="field-error">{errors.name}</p>}</div>
              <div className="field"><label className="field-label">State</label><select className={`input ${errors.state ? 'error' : ''}`} value={form.state} onChange={set('state')}><option value="">Select state</option>{Object.keys(indiaStatesAndCities).sort().map((state) => <option key={state} value={state}>{state}</option>)}</select>{errors.state && <p className="field-error">{errors.state}</p>}</div>
              <div className="field"><label className="field-label">City</label><select className={`input ${errors.city ? 'error' : ''}`} value={form.city} onChange={set('city')} disabled={!form.state}><option value="">Select city</option>{cities.map((city) => <option key={city} value={city}>{city}</option>)}</select>{errors.city && <p className="field-error">{errors.city}</p>}</div>
              <div className="profile-form-actions"><button className="btn btn-outline" type="button" onClick={() => setEditing(false)}>Cancel</button><button className="btn btn-primary" type="button" onClick={save} disabled={loading}>{loading ? <span className="spinner" /> : 'Save changes'}</button></div>
            </div>
          )}
        </section>

        <section className="profile-panel profile-links">
          <div className="profile-panel-heading"><div><span>MORE FOR YOU</span><h2>Preferences & support</h2></div></div>
          <ProfileLink icon="calendar" title="My reservations" sub="View upcoming and previous tables" onClick={() => navigate('/bookings')} />
          <ProfileLink icon="help" title="Help & support" sub="We’re here for your dining plans" onClick={() => window.location.href = 'tel:+919000000000'} />
        </section>

        <button className="profile-signout" type="button" onClick={handleLogout}><Icon name="logout" size={19} /> Sign out</button>
        <p className="profile-footer">Rayudu Gari Hotel · Andhra & Rayalaseema cuisine</p>
      </main>
    </div>
  );
}

function ProfileDetail({ icon, label, value }) {
  return <div className="profile-detail"><span className="profile-detail-icon"><Icon name={icon} size={19} /></span><span><small>{label}</small><strong>{value}</strong></span></div>;
}

function ProfileLink({ icon, title, sub, onClick }) {
  return <button className="profile-link" type="button" onClick={onClick}><span className="profile-link-icon"><Icon name={icon} size={19} /></span><span><strong>{title}</strong><small>{sub}</small></span><Icon name="chevron" size={18} /></button>;
}
