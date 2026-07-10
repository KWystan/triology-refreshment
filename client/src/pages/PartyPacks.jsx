/**
 * Party Packs page — matches Stitch "Party Packs | Triology Refreshment" exactly.
 *
 * Sections:
 *   1. Hero — dot pattern overlay, headline, CTA buttons, hero image with glow + price card
 *   2. Bento Gallery — 4-col bento grid (2 large + 2 small cards with overlays)
 *   3. Pricing & Features — feature list + Messenger booking card + quick quote form
 *   4. Trust Bar — word badges with grayscale → full color on hover
 */
import { bundles, bundleFeatures } from '../data/bundles';

const BENTO_APPETIZER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBVCgBsRwbiPd7t0ukPnMwD8__vx7PpolhtOYn83YCoXuo52OlqLscvyfyCy9obLWvy98C9-WDMsnXQS3l22lYaki5-y_VN8DNO_lybELTIZALQtZk-QdD0dWJT1x6NCFKl6Xx9dyR5Kslcjq5kRgJ3Sc17mWmor-DYo3-ES0M2S7FpUTt4Ux5XEYRrw-F-wHkzHMyl_vX7WkiCHFIOuZIsIYyx_IC1JQ7fGvJCteP5jD0TMEFMs0XRHNObmayQOxUkbfkqUm87qQGO';

const BENTO_OFFICE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBQhFKcauHFKFTZsN9J8S-7hXpajpdBWkCUqoyxlKEqA7Bd81bLlcFPaAbh4393hNFdCLTJtYCwx4PSVzQ7-rnZrh1LkZD38sWeSeuY3W1s8FTg440kWMdCWvnUPk_-kO1OlzXAhD0VE5wD1VWsrRLQI1Ut61d490pBegaEfyNgcdK55XMZ71tjfQYtY6oMQ6nF2C1RL3l4g9EI7KWYeqtjk2u1DFL9Je97bnDqZimKO5vbyrbYD8UeOUC1XMCrtQJ7L8TZR73LcqN2';

const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDOoSxq4CoSOZYqbdLMfakPV7rsuGJEC8bihguAAvP6LK_K_8g41Pz_EgTy5NjAcDEw9-X8RatSFKUJMoJ48_Qxl31Xjd6b0StNkGwlJOcghTqrEQjRnr3mBfbZNsmJNsZ5YmNo_64w09DBtE1_2esEzjqFrKm4jCKoMlJ6eIrQaHGXKFGpjzdMaUu6bcuI4MZArPUtn5CITl-0GDOqe5nQljVGozrHXtIRAvW7fqt02x32HmHGMuW0FeREGbGSqUdlAn0xNC9Bb9cj';

export default function PartyPacks() {
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
                  Handaan Bundles
                </span>
              </h1>

              <p className="party-hero-desc">
                Whether it&rsquo;s a birthday, office reunion, or family feast,
                our authentic Ilonggo party bilao packs bring warmth and flavor
                to your celebration.
              </p>

              <div className="party-hero-cta">
                <a href="#gallery" className="party-btn-primary btn-interact">
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
                  src={HERO_IMG}
                  alt="Triology Handaan Bundles"
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
          BENTO GALLERY
          ═══════════════════════════════════════════════════════ */}
      <section id="gallery" className="party-gallery">
        <div className="container">
          {/* Section header */}
          <div className="party-gallery-header">
            <div>
              <h2 className="party-gallery-title">
                Signature Handaan Gallery
              </h2>
              <p className="party-gallery-subtitle">
                Hand-picked, freshly prepared, and beautifully arranged. See why
                Triology is Iloilo&rsquo;s favorite celebration partner.
              </p>
            </div>
            {/* Arrow buttons */}
            <div className="party-gallery-arrows">
              <button className="party-arrow-btn btn-interact">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
              </button>
              <button className="party-arrow-btn party-arrow-btn-primary btn-interact">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Bento grid */}
          <div className="party-bento-grid">
            {/* Large card: The Classic Triple Feast */}
            <div className="party-bento-card party-bento-large">
              <img
                src={bundles[0].image}
                alt="A classic bilao pack with pancit, spring rolls, and fried chicken"
                loading="lazy"
                className="party-bento-img"
              />
              <div className="party-bento-gradient" />
              <div className="party-bento-content">
                <span className="party-bento-badge">Most Popular</span>
                <h3 className="party-bento-title">{bundles[0].name}</h3>
                <p className="party-bento-desc">
                  {bundles[0].description} (Serves {bundles[0].serves})
                </p>
              </div>
            </div>

            {/* Small card: Appetizer bilao */}
            <div className="party-bento-card party-bento-small">
              <img
                src={BENTO_APPETIZER}
                alt="Appetizer bilao with kwek-kwek, fishballs, and dipping sauces"
                loading="lazy"
                className="party-bento-img"
              />
              <div className="party-bento-overlay" />
            </div>

            {/* Small card: Office catering */}
            <div className="party-bento-card party-bento-small">
              <img
                src={BENTO_OFFICE}
                alt="Office catering setup with Triology packaged snacks and drinks"
                loading="lazy"
                className="party-bento-img"
              />
              <div className="party-bento-overlay" />
            </div>

            {/* Wide card: Grand Family Reunion Bundle */}
            <div className="party-bento-card party-bento-wide">
              <img
                src={bundles[1].image}
                alt="Family reunion banquet table with multiple bilaos"
                loading="lazy"
                className="party-bento-img"
              />
              <div className="party-bento-gradient" />
              <div className="party-bento-content">
                <h3 className="party-bento-title" style={{ fontSize: '1.25rem' }}>
                  {bundles[1].name}
                </h3>
                <p className="party-bento-desc">
                  {bundles[1].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRICING & FEATURES + MESSENGER & FORM
          ═══════════════════════════════════════════════════════ */}
      <section id="contact" className="party-pricing">
        <div className="container">
          <div className="party-pricing-grid">
            {/* Left: Features */}
            <div>
              <h2 className="party-section-title">
                Built for your unique celebration
              </h2>
              <p className="party-section-desc">
                We understand every party is different. From intimate family
                gatherings to large-scale corporate events, we offer flexible
                bundles tailored to your guest count and budget.
              </p>
              <div className="party-features-list">
                {bundleFeatures.map((feature) => (
                  <div key={feature.icon} className="party-feature-item">
                    <div className="party-feature-icon">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 20 }}
                      >
                        {feature.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="party-feature-title">
                        {feature.title}
                      </h4>
                      <p className="party-feature-desc">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Messenger + Form */}
            <div className="party-contact-card">
              <div className="party-contact-header">
                <h3>Ready to Book?</h3>
                <p>Get a free quote within 30 minutes via Messenger</p>
              </div>

              <div className="party-contact-body">
                {/* Messenger button */}
                <a
                  href="https://m.me/triology"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="party-messenger-btn btn-interact"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ flexShrink: 0 }}
                  >
                    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.503 3.734 7.202.195.145.313.376.313.626l-.004 2.215c-.004.57.587.973 1.11.75l2.47-1.054a1.001 1.001 0 01.764-.02c.516.16 1.06.245 1.613.245 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm.8 11.6l-1.9-2.02-3.7 2.02 4.07-4.32 1.9 2.02 3.7-2.02-4.07 4.32z" />
                  </svg>
                  Chat on Messenger
                </a>

                {/* OR divider */}
                <div className="party-or-divider">
                  <div className="party-or-line" />
                  <span className="party-or-text">OR</span>
                  <div className="party-or-line" />
                </div>

                {/* Quick form */}
                <div className="party-form">
                  <div className="party-field">
                    <label className="party-label">Your Name</label>
                    <input
                      type="text"
                      placeholder="Juan Dela Cruz"
                      className="party-input"
                    />
                  </div>
                  <div className="party-field">
                    <label className="party-label">Event Date</label>
                    <input
                      type="date"
                      className="party-input"
                    />
                  </div>
                  <button className="party-submit-btn btn-interact">
                    Request a Quote
                  </button>
                </div>
              </div>
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

        /* ─── Bento Gallery ─────────────────────────────────── */
        .party-gallery {
          background: var(--color-surface);
          padding: 3rem 0;
        }
        @media (min-width: 768px) {
          .party-gallery {
            padding: 5rem 0;
          }
        }

        .party-gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .party-gallery-title {
          font-family: var(--font-headline);
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }

        .party-gallery-subtitle {
          font-size: 1rem;
          color: var(--color-on-surface-variant);
          max-width: 480px;
        }

        .party-gallery-arrows {
          display: none;
          gap: 0.5rem;
        }
        @media (min-width: 640px) {
          .party-gallery-arrows {
            display: flex;
          }
        }

        .party-arrow-btn {
          padding: 0.75rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-outline);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-on-surface-variant);
          transition: background 0.2s;
        }

        .party-arrow-btn-primary {
          border: none;
          background: var(--color-primary);
          color: var(--color-on-primary);
        }

        /* Bento grid */
        .party-bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 640px) {
          .party-bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .party-bento-grid {
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: 250px 250px;
          }
          .party-bento-large {
            grid-column: span 2;
            grid-row: span 2;
          }
          .party-bento-wide {
            grid-column: span 2;
          }
        }

        .party-bento-card {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-2xl);
          min-height: 180px;
          cursor: pointer;
        }
        @media (min-width: 640px) {
          .party-bento-card {
            min-height: 200px;
          }
        }
        @media (min-width: 900px) {
          .party-bento-large {
            min-height: auto;
          }
        }
        .party-bento-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }
        .party-bento-card:hover .party-bento-img {
          transform: scale(1.1);
        }

        .party-bento-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 50%);
          z-index: 1;
        }

        .party-bento-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.2);
          transition: background 0.3s ease;
        }
        .party-bento-card:hover .party-bento-overlay {
          background: rgba(0, 0, 0, 0.4);
        }

        .party-bento-content {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 1.25rem;
          z-index: 2;
        }
        @media (min-width: 640px) {
          .party-bento-content {
            padding: 2rem;
          }
        }

        .party-bento-badge {
          color: var(--color-secondary);
          font-weight: 700;
          font-size: 0.8125rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        .party-bento-title {
          color: #ffffff;
          font-weight: 700;
          font-size: clamp(1rem, 3vw, 1.5rem);
          font-family: var(--font-headline);
          margin-bottom: 0.25rem;
        }

        .party-bento-desc {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
        }

        /* ─── Pricing Section ───────────────────────────────── */
        .party-pricing {
          background: var(--color-surface-container-low);
          padding: 3rem 0;
        }
        @media (min-width: 768px) {
          .party-pricing {
            padding: 5rem 0;
          }
        }

        .party-pricing-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 768px) {
          .party-pricing-grid {
            gap: 4rem;
          }
        }
        @media (min-width: 768px) {
          .party-pricing-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .party-section-title {
          font-family: var(--font-headline);
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 1.5rem;
        }

        .party-section-desc {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--color-on-surface-variant);
          margin-bottom: 2rem;
        }

        .party-features-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .party-feature-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .party-feature-icon {
          background: var(--color-primary);
          color: var(--color-on-primary);
          padding: 0.5rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-shrink: 0;
        }

        .party-feature-title {
          font-weight: 700;
          font-size: 0.9375rem;
          color: var(--color-on-surface);
          margin-bottom: 0.25rem;
        }

        .party-feature-desc {
          font-size: 0.875rem;
          color: var(--color-on-surface-variant);
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

        .party-contact-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .party-contact-header h3 {
          font-family: var(--font-headline);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-secondary);
          margin-bottom: 0.5rem;
        }
        .party-contact-header p {
          font-size: 0.9375rem;
          color: var(--color-on-surface-variant);
        }

        .party-contact-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .party-messenger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 1rem;
          background: #0084ff;
          color: #ffffff;
          border-radius: var(--radius-xl);
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: var(--shadow-md);
          transition: filter 0.2s ease;
        }
        .party-messenger-btn:hover {
          filter: brightness(1.1);
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
          border: none;
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          color: var(--color-on-surface);
          outline: none;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
          transition: box-shadow 0.2s ease;
        }
        .party-input:focus {
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

        @media (max-width: 767px) {
          html, body {
            overflow-x: hidden;
          }
        }
      `}</style>
    </main>
  );
}
