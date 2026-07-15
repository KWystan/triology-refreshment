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

  // Restore session on mount by checking /auth/me (always returns 200)
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const meRes = await api.get('/auth/me');
        if (!cancelled && meRes?.data?.user) {
          setUser(meRes.data.user);
        } else if (!cancelled && meRes?.data?.user === null) {
          // No valid access token — try refresh
          const refreshRes = await api.post('/auth/refresh');
          if (!cancelled && refreshRes?.data?.message === 'Session refreshed.') {
            const meRes2 = await api.get('/auth/me');
            if (!cancelled && meRes2?.data?.user) {
              setUser(meRes2.data.user);
            }
          }
        }
      } catch {
        // Network error or unexpected — user stays null
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
