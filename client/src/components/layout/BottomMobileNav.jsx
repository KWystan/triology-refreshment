/**
 * BottomMobileNav — mobile-only bottom navigation bar (matches Stitch Menu page).
 * Shows Home, Menu, Orders, Profile tabs with icons.
 * Only visible on screens < md breakpoint.
 */
import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';

const items = [
  { label: 'Home', icon: 'home', path: '/' },
  { label: 'Menu', icon: 'restaurant_menu', path: '/menu' },
  { label: 'Orders', icon: 'shopping_bag', path: '/orders' },
  { label: 'Profile', icon: 'person', path: '/profile' },
];

export default function BottomMobileNav() {
  return (
    <nav
      style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--color-surface-container-lowest)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)',
        padding: '0.75rem 1.5rem',
        zIndex: 50,
        borderTop: '1px solid rgba(191, 201, 193, 0.3)',
      }}
      className="bottom-mobile-nav"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              textDecoration: 'none',
              color: isActive
                ? 'var(--color-secondary)'
                : 'var(--color-on-surface-variant)',
            })}
          >
            <Icon
              name={item.icon}
              size={24}
              fill={1}
              weight={300}
            />
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
              }}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .bottom-mobile-nav {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
