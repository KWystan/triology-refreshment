/**
 * App — root layout with Navbar, routes, Footer, and mobile FAB.
 */
import { Routes, Route } from 'react-router-dom';
import { Navbar, Footer, FAB, AuthPanel } from './components';
import { ActiveSectionProvider } from './context/ActiveSectionContext';
import { AuthProvider } from './context/AuthContext';
import { OrderListProvider } from './context/OrderListContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import PartyPacks from './pages/PartyPacks';
import Contact from './pages/Contact';
import Venue from './pages/Venue';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
    <ActiveSectionProvider>
    <OrderListProvider>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Push content above bottom nav on mobile */}
      <main style={{ flex: 1 }} className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/party-packs" element={<PartyPacks />} />
          <Route path="/about" element={<Contact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/venue" element={<Venue />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* Mobile-only Quick Order FAB */}
      <FAB className="mobile-fab" />

      {/* Auth Panel overlay */}
      <AuthPanel />

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
    </OrderListProvider>
    </ActiveSectionProvider>
    </AuthProvider>
  );
}
