/**
 * FAB — Floating Action Button, mobile-only (matches Stitch).
 * Shopping basket icon, secondary-container bg, bottom-right fixed.
 *
 * Props:
 *   icon     — Material Symbol icon name (default 'shopping_basket')
 *   style    — additional styles
 *   className — additional classes
 */
export default function FAB({
  icon = 'shopping_cart',
  style,
  className = '',
}) {
  return (
    <button
      className={`btn-interact ${className}`.trim()}
      aria-label="Quick order"
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
    </button>
  );
}
