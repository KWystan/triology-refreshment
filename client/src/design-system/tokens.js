/**
 * Triology Design System Tokens
 *
 * Single source of truth extracted from the Stitch-generated design.
 * Every visual value — color, type, space, radius — lives here.
 * Components import these; no magic values anywhere else.
 */

// ─── Colors ────────────────────────────────────────────────
// Material You dynamic palette, seed: #2d6a4f
export const colors = {
  /* Primary & variants */
  primary: '#0f5238',
  'primary-container': '#2d6a4f',
  'primary-fixed': '#b1f0ce',
  'primary-fixed-dim': '#95d4b3',
  'on-primary': '#ffffff',
  'on-primary-container': '#a8e7c5',
  'on-primary-fixed': '#002114',
  'on-primary-fixed-variant': '#0e5138',

  /* Secondary — Golden Yellow Accent */
  secondary: '#fbc002',
  'secondary-container': '#ffe883',
  'secondary-fixed': '#fef4c4',
  'secondary-fixed-dim': '#fde87a',
  'on-secondary': '#3b3000',
  'on-secondary-container': '#5c4d00',
  'on-secondary-fixed': '#201900',
  'on-secondary-fixed-variant': '#7a6600',

  /* Tertiary */
  tertiary: '#5d4300',
  'tertiary-container': '#7a5a00',
  'tertiary-fixed': '#ffdfa0',
  'tertiary-fixed-dim': '#fbbc00',
  'on-tertiary': '#ffffff',
  'on-tertiary-container': '#ffd47b',
  'on-tertiary-fixed': '#261a00',
  'on-tertiary-fixed-variant': '#5c4300',

  /* Surface — 8-level Material 3 hierarchy */
  background: '#f8f9fa',
  surface: '#f8f9fa',
  'surface-dim': '#d9dadb',
  'surface-bright': '#f8f9fa',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#f3f4f5',
  'surface-container': '#edeeef',
  'surface-container-high': '#e7e8e9',
  'surface-container-highest': '#e1e3e4',
  'surface-variant': '#e1e3e4',
  'surface-tint': '#2c694e',
  'on-surface': '#191c1d',
  'on-surface-variant': '#404943',
  'inverse-surface': '#2e3132',
  'inverse-on-surface': '#f0f1f2',

  /* Error */
  error: '#ba1a1a',
  'error-container': '#ffdad6',
  'on-error': '#ffffff',
  'on-error-container': '#93000a',

  /* Outline */
  outline: '#707973',
  'outline-variant': '#bfc9c1',

  /* Inverse primary */
  'inverse-primary': '#95d4b3',
} ;

// Semantic aliases (map token names to usage)
export const colorAliases = {
  'btn-primary-bg': colors.secondary,
  'btn-primary-text': colors['on-secondary'],
  'btn-secondary-bg': 'transparent',
  'btn-secondary-text': colors.primary,
  'btn-secondary-border': colors.primary,
  'btn-outline-bg': 'transparent',
  'btn-outline-text': colors['on-primary-container'],
  'btn-outline-border': colors['on-primary-container'],
  'nav-active': colors.primary,
  'nav-inactive': colors['on-surface-variant'],
  'hero-gradient-start': 'rgba(15, 82, 56, 0.05)',
  'hero-gradient-end': 'rgba(251, 192, 2, 0.05)',
  'glass-bg': 'rgba(255, 255, 255, 0.8)',
} ;

// ─── Typography ────────────────────────────────────────────
export const fontFamily = {
  'headline-xl': "'Plus Jakarta Sans', sans-serif",
  'headline-lg': "'Plus Jakarta Sans', sans-serif",
  'headline-lg-mobile': "'Plus Jakarta Sans', sans-serif",
  'headline-md': "'Plus Jakarta Sans', sans-serif",
  'body-lg': 'Inter, sans-serif',
  'body-md': 'Inter, sans-serif',
  'label-lg': 'Inter, sans-serif',
  'label-sm': 'Inter, sans-serif',
} ;

export const fontSize = {
  'headline-xl': { size: '48px', lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: 700 },
  'headline-lg': { size: '32px', lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: 700 },
  'headline-lg-mobile': { size: '28px', lineHeight: '36px', fontWeight: 700 },
  'headline-md': { size: '24px', lineHeight: '32px', fontWeight: 600 },
  'body-lg': { size: '18px', lineHeight: '28px', fontWeight: 400 },
  'body-md': { size: '16px', lineHeight: '24px', fontWeight: 400 },
  'label-lg': { size: '14px', lineHeight: '20px', fontWeight: 600 },
  'label-sm': { size: '12px', lineHeight: '16px', fontWeight: 500 },
} ;

export const typography = { fontFamily, fontSize } ;

// ─── Spacing ────────────────────────────────────────────────
export const spacing = {
  unit: '8px',
  'max-width': '1280px',
  'margin-mobile': '16px',
  'margin-desktop': '64px',
  gutter: '24px',
} ;

// ─── Border Radius ──────────────────────────────────────────
export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',    // rounded-lg in Tailwind
  lg: '0.75rem',   // rounded-xl
  xl: '1rem',      // rounded-2xl
  '2xl': '1.5rem', // rounded-3xl
  full: '9999px',
} ;

// ─── Shadows ────────────────────────────────────────────────
export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px -1px rgba(0,0,0,0.1)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
  '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',
} ;

// ─── Transitions ────────────────────────────────────────────
export const transitions = {
  default: '0.2s ease',
  hover: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
} ;

// ─── Breakpoints ────────────────────────────────────────────
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} ;
