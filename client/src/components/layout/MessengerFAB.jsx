/**
 * MessengerFAB — Floating Messenger chat button visible on all breakpoints.
 *
 * Context-aware greeting based on current route. Opens Facebook Messenger
 * with a pre-formatted message when clicked.
 *
 * Props:
 *   messengerUrl — Facebook Messenger URL (from business.data)
 */
import { useLocation } from 'react-router-dom';

const GREETINGS = {
  '/menu': "Hi Triology! I'd like to order some food. Here's what I'm looking for:",
  '/party-packs': "Hi Triology! I'm interested in your Combo Meals bundles.",
  '/events': "Hi Triology! I'd like to book your venue / event space.",
  '/': "Hi Triology! I have a question.",
};

export default function MessengerFAB({ messengerUrl = 'https://m.me/triologyrefreshment' }) {
  const location = useLocation();
  const greeting = GREETINGS[location.pathname] || GREETINGS['/'];

  const handleClick = () => {
    const message = encodeURIComponent(greeting);
    window.open(`${messengerUrl}?text=${message}`, '_blank', 'noopener');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Chat with us on Messenger"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-full)',
        background: '#1877F2',
        color: '#ffffff',
        boxShadow: '0 4px 16px rgba(24, 119, 242, 0.4)',
        border: 'none',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      className="btn-interact msg-fab-trigger"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.08)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(24, 119, 242, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(24, 119, 242, 0.4)';
      }}
    >
      {/* Facebook Messenger icon */}
      <span className="msg-fab-icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.503 3.734 7.202.195.145.313.376.313.626l-.004 2.215c-.004.57.587.973 1.11.75l2.47-1.054a1.001 1.001 0 01.764-.02c.516.16 1.06.245 1.613.245 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm.8 11.6l-1.9-2.02-3.7 2.02 4.07-4.32 1.9 2.02 3.7-2.02-4.07 4.32z" />
        </svg>
      </span>

      <style>{`
        .msg-fab-trigger { position: relative; }
        .msg-fab-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: var(--radius-full);
          color: #1877F2;
          transition: transform 0.2s ease;
        }
        .msg-fab-trigger:hover .msg-fab-icon {
          transform: scale(1.06);
        }
        .msg-fab-trigger::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fbc002;
          border: 2px solid #1877F2;
          animation: messenger-pulse 2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes messenger-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
      `}</style>
    </button>
  );
}
