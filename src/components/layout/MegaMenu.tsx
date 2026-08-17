'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Sparkles } from 'lucide-react';

export default function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuData = {
    women: {
      title: 'WOMEN',
      columns: [
        {
          heading: 'SAREES & DRAPES',
          links: [
            { name: 'Banarasi Silk Sarees', href: '/shop/sarees?fabric=Pure+Katan+Silk' },
            { name: 'Kanjivaram Silk Sarees', href: '/shop/sarees?fabric=Mulberry+Silk' },
            { name: 'Embroidered Organza', href: '/shop/sarees?fabric=Organza+Silk' },
            { name: 'Chanderi Handblock', href: '/shop/sarees?fabric=Chanderi+Silk' },
            { name: 'View All Sarees →', href: '/shop/sarees', isAll: true },
          ],
        },
        {
          heading: 'LEHENGAS & SETS',
          links: [
            { name: 'Bridal Velvet Lehengas', href: '/shop/lehengas?occasion=Bridal' },
            { name: 'Festive Brocade Lehengas', href: '/shop/lehengas?occasion=Wedding' },
            { name: 'Sharara & Gharara Sets', href: '/shop/kurta-sets' },
            { name: 'Kalidar Anarkali Gowns', href: '/shop/anarkalis' },
            { name: 'View All Lehengas →', href: '/shop/lehengas', isAll: true },
          ],
        },
        {
          heading: 'KURTIS & DAILY LUXURY',
          links: [
            { name: 'Lucknowi Chikankari', href: '/shop/kurtis?pattern=Chikankari' },
            { name: 'Handblock Cotton Tunics', href: '/shop/kurtis?fabric=Pure+Cotton' },
            { name: 'Silk Velvet Kurtas', href: '/shop/kurtis?fabric=Silk+Velvet' },
            { name: 'Pre-Draped Saree Gowns', href: '/shop/indo-western' },
            { name: 'View All Kurtis →', href: '/shop/kurtis', isAll: true },
          ],
        },
      ],
      featured: {
        title: 'Heirloom Katan Edit',
        subtitle: 'Handwoven in Varanasi',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
        href: '/shop/sarees',
      },
    },
    men: {
      title: 'MEN',
      columns: [
        {
          heading: 'KURTAS & SETS',
          links: [
            { name: 'Matka Raw Silk Kurtas', href: '/shop/mens-kurtas?fabric=Raw+Silk' },
            { name: 'Festive Pathani Sets', href: '/shop/mens-kurtas?fabric=Jacquard+Cotton' },
            { name: 'European Linen Kurtas', href: '/shop/mens-kurtas?fabric=Pure+Linen' },
            { name: 'Wedding Sherwanis', href: '/shop/mens-kurtas?occasion=Wedding' },
          ],
        },
        {
          heading: 'BUNDIS & JACKETS',
          links: [
            { name: 'Silk Brocade Nehru Jackets', href: '/shop/nehru-jackets' },
            { name: 'Midnight Velvet Waistcoats', href: '/shop/nehru-jackets?fabric=Micro+Velvet' },
            { name: 'Embroidered Heritage Bundis', href: '/shop/nehru-jackets' },
          ],
        },
      ],
      featured: {
        title: 'The Sovereign Groom',
        subtitle: 'Bespoke Men’s Festive Couture',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
        href: '/shop/mens-kurtas',
      },
    },
    celebrations: {
      title: 'WEDDING & FESTIVE',
      columns: [
        {
          heading: 'BY OCCASION',
          links: [
            { name: 'Bridal Trousseau', href: '/shop?occasion=Bridal' },
            { name: 'Sangeet & Cocktail Nights', href: '/shop?occasion=Party' },
            { name: 'Haldi & Mehendi Yellows', href: '/shop?color=Mustard' },
            { name: 'Reception Royalty', href: '/shop?occasion=Wedding' },
          ],
        },
        {
          heading: 'HANDCRAFTED HERITAGE',
          links: [
            { name: 'Zardozi Needlework', href: '/shop?pattern=Zardozi' },
            { name: 'Authentic Mirror Work', href: '/shop?pattern=Mirror+Work' },
            { name: 'Tanchoi Silk Dupattas', href: '/shop/dupattas' },
            { name: 'Royal Potlis & Jewellery', href: '/shop/accessories' },
          ],
        },
      ],
      featured: {
        title: 'The Royal Vivaha Edit',
        subtitle: 'Crafted for Timeless Memories',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
        href: '/shop?occasion=Wedding',
      },
    },
  };

  return (
    <div className="flex items-center gap-7">
      {/* WOMEN Dropdown */}
      <div
        className="relative py-2"
        onMouseEnter={() => setActiveMenu('women')}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <Link
          href="/shop"
          className="flex items-center gap-1 text-xs font-bold tracking-[0.15em] text-stone-800 hover:text-vastrika-maroon-800 transition uppercase"
        >
          <span>WOMEN</span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </Link>

        {activeMenu === 'women' && (
          <div className="absolute top-full left-1/2 -translate-x-1/3 w-[820px] bg-white rounded-2xl shadow-luxury-lg border border-vastrika-ivory-300 p-8 grid grid-cols-4 gap-8 z-50 animate-in fade-in slide-in-from-top-2">
            {menuData.women.columns.map((col, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-[11px] font-bold tracking-wider text-vastrika-maroon-900 border-b border-vastrika-ivory-300 pb-2">
                  {col.heading}
                </h4>
                <ul className="space-y-2 text-xs">
                  {col.links.map((lnk, i) => (
                    <li key={i}>
                      <Link
                        href={lnk.href}
                        onClick={() => setActiveMenu(null)}
                        className={`hover:text-vastrika-maroon-800 transition block py-0.5 ${
                          lnk.isAll ? 'font-bold text-vastrika-gold-700 hover:underline' : 'text-stone-600'
                        }`}
                      >
                        {lnk.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Featured Image */}
            <div className="relative rounded-xl overflow-hidden group border border-vastrika-ivory-300">
              <img
                src={menuData.women.featured.image}
                alt={menuData.women.featured.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] text-vastrika-gold-400 font-bold uppercase tracking-wider">
                  {menuData.women.featured.subtitle}
                </span>
                <h5 className="font-serif text-base font-bold">{menuData.women.featured.title}</h5>
                <Link
                  href={menuData.women.featured.href}
                  onClick={() => setActiveMenu(null)}
                  className="text-[11px] text-vastrika-gold-300 font-semibold underline mt-1"
                >
                  Explore Showcase →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MEN Dropdown */}
      <div
        className="relative py-2"
        onMouseEnter={() => setActiveMenu('men')}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <Link
          href="/shop/mens-kurtas"
          className="flex items-center gap-1 text-xs font-bold tracking-[0.15em] text-stone-800 hover:text-vastrika-maroon-800 transition uppercase"
        >
          <span>MEN</span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </Link>

        {activeMenu === 'men' && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[650px] bg-white rounded-2xl shadow-luxury-lg border border-vastrika-ivory-300 p-8 grid grid-cols-3 gap-6 z-50 animate-in fade-in slide-in-from-top-2">
            {menuData.men.columns.map((col, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-[11px] font-bold tracking-wider text-vastrika-maroon-900 border-b border-vastrika-ivory-300 pb-2">
                  {col.heading}
                </h4>
                <ul className="space-y-2 text-xs">
                  {col.links.map((lnk, i) => (
                    <li key={i}>
                      <Link
                        href={lnk.href}
                        onClick={() => setActiveMenu(null)}
                        className="text-stone-600 hover:text-vastrika-maroon-800 transition block py-0.5"
                      >
                        {lnk.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Featured Image */}
            <div className="relative rounded-xl overflow-hidden group border border-vastrika-ivory-300">
              <img
                src={menuData.men.featured.image}
                alt={menuData.men.featured.title}
                className="w-full h-44 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] text-vastrika-gold-400 font-bold uppercase tracking-wider">
                  {menuData.men.featured.subtitle}
                </span>
                <h5 className="font-serif text-sm font-bold">{menuData.men.featured.title}</h5>
                <Link
                  href={menuData.men.featured.href}
                  onClick={() => setActiveMenu(null)}
                  className="text-[10px] text-vastrika-gold-300 font-semibold underline mt-1"
                >
                  Shop Men →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WEDDING & FESTIVE Dropdown */}
      <div
        className="relative py-2"
        onMouseEnter={() => setActiveMenu('celebrations')}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <Link
          href="/shop?occasion=Wedding"
          className="flex items-center gap-1 text-xs font-bold tracking-[0.15em] text-vastrika-maroon-800 hover:text-vastrika-maroon-950 transition uppercase"
        >
          <Sparkles className="w-3 h-3 text-vastrika-gold-600" />
          <span>WEDDING & FESTIVE</span>
          <ChevronDown className="w-3.5 h-3.5 text-vastrika-gold-600" />
        </Link>

        {activeMenu === 'celebrations' && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[650px] bg-white rounded-2xl shadow-luxury-lg border border-vastrika-ivory-300 p-8 grid grid-cols-3 gap-6 z-50 animate-in fade-in slide-in-from-top-2">
            {menuData.celebrations.columns.map((col, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-[11px] font-bold tracking-wider text-vastrika-maroon-900 border-b border-vastrika-ivory-300 pb-2">
                  {col.heading}
                </h4>
                <ul className="space-y-2 text-xs">
                  {col.links.map((lnk, i) => (
                    <li key={i}>
                      <Link
                        href={lnk.href}
                        onClick={() => setActiveMenu(null)}
                        className="text-stone-600 hover:text-vastrika-maroon-800 transition block py-0.5"
                      >
                        {lnk.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Featured Image */}
            <div className="relative rounded-xl overflow-hidden group border border-vastrika-ivory-300">
              <img
                src={menuData.celebrations.featured.image}
                alt={menuData.celebrations.featured.title}
                className="w-full h-44 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] text-vastrika-gold-400 font-bold uppercase tracking-wider">
                  {menuData.celebrations.featured.subtitle}
                </span>
                <h5 className="font-serif text-sm font-bold">{menuData.celebrations.featured.title}</h5>
                <Link
                  href={menuData.celebrations.featured.href}
                  onClick={() => setActiveMenu(null)}
                  className="text-[10px] text-vastrika-gold-300 font-semibold underline mt-1"
                >
                  Explore Vivaha Edit →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
