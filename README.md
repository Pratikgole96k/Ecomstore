# 👑 VASTRIKA — Luxury Indian Ethnic Wear E-Commerce

> *"Tradition Woven Into Every Story"*

VASTRIKA is a full-stack, production-ready luxury Indian fashion e-commerce web application. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**, it features real-time search & multi-facet filtering, dynamic cart & wishlist with stock validation, server-side authoritative price recalculations, Razorpay Indian payment gateway integration, Cash on Delivery support, shipment tracking timeline milestones, transactional email dispatch, customer account suite, and a full-featured Administrative Management Studio.

---

## 🌟 Key Features

### 🛍️ Storefront & Customer Experience
- **Luxury Aesthetic & Palette:** Indian royal theme with Ivory (`#FAF8F5`), Royal Crimson / Wine Maroon (`#7E132B`), Antique Gold accents (`#C59B27`), and Charcoal typography.
- **Announcement Bar & Sticky Header:** Free shipping banner on orders above ₹1,999, dynamic announcement ticker, interactive search overlay with debouncing.
- **Mega Menu:** Multi-column navigation for Sarees, Lehengas, Kurtis, Suits, Men's Kurtas, Nehru Jackets, Wedding & Festive edits.
- **Homepage:** Editorial hero banner, Shop By Category visual cards, New Arrivals, Bestsellers, Men's Heritage Collection, verified buyer reviews, and Instagram story gallery.
- **Shop & Filtering Catalog (`/shop` & `/shop/[category]`):** Backend-powered filtering across Fabric, Occasion, Color, Size, Price Range, Discount, and Sort orders.
- **Product Details (`/product/[slug]`):** Multi-image gallery with hover magnifying zoom lens, interactive color swatches & size picker, live database stock indicator, Indian standard size guide modal, pincode delivery estimator, tabbed fabric care guides, and verified customer review submissions.
- **Cart & Slide-Over Drawer (`/cart`):** Live free shipping progress bar, stock boundary checks, coupon engine (`VASTRIKA10`, `FESTIVE500`), and price breakdown with 5% GST calculation.
- **Express Checkout (`/checkout`):** Multi-step address validation, authoritative server-side recalculation, Razorpay online payments (UPI, Cards, Netbanking) and Cash on Delivery (COD).
- **Order Confirmation & Tracking (`/order-success/[id]` & `/account/orders/[id]`):** Celebration confetti, receipt breakdown, and live 5-stage shipment progress timeline.
- **Customer Account Suite (`/account`):** Profile overview, order history with tracking, saved delivery addresses manager with default toggles, and wishlist manager.

### 🛡️ Admin Management Studio (`/admin`)
- **Executive Dashboard:** Live metrics for Gross Revenue, Orders, Products, Customers, Low-Stock alerts, revenue trajectory charts, and recent checkout streams.
- **Product Management (`/admin/products`):** Create new products with multi-variant generators (sizes, colors, SKU, stock), edit products, manage image URLs, and toggle Featured / Bestseller flags.
- **Order Lifecycle Fulfillment (`/admin/orders/[id]`):** 10-stage order state updates (*Pending*, *Confirmed*, *Processing*, *Packed*, *Shipped*, *Out for Delivery*, *Delivered*, *Cancelled*, *Returned*, *Refunded*) with automatic `OrderTracking` timestamp milestone generation.
- **Category Management (`/admin/categories`):** Category creation, banner assignments, and ordering.
- **Coupons Engine (`/admin/coupons`):** Create percentage or flat coupons with minimum cart spend, maximum discount cap, expiry date, and usage limits.
- **Inventory Tracker (`/admin/inventory`):** In-place stock adjustments and low-stock warnings (&le; 5 units).
- **Customer Registry (`/admin/customers`):** View customer order histories, total lifetime spending, and role badges.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling & Icons** | Tailwind CSS, Lucide React, Custom Luxury Indian Design System |
| **Database & ORM** | Prisma ORM, SQLite (local zero-friction) / PostgreSQL (production ready) |
| **Authentication** | Custom JWT Session Engine, bcryptjs password hashing, HTTP-only secure cookies |
| **Payments** | Razorpay Indian Gateway SDK (UPI, RuPay, Cards, NetBanking, COD) |
| **Emails** | Resend Transactional Email Engine + Luxury HTML Email Templates |
| **Image Storage** | Cloudinary Image API + High-Resolution Handloom Fallback CDN |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ / v22+
- **npm** or **yarn** / **pnpm**

### 2. Installation
```bash
# Clone or navigate to the repository
cd d:/Ecomstore

# Install all dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root (or copy from `.env.example`):
```env
# Database (SQLite default for instant local setup; swap to postgresql for production)
DATABASE_URL="file:./dev.db"

# JWT & Authentication Secrets
JWT_SECRET="vastrika-super-secret-jwt-key-change-in-production-2026"
NEXTAUTH_SECRET="vastrika-nextauth-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Razorpay (Indian Payments Gateway)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_placeholder"
RAZORPAY_KEY_ID="rzp_test_placeholder"
RAZORPAY_KEY_SECRET="rzp_test_secret_placeholder"

# Cloudinary (Media Storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="demo"
CLOUDINARY_CLOUD_NAME="demo"
CLOUDINARY_API_KEY="placeholder_api_key"
CLOUDINARY_API_SECRET="placeholder_api_secret"

# Resend (Transactional Email Notifications)
RESEND_API_KEY="re_placeholder_api_key"
EMAIL_FROM="VASTRIKA <orders@vastrika.com>"
```

### 4. Database Setup & Seeding
```bash
# Push Prisma schema to create tables
npx prisma db push

# Seed 24+ rich Indian fashion products, variants, reviews, coupons, demo admin & customer
npm run seed
```

### 5. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Access |
|---|---|---|---|
| **Administrator** | `admin@vastrika.com` | `admin123` | Full `/admin` Studio & Storefront |
| **Customer** | `customer@vastrika.com` | `customer123` | Storefront, Wishlist, Orders, Checkout |

> **Tip:** You can also click the quick demo login buttons directly on the `/login` page!

---

## 🎟️ Active Demo Coupons

- `VASTRIKA10`: 10% Off on orders above ₹999 (Max discount ₹1,000)
- `FESTIVE500`: Flat ₹500 Off on orders above ₹2,999
- `ROYAL20`: 20% Off on orders above ₹4,999 (Max discount ₹2,000)
- `FIRSTBUY`: Flat ₹300 Off for first-time buyers on orders above ₹1,499

---

## 📦 Project Architecture

```
d:/Ecomstore/
├── prisma/
│   ├── schema.prisma           # 15 Relational database models & cascades
│   └── seed.ts                 # Rich Indian fashion catalog seed dataset
├── src/
│   ├── app/
│   │   ├── (store)/            # Customer Storefront Pages
│   │   │   ├── page.tsx        # Luxury Homepage
│   │   │   ├── shop/           # Multi-faceted Catalog
│   │   │   ├── product/[slug]/ # Product Details with zoom gallery & reviews
│   │   │   ├── search/         # Live Backend Search
│   │   │   ├── cart/           # Cart & Coupon Breakdown
│   │   │   ├── checkout/       # Address validation & Razorpay / COD payment
│   │   │   ├── order-success/  # Celebration screen & receipt
│   │   │   ├── wishlist/       # Saved creations
│   │   │   ├── account/        # Customer Profile, Orders, Tracking & Addresses
│   │   │   ├── login/          # Auth Sign In
│   │   │   ├── register/       # Auth Registration
│   │   │   └── forgot-password/# Recovery flow
│   │   ├── admin/              # Complete Administrative Management Studio
│   │   │   ├── page.tsx        # Dashboard KPIs & Revenue trends
│   │   │   ├── products/       # Products Table & Multi-variant Creator
│   │   │   ├── orders/         # 10-Stage Fulfillment & Tracking updater
│   │   │   ├── categories/     # Category Manager
│   │   │   ├── coupons/        # Promo Code Manager
│   │   │   ├── inventory/      # Low-Stock Alert & In-place Stock Adjuster
│   │   │   └── customers/      # Patron Directory & Spend Totals
│   │   ├── api/                # RESTful API Endpoints
│   │   │   ├── auth/           # Login, Register, Logout, Me
│   │   │   ├── products/       # Search, Filter & Single Product API
│   │   │   ├── categories/     # Categories list
│   │   │   ├── coupons/        # Coupon validation
│   │   │   ├── checkout/       # Authoritative order creation & stock decrement
│   │   │   ├── payments/       # Razorpay order create & verify
│   │   │   ├── reviews/        # Verified customer reviews
│   │   │   ├── addresses/      # Saved address CRUD
│   │   │   └── admin/          # Admin Stats, Orders, Products, Coupons, Inventory
│   │   ├── layout.tsx          # Root Layout with Cart & Wishlist Providers
│   │   └── globals.css         # Custom Luxury Theme & Scrollbars
│   ├── components/
│   │   ├── layout/             # AnnouncementBar, Header, MegaMenu, Footer
│   │   ├── product/            # ProductCard, ProductGrid, ImageGallery, VariantSelector
│   │   ├── cart/               # CartDrawer, CartItemRow
│   │   └── shared/             # SearchBar, PincodeChecker, SizeChartModal, StarRating
│   ├── lib/
│   │   ├── prisma.ts           # Prisma singleton
│   │   ├── auth.ts             # Password hashing & JWT helpers
│   │   ├── razorpay.ts         # Razorpay client & mock fallback
│   │   ├── email.ts            # Resend client & luxury HTML templates
│   │   ├── cloudinary.ts       # Image upload handler
│   │   └── utils.ts            # Currency formatter (₹ INR), slugify, calculations
│   ├── hooks/
│   │   ├── useCart.tsx         # Persistent shopping bag context
│   │   ├── useWishlist.tsx     # Persistent wishlist context
│   │   └── useDebounce.ts      # Search debouncing hook
│   └── types/
│       └── index.ts            # TypeScript interfaces
```

---

## 🚢 Production Deployment

To deploy to production (Vercel / AWS / Railway):
1. Create a PostgreSQL database on **Supabase**, **Neon**, or **Railway**.
2. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
3. Update `DATABASE_URL` in your production environment variables to your PostgreSQL connection string.
4. Run `npx prisma db push && npm run seed` to initialize production tables.
5. Deploy to **Vercel** with environment variables configured.
