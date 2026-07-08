/**
 * Home page — matches Stitch "Home - Triology Refreshment" design exactly.
 *
 * Sections:
 *   1. Hero — location badge, headline, CTA buttons, rotated hero image, glass card
 *   2. Services Bento Grid — image-based 12-column bento cards
 *   3. About/Vibe — image collage, story text, stats with divider
 *   4. Social Proof — Facebook community CTA with branding
 */
import { useState } from 'react';
import { business } from '../data/business';
import { SectionHeading, Button, Section } from '../components';
import MobileNav from '../components/layout/MobileNav';
import BounceCards from '../components/ui/BounceCards';
import heroImg1 from '../assets/hero/hero-page-image-1.jpg';
import heroImg2 from '../assets/hero/hero-page-image-2.jpg';
import heroImg3 from '../assets/hero/hero-page-image-3.jpg';
import heroImg4 from '../assets/hero/hero-page-image-4.jpg';
import locationBg from '../assets/location-background.png';
import locationWhiteBg from '../assets/location-white-background.svg';
import blobSvg from '../assets/blob.svg';
import mobileHeroBg from '../assets/mobile-hero-bg.svg';

const BENTO_REFRESHMENTS =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBHJpPOlVjKISCS-fZhM7laMmdC66WTR8cIJhDsTRTuVkZ872BRlTYb5Zg29Q8y0Vt9V-qLkgkVsD7QYVqUKivHve4H4grYns0FGajbb4tLfNunWF97dgYm38w5allAmXjApnSyYTII3jpxio2VLcwIYtD-m4munbIzSTc26Rc-HJcsWC9o3Vu_eUIhzG-7Dq7c92jT4qMD58WSkTKmCnrXFL1eQwcV5-Ix1xhXAZSPnf9FASgzgE_TmKLrIct7foKWxp-YXHTCl4cL';

const BENTO_MEALS =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD0Jq_TzZ_uc3UXd8O575357iTSqk6Bsr_dpOIfR9ymzGQoY31D0Bt6M5FwMjGgcdNye_loFfBpREfWRuvATtA_pn8uIJ2xFawuZsKQzsj07fkftY2PhA6psz5f7aDjAZH-RbQM5OVBopAhAhZYzjJ_CZgln4vvc7u8peixLAkgU2M3so3LBoMiZPzo106xrBzyF5Gb41IJcj7kUBJE-gdH-YgBHKKr0pSD-bddDnfY5un_XLi6nihzNX7jM2jqx5FecJ-U93hvTE7m';

const BENTO_PARTY =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAivJIMnnLPjWujfIwXPt3_yGxDcdnGYYJSB8Dl-kH5pIaLMXh8O9XFVUDGy7GcJII7kxO8fXmU-8A1aJs0kV6jkiHyKFr01Y3L3VxKneJRXTUf_fHJbyTazbKezMHCuwBnXrXDil9ywW8mqM46kB_ZYKT4K7QJdICwJuKNV5qA_v9gBB6mUJpwvZtColDklDdNxFV1fVsoKmGI71KNW3NoJJPUidHqp1HRHa610gMtMm-qUTxDq0P3h_FhuU5aFmXDPlnKk6ZJZClP';

const ABOUT_IMG_1 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA7hm9ZLC9O2NMpOAwuUR-dpsygHqWIF0G-_lutIPggE-VgJaQ_LCjTlQ72rdS38CA5bmJaV0NvEPTH3zQSyRkel5t1PGC8Belh6dH7VEOToib2ZzNrgz75a-sV1q_AlVEK2f8C5KuU35JIGQFK5BaqJMgGiSdIPCNyECyPBkIKB062k7eoaLuEA_h5v6khQEgbvGwann0_tV8QR3As6cUeJgFZscrDzJCaoSoAxtDt8FslffEWooQRtRQ1iuruxoeYs59l--6lLKim';

const ABOUT_IMG_2 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuABZg_dCZjNXiComIAx_X0IW3sudfkUaL9e5x1IBEkLEUBofbcNj8bFP1H7_a1dE-jmGQFglzuBo7u4R8aE1AwjDtY81w-puhBRftd9lmyuXd9JwLy9VAjNA5QzCNDG8aP4ZMBeli6BjNpa_8Pg6KCRX6h7tst2zeBo-kSOw_WC9s6c-hyB86uR3B0bFIWGYrcuVmxysJsutFWMVz3taReUBxvhIajxHy-I391CNoSCx-4bTU5-4flj0DZO0fWJ9z0LMooqAplikz2P';

/* ═══════════════════════════════════════════════════════════════
   FloatingPartyElements — animated SVG leaves, sparkles & circles
   Absolutely-positioned, semi-transparent, CSS-animated.
   ═══════════════════════════════════════════════════════════════ */
function FloatingPartyElements() {
  return (
    <div className="party-floats" aria-hidden="true">
      {/* Leaf 1 — large, gold, top-right, slow spin */}
      <svg
        className="party-float party-float-leaf1"
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>

      {/* Leaf 2 — small, green, bottom-left, floating */}
      <svg
        className="party-float party-float-leaf2"
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>

      {/* Sparkles — gold, mid-right, twinkling */}
      <svg
        className="party-float party-float-sparkle"
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      </svg>

      {/* Abstract dot cluster — scattered circles */}
      <svg
        className="party-float party-float-dots"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="30" cy="40" r="4" />
        <circle cx="170" cy="25" r="3" />
        <circle cx="140" cy="45" r="2.5" />
        <circle cx="15" cy="160" r="5" />
        <circle cx="170" cy="150" r="3.5" />
        <circle cx="55" cy="120" r="2" />
        <circle cx="130" cy="175" r="4" />
      </svg>
    </div>
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main>
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════ */}
      <Section nested>
        <div
          className="hero-gradient"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 82, 56, 0.05) 0%, rgba(137, 81, 0, 0.05) 100%)',
            padding: '4rem 0 6rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Blob SVG behind the text */}
          <img
            src={blobSvg}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              left: '5%',
              transform: 'translateY(-50%)',
              width: 'clamp(350px, 50vw, 750px)',
              height: 'auto',
              opacity: 0.07,
              pointerEvents: 'none',
              zIndex: 0,
            }}
            className="hero-blob"
          />
          {/* Mobile hero background SVG — hidden on desktop */}
          <img
            src={mobileHeroBg}
            alt=""
            aria-hidden="true"
            className="hero-mobile-bg"
            style={{
              display: 'none',
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '3rem',
                alignItems: 'center',
              }}
              className="hero-grid"
            >
              {/* Left: copy */}
              <div style={{ position: 'relative' }}>
                {/* Soft green glow behind the text area */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'min(640px, 100%)',
                  height: 'min(520px, 100%)',
                  background: 'radial-gradient(ellipse at center, rgba(15, 82, 56, 0.10) 0%, rgba(15, 82, 56, 0.04) 40%, transparent 65%)',
                  pointerEvents: 'none',
                }} />
                <div className="hero-text" style={{ position: 'relative', textAlign: 'left' }}>
                {/* Location badge */}
                <span
                  className="hero-location-badge"
                  style={{
                    display: 'inline-block',
                    padding: '0.375rem 3rem',
                    background: `var(--loc-bg, url(${locationBg})) center / contain no-repeat`,
                    '--loc-bg-mobile': `url(${locationWhiteBg})`,
                    color: 'var(--color-on-primary-container)',
                    borderRadius: 0,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    marginTop: '0.5rem',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Trapiche, Oton, Iloilo
                </span>

                <h1
                  style={{
                    fontFamily: "'Okinawa', cursive",
                    fontSize: '3rem',
                    fontWeight: 300,
                    lineHeight: 1.3,
                    color: 'var(--color-primary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Your Daily{' '}
                  <span style={{ color: 'var(--color-secondary)' }}>
                    Comfort Food
                  </span>{' '}
                  Escape in Iloilo
                </h1>

                <p
                  style={{
                    fontSize: '1.125rem',
                    lineHeight: 1.6,
                    color: 'var(--color-on-surface-variant)',
                    marginBottom: '2.5rem',
                    maxWidth: '560px',
                  }}
                  className="hero-description"
                >
                  From refreshing Halo-Halo to all-day rice meals and event
                  packages, Triology Refreshment brings flavor to your everyday
                  celebrations in Trapiche, Oton.
                </p>

                <div
                  className="hero-cta"
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <button
                    onClick={() => setMobileOpen(true)}
                    className="btn-interact"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2rem',
                      background: 'var(--color-secondary)',
                      color: 'var(--color-on-secondary)',
                      borderRadius: 'var(--radius-xl)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      boxShadow: 'var(--shadow-lg)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Explore More
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '1.25em' }}
                    >
                      explore
                    </span>
                  </button>

                  <a
                    href="/menu"
                    className="btn-interact"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2rem',
                      border: '2px solid var(--color-primary)',
                      color: 'var(--color-primary)',
                      borderRadius: 'var(--radius-xl)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      textDecoration: 'none',
                    }}
                  >
                    View Full Menu
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '1.25em' }}
                    >
                      menu_book
                    </span>
                  </a>

                </div>
              </div>
              </div>  {/* end glow wrapper */}

              {/* Right: bounce cards */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} className="hero-visual">
                <BounceCards
                  images={[heroImg1, heroImg2, heroImg3, heroImg4]}
                  containerWidth={400}
                  containerHeight={400}
                  transformStyles={[
                    'rotate(12deg) translate(-130px)',
                    'rotate(4deg) translate(-40px)',
                    'rotate(-4deg) translate(40px)',
                    'rotate(-12deg) translate(130px)',
                  ]}
                  animationDelay={0.3}
                  animationStagger={0.08}
                  enableHover={true}
                />

              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          SERVICES BENTO GRID (image-based cards)
          ═══════════════════════════════════════════════════════ */}
      <Section background="var(--color-surface)">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 4, height: 28, background: 'var(--color-secondary)', borderRadius: 2 }} />
              <h2
                style={{
                  fontFamily: "'Okinawa', cursive",
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 400,
                  color: 'var(--color-primary)',
                  lineHeight: 1.2,
                }}
              >
                Our Specialties
              </h2>
            </div>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--color-on-surface-variant)',
                marginLeft: '1.25rem',
              }}
            >
              Quality refreshment for every mood and occasion.
            </p>
          </div>
          <a
            href="/menu"
            className="btn-interact bento-view-all"
            style={{
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--color-outline-variant)',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-outline-variant)';
            }}
          >
            View Full Menu
            <span className="material-symbols-outlined" style={{ fontSize: '1.1em' }}>arrow_forward</span>
          </a>
        </div>

        {/* 12-col bento grid */}
        <div className="bento-12-col">
          {/* Card 1: Refreshments & Delicacies (col-span-8) */}
          <div className="bento-card bento-card-lg bento-card-refreshments">
            <div className="bento-image-wrapper">
              <img
                src={BENTO_REFRESHMENTS}
                alt="Refreshments & Delicacies"
                loading="lazy"
                className="bento-img"
              />
              <div className="bento-gradient" />
            </div>
            <div className="bento-content">
              <span
                style={{
                  display: 'inline-block',
                  background: 'var(--color-tertiary-fixed)',
                  color: 'var(--color-on-tertiary-fixed)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                Best Seller
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                }}
              >
                Refreshments &amp; Delicacies
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: '1.5rem',
                  maxWidth: '400px',
                }}
              >
                Our signature icy treats and traditional Filipino snacks, made
                fresh daily with premium ingredients.
              </p>
              <a
                href="/menu"
                className="btn-interact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.5rem',
                  background: '#ffffff',
                  color: 'var(--color-primary)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Order Refreshments
                <span className="material-symbols-outlined" style={{ fontSize: '1.1em' }}>
                  arrow_forward
                </span>
              </a>
            </div>
          </div>

          {/* Card 2: All-Day Rice Meals (col-span-4) */}
          <div className="bento-card bento-card-sm bento-card-meals">
            <div className="bento-image-wrapper">
              <img
                src={BENTO_MEALS}
                alt="All-Day Rice Meals"
                loading="lazy"
                className="bento-img"
              />
              <div className="bento-gradient" />
            </div>
            <div className="bento-content">
              <h3
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                }}
              >
                All-Day Rice Meals
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: '1.5rem',
                }}
              >
                Hearty, savory meals that feel like home.
              </p>
              <a
                href="/menu"
                className="btn-interact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1.5rem',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Explore Meals
              </a>
            </div>
          </div>

          {/* Card 3: Party Packs (col-span-12) — portrait layout */}
          <div className="bento-card bento-card-full bento-card-party">
            <FloatingPartyElements />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
              className="bento-party-layout"
            >
              <div
                style={{
                  padding: '2rem 2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                  flex: 1,
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '1rem',
                  }}
                >
                  Planning an Event?
                </h3>
                <p
                  style={{
                    fontSize: '1.0625rem',
                    lineHeight: 1.6,
                    color: 'var(--color-on-primary-container)',
                    marginBottom: '2rem',
                    maxWidth: '500px',
                  }}
                >
                  Our Party Packs are designed to take the stress out of hosting.
                  Perfect for office lunches, birthdays, and community gatherings.
                </p>
                <div>
                  <a
                    href="/party-packs"
                    className="btn-interact"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.75rem 2rem',
                      background: 'var(--color-secondary-container)',
                      color: 'var(--color-on-secondary-container)',
                      borderRadius: 'var(--radius-xl)',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  >
                    Request a Quote
                  </a>
                </div>
              </div>
              <div
                className="bento-party-image"
                style={{
                  height: '240px',
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <img
                  src={BENTO_PARTY}
                  alt="Party Packs"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          ABOUT / VIBE SECTION
          ═══════════════════════════════════════════════════════ */}
      <Section background="var(--color-surface-container-low)">
        <div
          style={{
            display: 'flex',
            gap: '4rem',
            alignItems: 'center',
          }}
          className="about-layout"
        >
          {/* Left: image collage */}
          <div className="about-images" style={{ flex: 1 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  aspectRatio: '4 / 5',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  marginTop: '2rem',
                }}
              >
                <img
                  src={ABOUT_IMG_1}
                  alt="Local family enjoying refreshments"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div
                style={{
                  aspectRatio: '4 / 5',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={ABOUT_IMG_2}
                  alt="Fresh ingredients being prepared"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* Right: text */}
          <div className="about-text" style={{ flex: 1, textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: "'Okinawa', cursive",
                fontSize: '1.5rem',
                fontWeight: 400,
                color: 'var(--color-primary)',
                marginBottom: '1rem',
                lineHeight: 1.3,
              }}
            >
              The Daily Comfort Food Escape
            </h2>
            <p
              style={{
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: 'var(--color-on-surface-variant)',
                marginBottom: '1.5rem',
              }}
            >
              At Triology Refreshment, we believe that every day deserves a
              moment of comfort. We started with a simple mission: to bring
              high-quality, reliable, and delicious refreshments to our neighbors
              in Trapiche, Oton.
            </p>
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'var(--color-on-surface-variant)',
                marginBottom: '2rem',
                opacity: 0.8,
              }}
            >
              Whether it&rsquo;s a quick lunch break or a large family milestone,
              our focus remains the same&mdash;fresh ingredients, professional
              service, and that unmistakable taste of home. We&rsquo;re more than
              just a menu; we&rsquo;re your local partner in celebration.
            </p>

            {/* Stats with divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                gap: '1.5rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                  }}
                >
                  5k+
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--color-on-surface-variant)',
                    marginTop: '0.25rem',
                  }}
                >
                  Orders Served
                </p>
              </div>
              <div
                style={{
                  width: '1px',
                  height: '3rem',
                  background: 'var(--color-outline-variant)',
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                  }}
                >
                  100%
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--color-on-surface-variant)',
                    marginTop: '0.25rem',
                  }}
                >
                  Fresh Daily
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          SOCIAL PROOF — Facebook Community
          ═══════════════════════════════════════════════════════ */}
      <Section background="var(--color-surface-container-lowest)">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 40,
              color: 'var(--color-primary)',
              display: 'block',
              marginBottom: '1rem',
            }}
          >
            groups
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-on-surface)',
              marginBottom: '1rem',
            }}
          >
            Be Part of Our Community
          </h2>
          <p
            style={{
              fontSize: '1.0625rem',
              lineHeight: 1.6,
              color: 'var(--color-on-surface-variant)',
              marginBottom: '2.5rem',
            }}
          >
            Join 1.2K+ local followers on Facebook and never miss out on our
            daily specials and local event updates.
          </p>

          {/* Facebook blue button */}
          <a
            href={business.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-interact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              background: '#1877F2',
              color: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {/* Facebook SVG icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ flexShrink: 0 }}
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Follow us on Facebook
          </a>
        </div>
      </Section>

      <MobileNav
        open={mobileOpen}
        links={business.navLinks}
        onClose={() => setMobileOpen(false)}
        position="center"
      />

      {/* ═══════════════════════════════════════════════════════
          RESPONSIVE STYLES
          ═══════════════════════════════════════════════════════ */}
      <style>{`

        /* ─── Bento 12-col grid ─── */
        .bento-12-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .bento-12-col {
            grid-template-columns: repeat(12, 1fr);
          }
          .bento-card-lg {
            grid-column: span 8;
          }
          .bento-card-sm {
            grid-column: span 4;
          }
          .bento-card-full {
            grid-column: span 12;
          }
        }

        /* ─── Bento card base ─── */
        .bento-view-all {
          display: none !important;
        }
        @media (min-width: 768px) {
          .bento-view-all {
            display: inline-flex !important;
          }
        }

        .bento-card {
          position: relative;
          overflow: hidden;
          border-radius: 1.5rem;
          background: #ffffff;
          border: 1px solid rgba(191, 201, 193, 0.3);
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.4s ease, transform 0.4s ease;
          min-height: 400px;
          animation: bento-fade-up 0.6s ease both;
        }
        .bento-card:nth-child(1) { animation-delay: 0.1s; }
        .bento-card:nth-child(2) { animation-delay: 0.2s; }
        .bento-card:nth-child(3) { animation-delay: 0.3s; }
        .bento-card-full {
          min-height: 300px;
        }
        .bento-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-xl);
        }

        @keyframes bento-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .bento-image-wrapper {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .bento-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }
        .bento-card:hover .bento-img {
          transform: scale(1.08);
        }
        .bento-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 100%);
        }
        .bento-content {
          position: relative;
          z-index: 1;
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 2rem;
        }

        .bento-content h3 {
          transition: transform 0.3s ease;
        }
        .bento-card:hover .bento-content h3 {
          transform: translateY(-2px);
        }
        .bento-content .bento-cta-btn {
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .bento-card:hover .bento-content .bento-cta-btn {
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transform: translateY(-1px);
        }

        /* ─── Shine overlay on hover (not on party card) ─── */
        .bento-card:not(.bento-card-party)::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 55%, transparent 60%);
          background-size: 200% 100%;
          background-position: 200% 0;
          transition: background-position 0.6s ease;
          pointer-events: none;
        }
        .bento-card:not(.bento-card-party):hover::after {
          background-position: -200% 0;
        }

        /* Party pack card — solid bg, no image overlay */
        .bento-card-party {
          position: relative;
          background: linear-gradient(135deg, var(--color-primary-container) 0%, #1a4a32 100%);
          border: none;
          min-height: 300px;
          overflow: hidden;
        }
        .bento-card-party::before {
          content: "";
          position: absolute;
          top: -120px;
          right: -60px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(251, 192, 2, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          transition: transform 0.6s ease;
        }
        .bento-card-party:hover::before {
          transform: scale(1.3);
        }
        .bento-card-party::after {
          content: "";
          position: absolute;
          bottom: -80px;
          left: -40px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(177, 240, 206, 0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          transition: transform 0.6s ease;
        }
        .bento-card-party:hover::after {
          transform: scale(1.3);
        }
        .bento-card-party:hover {
          box-shadow: var(--shadow-xl);
          transform: translateY(-6px);
        }
        .bento-card-party .bento-img {
          transition: transform 0.7s ease;
        }
        .bento-card-party:hover .bento-img {
          transform: scale(1.08);
        }

        /* ─── Floating party elements (leaves, sparkle, dots) ─── */
        .party-floats {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .party-float {
          position: absolute;
        }

        /* Leaf 1 — gold, top-right, slow spin */
        .party-float-leaf1 {
          top: -16px;
          right: 28px;
          width: 52px;
          height: 52px;
          opacity: 0.18;
          color: var(--color-secondary, #fbc002);
          animation: party-spin 25s linear infinite;
        }

        /* Leaf 2 — green, bottom-left, drifting */
        .party-float-leaf2 {
          bottom: 16px;
          left: 22%;
          width: 34px;
          height: 34px;
          opacity: 0.14;
          color: var(--color-primary-fixed, #b1f0ce);
          animation: party-float 7s ease-in-out infinite;
        }

        /* Sparkle — gold, mid-right, twinkling */
        .party-float-sparkle {
          top: 28%;
          right: 14%;
          width: 26px;
          height: 26px;
          opacity: 0.22;
          color: var(--color-secondary, #fbc002);
          animation: party-twinkle 4s ease-in-out infinite;
        }

        /* Dot cluster — scattered circles */
        .party-float-dots {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.18;
          color: var(--color-secondary, #fbc002);
          animation: party-drift 18s ease-in-out infinite alternate;
        }

        @keyframes party-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes party-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }

        @keyframes party-twinkle {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50%      { opacity: 0.25; transform: scale(1.15); }
        }

        @keyframes party-drift {
          0%   { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(6px, -8px) rotate(8deg); }
        }

        /* ─── Mobile Hero ──────────────────────────────────── */
        @media (max-width: 767px) {
          html, body {
            overflow-x: hidden;
          }
          .hero-gradient {
            padding: 5rem 0 3rem !important;
            background: none !important;
            overflow: visible !important;
          }
          /* Transparent navbar on mobile so hero SVG shows through */
          nav {
            background: transparent !important;
            box-shadow: none !important;
          }
          .nav-mobile-toggle {
            color: #ffffff !important;
          }
          .hero-blob {
            display: none !important;
          }
          .hero-mobile-bg {
            display: block !important;
            top: -120px !important;
            height: calc(100% + 120px) !important;
            object-position: center center !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .hero-text {
            text-align: center !important;
          }
          .hero-text h1 {
            font-size: 2rem !important;
            color: #ffffff !important;
          }
          .hero-text h1 span {
            color: #fbc002 !important;
          }
          .hero-description {
            font-size: 0.9375rem !important;
            max-width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
            color: rgba(255,255,255,0.85) !important;
          }
          .hero-cta {
            justify-content: center !important;
          }
          .hero-cta a:last-child {
            border-color: rgba(255,255,255,0.6) !important;
            color: #ffffff !important;
          }
          .hero-location-badge {
            padding: 0.375rem 2rem !important;
            font-size: 0.6875rem !important;
            --loc-bg: var(--loc-bg-mobile) !important;
            color: var(--color-primary) !important;
            font-weight: 600 !important;
          }
          .hero-visual {
            max-width: 480px !important;
            margin: 0 auto !important;
            width: 100% !important;
          }
        }

      `}</style>
    </main>
  );
}
