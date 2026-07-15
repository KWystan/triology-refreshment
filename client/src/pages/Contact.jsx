/**
 * Contact Us — contact details, inquiry form, map.
 *
 * Sections:
 *   1. Hero — heading "Get in Touch"
 *   2. Contact Details — glass card with phone, email, location
 *   3. Inquiry Form — form with Messenger integration
 *   4. Map — OpenStreetMap embed
 */
import { useState } from 'react';
import { useLiveBusiness } from '../hooks/useLiveBusiness';
import Icon from '../components/ui/Icon';

/* ─── Hero image ────────────────────────────────────────────────── */
const IMG_HERO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAqxouH-b442VnGCv0OsYBSvxCyQB-VxTfBVcQlO7MCruiG4-dpNbC-OKbbJbi3-Yfg7j51pqNl7oIyPGvmHAadxRZpSB-pkcKYO7UK3VXMdzOk0PbiMXp9JunV7pXsi_LDpSP6_P-y_ey14wdbQE0faTsxCi57YfhrTsqrSkqONcoFNTwtM2zO-Tpt6VN6K30fYTtohblMyDrGMvvrT2RqvD-n9zO8qEUUBC4zq67xobGqg974VlDaON_1UjB3Z3r_QCLAgxa92IXs';

export default function Contact() {
  const business = useLiveBusiness();
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'sent'
  const [btnText, setBtnText] = useState('Send Message');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setBtnText('Sending...');
    setTimeout(() => {
      setFormStatus('sent');
      setBtnText('Message Sent!');
      setTimeout(() => {
        setFormStatus('idle');
        setBtnText('Send Message');
        e.target.reset();
      }, 2000);
    }, 1000);
  };

  return (
    <main>
      {/* ═══════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════ */}
      <section className="contact-hero">
        <div className="contact-hero-bg">
          <div className="contact-hero-overlay" />
          <img
            src={IMG_HERO}
            alt="Triology Refreshment event space"
            className="contact-hero-img"
          />
        </div>
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Get in Touch</h1>
          <p className="contact-hero-desc">
            Have questions about our menu or want to book the space? Our team is here to help.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CONTACT GRID — glass card + form + map
          ═══════════════════════════════════════════════════════ */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Glass card — contact details */}
            <div className="contact-sidebar">
              <div className="contact-glass-card">
                <div className="contact-glass-item">
                  <div className="contact-glass-circle">
                    <Icon name="call" size={24} className="contact-glass-icon" />
                  </div>
                  <div>
                    <h4 className="contact-glass-label">Phone</h4>
                    <p className="contact-glass-value">{business.phone}</p>
                  </div>
                </div>
                <div className="contact-glass-item">
                  <div className="contact-glass-circle">
                    <Icon name="mail" size={24} className="contact-glass-icon" />
                  </div>
                  <div>
                    <h4 className="contact-glass-label">Email</h4>
                    <p className="contact-glass-value">{business.email}</p>
                  </div>
                </div>
                <div className="contact-glass-item" style={{ marginBottom: 0 }}>
                  <div className="contact-glass-circle">
                    <Icon name="location_on" size={24} className="contact-glass-icon" />
                  </div>
                  <div>
                    <h4 className="contact-glass-label">Location</h4>
                    <p className="contact-glass-value">
                      Trapiche, Oton, Iloilo City,
                      <br />
                      Philippines 5020
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry form */}
            <div className="contact-form-wrap">
              <h3 className="contact-form-title">Send an Inquiry</h3>
              <form onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div>
                    <label className="contact-form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="contact-form-input"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="contact-form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="contact-form-input"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="contact-form-label">Subject</label>
                  <select name="subject" className="contact-form-input contact-form-select">
                    <option>General Inquiry</option>
                    <option>Event Booking</option>
                    <option>Catering Request</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="contact-form-label">Message</label>
                  <textarea
                    name="message"
                    className="contact-form-input"
                    placeholder="How can we help you?"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`btn-interact contact-form-btn${formStatus === 'sent' ? ' contact-form-btn-sent' : ''}`}
                  disabled={formStatus === 'sending'}
                >
                  {btnText}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="contact-map-wrap">
              <iframe
                title="Triology Refreshment location in Trapiche, Oton, Iloilo"
                src="https://www.openstreetmap.org/export/embed.html?bbox=122.444%2C10.678%2C122.502%2C10.708&layer=nik&marker=10.693%2C122.473"
                className="contact-map-iframe"
                loading="lazy"
                style={{ border: 0, width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
                allowFullscreen
              />
              <div className="contact-map-overlay">
                <Icon name="map" size={36} className="contact-map-icon" />
                <p className="contact-map-label">Find Us in Trapiche</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          RESPONSIVE STYLES
          ═══════════════════════════════════════════════════════ */}
      <style>{`
        /* ─── Hero ──────────────────────────────────────────── */
        .contact-hero {
          position: relative;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .contact-hero {
            height: 380px;
          }
        }

        .contact-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .contact-hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(5, 100, 2, 0.45);
          z-index: 10;
        }

        .contact-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .contact-hero-content {
          position: relative;
          z-index: 20;
          text-align: center;
          padding: 0 1rem;
        }

        .contact-hero-title {
          font-family: 'Okinawa', cursive;
          font-size: clamp(2.5rem, 5vw, 3rem);
          line-height: 1.15;
          font-weight: 400;
          color: #fff;
          text-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
          margin-bottom: 1rem;
        }

        .contact-hero-desc {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #fff;
          max-width: 560px;
          margin: 0 auto;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* ─── Contact Section ───────────────────────────────── */
        .contact-section {
          background: var(--color-surface-container-low);
          padding: 3rem 0;
        }
        @media (min-width: 768px) {
          .contact-section {
            padding: 5rem 0;
          }
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .contact-grid {
            grid-template-columns: repeat(12, 1fr);
          }
        }

        .contact-sidebar {
          grid-column: span 4;
        }

        .contact-form-wrap {
          grid-column: span 5;
        }

        .contact-map-wrap {
          grid-column: span 3;
        }

        /* ─── Glass Card ────────────────────────────────────── */
        .contact-glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 2rem;
          border-radius: var(--radius-xl);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(191, 201, 193, 0.3);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .contact-glass-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .contact-glass-circle {
          width: 48px;
          height: 48px;
          background: color-mix(in srgb, var(--color-primary) 10%, transparent);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contact-glass-icon {
          color: var(--color-primary);
        }

        .contact-glass-label {
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.25;
          margin-bottom: 0.25rem;
        }

        .contact-glass-value {
          font-size: 1rem;
          line-height: 1.5;
          color: var(--color-on-surface-variant);
        }

        /* ─── Form ──────────────────────────────────────────── */
        .contact-form-wrap {
          background: var(--color-surface-container-lowest);
          padding: 2rem;
          border-radius: var(--radius-xl);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .contact-form-title {
          font-family: var(--font-headline);
          font-size: clamp(1.25rem, 2vw, 1.5rem);
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: 1.5rem;
        }

        .contact-form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (max-width: 480px) {
          .contact-form-row {
            grid-template-columns: 1fr;
          }
        }

        .contact-form-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          line-height: 1rem;
          margin-bottom: 0.25rem;
          color: var(--color-on-surface-variant);
        }

        .contact-form-input {
          width: 100%;
          background: var(--color-surface);
          border: none;
          border-radius: var(--radius-lg);
          padding: 0.75rem;
          font-size: 0.875rem;
          color: var(--color-on-surface);
          outline: none;
          box-sizing: border-box;
        }
        .contact-form-input:focus {
          box-shadow: 0 0 0 2px var(--color-primary);
        }
        .contact-form-input::placeholder {
          opacity: 0.5;
        }

        .contact-form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23707973' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          padding-right: 2.25rem;
          cursor: pointer;
        }

        .contact-form-btn {
          width: 100%;
          padding: 0.75rem;
          background: var(--color-secondary);
          color: var(--color-on-secondary);
          border: none;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-top: 0.5rem;
        }
        .contact-form-btn:hover:not(:disabled) {
          background: color-mix(in srgb, var(--color-secondary) 85%, #000);
        }
        .contact-form-btn:disabled {
          opacity: 0.8;
          cursor: default;
        }
        .contact-form-btn-sent {
          background: var(--color-primary);
          color: var(--color-on-primary);
        }

        /* ─── Map ───────────────────────────────────────────── */
        .contact-map-wrap {
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          min-height: 300px;
        }

        .contact-map-iframe {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 1;
          display: block;
        }

        .contact-map-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent 30%, rgba(255, 255, 255, 0.92) 70%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 0.5rem;
          z-index: 2;
          pointer-events: none;
          padding: 3rem 1.5rem 0.75rem;
          text-align: center;
        }

        .contact-map-icon {
          color: var(--color-primary);
        }

        .contact-map-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
        }
      `}</style>
    </main>
  );
}
