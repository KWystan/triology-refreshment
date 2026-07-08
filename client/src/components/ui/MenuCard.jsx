/**
 * MenuCard — individual menu item card.
 *
 * Props:
 *   item          — menu item object { id, name, description, price, priceLabel, image, badge, action, actionVariant }
 *   className     — additional classes
 */
import Badge from './Badge';
import Button from './Button';

export default function MenuCard({ item, className = '' }) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--color-surface-container-high)',
        transition: 'var(--transition-hover)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden' }}>
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
        />
        {item.badge && (
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
            <Badge variant="primary">{item.badge}</Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: '1.25rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--color-on-surface)',
          }}
        >
          {item.name}
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            lineHeight: 1.6,
            color: 'var(--color-on-surface-variant)',
            flex: 1,
          }}
        >
          {item.description}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--color-surface-container-highest)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-primary-container)',
            }}
          >
            {item.priceLabel || `₱${item.price}`}
          </span>
          <Button variant={item.actionVariant || 'primary'} size="sm">
            {item.action || 'Order Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}
