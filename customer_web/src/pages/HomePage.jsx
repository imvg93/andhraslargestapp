import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserBookings } from '../services/firestoreService';

const dishes = [
  { name: 'Gongura Mutton', description: 'Slow-cooked lamb, sorrel leaves & warm spices', label: 'Chef’s pick', tone: 'green' },
  { name: 'Rayalaseema Biryani', description: 'Fragrant basmati, tender chicken & house masala', label: 'Most loved', tone: 'amber' },
  { name: 'Natu Kodi Pulusu', description: 'Country chicken in a peppery Andhra gravy', label: 'Signature', tone: 'terracotta' },
];

function Icon({ name, size = 20 }) {
  const paths = {
    pin: <><path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.3" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" /><path d="M10 21h4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M17 11a4 4 0 0 0 0-8M21 21v-2a4 4 0 0 0-3-3.87" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    receipt: <><path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21V3Z" /><path d="M8 8h8M8 12h8" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.7 2.7 0 1 1 4.8 1.7c-1.3 1.5-2.3 1.7-2.3 3.3M12 17h.01" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function formatBookingDate(date) {
  if (!date) return '';
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function HomePage() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeDish, setActiveDish] = useState(0);
  const firstName = userProfile?.name?.split(' ')[0] || 'Guest';
  const greeting = getGreeting();

  useEffect(() => {
    if (!userProfile?.uid) return;
    getUserBookings(userProfile.uid).then(setBookings).catch(() => setBookings([]));
  }, [userProfile?.uid]);

  const upcomingBooking = useMemo(() => bookings.find((booking) => booking.bookingStatus !== 'cancelled'), [bookings]);
  const dish = dishes[activeDish];

  return (
    <div className="page home-page page-enter">
      <header className="home-hero">
        <div className="home-topbar">
          <button className="home-location" type="button" onClick={() => navigate('/profile')} aria-label="View profile location">
            <span className="home-location-icon"><Icon name="pin" size={16} /></span>
            <span><small>Your favourite table at</small><strong>Rayudu Gari Hotel</strong></span>
          </button>
          <button className="home-notification" type="button" onClick={() => navigate('/bookings')} aria-label="View bookings"><Icon name="bell" size={20} /><i /></button>
        </div>

        <div className="home-greeting">
          <p>Good {greeting}, {firstName}</p>
          <h1>Come hungry.<br /><em>Leave delighted.</em></h1>
          <span className="home-status"><b /> Open today · 11:00 AM – 10:30 PM</span>
        </div>

        <div className="hero-plate" aria-hidden="true">
          <div className="plate-rim" /><div className="plate-food"><span /><span /><span /><span /></div>
        </div>
      </header>

      <main>
        <section className="availability-card" aria-label="Table availability">
          <div className="availability-label"><span>TABLE AVAILABILITY</span><strong>12 tables open</strong></div>
          <div className="availability-details">
            <div><Icon name="calendar" size={18} /><span>Today<br /><strong>{todayLabel()}</strong></span></div>
            <div><Icon name="users" size={18} /><span>For<br /><strong>2 guests</strong></span></div>
          </div>
          <button className="availability-action" type="button" onClick={() => navigate('/book')}>Find a table <Icon name="arrow" size={18} /></button>
        </section>

        {upcomingBooking && (
          <section className="next-booking" onClick={() => navigate('/bookings')} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/bookings')}>
            <span className="next-booking-icon"><Icon name="calendar" size={19} /></span>
            <span><small>YOUR NEXT RESERVATION</small><strong>{formatBookingDate(upcomingBooking.date)} · {upcomingBooking.timeSlot}</strong></span>
            <Icon name="arrow" size={18} />
          </section>
        )}

        <section className="home-section specials-section">
          <div className="section-heading"><div><span>FROM OUR KITCHEN</span><h2>Today’s special</h2></div><button type="button" onClick={() => setActiveDish((activeDish + 1) % dishes.length)}>Next dish <Icon name="arrow" size={15} /></button></div>
          <div className={`special-card special-${dish.tone}`}>
            <div className="special-art" aria-hidden="true"><div className="special-bowl"><i /><i /><i /></div></div>
            <div className="special-copy"><small>{dish.label}</small><h3>{dish.name}</h3><p>{dish.description}</p><button type="button" onClick={() => navigate('/book')}>Reserve to taste it <Icon name="arrow" size={16} /></button></div>
          </div>
          <div className="dish-dots">{dishes.map((item, index) => <button key={item.name} type="button" className={index === activeDish ? 'active' : ''} onClick={() => setActiveDish(index)} aria-label={`Show ${item.name}`} />)}</div>
        </section>

        <section className="home-section">
          <div className="section-heading"><div><span>PLAN YOUR VISIT</span><h2>Make it memorable</h2></div></div>
          <div className="home-actions">
            <button type="button" onClick={() => navigate('/book')}><span className="action-icon gold"><Icon name="calendar" /></span><span><strong>Reserve a table</strong><small>Booking advance ₹100</small></span><Icon name="arrow" size={18} /></button>
            <button type="button" onClick={() => navigate('/bookings')}><span className="action-icon green"><Icon name="receipt" /></span><span><strong>My reservations</strong><small>{bookings.length ? `${bookings.length} booking${bookings.length > 1 ? 's' : ''} in your history` : 'View and manage bookings'}</small></span><Icon name="arrow" size={18} /></button>
            <button type="button" onClick={() => window.location.href = 'tel:+919000000000'}><span className="action-icon cream"><Icon name="help" /></span><span><strong>Need help?</strong><small>Call us for group bookings</small></span><Icon name="arrow" size={18} /></button>
          </div>
        </section>

        <section className="visit-note"><Icon name="clock" size={18} /><p><strong>Dining with us</strong><br />We hold your table for 15 minutes after your reservation time.</p></section>
      </main>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function todayLabel() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
