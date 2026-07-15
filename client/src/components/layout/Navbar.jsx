/**
 * Navbar — top navigation bar matching Stitch design.
 * Sticky, white bg with shadow, restaurant icon, bottom-border active links,
 * Order Now + View Menu buttons in desktop nav.
 */
import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useLiveBusiness } from '../../hooks/useLiveBusiness';
import logo from '../../assets/logo.png';
import Icon from '../ui/Icon';
import SearchBar from '../ui/SearchBar';
import Button from '../ui/Button';
import MobileNav from './MobileNav';
import { useAuth } from '../../context/AuthContext';
import { useOrderList } from '../../context/OrderListContext';

export default function Navbar({ className = '' }) {
  const business = useLiveBusiness();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, openAuthPanel, logout } = useAuth();
  const { totalItems, openDrawer } = useOrderList();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <nav
        className={className}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--color-surface-container-lowest)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="nav-logo-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            <img
              src={logo}
              alt={business.name}
              style={{
                height: '2.5rem',
                width: 'auto',
                display: 'block',
              }}
            />
          </Link>

          {/* Desktop nav */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2rem',
            }}
            className="nav-desktop"
          >
            {business.navLinks.map((link) => {
              const linkActive = location.pathname === link.path;

              return (
                <NavLink
                  key={link.label}
                  to={link.path}
                  style={{
                    paddingBottom: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: linkActive ? 700 : 500,
                    color: linkActive
                      ? 'var(--color-nav-active)'
                      : 'var(--color-nav-inactive)',
                    borderBottom: linkActive ? '2px solid var(--color-secondary)' : '2px solid transparent',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          {/* Desktop buttons + mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Desktop action buttons */}
            <div className="nav-buttons" style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }}>
              {/* User / Login — minimal icon */}
              <div style={{ position: 'relative' }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    border: isAuthenticated ? '1.5px solid var(--color-outline-variant)' : 'none',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    background: 'transparent',
                    color: isAuthenticated
                      ? 'var(--color-primary)'
                      : 'var(--color-on-surface-variant)',
                    transition: 'opacity 0.2s',
                    position: 'relative',
                    opacity: 1,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.65'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  aria-label={isAuthenticated ? 'Account' : 'Login or Sign Up'}
                  onClick={() => {
                    if (isAuthenticated) {
                      setUserMenuOpen(!userMenuOpen);
                    } else {
                      openAuthPanel('login');
                    }
                  }}
                >
                  {isAuthenticated ? (
                    <span style={{ fontSize: '1.125rem', fontWeight: 600, lineHeight: 1 }}>
                      {user?.email?.charAt(0).toUpperCase() || '?'}
                    </span>
                  ) : (
                    <Icon name="person" size={22} fill={0} />
                  )}
                  {/* Admin badge — subtle dot */}
                  {isAuthenticated && user?.isAdmin && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--color-secondary)',
                      }}
                      title="Admin"
                    />
                  )}
                </button>

                {/* User dropdown when authenticated */}
                {isAuthenticated && userMenuOpen && (
                  <>
                    <div
                      style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 49,
                      }}
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '0.5rem',
                        minWidth: '200px',
                        background: 'var(--color-surface-container-lowest)',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        padding: '0.5rem',
                        zIndex: 50,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.625rem 0.75rem',
                          fontSize: '0.8125rem',
                          color: 'var(--color-on-surface-variant)',
                          borderBottom: '1px solid var(--color-outline-variant)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {user?.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt=""
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              display: 'block',
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: 'var(--color-primary-container)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--color-on-primary-container)',
                              flexShrink: 0,
                              fontSize: '0.875rem',
                              fontWeight: 600,
                            }}
                          >
                            {user?.email?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div style={{ fontWeight: 600, color: 'var(--color-on-surface)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user?.email}
                        </div>
                      </div>
<button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: 'var(--color-error)',
                          borderRadius: 'var(--radius-lg)',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-container)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                      >
                        <Icon name="logout" size={18} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
              {/* Search */}
              <SearchBar />
              {/* Cart — with badge count */}
              <button
                onClick={openDrawer}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  background: 'transparent',
                  color: 'var(--color-on-surface-variant)',
                  transition: 'opacity 0.2s',
                  opacity: 1,
                  position: 'relative',
                }}
                aria-label={`Cart (${totalItems} items)`}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.65'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                <Icon name="shopping_cart" size={22} fill={0} weight={400} />
                {totalItems > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-error)',
                      color: 'var(--color-on-error)',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                      lineHeight: 1,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile toggle — animated hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
              }}
              className="nav-mobile-toggle btn-interact"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <svg
                viewBox="0 0 32 32"
                className={`hamburger-icon${mobileOpen ? ' hamburger-open' : ''}`}
              >
                <path className="h-line h-line-tb" d="M28 10 12 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L6 22" />
                <path className="h-line" d="M4 16 28 16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileNav
        open={mobileOpen}
        links={business.navLinks}
        onClose={() => setMobileOpen(false)}
      />

      <style>{`
        /* ─── Animated hamburger icon ─────────────────────── */
        .hamburger-icon {
          height: 1.75em;
          transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hamburger-icon .h-line {
          fill: none;
          stroke: var(--color-primary);
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 3;
          transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
                      stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hamburger-icon .h-line-tb {
          stroke-dasharray: 12 63;
        }

        .hamburger-icon.hamburger-open {
          transform: rotate(-45deg);
        }

        .hamburger-icon.hamburger-open .h-line-tb {
          stroke-dasharray: 20 300;
          stroke-dashoffset: -32.42;
        }

        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile-toggle { display: none !important; }
        }
        @media (min-width: 768px) {
          .nav-buttons { display: flex !important; }
        }
        @media (max-width: 767px) {
          nav {
            box-shadow: none !important;
          }
          .nav-mobile-toggle {
            background: transparent !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
