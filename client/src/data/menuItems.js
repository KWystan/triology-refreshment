/**
 * Menu data — complete shop menu from Stitch "Our Full Menu - Triology Refreshment".
 * 7 categories, 41 items, each category has a shared image and a layout type
 * that determines the card rendering in Menu.jsx.
 *
 * Layout types:
 *   compact-square  → rounded-2xl centered squares (Halo-Halo)
 *   rice-card       → h-48 image with price overlay, order button (Rice Meals)
 *   circular        → rounded-full aspect-square images (Breakfast)
 *   compact-card    → h-32 image, centered text, price below (Pasta)
 *   platter-grid    → large aspect-square image, name + price row below (Party Platters)
 *   horizontal-list → small w-16 thumbnail, inline name + price (Short Orders)
 *   horizontal-card → w-24 thumbnail, description, price variants (Snacks)
 */

import riceMealImg from '../assets/rice_meal.jpg';

// ─── Halo-Halo real images (existing assets) ─────────────
import ubeCrazeImg from '../assets/halo_halo/ube_craze_crash_overload.png';
import cocoPandanImg from '../assets/halo_halo/coco_pandan_crash_overload.png';
import cremelonImg from "../assets/halo_halo/creme'lon_overload.png";
import realMangoImg from '../assets/halo_halo/real_mango_overload.png';
import sayCheeseImg from '../assets/halo_halo/say_cheese_halo_overload.png';
import haloCadoImg from '../assets/halo_halo/halo_cado_overload.png';
import maisConYeloImg from '../assets/halo_halo/mais_con_yelo_halo_overload.png';
import bananaImg from '../assets/halo_halo/banana_overload.png';

export const menuCategories = [
  {
    id: 'halo-halo',
    label: 'Halo-Halo Overloads',
    layout: 'compact-square',
    priceNote: '₱89 Reg / ₱109 Big',
    items: [
      { id: 'ube-craze', name: 'Ube Craze', image: ubeCrazeImg, tags: ['#ube', '#halohalo', '#overload'], images: [ubeCrazeImg], badge: 'Best Seller', isBestSeller: true, rating: 4.8, description: 'Rich and creamy ube-flavored halo-halo loaded with sweet toppings, leche flan, and ube ice cream.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'coco-pandan', name: 'Coco Pandan', image: cocoPandanImg, tags: ['#coconut', '#pandan', '#halohalo'], images: [cocoPandanImg], rating: 4.7, description: 'A refreshing blend of coconut strips, pandan jelly, and creamy milk topped with coconut ice cream.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'cremelon', name: "Creme'lon", image: cremelonImg, tags: ['#cremelon', '#melon', '#halohalo'], images: [cremelonImg], rating: 4.5, description: 'Cool and fruity melon-flavored halo-halo with fresh melon slices, sago, and a scoop of melon ice cream.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'real-mango', name: 'Real Mango', image: realMangoImg, tags: ['#mango', '#halohalo', '#sweet'], images: [realMangoImg], rating: 4.6, description: 'Sweet ripe mangoes layered with shaved ice, evaporated milk, and mango ice cream — a tropical delight.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'say-cheese', name: 'Say Cheese', image: sayCheeseImg, tags: ['#cheese', '#halohalo', '#savory'], images: [sayCheeseImg], rating: 4.4, description: 'A unique savory-sweet halo-halo with cheese strips, macapuno, and a scoop of cheese ice cream.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'halo-cado', name: 'Halo Cado', image: haloCadoImg, tags: ['#avocado', '#halohalo', '#creamy'], images: [haloCadoImg], rating: 4.7, description: 'Creamy avocado slices meet shaved ice and milk, topped with avocado ice cream — simple and divine.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'mais-con-yelo', name: 'Mais Con Yelo', image: maisConYeloImg, tags: ['#mais', '#corn', '#halohalo'], images: [maisConYeloImg], rating: 4.3, description: 'Sweet corn kernels over shaved ice with milk and a scoop of corn ice cream — a classic Filipino favorite.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'banana', name: 'Banana', image: bananaImg, tags: ['#banana', '#halohalo', '#saba'], images: [bananaImg], rating: 4.2, description: 'Caramelized saba bananas layered with shaved ice, milk, and banana ice cream — sweet comfort.', serves: '1 person', prepTime: '~5 mins' },
    ],
  },
  {
    id: 'all-day-rice',
    label: 'All Day Rice Meals',
    categoryImage: riceMealImg,
    layout: 'rice-card',
    items: [
      { id: 'fried-chicken-rice', name: 'Fried Chicken Rice Meal', price: 120, tags: ['#friedchicken', '#ricemeal', '#sulit'], rating: 4.5, description: 'Crispy fried chicken served with steaming white rice and your choice of sauce — a hearty everyday favorite.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'glazed-chicken-rice', name: 'Glazed Chicken Rice Meal', price: 120, tags: ['#glazed', '#chicken', '#ricemeal'], rating: 4.6, description: 'Tender chicken glazed in a sweet-savory sauce paired with garlic rice — comfort food at its best.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'lumpia-shanghai-rice', name: 'Lumpia Shanghai Rice Meal', price: 120, tags: ['#lumpia', '#shanghai', '#ricemeal'], rating: 4.4, description: 'Crispy lumpia Shanghai rolls with garlic rice and dipping sauce — a classic combo that never disappoints.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'bbq-liempo-rice', name: 'BBQ Glazed Liempo Rice Meal', price: 135, tags: ['#bbq', '#liempo', '#ricemeal'], badge: 'Best Seller', isBestSeller: true, rating: 4.7, description: 'Juicy grilled pork liempo basted in our signature BBQ glaze, served with hot garlic rice and atchara.', serves: '1 person', prepTime: '~12 mins' },
    ],
  },
  {
    id: 'breakfast',
    label: 'Breakfast Meals',
    layout: 'circular',
    items: [
      { id: 'tosilog', name: 'Tosilog', price: 109, tags: ['#tocino', '#silog', '#breakfast'], badge: 'Best Seller', isBestSeller: true, rating: 4.7, description: 'Sweet Filipino tocino served with garlic rice, fried egg, and fresh tomato — the breakfast classic.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'hotsilog', name: 'Hotsilog', price: 109, tags: ['#hotdog', '#silog', '#breakfast'], rating: 4.3, description: 'Juicy Filipino-style hotdog with garlic rice and fried egg — a familiar comfort any time of day.', serves: '1 person', prepTime: '~8 mins' },
      { id: 'cornsilog', name: 'Cornsilog', price: 109, tags: ['#cornedbeef', '#silog', '#breakfast'], rating: 4.4, description: 'Savory corned beef sautéed with onions, partnered with garlic rice and a sunny-side egg.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'adobsilog', name: 'Adobsilog', price: 109, tags: ['#adobo', '#silog', '#breakfast'], rating: 4.6, description: 'Tender chicken adobo simmered in soy-vinegar sauce, served with garlic rice and egg.', serves: '1 person', prepTime: '~8 mins' },
      { id: 'chosilog', name: 'Chosilog', price: 109, tags: ['#chicken', '#silog', '#breakfast'], rating: 4.3, description: 'Marinated grilled chicken with garlic rice and fried egg — simple, satisfying, and always good.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'pork-tapsilog', name: 'Pork Tapsilog', price: 109, tags: ['#tapa', '#silog', '#breakfast'], rating: 4.5, description: 'Classic beef tapa marinated in a sweet-savory glaze, served with garlic rice and egg.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'chicken-guisalog', name: 'Chicken Guisalog', price: 135, tags: ['#guisado', '#chicken', '#silog'], rating: 4.8, description: 'Our signature chicken guisado — slow-cooked in a rich tomato-based sauce with bell peppers and spices.', serves: '1 person', prepTime: '~12 mins' },
    ],
  },
  {
    id: 'pasta',
    label: 'Pasta Meals',
    layout: 'compact-card',
    note: 'All include a drink',
    items: [
      { id: 'chicken-alfredo', name: 'Yummy Chicken Alfredo', price: 135, tags: ['#alfredo', '#chicken', '#pasta'], badge: 'Best Seller', isBestSeller: true, rating: 4.6, description: 'Creamy alfredo sauce blanketing tender chicken and fettuccine — rich, indulgent, and utterly satisfying.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'cheezy-baked-mac', name: 'Cheezy Baked Mac', price: 125, tags: ['#bakedmac', '#cheezy', '#pasta'], rating: 4.5, description: 'Elbow macaroni baked in a creamy cheese sauce with a golden crust — pure comfort in every bite.', serves: '1 person', prepTime: '~12 mins' },
      { id: 'cream-carbonara', name: 'Cream Carbonara', price: 130, tags: ['#carbonara', '#creamy', '#pasta'], rating: 4.4, description: 'Spaghetti tossed in a velvety carbonara sauce with bacon bits and parmesan — a creamy classic.', serves: '1 person', prepTime: '~10 mins' },
      { id: 'meaty-lasagna', name: 'Meaty Lasagna', price: 140, tags: ['#lasagna', '#meaty', '#pasta'], rating: 4.7, description: 'Layers of pasta, seasoned ground meat, rich tomato sauce, and melted cheese — baked to perfection.', serves: '1 person', prepTime: '~15 mins' },
      { id: 'spaghetti', name: 'Spaghetti', price: 85, tags: ['#spaghetti', '#classic', '#pasta'], rating: 4.3, description: 'Classic spaghetti in a sweet-style Filipino meat sauce — a nostalgic favorite for all ages.', serves: '1 person', prepTime: '~8 mins' },
    ],
  },
  {
    id: 'platters',
    label: 'Party Platters',
    layout: 'platter-grid',
    items: [
      { id: 'bihon-guisado', name: 'Bihon Guisado', price: 650, tags: ['#bihon', '#guisado', '#platter'], rating: 4.5, description: 'Thin rice noodles stir-fried with vegetables, shrimp, and savory seasonings — a party essential.', serves: '4-5 people', prepTime: '~15 mins' },
      { id: 'pancit-palabok', name: 'Pancit Palabok', price: 700, tags: ['#palabok', '#pancit', '#platter'], rating: 4.6, description: 'Rice noodles drenched in a rich annatto sauce topped with shrimp, pork, eggs, and crispy garlic.', serves: '4-5 people', prepTime: '~15 mins' },
      { id: 'chicken-lumpia-platter', name: 'Chicken Lumpia', price: 550, tags: ['#lumpia', '#chicken', '#platter'], rating: 4.4, description: 'Fresh lumpia filled with seasoned chicken and vegetables, served with sweet dipping sauce.', serves: '4-5 people', prepTime: '~15 mins' },
      { id: 'glazed-chicken-platter', name: 'Glazed Chicken Platter', price: 950, tags: ['#glazed', '#chicken', '#party'], rating: 4.8, description: 'A full platter of our signature glazed chicken — perfect for sharing at gatherings and celebrations.', serves: '6-8 people', prepTime: '~20 mins' },
      { id: 'assorted-platter', name: 'Assorted Platter', price: 250, tags: ['#assorted', '#platter', '#sharing'], rating: 4.3, description: 'A mix of our best-selling sides and bites — great for sampling a little bit of everything.', serves: '2-3 people', prepTime: '~10 mins' },
      { id: 'ube-puto-platter', name: 'Ube Puto Platter', price: 250, tags: ['#ube', '#puto', '#platter'], rating: 4.4, description: 'Fluffy ube puto steamed to perfection — a sweet purple yam treat that pairs well with any occasion.', serves: '3-4 people', prepTime: '~10 mins' },
    ],
  },
  {
    id: 'short-orders',
    label: 'Short Orders',
    layout: 'horizontal-list',
    items: [
      { id: 'sotanghon-guisado', name: 'Sotanghon Guisado', price: 79, tags: ['#sotanghon', '#guisado', '#noodles'], rating: 4.3, description: 'Bean thread noodles sautéed with vegetables and chicken in a savory broth — light yet satisfying.', serves: '1 person', prepTime: '~8 mins' },
      { id: 'miki-guisado', name: 'Miki Guisado', price: 79, tags: ['#miki', '#guisado', '#noodles'], rating: 4.2, description: 'Thick egg noodles stir-fried with pork and vegetables in a rich, flavorful sauce.', serves: '1 person', prepTime: '~8 mins' },
      { id: 'palabok-short', name: 'Pancit Palabok', price: 79, tags: ['#palabok', '#pancit', '#classic'], rating: 4.4, description: 'Single-serving palabok with orange annatto sauce, crushed chicharrón, and a boiled egg.', serves: '1 person', prepTime: '~8 mins' },
      { id: 'chicken-lumpia-short', name: 'Chicken Lumpia', price: 55, tags: ['#lumpia', '#chicken', '#merienda'], rating: 4.1, description: 'Crispy fried chicken lumpia — golden, crunchy, and perfect for a quick merienda fix.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'pork-lumpia-short', name: 'Pork Lumpia', price: 55, tags: ['#lumpia', '#pork', '#merienda'], rating: 4.2, description: 'Classic pork lumpia fried to a golden crisp — pairs perfectly with our sweet chili dip.', serves: '1 person', prepTime: '~5 mins' },
    ],
  },
  {
    id: 'snacks',
    label: 'Snacks & Sides',
    layout: 'horizontal-card',
    items: [
      {
        id: 'chicken-burger',
        name: 'Chicken Burger',
        note: 'Available w/ drink upgrade',
        tags: ['#burger', '#chicken', '#snacks'],
        rating: 4.5,
        description: 'Juicy chicken patty with fresh lettuce, tomato, and our special mayo sauce — a crowd-pleaser.',
        serves: '1 person',
        prepTime: '~8 mins',
        variants: [
          { label: 'Solo', price: 70 },
          { label: 'w/ Drink', price: 85, highlight: true },
        ],
      },
      {
        id: 'pork-burger',
        name: 'Pork Burger',
        note: 'Available w/ drink upgrade',
        tags: ['#burger', '#pork', '#snacks'],
        rating: 4.4,
        description: 'Seasoned pork patty grilled to perfection, served with fresh veggies and tangy sauce.',
        serves: '1 person',
        prepTime: '~8 mins',
        variants: [
          { label: 'Solo', price: 75 },
          { label: 'w/ Drink', price: 90, highlight: true },
        ],
      },
      {
        id: 'molo-batchoy',
        name: 'Pancit Molo / Batchoy',
        note: 'Hot comfort soups',
        price: 70,
        tags: ['#molo', '#batchoy', '#soup'],
        rating: 4.6,
        description: 'A warm bowl of Iloilo-style soup with wonton wrappers, shredded chicken, and crunchy fried garlic.',
        serves: '1 person',
        prepTime: '~5 mins',
      },
      {
        id: 'flavored-fries',
        name: 'Flavored Fries',
        note: 'Sour Cream, Cheese, BBQ',
        price: 65,
        tags: ['#fries', '#flavored', '#snacks'],
        rating: 4.3,
        description: 'Crispy golden fries tossed in your choice of sour cream, cheese, or BBQ seasoning.',
        serves: '1 person',
        prepTime: '~5 mins',
      },
      {
        id: 'regular-puto',
        name: 'Regular Puto',
        note: 'Soft & fluffy rice cakes',
        price: 20,
        tags: ['#puto', '#ricecake', '#merienda'],
        rating: 4.2,
        description: 'Classico soft and fluffy rice cakes — a timeless Filipino merienda that goes with everything.',
        serves: '1 person',
        prepTime: '~3 mins',
      },
      {
        id: 'special-puto',
        name: 'Special Puto',
        note: 'Buko Pandan / Chicken Pastil',
        price: 35,
        tags: ['#puto', '#special', '#bukopandan'],
        rating: 4.4,
        description: 'Flavored puto in buko pandan or chicken pastil — a delightful twist on a classic favorite.',
        serves: '1 person',
        prepTime: '~3 mins',
      },
    ],
  },
];

