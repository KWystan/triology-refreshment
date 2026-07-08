/**
 * CategoryIcons — SVG icon components for each menu category.
 *
 * Each icon is a minimal line-art SVG, designed to render inside a ~48px circle.
 * Props: size (default 28), className
 */
export function HaloHaloIcon({ size = 28, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glass / cup */}
      <path d="M7 10C7 6.5 9 4 14 4C19 4 21 6.5 21 10C21 12.5 19 14 14 14C9 14 7 12.5 7 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Straw */}
      <line x1="14" y1="14" x2="16" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Base of glass */}
      <path d="M10 20C10 20 11 22 14 22C17 22 18 20 18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Ice cream / topping dollops */}
      <circle cx="11" cy="7" r="1.5" fill="currentColor" />
      <circle cx="14" cy="6" r="1.5" fill="currentColor" />
      <circle cx="17" cy="7" r="1.5" fill="currentColor" />
      {/* Cherry on top */}
      <circle cx="14" cy="4" r="1.2" fill="currentColor" />
      <line x1="14" y1="2.8" x2="14" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function RiceMealIcon({ size = 28, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bowl */}
      <path d="M5 13C5 9 8 5 14 5C20 5 23 9 23 13C23 18 20 22 14 22C8 22 5 18 5 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Top rim */}
      <path d="M3 13H25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Steam lines */}
      <line x1="12" y1="3" x2="11" y2="1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="3" x2="14" y2="0.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="3" x2="17" y2="1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Rice grains */}
      <line x1="10" y1="9" x2="10" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="9" x2="14" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="18" y1="9" x2="18" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="10" x2="12" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="16" y1="10" x2="16" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function BreakfastIcon({ size = 28, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Egg white (outer shape) */}
      <ellipse cx="14" cy="14" rx="10" ry="9" stroke="currentColor" strokeWidth="1.5" />
      {/* Yolk */}
      <circle cx="14" cy="15" r="3.5" fill="currentColor" />
    </svg>
  );
}

export function PastaIcon({ size = 28, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fork handle */}
      <line x1="14" y1="13" x2="14" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Fork prongs */}
      <line x1="9" y1="5" x2="9" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="11.5" y1="5" x2="11.5" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="5" x2="14" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16.5" y1="5" x2="16.5" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="19" y1="5" x2="19" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Fork head curve */}
      <path d="M9 5C9 3 12 2 14 2C16 2 19 3 19 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Spaghetti noodle wavy lines */}
      <path d="M6 15C8 13 10 17 11 15C12 13 14 17 15 15C16 13 18 17 19 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M5 18C7 16 9 20 10 18C11 16 13 20 14 18C15 16 17 20 18 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function PlatterIcon({ size = 28, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Platter / serving dish */}
      <ellipse cx="14" cy="16" rx="10" ry="6" stroke="currentColor" strokeWidth="1.5" />
      {/* Top rim */}
      <ellipse cx="14" cy="14" rx="10" ry="3" stroke="currentColor" strokeWidth="1.5" />
      {/* Food inside */}
      <circle cx="12" cy="14" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="16" cy="14" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="14" cy="13" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function ShortOrderIcon({ size = 28, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Small bowl */}
      <path d="M5 12C5 8 8 5 14 5C20 5 23 8 23 12C23 17 20 21 14 21C8 21 5 17 5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Rim */}
      <path d="M3 12H25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Contents */}
      <line x1="11" y1="9" x2="11" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="9" x2="14" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="17" y1="9" x2="17" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function SnacksIcon({ size = 28, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fries container (trapezoid) */}
      <path d="M8 21L6 10H22L20 21H8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Fries sticking out */}
      <line x1="10" y1="10" x2="9" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="10" x2="14" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="10" x2="19" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="10" x2="11.5" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="10" x2="16.5" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Map of category IDs to their icon component, label, and display name.
 */
export const CATEGORY_ICONS = {
  all: { Icon: AllIcon, shortLabel: 'All' },
  'halo-halo': { Icon: HaloHaloIcon, shortLabel: 'Desserts' },
  'all-day-rice': { Icon: RiceMealIcon, shortLabel: 'Rice' },
  breakfast: { Icon: BreakfastIcon, shortLabel: 'Breakfast' },
  pasta: { Icon: PastaIcon, shortLabel: 'Pasta' },
  platters: { Icon: PlatterIcon, shortLabel: 'Platters' },
  'short-orders': { Icon: ShortOrderIcon, shortLabel: 'Noodles' },
  snacks: { Icon: SnacksIcon, shortLabel: 'Snacks' },
};

export function AllIcon({ size = 28, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Grid of dots / all categories */}
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      <circle cx="14" cy="8" r="2" fill="currentColor" />
      <circle cx="20" cy="8" r="2" fill="currentColor" />
      <circle cx="8" cy="14" r="2" fill="currentColor" />
      <circle cx="14" cy="14" r="2" fill="currentColor" />
      <circle cx="20" cy="14" r="2" fill="currentColor" />
      <circle cx="8" cy="20" r="2" fill="currentColor" />
      <circle cx="14" cy="20" r="2" fill="currentColor" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
    </svg>
  );
}
