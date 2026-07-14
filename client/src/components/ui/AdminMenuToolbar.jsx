/**
 * AdminMenuToolbar — floating toolbar for menu CRUD, visible to admin only.
 *
 * Props:
 *   onAddCategory   — () => void
 *   onRefresh       — () => void
 *   isLiveData      — boolean (true = fetching from API, false = static data)
 *   itemCount       — number
 *   categoryCount   — number
 */
export default function AdminMenuToolbar({ onAddCategory, onRefresh, isLiveData, disabled, isRefreshing, itemCount, categoryCount }) {
  return (
    <div className="amt-bar">
      <div className="amt-left">
        <span className="amt-badge" data-live={isLiveData} data-disabled={disabled}>
          {isLiveData ? '● Live' : '○ Static'}
        </span>
        <span className="amt-counts">
          {categoryCount} categories · {itemCount} items
        </span>
      </div>
      <div className="amt-right">
        <button className="amt-btn amt-btn-secondary" onClick={onRefresh} disabled={disabled || isRefreshing} title="Refresh from API">
          {isRefreshing ? (
            <span className="material-symbols-outlined amt-icon amt-icon-spin">sync</span>
          ) : (
            <span className="material-symbols-outlined amt-icon">refresh</span>
          )}
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </button>
        <button className="amt-btn amt-btn-primary" onClick={onAddCategory} disabled={disabled}>
          <span className="material-symbols-outlined amt-icon">add_circle</span>
          Add Category
        </button>
      </div>

      <style>{`
        .amt-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: var(--color-surface-container);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .amt-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .amt-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.625rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .amt-badge[data-live="true"] {
          background: var(--color-primary-container);
          color: var(--color-on-primary-container);
        }
        .amt-badge[data-live="false"] {
          background: var(--color-surface-container-high);
          color: var(--color-on-surface-variant);
        }
        .amt-counts {
          font-size: 0.8125rem;
          color: var(--color-on-surface-variant);
          font-weight: 500;
        }
        .amt-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .amt-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          border-radius: var(--radius-lg);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: opacity 0.15s;
          white-space: nowrap;
        }
        .amt-btn:hover { opacity: 0.85; }
        .amt-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .amt-icon { font-size: 18px !important; }
        .amt-icon-spin {
          animation: amt-spin 0.7s linear infinite;
        }
        @keyframes amt-spin {
          to { transform: rotate(360deg); }
        }
        .amt-btn-primary {
          background: var(--color-primary);
          color: var(--color-on-primary);
        }
        .amt-btn-secondary {
          background: var(--color-surface-container-high);
          color: var(--color-on-surface);
          border: 1px solid var(--color-outline-variant);
        }
        @media (max-width: 480px) {
          .amt-bar { flex-direction: column; align-items: stretch; }
          .amt-left { justify-content: center; }
          .amt-right { justify-content: stretch; }
          .amt-btn { flex: 1; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
