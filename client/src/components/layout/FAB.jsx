/**
 * FAB — Floating Action Button, mobile-only (matches Stitch).
 * Shopping basket icon, secondary-container bg, bottom-right fixed.
 * Opens the order list drawer on click.
 *
 * Props:
 *   icon     — Material Symbol icon name (default 'shopping_cart')
 *   style    — additional styles
 *   className — additional classes
 */
import { useOrderList } from '../../context/OrderListContext';

export default function FAB({
  icon = 'shopping_cart',
  style,
  className = '',
}) {
  const { openDrawer, totalItems } = useOrderList();
  return (
    <button
      className={`btn-interact ${className}`.trim()}
      onClick={openDrawer}
      aria-label={`View cart (${totalItems} items)`}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-full)',
        background: '#fbc102',
        color: '#3b3000',
        boxShadow: 'var(--shadow-2xl, 0 25px 50px -12px rgba(0,0,0,0.25))',
        border: 'none',
        cursor: 'pointer',
        ...style,
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 28, fontVariationSettings: "'FILL' 1, 'wght' 400" }}
      >
        {icon}
      </span>
      {totalItems > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            minWidth: 20,
            height: 20,
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-error)',
            color: 'var(--color-on-error)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            lineHeight: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {totalItems}
        </span>
      )}
    </button>
  );
}
