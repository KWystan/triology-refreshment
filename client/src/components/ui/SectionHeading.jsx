/**
 * SectionHeading — consistent section title + optional subtitle and adornment.
 *
 * Props:
 *   title     — heading text
 *   subtitle  — optional subheading text
 *   align     — 'left' | 'center' (default 'center')
 *   tagline   — optional small tag above title
 *   className — additional classes
 */
export default function SectionHeading({
  title,
  subtitle,
  align = 'center',
  tagline,
  className = '',
}) {
  return (
    <div
      className={className}
      style={{
        maxWidth: '640px',
        marginInline: align === 'center' ? 'auto' : '0',
        textAlign: align,
        marginBottom: '3rem',
      }}
    >
      {tagline && (
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.8125rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-secondary)',
            marginBottom: '0.75rem',
          }}
        >
          {tagline}
        </span>
      )}
      <h2
        style={{
          fontFamily: 'var(--font-headline)',
          fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
          fontWeight: 700,
          lineHeight: 1.2,
          color: 'var(--color-on-surface)',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            marginTop: '0.75rem',
            fontSize: '1.0625rem',
            lineHeight: 1.6,
            color: 'var(--color-on-surface-variant)',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
