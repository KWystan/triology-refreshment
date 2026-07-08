/**
 * ActiveSectionContext — shares which page section is currently in-view
 * so navbar links can highlight based on scroll position.
 *
 * Used by EventsContact (IntersectionObserver) → Navbar / MobileNav.
 */
import { createContext, useContext, useState, useCallback } from 'react';

const ActiveSectionContext = createContext(null);

export function ActiveSectionProvider({ children }) {
  // '' means no section override — fall back to route-based :active
  const [activeSection, setActiveSection] = useState('');

  // Reset to empty so route-based :active takes over
  const clearActiveSection = useCallback(() => setActiveSection(''), []);

  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection, clearActiveSection }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection() {
  const ctx = useContext(ActiveSectionContext);
  if (!ctx) throw new Error('useActiveSection must be used within ActiveSectionProvider');
  return ctx;
}
