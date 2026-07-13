/**
 * VenueBookingForm — Multi-field booking inquiry form that sends details
 * directly to Messenger with a pre-formatted message.
 *
 * Captures all the info the business needs: date, guest count, occasion,
 * food preference, budget, notes. On submit, opens Messenger with a
 * structured message containing every field.
 *
 * Props:
 *   messengerUrl — Facebook Messenger deep link URL
 *   title       — Optional heading override (default: 'Book the Venue')
 */
import { useState, useRef } from 'react';

const OCCASIONS = [
  'Birthday Celebration',
  'Family Reunion',
  'Office / Corporate Event',
  'Wedding Reception',
  'Christening / Baptismal',
  'Other',
];

const FOOD_OPTIONS = [
  { value: 'rent-catering', label: 'Rent + Order Food from Triology' },
  { value: 'rent-only', label: 'Rent Only (I will bring my own food)' },
];

function buildMessengerMessage(data) {
  const lines = [
    'Hi Triology! I would like to inquire about venue rental. 🎉',
    '',
    `📅 Preferred Date: ${data.date || 'Not specified'}`,
    `👥 Estimated Guests: ${data.guests || 'Not specified'}`,
    `🎉 Occasion: ${data.occasion || 'Not specified'}`,
    `🍽️ ${data.foodOption === 'rent-only' ? 'I will bring my own food.' : 'I would like to order food from Triology.'}`,
  ];

  if (data.foodPreferences) {
    lines.push(`🥘 Food Preferences: ${data.foodPreferences}`);
  }

  if (data.name) {
    lines.push(`👤 Name: ${data.name}`);
  }

  if (data.contact) {
    lines.push(`📞 Contact: ${data.contact}`);
  }

  if (data.notes) {
    lines.push(`📝 Notes: ${data.notes}`);
  }

  lines.push('', 'Thank you! Looking forward to your response. 🙏');

  return lines.join('\n');
}

export default function VenueBookingForm({
  messengerUrl = 'https://m.me/triologyrefreshment',
  title = 'Book the Venue',
}) {
  const [formData, setFormData] = useState({
    date: '',
    guests: '',
    occasion: '',
    foodOption: 'rent-catering',
    foodPreferences: '',
    name: '',
    contact: '',
    notes: '',
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'preparing' | 'ready' | 'sent'
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (status === 'sent') setStatus('idle');
  };

  const validate = () => {
    const errs = {};
    if (!formData.date) errs.date = 'Please select your preferred date.';
    if (!formData.guests || parseInt(formData.guests, 10) < 1) errs.guests = 'Enter the number of guests (min 1).';
    if (parseInt(formData.guests, 10) > 50) errs.guests = 'Maximum 50 guests — contact us for larger events.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstErrField = Object.keys(errs)[0];
      formRef.current?.querySelector(`[name="${firstErrField}"]`)?.focus();
      return;
    }

    setStatus('preparing');

    // Build the message
    const message = buildMessengerMessage(formData);
    const encoded = encodeURIComponent(message);
    const messengerLink = `${messengerUrl}?text=${encoded}`;

    // Open Messenger with pre-filled message
    window.open(messengerLink, '_blank', 'noopener');

    setStatus('ready');
  };

  const handleCopy = async () => {
    const message = buildMessengerMessage(formData);
    try {
      await navigator.clipboard.writeText(message);
      setStatus('sent');
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = message;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setStatus('sent');
    }
  };

  const handleReset = () => {
    setFormData({
      date: '',
      guests: '',
      occasion: '',
      foodOption: 'rent-catering',
      foodPreferences: '',
      name: '',
      contact: '',
      notes: '',
    });
    setStatus('idle');
    setErrors({});
  };

  return (
    <div className="vbf-card">
      <h3 className="vbf-title">{title}</h3>
      <p className="vbf-subtitle">
        Fill in your details and we&rsquo;ll send them straight to our Messenger.
        We respond within 1 hour.
      </p>

      {status === 'ready' || status === 'sent' ? (
        /* ─── Success / Next Steps ─── */
        <div className="vbf-success">
          <span className="material-symbols-outlined vbf-success-icon">
            {status === 'sent' ? 'check_circle' : 'chat'}
          </span>
          <h4 className="vbf-success-title">
            {status === 'sent'
              ? 'Details Copied!'
              : 'Messenger Should Be Open'}
          </h4>
          <p className="vbf-success-desc">
            {status === 'sent'
              ? 'Your booking details have been copied. Open Messenger and paste them to send.'
              : 'If Messenger did not open, click the button below to copy your details.'}
          </p>

          {status === 'ready' && (
            <button onClick={handleCopy} className="btn-interact vbf-copy-btn">
              Copy Details &amp; Open Messenger
            </button>
          )}

          {status === 'sent' && (
            <div className="vbf-success-actions">
              <a
                href={`${messengerUrl}?text=${encodeURIComponent(buildMessengerMessage(formData))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interact vbf-messenger-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.503 3.734 7.202.195.145.313.376.313.626l-.004 2.215c-.004.57.587.973 1.11.75l2.47-1.054a1.001 1.001 0 01.764-.02c.516.16 1.06.245 1.613.245 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm.8 11.6l-1.9-2.02-3.7 2.02 4.07-4.32 1.9 2.02 3.7-2.02-4.07 4.32z" />
                </svg>
                Open Messenger
              </a>
              <button onClick={handleReset} className="btn-interact vbf-reset-btn">
                Start Over
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ─── Booking Form ─── */
        <form onSubmit={handleSubmit} ref={formRef} noValidate>
          {/* Row: Date + Guests */}
          <div className="vbf-row">
            <div className="vbf-field">
              <label htmlFor="booking-date" className="vbf-label">
                Preferred Date <span className="vbf-required">*</span>
              </label>
              <input
                id="booking-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={`vbf-input${errors.date ? ' vbf-input-error' : ''}`}
              />
              {errors.date && <span className="vbf-error-msg">{errors.date}</span>}
            </div>
            <div className="vbf-field">
              <label htmlFor="booking-guests" className="vbf-label">
                Estimated Guests <span className="vbf-required">*</span>
              </label>
              <input
                id="booking-guests"
                type="number"
                name="guests"
                min="1"
                max="50"
                value={formData.guests}
                onChange={handleChange}
                required
                placeholder="e.g. 25"
                className={`vbf-input${errors.guests ? ' vbf-input-error' : ''}`}
              />
              {errors.guests && <span className="vbf-error-msg">{errors.guests}</span>}
            </div>
          </div>

          {/* Occasion */}
          <div className="vbf-field">
            <label htmlFor="booking-occasion" className="vbf-label">Occasion</label>
            <select
              id="booking-occasion"
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className="vbf-input vbf-select"
            >
              <option value="">Select occasion...</option>
              {OCCASIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Food Option */}
          <div className="vbf-field">
            <span className="vbf-label">Food Arrangement</span>
            <div className="vbf-radio-group">
              {FOOD_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`btn-interact vbf-radio-label${formData.foodOption === opt.value ? ' vbf-radio-active' : ''}`}
                >
                  <input
                    type="radio"
                    name="foodOption"
                    value={opt.value}
                    checked={formData.foodOption === opt.value}
                    onChange={handleChange}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Conditional: Food Preferences */}
          {formData.foodOption === 'rent-catering' && (
            <div className="vbf-field">
              <label htmlFor="booking-food-prefs" className="vbf-label">Food Preferences / Requests</label>
              <textarea
                id="booking-food-prefs"
                name="foodPreferences"
                value={formData.foodPreferences}
                onChange={handleChange}
                placeholder="What dishes are you looking for? Any dietary restrictions?"
                rows={2}
                className="vbf-input"
              />
            </div>
          )}

          {/* Contact Info — compact row */}
          <div className="vbf-row">
            <div className="vbf-field">
              <label htmlFor="booking-name" className="vbf-label">Your Name</label>
              <input
                id="booking-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Juan Dela Cruz"
                className="vbf-input"
              />
            </div>
            <div className="vbf-field">
              <label htmlFor="booking-contact" className="vbf-label">Contact Number</label>
              <input
                id="booking-contact"
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="0947 709 7622"
                className="vbf-input"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="vbf-field">
            <label htmlFor="booking-notes" className="vbf-label">Additional Notes</label>
            <textarea
              id="booking-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Anything else we should know?"
              rows={2}
              className="vbf-input"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-interact vbf-submit-btn"
            disabled={status === 'preparing'}
          >
            {status === 'preparing' ? (
              <>Opening Messenger...</>
            ) : (
              <>
                <span className="vbf-mssgr-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.503 3.734 7.202.195.145.313.376.313.626l-.004 2.215c-.004.57.587.973 1.11.75l2.47-1.054a1.001 1.001 0 01.764-.02c.516.16 1.06.245 1.613.245 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm.8 11.6l-1.9-2.02-3.7 2.02 4.07-4.32 1.9 2.02 3.7-2.02-4.07 4.32z" />
                  </svg>
                </span>
                Send via Messenger
              </>
            )}
          </button>
        </form>
      )}

      <style>{`
        .vbf-card {
          background: var(--color-surface-container-lowest);
          border-radius: var(--radius-2xl);
          padding: 2rem;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-outline-variant);
        }
        .vbf-title {
          font-family: var(--font-headline);
          font-size: clamp(1.25rem, 2.5vw, 1.5rem);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }
        .vbf-subtitle {
          font-size: 0.9375rem;
          color: var(--color-on-surface-variant);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        /* ─── Input base ────────────────────────────────────── */
        .vbf-input {
          width: 100%;
          padding: 0.75rem;
          background: var(--color-surface-container-lowest);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          color: var(--color-on-surface);
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .vbf-input:focus-visible {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(5, 100, 2, 0.15);
        }
        .vbf-input::placeholder { color: var(--color-outline); }
        .vbf-input-error {
          border-color: var(--color-error) !important;
          box-shadow: 0 0 0 2px rgba(186, 26, 26, 0.12) !important;
        }
        .vbf-error-msg {
          display: block;
          font-size: 0.75rem;
          color: var(--color-error);
          margin-top: 0.25rem;
          font-weight: 500;
        }
        .vbf-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23707973' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          padding-right: 2.25rem;
          cursor: pointer;
        }

        .vbf-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--color-on-surface-variant);
        }
        .vbf-required { color: var(--color-error); }
        .vbf-field { margin-bottom: 1rem; }
        .vbf-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }

        /* ─── Radio (Food Option) ───────────────────────────── */
        .vbf-radio-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .vbf-radio-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-lg);
          border: 2px solid var(--color-outline-variant);
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .vbf-radio-label input { accent-color: var(--color-primary); }
        .vbf-radio-label span { font-size: 0.9375rem; font-weight: 500; }
        .vbf-radio-active {
          border-color: var(--color-primary);
          background: color-mix(in srgb, var(--color-primary) 8%, transparent);
        }

        /* ─── Submit ─────────────────────────────────────────── */
        .vbf-submit-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          background: #1877F2;
          color: #ffffff;
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, opacity 0.2s ease;
          margin-top: 0.5rem;
        }
        .vbf-submit-btn:hover:not(:disabled) { background: #166fe5; }
        .vbf-submit-btn:disabled { opacity: 0.6; cursor: default; }
        .vbf-mssgr-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.18);
          border-radius: var(--radius-full);
          transition: transform 0.2s ease, background 0.2s ease;
          flex-shrink: 0;
        }
        .vbf-submit-btn:hover:not(:disabled) .vbf-mssgr-icon {
          transform: scale(1.12);
          background: rgba(255, 255, 255, 0.28);
        }

        /* ─── Success state ──────────────────────────────────── */
        .vbf-success {
          text-align: center;
          padding: 2rem 0;
          animation: vbf-fade-in 0.35s ease-out;
        }
        @keyframes vbf-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vbf-success-icon {
          font-size: 48px;
          color: var(--color-primary);
          display: block;
          margin-bottom: 1rem;
          font-variation-settings: "'FILL' 1";
        }
        .vbf-success-title {
          font-family: var(--font-headline);
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-on-surface);
          margin-bottom: 0.5rem;
        }
        .vbf-success-desc {
          font-size: 0.9375rem;
          color: var(--color-on-surface-variant);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        .vbf-copy-btn {
          padding: 0.75rem 2rem;
          background: var(--color-primary);
          color: var(--color-on-primary);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }
        .vbf-success-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .vbf-messenger-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #1877F2;
          color: #ffffff;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
        }
        .vbf-messenger-btn:hover { background: #166fe5; }
        .vbf-reset-btn {
          padding: 0.75rem 1.5rem;
          background: transparent;
          color: var(--color-on-surface-variant);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid var(--color-outline-variant);
          cursor: pointer;
        }

        /* ─── Mobile ─────────────────────────────────────────── */
        @media (max-width: 480px) {
          .vbf-row { grid-template-columns: 1fr; gap: 0; }
        }
      `}</style>
    </div>
  );
}
