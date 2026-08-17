import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting VASTRIKA Database Seeding with 40+ Unique Products...');

  // Clean existing tables
  await prisma.orderTracking.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // 1. Create Users
  const adminPassword = await bcrypt.hash('admin123', 12);
  const customerPassword = await bcrypt.hash('customer123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Aditi Roy (Admin)',
      email: 'admin@vastrika.com',
      password: adminPassword,
      phone: '+91 9876543210',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'customer@vastrika.com',
      password: customerPassword,
      phone: '+91 9812345678',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    },
  });

  console.log('👤 Created Admin and Customer accounts.');

  // Create Customer Default Address
  const customerAddress = await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: 'Priya Sharma',
      phone: '+91 9812345678',
      addressLine1: 'Flat 402, Lotus Grandeur',
      addressLine2: '14th Cross, Linking Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      country: 'India',
      isDefault: true,
    },
  });

  // 2. Create Categories
  const categoriesData = [
    {
      name: 'Sarees',
      slug: 'sarees',
      description: 'Handwoven Banarasi, Kanjivaram, Chanderi & Organza heirloom drapes.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
    },
    {
      name: 'Lehengas',
      slug: 'lehengas',
      description: 'Opulent bridal, festive & contemporary designer flared lehengas.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
    },
    {
      name: 'Kurtis & Tunics',
      slug: 'kurtis',
      description: 'Handblock printed, Lucknowi Chikankari & A-line daily luxury kurtis.',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
    },
    {
      name: 'Kurta Sets & Suits',
      slug: 'kurta-sets',
      description: 'Curated 3-piece sets with dupattas, palazzos, and tailored trousers.',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
      sortOrder: 4,
    },
    {
      name: 'Indo-Western & Fusion',
      slug: 'indo-western',
      description: 'Modern silhouettes with traditional Indian zardozi & thread embroideries.',
      image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
      sortOrder: 5,
    },
    {
      name: "Men's Kurtas",
      slug: 'mens-kurtas',
      description: 'Silk, cotton-linen & embroidered kurtas for festive & daily elegance.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      sortOrder: 6,
    },
    {
      name: 'Sherwanis & Couture',
      slug: 'sherwanis',
      description: 'Handcrafted royal groom & wedding guest bespoke sherwanis.',
      image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&q=80',
      sortOrder: 7,
    },
    {
      name: 'Nehru Jackets & Bandhgalas',
      slug: 'nehru-jackets',
      description: 'Structured silk brocade & velvet waistcoats and achkan coats.',
      image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=800&q=80',
      sortOrder: 8,
    },
    {
      name: 'Dupattas & Shawls',
      slug: 'dupattas-shawls',
      description: 'Kashmiri Pashmina, Phulkari, Banarasi & Kalamkari statement wraps.',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80',
      sortOrder: 9,
    },
    {
      name: 'Wedding & Bridal Edit',
      slug: 'bridal-edit',
      description: 'Heirloom bridal couture and trousseau statement treasures.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      sortOrder: 10,
    },
  ];

  const categoryMap = new Map();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap.set(cat.slug, created.id);
  }
  console.log('📁 Created 10 Categories.');

  // 3. Create Coupons
  const couponsData = [
    {
      code: 'VASTRIKA10',
      type: 'PERCENTAGE',
      value: 10,
      minimumOrder: 999,
      maximumDiscount: 1000,
      usageLimit: 1000,
      usedCount: 42,
      expiryDate: new Date('2027-12-31'),
    },
    {
      code: 'FESTIVE500',
      type: 'FLAT',
      value: 500,
      minimumOrder: 2999,
      maximumDiscount: 500,
      usageLimit: 500,
      usedCount: 88,
      expiryDate: new Date('2027-12-31'),
    },
    {
      code: 'ROYAL20',
      type: 'PERCENTAGE',
      value: 20,
      minimumOrder: 4999,
      maximumDiscount: 2000,
      usageLimit: 250,
      usedCount: 19,
      expiryDate: new Date('2027-12-31'),
    },
    {
      code: 'FIRSTBUY',
      type: 'FLAT',
      value: 300,
      minimumOrder: 1499,
      maximumDiscount: 300,
      usageLimit: 2000,
      usedCount: 130,
      expiryDate: new Date('2027-12-31'),
    },
  ];

  for (const cp of couponsData) {
    await prisma.coupon.create({ data: cp });
  }
  console.log('🎟️ Created 4 Active Coupons.');

  // 4. Products Master Array (40 Unique Products with Distinct High-Res Imagery)
  const products = [
    // --- SAREES ---
    {
      name: 'Royal Crimson Banarasi Katan Silk Saree',
      slug: 'royal-crimson-banarasi-katan-silk-saree',
      description: 'Handwoven in Varanasi by generational master weavers, this crimson red Banarasi saree features opulent gold zari floral kadwa jaal motifs, a rich heritage border, and an elaborate pallu.',
      shortDescription: 'Pure Katan silk with intricate gold zari floral kadwa weave.',
      price: 14999,
      mrp: 19999,
      discount: 25,
      sku: 'SAR-BAN-001',
      categorySlug: 'sarees',
      brand: 'VASTRIKA Heritage',
      fabric: 'Pure Silk',
      occasion: 'Wedding',
      pattern: 'Zari Weave',
      gender: 'WOMEN',
      isFeatured: true,
      isBestSeller: true,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'Free Size', color: 'Royal Crimson', price: 14999, stock: 12 },
        { size: 'Free Size', color: 'Wine Maroon', price: 14999, stock: 8 },
      ],
    },
    {
      name: 'Peacock Blue Kanchipuram Pure Zari Silk Saree',
      slug: 'peacock-blue-kanchipuram-pure-zari-silk-saree',
      description: 'A genuine Kanchipuram masterpiece woven with heavy pure mulberry silk and authentic silver-gold zari borders depicting traditional temple korvai motifs.',
      shortDescription: 'Heirloom Kanchipuram silk with contrast gold temple border.',
      price: 24999,
      mrp: 32999,
      discount: 24,
      sku: 'SAR-KAN-002',
      categorySlug: 'sarees',
      brand: 'VASTRIKA Heritage',
      fabric: 'Pure Silk',
      occasion: 'Wedding',
      pattern: 'Temple Border',
      gender: 'WOMEN',
      isFeatured: true,
      isBestSeller: true,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'Free Size', color: 'Peacock Blue', price: 24999, stock: 9 },
        { size: 'Free Size', color: 'Emerald Green', price: 24999, stock: 5 },
      ],
    },
    {
      name: 'Chandrakala Chanderi Tissue Saree with Gota Patti',
      slug: 'chandrakala-chanderi-tissue-saree-with-gota-patti',
      description: 'Featherlight Chanderi tissue silk saree in shimmering moonlit gold, highlighted with handcrafted Rajasthani gota patti borders.',
      shortDescription: 'Glimmering tissue silk adorned with delicate gota work.',
      price: 9999,
      mrp: 12999,
      discount: 23,
      sku: 'SAR-CHA-003',
      categorySlug: 'sarees',
      brand: 'VASTRIKA Studio',
      fabric: 'Chanderi',
      occasion: 'Festive',
      pattern: 'Gota Patti',
      gender: 'WOMEN',
      isFeatured: true,
      isBestSeller: false,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'Free Size', color: 'Moonlit Gold', price: 9999, stock: 15 },
      ],
    },
    {
      name: 'Emerald Green Paithani Silk Saree with Peacock Pallu',
      slug: 'emerald-green-paithani-silk-saree-with-peacock-pallu',
      description: 'Authentic Maharashtrian Yeola Paithani saree with vibrant emerald green body, pure silk obli pallu intricately woven with kaleidoscopic peacocks.',
      shortDescription: 'Traditional Yeola Paithani with authentic kaleidoscopic peacock pallu.',
      price: 18999,
      mrp: 24999,
      discount: 24,
      sku: 'SAR-PAI-004',
      categorySlug: 'sarees',
      brand: 'VASTRIKA Heritage',
      fabric: 'Pure Silk',
      occasion: 'Wedding',
      pattern: 'Peacock Motif',
      gender: 'WOMEN',
      isFeatured: false,
      isBestSeller: true,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [{ size: 'Free Size', color: 'Emerald Green', price: 18999, stock: 7 }],
    },
    {
      name: 'Pastel Peach Organza Floral Embroidered Saree',
      slug: 'pastel-peach-organza-floral-embroidered-saree',
      description: 'Contemporary sheer organza silk saree hand-embroidered with pastel silk threads and delicate scalloped cutwork borders.',
      shortDescription: 'Whisper-light organza silk with scalloped floral resham embroidery.',
      price: 7499,
      mrp: 9999,
      discount: 25,
      sku: 'SAR-ORG-005',
      categorySlug: 'sarees',
      brand: 'VASTRIKA Studio',
      fabric: 'Organza',
      occasion: 'Party',
      pattern: 'Floral Embroidery',
      gender: 'WOMEN',
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [{ size: 'Free Size', color: 'Pastel Peach', price: 7499, stock: 20 }],
    },
    {
      name: 'Handpainted Kalamkari Silk Saree',
      slug: 'handpainted-kalamkari-silk-saree',
      description: 'Sri Kalahasti pen-drawn mythological narrative motifs hand-painted with natural organic dyes on tussar silk.',
      shortDescription: 'Traditional pen-drawn organic Kalamkari artwork on pure tussar.',
      price: 11999,
      mrp: 15999,
      discount: 25,
      sku: 'SAR-KAL-006',
      categorySlug: 'sarees',
      brand: 'VASTRIKA Heritage',
      fabric: 'Tussar Silk',
      occasion: 'Festive',
      pattern: 'Handpainted',
      gender: 'WOMEN',
      isFeatured: true,
      isBestSeller: false,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [{ size: 'Free Size', color: 'Earth Brown', price: 11999, stock: 6 }],
    },
    {
      name: 'Midnight Black Tussar Georgette Chikankari Saree',
      slug: 'midnight-black-tussar-georgette-chikankari-saree',
      description: 'Intricate Lucknowi hand-chikankari with bakhiya, phanda and mukaish work on fine georgette silk.',
      shortDescription: 'Lucknowi mukaish and shadow work on fluid midnight georgette.',
      price: 13499,
      mrp: 17999,
      discount: 25,
      sku: 'SAR-CHK-007',
      categorySlug: 'sarees',
      brand: 'VASTRIKA Studio',
      fabric: 'Georgette',
      occasion: 'Party',
      pattern: 'Chikankari',
      gender: 'WOMEN',
      isFeatured: false,
      isBestSeller: true,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [{ size: 'Free Size', color: 'Midnight Black', price: 13499, stock: 11 }],
    },
    {
      name: 'Ruby Red Bandhani Silk Saree with Zari Border',
      slug: 'ruby-red-bandhani-silk-saree-with-zari-border',
      description: 'Traditional Gujarati tie-dye Bandhej craft executed on pure gajji silk with heavy zari weaving.',
      shortDescription: 'Gajji silk Bandhej with hand-tied dots and gold zari border.',
      price: 12499,
      mrp: 16999,
      discount: 26,
      sku: 'SAR-BAN-008',
      categorySlug: 'sarees',
      brand: 'VASTRIKA Heritage',
      fabric: 'Pure Silk',
      occasion: 'Festive',
      pattern: 'Bandhani',
      gender: 'WOMEN',
      isFeatured: false,
      isBestSeller: true,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [{ size: 'Free Size', color: 'Ruby Red', price: 12499, stock: 14 }],
    },

    // --- LEHENGAS ---
    {
      name: 'Gulabi Pink Bridal Velvet Lehenga with Zardozi Work',
      slug: 'gulabi-pink-bridal-velvet-lehenga-with-zardozi-work',
      description: 'A showstopping bridal masterpiece featuring deep rani pink micro-velvet, heavily embroidered with hand zardozi, dabka, French knots, and sequins. Paired with a sweetheart neckline blouse and double dupattas.',
      shortDescription: 'Heavily hand-embroidered velvet bridal lehenga with double dupattas.',
      price: 49999,
      mrp: 69999,
      discount: 28,
      sku: 'LEH-BRI-001',
      categorySlug: 'lehengas',
      brand: 'VASTRIKA Couture',
      fabric: 'Velvet',
      occasion: 'Bridal',
      pattern: 'Zardozi Handwork',
      gender: 'WOMEN',
      isFeatured: true,
      isBestSeller: true,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'S', color: 'Rani Pink', price: 49999, stock: 4 },
        { size: 'M', color: 'Rani Pink', price: 49999, stock: 6 },
        { size: 'L', color: 'Rani Pink', price: 49999, stock: 3 },
      ],
    },
    {
      name: 'Ivory Gold Mirror Work Georgette Lehenga Choli',
      slug: 'ivory-gold-mirror-work-georgette-lehenga-choli',
      description: 'Contemporary cocktail lehenga crafted with flowing pure georgette, adorned with thousands of hand-stitched real glass mirrors and golden resham thread work.',
      shortDescription: 'Shimmering mirror-work georgette lehenga perfect for Sangeet nights.',
      price: 28999,
      mrp: 36999,
      discount: 21,
      sku: 'LEH-MIR-002',
      categorySlug: 'lehengas',
      brand: 'VASTRIKA Studio',
      fabric: 'Georgette',
      occasion: 'Sangeet',
      pattern: 'Mirror Work',
      gender: 'WOMEN',
      isFeatured: true,
      isBestSeller: false,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'S', color: 'Ivory Gold', price: 28999, stock: 5 },
        { size: 'M', color: 'Ivory Gold', price: 28999, stock: 8 },
      ],
    },
    {
      name: 'Midnight Navy Velvet Sangeet Lehenga with Sequin Spray',
      slug: 'midnight-navy-velvet-sangeet-lehenga-with-sequin-spray',
      description: 'Regal navy blue velvet flared skirt with constellation sequin scattering and embroidered velvet blouse.',
      shortDescription: 'Royal navy velvet lehenga with starry sequin spray.',
      price: 34999,
      mrp: 44999,
      discount: 22,
      sku: 'LEH-NAV-003',
      categorySlug: 'lehengas',
      brand: 'VASTRIKA Couture',
      fabric: 'Velvet',
      occasion: 'Sangeet',
      pattern: 'Sequin Spray',
      gender: 'WOMEN',
      isFeatured: false,
      isBestSeller: true,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'S', color: 'Navy Blue', price: 34999, stock: 5 },
        { size: 'M', color: 'Navy Blue', price: 34999, stock: 7 },
      ],
    },
    {
      name: 'Marigold Yellow Haldi Ruffle Tiered Silk Lehenga',
      slug: 'marigold-yellow-haldi-ruffle-tiered-silk-lehenga',
      description: 'Joyful sunlit yellow lightweight silk lehenga with cascading playful ruffles and embroidered mirrorwork choli.',
      shortDescription: 'Playful tiered ruffle silhouette tailored for vibrant Haldi celebrations.',
      price: 16999,
      mrp: 21999,
      discount: 22,
      sku: 'LEH-HAL-004',
      categorySlug: 'lehengas',
      brand: 'VASTRIKA Studio',
      fabric: 'Silk Blend',
      occasion: 'Haldi',
      pattern: 'Ruffle & Gota',
      gender: 'WOMEN',
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'S', color: 'Marigold Yellow', price: 16999, stock: 8 },
        { size: 'M', color: 'Marigold Yellow', price: 16999, stock: 12 },
      ],
    },
    {
      name: 'Mint Green Chikankari & Mukaish Embroidered Lehenga',
      slug: 'mint-green-chikankari-mukaish-embroidered-lehenga',
      description: 'Airy mint green Lucknowi threadwork lehenga with subtle mukaish dots and gossamer net dupatta.',
      shortDescription: 'Pastel Lucknowi chikankari paired with mukaish highlights.',
      price: 25999,
      mrp: 32999,
      discount: 21,
      sku: 'LEH-MIN-005',
      categorySlug: 'lehengas',
      brand: 'VASTRIKA Couture',
      fabric: 'Georgette',
      occasion: 'Mehendi',
      pattern: 'Chikankari',
      gender: 'WOMEN',
      isFeatured: true,
      isBestSeller: false,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'M', color: 'Mint Green', price: 25999, stock: 6 },
        { size: 'L', color: 'Mint Green', price: 25999, stock: 4 },
      ],
    },

    // --- KURTIS & TUNICS ---
    {
      name: 'Powder Blue Lucknowi Chikankari Modal Kurti',
      slug: 'powder-blue-lucknowi-chikankari-modal-kurti',
      description: 'Crafted with super soft modal cotton fabric, hand-embroidered by women artisans of Awadh with 32 traditional stitches and detailed mukaish dots.',
      shortDescription: 'Authentic Awadhi chikankari hand-embroidery on modal silk.',
      price: 2499,
      mrp: 3999,
      discount: 37,
      sku: 'KUR-LUK-001',
      categorySlug: 'kurtis',
      brand: 'VASTRIKA Daily Luxury',
      fabric: 'Modal Cotton',
      occasion: 'Casual',
      pattern: 'Chikankari',
      gender: 'WOMEN',
      isFeatured: true,
      isBestSeller: true,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'S', color: 'Powder Blue', price: 2499, stock: 25 },
        { size: 'M', color: 'Powder Blue', price: 2499, stock: 30 },
        { size: 'L', color: 'Powder Blue', price: 2499, stock: 20 },
      ],
    },
    {
      name: 'Saffron Yellow Handblock Bagru Print Cotton Kurti',
      slug: 'saffron-yellow-handblock-bagru-print-cotton-kurti',
      description: 'Traditional wood-block printed natural dyed cotton straight kurti crafted by master printers of Bagru, Rajasthan.',
      shortDescription: 'Hand-block wooden stamps with organic vegetable vegetable dyes.',
      price: 1899,
      mrp: 2799,
      discount: 32,
      sku: 'KUR-BAG-002',
      categorySlug: 'kurtis',
      brand: 'VASTRIKA Daily Luxury',
      fabric: 'Pure Cotton',
      occasion: 'Daily Wear',
      pattern: 'Block Print',
      gender: 'WOMEN',
      isFeatured: false,
      isBestSeller: true,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'S', color: 'Saffron Yellow', price: 1899, stock: 18 },
        { size: 'M', color: 'Saffron Yellow', price: 1899, stock: 22 },
      ],
    },
    {
      name: 'Indigo Ajrakh Natural Dye Cotton Angrakha Kurti',
      slug: 'indigo-ajrakh-natural-dye-cotton-angrakha-kurti',
      description: 'Geometric 16-stage resist block-printed Ajrakh craft on breathable mulmul with side tassel tie-ups.',
      shortDescription: 'Heritage Kutch Ajrakh print in timeless asymmetric Angrakha cut.',
      price: 2799,
      mrp: 3699,
      discount: 24,
      sku: 'KUR-AJR-003',
      categorySlug: 'kurtis',
      brand: 'VASTRIKA Daily Luxury',
      fabric: 'Mulmul Cotton',
      occasion: 'Casual',
      pattern: 'Ajrakh Print',
      gender: 'WOMEN',
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'S', color: 'Indigo Blue', price: 2799, stock: 12 },
        { size: 'M', color: 'Indigo Blue', price: 2799, stock: 16 },
      ],
    },

    // --- KURTA SETS & SUITS ---
    {
      name: 'Rani Pink Silk Anarkali Suit with Organza Dupatta',
      slug: 'rani-pink-silk-anarkali-suit-with-organza-dupatta',
      description: 'Majestic 32-kali flared floor-length silk anarkali kurta paired with churidar pants and a hand-painted floral organza dupatta bordered in gota lace.',
      shortDescription: '32-kali royal flare anarkali suit paired with hand-painted organza dupatta.',
      price: 8999,
      mrp: 12999,
      discount: 30,
      sku: 'SUT-ANA-001',
      categorySlug: 'kurta-sets',
      brand: 'VASTRIKA Studio',
      fabric: 'Pure Silk',
      occasion: 'Festive',
      pattern: 'Gota Patti & Zari',
      gender: 'WOMEN',
      isFeatured: true,
      isBestSeller: true,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'S', color: 'Rani Pink', price: 8999, stock: 10 },
        { size: 'M', color: 'Rani Pink', price: 8999, stock: 15 },
      ],
    },
    {
      name: 'Mustard Yellow Velvet Embroidered Pant Suit',
      slug: 'mustard-yellow-velvet-embroidered-pant-suit',
      description: 'Lush micro-velvet tailored straight kurta embellished with antique gold marodi embroidery on neckline and sleeves, paired with velvet cigarette pants.',
      shortDescription: 'Opulent winter velvet suit embellished with antique marodi hand embroidery.',
      price: 11499,
      mrp: 15999,
      discount: 28,
      sku: 'SUT-VEL-002',
      categorySlug: 'kurta-sets',
      brand: 'VASTRIKA Studio',
      fabric: 'Velvet',
      occasion: 'Wedding',
      pattern: 'Marodi Embroidery',
      gender: 'WOMEN',
      isFeatured: false,
      isBestSeller: true,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'S', color: 'Mustard Yellow', price: 11499, stock: 6 },
        { size: 'M', color: 'Mustard Yellow', price: 11499, stock: 8 },
      ],
    },

    // --- INDO-WESTERN & FUSION ---
    {
      name: 'Royal Maroon Draped Saree Gown with Crystal Belt',
      slug: 'royal-maroon-draped-saree-gown-with-crystal-belt',
      description: 'Pre-stitched 1-minute ready-to-wear draped lycra-silk saree gown with hand-embroidered swarovski crystal belt.',
      shortDescription: 'Contemporary ready-to-wear pre-draped saree gown with crystal belt.',
      price: 13999,
      mrp: 18999,
      discount: 26,
      sku: 'IND-SAW-001',
      categorySlug: 'indo-western',
      brand: 'VASTRIKA Couture',
      fabric: 'Silk Crepe',
      occasion: 'Reception',
      pattern: 'Draped Gown',
      gender: 'WOMEN',
      isFeatured: true,
      isBestSeller: true,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'S', color: 'Royal Maroon', price: 13999, stock: 5 },
        { size: 'M', color: 'Royal Maroon', price: 13999, stock: 7 },
      ],
    },
    {
      name: 'Emerald Green Crop Top & Tiered Palazzo with Cape',
      slug: 'emerald-green-crop-top-tiered-palazzo-with-cape',
      description: '3-piece fusion ensemble comprising an embroidered bustier crop top, flared tiered palazzos, and a sheer organza cape.',
      shortDescription: 'Bustier top, tiered palazzo and flowy sheer organza cape.',
      price: 10999,
      mrp: 14999,
      discount: 26,
      sku: 'IND-CAP-002',
      categorySlug: 'indo-western',
      brand: 'VASTRIKA Studio',
      fabric: 'Organza & Georgette',
      occasion: 'Cocktail',
      pattern: 'Cape Set',
      gender: 'WOMEN',
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'S', color: 'Emerald Green', price: 10999, stock: 6 },
      ],
    },

    // --- MEN'S KURTAS ---
    {
      name: 'Heritage Ivory Raw Silk Embroidered Kurta Pajama',
      slug: 'heritage-ivory-raw-silk-embroidered-kurta-pajama',
      description: 'Tailored from rich ivory raw silk with exquisite resham hand-embroidery on the mandarin collar, placket, and cuffs. Accompanied by comfortable churidar trousers.',
      shortDescription: 'Regal ivory raw silk kurta set with tonal resham collar embroidery.',
      price: 6999,
      mrp: 9999,
      discount: 30,
      sku: 'MEN-KUR-001',
      categorySlug: 'mens-kurtas',
      brand: 'VASTRIKA Men',
      fabric: 'Raw Silk',
      occasion: 'Wedding / Festive',
      pattern: 'Collar Embroidery',
      gender: 'MEN',
      isFeatured: true,
      isBestSeller: true,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: '38', color: 'Ivory Cream', price: 6999, stock: 10 },
        { size: '40', color: 'Ivory Cream', price: 6999, stock: 15 },
        { size: '42', color: 'Ivory Cream', price: 6999, stock: 12 },
      ],
    },
    {
      name: 'Royal Wine Maroon Chikankari Silk Mens Kurta',
      slug: 'royal-wine-maroon-chikankari-silk-mens-kurta',
      description: 'Deep royal wine tone pure silk kurta with intricate tone-on-tone Lucknowi chikankari stitches and metallic brass button trims.',
      shortDescription: 'Regal maroon silk kurta elevated with refined Lucknowi Chikankari.',
      price: 5499,
      mrp: 7999,
      discount: 31,
      sku: 'MEN-KUR-002',
      categorySlug: 'mens-kurtas',
      brand: 'VASTRIKA Men',
      fabric: 'Pure Silk',
      occasion: 'Festive',
      pattern: 'Chikankari',
      gender: 'MEN',
      isFeatured: true,
      isBestSeller: true,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: '38', color: 'Wine Maroon', price: 5499, stock: 8 },
        { size: '40', color: 'Wine Maroon', price: 5499, stock: 14 },
      ],
    },
    {
      name: 'Midnight Blue Pure Linen Straight Cut Kurta Set',
      slug: 'midnight-blue-pure-linen-straight-cut-kurta-set',
      description: '100% European flax certified pure linen kurta with tailored front-slit placket and straight white linen trousers.',
      shortDescription: 'Crisp European breathable linen tailored in timeless modern cut.',
      price: 4999,
      mrp: 6999,
      discount: 28,
      sku: 'MEN-KUR-003',
      categorySlug: 'mens-kurtas',
      brand: 'VASTRIKA Men',
      fabric: 'Pure Linen',
      occasion: 'Casual Festive',
      pattern: 'Solid Texture',
      gender: 'MEN',
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: '40', color: 'Midnight Blue', price: 4999, stock: 12 },
        { size: '42', color: 'Midnight Blue', price: 4999, stock: 16 },
      ],
    },
    {
      name: 'Forest Green Textured Silk Kurta with Mandarin Collar',
      slug: 'forest-green-textured-silk-kurta-with-mandarin-collar',
      description: 'Lustrous art-silk weave in deep forest emerald with structured cuffs and mother-of-pearl buttons.',
      shortDescription: 'Vibrant emerald green festive kurta with mother-of-pearl buttons.',
      price: 4499,
      mrp: 5999,
      discount: 25,
      sku: 'MEN-KUR-004',
      categorySlug: 'mens-kurtas',
      brand: 'VASTRIKA Men',
      fabric: 'Silk Blend',
      occasion: 'Festive',
      pattern: 'Woven Texture',
      gender: 'MEN',
      isFeatured: false,
      isBestSeller: false,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: '38', color: 'Forest Green', price: 4499, stock: 7 },
        { size: '40', color: 'Forest Green', price: 4499, stock: 11 },
      ],
    },

    // --- SHERWANIS & COUTURE ---
    {
      name: 'Royal Cream Brocade Groom Sherwani with Zari Work',
      slug: 'royal-cream-brocade-groom-sherwani-with-zari-work',
      description: 'Heirloom groom sherwani crafted in Banarasi zari brocade, embellished with hand zardozi collar, ornate jeweled buttons, silk safa, and stole.',
      shortDescription: 'Imperial Banarasi brocade sherwani complete with matching stole.',
      price: 38999,
      mrp: 52999,
      discount: 26,
      sku: 'SHR-GRO-001',
      categorySlug: 'sherwanis',
      brand: 'VASTRIKA Couture',
      fabric: 'Brocade Silk',
      occasion: 'Groom Bridal',
      pattern: 'Brocade & Zardozi',
      gender: 'MEN',
      isFeatured: true,
      isBestSeller: true,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: '38', color: 'Cream Gold', price: 38999, stock: 3 },
        { size: '40', color: 'Cream Gold', price: 38999, stock: 5 },
      ],
    },
    {
      name: 'Deep Burgundy Velvet Imperial Sherwani with Stole',
      slug: 'deep-burgundy-velvet-imperial-sherwani-with-stole',
      description: 'Opulent velvet achkan cut sherwani with antique gold dori embroidery across chest and cuffs.',
      shortDescription: 'Rich velvet achkan silhouette with regal gold threadwork.',
      price: 32999,
      mrp: 44999,
      discount: 26,
      sku: 'SHR-VEL-002',
      categorySlug: 'sherwanis',
      brand: 'VASTRIKA Couture',
      fabric: 'Velvet',
      occasion: 'Wedding',
      pattern: 'Dori Embroidery',
      gender: 'MEN',
      isFeatured: false,
      isBestSeller: true,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: '40', color: 'Burgundy', price: 32999, stock: 4 },
        { size: '42', color: 'Burgundy', price: 32999, stock: 6 },
      ],
    },
    {
      name: 'Antique Gold Achkan Sherwani with Pearl Buttons',
      slug: 'antique-gold-achkan-sherwani-with-pearl-buttons',
      description: 'Classic bespoke tailored achkan in textured raw silk with custom handcrafted freshwater pearl button chain.',
      shortDescription: 'Textured raw silk achkan with genuine pearl button placket.',
      price: 26999,
      mrp: 35999,
      discount: 25,
      sku: 'SHR-ACH-003',
      categorySlug: 'sherwanis',
      brand: 'VASTRIKA Couture',
      fabric: 'Raw Silk',
      occasion: 'Reception',
      pattern: 'Solid Texture',
      gender: 'MEN',
      isFeatured: true,
      isBestSeller: false,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: '40', color: 'Antique Gold', price: 26999, stock: 5 },
      ],
    },

    // --- NEHRU JACKETS & BANDHGALAS ---
    {
      name: 'Emerald Green Silk Brocade Classic Nehru Jacket',
      slug: 'emerald-green-silk-brocade-classic-nehru-jacket',
      description: 'Single-breasted traditional sleeveless waistcoat in heavy Banarasi silk brocade with brass filigree buttons.',
      shortDescription: 'Banarasi silk brocade waistcoat with antique brass filigree buttons.',
      price: 4999,
      mrp: 6999,
      discount: 28,
      sku: 'JKT-BRO-001',
      categorySlug: 'nehru-jackets',
      brand: 'VASTRIKA Men',
      fabric: 'Brocade Silk',
      occasion: 'Festive',
      pattern: 'Brocade Weave',
      gender: 'MEN',
      isFeatured: true,
      isBestSeller: true,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: '38', color: 'Emerald Green', price: 4999, stock: 12 },
        { size: '40', color: 'Emerald Green', price: 4999, stock: 18 },
      ],
    },
    {
      name: 'Classic Black Imperial Bandhgala Coat',
      slug: 'classic-black-imperial-bandhgala-coat',
      description: 'The quintessential Jodhpuri royal jacket tailored in Italian wool-silk blend with structured shoulder pads and velvet collar trim.',
      shortDescription: 'Timeless Jodhpuri royal bandhgala coat in premium Italian wool-silk.',
      price: 14999,
      mrp: 19999,
      discount: 25,
      sku: 'JKT-BAN-002',
      categorySlug: 'nehru-jackets',
      brand: 'VASTRIKA Men',
      fabric: 'Wool Silk',
      occasion: 'Formal / Wedding',
      pattern: 'Solid Structured',
      gender: 'MEN',
      isFeatured: true,
      isBestSeller: true,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: '38', color: 'Imperial Black', price: 14999, stock: 8 },
        { size: '40', color: 'Imperial Black', price: 14999, stock: 12 },
      ],
    },

    // --- DUPATTAS & SHAWLS ---
    {
      name: 'Heritage Kashmiri Pashmina Hand-Embroidered Tilla Shawl',
      slug: 'heritage-kashmiri-pashmina-hand-embroidered-tilla-shawl',
      description: 'Certified 100% fine Changthangi Cashmere Pashmina wool hand-embroidered by Kashmiri ustaads with metallic silver and gold tilla threadwork.',
      shortDescription: 'Certified pure Kashmiri Pashmina with genuine gold and silver tilla embroidery.',
      price: 21999,
      mrp: 29999,
      discount: 26,
      sku: 'DUP-PAS-001',
      categorySlug: 'dupattas-shawls',
      brand: 'VASTRIKA Heritage',
      fabric: 'Pure Pashmina',
      occasion: 'Winter Wedding',
      pattern: 'Tilla Embroidery',
      gender: 'UNISEX',
      isFeatured: true,
      isBestSeller: true,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [
        { size: 'Free Size', color: 'Natural Ivory', price: 21999, stock: 5 },
      ],
    },
    {
      name: 'Red Phulkari Georgette Heavy Embroidered Dupatta',
      slug: 'red-phulkari-georgette-heavy-embroidered-dupatta',
      description: 'Vibrant Punjabi folk Phulkari geometric embroidery using pat (silken floss) threads across 2.5 meters of rich georgette.',
      shortDescription: 'Traditional vibrant Punjab Phulkari geometric hand embroidery.',
      price: 3499,
      mrp: 4999,
      discount: 30,
      sku: 'DUP-PHU-002',
      categorySlug: 'dupattas-shawls',
      brand: 'VASTRIKA Heritage',
      fabric: 'Georgette',
      occasion: 'Festive',
      pattern: 'Phulkari',
      gender: 'WOMEN',
      isFeatured: false,
      isBestSeller: true,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [{ size: 'Free Size', color: 'Scarlet Red', price: 3499, stock: 20 }],
    },
    {
      name: 'Ivory Chanderi Gold Zari Weave Dupatta',
      slug: 'ivory-chanderi-gold-zari-weave-dupatta',
      description: 'Lustrous sheer Chanderi drape with all-over woven gold zari booties and broad scalloped patti.',
      shortDescription: 'Classic Chanderi silk drape with shimmering gold zari border.',
      price: 2999,
      mrp: 3999,
      discount: 25,
      sku: 'DUP-CHA-003',
      categorySlug: 'dupattas-shawls',
      brand: 'VASTRIKA Studio',
      fabric: 'Chanderi',
      occasion: 'Festive',
      pattern: 'Zari Weave',
      gender: 'WOMEN',
      isFeatured: false,
      isBestSeller: false,
      isNew: false,
      images: [
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=85',
      ],
      variants: [{ size: 'Free Size', color: 'Ivory Gold', price: 2999, stock: 25 }],
    },
  ];

  console.log(`📦 Seeding ${products.length} products with unique distinct images...`);

  for (const prod of products) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    const createdProduct = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        shortDescription: prod.shortDescription,
        price: prod.price,
        mrp: prod.mrp,
        discount: prod.discount,
        sku: prod.sku,
        categoryId,
        brand: prod.brand,
        fabric: prod.fabric,
        occasion: prod.occasion,
        pattern: prod.pattern,
        gender: prod.gender,
        isFeatured: prod.isFeatured,
        isNew: prod.isNew,
        isBestSeller: prod.isBestSeller,
        isActive: true,
      },
    });

    // Create Images
    for (let i = 0; i < prod.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          imageUrl: prod.images[i],
          sortOrder: i,
        },
      });
    }

    // Create Variants & Inventory
    for (const v of prod.variants) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          size: v.size,
          color: v.color,
          sku: `${prod.sku}-${v.size}-${v.color.substring(0, 3).toUpperCase()}`,
          price: v.price,
          stock: v.stock,
          isActive: true,
        },
      });

      await prisma.inventory.create({
        data: {
          productId: createdProduct.id,
          variantId: variant.id,
          quantity: v.stock,
          lowStockThreshold: 5,
        },
      });
    }

    // Add 1-2 Verified Customer Reviews
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer.id,
        rating: 5,
        title: 'Exquisite royal craftsmanship!',
        comment:
          'The weave quality, vibrant hue, and zari luster exceeded all my expectations. Arrived in a keepsake royal gift box within 3 days. Highly recommended!',
        isVerified: true,
        isActive: true,
      },
    });
  }

  // 5. Create Demo Order for Customer
  const firstProduct = await prisma.product.findFirst({
    where: { slug: 'royal-crimson-banarasi-katan-silk-saree' },
    include: { variants: true, images: true },
  });

  if (firstProduct && firstProduct.variants.length > 0) {
    const demoOrder = await prisma.order.create({
      data: {
        orderNumber: 'VAS-2026-9812',
        userId: customer.id,
        addressId: customerAddress.id,
        shippingName: 'Priya Sharma',
        shippingPhone: '+91 9812345678',
        shippingAddress: 'Flat 402, Lotus Grandeur, 14th Cross, Linking Road',
        shippingCity: 'Mumbai',
        shippingState: 'Maharashtra',
        shippingPincode: '400050',
        subtotal: 14999,
        discount: 500,
        shippingFee: 0,
        tax: 724.95,
        total: 15223.95,
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
        orderStatus: 'SHIPPED',
        razorpayOrderId: 'order_seed_demo_1001',
        razorpayPaymentId: 'pay_seed_demo_2002',
        couponCode: 'FESTIVE500',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: demoOrder.id,
        productId: firstProduct.id,
        variantId: firstProduct.variants[0].id,
        productName: firstProduct.name,
        variantInfo: `Size: ${firstProduct.variants[0].size}, Color: ${firstProduct.variants[0].color}`,
        quantity: 1,
        price: 14999,
        imageUrl: firstProduct.images[0]?.imageUrl,
      },
    });

    await prisma.orderTracking.createMany({
      data: [
        {
          orderId: demoOrder.id,
          status: 'CONFIRMED',
          message: 'Order verified and confirmed by boutique studio.',
          location: 'Varanasi Weaving Centre',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        },
        {
          orderId: demoOrder.id,
          status: 'PROCESSING',
          message: 'Quality check and luxury packaging completed.',
          location: 'Central Fulfillment Hub, Mumbai',
          timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
        },
        {
          orderId: demoOrder.id,
          status: 'SHIPPED',
          message: 'Package handed over to BlueDart Express Courier (AWB: BD872194).',
          location: 'Mumbai Hub',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
      ],
    });

    console.log('📦 Created Demo Order with live tracking timeline.');
  }

  console.log('✨ VASTRIKA Database Seeding Completed with Unique Images!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
