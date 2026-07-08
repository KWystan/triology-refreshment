/**
 * MenuFilterTabs — horizontal filter tabs for the menu page.
 *
 * Props:
 *   tabs      — array of { id, label }
 *   active    — currently selected tab id
 *   onChange  — callback(id) when a tab is clicked
 *   className — additional classes
 */
export default function MenuFilterTabs({ tabs, active, onChange, className = '' }) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="btn-interact"
            style={{
              flexShrink: 0,
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
              lineHeight: 1.4,
              border: isActive ? 'none' : '1px solid var(--color-outline-variant)',
              background: isActive ? 'var(--color-primary)' : 'transparent',
              color: isActive ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
