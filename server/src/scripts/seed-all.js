/**
 * Seed All — comprehensive one-time migration of ALL static data into Firestore.
 *
 * Seeds the following Firestore documents — pages access these via the API
 * controllers at /api/menu/* and /api/content/*:
 *
 *   menu_categories/{id}     — categories (7)
 *   menu_items/{id}          — items (42)
 *   site_content/business    — business info, venue, nav links
 *   site_content/bundles     — party pack bundles array
 *   site_content/bundle_features — features array
 *   site_content/menu_filter_tabs — filter tabs array
 *
 * Run: node src/scripts/seed-all.js
 */
import cloudinary from '../config/cloudinary.js';
import { firestore } from '../config/firebase.js';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = resolve(__dirname, '..', '..', '..', 'client', 'src', 'assets');

/* ─── Cloudinary folder ───────────────────────────────────── */
const CLOUD_FOLDER = 'triology/menu';

/* ═══════════════════════════════════════════════════════════════
   MENU DATA — mirrors client/src/data/menuItems.js
   ═══════════════════════════════════════════════════════════════ */
const menuData = [
  // ─── Halo-Halo ──────────────────────────────────────────
  {
    id: 'halo-halo',
    label: 'Halo-Halo Overloads',
    layout: 'compact-square',
    priceNote: '₱89 Reg / ₱109 Big',
    order: 1,
    items: [
      { id: 'ube-craze', name: 'Ube Craze', image: 'halo_halo/ube_craze_crash_overload.png', images: ['halo_halo/ube_craze_crash_overload.png'], badge: 'Best Seller', isBestSeller: true, rating: 4.8, description: 'Rich and creamy ube-flavored halo-halo loaded with sweet toppings, leche flan, and ube ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#ube', '#halohalo', '#overload'] },
      { id: 'coco-pandan', name: 'Coco Pandan', image: 'halo_halo/coco_pandan_crash_overload.png', images: ['halo_halo/coco_pandan_crash_overload.png'], rating: 4.7, description: 'A refreshing blend of coconut strips, pandan jelly, and creamy milk topped with coconut ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#coconut', '#pandan', '#halohalo'] },
      { id: 'cremelon', name: "Creme'lon", image: "halo_halo/creme'lon_overload.png", images: ["halo_halo/creme'lon_overload.png"], rating: 4.5, description: 'Cool and fruity melon-flavored halo-halo with fresh melon slices, sago, and a scoop of melon ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#cremelon', '#melon', '#halohalo'] },
      { id: 'real-mango', name: 'Real Mango', image: 'halo_halo/real_mango_overload.png', images: ['halo_halo/real_mango_overload.png'], rating: 4.6, description: 'Sweet ripe mangoes layered with shaved ice, evaporated milk, and mango ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#mango', '#halohalo', '#sweet'] },
      { id: 'say-cheese', name: 'Say Cheese', image: 'halo_halo/say_cheese_halo_overload.png', images: ['halo_halo/say_cheese_halo_overload.png'], rating: 4.4, description: 'A unique savory-sweet halo-halo with cheese strips, macapuno, and a scoop of cheese ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#cheese', '#halohalo', '#savory'] },
      { id: 'halo-cado', name: 'Halo Cado', image: 'halo_halo/halo_cado_overload.png', images: ['halo_halo/halo_cado_overload.png'], rating: 4.7, description: 'Creamy avocado slices meet shaved ice and milk, topped with avocado ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#avocado', '#halohalo', '#creamy'] },
      { id: 'mais-con-yelo', name: 'Mais Con Yelo', image: 'halo_halo/mais_con_yelo_halo_overload.png', images: ['halo_halo/mais_con_yelo_halo_overload.png'], rating: 4.3, description: 'Sweet corn kernels over shaved ice with milk and a scoop of corn ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#mais', '#corn', '#halohalo'] },
      { id: 'banana', name: 'Banana', image: 'halo_halo/banana_overload.png', images: ['halo_halo/banana_overload.png'], rating: 4.2, description: 'Caramelized saba bananas layered with shaved ice, milk, and banana ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#banana', '#halohalo', '#saba'] },
    ],
  },
  // ─── Rice Meals ──────────────────────────────────────────
  {
    id: 'all-day-rice',
    label: 'All Day Rice Meals',
    layout: 'rice-card',
    order: 2,
    items: [
      { id: 'fried-chicken-rice', name: 'Fried Chicken Rice Meal', price: 120, tags: ['#friedchicken', '#ricemeal', '#sulit'], rating: 4.5, description: 'Crispy fried chicken served with steaming white rice.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'glazed-chicken-rice', name: 'Glazed Chicken Rice Meal', price: 120, tags: ['#glazed', '#chicken', '#ricemeal'], rating: 4.6, description: 'Tender chicken glazed in a sweet-savory sauce paired with garlic rice.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'lumpia-shanghai-rice', name: 'Lumpia Shanghai Rice Meal', price: 120, tags: ['#lumpia', '#shanghai', '#ricemeal'], rating: 4.4, description: 'Crispy lumpia Shanghai rolls with garlic rice and dipping sauce.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'bbq-liempo-rice', name: 'BBQ Glazed Liempo Rice Meal', price: 135, tags: ['#bbq', '#liempo', '#ricemeal'], badge: 'Best Seller', isBestSeller: true, rating: 4.7, description: 'Juicy grilled pork liempo basted in our signature BBQ glaze, served with garlic rice.', serves: '1 person', prepTime: '~12 mins' },
    ],
  },
  // ─── Breakfast ──────────────────────────────────────────
  {
    id: 'breakfast',
    label: 'Breakfast Meals',
    layout: 'circular',
    order: 3,
    items: [
      { id: 'tosilog', name: 'Tosilog', price: 109, tags: ['#tocino', '#silog', '#breakfast'], badge: 'Best Seller', isBestSeller: true, rating: 4.7, description: 'Sweet Filipino tocino with garlic rice, fried egg, and tomato.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'hotsilog', name: 'Hotsilog', price: 109, tags: ['#hotdog', '#silog', '#breakfast'], rating: 4.3, description: 'Juicy Filipino-style hotdog with garlic rice and fried egg.', serves: '1 person', prepTime: '~8 mins' },
      { id: 'cornsilog', name: 'Cornsilog', price: 109, tags: ['#cornedbeef', '#silog', '#breakfast'], rating: 4.4, description: 'Savory corned beef sautéed with onions, with garlic rice and egg.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'adobsilog', name: 'Adobsilog', price: 109, tags: ['#adobo', '#silog', '#breakfast'], rating: 4.6, description: 'Tender chicken adobo simmered in soy-vinegar, with garlic rice and egg.', serves: '1 person', prepTime: '~8 mins' },
      { id: 'chosilog', name: 'Chosilog', price: 109, tags: ['#chicken', '#silog', '#breakfast'], rating: 4.3, description: 'Marinated grilled chicken with garlic rice and fried egg.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'pork-tapsilog', name: 'Pork Tapsilog', price: 109, tags: ['#tapa', '#silog', '#breakfast'], rating: 4.5, description: 'Classic beef tapa with garlic rice and egg.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'chicken-guisalog', name: 'Chicken Guisalog', price: 135, tags: ['#guisado', '#chicken', '#silog'], rating: 4.8, description: 'Chicken guisado slow-cooked in tomato-based sauce.', serves: '1 person', prepTime: '~12 mins' },
    ],
  },
  // ─── Pasta ──────────────────────────────────────────────
  {
    id: 'pasta',
    label: 'Pasta Meals',
    layout: 'compact-card',
    note: 'All include a drink',
    order: 4,
    items: [
      { id: 'chicken-alfredo', name: 'Yummy Chicken Alfredo', price: 135, tags: ['#alfredo', '#chicken', '#pasta'], badge: 'Best Seller', isBestSeller: true, rating: 4.6, description: 'Creamy alfredo with tender chicken and fettuccine.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'cheezy-baked-mac', name: 'Cheezy Baked Mac', price: 125, tags: ['#bakedmac', '#cheezy', '#pasta'], rating: 4.5, description: 'Elbow macaroni baked in creamy cheese sauce.', serves: '1 person', prepTime: '~12 mins' },
      { id: 'cream-carbonara', name: 'Cream Carbonara', price: 130, tags: ['#carbonara', '#creamy', '#pasta'], rating: 4.4, description: 'Spaghetti in velvety carbonara sauce with bacon.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'meaty-lasagna', name: 'Meaty Lasagna', price: 140, tags: ['#lasagna', '#meaty', '#pasta'], rating: 4.7, description: 'Layered pasta with seasoned meat, tomato sauce, and cheese.', serves: '1 person', prepTime: '~15 mins' },
      { id: 'spaghetti', name: 'Spaghetti', price: 85, tags: ['#spaghetti', '#classic', '#pasta'], rating: 4.3, description: 'Classic spaghetti in sweet-style Filipino meat sauce.', serves: '1 person', prepTime: '~8 mins' },
    ],
  },
  // ─── Platters ──────────────────────────────────────────
  {
    id: 'platters',
    label: 'Party Platters',
    layout: 'platter-grid',
    order: 5,
    items: [
      { id: 'bihon-guisado', name: 'Bihon Guisado', price: 650, tags: ['#bihon', '#guisado', '#platter'], rating: 4.5, description: 'Thin rice noodles stir-fried with vegetables and shrimp.', serves: '4-5 people', prepTime: '~15 mins' },
      { id: 'pancit-palabok', name: 'Pancit Palabok', price: 700, tags: ['#palabok', '#pancit', '#platter'], rating: 4.6, description: 'Rice noodles in rich annatto sauce with shrimp and pork.', serves: '4-5 people', prepTime: '~15 mins' },
      { id: 'chicken-lumpia-platter', name: 'Chicken Lumpia', price: 550, tags: ['#lumpia', '#chicken', '#platter'], rating: 4.4, description: 'Fresh lumpia with seasoned chicken and vegetables.', serves: '4-5 people', prepTime: '~15 mins' },
      { id: 'glazed-chicken-platter', name: 'Glazed Chicken Platter', price: 950, tags: ['#glazed', '#chicken', '#party'], isBestSeller: true, rating: 4.8, description: 'Full platter of signature glazed chicken.', serves: '6-8 people', prepTime: '~20 mins' },
      { id: 'assorted-platter', name: 'Assorted Platter', price: 250, tags: ['#assorted', '#platter', '#sharing'], rating: 4.3, description: 'Mix of best-selling sides and bites.', serves: '2-3 people', prepTime: '~10 mins' },
      { id: 'ube-puto-platter', name: 'Ube Puto Platter', price: 250, tags: ['#ube', '#puto', '#platter'], rating: 4.4, description: 'Fluffy ube puto steamed to perfection.', serves: '3-4 people', prepTime: '~10 mins' },
    ],
  },
  // ─── Short Orders ──────────────────────────────────────
  {
    id: 'short-orders',
    label: 'Short Orders',
    layout: 'horizontal-list',
    order: 6,
    items: [
      { id: 'sotanghon-guisado', name: 'Sotanghon Guisado', price: 79, tags: ['#sotanghon', '#guisado', '#noodles'], rating: 4.3, description: 'Bean thread noodles sautéed with vegetables and chicken.', serves: '1 person', prepTime: '~8 mins' },
      { id: 'miki-guisado', name: 'Miki Guisado', price: 79, tags: ['#miki', '#guisado', '#noodles'], rating: 4.2, description: 'Thick egg noodles stir-fried with pork and vegetables.', serves: '1 person', prepTime: '~8 mins' },
      { id: 'palabok-short', name: 'Pancit Palabok', price: 79, tags: ['#palabok', '#pancit', '#classic'], rating: 4.4, description: 'Single-serving palabok with annatto sauce and chicharrón.', serves: '1 person', prepTime: '~8 mins' },
      { id: 'chicken-lumpia-short', name: 'Chicken Lumpia', price: 55, tags: ['#lumpia', '#chicken', '#merienda'], rating: 4.1, description: 'Crispy fried chicken lumpia.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'pork-lumpia-short', name: 'Pork Lumpia', price: 55, tags: ['#lumpia', '#pork', '#merienda'], rating: 4.2, description: 'Classic pork lumpia fried golden crisp.', serves: '1 person', prepTime: '~5 mins' },
    ],
  },
  // ─── Snacks ────────────────────────────────────────────
  {
    id: 'snacks',
    label: 'Snacks & Sides',
    layout: 'horizontal-card',
    order: 7,
    items: [
      { id: 'chicken-burger', name: 'Chicken Burger', note: 'Available w/ drink upgrade', tags: ['#burger', '#chicken', '#snacks'], rating: 4.5, description: 'Juicy chicken patty with lettuce, tomato, and special mayo.', serves: '1 person', prepTime: '~8 mins', variants: [{ label: 'Solo', price: 70 }, { label: 'w/ Drink', price: 85, highlight: true }] },
      { id: 'pork-burger', name: 'Pork Burger', note: 'Available w/ drink upgrade', tags: ['#burger', '#pork', '#snacks'], rating: 4.4, description: 'Seasoned pork patty grilled to perfection.', serves: '1 person', prepTime: '~8 mins', variants: [{ label: 'Solo', price: 75 }, { label: 'w/ Drink', price: 90, highlight: true }] },
      { id: 'molo-batchoy', name: 'Pancit Molo / Batchoy', note: 'Hot comfort soups', price: 70, tags: ['#molo', '#batchoy', '#soup'], rating: 4.6, description: 'Iloilo-style soup with wonton wrappers, chicken, and fried garlic.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'flavored-fries', name: 'Flavored Fries', note: 'Sour Cream, Cheese, BBQ', price: 65, tags: ['#fries', '#flavored', '#snacks'], rating: 4.3, description: 'Crispy fries in sour cream, cheese, or BBQ seasoning.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'regular-puto', name: 'Regular Puto', note: 'Soft & fluffy rice cakes', price: 20, tags: ['#puto', '#ricecake', '#merienda'], rating: 4.2, description: 'Classic soft and fluffy rice cakes.', serves: '1 person', prepTime: '~3 mins' },
      { id: 'special-puto', name: 'Special Puto', note: 'Buko Pandan / Chicken Pastil', price: 35, tags: ['#puto', '#special', '#bukopandan'], rating: 4.4, description: 'Flavored puto in buko pandan or chicken pastil.', serves: '1 person', prepTime: '~3 mins' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   CONTENT DATA — mirrors client/src/data/business.js
   ═══════════════════════════════════════════════════════════════ */
const businessData = {
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
  facebook: 'https://facebook.com/triologyrefreshment',
  facebookFollowers: '1.2K',
  facebookUrl: 'https://m.me/triologyrefreshment',
  messengerUrl: 'https://m.me/triologyrefreshment',

  // Stats
  ordersServed: '5k+',
  freshDaily: '100%',
  localReviews: '500+',

  // Year for copyright
  year: 2024,

  // Venue / Event Space
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

  // Navigation
  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'Party Packs', path: '/party-packs' },
    { label: 'Venue', path: '/venue' },
    { label: 'Events', path: '/events' },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   BUNDLE DATA — mirrors client/src/data/bundles.js
   ═══════════════════════════════════════════════════════════════ */
const bundlesData = [
  {
    id: 'classic-triple-feast',
    name: 'The Classic Triple Feast',
    description: 'Pancit, Shanghai, & Chicken',
    serves: '15-20',
    startingPrice: 1200,
    badge: 'Most Popular',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBmDM_UUHj0h4bY-IUl3hKMKOI-G8iiX8Ebi4PNLPBBYAyejJ28aWsF9WWjN10TmurAVqA96ZXDBDjJpi_KwktCc8bWZEw60Cr2F-m3eh6QM5p-PZ-A-JaswTDh2rSO1TKBow3CBymsGak8rEyijWKeO_ipxN5YH8z1Z1eqW79uPEBivjVOm0jQ5tCiOZ93KdnO1cwQoXU-P-jt8hHuE7amjOtNi8RXSS1gCIDRyLDiEtJVOX-bX36CTEOZice_nf_xGvoBNxua0K7b',
    size: 'large',
  },
  {
    id: 'grand-family-reunion',
    name: 'Grand Family Reunion Bundle',
    description: 'Customizable for up to 50 pax',
    serves: 'up to 50',
    startingPrice: 1500,
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDyFDJ0VhZdaLacS-_acHURU_qig84PM_xVKQgYpbWcF6KC6wwOdPaoz0nL8175jL6fHWo9IKkw4_s_AeuSYOAlb5lETu-MvAtE61ntSIBatfDRjSKWhLgHo82b3RlPXn1gZAO9vTBKtBmhyzyx3dHuqfNbvm7v0L4RFeOdKHOxCc-tmQZfnLzUW2xNvMCxtCWRXoLeLOk03N1GtQEQQb3IKRj_g4qHsq3sLaNYZrJ0eJx-OSViDW62EtahkEWYTH3Ucs3qppO-YEbq',
    size: 'wide',
  },
];

const bundleFeaturesData = [
  {
    icon: 'auto_awesome',
    title: 'Custom Bundles',
    description: 'Mix and match your favorite snacks, mains, and drinks.',
  },
  {
    icon: 'delivery_dining',
    title: 'Punctual Delivery',
    description: 'Freshly prepared and delivered right to your doorstep across Iloilo.',
  },
  {
    icon: 'receipt_long',
    title: 'Transparent Pricing',
    description: 'No hidden fees. Professional invoices for corporate bookings.',
  },
];

const menuFilterTabsData = [
  { id: 'all', label: 'All Items' },
  { id: 'rice-meals', label: 'Rice Meals' },
  { id: 'snacks', label: 'Snacks & Delicacies' },
  { id: 'refreshments', label: 'Refreshments' },
];

/* ─── Helpers ──────────────────────────────────────────────── */

/** Upload an image file to Cloudinary, return the secure URL */
async function uploadImage(relativePath) {
  const filePath = resolve(ASSETS_DIR, relativePath);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: CLOUD_FOLDER,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });
    return result.secure_url;
  } catch (err) {
    console.warn(`  ⚠  Upload failed for ${relativePath}: ${err.message}. Skipping.`);
    return null;
  }
}

/** Map a bare filename to its asset path */
function assetPath(name) {
  if (name.includes('/')) return name;
  return name;
}

/* ─── Menu Seeding ────────────────────────────────────────── */

async function seedMenu() {
  const now = new Date();
  let totalItems = 0;

  console.log('\n📁  MENU');

  for (const category of menuData) {
    console.log(`  📂  ${category.label}`);

    // Upload category image
    let catImageUrl = null;
    if (category.id === 'halo-halo') {
      const firstItem = category.items[0];
      catImageUrl = await uploadImage(firstItem.image);
    } else if (category.id === 'all-day-rice') {
      catImageUrl = await uploadImage('rice_meal.jpg');
    }
    if (!catImageUrl) catImageUrl = null;

    // Write category to Firestore
    const catDoc = {
      id: category.id,
      label: category.label,
      layout: category.layout,
      categoryImage: catImageUrl,
      priceNote: category.priceNote || null,
      note: category.note || null,
      order: category.order,
      createdAt: now,
      updatedAt: now,
    };
    await firestore.collection('menu_categories').doc(category.id).set(catDoc);

    // Write items
    for (let i = 0; i < category.items.length; i++) {
      const item = category.items[i];

      // Upload item images
      let itemImageUrl = null;
      if (item.image) {
        itemImageUrl = await uploadImage(assetPath(item.image));
      }

      // Upload carousel images (up to 3)
      const carouselUrls = [];
      if (item.images && item.images.length > 0) {
        for (const img of item.images.slice(0, 3)) {
          const url = await uploadImage(assetPath(img));
          carouselUrls.push(url);
        }
      }

      const itemDoc = {
        id: item.id,
        categoryId: category.id,
        name: item.name,
        image: itemImageUrl,
        images: carouselUrls.length > 0 ? carouselUrls : [],
        price: item.price || null,
        variants: item.variants || [],
        tags: item.tags || [],
        badge: item.badge || null,
        isBestSeller: item.isBestSeller || false,
        note: item.note || null,
        rating: item.rating || null,
        description: item.description || '',
        serves: item.serves || null,
        prepTime: item.prepTime || null,
        order: i,
        createdAt: now,
        updatedAt: now,
      };
      await firestore.collection('menu_items').doc(item.id).set(itemDoc);
      totalItems++;
    }
    console.log(`    ✓ ${category.items.length} items`);
  }

  console.log(`  ✓ ${menuData.length} categories, ${totalItems} items seeded`);
}

/* ─── Content Seeding ─────────────────────────────────────── */

async function seedContent() {
  const now = new Date();

  console.log('\n📄  CONTENT');

  // site_content/business
  await firestore
    .collection('site_content')
    .doc('business')
    .set({ ...businessData, createdAt: now, updatedAt: now });
  console.log('  ✓ business');

  // site_content/bundles
  await firestore
    .collection('site_content')
    .doc('bundles')
    .set({ items: bundlesData, createdAt: now, updatedAt: now });
  console.log('  ✓ bundles');

  // site_content/bundle_features
  await firestore
    .collection('site_content')
    .doc('bundle_features')
    .set({ items: bundleFeaturesData, createdAt: now, updatedAt: now });
  console.log('  ✓ bundle_features');

  // site_content/menu_filter_tabs
  await firestore
    .collection('site_content')
    .doc('menu_filter_tabs')
    .set({ items: menuFilterTabsData, createdAt: now, updatedAt: now });
  console.log('  ✓ menu_filter_tabs');
}

/* ─── Main ─────────────────────────────────────────────────── */

async function main() {
  console.log('🚀  Starting comprehensive seed...\n');

  await seedMenu();
  await seedContent();

  console.log('\n✅  Seed complete! All data pushed to Firestore.');
}

main().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
