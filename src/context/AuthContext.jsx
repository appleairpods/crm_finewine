import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadJSON, saveJSON } from '../utils/storage';
import { validatePhone, AUTH_CODE } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadJSON('user', null));
  const [authStep, setAuthStep] = useState('phone');
  const [pendingPhone, setPendingPhone] = useState('');
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    saveJSON('user', user);
  }, [user]);

  const openAuth = useCallback(() => {
    setAuthStep('phone');
    setPendingPhone('');
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    setAuthStep('phone');
    setPendingPhone('');
  }, []);

  const backToPhone = useCallback(() => {
    setAuthStep('phone');
  }, []);

  const submitPhone = useCallback((phone) => {
    if (!validatePhone(phone)) return { ok: false, error: 'invalidPhone' };
    setPendingPhone(phone);
    setAuthStep('code');
    return { ok: true };
  }, []);

  const submitCode = useCallback((code) => {
    if (code !== AUTH_CODE) return { ok: false, error: 'invalidCode' };
    const existing = loadJSON('user', null);
    setUser({
      phone: pendingPhone,
      name: existing?.phone === pendingPhone ? existing.name : '',
      points: existing?.phone === pendingPhone ? existing.points || 0 : 0,
      lifetimePoints: existing?.phone === pendingPhone ? existing.lifetimePoints || 0 : 0,
    });
    setAuthOpen(false);
    setAuthStep('phone');
    return { ok: true };
  }, [pendingPhone]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const addPoints = useCallback((amount) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        points: (prev.points || 0) + amount,
        lifetimePoints: (prev.lifetimePoints || 0) + amount,
      };
    });
  }, []);

  const spendPoints = useCallback((amount) => {
    setUser((prev) => {
      if (!prev) return prev;
      const spent = Math.min(amount, prev.points || 0);
      return { ...prev, points: (prev.points || 0) - spent };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authOpen,
        authStep,
        pendingPhone,
        openAuth,
        closeAuth,
        backToPhone,
        submitPhone,
        submitCode,
        logout,
        updateUser,
        addPoints,
        spendPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
