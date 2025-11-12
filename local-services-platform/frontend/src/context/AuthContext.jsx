import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { me } from '../api/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setInitializing(false); return; }
    (async () => {
      try {
        const profile = await me(token);
        setUser(profile);
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  const value = useMemo(() => ({ user, setUser, initializing, logout }), [user, initializing]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


