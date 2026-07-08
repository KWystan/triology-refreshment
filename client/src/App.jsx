/**
 * App — root layout with Navbar, routes, Footer, FAB, and bottom mobile nav.
 * FAB + BottomNav: mobile-only — matches Stitch design.
 */
import { Routes, Route } from 'react-router-dom';
import { Navbar, Footer, FAB, BottomMobileNav } from './components';
import { ActiveSectionProvider } from './context/ActiveSectionContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import PartyPacks from './pages/PartyPacks';
import EventsContact from './pages/EventsContact';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ActiveSectionProvider>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Push content above bottom nav on mobile */}
      <main style={{ flex: 1 }} className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/party-packs" element={<PartyPacks />} />
          <Route path="/events" element={<EventsContact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* Mobile-only Quick Order FAB */}
      <FAB className="mobile-fab" />

      {/* Mobile-only bottom nav */}
      <BottomMobileNav />

      <style>{`
        .mobile-fab {
          display: flex;
        }
        @media (min-width: 768px) {
          .mobile-fab {
            display: none !important;
          }
        }
        /* Push content above bottom nav bar on mobile */
        @media (max-width: 767px) {
          .main-content {
            padding-bottom: 4.5rem;
          }
        }
      `}</style>
    </div>
    </ActiveSectionProvider>
  );
}
