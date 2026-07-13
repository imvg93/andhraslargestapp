// Demo mode — no Firebase, simple localStorage session
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('rgh_admin_session');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = (email) => {
    const u = { email };
    localStorage.setItem('rgh_admin_session', JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('rgh_admin_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
