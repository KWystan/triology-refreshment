/**
 * ContactBar — A thin info bar showing contact details, location, open hours,
 * and a Messenger link. Rendered in App.jsx above the Footer.
 *
 * Props:
 *   business — business data object with phone, email, address, messengerUrl, hours
 */
import Icon from '../ui/Icon';

function OpenHoursIndicator({ hours }) {
  const isOpen = (() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const total = hour * 60 + minute;
    // 8:00 AM = 480, 8:00 PM = 1200
    return total >= 480 && total < 1200;
  })();

  return (
    <span className="cb-hours">
      <span
        className={`cb-hours-dot${isOpen ? ' cb-hours-open' : ' cb-hours-closed'}`}
      />
      {isOpen ? `Open now — ${hours}` : `Closed — ${hours}`}
    </span>
  );
}

export default function ContactBar({ business: biz }) {
  if (!biz) return null;

  return (
    <div className="cb-bar">
      <div className="container cb-inner">
        {/* Left group: location + hours */}
        <div className="cb-left">
          {/* Location */}
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(biz.address.full)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cb-link"
          >
            <Icon name="location_on" size={16} />
            {biz.locationLabel || biz.address.full}
          </a>

          {/* Open Hours */}
          <OpenHoursIndicator hours={biz.hours} />
        </div>

        {/* Right group: phone + messenger */}
        <div className="cb-right">
          {/* Phone */}
          <a
            href={`tel:${biz.phone.replace(/\s/g, '')}`}
            className="cb-phone"
          >
            <Icon name="call" size={16} />
            {biz.phone}
          </a>

          {/* Divider */}
          <span className="cb-divider" />

          {/* Messenger */}
          <a
            href={biz.messengerUrl || biz.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cb-messenger btn-interact"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.503 3.734 7.202.195.145.313.376.313.626l-.004 2.215c-.004.57.587.973 1.11.75l2.47-1.054a1.001 1.001 0 01.764-.02c.516.16 1.06.245 1.613.245 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm.8 11.6l-1.9-2.02-3.7 2.02 4.07-4.32 1.9 2.02 3.7-2.02-4.07 4.32z" />
            </svg>
            Messenger
          </a>
        </div>
      </div>

      <style>{`
        .cb-bar {
          background: var(--color-surface-container-high);
          border-top: 1px solid var(--color-outline-variant);
          padding: 0.625rem 0;
        }
        .cb-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem 1.5rem;
        }
        .cb-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .cb-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .cb-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8125rem;
          color: var(--color-on-surface-variant);
          text-decoration: none;
        }
        .cb-link:hover {
          color: var(--color-primary);
        }
        .cb-hours {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: var(--color-on-surface-variant);
        }
        .cb-hours-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .cb-hours-open { background: #22c55e; }
        .cb-hours-closed { background: #ef4444; }
        .cb-phone {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-primary);
          text-decoration: none;
          white-space: nowrap;
        }
        .cb-phone:hover {
          text-decoration: underline;
        }
        .cb-divider {
          width: 1px;
          height: 16px;
          background: var(--color-outline-variant);
          flex-shrink: 0;
        }
        .cb-messenger {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          background: #1877F2;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          line-height: 1.5;
          transition: background 0.2s ease;
        }
        .cb-messenger:hover {
          background: #155dc0;
        }

        @media (max-width: 480px) {
          .cb-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
