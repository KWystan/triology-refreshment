/**
 * Combo Meals page — masonry layout showcasing combo meal bundles with 4 card variants.
 *
 * Sections:
 *   1. Hero — dot pattern overlay, headline, CTA buttons, hero image with glow + price card
 *   2. Combo Meals — all 7 combo bundle deals with images, itemized lists, and pricing
 *   3. Full Menu — all menu categories with items, prices, descriptions (side dishes, meals, snacks)
 *   4. Add-ons — halo-halo, fries, puto, hot soups as optional extras
 *   5. Contact — Messenger chat button + quick quote form
 *   6. Trust Bar — word badges with grayscale → full color on hover
 */
import { useState, useEffect } from 'react';
import { bundles as bundlesStatic } from '../data/bundles';
import { business as businessStatic } from '../data/business';
import { fetchBundles, fetchBusiness } from '../lib/contentApi';
import handaanImg from '../handaan.jpg';

const CARD_VARIANTS = {
  'classic-triple-feast': 'image-dominant',
  'grand-family-reunion': 'image-dominant',
  'mix-match-share-5': 'image-caption',
  'barkada-combo-share-8': 'image-caption',
  'family-combo-10': 'image-caption',
  'family-combo-12': 'image-caption',
  'family-meal-15': 'featured',
};

const PLACEHOLDER_CONFIG = {
  'mix-match-share-5': { icon: 'lunch_dining', ratio: '4 / 5' },
  'barkada-combo-share-8': { icon: 'diversity_3', ratio: '1 / 1' },
  'family-combo-10': { icon: 'cake', ratio: '3 / 4' },
  'family-combo-12': { icon: 'icecream', ratio: '4 / 5' },
};

function getCardVariant(bundleId) {
  return CARD_VARIANTS[bundleId] || 'image-caption';
}

function getPlaceholder(bundleId) {
  return PLACEHOLDER_CONFIG[bundleId] || { icon: 'restaurant_menu', ratio: '4 / 5' };
}

export default function PartyPacks() {
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'submitting' | 'submitted'
  const [liveBundles, setLiveBundles] = useState(bundlesStatic);
  const [liveBusiness, setLiveBusiness] = useState(businessStatic);

  // Fetch bundles + business from the API
  useEffect(() => {
    (async () => {
      try {
        const bundlesRes = await fetchBundles();
        if (bundlesRes?.data?.bundles) setLiveBundles(bundlesRes.data.bundles);
      } catch (err) {
        console.warn('[ComboMeals] Bundles API unavailable, using static fallback:', err.message);
      }
      try {
        const busRes = await fetchBusiness();
        if (busRes?.data) setLiveBusiness(busRes.data);
      } catch (err) {
        console.warn('[ComboMeals] Business API unavailable, using static fallback:', err.message);
      }
    })();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('submitted');
      setTimeout(() => {
        setFormStatus('idle');
        e.target.reset();
      }, 2500);
    }, 1000);
  };
  return (
    <main>
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="party-hero">
        {/* Dot pattern overlay */}
        <div className="party-dot-pattern" />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="party-hero-grid">
            {/* Left: text */}
            <div className="party-hero-text">
              <span className="party-hero-badge">
                Best for Large Gatherings
              </span>

              <h1 className="party-hero-headline">
                Celebrate with our{' '}
                <span className="party-hero-accent">
                  Combo Meals
                </span>
              </h1>

              <p className="party-hero-desc">
                Whether it&rsquo;s a birthday, office reunion, or family feast,
                our authentic Ilonggo party bilao packs bring warmth and flavor
                to your celebration.
              </p>

              <div className="party-hero-cta">
                <a href="#combos" className="party-btn-primary btn-interact">
                  Explore Bundles
                </a>
                <a href="#contact" className="party-btn-outline btn-interact">
                  Contact for Custom Quote
                </a>
              </div>
            </div>

            {/* Right: hero image with glow */}
            <div className="party-hero-visual">
              <div className="party-hero-img-group">
                {/* Glow */}
                <div className="party-hero-glow" />
                <img
                  src={handaanImg}
                  alt="Triology Combo Meals"
                  className="party-hero-img"
                />
                {/* Price card */}
                <div className="party-hero-price">
                  <span className="party-price-amount">₱1,200</span>
                  <span className="party-price-label">
                    Starting price per bilao
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          COMBO MEALS — masonry layout, 4 card variants
          ═══════════════════════════════════════════════════════ */}
      <section className="party-combos" id="combos">
        <div className="container">
          <div className="party-section-header">
            <span className="party-section-tag">Combo Meals</span>
            <h2 className="party-section-title">Our Combo Meal Bundles</h2>
            <p className="party-section-desc">
              Perfect for group lunches, barkada outings, and family celebrations &mdash;
              freshly prepared and ready to share.
            </p>
          </div>

          {liveBundles.length === 0 ? (
            <div className="party-combo-empty">
              <p>No combo meals available right now. Contact us for a custom quote.</p>
              <a href={liveBusiness.messengerUrl} target="_blank" rel="noopener noreferrer" className="party-btn-primary btn-interact">
                Message us on Messenger
              </a>
            </div>
          ) : (
            <div className="party-combo-masonry">
              {liveBundles.map((bundle) => {
                const variant = getCardVariant(bundle.id);
                const placeholder = getPlaceholder(bundle.id);
                const isFeatured = variant === 'featured';
                const isImageDominant = variant === 'image-dominant';
                const isImageCaption = variant === 'image-caption';

                return (
                  <div
                    key={bundle.id}
                    className={`party-combo-card${isFeatured ? ' party-combo-card--featured' : ''}`}
                  >
                    {/* ─── IMAGE-DOMINANT: real image at intrinsic ratio ─── */}
                    {isImageDominant && bundle.image && (
                      <div className="party-combo-img-wrap">
                        <img
                          src={bundle.image}
                          alt={bundle.name}
                          loading={bundle.id === 'classic-triple-feast' ? 'eager' : 'lazy'}
                          className="party-combo-img"
                          onError={(e) => {
                            e.currentTarget.classList.add('party-combo-img--error');
                          }}
                        />
                        <div className="party-combo-img-fallback">
                          <span className="material-symbols-outlined">restaurant_menu</span>
                        </div>
                        {bundle.badge && (
                          <span className="party-combo-badge party-combo-badge--overlay">{bundle.badge}</span>
                        )}
                      </div>
                    )}

                    {/* ─── IMAGE-CAPTION: stylized placeholder ─── */}
                    {isImageCaption && (
                      <div
                        className="party-combo-placeholder"
                        style={{ aspectRatio: placeholder.ratio }}
                      >
                        <div className="party-combo-placeholder-bg" />
                        <span className="party-combo-placeholder-icon material-symbols-outlined">
                          {placeholder.icon}
                        </span>
                        <div className="party-combo-placeholder-shine" />
                      </div>
                    )}

                    {/* ─── FEATURED: full-width hero card ─── */}
                    {isFeatured && (
                      <div className="party-combo-featured-bg">
                        <div className="party-featured-shine" />
                        <div className="party-featured-flag">
                          <span className="party-featured-flag-icon">★</span>
                          FLAGSHIP OFFER
                        </div>
                        <div className="party-featured-content">
                          <h3 className="party-combo-name party-featured-name">{bundle.name}</h3>
                          <p className="party-combo-featured-desc">{bundle.description}</p>
                          {bundle.items && (
                            <div className="party-featured-items">
                              {bundle.items.map((item, i) => (
                                <div key={i} className="party-featured-item">
                                  <span className="material-symbols-outlined party-featured-check">check_circle</span>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="party-featured-meta">
                            <span className="party-combo-serves" style={{ color: 'rgba(255,255,255,0.85)' }}>
                              <span className="material-symbols-outlined party-combo-people-icon">groups</span>
                              Serves {bundle.serves}
                            </span>
                          </div>
                          {bundle.badge && (
                            <span className="party-combo-badge" style={{ background: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}>{bundle.badge}</span>
                          )}
                          <div className="party-featured-price-card">
                            <span className="party-featured-price-amount">₱{bundle.startingPrice?.toLocaleString()}</span>
                            <span className="party-featured-price-label">Best value per pax</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ─── BODY CONTENT — shared for variant cards ─── */}
                    {!isFeatured && (
                      <div className="party-combo-body">
                        <div className="party-combo-header">
                          <h3 className="party-combo-name">{bundle.name}</h3>
                          <span className="party-combo-serves">
                            <span className="material-symbols-outlined party-combo-people-icon">groups</span>
                            Serves {bundle.serves}
                          </span>
                        </div>

                        {!isImageDominant && bundle.badge && (
                          <span className="party-combo-badge">{bundle.badge}</span>
                        )}

                        {isImageCaption && bundle.description && (
                          <p className="party-combo-desc">{bundle.description}</p>
                        )}

                        {bundle.items && (
                          <ul className="party-combo-items">
                            {bundle.items.map((item, i) => (
                              <li key={i} className="party-combo-item">
                                <span className="material-symbols-outlined party-combo-check-icon">check_circle</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="party-combo-footer">
                          <span className="party-combo-price">
                            ₱{bundle.startingPrice?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CONTACT — MESSENGER & FORM
          ═══════════════════════════════════════════════════════ */}
      <section id="contact" className="party-contact">
        <div className="container">
          <div className="party-contact-layout">
            <div className="party-contact-header">
              <span className="party-section-tag">Book Now</span>
              <h2 className="party-section-title">Ready to Order?</h2>
              <p className="party-section-desc" style={{ fontSize: '1rem', maxWidth: 480 }}>
                Get a free quote within 30 minutes via Messenger, or send us a message and
                we&rsquo;ll get back to you.
              </p>
            </div>

            <div className="party-contact-card">
              {/* Contact buttons row */}
              <div className="party-contact-btns">
                <a
                  href={liveBusiness.messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="party-messenger-btn btn-interact"
                >
                  <span className="party-mssgr-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.503 3.734 7.202.195.145.313.376.313.626l-.004 2.215c-.004.57.587.973 1.11.75l2.47-1.054a1.001 1.001 0 01.764-.02c.516.16 1.06.245 1.613.245 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm.8 11.6l-1.9-2.02-3.7 2.02 4.07-4.32 1.9 2.02 3.7-2.02-4.07 4.32z" />
                    </svg>
                  </span>
                  Chat on Messenger
                </a>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(liveBusiness.email)}&su=${encodeURIComponent('Party Inquiry - Triology Refreshment')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="party-email-btn btn-interact"
                >
                  <span className="party-email-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>mail</span>
                  </span>
                  Send via Gmail
                </a>
              </div>

              {/* OR divider */}
              <div className="party-or-divider">
                <div className="party-or-line" />
                <span className="party-or-text">OR</span>
                <div className="party-or-line" />
              </div>

              {/* Quick form */}
              <form className="party-form" onSubmit={handleFormSubmit}>
                <div className="party-field">
                  <label className="party-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Juan Dela Cruz"
                    className="party-input"
                    required
                  />
                </div>
                <div className="party-field">
                  <label className="party-label">Event Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    className="party-input"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`party-submit-btn btn-interact${formStatus === 'submitted' ? ' party-submit-btn--sent' : ''}`}
                  disabled={formStatus === 'submitting'}
                >
                  {formStatus === 'idle' && 'Request a Quote'}
                  {formStatus === 'submitting' && 'Sending...'}
                  {formStatus === 'submitted' && 'Quote Requested!'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TRUST BAR
          ═══════════════════════════════════════════════════════ */}
      <section className="party-trust">
        <div className="container">
          <div className="party-trust-inner">
            <span className="party-trust-item party-trust-italic">LOCAL BIZ</span>
            <span className="party-trust-item">ILOILO PRIDE</span>
            <span className="party-trust-item party-trust-wide">FESTIVE</span>
            <span className="party-trust-item party-trust-underline">RELIABLE</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          RESPONSIVE STYLES
          ═══════════════════════════════════════════════════════ */}
      <style>{`
        html { scroll-behavior: smooth; }

        /* ─── Hero Section ──────────────────────────────────── */
        .party-hero {
          position: relative;
          background: var(--color-primary-container);
          overflow: hidden;
          padding: 2.5rem 0;
        }
        @media (min-width: 768px) {
          .party-hero {
            padding: 6rem 0;
          }
        }

        .party-dot-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          background-image: radial-gradient(#ffffff 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .party-hero-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
        }
        @media (min-width: 768px) {
          .party-hero-grid {
            flex-direction: row;
            gap: 3rem;
          }
        }

        .party-hero-text {
          flex: 1;
          text-align: center;
        }
        @media (min-width: 768px) {
          .party-hero-text {
            text-align: left;
          }
        }

        .party-hero-badge {
          display: inline-block;
          background: var(--color-secondary);
          color: var(--color-on-secondary);
          padding: 0.375rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .party-hero-headline {
          font-family: 'Okinawa', cursive;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 400;
          line-height: 1.1;
          color: var(--color-on-primary-container);
          margin-bottom: 1.5rem;
        }

        .party-hero-accent {
          color: var(--color-secondary);
        }

        .party-hero-desc {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--color-on-primary-container);
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 768px) {
          .party-hero-desc {
            margin-left: 0;
            margin-right: 0;
          }
        }

        .party-hero-cta {
          display: flex;
          gap: 0.75rem;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 640px) {
          .party-hero-cta {
            flex-direction: row;
            gap: 1rem;
          }
        }
        @media (min-width: 768px) {
          .party-hero-cta {
            justify-content: flex-start;
          }
        }

        .party-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.875rem 2rem;
          background: var(--color-secondary);
          color: var(--color-on-secondary);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          box-shadow: var(--shadow-lg);
        }

        .party-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.875rem 2rem;
          border: 2px solid var(--color-on-primary-container);
          color: var(--color-on-primary-container);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .party-btn-outline:hover {
          background: var(--color-on-primary-container);
          color: var(--color-primary-container);
        }

        .party-hero-visual {
          flex: 1;
          max-width: 512px;
          width: 100%;
        }
        .party-hero-img-group {
          position: relative;
        }

        .party-hero-glow {
          position: absolute;
          inset: -1rem;
          background: var(--color-secondary);
          border-radius: var(--radius-xl);
          filter: blur(32px);
          opacity: 0.2;
          transition: opacity 0.3s ease;
        }
        .party-hero-img-group:hover .party-hero-glow {
          opacity: 0.4;
        }
        .party-hero-img {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          border-radius: var(--radius-xl);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 4px solid var(--color-surface-container-lowest);
        }

        .party-hero-price {
          position: absolute;
          bottom: -1rem;
          left: 1rem;
          background: var(--color-secondary);
          color: var(--color-on-secondary);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
        }
        @media (min-width: 640px) {
          .party-hero-price {
            bottom: -1.5rem;
            left: -1.5rem;
            padding: 1.5rem;
            border-radius: var(--radius-xl);
          }
        }
        .party-price-amount {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
        }

        .party-price-label {
          display: block;
          font-size: 0.8125rem;
          opacity: 0.8;
          margin-top: 0.25rem;
        }

        /* ─── Combo Meal Card Variants (masonry) ─────────────── */

        /* Image-dominant: natural aspect ratio, no crop */
        .party-combo-img-wrap {
          position: relative;
          margin: -1.5rem -1.5rem 0;
          overflow: hidden;
          background: linear-gradient(135deg, color-mix(in srgb, var(--color-secondary) 25%, var(--color-surface-container-high)) 0%, var(--color-surface-container-high) 100%);
          min-height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .party-combo-img {
          display: block;
          width: 100%;
          height: auto;
          transition: transform 0.5s ease;
        }
        .party-combo-card:hover .party-combo-img {
          transform: scale(1.06);
        }
        .party-combo-img--error {
          display: none;
        }
        .party-combo-img-fallback {
          display: none;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: absolute;
          inset: 0;
        }
        .party-combo-img-fallback .material-symbols-outlined {
          font-size: 64px !important;
          color: var(--color-primary);
          opacity: 0.35;
        }
        .party-combo-img-wrap:has(.party-combo-img--error) .party-combo-img-fallback {
          display: flex;
        }

        /* Badge overlay (image-dominant & featured) */
        .party-combo-badge {
          align-self: flex-start;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.25rem 0.625rem;
          background: var(--color-secondary);
          color: var(--color-on-secondary);
          border-radius: var(--radius-full);
          margin-bottom: 0.75rem;
          display: inline-block;
        }
        .party-combo-badge--overlay {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          margin-bottom: 0;
        }

        /* Image-caption: stylized placeholder (varies per card) */
        .party-combo-placeholder {
          position: relative;
          margin: -1.5rem -1.5rem 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .party-combo-placeholder-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, color-mix(in srgb, var(--color-secondary) 25%, var(--color-surface-container-high)) 0%, var(--color-surface-container-high) 100%);
        }
        .party-combo-placeholder-icon {
          position: relative;
          font-size: 80px !important;
          color: var(--color-primary);
          opacity: 0.3;
          z-index: 1;
        }
        .party-combo-placeholder-shine {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 60%);
          z-index: 2;
          pointer-events: none;
        }

        /* Featured variant: full-width hero card */
        .party-combo-card--featured {
          column-span: all;
          margin-bottom: 1.5rem;
          padding: 0;
          overflow: hidden;
          background: transparent;
          border: none;
        }
        .party-combo-card--featured:hover {
          transform: none;
          box-shadow: none;
        }
        .party-combo-featured-bg {
          position: relative;
          background: linear-gradient(135deg, var(--color-primary-container) 0%, #1a4a32 100%);
          border-radius: var(--radius-xl);
          padding: 1.75rem;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .party-combo-featured-bg {
            padding: 2.5rem;
          }
        }
        .party-featured-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 55%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
          pointer-events: none;
        }
        .party-combo-card--featured:hover .party-featured-shine {
          transform: translateX(100%);
        }
        .party-featured-flag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: 'Okinawa', cursive;
          font-size: 0.875rem;
          color: var(--color-secondary);
          margin-bottom: 0.75rem;
          position: relative;
          z-index: 1;
        }
        .party-featured-flag-icon {
          font-size: 1.25rem;
        }
        .party-featured-content {
          position: relative;
          z-index: 1;
          color: #fff;
        }
        .party-featured-name {
          color: #fff !important;
          font-size: clamp(1.5rem, 4vw, 2.25rem) !important;
          margin-bottom: 0.5rem !important;
        }
        .party-combo-featured-desc {
          font-size: 1.125rem;
          opacity: 0.9;
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }
        .party-featured-items {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        @media (min-width: 768px) {
          .party-featured-items {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .party-featured-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.9);
        }
        .party-featured-check {
          font-size: 1rem !important;
          color: var(--color-secondary) !important;
          flex-shrink: 0;
        }
        .party-featured-meta {
          margin-bottom: 1rem;
        }
        .party-featured-price-card {
          display: inline-flex;
          flex-direction: column;
          background: var(--color-secondary);
          color: var(--color-on-secondary);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }
        .party-featured-price-amount {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .party-featured-price-label {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        @media (max-width: 639px) {
          .party-combo-card--featured {
            column-span: none;
          }
        }

        /* Shared body structure (non-featured cards) */
        .party-combo-body {
          padding: 0;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .party-combo-desc {
          font-size: 0.8125rem;
          line-height: 1.45;
          color: var(--color-on-surface-variant);
          margin: 0 0 0.75rem;
        }

        /* Empty state */
        .party-combo-empty {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--color-on-surface-variant);
        }
        .party-combo-empty p {
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }
        .party-combo-empty .party-btn-primary {
          display: inline-flex;
        }

        /* ─── Section Headers (shared) ────────────────────────── */
        .party-section-header {
          margin-bottom: 2.5rem;
        }

        .party-section-tag {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--color-secondary);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
        }

        .party-section-title {
          font-family: var(--font-headline);
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
        }

        .party-section-desc {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--color-on-surface-variant);
          margin-bottom: 0;
        }


        /* ─── Contact Section ─────────────────────────────────── */
        .party-contact {
          background: var(--color-surface-container-lowest);
          padding: 3rem 0;
        }
        @media (min-width: 768px) {
          .party-contact {
            padding: 5rem 0;
          }
        }

        .party-contact-layout {
          max-width: 520px;
          margin: 0 auto;
          text-align: center;
        }
        .party-contact-layout .party-section-desc {
          margin-left: auto;
          margin-right: auto;
        }

        /* Contact card */
        .party-contact-card {
          background: var(--color-surface-container-lowest);
          padding: 2rem;
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--color-outline-variant);
        }
        @media (min-width: 768px) {
          .party-contact-card {
            padding: 3rem;
          }
        }

        .party-messenger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #0099ff 0%, #1877F2 100%);
          color: #ffffff;
          border-radius: var(--radius-xl);
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(24, 119, 242, 0.35);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .party-messenger-btn:hover {
          box-shadow: 0 6px 20px rgba(24, 119, 242, 0.5);
        }

        .party-mssgr-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.18);
          border-radius: var(--radius-full);
          transition: transform 0.2s ease, background 0.2s ease;
          flex-shrink: 0;
        }
        .party-messenger-btn:hover .party-mssgr-icon {
          transform: scale(1.12);
          background: rgba(255, 255, 255, 0.28);
        }

        .party-contact-btns {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        @media (min-width: 480px) {
          .party-contact-btns {
            flex-direction: row;
          }
        }

        .party-email-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #c5221f 0%, #EA4335 100%);
          color: #ffffff;
          border-radius: var(--radius-xl);
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(234, 67, 53, 0.35);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .party-email-btn:hover {
          box-shadow: 0 6px 20px rgba(234, 67, 53, 0.5);
        }

        .party-email-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.18);
          border-radius: var(--radius-full);
          transition: transform 0.2s ease, background 0.2s ease;
          flex-shrink: 0;
        }
        .party-email-btn:hover .party-email-icon {
          transform: scale(1.12);
          background: rgba(255, 255, 255, 0.28);
        }

        .party-or-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;
        }
        .party-or-line {
          flex: 1;
          height: 1px;
          background: var(--color-outline-variant);
        }
        .party-or-text {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-outline);
        }

        .party-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .party-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .party-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-on-surface-variant);
          text-transform: uppercase;
          margin-left: 0.5rem;
        }

        .party-input {
          width: 100%;
          padding: 1rem;
          background: var(--color-surface);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          color: var(--color-on-surface);
          outline: none;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .party-input:focus {
          border-color: var(--color-primary);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06),
            0 0 0 2px var(--color-primary);
        }

        .party-submit-btn {
          width: 100%;
          padding: 1rem;
          background: var(--color-primary);
          color: var(--color-on-primary);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          box-shadow: var(--shadow-lg);
          transition: background 0.2s ease;
          margin-top: 1rem;
        }
        .party-submit-btn:hover:not(:disabled) {
          background: color-mix(in srgb, var(--color-primary) 80%, #000);
        }
        .party-submit-btn:disabled {
          opacity: 0.8;
          cursor: default;
        }
        .party-submit-btn--sent {
          background: var(--color-secondary) !important;
          color: var(--color-on-secondary) !important;
        }

        /* ─── Trust Bar ─────────────────────────────────────── */
        .party-trust {
          border-top: 1px solid var(--color-outline-variant);
          border-bottom: 1px solid var(--color-outline-variant);
          padding: 3rem 0;
        }

        .party-trust-inner {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          opacity: 0.6;
          filter: grayscale(100%);
          transition: opacity 0.3s ease, filter 0.3s ease;
        }
        @media (min-width: 768px) {
          .party-trust-inner {
            justify-content: space-between;
            gap: 2rem;
          }
        }
        .party-trust-inner:hover {
          opacity: 1;
          filter: grayscale(0%);
        }

        .party-trust-item {
          font-family: var(--font-headline);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-on-surface);
        }

        .party-trust-italic {
          font-style: italic;
        }

        .party-trust-wide {
          letter-spacing: 0.1em;
        }

        .party-trust-underline {
          text-decoration: underline;
          text-decoration-color: var(--color-secondary);
        }


        /* ─── Combo Meals Masonry ─────────────────────────── */
        .party-combos {
          padding: 3rem 0;
          background: var(--color-surface);
        }
        @media (min-width: 768px) {
          .party-combos {
            padding: 5rem 0;
          }
        }

        /* Column-count masonry — 1 → 2 → 3 */
        .party-combo-masonry {
          column-count: 1;
          column-gap: 1.5rem;
          column-fill: balance;
          margin-top: 2.5rem;
        }
        @media (min-width: 640px) {
          .party-combo-masonry {
            column-count: 2;
          }
        }
        @media (min-width: 1024px) {
          .party-combo-masonry {
            column-count: 3;
          }
        }

        .party-combo-card {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          display: inline-block;
          width: 100%;
          background: var(--color-surface-container);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          border: 1px solid var(--color-outline-variant);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .party-combo-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        /* Shared card sub-elements (used by variant cards) */
        .party-combo-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .party-combo-name {
          font-family: var(--font-headline);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-on-surface);
          margin: 0;
          line-height: 1.2;
        }

        .party-combo-serves {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-primary);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .party-combo-people-icon {
          font-size: 0.9375rem !important;
        }

        .party-combo-items {
          list-style: none;
          padding: 0;
          margin: 0 0 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .party-combo-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: var(--color-on-surface-variant);
          line-height: 1.3;
        }

        .party-combo-check-icon {
          font-size: 1rem !important;
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .party-combo-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid var(--color-outline-variant);
        }

        .party-combo-price {
          font-size: 1.25rem;
          font-weight: 800;
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
