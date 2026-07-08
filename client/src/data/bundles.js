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
    size: 'large', // spans 2x2 in bento grid
  },
  {
    id: 'grand-family-reunion',
    name: 'Grand Family Reunion Bundle',
    description: 'Customizable for up to 50 pax',
    serves: 'up to 50',
    badge: null,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDyFDJ0VhZdaLacS-_acHURU_qig84PM_xVKQgYpbWcF6KC6wwOdPaoz0nL8175jL6fHWo9IKkw4_s_AeuSYOAlb5lETu-MvAtE61ntSIBatfDRjSKWhLgHo82b3RlPXn1gZAO9vTBKtBmhyzyx3dHuqfNbvm7v0L4RFeOdKHOxCc-tmQZfnLzUW2xNvMCxtCWRXoLeLOk03N1GtQEQQb3IKRj_g4qHsq3sLaNYZrJ0eJx-OSViDW62EtahkEWYTH3Ucs3qppO-YEbq',
    size: 'wide', // spans 2 cols
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
