/**
 * AuthContext — manages auth panel visibility, current view (login/signup),
 * and authenticated user state.
 *
 * Panel state (isOpen / currentView) is ready immediately.
 * Auth state (user / isAuthenticated) is populated when the backend is wired.
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'signup'
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount by checking /auth/me
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      console.log('[Auth] restoreSession: checking /auth/me');
      try {
        // Try restoring from access token first
        const meRes = await api.get('/auth/me');
        console.log('[Auth] /auth/me succeeded:', meRes?.data?.user?.email);
        if (!cancelled && meRes?.data?.user) {
          setUser(meRes.data.user);
        }
      } catch (err) {
        console.log('[Auth] /auth/me failed:', err.message);
        // Access token expired or missing — try refresh
        try {
          console.log('[Auth] trying /auth/refresh');
          const refreshRes = await api.post('/auth/refresh');
          console.log('[Auth] /auth/refresh result:', refreshRes?.data?.message);
          if (!cancelled && refreshRes?.data?.message === 'Session refreshed.') {
            const meRes = await api.get('/auth/me');
            console.log('[Auth] /auth/me after refresh:', meRes?.data?.user?.email);
            if (!cancelled && meRes?.data?.user) {
              setUser(meRes.data.user);
            }
          } else {
            console.log('[Auth] refresh did not return expected message');
          }
        } catch (refreshErr) {
          console.log('[Auth] /auth/refresh also failed:', refreshErr.message);
          // No valid session — user stays null
        }
      }
      if (!cancelled) setIsLoading(false);
    }

    restoreSession();
    return () => { cancelled = true; };
  }, []);

  const openAuthPanel = useCallback((view = 'login') => {
    setCurrentView(view);
    setIsOpen(true);
  }, []);

  const closeAuthPanel = useCallback(() => {
    setIsOpen(false);
    // Reset to login view next time it opens
    setCurrentView('login');
  }, []);

  const switchView = useCallback((view) => {
    setCurrentView(view);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Still clear local state even if the API call fails
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isOpen,
        currentView,
        user,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        isLoading,
        openAuthPanel,
        closeAuthPanel,
        switchView,
        logout,
        setUser,
        setIsLoading,
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
