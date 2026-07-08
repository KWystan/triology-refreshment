/**
 * StatDisplay — large numeric stat with label (e.g. "5k+ Orders Served").
 *
 * Props:
 *   value     — stat number/string
 *   label     — description of what the stat represents
 *   icon      — optional Material Symbol icon name
 *   className — additional classes
 */
export default function StatDisplay({ value, label, icon, className = '' }) {
  return (
    <div
      className={className}
      style={{
        textAlign: 'center',
        padding: '1.5rem',
      }}
    >
      {icon && (
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 32,
            color: 'var(--color-primary-container)',
            marginBottom: '0.5rem',
            display: 'block',
          }}
        >
          {icon}
        </span>
      )}
      <div
        style={{
          fontFamily: 'var(--font-headline)',
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          fontWeight: 800,
          lineHeight: 1,
          color: 'var(--color-primary)',
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: '0.375rem',
          fontSize: '0.9375rem',
          fontWeight: 500,
          color: 'var(--color-on-surface-variant)',
        }}
      >
        {label}
      </div>
    </div>
  );
}
