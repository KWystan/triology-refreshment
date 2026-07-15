/**
 * Seed Business — minimal script to create site_content/business in Firestore.
 * Run: node src/scripts/seed-business.js
 */
import { firestore } from '../config/firebase.js';

const data = {
  name: 'Triology Refreshment',
  tagline: 'Your Daily Comfort Food Escape',
  taglineShort: 'Daily Comfort Food Escape',
  description:
    'From refreshing Halo-Halo to all-day rice meals and event packages, Triology Refreshment brings flavor to your everyday celebrations in Trapiche, Oton.',
  about:
    'We believe that every day deserves a moment of comfort. We started with a simple mission: to bring high-quality, reliable, and delicious refreshments to our neighbors in Trapiche, Oton.',
  aboutExtended:
    "Whether it's a quick lunch break or a large family milestone, our focus remains the same — fresh ingredients, professional service, and that unmistakable taste of home. We're more than just a menu; we're your local partner in celebration.",

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

  facebook: 'https://facebook.com/triologyrefreshment',
  facebookFollowers: '1.2K',
  facebookUrl: 'https://m.me/triologyrefreshment',
  messengerUrl: 'https://m.me/triologyrefreshment',

  ordersServed: '5k+',
  freshDaily: '100%',
  localReviews: '500+',
  year: 2024,

  venue: {
    name: 'Triology Event Hall',
    capacity: 50,
    description:
      'A professional, air-conditioned event space in the heart of Trapiche, Oton. Perfect for birthdays, office gatherings, family reunions, and intimate celebrations.',
    pricing: {
      rentOnly: {
        label: 'Venue Only',
        price: 'Inquire via Messenger',
        description:
          'Rent the space and bring your own food. Tables, chairs, AC, and WiFi included.',
      },
      rentAndCatering: {
        label: 'Venue + Catering',
        price: 'Custom Quote',
        description:
          'Rent the space with customized food from our menu. Tell us your preferences and we will handle the rest.',
      },
    },
    amenities: [
      { icon: 'groups', title: 'Capacity', desc: 'Up to 50 guests' },
      { icon: 'ac_unit', title: 'Fully Air-Conditioned', desc: 'Stay comfortable all day' },
      { icon: 'wifi', title: 'High-Speed WiFi', desc: 'Free for guests' },
      { icon: 'restaurant', title: 'In-House Catering', desc: 'Custom menu available' },
      { icon: 'chair', title: 'Tables & Chairs', desc: 'Included in rental' },
      { icon: 'surround_sound', title: 'Sound System', desc: 'Bluetooth speaker available' },
      { icon: 'local_parking', title: 'Parking', desc: 'Free on-site parking' },
      { icon: 'cleaning_services', title: 'Clean-Up Included', desc: 'We handle the mess' },
    ],
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAqxouH-b442VnGCv0OsYBSvxCyQB-VxTfBVcQlO7MCruiG4-dpNbC-OKbbJbi3-Yfg7j51pqNl7oIyPGvmHAadxRZpSB-pkcKYO7UK3VXMdzOk0PbiMXp9JunV7pXsi_LDpSP6_P-y_ey14wdbQE0faTsxCi57YfhrTsqrSkqONcoFNTwtM2zO-Tpt6VN6K30fYTtohblMyDrGMvvrT2RqvD-n9zO8qEUUBC4zq67xobGqg974VlDaON_1UjB3Z3r_QCLAgxa92IXs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHRLDQIqqfP7kX1DkiKo9uY32p399pTkpKiQ-6x3EIqKXMhezfVGuGX3lUuip0e_hOkvtC09lODn0A1oUJvAc9_aNE5Ql1vPIJEpi1EW5q90UMY2ikEoYkoKguJRhOLiDYf4r-jc5zshJnJLuH3_1goLADEGJRRPpj7HyQPP8JJVlBh4LNdfJxCAF3emWOhSR2DAX9gWKoox85Yh-C1vn4JHiM6F1Ip84ce_pnPVv-QTBPjxOnXuv9p1YmpCMfdcWCHCb9j-RJHD5w',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB_3r2HO4Fe6kJEZzJiWXeIOo1n3NzrVzxuiGAgWR6snMvMLDOcDi_8mUco2xL2Y5GtDghcDLxaLzzqOqeRK4dgU6kw3gcUof2rrsb1tWCthp2wEVrvQn5IR-ZaqlaFoixONrtfQmKedV0ClB013W19wcIrNM9kM-RCGKWBzyt2TP1BT-EIi3QDmtxW5iRcv1vlsKVaej77iHAmA6J-1o3L9AVErGyleiq5sZinVW5s77QUH2Ue_HB-7WTuc9oUPeGYVt6x28GfaFd6',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCzthJzEmXxEEh-9R9iHJaylNo23C9EqgF-LChRgBC9RDu6yqB7zf-xQsNGINj1H-TMpLXsfGddff-qiQXdxmR9JM4YbzS0gYbQR4EIZOCQmUY33mGtJmJbuQZetR27BWj94Eg4eMAqlpmZ4l-ozbv8VFFAfjyawDa9Tyajc49VEkgzZFU3pWQJdZo088hw2-e1t6Q6WIGDNigp_zf75f1silS0GVJjxpPcYuU3joEdJ4tr3MCD4ljbyjvqMntIX7kksMQiT27Xf2Yg',
    ],
    bookingNote:
      'Check availability and book via Messenger. We typically respond within 1 hour.',
  },

  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'Combo Meals', path: '/party-packs' },
    { label: 'Venue', path: '/venue' },
  ],
};

try {
  await firestore
    .collection('site_content')
    .doc('business')
    .set({ ...data, createdAt: new Date(), updatedAt: new Date() });
  console.log('✅ Business data seeded to Firestore successfully!');
} catch (err) {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
}
