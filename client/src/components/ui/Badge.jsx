/**
 * Badge — small label for tags, popularity markers, etc.
 *
 * Props:
 *   variant   — 'primary' | 'secondary' | 'outline' (default 'primary')
 *   size      — 'sm' | 'md' (default 'sm')
 *   children  — label text
 *   className — additional classes
 */
export default function Badge({
  variant = 'primary',
  size = 'sm',
  children,
  className = '',
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: 'var(--radius-full)',
    whiteSpace: 'nowrap',
    letterSpacing: '0.01em',
    ...(size === 'sm'
      ? { fontSize: '0.75rem', padding: '0.25em 0.75em' }
      : { fontSize: '0.8125rem', padding: '0.35em 1em' }),
    ...(variant === 'primary' && {
      background: 'var(--color-secondary-container)',
      color: 'var(--color-on-secondary-container)',
    }),
    ...(variant === 'secondary' && {
      background: 'var(--color-primary-fixed)',
      color: 'var(--color-on-primary-fixed)',
    }),
    ...(variant === 'outline' && {
      background: 'transparent',
      color: 'var(--color-on-surface-variant)',
      border: '1px solid var(--color-outline-variant)',
    }),
  };

  return <span style={baseStyle} className={className}>{children}</span>;
}
