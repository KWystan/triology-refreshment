/**
 * ServiceCard — bento grid item for the services section.
 *
 * Props:
 *   icon      — Material Symbol icon name
 *   title     — card title
 *   description — card description
 *   size      — 'sm' | 'md' | 'lg' (bento sizing hints)
 *   className — additional classes
 */
export default function ServiceCard({
  icon,
  title,
  description,
  size = 'sm',
  className = '',
}) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)',
        padding: size === 'lg' ? '2rem' : '1.5rem',
        border: '1px solid var(--color-surface-container-high)',
        transition: 'var(--transition-hover)',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {icon && (
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 32,
            color: 'var(--color-secondary)',
            display: 'block',
            marginBottom: '1rem',
          }}
        >
          {icon}
        </span>
      )}
      <h3
        style={{
          fontFamily: 'var(--font-headline)',
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'var(--color-on-surface)',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          color: 'var(--color-on-surface-variant)',
        }}
      >
        {description}
      </p>
    </div>
  );
}
