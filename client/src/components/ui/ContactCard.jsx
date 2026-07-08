/**
 * ContactCard — displays contact method with icon.
 *
 * Props:
 *   icon      — Material Symbol icon name
 *   title     — label (e.g. "Phone", "Email")
 *   value     — primary value (e.g. "0947 709 7622")
 *   href      — optional link target (tel:, mailto:)
 *   subtitle  — optional secondary text
 *   className — additional classes
 */
export default function ContactCard({
  icon,
  title,
  value,
  href,
  subtitle,
  className = '',
}) {
  const content = (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        padding: '1.25rem',
        background: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-surface-container-high)',
        transition: 'var(--transition-hover)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: 28,
          color: 'var(--color-secondary)',
          flexShrink: 0,
          marginTop: '0.125rem',
        }}
      >
        {icon}
      </span>
      <div>
        <div
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--color-on-surface-variant)',
            marginBottom: '0.25rem',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: 'var(--color-on-surface)',
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-on-surface-variant)',
              marginTop: '0.25rem',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: 'none', display: 'block' }}>
        {content}
      </a>
    );
  }

  return content;
}
