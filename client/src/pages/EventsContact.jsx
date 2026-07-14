/**
 * Events & Contact page — matches Stitch "Events & Contact | Triology Refreshment" design exactly.
 *
 * Sections:
 *   1. Hero — full-bleed hero image with dark overlay, title, and subtitle
 *   2. Event Room Rentals — intro text + feature grid + image gallery (2-col)
 *   3. Contact — glass-card sidebar + inquiry form + map image
 */
import { useState, useEffect } from 'react';
import { useLiveBusiness } from '../hooks/useLiveBusiness';
import Icon from '../components/ui/Icon';
import { useActiveSection } from '../context/ActiveSectionContext';

/* ─── Image assets (from Stitch aida-public) ────────────────── */
const IMG_HERO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAqxouH-b442VnGCv0OsYBSvxCyQB-VxTfBVcQlO7MCruiG4-dpNbC-OKbbJbi3-Yfg7j51pqNl7oIyPGvmHAadxRZpSB-pkcKYO7UK3VXMdzOk0PbiMXp9JunV7pXsi_LDpSP6_P-y_ey14wdbQE0faTsxCi57YfhrTsqrSkqONcoFNTwtM2zO-Tpt6VN6K30fYTtohblMyDrGMvvrT2RqvD-n9zO8qEUUBC4zq67xobGqg974VlDaON_1UjB3Z3r_QCLAgxa92IXs';

const IMG_TABLE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBHRLDQIqqfP7kX1DkiKo9uY32p399pTkpKiQ-6x3EIqKXMhezfVGuGX3lUuip0e_hOkvtC09lODn0A1oUJvAc9_aNE5Ql1vPIJEpi1EW5q90UMY2ikEoYkoKguJRhOLiDYf4r-jc5zshJnJLuH3_1goLADEGJRRPpj7HyQPP8JJVlBh4LNdfJxCAF3emWOhSR2DAX9gWKoox85Yh-C1vn4JHiM6F1Ip84ce_pnPVv-QTBPjxOnXuv9p1YmpCMfdcWCHCb9j-RJHD5w';

const IMG_INTERIOR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB_3r2HO4Fe6kJEZzJiWXeIOo1n3NzrVzxuiGAgWR6snMvMLDOcDi_8mUco2xL2Y5GtDghcDLxaLzzqOqeRK4dgU6kw3gcUof2rrsb1tWCthp2wEVrvQn5IR-ZaqlaFoixONrtfQmKedV0ClB013W19wcIrNM9kM-RCGKWBzyt2TP1BT-EIi3QDmtxW5iRcv1vlsKVaej77iHAmA6J-1o3L9AVErGyleiq5sZinVW5s77QUH2Ue_HB-7WTuc9oUPeGYVt6x28GfaFd6';

const IMG_BUFFET =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCzthJzEmXxEEh-9R9iHJaylNo23C9EqgF-LChRgBC9RDu6yqB7zf-xQsNGINj1H-TMpLXsfGddff-qiQXdxmR9JM4YbzS0gYbQR4EIZOCQmUY33mGtJmJbuQZetR27BWj94Eg4eMAqlpmZ4l-ozbv8VFFAfjyawDa9Tyajc49VEkgzZFU3pWQJdZo088hw2-e1t6Q6WIGDNigp_zf75f1silS0GVJjxpPcYuU3joEdJ4tr3MCD4ljbyjvqMntIX7kksMQiT27Xf2Yg';

const IMG_GROUP =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCaMojDc3WEHil_rjMGZ_dRzYN5YhvAQVSPzBrjhWRbhOWOCWIHB_Odh480LdRsNZIzfVX4N0lpjAMpIsK5d2NIebVBzvQr9e3nxX-3SvsqUKAIIVTGWbnh3CRRyx1_Cdge6WmfllA5G7HMjsYXoq2AKT58YYI5CSpDaKkjboNzXAdyknZVlluCDZ20yUhjz0JPXJNB1VIYJLHrDUy9OjfT50fVo1zz_E2IsP9g4Bm2B_9TMa8SQXxcSSgefOykXSX8A8m4R8DEL3hI';

/* ─── Feature data ──────────────────────────────────────────── */
const eventFeatures = [
  { icon: 'groups', title: 'Capacity', desc: 'Up to 50 guests' },
  { icon: 'ac_unit', title: 'Fully AC', desc: 'Temperature control' },
  { icon: 'wifi', title: 'High-Speed WiFi', desc: 'Free for guests' },
  { icon: 'restaurant', title: 'Catering Ready', desc: 'In-house service' },
];

export default function EventsContact() {
  const business = useLiveBusiness();
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'sent'
  const [btnText, setBtnText] = useState('Submit Request');
  const { setActiveSection, clearActiveSection } = useActiveSection();

  /* ─── Throttled scroll detection: which section is most visible ── */
  useEffect(() => {
    const eventsEl = document.getElementById('events-room-section');
    const contactEl = document.getElementById('events-contact-section');
    if (!eventsEl || !contactEl) return;

    let ticking = false;

    const updateActiveSection = () => {
      const vh = window.innerHeight;
      const sections = [
        { id: 'events', el: eventsEl },
        { id: 'contact', el: contactEl },
      ];

      let best = { id: '', overlap: 0 };
      for (const s of sections) {
        const rect = s.el.getBoundingClientRect();
        const overlap = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        if (overlap > best.overlap) {
          best = { id: s.id, overlap };
        }
      }

      if (best.overlap > 0) {
        setActiveSection(best.id);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearActiveSection();
    };
  }, [setActiveSection, clearActiveSection]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setBtnText('Sending...');
    setTimeout(() => {
      setFormStatus('sent');
      setBtnText('Message Sent!');
      setTimeout(() => {
        setFormStatus('idle');
        setBtnText('Submit Request');
        e.target.reset();
      }, 2000);
    }, 1000);
  };

  return (
    <main>
      {/* ═══════════════════════════════════════════════════════
          HERO — full-bleed image with overlay
          ═══════════════════════════════════════════════════════ */}
      <section className="events-hero">
        <div className="events-hero-bg">
          <div className="events-hero-overlay" />
          <img
            src={IMG_HERO}
            alt="A professional, clean, and modern event space in Trapiche, Iloilo"
            className="events-hero-img"
          />
        </div>
        <div className="events-hero-content">
          <h1 className="events-hero-title">Elevate Your Celebrations</h1>
          <p className="events-hero-desc">
            Professional event spaces in the heart of Trapiche, Oton, designed for moments that
            matter.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          EVENT ROOM RENTALS — text + feature grid + image gallery
          ═══════════════════════════════════════════════════════ */}
      <section id="events-room-section" className="events-room-section">
        <div className="container events-room-layout">
          {/* Left column — text content */}
          <div className="events-room-text">
            <span className="events-room-tag">Our Space</span>
            <h2 className="events-room-heading">Designed for Community &amp; Comfort</h2>
            <p className="events-room-desc">
              Located in the serene area of Trapiche, Oton, our event spaces offer a blend of
              modern professional amenities and local warmth. Whether you are hosting an intimate
              family birthday or a corporate seminar, we provide the perfect canvas for your vision.
            </p>

            {/* Feature grid (2x2) */}
            <div className="events-feature-grid">
              {eventFeatures.map((f) => (
                <div key={f.icon} className="events-feature-card">
                  <Icon name={f.icon} size={30} className="events-feature-icon" />
                  <div>
                    <h4 className="events-feature-title">{f.title}</h4>
                    <p className="events-feature-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="events-room-btn btn-interact">Check Availability</button>
          </div>

          {/* Right column — image gallery (masonry 2-col) */}
          <div className="events-room-gallery">
            <div className="events-gal-col">
              <div className="events-gal-img events-gal-portrait">
                <img
                  src={IMG_TABLE}
                  alt="Close-up detail of a beautifully set table for a local celebration at Triology"
                  loading="lazy"
                />
              </div>
              <div className="events-gal-img events-gal-square">
                <img
                  src={IMG_INTERIOR}
                  alt="Wide-angle shot of the modern event room interior in Trapiche, Oton"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="events-gal-col events-gal-col-offset">
              <div className="events-gal-img events-gal-square">
                <img
                  src={IMG_BUFFET}
                  alt="Professional buffet setup at Triology Refreshment event space"
                  loading="lazy"
                />
              </div>
              <div className="events-gal-img events-gal-portrait">
                <img
                  src={IMG_GROUP}
                  alt="A group of local professionals smiling and interacting in a sun-drenched event lounge"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CONTACT — glass-card sidebar + form + map
          ═══════════════════════════════════════════════════════ */}
      <section id="events-contact-section" className="events-contact-section">
        <div className="container">
          {/* Section header */}
          <div className="events-contact-header">
            <h2 className="events-contact-heading">Let's Connect</h2>
            <p className="events-contact-subtitle">
              Have questions about our menu or want to book the space for your next big event? Our
              team is here to help you plan the perfect refreshment experience.
            </p>
          </div>

          {/* Contact grid (12-col desktop, single mobile) */}
          <div className="events-contact-grid">
            {/* Sidebar — glass card with contact details */}
            <div className="events-contact-sidebar">
              <div className="events-glass-card">
                <div className="events-glass-item">
                  <div className="events-glass-circle">
                    <Icon name="call" size={24} className="events-glass-icon" />
                  </div>
                  <div>
                    <h4 className="events-glass-label">Phone</h4>
                    <p className="events-glass-value">{business.phone}</p>
                  </div>
                </div>
                <div className="events-glass-item">
                  <div className="events-glass-circle">
                    <Icon name="mail" size={24} className="events-glass-icon" />
                  </div>
                  <div>
                    <h4 className="events-glass-label">Email</h4>
                    <p className="events-glass-value">{business.email}</p>
                  </div>
                </div>
                <div className="events-glass-item" style={{ marginBottom: 0 }}>
                  <div className="events-glass-circle">
                    <Icon name="location_on" size={24} className="events-glass-icon" />
                  </div>
                  <div>
                    <h4 className="events-glass-label">Location</h4>
                    <p className="events-glass-value">
                      Trapiche, Oton, Iloilo City,
                      <br />
                      Philippines 5020
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry form */}
            <div className="events-form-wrap">
              <h3 className="events-form-title">Send an Inquiry</h3>
              <form onSubmit={handleSubmit}>
                <div className="events-form-row">
                  <div>
                    <label className="events-form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="events-form-input"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="events-form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="events-form-input"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="events-form-label">Event Type</label>
                  <select name="eventType" className="events-form-input events-form-select">
                    <option>Birthday Celebration</option>
                    <option>Corporate Meeting</option>
                    <option>Wedding Reception</option>
                    <option>Other Event</option>
                  </select>
                </div>
                <div>
                  <label className="events-form-label">Message</label>
                  <textarea
                    name="message"
                    className="events-form-input"
                    placeholder="Tell us about your event..."
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`btn-interact events-form-btn${formStatus === 'sent' ? ' events-form-btn-sent' : ''}`}
                  disabled={formStatus === 'sending'}
                >
                  {btnText}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="events-map-wrap">
              <iframe
                title="Triology Refreshment location in Trapiche, Oton, Iloilo"
                src="https://www.openstreetmap.org/export/embed.html?bbox=122.444%2C10.678%2C122.502%2C10.708&layer=nik&marker=10.693%2C122.473"
                className="events-map-iframe"
                loading="lazy"
                style={{ border: 0, width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
                allowFullscreen
              />
              <div className="events-map-overlay">
                <Icon name="map" size={36} className="events-map-icon" />
                <p className="events-map-label">Find Us in Trapiche</p>
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
        .events-hero {
          position: relative;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .events-hero {
            height: 400px;
          }
        }

        .events-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .events-hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(5, 100, 2, 0.45);
          z-index: 10;
        }

        .events-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .events-hero-content {
          position: relative;
          z-index: 20;
          text-align: center;
          padding: 0 1rem;
        }

        .events-hero-title {
          font-family: 'Okinawa', cursive;
          font-size: clamp(2.5rem, 5vw, 3rem);
          line-height: 1.15;
          font-weight: 400;
          color: #fff;
          text-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
          margin-bottom: 1rem;
        }

        .events-hero-desc {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #fff;
          max-width: 560px;
          margin: 0 auto;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* ─── Event Room Section ────────────────────────────── */
        .events-room-section {
          padding: 3rem 0;
        }
        @media (min-width: 768px) {
          .events-room-section {
            padding: 5rem 0;
          }
        }

        .events-room-layout {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          align-items: flex-start;
        }
        @media (min-width: 768px) {
          .events-room-layout {
            flex-direction: row;
          }
        }

        .events-room-text {
          width: 100%;
        }
        @media (min-width: 768px) {
          .events-room-text {
            width: 50%;
          }
        }

        .events-room-tag {
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.25;
          color: var(--color-secondary);
          text-transform: uppercase;
          letter-spacing: 0.125em;
          display: block;
          margin-bottom: 1rem;
        }

        .events-room-heading {
          font-family: var(--font-headline);
          font-size: clamp(1.75rem, 3vw, 2rem);
          line-height: 1.25;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 1.5rem;
        }

        .events-room-desc {
          font-size: 1.125rem;
          line-height: 1.75;
          color: var(--color-on-surface-variant);
          margin-bottom: 2rem;
        }

        /* Feature grid (2x2) */
        .events-feature-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        @media (min-width: 480px) {
          .events-feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .events-feature-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--color-surface-container-low);
          border-radius: var(--radius-lg);
        }

        .events-feature-icon {
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .events-feature-title {
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.25;
          color: var(--color-on-surface);
          margin-bottom: 0.125rem;
        }

        .events-feature-desc {
          font-size: 0.875rem;
          line-height: 1.25;
          color: var(--color-on-surface-variant);
          opacity: 0.8;
        }

        .events-room-btn {
          padding: 0.75rem 2rem;
          background: var(--color-primary);
          color: var(--color-on-primary);
          border: none;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
        }

        /* ─── Image Gallery ─────────────────────────────────── */
        .events-room-gallery {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .events-room-gallery {
            width: 50%;
          }
        }
        @media (max-width: 480px) {
          .events-room-gallery {
            grid-template-columns: 1fr;
          }
          .events-gal-col-offset {
            padding-top: 0;
          }
        }

        .events-gal-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .events-gal-col-offset {
          padding-top: 3rem;
        }

        .events-gal-img {
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .events-gal-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .events-gal-portrait {
          aspect-ratio: 3 / 4;
        }

        .events-gal-square {
          aspect-ratio: 1 / 1;
        }

        /* ─── Contact Section ────────────────────────────────── */
        .events-contact-section {
          background: var(--color-surface-container-low);
          padding: 3rem 0;
        }
        @media (min-width: 768px) {
          .events-contact-section {
            padding: 5rem 0;
          }
        }

        .events-contact-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .events-contact-heading {
          font-family: var(--font-headline);
          font-size: clamp(1.75rem, 3vw, 2rem);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 1rem;
        }

        .events-contact-subtitle {
          font-size: 1rem;
          line-height: 1.5;
          color: var(--color-on-surface-variant);
          max-width: 560px;
          margin: 0 auto;
        }

        /* Contact grid — 12-col desktop, 1-col mobile */
        .events-contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: stretch;
        }
        @media (min-width: 1024px) {
          .events-contact-grid {
            grid-template-columns: repeat(12, 1fr);
          }
        }

        .events-contact-sidebar {
          grid-column: span 4;
        }

        .events-form-wrap {
          grid-column: span 5;
        }

        .events-map-wrap {
          grid-column: span 3;
        }

        /* ─── Glass Card ─────────────────────────────────────── */
        .events-glass-card {
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

        .events-glass-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .events-glass-circle {
          width: 48px;
          height: 48px;
          background: color-mix(in srgb, var(--color-primary) 10%, transparent);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .events-glass-icon {
          color: var(--color-primary);
        }

        .events-glass-label {
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.25;
          margin-bottom: 0.25rem;
        }

        .events-glass-value {
          font-size: 1rem;
          line-height: 1.5;
          color: var(--color-on-surface-variant);
        }

        /* ─── Inquiry Form ───────────────────────────────────── */
        .events-form-wrap {
          background: var(--color-surface-container-lowest);
          padding: 2rem;
          border-radius: var(--radius-xl);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .events-form-title {
          font-family: var(--font-headline);
          font-size: clamp(1.25rem, 2vw, 1.5rem);
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: 1.5rem;
        }

        .events-form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (max-width: 480px) {
          .events-form-row {
            grid-template-columns: 1fr;
          }
        }

        .events-form-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          line-height: 1rem;
          margin-bottom: 0.25rem;
          color: var(--color-on-surface-variant);
        }

        .events-form-input {
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
        .events-form-input:focus {
          box-shadow: 0 0 0 2px var(--color-primary);
        }
        .events-form-input::placeholder {
          opacity: 0.5;
        }

        .events-form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23707973' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          padding-right: 2.25rem;
          cursor: pointer;
        }

        .events-form-btn {
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
        .events-form-btn:hover:not(:disabled) {
          background: color-mix(in srgb, var(--color-secondary) 85%, #000);
        }
        .events-form-btn:disabled {
          opacity: 0.8;
          cursor: default;
        }
        .events-form-btn-sent {
          background: var(--color-primary);
          color: var(--color-on-primary);
        }

        /* ─── Map ────────────────────────────────────────────── */
        .events-map-wrap {
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          min-height: 300px;
        }

        .events-map-iframe {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 1;
          display: block;
        }

        .events-map-overlay {
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

        .events-map-icon {
          color: var(--color-primary);
        }

        .events-map-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        @media (max-width: 767px) {
          html, body {
            overflow-x: hidden;
          }
        }
      `}</style>
    </main>
  );
}
