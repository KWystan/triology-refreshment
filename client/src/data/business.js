/**
 * Business information — single source of truth for the Triology brand.
 * Used by Navbar, Footer, Contact pages, and metadata.
 */

export const business = {
  name: 'Triology Refreshment',
  tagline: 'Your Daily Comfort Food Escape',
  taglineShort: 'Daily Comfort Food Escape',
  description:
    'From refreshing Halo-Halo to all-day rice meals and event packages, Triology Refreshment brings flavor to your everyday celebrations in Trapiche, Oton.',
  about:
    'We believe that every day deserves a moment of comfort. We started with a simple mission: to bring high-quality, reliable, and delicious refreshments to our neighbors in Trapiche, Oton.',
  aboutExtended:
    "Whether it's a quick lunch break or a large family milestone, our focus remains the same — fresh ingredients, professional service, and that unmistakable taste of home. We're more than just a menu; we're your local partner in celebration.",

  // Contact
  phone: '0947 709 7622',
  email: 'winday_021@yahoo.com',
  address: {
    street: 'Trapiche',
    city: 'Oton',
    province: 'Iloilo',
    country: 'Philippines',
    zip: '5020',
    full: 'Trapiche, Oton, Iloilo City, Philippines 5020',
  },
  hours: 'Mon - Sun: 8AM - 8PM',
  locationLabel: 'Trapiche, Oton, Iloilo',

  // Social
  facebook: '#',
  facebookFollowers: '1.2K',
  facebookUrl: 'https://m.me/triology',

  // Stats
  ordersServed: '5k+',
  freshDaily: '100%',
  localReviews: '500+',

  // Year for copyright
  year: 2024,

  // Navigation
  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'Party Packs', path: '/party-packs' },
    { label: 'Events', path: '/events' },
    { label: 'Contact', path: '/events' },
  ],
};
