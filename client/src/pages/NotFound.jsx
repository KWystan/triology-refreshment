/**
 * NotFound — 404 fallback page.
 *
 * Shows a friendly message with quick links to popular pages.
 */
import { Link } from 'react-router-dom';
import { Button } from '../components';
import Icon from '../components/ui/Icon';

export default function NotFound() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blur */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20rem',
          height: '20rem',
          background: 'var(--color-secondary)',
          opacity: 0.04,
          borderRadius: 'var(--radius-full)',
          filter: 'blur(64px)',
          pointerEvents: 'none',
        }}
      />

      <span
        style={{
          fontFamily: "'Okinawa', cursive",
          fontSize: 'clamp(5rem, 12vw, 8rem)',
          lineHeight: 1,
          color: 'var(--color-primary)',
          opacity: 0.15,
          position: 'absolute',
          top: '5%',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        404
      </span>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Icon
          name="search_off"
          size={56}
          style={{ color: 'var(--color-outline-variant)', marginBottom: '1.5rem' }}
        />

        <h1
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--color-on-surface)',
            marginBottom: '0.75rem',
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--color-on-surface-variant)',
            marginBottom: '2rem',
            maxWidth: '420px',
            lineHeight: 1.6,
          }}
        >
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
          Let&rsquo;s get you back on track.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
            marginBottom: '2.5rem',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            <Icon name="home" size={18} />
            Back to Home
          </Link>
          <Link
            to="/menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: 'var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
              border: '1px solid var(--color-outline-variant)',
            }}
          >
            <Icon name="restaurant_menu" size={18} />
            Browse Menu
          </Link>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.25rem',
            justifyContent: 'center',
            fontSize: '0.8125rem',
          }}
        >
          <Link to="/venue" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'underline' }}>
            Book the Venue
          </Link>
          <Link to="/party-packs" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'underline' }}>
            Party Packs
          </Link>
          <Link to="/events" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'underline' }}>
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
