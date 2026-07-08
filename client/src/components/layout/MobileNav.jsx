/**
 * MobileNav — slide-out drawer matching Stitch nav style.
 * Bottom-border active links, restaurant icon in header.
 */
import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { business } from '../../data/business';
import Icon from '../ui/Icon';
import { useActiveSection } from '../../context/ActiveSectionContext';

export default function MobileNav({ open, links, onClose }) {
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
        style={{
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
        }}
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
            <Icon name="restaurant" size={24} color="var(--color-primary)" />
            <span
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
              }}
            >
              {business.name}
            </span>
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
                key={link.path}
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
