import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ToastContainer } from './components/Toast';
import BottomNav from './components/BottomNav';

import SplashPage from './pages/SplashPage';
import RegistrationPage from './pages/RegistrationPage';
import OtpPage from './pages/OtpPage';
import HomePage from './pages/HomePage';
import BookingFormPage from './pages/BookingFormPage';
import PaymentPage from './pages/PaymentPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }) {
  const { userProfile, loading } = useAuth();
  if (loading) return <LoadingFull />;
  if (!userProfile) return <Navigate to="/register" replace />;
  return children;
}

function LoadingFull() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="spinner spinner-dark" style={{ width: 32, height: 32, borderWidth: 3 }} />
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const showBottomNav = ['/home', '/bookings', '/profile'].includes(pathname);

  return (
    <div className="app-shell">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/book" element={<ProtectedRoute><BookingFormPage /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/confirmation" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
