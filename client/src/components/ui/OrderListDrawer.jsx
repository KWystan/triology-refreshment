/**
 * OrderListDrawer — floating trigger button + slide-out drawer showing the
 * user's selected menu items. Allows quantity adjustment, item removal, and
 * sending the list via Messenger.
 *
 * Props:
 *   messengerUrl — Facebook Messenger URL (default: business.messengerUrl)
 */
import { useState, useRef, useEffect } from 'react';
import { useOrderList } from '../../context/OrderListContext';
import Icon from './Icon';

export default function OrderListDrawer({ messengerUrl = 'https://m.me/triologyrefreshment' }) {
  const { items, removeItem, updateQuantity, clearList, totalItems, openMessenger, buildMessengerMessage } = useOrderList();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  /* ─── Close on Escape + focus trap ────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', onKey);
    // Focus the close button when drawer opens
    setTimeout(() => closeBtnRef.current?.focus(), 100);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  /* ─── Lock body scroll when open ───────────────────────── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ─── Handlers ─────────────────────────────────────────── */
  const handleSend = () => {
    openMessenger(messengerUrl);
  };

  const handleCopy = async () => {
    const msg = buildMessengerMessage();
    if (!msg) return;
    try {
      await navigator.clipboard.writeText(msg);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = msg;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => setIsOpen(false);

  if (items.length === 0) {
    return null; // No trigger button when list is empty
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          Floating Trigger Button (only visible when items exist)
          ═══════════════════════════════════════════════════════ */}
      <button
        onClick={() => setIsOpen(true)}
        className="old-trigger btn-interact"
        aria-label={`View order list (${totalItems} items)`}
      >
        <Icon name="list_alt" size={22} />
        <span className="old-trigger-badge">{totalItems}</span>
      </button>

      {/* ═══════════════════════════════════════════════════════
          Overlay
          ═══════════════════════════════════════════════════════ */}
      {isOpen && <div className="old-overlay" onClick={handleClose} />}

      {/* ═══════════════════════════════════════════════════════
          Drawer Panel
          ═══════════════════════════════════════════════════════ */}
      <div
        ref={panelRef}
        className={`old-drawer${isOpen ? ' old-drawer-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="My Order List"
      >
        {/* Header */}
        <div className="old-header">
          <h3 className="old-title">
            <Icon name="list_alt" size={20} />
            My Order List ({totalItems})
          </h3>
          <div className="old-header-actions">
            <button onClick={clearList} className="old-clear-btn btn-interact" title="Clear all">
              <Icon name="delete_sweep" size={18} />
            </button>
            <button onClick={handleClose} className="old-close-btn btn-interact" title="Close" ref={closeBtnRef}>
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="old-items">
          {items.length === 0 ? (
            <div className="old-empty-state">
              <Icon name="check_circle" size={36} style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }} />
              <p className="old-empty-text">List cleared!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="old-item">
                <div className="old-item-info">
                  <span className="old-item-name">{item.name}</span>
                  {item.price && <span className="old-item-price">{item.price}</span>}
                </div>
                <div className="old-item-actions">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="old-qty-btn btn-interact"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Icon name="remove" size={16} />
                  </button>
                  <span className="old-qty">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="old-qty-btn btn-interact"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Icon name="add" size={16} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="old-remove-btn btn-interact"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Icon name="close" size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        {items.length > 0 && (
          <div className="old-actions">
            <button onClick={handleCopy} className="old-copy-btn btn-interact">
              <Icon name={copied ? 'check' : 'content_copy'} size={16} />
              {copied ? 'Copied!' : 'Copy List'}
            </button>
            <button onClick={handleSend} className="old-send-btn btn-interact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.503 3.734 7.202.195.145.313.376.313.626l-.004 2.215c-.004.57.587.973 1.11.75l2.47-1.054a1.001 1.001 0 01.764-.02c.516.16 1.06.245 1.613.245 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm.8 11.6l-1.9-2.02-3.7 2.02 4.07-4.32 1.9 2.02 3.7-2.02-4.07 4.32z" />
              </svg>
              Send via Messenger
            </button>
          </div>
        )}
      </div>

      <style>{`
        /* ─── Trigger Button ────────────────────────────────── */
        .old-trigger {
          position: fixed;
          bottom: 1.5rem;
          left: 1.25rem;
          z-index: 900;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: none;
          background: var(--color-primary);
          color: var(--color-on-primary);
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          animation: old-trigger-enter 0.3s ease-out;
        }
        .old-trigger:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 24px rgba(0,0,0,0.3);
        }
        .old-trigger:active {
          transform: scale(0.95);
        }

        @keyframes old-trigger-enter {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }

        .old-trigger-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 22px;
          height: 22px;
          border-radius: var(--radius-full);
          background: var(--color-error);
          color: var(--color-on-error);
          font-size: 0.6875rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        @media (min-width: 768px) {
          .old-trigger {
            bottom: 2.5rem;
            left: 2.5rem;
            width: 60px;
            height: 60px;
          }
        }

        /* ─── Overlay ───────────────────────────────────────── */
        .old-overlay {
          position: fixed;
          inset: 0;
          z-index: 998;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(2px);
          animation: old-fade-in 0.2s ease-out;
        }

        @keyframes old-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ─── Drawer Panel ──────────────────────────────────── */
        .old-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 420px;
          z-index: 1000;
          background: var(--color-surface-container-lowest);
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 32px rgba(0,0,0,0.12);
          transform: translateX(100%);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .old-drawer-open {
          transform: translateX(0);
        }

        /* ─── Header ────────────────────────────────────────── */
        .old-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--color-outline-variant);
          flex-shrink: 0;
        }
        .old-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-headline);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-on-surface);
          margin: 0;
        }
        .old-header-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .old-clear-btn,
        .old-close-btn {
          padding: 0.375rem;
          border: none;
          background: transparent;
          color: var(--color-on-surface-variant);
          cursor: pointer;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .old-clear-btn:hover,
        .old-close-btn:hover {
          background: var(--color-surface-container-high);
        }

        /* ─── Items List ────────────────────────────────────── */
        .old-items {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem 1.5rem;
        }
        .old-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-outline-variant);
          gap: 1rem;
        }
        .old-item:last-child {
          border-bottom: none;
        }
        .old-item-info {
          flex: 1;
          min-width: 0;
        }
        .old-item-name {
          display: block;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-on-surface);
        }
        .old-item-price {
          font-size: 0.8125rem;
          color: var(--color-on-surface-variant);
        }
        .old-item-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-shrink: 0;
        }
        .old-qty-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--color-outline-variant);
          background: transparent;
          color: var(--color-on-surface-variant);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
        }
        .old-qty-btn:hover {
          background: var(--color-surface-container-high);
          border-color: var(--color-outline);
        }
        .old-qty {
          width: 24px;
          text-align: center;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-on-surface);
        }
        .old-remove-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--color-on-surface-variant);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          margin-left: 0.25rem;
        }
        .old-remove-btn:hover {
          background: rgba(186, 26, 26, 0.1);
          color: var(--color-error);
        }

        /* ─── Empty state inside drawer ─────────────────────── */
        .old-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
        }
        .old-empty-text {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-on-surface);
        }

        /* ─── Bottom Actions ────────────────────────────────── */
        .old-actions {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--color-outline-variant);
          flex-shrink: 0;
        }
        .old-copy-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          padding: 0.75rem;
          border: 1px solid var(--color-outline-variant);
          background: transparent;
          color: var(--color-on-surface-variant);
          border-radius: var(--radius-lg);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
        }
        .old-copy-btn:hover {
          background: var(--color-surface-container-high);
        }
        .old-send-btn {
          flex: 1.5;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          padding: 0.75rem;
          background: #1877F2;
          color: #fff;
          border: none;
          border-radius: var(--radius-lg);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
        }
        .old-send-btn:hover {
          background: #166fe5;
        }

        /* ─── Mobile adjustments ────────────────────────────── */
        @media (max-width: 767px) {
          .old-drawer {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}
