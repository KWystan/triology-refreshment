/**
 * BentoCard — bundle/party pack card for the bento gallery.
 *
 * Props:
 *   bundle    — bundle object { id, name, description, serves, startingPrice, badge, image, size }
 *   className — additional classes
 */
import Badge from './Badge';
import Button from './Button';

export default function BentoCard({ bundle, className = '' }) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-surface-container-high)',
        transition: 'var(--transition-hover)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}>
        <img
          src={bundle.image}
          alt={bundle.name}
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
          }}
        />
        {bundle.badge && (
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
            <Badge variant="primary">{bundle.badge}</Badge>
          </div>
        )}
        {/* Serving info overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            group
          </span>
          Serves {bundle.serves}
        </div>
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
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--color-on-surface)',
          }}
        >
          {bundle.name}
        </h3>
        <p
          style={{
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            color: 'var(--color-on-surface-variant)',
            flex: 1,
          }}
        >
          {bundle.description}
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
              fontSize: '1.375rem',
              fontWeight: 700,
              color: 'var(--color-primary-container)',
            }}
          >
            ₱{bundle.startingPrice.toLocaleString()}+
          </span>
          <Button variant="primary" size="sm">
            View Bundle
          </Button>
        </div>
      </div>
    </div>
  );
}
