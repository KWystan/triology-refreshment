/**
 * Venue page — Dedicated venue rental showcase.
 *
 * Sections:
 *   1. Hero — venue photo with dark overlay, title, capacity badge, CTA, floating decor
 *   2. Overview — description, booking note, quick-facts grid
 *   3. Pricing — two pricing cards (Venue Only / Venue + Catering)
 *   4. Amenities — icon grid (2-col mobile, 3-col tablet, 4-col desktop)
 *   5. Photo Gallery — image grid with hover overlay and lightbox
 *   6. Book Now — VenueBookingForm + contact info
 *   7. Location — map + address info
 */
import { useState, useEffect, useRef } from 'react';
import { useLiveBusiness } from '../hooks/useLiveBusiness';
import Icon from '../components/ui/Icon';
import VenueBookingForm from '../components/ui/VenueBookingForm';


/* ═══════════════════════════════════════════════════════════════
   FloatingDecor — animated leaves & sparkle (hero only)
   ═══════════════════════════════════════════════════════════════ */
function FloatingDecor() {
  return (
    <div className="vdecor" aria-hidden="true">
      {/* Leaf 1 — gold, top-right, slow drift */}
      <svg className="vdecor-leaf1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
      {/* Leaf 2 — green, bottom-left, gentle bob */}
      <svg className="vdecor-leaf2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
      {/* Sparkle — gold, mid-right, twinkle */}
      <svg className="vdecor-sparkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      </svg>
    </div>
  );
}

export default function Venue() {
  const business = useLiveBusiness();
  const { venue } = business;
  const [selectedImage, setSelectedImage] = useState(null);
  const [heroError, setHeroError] = useState(false);
  const closeRef = useRef(null);

  /* ─── Lightbox keyboard nav + focus ───────────────────── */
  useEffect(() => {
    if (selectedImage === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { setSelectedImage(null); return; }
      if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => (prev > 0 ? prev - 1 : prev));
      }
      if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => (prev < venue.gallery.length - 1 ? prev + 1 : prev));
      }
    };
    document.addEventListener('keydown', onKey);
    setTimeout(() => closeRef.current?.focus(), 50);
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedImage]);

  return (
    <main>
      {/* ═══════════════════════════════════════════════════════
          SECTION 1: HERO
          ═══════════════════════════════════════════════════════ */}
      <section className="venue-hero">
        <div
          className="venue-hero-bg"
          style={heroError ? { background: 'var(--color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}
        >
          <div className="venue-hero-overlay" />
          {heroError ? (
            <Icon name="meeting_room" size={64} style={{ color: 'var(--color-primary)', opacity: 0.3 }} />
          ) : (
            <img
              src={venue.gallery[0]}
              alt="Triology Event Hall venue"
              className="venue-hero-img"
              onError={() => setHeroError(true)}
            />
          )}
        </div>
        <FloatingDecor />
        <div className="venue-hero-content">
          <span className="venue-hero-badge">Event Space in Trapiche, Oton</span>
          <h1 className="venue-hero-title">{venue.name}</h1>
          <p className="venue-hero-desc">{venue.description}</p>
          <div className="venue-hero-items">
            <div className="venue-hero-stat">
              <Icon name="groups" size={20} />
              <span>Up to {venue.capacity} guests</span>
            </div>
            <div className="venue-hero-stat">
              <Icon name="ac_unit" size={20} />
              <span>Fully Air-Conditioned</span>
            </div>
            <a href="#booking" className="venue-btn-primary btn-interact">
              <Icon name="calendar_month" size={20} />
              Check Availability
            </a>
            <a
              href={business.messengerUrl}
              target="_blank" rel="noopener noreferrer"
              className="venue-btn-messenger btn-interact"
            >
              <span className="v-mssgr-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.503 3.734 7.202.195.145.313.376.313.626l-.004 2.215c-.004.57.587.973 1.11.75l2.47-1.054a1.001 1.001 0 01.764-.02c.516.16 1.06.245 1.613.245 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm.8 11.6l-1.9-2.02-3.7 2.02 4.07-4.32 1.9 2.02 3.7-2.02-4.07 4.32z" />
                </svg>
              </span>
              Ask via Messenger
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: OVERVIEW
          ═══════════════════════════════════════════════════════ */}
      <section className="venue-overview">
        <div className="container">
          <div className="venue-overview-grid">
            <div className="venue-overview-text">
              <span className="venue-section-tag">
                <svg className="vtag-leaf" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                </svg>
                About the Space
              </span>
              <h2 className="venue-section-title">A Space for Every Celebration</h2>
              <p className="venue-overview-body">
                Located in the heart of Trapiche, Oton, our event hall is designed
                for comfort and flexibility. Whether you are hosting an intimate
                birthday dinner, a corporate seminar, or a family reunion, the
                Triology Event Hall provides a clean, modern space with all the
                essentials.
              </p>
              <p className="venue-overview-body">
                We offer two flexible arrangements: rent the space on its own and
                bring your own food, or let us handle everything with our in-house
                catering service. Whichever you choose, our team ensures your
                event runs smoothly from start to finish.
              </p>
              <div className="venue-booking-note">
                <Icon name="info" size={20} />
                <span>{venue.bookingNote}</span>
              </div>
            </div>
            <div className="venue-overview-quickfacts">
              <div className="venue-quickfact-card">
                <span className="venue-quickfact-number">{venue.capacity}</span>
                <span className="venue-quickfact-label">Max Guests</span>
              </div>
              <div className="venue-quickfact-card">
                <span className="venue-quickfact-number">8AM</span>
                <span className="venue-quickfact-label">Open</span>
              </div>
              <div className="venue-quickfact-card">
                <span className="venue-quickfact-number">8PM</span>
                <span className="venue-quickfact-label">Close</span>
              </div>
              <div className="venue-quickfact-card">
                <span className="venue-quickfact-number">Included</span>
                <span className="venue-quickfact-label">Catering</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: PRICING
          ═══════════════════════════════════════════════════════ */}
      <section className="venue-pricing" id="pricing">
        <div className="container">
          <div className="venue-section-header venue-section-header--center">
            <span className="venue-section-tag">Pricing</span>
            <h2 className="venue-section-title">Choose Your Arrangement</h2>
            <p className="venue-section-subtitle">
              Two simple ways to book the venue. No hidden fees, no surprises.
            </p>
          </div>
          <div className="venue-pricing-panel">
            {Object.values(venue.pricing).map((tier, i) => (
              <div
                key={tier.label}
                className={`venue-pricing-half${i === 1 ? ' venue-pricing-half--featured' : ''}`}
              >
                {i === 1 && (
                  <span className="venue-pricing-badge">
                    <Icon name="star" size={14} />
                    Recommended
                  </span>
                )}
                <div className="venue-pricing-label">{tier.label}</div>
                <div className="venue-pricing-price">{tier.price}</div>
                <p className="venue-pricing-desc">{tier.description}</p>
              </div>
            ))}
            {/* Vertical divider between the two halves */}
            <div className="venue-pricing-divider" />
          </div>

          {/* ─── Single CTA button ────────────────────────── */}
          <div className="venue-pricing-actions">
            <a href="#booking" className="venue-pricing-action-btn btn-interact">
              <Icon name="calendar_month" size={18} />
              Check Availability &amp; Book
            </a>
          </div>

          <p className="venue-pricing-footnote">
            Prices are subject to change. Contact us for a personalized quote.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: AMENITIES
          ═══════════════════════════════════════════════════════ */}
      <section className="venue-amenities">
        <div className="container">
          <div className="venue-section-header venue-section-header--center">
            <span className="venue-section-tag">Amenities</span>
            <h2 className="venue-section-title">Everything You Need</h2>
            <p className="venue-section-subtitle">
              We provide the essentials so you can focus on your event.
            </p>
          </div>
          <div className="venue-amenities-grid">
            {venue.amenities.map((a) => (
              <div key={a.icon} className="venue-amenity-card">
                <div className="venue-amenity-icon">
                  <Icon name={a.icon} size={26} />
                </div>
                <h4 className="venue-amenity-title">{a.title}</h4>
                <p className="venue-amenity-desc">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5: PHOTO GALLERY
          ═══════════════════════════════════════════════════════ */}
      <section className="venue-gallery">
        <div className="container">
          <div className="venue-section-header venue-section-header--center">
            <span className="venue-section-tag">Gallery</span>
            <h2 className="venue-section-title">See the Space</h2>
            <p className="venue-section-subtitle">
              Photos of our event hall and setup options.
            </p>
          </div>
          <div className="venue-gallery-grid">
            {venue.gallery.map((src, idx) => (
              <div
                key={idx}
                className={`venue-gallery-item${idx === 0 ? ' venue-gallery-featured' : ''}`}
                onClick={() => setSelectedImage(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(idx)}
              >
                <img src={src} alt={`Venue photo ${idx + 1}`} loading="lazy" />
                <div className="venue-gallery-overlay">
                  <Icon name="zoom_in" size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Lightbox ──────────────────────────────────────── */}
      {selectedImage !== null && (
        <div className="venue-lightbox" onClick={() => setSelectedImage(null)} role="presentation">
          <button
            className="venue-lightbox-close"
            onClick={() => setSelectedImage(null)}
            aria-label="Close gallery"
            ref={closeRef}
          >
            <Icon name="close" size={28} />
          </button>
          <button
            className={`venue-lightbox-nav venue-lightbox-prev${selectedImage === 0 ? ' venue-lightbox-hidden' : ''}`}
            onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => Math.max(0, prev - 1)); }}
            aria-label="Previous image"
          >
            <Icon name="chevron_left" size={36} />
          </button>
          <img
            src={venue.gallery[selectedImage]}
            alt={`Venue photo ${selectedImage + 1}`}
            className="venue-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className={`venue-lightbox-nav venue-lightbox-next${selectedImage === venue.gallery.length - 1 ? ' venue-lightbox-hidden' : ''}`}
            onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => Math.min(venue.gallery.length - 1, prev + 1)); }}
            aria-label="Next image"
          >
            <Icon name="chevron_right" size={36} />
          </button>
          <div className="venue-lightbox-counter">
            {selectedImage + 1} / {venue.gallery.length}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 6: BOOKING
          ═══════════════════════════════════════════════════════ */}
      <section className="venue-booking" id="booking">
        <div className="container">
          <div className="venue-booking-layout">
            <div className="venue-booking-info">
              <span className="venue-section-tag">
                <svg className="vtag-leaf" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                </svg>
                Book Now
              </span>
              <h2 className="venue-section-title">Reserve the Venue</h2>
              <p className="venue-section-subtitle">
                Tell us your details and we will respond on Messenger within 1 hour.
              </p>
              <div className="venue-booking-contacts">
                <div className="venue-booking-contact-item">
                  <div className="venue-booking-contact-circle">
                    <Icon name="call" size={20} />
                  </div>
                  <div>
                    <h4>Call Us</h4>
                    <a href={`tel:${business.phone.replace(/\s/g, '')}`}>{business.phone}</a>
                  </div>
                </div>
                <div className="venue-booking-contact-item">
                  <div className="venue-booking-contact-circle">
                    <Icon name="mail" size={20} />
                  </div>
                  <div>
                    <h4>Email</h4>
                    <a href={`mailto:${business.email}`}>{business.email}</a>
                  </div>
                </div>
                <div className="venue-booking-contact-item">
                  <div className="venue-booking-contact-circle venue-booking-contact-circle--messenger">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.503 3.734 7.202.195.145.313.376.313.626l-.004 2.215c-.004.57.587.973 1.11.75l2.47-1.054a1.001 1.001 0 01.764-.02c.516.16 1.06.245 1.613.245 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm.8 11.6l-1.9-2.02-3.7 2.02 4.07-4.32 1.9 2.02 3.7-2.02-4.07 4.32z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Messenger</h4>
                    <a href={business.messengerUrl} target="_blank" rel="noopener noreferrer">
                      m.me/triologyrefreshment
                    </a>
                  </div>
                </div>
              </div>

              {/* ─── "What's Included" perks card ─── */}
              <div className="venue-booking-perks">
                <div className="venue-perks-header">
                  <Icon name="checklist" size={22} />
                  <span>What&rsquo;s Included</span>
                </div>
                <div className="venue-perks-grid">
                  <div className="venue-perk-chip">
                    <Icon name="ac_unit" size={16} />
                    <span>Air-conditioned</span>
                  </div>
                  <div className="venue-perk-chip">
                    <Icon name="chair" size={16} />
                    <span>Tables &amp; chairs</span>
                  </div>
                  <div className="venue-perk-chip">
                    <Icon name="wifi" size={16} />
                    <span>Free high-speed WiFi</span>
                  </div>
                  <div className="venue-perk-chip">
                    <Icon name="surround_sound" size={16} />
                    <span>Bluetooth sound system</span>
                  </div>
                  <div className="venue-perk-chip">
                    <Icon name="local_parking" size={16} />
                    <span>Free on-site parking</span>
                  </div>
                  <div className="venue-perk-chip">
                    <Icon name="cleaning_services" size={16} />
                    <span>Post-event clean-up</span>
                  </div>
                </div>
                <div className="venue-perks-footer">
                  <Icon name="history" size={16} />
                  <span>We respond within <strong>1 hour</strong></span>
                </div>
              </div>
            </div>

            <div className="venue-booking-form">
              <VenueBookingForm
                messengerUrl={business.messengerUrl}
                title="Book Your Event"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 7: LOCATION
          ═══════════════════════════════════════════════════════ */}
      <section className="venue-location">
        <div className="container">
          <div className="venue-location-layout">
            <div className="venue-location-map">
              <div className="venue-map-wrapper">
                <iframe
                  title="Triology Refreshment location in Trapiche, Oton, Iloilo"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=122.467%2C10.687%2C122.479%2C10.699&layer=nik&marker=10.693%2C122.473"
                  style={{ border: 0, width: '100%', height: '100%', borderRadius: 'var(--radius-xl)' }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="venue-location-info">
              <span className="venue-section-tag">Find Us</span>
              <h2 className="venue-section-title">Visit Triology</h2>
              <p className="venue-location-intro">
                Drop by our shop in Trapiche. We are open daily from 8AM to 8PM.
              </p>
              <div className="venue-location-details">
                <div className="venue-location-line">
                  <span className="venue-location-line-icon">
                    <Icon name="location_on" size={20} />
                  </span>
                  <span>{business.address.full}</span>
                </div>
                <div className="venue-location-line">
                  <span className="venue-location-line-icon">
                    <Icon name="schedule" size={20} />
                  </span>
                  <span>{business.hours}</span>
                </div>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(business.address.full)}`}
                target="_blank" rel="noopener noreferrer"
                className="venue-btn-outline btn-interact"
              >
                <Icon name="map" size={18} />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          RESPONSIVE STYLES
          ═══════════════════════════════════════════════════════ */}
      <style>{`
        /* ═══════════════════════════════════════════════════════
           HERO
           ═══════════════════════════════════════════════════════ */
        .venue-hero {
          position: relative;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .venue-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .venue-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(5, 100, 2, 0.55) 0%,
            rgba(0, 0, 0, 0.55) 60%,
            rgba(0, 0, 0, 0.4) 100%
          );
          z-index: 10;
        }
        .venue-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .venue-hero-content {
          position: relative;
          z-index: 20;
          text-align: center;
          padding: 3rem 1.5rem;
          max-width: 720px;
        }
        .venue-hero-badge {
          display: inline-block;
          padding: 0.375rem 1rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.25rem;
        }
        .venue-hero-title {
          font-family: 'Okinawa', cursive;
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 400;
          color: #fff;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .venue-hero-desc {
          font-size: 1.0625rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.9);
          max-width: 560px;
          margin: 0 auto 2rem;
        }
        .venue-hero-items {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          width: 100%;
          max-width: 500px;
          margin: 0 auto 2rem;
        }
        .venue-hero-stat {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.92);
          font-size: 0.9375rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          backdrop-filter: blur(4px);
        }
        .venue-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          background: var(--color-secondary);
          color: var(--color-on-secondary);
          border-radius: var(--radius-xl);
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(251, 192, 2, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .venue-btn-primary:hover {
          box-shadow: 0 6px 20px rgba(251, 192, 2, 0.45);
        }
        .venue-btn-messenger {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          background: #1877F2;
          color: #fff;
          border-radius: var(--radius-xl);
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(24, 119, 242, 0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .venue-btn-messenger:hover {
          background: #155dc0;
          box-shadow: 0 6px 20px rgba(24, 119, 242, 0.4);
        }
        .v-mssgr-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, 0.18);
          border-radius: var(--radius-full);
          transition: transform 0.2s ease, background 0.2s ease;
          flex-shrink: 0;
        }
        .venue-btn-messenger:hover .v-mssgr-icon {
          transform: scale(1.12);
          background: rgba(255, 255, 255, 0.28);
        }
        .venue-hero-items .venue-btn-primary,
        .venue-hero-items .venue-btn-messenger {
          width: 100%;
          justify-content: center;
        }
        .venue-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--color-primary);
          color: var(--color-primary);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .venue-btn-outline:hover {
          background: var(--color-primary);
          color: var(--color-on-primary);
        }

        /* ─── Floating Decor (hero only) ─────────────────── */
        .vdecor {
          position: absolute;
          inset: 0;
          z-index: 15;
          pointer-events: none;
          overflow: hidden;
        }
        .vdecor svg {
          position: absolute;
          opacity: 0.35;
        }
        .vdecor-leaf1 {
          top: 2.5rem;
          right: 2.5rem;
          width: 32px;
          height: 32px;
          color: var(--color-secondary);
          animation: vdecor-drift 5s ease-in-out infinite;
        }
        .vdecor-leaf2 {
          bottom: 2.5rem;
          left: 2.5rem;
          width: 26px;
          height: 26px;
          color: rgba(255, 255, 255, 0.5);
          animation: vdecor-bob 4.5s ease-in-out infinite;
        }
        .vdecor-sparkle {
          top: 50%;
          right: 4rem;
          width: 22px;
          height: 22px;
          color: var(--color-secondary);
          animation: vdecor-twinkle 3s ease-in-out infinite;
        }

        @keyframes vdecor-drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50%      { transform: translate(-8px, 10px) rotate(8deg); }
        }
        @keyframes vdecor-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes vdecor-twinkle {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.7; transform: scale(1.2); }
        }

        /* ═══════════════════════════════════════════════════════
           SECTION COMMON
           ═══════════════════════════════════════════════════════ */
        .venue-section-tag {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--color-secondary);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
        }
        .vtag-leaf {
          color: var(--color-secondary);
          opacity: 0.7;
        }
        .venue-section-title {
          font-family: var(--font-headline);
          font-size: clamp(1.625rem, 3vw, 2.25rem);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
          line-height: 1.25;
        }
        .venue-section-subtitle {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-on-surface-variant);
          max-width: 560px;
          margin-bottom: 0.5rem;
        }
        .venue-section-header {
          margin-bottom: 2.5rem;
        }
        .venue-section-header--center {
          text-align: center;
        }
        .venue-section-header--center .venue-section-subtitle {
          margin: 0 auto;
        }
        .venue-section-header--center .venue-section-tag {
          justify-content: center;
        }

        /* ═══════════════════════════════════════════════════════
           OVERVIEW
           ═══════════════════════════════════════════════════════ */
        .venue-overview {
          padding: 3rem 0;
          background: var(--color-surface-container-low);
        }
        .venue-overview-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        .venue-overview-body {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-on-surface-variant);
          margin-bottom: 1.25rem;
        }
        .venue-booking-note {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.75rem 1rem;
          border-left: 3px solid var(--color-secondary);
          background: color-mix(in srgb, var(--color-primary) 6%, transparent);
          border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-primary);
        }
        .venue-overview-quickfacts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.875rem;
        }
        .venue-quickfact-card {
          background: var(--color-surface-container-lowest);
          padding: 1.5rem 1rem;
          border-radius: var(--radius-xl);
          text-align: center;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-outline-variant);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .venue-quickfact-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        .venue-quickfact-number {
          display: block;
          font-family: var(--font-headline);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.25rem;
        }
        .venue-quickfact-label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--color-on-surface-variant);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ═══════════════════════════════════════════════════════
           PRICING
           ═══════════════════════════════════════════════════════ */
        .venue-pricing {
          padding: 3rem 0;
          background: var(--color-surface-container-lowest);
          position: relative;
        }
        .venue-pricing-panel {
          display: flex;
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-2xl);
          overflow: hidden;
          background: var(--color-surface-container-low);
        }
        .venue-pricing-half {
          flex: 1;
          position: relative;
          padding: 2.5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: background 0.3s ease;
        }
        .venue-pricing-half:hover {
          background: color-mix(in srgb, var(--color-primary) 4%, transparent);
        }
        .venue-pricing-half--featured {
          background: color-mix(in srgb, var(--color-secondary) 6%, var(--color-surface-container-low));
        }
        .venue-pricing-half--featured:hover {
          background: color-mix(in srgb, var(--color-secondary) 10%, var(--color-surface-container-low));
        }
        .venue-pricing-divider {
          position: absolute;
          top: 2rem;
          bottom: 2rem;
          left: 50%;
          width: 1px;
          background: var(--color-outline-variant);
          flex-shrink: 0;
        }
        .venue-pricing-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          margin-bottom: 1rem;
          padding: 0.25rem 1rem;
          background: var(--color-secondary);
          color: var(--color-on-secondary);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          box-shadow: var(--shadow-sm);
        }
        .venue-pricing-label {
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
        }
        .venue-pricing-price {
          font-family: var(--font-headline);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-on-surface);
          margin-bottom: 1rem;
        }
        .venue-pricing-desc {
          font-size: 0.9375rem;
          line-height: 1.55;
          color: var(--color-on-surface-variant);
          max-width: 280px;
        }
        .venue-pricing-actions {
          max-width: 800px;
          margin: 1.5rem auto 0;
          text-align: center;
        }
        .venue-pricing-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 1rem 1.5rem;
          background: var(--color-secondary);
          color: var(--color-on-secondary);
          font-size: 0.9375rem;
          font-weight: 700;
          text-decoration: none;
          border-radius: var(--radius-xl);
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 14px rgba(251, 192, 2, 0.3);
        }
        .venue-pricing-action-btn:hover {
          background: color-mix(in srgb, var(--color-secondary) 80%, #000);
          box-shadow: 0 6px 20px rgba(251, 192, 2, 0.4);
        }
        .venue-pricing-footnote {
          text-align: center;
          font-size: 0.8125rem;
          color: var(--color-outline);
          margin-top: 2rem;
        }

        /* ═══════════════════════════════════════════════════════
           AMENITIES
           ═══════════════════════════════════════════════════════ */
        .venue-amenities {
          padding: 3rem 0;
          background: var(--color-surface);
        }
        .venue-amenities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .venue-amenity-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.75rem;
          padding: 1.5rem 1rem;
          background: var(--color-surface-container-lowest);
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-outline-variant);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .venue-amenity-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: color-mix(in srgb, var(--color-primary) 30%, var(--color-outline-variant));
        }
        .venue-amenity-icon {
          width: 52px;
          height: 52px;
          background: color-mix(in srgb, var(--color-primary) 10%, transparent);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .venue-amenity-card:hover .venue-amenity-icon {
          background: color-mix(in srgb, var(--color-primary) 18%, transparent);
          transform: scale(1.08);
        }
        .venue-amenity-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-on-surface);
        }
        .venue-amenity-desc {
          font-size: 0.8125rem;
          color: var(--color-on-surface-variant);
          opacity: 0.8;
          max-width: 160px;
          margin: 0 auto;
        }

        /* ═══════════════════════════════════════════════════════
           GALLERY
           ═══════════════════════════════════════════════════════ */
        .venue-gallery {
          padding: 3rem 0;
          background: var(--color-surface-container-low);
        }
        .venue-gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        .venue-gallery-item {
          border-radius: var(--radius-xl);
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 1;
          position: relative;
          transition: transform 0.3s ease;
        }
        .venue-gallery-item:hover {
          transform: scale(1.03);
        }
        .venue-gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .venue-gallery-item:hover img {
          transform: scale(1.06);
        }
        .venue-gallery-featured {
          grid-row: span 2;
          aspect-ratio: auto;
        }
        .venue-gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: background 0.3s ease;
        }
        .venue-gallery-overlay svg {
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .venue-gallery-item:hover .venue-gallery-overlay {
          background: rgba(0, 0, 0, 0.35);
        }
        .venue-gallery-item:hover .venue-gallery-overlay svg {
          opacity: 1;
          transform: scale(1);
        }

        /* ═══════════════════════════════════════════════════════
           LIGHTBOX
           ═══════════════════════════════════════════════════════ */
        .venue-lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 2rem;
          animation: venue-lb-fade 0.2s ease-out;
        }
        @keyframes venue-lb-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .venue-lightbox-img {
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          border-radius: var(--radius-lg);
          cursor: default;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
        }
        .venue-lightbox-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          width: 46px;
          height: 46px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .venue-lightbox-close:hover {
          background: rgba(0, 0, 0, 0.55);
          transform: scale(1.06);
        }
        .venue-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          width: 52px;
          height: 52px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background 0.2s ease;
        }
        .venue-lightbox-nav:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .venue-lightbox-prev { left: 0.75rem; }
        .venue-lightbox-next { right: 0.75rem; }
        .venue-lightbox-hidden { opacity: 0; pointer-events: none; }
        .venue-lightbox-counter {
          position: absolute;
          bottom: 1.25rem;
          right: 1.25rem;
          left: auto;
          transform: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8125rem;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(6px);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
        }

        /* ═══════════════════════════════════════════════════════
           BOOKING
           ═══════════════════════════════════════════════════════ */
        .venue-booking {
          padding: 3rem 0;
          background: var(--color-surface-container-lowest);
        }
        .venue-booking-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        .venue-booking-contacts {
          margin-top: 2rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .venue-booking-contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .venue-booking-contact-item h4 {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-on-surface-variant);
          margin-bottom: 0.125rem;
        }
        .venue-booking-contact-item a {
          font-size: 0.9375rem;
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 500;
        }
        .venue-booking-contact-item a:hover {
          text-decoration: underline;
        }
        .venue-booking-contact-circle {
          width: 48px;
          height: 48px;
          background: color-mix(in srgb, var(--color-primary) 10%, transparent);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--color-primary);
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .venue-booking-contact-item:hover .venue-booking-contact-circle {
          background: color-mix(in srgb, var(--color-primary) 18%, transparent);
          transform: scale(1.05);
        }
        .venue-booking-contact-circle--messenger {
          background: rgba(24, 119, 242, 0.1);
        }
        .venue-booking-contact-item:hover .venue-booking-contact-circle--messenger {
          background: rgba(24, 119, 242, 0.18);
        }

        /* ─── "What's Included" perks card ─────────────────── */
        .venue-booking-perks {
          background: color-mix(in srgb, var(--color-primary) 5%, var(--color-surface-container-lowest));
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
        }
        .venue-perks-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-headline);
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 1rem;
        }
        .venue-perks-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .venue-perk-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: var(--color-surface-container-lowest);
          border-radius: var(--radius-lg);
          border: 1px solid color-mix(in srgb, var(--color-primary) 12%, var(--color-outline-variant));
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-on-surface);
          transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
        }
        .venue-perk-chip:hover {
          background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface-container-lowest));
          border-color: var(--color-primary);
          transform: translateY(-1px);
        }
        .venue-perk-chip .material-symbols-outlined {
          font-size: 16px;
          color: var(--color-primary);
          flex-shrink: 0;
        }
        .venue-perks-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: var(--color-on-surface-variant);
          padding-top: 0.75rem;
          border-top: 1px dashed var(--color-outline-variant);
        }
        .venue-perks-footer .material-symbols-outlined {
          color: var(--color-secondary);
          font-size: 16px;
        }

        /* ═══════════════════════════════════════════════════════
           LOCATION
           ═══════════════════════════════════════════════════════ */
        .venue-location {
          padding: 3rem 0;
          background: var(--color-surface-container-low);
        }
        .venue-location-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }
        .venue-location-map {
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          display: flex;
        }
        .venue-map-wrapper {
          width: 100%;
          min-height: 280px;
          aspect-ratio: 4 / 3;
        }
        .venue-map-wrapper iframe {
          display: block;
        }
        .venue-location-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .venue-location-intro {
          font-size: 0.9375rem;
          color: var(--color-on-surface-variant);
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }
        .venue-location-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .venue-location-line {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9375rem;
          color: var(--color-on-surface-variant);
          line-height: 1.4;
        }
        .venue-location-line-icon {
          width: 40px;
          height: 40px;
          background: color-mix(in srgb, var(--color-primary) 10%, transparent);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--color-primary);
        }

        /* ═══════════════════════════════════════════════════════
           TABLET (640px+)
           ═══════════════════════════════════════════════════════ */
        @media (min-width: 640px) {
          .venue-amenities-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .venue-gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .venue-pricing-panel {
            flex-direction: row;
          }
          .venue-pricing-divider {
            position: absolute;
            width: 1px;
            height: auto;
            margin: 0;
          }
        }

        /* ═══════════════════════════════════════════════════════
           TABLET LARGE / DESKTOP (768px+)
           ═══════════════════════════════════════════════════════ */
        @media (min-width: 768px) {
          .venue-hero { min-height: 500px; }
          .venue-hero-title { font-size: clamp(3rem, 5vw, 4rem); }
          .venue-hero-badge { margin-bottom: 1.5rem; }

          .venue-overview { padding: 5rem 0; }
          .venue-overview-grid {
            grid-template-columns: 3fr 2fr;
            gap: 3rem;
          }
          .venue-overview-body { font-size: 1.0625rem; }

          .venue-pricing { padding: 5rem 0; }
          .venue-pricing-half { padding: 3rem 2.5rem; }
          .venue-pricing-divider { top: 2.5rem; bottom: 2.5rem; }
          .venue-pricing-action-btn { width: auto; }

          .venue-amenities { padding: 5rem 0; }
          .venue-amenities-grid { grid-template-columns: repeat(4, 1fr); }
          .venue-amenity-card { padding: 2rem 1.25rem; }

          .venue-gallery { padding: 5rem 0; }
          .venue-gallery-grid { grid-template-columns: repeat(4, 1fr); }
          .venue-gallery-featured {
            grid-row: span 1;
            aspect-ratio: 1;
          }

          .venue-booking { padding: 5rem 0; }
          .venue-booking-layout {
            grid-template-columns: 1fr 1.2fr;
            gap: 3rem;
          }

          .venue-location { padding: 5rem 0; }
          .venue-location-layout {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
          .venue-map-wrapper { min-height: 320px; aspect-ratio: 16 / 9; }

          .venue-section-header { margin-bottom: 3rem; }

          .venue-lightbox-prev { left: 1.5rem; }
          .venue-lightbox-next { right: 1.5rem; }
          .venue-lightbox-close { top: 1.5rem; right: 1.5rem; }
        }

        /* ═══════════════════════════════════════════════════════
           DESKTOP LARGE (1024px+)
           ═══════════════════════════════════════════════════════ */
        @media (min-width: 1024px) {
          .venue-amenities-grid { gap: 1.25rem; }
          .venue-gallery-grid { gap: 1rem; }
        }

        /* ═══════════════════════════════════════════════════════
           MOBILE ONLY (under 768px)
           ═══════════════════════════════════════════════════════ */
        @media (max-width: 767px) {
          .venue-hero { min-height: 440px; }
          .venue-hero-stat {
            font-size: 0.8125rem;
            padding: 0.375rem 0.875rem;
          }

          .vdecor-leaf1 { top: 1rem; right: 1rem; width: 24px; height: 24px; }
          .vdecor-leaf2 { display: none; }
          .vdecor-sparkle { display: none; }

          .venue-gallery-featured { grid-row: span 1; }
          .venue-quickfact-card { padding: 1.25rem 0.75rem; }
          .venue-quickfact-number { font-size: 1.5rem; }

          .venue-map-wrapper { min-height: 220px; }

          /* Stack pricing panel vertically on small mobile */
          .venue-pricing-panel {
            flex-direction: column;
          }
          .venue-pricing-divider {
            position: static;
            width: auto;
            height: 1px;
            margin: 0 2rem;
          }
        }
      `}</style>
    </main>
  );
}
