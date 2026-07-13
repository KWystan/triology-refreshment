/**
 * Footer — site footer matching Stitch design.
 * primary-container bg, on-primary-container text, restaurant icon + brand,
 * Quick Links (Menu, Party Packs, Order Tracking), Contact, Facebook link.
 */
import { Link } from 'react-router-dom';
import { business } from '../../data/business';
import Icon from '../ui/Icon';

export default function Footer({ className = '' }) {
  const year = business.year || new Date().getFullYear();

  return (
    <footer
      className={className}
      style={{
        background: 'var(--color-primary-container)',
        color: 'var(--color-on-primary-container)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          paddingTop: '3rem',
          paddingBottom: '3rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '24px',
          }}
        >
          {/* Brand column */}
          <div style={{ maxWidth: '320px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <Icon name="restaurant" size={28} color="var(--color-on-primary-container)" />
              <span
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                {business.name}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                opacity: 0.8,
              }}
            >
              Serving the heart of Trapiche, Oton with premium refreshment
              and community warmth since 2021.
            </p>
          </div>

          {/* Links columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '3rem',
              width: 'auto',
            }}
            className="footer-links-grid"
          >
            {/* Quick Links */}
            <div>
              <h4
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  color: '#ffffff',
                }}
              >
                Quick Links
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li>
                  <Link to="/menu" className="btn-interact" style={{ fontSize: '0.8125rem', opacity: 0.8, textDecoration: 'none', color: 'inherit' }}>
                    Menu
                  </Link>
                </li>
                <li>
                  <Link to="/party-packs" className="btn-interact" style={{ fontSize: '0.8125rem', opacity: 0.8, textDecoration: 'none', color: 'inherit' }}>
                    Party Packs
                  </Link>
                </li>
                <li>
                  <span style={{ fontSize: '0.8125rem', opacity: 0.5, cursor: 'not-allowed' }}>Order Tracking</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  color: '#ffffff',
                }}
              >
                Contact
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8125rem',
                    opacity: 0.8,
                  }}
                >
                  <Icon name="phone" size={14} />
                  {business.phone}
                </li>
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8125rem',
                    opacity: 0.8,
                  }}
                >
                  <Icon name="mail" size={14} />
                  {business.email}
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  color: '#ffffff',
                }}
              >
                Follow Us
              </h4>
              <a
                href={business.facebookUrl || business.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interact"
                style={{
                  fontSize: '0.8125rem',
                  opacity: 0.8,
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--color-secondary-container)',
                  color: 'inherit',
                }}
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.8125rem',
            opacity: 0.6,
          }}
        >
          &copy; {year} Triology Refreshment. Trapiche, Oton, Iloilo. All rights reserved.
        </div>
      </div>

      <style>{`
        .footer-links-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 639px) {
          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }
        @media (max-width: 420px) {
          .footer-links-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </footer>
  );
}
