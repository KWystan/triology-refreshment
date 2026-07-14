/**
 * Dashboard — user's personal dashboard showing account info,
 * past order lists, and quick links.
 *
 * Sections:
 *   1. Welcome — greeting + user info card
 *   2. Recent Orders — past order lists from localStorage
 *   3. Quick Links — shortcuts to menu, venue booking, party packs
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrderList } from '../context/OrderListContext';
import { useLiveBusiness } from '../hooks/useLiveBusiness';
import Icon from '../components/ui/Icon';

export default function Dashboard() {
  const business = useLiveBusiness();
  const { user, isAuthenticated, isLoading, logout, openAuthPanel } = useAuth();
  const { items, totalItems, openMessenger, buildMessengerMessage } = useOrderList();

  if (isLoading) {
    return (
      <main style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ color: 'var(--color-on-surface-variant)' }}>Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <Icon name="lock" size={48} style={{ color: 'var(--color-outline-variant)', marginBottom: '1rem' }} />
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-on-surface)' }}>
            Sign In Required
          </h1>
          <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Please sign in or create an account to view your dashboard.
            Track your orders, save your favorites, and book the venue faster.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => openAuthPanel('login')}
              style={{
                padding: '0.75rem 2rem',
                background: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 600,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthPanel('signup')}
              style={{
                padding: '0.75rem 2rem',
                background: 'transparent',
                color: 'var(--color-primary)',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 600,
                fontSize: '0.875rem',
                border: '1px solid var(--color-primary)',
                cursor: 'pointer',
              }}
            >
              Create Account
            </button>
            <Link
              to="/"
              style={{
                padding: '0.75rem 2rem',
                color: 'var(--color-on-surface-variant)',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 500,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const userInitial = user?.email?.charAt(0).toUpperCase() || '?';
  const quickLinks = [
    { label: 'Browse Menu', path: '/menu', icon: 'restaurant_menu', desc: 'View our full menu and add items to your order list' },
    { label: 'Party Packs', path: '/party-packs', icon: 'celebration', desc: 'Explore catering bundles for your events' },
    { label: 'Book the Venue', path: '/venue', icon: 'meeting_room', desc: 'Check availability and book our event space' },
    { label: 'Contact Us', path: '/events', icon: 'mail', desc: 'Send us a message or inquiry' },
  ];

  return (
    <main>
      {/* ═══════════════════════════════════════════════════════
          SECTION 1: Welcome
          ═══════════════════════════════════════════════════════ */}
      <section className="dash-welcome">
        <div className="container">
          <div className="dash-welcome-card">
            <div className="dash-avatar">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="dash-avatar-img" />
              ) : (
                <span className="dash-avatar-letter">{userInitial}</span>
              )}
            </div>
            <div>
              <h1 className="dash-greeting">
                {user?.user_metadata?.full_name
                  ? `Hey ${user.user_metadata.full_name.split(' ')[0]}!`
                  : 'Welcome!'}
              </h1>
              <p className="dash-email">{user?.email}</p>
              {user?.user_metadata?.full_name && (
                <p className="dash-name">{user.user_metadata.full_name}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: Order List Summary
          ═══════════════════════════════════════════════════════ */}
      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <h2 className="dash-section-title">
          <Icon name="list_alt" size={22} />
          My Order List
        </h2>
        {items.length > 0 ? (
          <div className="dash-order-card">
            <div className="dash-order-header">
              <span className="dash-order-count">
                {totalItems} item{totalItems !== 1 ? 's' : ''} in your list
              </span>
              <span className="dash-order-items-count">{items.length} product{items.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="dash-order-items">
              {items.map((item) => (
                <div key={item.id} className="dash-order-item">
                  <span className="dash-order-item-name">{item.name}</span>
                  <span className="dash-order-item-qty">x{item.quantity}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => openMessenger(business.messengerUrl)}
              className="dash-order-send-btn btn-interact"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.503 3.734 7.202.195.145.313.376.313.626l-.004 2.215c-.004.57.587.973 1.11.75l2.47-1.054a1.001 1.001 0 01.764-.02c.516.16 1.06.245 1.613.245 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm.8 11.6l-1.9-2.02-3.7 2.02 4.07-4.32 1.9 2.02 3.7-2.02-4.07 4.32z" />
              </svg>
              Send Order via Messenger
            </button>
          </div>
        ) : (
          <div className="dash-order-empty">
            <Icon name="shopping_cart" size={32} style={{ color: 'var(--color-outline-variant)' }} />
            <p>No items in your order list yet.</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-outline)', marginBottom: '0.75rem' }}>
              Browse the menu and add items to get started.
            </p>
            <Link to="/menu" className="dash-browse-btn">Browse Menu</Link>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: Quick Links
          ═══════════════════════════════════════════════════════ */}
      <section className="container" style={{ paddingBottom: '5rem' }}>
        <h2 className="dash-section-title">
          <Icon name="explore" size={22} />
          Quick Links
        </h2>
        <div className="dash-links-grid">
          {quickLinks.map((link) => (
            <Link key={link.label} to={link.path} className="dash-link-card">
              <div className="dash-link-icon-wrap">
                <Icon name={link.icon} size={24} />
              </div>
              <div>
                <h3 className="dash-link-label">{link.label}</h3>
                <p className="dash-link-desc">{link.desc}</p>
              </div>
              <Icon name="chevron_right" size={18} style={{ color: 'var(--color-outline-variant)', flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          Sign Out
          ═══════════════════════════════════════════════════════ */}
      <section className="container" style={{ paddingBottom: '4rem', textAlign: 'center' }}>
        <button onClick={logout} className="dash-signout-btn btn-interact">
          <Icon name="logout" size={16} />
          Sign Out
        </button>
      </section>

      <style>{`
        /* ─── Welcome Section ───────────────────────────────── */
        .dash-welcome {
          background: var(--color-primary-container);
          padding: 2.5rem 0;
        }
        .dash-welcome-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .dash-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--color-primary);
          color: var(--color-on-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        .dash-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .dash-avatar-letter {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .dash-greeting {
          font-family: var(--font-headline);
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--color-on-primary-container);
          margin-bottom: 0.25rem;
        }
        .dash-email {
          font-size: 0.875rem;
          color: var(--color-on-primary-container);
          opacity: 0.8;
          margin-bottom: 0.125rem;
        }
        .dash-name {
          font-size: 0.8125rem;
          color: var(--color-on-primary-container);
          opacity: 0.7;
        }

        /* ─── Section Titles ────────────────────────────────── */
        .dash-section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-headline);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-on-surface);
          margin-bottom: 1rem;
        }

        /* ─── Order List Card ───────────────────────────────── */
        .dash-order-card {
          background: var(--color-surface-container-lowest);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: 1.25rem;
        }
        .dash-order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-outline-variant);
        }
        .dash-order-count {
          font-weight: 700;
          font-size: 0.9375rem;
          color: var(--color-on-surface);
        }
        .dash-order-items-count {
          font-size: 0.8125rem;
          color: var(--color-on-surface-variant);
        }
        .dash-order-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .dash-order-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }
        .dash-order-item-name {
          color: var(--color-on-surface);
        }
        .dash-order-item-qty {
          color: var(--color-on-surface-variant);
          font-weight: 600;
        }
        .dash-order-send-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #1877F2;
          color: #fff;
          border: none;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
        }
        .dash-order-send-btn:hover {
          background: #166fe5;
        }
        .dash-order-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem;
          text-align: center;
          color: var(--color-on-surface-variant);
          font-size: 0.875rem;
        }
        .dash-browse-btn {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.625rem 1.5rem;
          background: var(--color-primary);
          color: var(--color-on-primary);
          border-radius: var(--radius-lg);
          font-weight: 600;
          text-decoration: none;
          font-size: 0.8125rem;
        }

        /* ─── Quick Links Grid ──────────────────────────────── */
        .dash-links-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 640px) {
          .dash-links-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .dash-link-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: var(--color-surface-container-lowest);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          text-decoration: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .dash-link-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-sm);
        }
        .dash-link-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          background: var(--color-primary-container);
          color: var(--color-on-primary-container);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dash-link-label {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-on-surface);
          margin-bottom: 0.125rem;
        }
        .dash-link-desc {
          font-size: 0.8125rem;
          color: var(--color-on-surface-variant);
          line-height: 1.4;
        }

        /* ─── Sign Out ──────────────────────────────────────── */
        .dash-signout-btn {
          padding: 0.75rem 2rem;
          border: 1px solid var(--color-error);
          background: transparent;
          color: var(--color-error);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.2s, color 0.2s;
        }
        .dash-signout-btn:hover {
          background: var(--color-error);
          color: var(--color-on-error);
        }
      `}</style>
    </main>
  );
}
