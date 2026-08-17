import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Truck,
  RotateCcw,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductItem } from '@/types';

export const revalidate = 3600; // 1-hour fast static caching

export default async function HomePage() {
  // Fetch Featured, New Arrivals, Best Sellers, and Categories from Prisma DB
  const [categories, featuredProducts, newArrivals, bestSellers, mensCollection] =
    await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        take: 8,
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { where: { isActive: true } },
          category: true,
          reviews: { select: { rating: true } },
        },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({
        where: { isActive: true, isNew: true },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { where: { isActive: true } },
          category: true,
          reviews: { select: { rating: true } },
        },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({
        where: { isActive: true, isBestSeller: true },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { where: { isActive: true } },
          category: true,
          reviews: { select: { rating: true } },
        },
        take: 8,
      }),
      prisma.product.findMany({
        where: { isActive: true, gender: 'MEN' },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { where: { isActive: true } },
          category: true,
          reviews: { select: { rating: true } },
        },
        take: 4,
      }),
    ]);

  // Format products with rating averages
  const formatProds = (list: any[]): ProductItem[] =>
    list.map((prod) => ({
      ...prod,
      reviews: prod.reviews as any,
      averageRating:
        prod.reviews.length > 0
          ? prod.reviews.reduce((s: number, r: any) => s + r.rating, 0) / prod.reviews.length
          : 4.9,
      reviewCount: prod.reviews.length || 16,
    })) as unknown as ProductItem[];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION: Timeless Indian Elegance */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-stone-900 overflow-hidden">
        {/* Editorial Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80"
            alt="VASTRIKA Heritage Couture"
            className="w-full h-full object-cover object-center opacity-45 scale-105 animate-in fade-in duration-700"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vastrika-gold-500/20 border border-vastrika-gold-400/40 backdrop-blur-md text-vastrika-gold-300 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 animate-in slide-in-from-bottom-3">
            <Sparkles className="w-4 h-4 text-vastrika-gold-400" />
            <span>The Festive & Wedding Edit 2026</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-vastrika-ivory-50 leading-[1.1] mb-6 drop-shadow-md">
            Timeless Indian Elegance
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-vastrika-ivory-200/90 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover handcrafted Banarasi silks, regal bridal lehengas, and Awadhi Chikankari made for life’s grandest celebrations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-vastrika-gold-500 hover:bg-vastrika-gold-600 text-vastrika-charcoal-950 font-bold px-8 py-4 rounded-xl text-sm tracking-wider uppercase transition shadow-gold-glow flex items-center justify-center gap-2 group"
            >
              <span>SHOP WOMEN</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/shop/mens-kurtas"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-sm tracking-wider uppercase backdrop-blur-md border border-white/30 transition flex items-center justify-center gap-2"
            >
              <span>SHOP MEN</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-vastrika-gold-700">
            Handcrafted Treasures
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-vastrika-maroon-950 mt-1">
            Shop By Category
          </h2>
          <div className="w-16 h-0.5 bg-vastrika-gold-500 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-100 shadow-luxury border border-vastrika-ivory-300 flex flex-col justify-end p-5"
            >
              <img
                src={
                  cat.image ||
                  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
                }
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <div className="relative z-10 text-white">
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide group-hover:text-vastrika-gold-300 transition">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-stone-300 mt-1 line-clamp-1">
                  {cat.description || 'Explore collection'}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-vastrika-gold-400 mt-2 uppercase tracking-wider group-hover:underline">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-vastrika-gold-700">
              Fresh Off The Handloom
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-vastrika-maroon-950 mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?filter=new"
            className="text-xs font-bold text-vastrika-maroon-900 hover:text-vastrika-maroon-700 uppercase tracking-wider flex items-center gap-1.5 hover:underline"
          >
            <span>View All New Additions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={formatProds(newArrivals)} />
      </section>

      {/* 4. EDITORIAL CURATION BANNER: The Royal Vivaha & Festive Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-vastrika-maroon-950 text-white border border-vastrika-gold-500/40 shadow-luxury-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-14 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-vastrika-gold-500/20 text-vastrika-gold-300 text-xs font-bold uppercase tracking-widest border border-vastrika-gold-500/30">
                <Sparkles className="w-3.5 h-3.5 text-vastrika-gold-400" />
                <span>Heirloom Craftsmanship</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-vastrika-ivory-50">
                The Heritage Wedding & Bridal Trouseau
              </h2>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Adorn your special milestone with masterfully woven pure silk sarees and micro-velvet lehengas embellished with real zardozi, dabka, and pearl needlework.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/shop/lehengas?occasion=Bridal"
                  className="bg-vastrika-gold-500 hover:bg-vastrika-gold-600 text-vastrika-charcoal-950 font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-gold-glow"
                >
                  Explore Bridal Lehengas
                </Link>
                <Link
                  href="/shop/sarees?fabric=Pure+Katan+Silk"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider border border-white/30 transition"
                >
                  Banarasi Silks
                </Link>
              </div>
            </div>

            <div className="relative h-80 lg:h-full min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85"
                alt="Bridal Couture"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-vastrika-maroon-950 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-vastrika-gold-700">
              Customer Favorites
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-vastrika-maroon-950 mt-1">
              Bestsellers
            </h2>
          </div>
          <Link
            href="/shop?filter=bestseller"
            className="text-xs font-bold text-vastrika-maroon-900 hover:text-vastrika-maroon-700 uppercase tracking-wider flex items-center gap-1.5 hover:underline"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={formatProds(bestSellers)} />
      </section>

      {/* 6. MEN'S HERITAGE COLLECTION */}
      <section className="bg-vastrika-ivory-200/70 py-16 border-y border-vastrika-ivory-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-vastrika-gold-700">
                The Sovereign Groom
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-vastrika-maroon-950 mt-1">
                Men&apos;s Festive Couture
              </h2>
            </div>
            <Link
              href="/shop/mens-kurtas"
              className="text-xs font-bold text-vastrika-maroon-900 hover:text-vastrika-maroon-700 uppercase tracking-wider flex items-center gap-1.5 hover:underline"
            >
              <span>Explore Men&apos;s Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductGrid products={formatProds(mensCollection)} />
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-vastrika-gold-700">
            Royal Patrons
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-vastrika-maroon-950 mt-1">
            Loved By Over 50,000+ Patrons
          </h2>
          <div className="w-16 h-0.5 bg-vastrika-gold-500 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-vastrika-ivory-300 shadow-luxury space-y-4">
            <div className="flex items-center gap-1 text-vastrika-gold-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-vastrika-gold-500" />
              ))}
            </div>
            <h4 className="font-serif text-base font-bold text-stone-900">
              &ldquo;The Banarasi Silk is true heirloom quality!&rdquo;
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              &ldquo;I ordered the Royal Crimson Banarasi Katan silk saree for my daughter&apos;s wedding. The sheen, zari weight, and authentic finish exceeded all expectations. VASTRIKA is now our family boutique.&rdquo;
            </p>
            <div className="pt-3 border-t border-vastrika-ivory-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-vastrika-maroon-100 text-vastrika-maroon-900 font-bold text-sm flex items-center justify-center">
                SM
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800">Sunita Mukherjee</p>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Buyer, Kolkata
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-vastrika-ivory-300 shadow-luxury space-y-4">
            <div className="flex items-center gap-1 text-vastrika-gold-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-vastrika-gold-500" />
              ))}
            </div>
            <h4 className="font-serif text-base font-bold text-stone-900">
              &ldquo;Dream Bridal Lehenga!&rdquo;
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              &ldquo;The velvet zardozi work on the Maharani lehenga was so opulent. Dual dupattas completed the bridal look perfectly. Shipping to Mumbai took only 3 days.&rdquo;
            </p>
            <div className="pt-3 border-t border-vastrika-ivory-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-vastrika-maroon-100 text-vastrika-maroon-900 font-bold text-sm flex items-center justify-center">
                PS
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800">Pooja Singhania</p>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Buyer, Mumbai
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-vastrika-ivory-300 shadow-luxury space-y-4">
            <div className="flex items-center gap-1 text-vastrika-gold-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-vastrika-gold-500" />
              ))}
            </div>
            <h4 className="font-serif text-base font-bold text-stone-900">
              &ldquo;Exceptional Men’s Silk Kurta&rdquo;
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              &ldquo;The raw silk kurta and matching brocade bundi gave a sharp royal silhouette for my brother&apos;s sangeet. Premium stitching and tailored fit right out of the box.&rdquo;
            </p>
            <div className="pt-3 border-t border-vastrika-ivory-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-vastrika-maroon-100 text-vastrika-maroon-900 font-bold text-sm flex items-center justify-center">
                RK
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800">Rohan Kapoor</p>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Buyer, Delhi NCR
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM HERITAGE GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-vastrika-gold-700">
            #VastrikaStories
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-vastrika-maroon-950 mt-1">
            Follow Our Weaver Journey
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Tag @vastrikacouture on Instagram to be featured in our royal gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
          ].map((src, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-luxury border border-vastrika-ivory-300"
            >
              <img
                src={src}
                alt="Instagram story"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-vastrika-maroon-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="text-xs font-bold tracking-widest uppercase bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  @vastrikacouture
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
