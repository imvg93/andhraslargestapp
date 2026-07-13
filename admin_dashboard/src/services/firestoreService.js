// Demo mode — seeded mock data, no Firebase

const today = new Date();
const fmt = (daysOffset) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};
const fmtTs = (daysOffset) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
};

const DEMO_USERS = [
  { uid: 'u1', name: 'Ravi Kumar',    mobileNumber: '9876543210', state: 'Telangana',       city: 'Hyderabad',    createdAt: fmtTs(-10) },
  { uid: 'u2', name: 'Priya Sharma',  mobileNumber: '8765432109', state: 'Andhra Pradesh',  city: 'Vijayawada',   createdAt: fmtTs(-8) },
  { uid: 'u3', name: 'Arun Reddy',    mobileNumber: '7654321098', state: 'Telangana',       city: 'Warangal',     createdAt: fmtTs(-6) },
  { uid: 'u4', name: 'Sneha Patel',   mobileNumber: '9123456789', state: 'Karnataka',       city: 'Bengaluru',    createdAt: fmtTs(-4) },
  { uid: 'u5', name: 'Vijay Naidu',   mobileNumber: '8901234567', state: 'Tamil Nadu',      city: 'Chennai',      createdAt: fmtTs(-2) },
  { uid: 'u6', name: 'Meena Rao',     mobileNumber: '9988776655', state: 'Maharashtra',     city: 'Pune',         createdAt: fmtTs(-1) },
];

const DEMO_BOOKINGS = [
  { bookingId: 'BK-ARAV01', uid: 'u1', userName: 'Ravi Kumar',   mobileNumber: '9876543210', numberOfPersons: 4, date: fmt(0),  timeSlot: '7:00 PM – 8:00 PM',  notes: 'Window seat please',  paymentStatus: 'success', paymentId: 'demo_pay_001', paymentAmount: 100, bookingStatus: 'confirmed',  createdAt: fmtTs(-1) },
  { bookingId: 'BK-BPRIY2', uid: 'u2', userName: 'Priya Sharma', mobileNumber: '8765432109', numberOfPersons: 2, date: fmt(1),  timeSlot: '1:00 PM – 2:00 PM',  notes: '',                   paymentStatus: 'success', paymentId: 'demo_pay_002', paymentAmount: 100, bookingStatus: 'pending',    createdAt: fmtTs(-2) },
  { bookingId: 'BK-CARUN3', uid: 'u3', userName: 'Arun Reddy',   mobileNumber: '7654321098', numberOfPersons: 6, date: fmt(-1), timeSlot: '8:00 PM – 9:00 PM',  notes: 'Birthday celebration', paymentStatus: 'success', paymentId: 'demo_pay_003', paymentAmount: 100, bookingStatus: 'completed',  createdAt: fmtTs(-3) },
  { bookingId: 'BK-DSNEH4', uid: 'u4', userName: 'Sneha Patel',  mobileNumber: '9123456789', numberOfPersons: 3, date: fmt(5),  timeSlot: '7:00 PM – 8:00 PM',  notes: '',                   paymentStatus: 'success', paymentId: 'demo_pay_004', paymentAmount: 100, bookingStatus: 'pending',    createdAt: fmtTs(-1) },
  { bookingId: 'BK-EVIJA5', uid: 'u5', userName: 'Vijay Naidu',  mobileNumber: '8901234567', numberOfPersons: 8, date: fmt(-7), timeSlot: '12:00 PM – 1:00 PM', notes: 'Veg only please',    paymentStatus: 'success', paymentId: 'demo_pay_005', paymentAmount: 100, bookingStatus: 'cancelled',  createdAt: fmtTs(-8) },
  { bookingId: 'BK-FMEEN6', uid: 'u6', userName: 'Meena Rao',    mobileNumber: '9988776655', numberOfPersons: 5, date: fmt(2),  timeSlot: '8:00 PM – 9:00 PM',  notes: 'Anniversary dinner', paymentStatus: 'success', paymentId: 'demo_pay_006', paymentAmount: 100, bookingStatus: 'confirmed',  createdAt: fmtTs(0) },
];

function getBookings() {
  const stored = JSON.parse(localStorage.getItem('rgh_admin_bookings') || 'null');
  if (!stored) {
    localStorage.setItem('rgh_admin_bookings', JSON.stringify(DEMO_BOOKINGS));
    return DEMO_BOOKINGS;
  }
  return stored;
}

function saveBookings(b) {
  localStorage.setItem('rgh_admin_bookings', JSON.stringify(b));
}

export async function getAllUsers() {
  return DEMO_USERS;
}

export async function getAllBookings() {
  return getBookings();
}

export async function updateBookingStatus(bookingId, bookingStatus) {
  const bookings = getBookings().map((b) =>
    b.bookingId === bookingId ? { ...b, bookingStatus } : b
  );
  saveBookings(bookings);
}

export async function getDashboardStats() {
  const bookings = getBookings().filter((b) => b.paymentStatus === 'success');
  return {
    totalUsers: DEMO_USERS.length,
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((s, b) => s + (b.paymentAmount || 0), 0),
  };
}
