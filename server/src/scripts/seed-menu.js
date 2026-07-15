/**
 * Seed Menu — one-time migration of static menu data into Firestore.
 *
 * Creates menu_categories and menu_items collections in Firestore
 * with placeholder images (null). 8 categories, 52 items total.
 *
 * Run: node src/scripts/seed-menu.js
 */
import { firestore } from '../config/firebase.js';

/* ─── Menu Data ────────────────────────────────────────────── */
// Mirrors client/src/data/menuItems.js structure
const menuData = [
  // ─── Halo-Halo ──────────────────────────────────────────
  {
    id: 'halo-halo',
    label: 'Halo-Halo Overloads',
    layout: 'compact-square',
    priceNote: '₱89 Reg / ₱109 Big',
    order: 1,
    items: [
      { id: 'ube-craze', name: 'Ube Craze Crush Overload', badge: 'Best Seller', isBestSeller: true, rating: 4.8, description: 'Rich and creamy ube-flavored halo-halo loaded with sweet toppings, leche flan, and ube ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#ube', '#halohalo', '#overload'] },
      { id: 'coco-pandan', name: 'Coco Pandan Crush Overload', rating: 4.7, description: 'A refreshing blend of coconut strips, pandan jelly, and creamy milk topped with coconut ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#coconut', '#pandan', '#halohalo'] },
      { id: 'cremelon', name: "Creme'Lon Overload", rating: 4.5, description: 'Cool and fruity melon-flavored halo-halo with fresh melon slices, sago, and a scoop of melon ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#cremelon', '#melon', '#halohalo'] },
      { id: 'real-mango', name: 'Real Mango Overload', rating: 4.6, description: 'Sweet ripe mangoes layered with shaved ice, evaporated milk, and mango ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#mango', '#halohalo', '#sweet'] },
      { id: 'say-cheese', name: 'Say Cheese Halo Overload', rating: 4.4, description: 'A unique savory-sweet halo-halo with cheese strips, macapuno, and a scoop of cheese ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#cheese', '#halohalo', '#savory'] },
      { id: 'halo-cado', name: 'Halo Cado Overload', rating: 4.7, description: 'Creamy avocado slices meet shaved ice and milk, topped with avocado ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#avocado', '#halohalo', '#creamy'] },
      { id: 'mais-con-yelo', name: 'Mais Con Yelo Halo Overload', rating: 4.3, description: 'Sweet corn kernels over shaved ice with milk and a scoop of corn ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#mais', '#corn', '#halohalo'] },
      { id: 'banana', name: 'Banana Overload', rating: 4.2, description: 'Caramelized saba bananas layered with shaved ice, milk, and banana ice cream.', serves: '1 person', prepTime: '~5 mins', tags: ['#banana', '#halohalo', '#saba'] },
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
      { id: 'miki-guisado-platter', name: 'Miki Guisado', price: 650, tags: ['#miki', '#guisado', '#platter'], rating: 4.4, description: 'Thick egg noodles stir-fried with pork and vegetables.', serves: '4-5 people', prepTime: '~15 mins' },
      { id: 'pancit-palabok', name: 'Pancit Palabok', price: 700, tags: ['#palabok', '#pancit', '#platter'], rating: 4.6, description: 'Rice noodles in rich annatto sauce with shrimp and pork.', serves: '4-5 people', prepTime: '~15 mins' },
      { id: 'sotanghon-guisado-platter', name: 'Sotanghon Guisado', price: 650, tags: ['#sotanghon', '#guisado', '#platter'], rating: 4.4, description: 'Bean thread noodles sautéed with vegetables and chicken.', serves: '4-5 people', prepTime: '~15 mins' },
      { id: 'chicken-lumpia-platter', name: 'Chicken Lumpia', price: 550, tags: ['#lumpia', '#chicken', '#platter'], rating: 4.4, description: 'Fresh lumpia with seasoned chicken and vegetables.', serves: '4-5 people', prepTime: '~15 mins' },
      { id: 'pork-lumpia-platter', name: 'Pork Lumpia', price: 550, tags: ['#lumpia', '#pork', '#platter'], rating: 4.3, description: 'Crispy pork lumpia — perfect for sharing.', serves: '4-5 people', prepTime: '~15 mins' },
      { id: 'half-n-half-combo', name: 'Half-N-Half Combo', price: 750, tags: ['#combo', '#platter', '#sharing'], rating: 4.6, description: 'Pick two of your favorites from our noodle and lumpia selections.', serves: '4-6 people', prepTime: '~15 mins' },
      { id: 'glazed-chicken-platter', name: 'Glazed Chicken Platter', price: 950, tags: ['#glazed', '#chicken', '#party'], isBestSeller: true, rating: 4.8, description: 'Full platter of signature glazed chicken.', serves: '6-8 people', prepTime: '~20 mins' },
      { id: 'chicken-pastil-puto-platter', name: 'Chicken Pastil Puto Platter', price: 300, tags: ['#puto', '#pastil', '#chicken', '#platter'], rating: 4.4, description: 'Fluffy puto topped with seasoned chicken pastil.', serves: '3-4 people', prepTime: '~10 mins' },
      { id: 'assorted-platter', name: 'Assorted Platter', price: 250, tags: ['#assorted', '#platter', '#sharing'], rating: 4.3, description: 'Mix of best-selling sides and bites.', serves: '2-3 people', prepTime: '~10 mins' },
      { id: 'plain-puto-platter', name: 'Plain Puto Platter', price: 200, tags: ['#puto', '#plain', '#platter'], rating: 4.2, description: 'Classic soft and fluffy puto.', serves: '3-4 people', prepTime: '~10 mins' },
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
      { id: 'creamy-pancit-molo', name: 'Creamy Pancit Molo', note: 'Hot comfort soup', price: 70, tags: ['#molo', '#soup', '#snacks'], rating: 4.6, description: 'Iloilo-style soup with wonton wrappers, chicken, and creamy broth.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'miki-batchoy', name: 'Miki Batchoy', note: 'Hot comfort bowl', price: 75, tags: ['#batchoy', '#miki', '#soup'], rating: 4.5, description: 'Savory miki batchoy with thick egg noodles, pork, and fried garlic.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'beef-pata', name: 'Beef Pata', note: 'Rich beef shank soup', price: 95, tags: ['#beef', '#pata', '#soup'], rating: 4.3, description: 'Tender beef pata simmered in flavorful broth.', serves: '1 person', prepTime: '~8 mins' },
      { id: 'sour-cream-fries', name: 'Sour Cream Fries', note: 'Crispy coated fries', price: 65, tags: ['#fries', '#sourcream', '#snacks'], rating: 4.3, description: 'Crispy fries tossed in tangy sour cream seasoning.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'cheese-fries', name: 'Cheese Fries', note: 'Crispy coated fries', price: 65, tags: ['#fries', '#cheese', '#snacks'], rating: 4.4, description: 'Crispy fries loaded with savory cheese seasoning.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'bbq-fries', name: 'BBQ Fries', note: 'Crispy coated fries', price: 65, tags: ['#fries', '#bbq', '#snacks'], rating: 4.2, description: 'Crispy fries tossed in smoky BBQ seasoning.', serves: '1 person', prepTime: '~5 mins' },
      { id: 'regular-puto', name: 'Regular Puto', note: 'Soft & fluffy rice cakes', price: 20, tags: ['#puto', '#ricecake', '#merienda'], rating: 4.2, description: 'Classic soft and fluffy rice cakes.', serves: '1 person', prepTime: '~3 mins' },
      { id: 'buko-pandan-puto', name: 'Buko Pandan Puto', note: 'Flavored rice cakes', price: 35, tags: ['#puto', '#bukopandan', '#merienda'], rating: 4.4, description: 'Soft puto infused with buko pandan.', serves: '1 person', prepTime: '~3 mins' },
      { id: 'chicken-pastil-puto', name: 'Chicken Pastil Puto', note: 'Savory topped rice cakes', price: 35, tags: ['#puto', '#pastil', '#chicken', '#merienda'], rating: 4.3, description: 'Fluffy puto topped with savory chicken pastil.', serves: '1 person', prepTime: '~3 mins' },
    ],
  },
];

/* ─── Main ─────────────────────────────────────────────────── */

async function main() {
  console.log('🚀  Starting menu seed...\n');

  const now = new Date();

  for (const category of menuData) {
    console.log(`📁  ${category.label}`);

    // Write category to Firestore (all images as null)
    const catDoc = {
      id: category.id,
      label: category.label,
      layout: category.layout,
      categoryImage: null,
      priceNote: category.priceNote || null,
      note: category.note || null,
      order: category.order,
      createdAt: now,
      updatedAt: now,
    };
    await firestore.collection('menu_categories').doc(category.id).set(catDoc);
    console.log(`  ✓ Category saved (${category.items.length} items)`);

    // Write items to Firestore (all images as null)
    for (let i = 0; i < category.items.length; i++) {
      const item = category.items[i];

      const itemDoc = {
        id: item.id,
        categoryId: category.id,
        name: item.name,
        image: null,
        images: [],
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
      console.log(`  ✓  ${i + 1}. ${item.name}`);
    }
    console.log();
  }

  console.log('✅  Seed complete!');
  console.log(`   ${menuData.length} categories, ${menuData.reduce((s, c) => s + c.items.length, 0)} items`);
}

main().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
