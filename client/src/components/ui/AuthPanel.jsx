/**
 * AuthPanel — full login/signup panel with desktop two-region split
 * and mobile full-screen takeover.
 *
 * Sections:
 *   1. Overlay backdrop + panel container with close control
 *   2. Left auth panel — heading, OAuth provider list, divider, form, legal
 *   3. Right visual panel — full-bleed shop image with centered logo
 *
 * Desktop (≥1024px): side-by-side split, panel centered in viewport
 * Mobile (<1024px):   full-screen, right panel removed from DOM
 *
 * Props: none — reads state from AuthContext
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import Icon from './Icon';
import Button from './Button';
import { api } from '../../lib/api';
import logo from '../../assets/triology-logo.png';
import venueImage from '../../assets/venue.jpg';

/* ─── OAuth Provider config ──────────────────────────────
 * Social login buttons. Google OAuth will be re-implemented
 * via Firebase Auth in a future update.
 * Currently only email/password is supported.
 */
const OAUTH_PROVIDERS = [];

export default function AuthPanel() {
  const { isOpen, currentView, closeAuthPanel, switchView } = useAuth();
  const [animatedIn, setAnimatedIn] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  /* ─── Animate in after mount ────────────────────────── */
  useEffect(() => {
    if (isOpen) {
      // Small delay so the DOM mount triggers the CSS transition
      requestAnimationFrame(() => setAnimatedIn(true));
    } else {
      setAnimatedIn(false);
    }
  }, [isOpen]);

  /* ─── Lock body scroll ──────────────────────────────── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ─── Keyboard: Escape to close ─────────────────────── */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') closeAuthPanel();
  }, [closeAuthPanel]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  /* ─── Helpers ───────────────────────────────────────── */
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFormError('');
    setSignupSuccess(false);
    setForgotMode(false);
  };

  /* ─── Form submit ──────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!email.trim()) { setFormError('Email is required'); return; }
    if (!password) { setFormError('Password is required'); return; }
    if (currentView === 'signup' && password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (currentView === 'signup' && password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = currentView === 'login' ? '/auth/login' : '/auth/signup';
      const body = currentView === 'login'
        ? { email, password }
        : { email, password };

      await api.post(endpoint, body);

      if (currentView === 'signup') {
        setSignupSuccess(true);
      } else {
        // Login successful — reload to restore session from cookies
        // (same approach as the OAuth redirect flow)
        window.location.href = '/';
      }
    } catch (err) {
      const message = err?.body?.error?.message || err?.message || 'Something went wrong. Please try again.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─── OAuth click ──────────────────────────────────── */
  const handleOAuth = async (providerId) => {
    setFormError('');
    setIsSubmitting(true);

    try {
      const res = await api.get(`/auth/oauth/${providerId}`);
      if (res?.data?.url) {
        // Redirect the browser to the OAuth provider
        window.location.href = res.data.url;
      } else {
        setFormError('Unable to start sign-in. Please try again.');
      }
    } catch (err) {
      const message = err?.body?.error?.message || err?.message;
      setFormError(message || 'Unable to start sign-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─── View switching ──────────────────────────────── */
  const goToView = (view) => {
    resetForm();
    switchView(view);
  };

  const isLogin = currentView === 'login';
  const heading = isLogin ? (forgotMode ? 'Reset password' : 'Welcome back') : 'Create account';
  const subtext = isLogin
    ? (forgotMode ? "Enter your email and we'll send you a reset link." : 'Sign in to your account to continue.')
    : 'Join us and start ordering your favorites.';
  const submitLabel = isLogin ? (forgotMode ? 'Send Reset Link' : 'Sign In') : 'Create Account';

  // ────────────────────────────────────────────────────────────
  if (!isOpen) return null;

  return (
    <>
      {/* ─── Backdrop ──────────────────────────────────── */}
      <div
        className={`ap-backdrop${animatedIn ? ' ap-backdrop-visible' : ''}`}
        onClick={closeAuthPanel}
        aria-hidden="true"
      />

      {/* ─── Panel ─────────────────────────────────────── */}
      <div
        className={`ap-container${animatedIn ? ' ap-container-visible' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={isLogin ? 'Sign in' : 'Create account'}
      >
        {/* ─── Close ──────────────────────────────────── */}
        <button
          className="ap-close"
          onClick={closeAuthPanel}
          aria-label="Close"
        >
          <Icon name="close" size={24} />
        </button>

        {/* ─── Desktop: two-column split ──────────────── */}
        <div className="ap-split">
          {/* ════════ LEFT: Auth Panel ════════ */}
          <div className="ap-left">
            {/* Heading */}
            <div className="ap-header">
              <h2 className="ap-heading">{heading}</h2>
              <p className="ap-subtext">{subtext}</p>
            </div>

            {signupSuccess ? (
              /* ─── Signup success ────────────────────── */
              <div className="ap-success">
                <div className="ap-success-icon">
                  <Icon name="mark_email_read" size={48} fill={1} />
                </div>
                <h3 className="ap-success-heading">Check your email</h3>
                <p className="ap-success-text">
                  We sent a verification link to <strong>{email}</strong>.
                  Click it to activate your account, then sign in.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => { resetForm(); goToView('login'); }}
                  style={{ width: '100%', marginTop: '1.5rem' }}
                >
                  Back to Sign In
                </Button>
              </div>
            ) : forgotMode ? (
              /* ─── Forgot password ───────────────────── */
              <form className="ap-form" onSubmit={handleSubmit} noValidate>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="ap-email">Email</label>
                  <input
                    id="ap-email"
                    className="ap-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                {formError && <p className="ap-error">{formError}</p>}

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{ width: '100%', marginTop: '0.75rem' }}
                >
                  {isSubmitting ? 'Sending…' : submitLabel}
                </Button>

                <button
                  type="button"
                  className="ap-link-btn"
                  onClick={() => setForgotMode(false)}
                >
                  Back to Sign In
                </button>
              </form>
            ) : (
              <>
                {/* ─── OAuth providers ──────────────────── */}
                <div className="ap-oauth">
                  {OAUTH_PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      className="ap-oauth-btn"
                      onClick={() => handleOAuth(provider.id)}
                      type="button"
                    >
                      <span className="ap-oauth-icon">{provider.icon}</span>
                      <span>Continue with {provider.label}</span>
                    </button>
                  ))}
                </div>

                {/* ─── Divider ──────────────────────────── */}
                <div className="ap-divider">
                  <span className="ap-divider-line" />
                  <span className="ap-divider-text">or</span>
                  <span className="ap-divider-line" />
                </div>

                {/* ─── Email/Password form ──────────────── */}
                <form className="ap-form" onSubmit={handleSubmit} noValidate>
                  <div className="ap-field">
                    <label className="ap-label" htmlFor="ap-email">Email</label>
                    <input
                      id="ap-email"
                      className="ap-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>

                  <div className="ap-field">
                    <label className="ap-label" htmlFor="ap-password">
                      {isLogin ? 'Password' : 'Create a password'}
                    </label>
                    <div className="ap-password-wrap">
                      <input
                        id="ap-password"
                        className="ap-input"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={isLogin ? 'Enter your password' : 'At least 8 characters'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                      />
                      <button
                        type="button"
                        className="ap-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                      >
                        <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={20} />
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="ap-field">
                      <label className="ap-label" htmlFor="ap-confirm">Confirm password</label>
                      <input
                        id="ap-confirm"
                        className="ap-input"
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </div>
                  )}

                  {formError && <p className="ap-error">{formError}</p>}

                  {isLogin && (
                    <button
                      type="button"
                      className="ap-link-btn ap-forgot-btn"
                      onClick={() => setForgotMode(true)}
                    >
                      Forgot password?
                    </button>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{ width: '100%', marginTop: '0.75rem' }}
                  >
                    {isSubmitting ? 'Please wait…' : submitLabel}
                  </Button>
                </form>

                {/* ─── Toggle view ──────────────────────── */}
                <p className="ap-toggle">
                  {isLogin ? (
                    <>
                      No account yet?{' '}
                      <button
                        type="button"
                        className="ap-link-btn"
                        onClick={() => goToView('signup')}
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="ap-link-btn"
                        onClick={() => goToView('login')}
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </p>

                {/* ─── Legal text ────────────────────────── */}
                <p className="ap-legal">
                  By continuing, you agree to our{' '}
                  <a href="#" className="ap-legal-link">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="ap-legal-link">Privacy Policy</a>.
                </p>
              </>
            )}
          </div>

          {/* ════════ RIGHT: Visual Panel (hidden on mobile) ════════ */}
          <div className="ap-right" aria-hidden="true">
            <div className="ap-right-bg">
              <img
                src={venueImage}
                alt=""
                className="ap-right-img"
              />
            </div>

            {/* Logo overlay */}
            <div className="ap-right-overlay">
              <div className="ap-right-highlight">
                <img
                  src={logo}
                  alt="Triology Refreshment"
                  className="ap-right-logo"
                />
              </div>
              <p className="ap-right-tagline">Your Daily Comfort Food Escape</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          STYLES
          ═══════════════════════════════════════════════════ */}
      <style>{`
        /* ─── Backdrop ───────────────────────────────── */
        .ap-backdrop {
          position: fixed;
          inset: 0;
          z-index: 998;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          opacity: 0;
          transition: opacity 280ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .ap-backdrop-visible {
          opacity: 1;
        }

        /* ─── Container ──────────────────────────────── */
        .ap-container {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          opacity: 0;
          transform: translateY(16px) scale(0.98);
          transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1),
                      transform 320ms cubic-bezier(0.23, 1, 0.32, 1);
          pointer-events: none;
        }
        .ap-container-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        /* ─── Close ──────────────────────────────────── */
        .ap-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: var(--radius-full, 9999px);
          border: none;
          background: var(--color-surface-container-high, #e7e8e9);
          color: var(--color-on-surface-variant, #404943);
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .ap-close:hover {
          background: var(--color-surface-container-highest, #e1e3e4);
          transform: scale(1.05);
        }
        .ap-close:active {
          transform: scale(0.95);
        }

        /* ─── Split layout ───────────────────────────── */
        .ap-split {
          display: flex;
          width: 100%;
          max-width: 880px;
          height: min(90vh, 600px);
          background: var(--color-surface-container-lowest, #ffffff);
          border-radius: var(--radius-2xl, 16px);
          overflow: hidden;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18), 0 8px 16px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        /* ─── Left panel (auth) ──────────────────────── */
        .ap-left {
          flex: 1;
          padding: 2.5rem 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          min-width: 0;
        }

        .ap-header {
          margin-bottom: 1.5rem;
        }

        .ap-heading {
          font-family: var(--font-headline, 'Plus Jakarta Sans', sans-serif);
          font-size: 1.625rem;
          font-weight: 700;
          color: var(--color-on-surface, #191c1d);
          margin: 0 0 0.375rem;
          line-height: 1.2;
        }

        .ap-subtext {
          font-size: 0.9375rem;
          color: var(--color-on-surface-variant, #404943);
          margin: 0;
          line-height: 1.5;
        }

        /* ─── OAuth buttons ──────────────────────────── */
        .ap-oauth {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          margin-bottom: 1.25rem;
        }

        .ap-oauth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          width: 100%;
          padding: 0.6875rem 1rem;
          border-radius: var(--radius-lg, 12px);
          border: 1px solid var(--color-outline-variant, #bfc9c1);
          background: var(--color-surface-container-lowest, #ffffff);
          color: var(--color-on-surface, #191c1d);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .ap-oauth-btn:hover {
          background: var(--color-surface-container-low, #f3f4f5);
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .ap-oauth-btn:active {
          transform: scale(0.985);
        }

        .ap-oauth-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        /* ─── Divider ────────────────────────────────── */
        .ap-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .ap-divider-line {
          flex: 1;
          height: 1px;
          background: var(--color-outline-variant, #bfc9c1);
        }
        .ap-divider-text {
          font-size: 0.8125rem;
          color: var(--color-on-surface-variant, #404943);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        /* ─── Form ────────────────────────────────────── */
        .ap-form {
          display: flex;
          flex-direction: column;
        }

        .ap-field {
          margin-bottom: 1rem;
        }
        .ap-field:last-of-type {
          margin-bottom: 0;
        }

        .ap-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-on-surface, #191c1d);
          margin-bottom: 0.375rem;
        }

        .ap-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          font-size: 0.9375rem;
          border: 1.5px solid var(--color-outline-variant, #bfc9c1);
          border-radius: var(--radius-lg, 12px);
          background: var(--color-surface-container-low, #f3f4f5);
          color: var(--color-on-surface, #191c1d);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .ap-input:focus {
          border-color: var(--color-primary, #056402);
          box-shadow: 0 0 0 3px rgba(5, 100, 2, 0.12);
          background: var(--color-surface-container-lowest, #ffffff);
        }
        .ap-input::placeholder {
          color: var(--color-on-surface-variant, #404943);
          opacity: 0.55;
        }

        .ap-password-wrap {
          position: relative;
        }
        .ap-password-wrap .ap-input {
          padding-right: 2.75rem;
        }
        .ap-password-toggle {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--color-on-surface-variant, #404943);
          border-radius: var(--radius-sm, 6px);
          transition: background 0.2s;
        }
        .ap-password-toggle:hover {
          background: var(--color-surface-container, #edeeef);
        }

        .ap-error {
          font-size: 0.8125rem;
          color: var(--color-error, #ba1a1a);
          margin: 0.5rem 0 0;
          line-height: 1.4;
        }

        .ap-link-btn {
          display: inline;
          padding: 0;
          border: none;
          background: none;
          color: var(--color-primary, #056402);
          font-size: inherit;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: opacity 0.2s;
        }
        .ap-link-btn:hover {
          opacity: 0.8;
        }

        .ap-forgot-btn {
          align-self: flex-end;
          margin-top: 0.5rem;
          font-size: 0.8125rem;
          text-decoration: none;
        }
        .ap-forgot-btn:hover {
          text-decoration: underline;
        }

        .ap-toggle {
          text-align: center;
          font-size: 0.875rem;
          color: var(--color-on-surface-variant, #404943);
          margin: 1.25rem 0 0.75rem;
        }

        .ap-legal {
          text-align: center;
          font-size: 0.75rem;
          color: var(--color-on-surface-variant, #404943);
          opacity: 0.7;
          margin: 0;
          line-height: 1.5;
        }

        .ap-legal-link {
          color: inherit;
          text-decoration: underline;
          text-underline-offset: 1px;
        }
        .ap-legal-link:hover {
          opacity: 0.8;
        }

        /* ─── Success state ──────────────────────────── */
        .ap-success {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem 0;
        }
        .ap-success-icon {
          color: var(--color-primary, #056402);
          margin-bottom: 1rem;
        }
        .ap-success-heading {
          font-family: var(--font-headline, 'Plus Jakarta Sans', sans-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-on-surface, #191c1d);
          margin: 0 0 0.5rem;
        }
        .ap-success-text {
          font-size: 0.9375rem;
          color: var(--color-on-surface-variant, #404943);
          margin: 0;
          line-height: 1.6;
          max-width: 320px;
        }

        /* ─── Right panel (visual) ───────────────────── */
        .ap-right {
          display: none;
          position: relative;
          width: 42%;
          flex-shrink: 0;
          overflow: hidden;
        }

        .ap-right-bg {
          position: absolute;
          inset: 0;
        }

        .ap-right-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .ap-right-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0.15) 0%,
            rgba(0,0,0,0.45) 100%
          );
          padding: 2rem;
          text-align: center;
        }

        .ap-right-highlight {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem 1.75rem;
          border-radius: var(--radius-2xl, 16px);
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          margin-bottom: 1rem;
        }

        .ap-right-logo {
          height: 2.75rem;
          width: auto;
          display: block;
        }

        .ap-right-tagline {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.9);
          margin: 0;
          font-weight: 500;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
          letter-spacing: 0.01em;
        }

        /* ─── Desktop: show side-by-side ─────────────── */
        @media (min-width: 1024px) {
          .ap-right {
            display: block;
          }
          .ap-left {
            padding: 2.75rem 3rem 2rem;
          }
          .ap-container {
            padding: 2rem;
          }
        }

        /* ─── Mobile: full-screen ────────────────────── */
        @media (max-width: 1023px) {
          .ap-container {
            padding: 0;
            transform: translateY(24px) scale(0.97);
          }
          .ap-container-visible {
            transform: translateY(0) scale(1);
          }
          .ap-split {
            height: 100dvh;
            max-width: none;
            border-radius: 0;
            box-shadow: none;
          }
          .ap-left {
            padding: 2.5rem 1.5rem 1.5rem;
          }
          .ap-close {
            top: 0.75rem;
            right: 0.75rem;
          }
        }

        @media (max-width: 380px) {
          .ap-left {
            padding: 2rem 1rem 1rem;
          }
          .ap-heading {
            font-size: 1.375rem;
          }
        }
      `}</style>
    </>
  );
}
