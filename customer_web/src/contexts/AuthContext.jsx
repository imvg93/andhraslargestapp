import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserProfile(getCurrentUser());
    setLoading(false);
  }, []);

  const refreshProfile = () => setUserProfile(getCurrentUser());

  return (
    <AuthContext.Provider value={{ user: userProfile, userProfile, setUserProfile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
