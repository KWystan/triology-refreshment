/**
 * Party Pack / Handaan Bundle data.
 * Mirrors the Stitch-generated Party Packs page structure.
 */

export const bundles = [
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
    name: 'Family Packs',
    description: 'Customizable family packs for any gathering',
    serves: 'up to 50',
    startingPrice: 1500,
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDyFDJ0VhZdaLacS-_acHURU_qig84PM_xVKQgYpbWcF6KC6wwOdPaoz0nL8175jL6fHWo9IKkw4_s_AeuSYOAlb5lETu-MvAtE61ntSIBatfDRjSKWhLgHo82b3RlPXn1gZAO9vTBKtBmhyzyx3dHuqfNbvm7v0L4RFeOdKHOxCc-tmQZfnLzUW2xNvMCxtCWRXoLeLOk03N1GtQEQQb3IKRj_g4qHsq3sLaNYZrJ0eJx-OSViDW62EtahkEWYTH3Ucs3qppO-YEbq',
    size: 'wide',
  },
  {
    id: 'mix-match-share-5',
    name: 'Mix and Match Share 5',
    description: 'French Fries, Lumpia Shanghai, Platter of Choice & Iced Tea',
    serves: '5',
    startingPrice: 860,
    badge: null,
    image: null,
    size: 'wide',
    items: [
      'French Fries (Family Size 450g)',
      'Lumpia Shanghai Platter',
      '1 Any Platter of Choice',
      'Iced Tea Bottomless',
    ],
  },
  {
    id: 'barkada-combo-share-8',
    name: 'Barkada Combo Share 8',
    description: 'French Fries, Fried Chicken Chops, Bilao of Choice & Blue Iced Tea',
    serves: '8',
    startingPrice: 1330,
    badge: null,
    image: null,
    size: 'wide',
    items: [
      'French Fries (Family Size 450g)',
      '(Bucket) Fried Chicken Chops',
      'Bilao of Choice',
      'Blue Bottomless Iced Tea',
    ],
  },
  {
    id: 'family-combo-10',
    name: 'Family Combo Meal for 10',
    description: 'Fries, Puto, Miki Batchoy, Bilao, Lumpia & Halo-Halo',
    serves: '10',
    startingPrice: 1640,
    badge: null,
    image: null,
    size: 'wide',
    items: [
      '3 French Fries of Choice',
      '1 Serve Plain Puto',
      '2 Miki Batchoys',
      '1 A Bilao of Choice',
      '1 Platter of Lumpia (Pork or Chicken)',
      '2 Any Halo-Halo Overloads (Regular Size)',
    ],
  },
  {
    id: 'family-combo-12',
    name: 'Family Combo Meal for 12',
    description: 'Puto, Lumpia Shanghai, Glazed Chicken, Java Rice & Lemonade',
    serves: '12',
    startingPrice: 1900,
    badge: null,
    image: null,
    size: 'wide',
    items: [
      '20 Pcs Plain Puto',
      '1 Platter Lumpia Shanghai',
      '12 Pcs Glazed Chicken',
      '12 Java Rice',
      'Bottomless Cucumber Lemonade',
    ],
  },
  {
    id: 'family-meal-15',
    name: 'Family Meal of 15',
    description: 'Rice, Puto, Bilao, Burgers, Lumpia & Halo-Halo',
    serves: '15',
    startingPrice: 2160,
    badge: null,
    image: null,
    size: 'wide',
    items: [
      '6 Serves of Plain Rice',
      '1 Platter of Puto (Any of Choice)',
      '1 Bilao (Any of Choice)',
      '4 Pork Burgers',
      '1 Lumpia Platter (Any of Choice)',
      '4 Regular Size Halo-Halo Overloads',
    ],
  },
];

export const bundleFeatures = [
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

export const menuFilterTabs = [
  { id: 'all', label: 'All Items' },
  { id: 'rice-meals', label: 'Rice Meals' },
  { id: 'snacks', label: 'Snacks & Delicacies' },
  { id: 'refreshments', label: 'Refreshments' },
];
