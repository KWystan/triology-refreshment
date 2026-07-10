/**
 * MobileNav — slide-out drawer matching Stitch nav style.
 * Bottom-border active links, restaurant icon in header.
 */
import { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { business } from '../../data/business';
import Icon from '../ui/Icon';
import logo from '../../assets/triology-logo.png';
import { useActiveSection } from '../../context/ActiveSectionContext';

export default function MobileNav({ open, links, onClose, position = 'side' }) {
  const location = useLocation();
  const { activeSection } = useActiveSection();
  const isEventsPage = location.pathname === '/events';
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(0, 0, 0, 0.4)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={
          position === 'center'
            ? {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: open ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.9)',
                width: 'min(380px, calc(100vw - 2rem))',
                maxHeight: '80vh',
                zIndex: 201,
                background: 'var(--color-surface-container-lowest)',
                boxShadow: 'var(--shadow-xl)',
                borderRadius: 'var(--radius-2xl)',
                opacity: open ? 1 : 0,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                pointerEvents: open ? 'auto' : 'none',
              }
            : {
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(320px, 100vw)',
                zIndex: 201,
                background: 'var(--color-surface-container-lowest)',
                boxShadow: 'var(--shadow-xl)',
                transform: open ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }
        }
      >
        {/* Header with icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem',
            borderBottom: '1px solid var(--color-surface-container-high)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/" onClick={onClose}>
              <img
                src={logo}
                alt={business.name}
                style={{ height: '2.25rem', width: 'auto', display: 'block' }}
              />
            </Link>
          </div>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--color-on-surface)',
            }}
            className="btn-interact"
            aria-label="Close menu"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        {/* Nav links — bottom-border active style */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {links.map((link) => {
            const isEventsOrContact = link.label === 'Events' || link.label === 'Contact';
            let linkActive;
            if (isEventsPage && isEventsOrContact) {
              linkActive =
                (link.label === 'Events' && activeSection === 'events') ||
                (link.label === 'Contact' && activeSection === 'contact');
            } else {
              linkActive = location.pathname === link.path;
            }

            return (
              <NavLink
                key={link.label}
                to={link.path}
                onClick={(e) => {
                  if (isEventsPage && isEventsOrContact) {
                    e.preventDefault();
                    const id = link.label === 'Events' ? 'events-room-section' : 'events-contact-section';
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.875rem 1rem',
                  fontSize: '1.0625rem',
                  fontWeight: linkActive ? 700 : 500,
                  color: linkActive
                    ? 'var(--color-nav-active)'
                    : 'var(--color-nav-inactive)',
                  borderBottom: linkActive ? '2px solid var(--color-secondary)' : '2px solid transparent',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
              >
                {link.label}
              </NavLink>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            padding: '1.5rem',
            borderTop: '1px solid var(--color-surface-container-high)',
            fontSize: '0.8125rem',
            color: 'var(--color-on-surface-variant)',
          }}
        >
          <p>{business.phone}</p>
          <p style={{ marginTop: '0.25rem' }}>{business.address.full}</p>
        </div>
      </div>
    </>
  );
}
