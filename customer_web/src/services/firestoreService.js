// Demo mode — all bookings stored in localStorage

function randomId(len = 6) {
  return Array.from({ length: len }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');
}

export function createBooking(booking) {
  const bookingId = 'BK-' + randomId(6);
  const bookings = JSON.parse(localStorage.getItem('rgh_bookings') || '[]');
  const entry = { ...booking, bookingId, bookingStatus: 'pending', createdAt: new Date().toISOString() };
  bookings.unshift(entry);
  localStorage.setItem('rgh_bookings', JSON.stringify(bookings));
  return Promise.resolve(bookingId);
}

export function getUserBookings(uid) {
  const bookings = JSON.parse(localStorage.getItem('rgh_bookings') || '[]');
  return Promise.resolve(bookings.filter((b) => b.uid === uid));
}

export function markBookingAsArrived(bookingId) {
  const bookings = JSON.parse(localStorage.getItem('rgh_bookings') || '[]');
  const idx = bookings.findIndex((b) => b.bookingId === bookingId);
  if (idx !== -1) {
    bookings[idx] = { ...bookings[idx], bookingStatus: 'arrived', arrivedAt: new Date().toISOString() };
    localStorage.setItem('rgh_bookings', JSON.stringify(bookings));
  }
  return Promise.resolve();
}
