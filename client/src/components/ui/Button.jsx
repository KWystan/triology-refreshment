/**
 * Button — primary, secondary, and outline variants.
 *
 * Props:
 *   variant  — 'primary' | 'secondary' | 'outline' (default 'primary')
 *   size     — 'sm' | 'md' | 'lg' (default 'md')
 *   icon     — optional Material Symbol icon name
 *   children — label text
 *   onClick  — click handler
 *   as       — render as 'a' instead of 'button' (pass href)
 *   href     — link target when as='a'
 *   className — additional classes
 *   style    — additional inline styles
 *   ...rest  — spread to root element
 */
import { forwardRef } from 'react';

const sizes = {
  sm: { padding: '0.375rem 0.875rem', fontSize: '0.8125rem', gap: '0.375rem' },
  md: { padding: '0.5rem 1.25rem', fontSize: '0.875rem', gap: '0.5rem' },
  lg: { padding: '0.75rem 1.75rem', fontSize: '1rem', gap: '0.5rem' },
};

const variants = {
  primary: {
    background: 'var(--color-btn-primary-bg)',
    color: 'var(--color-btn-primary-text)',
    border: 'none',
  },
  secondary: {
    background: 'var(--color-primary)',
    color: 'var(--color-on-primary)',
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: 'var(--color-btn-outline-text, var(--color-on-primary-container))',
    border: '2px solid var(--color-btn-outline-border, var(--color-on-primary-container))',
  },
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    icon,
    children,
    onClick,
    as: Tag = 'button',
    href,
    className = '',
    style,
    ...rest
  },
  ref,
) {
  const s = sizes[size];
  const v = variants[variant];

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    padding: s.padding,
    fontSize: s.fontSize,
    fontWeight: 600,
    lineHeight: 1.4,
    borderRadius: 'var(--radius-lg)',
    cursor: 'pointer',
    transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1), opacity 160ms cubic-bezier(0.23, 1, 0.32, 1)',
    textDecoration: 'none',
    ...v,
    ...style,
  };

  const combinedClassName = `btn-interact ${className}`.trim();

  if (Tag === 'a') {
    return (
      <a
        ref={ref}
        href={href}
        style={baseStyle}
        className={combinedClassName}
        {...rest}
      >
        {icon && (
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '1.25em', fontVariationSettings: "'FILL' 0, 'wght' 500" }}
          >
            {icon}
          </span>
        )}
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      style={baseStyle}
      className={combinedClassName}
      {...rest}
    >
      {icon && (
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '1.25em', fontVariationSettings: "'FILL' 0, 'wght' 500" }}
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
});

export default Button;
