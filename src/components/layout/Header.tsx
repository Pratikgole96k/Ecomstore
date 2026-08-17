'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  Package,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import AnnouncementBar from './AnnouncementBar';
import MegaMenu from './MegaMenu';
import SearchBar from '../shared/SearchBar';
import { UserSession } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, subtotal, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);

  // Fetch session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    checkAuth();
  }, [pathname]);

  // Scroll detection for sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setUserDropdownOpen(false);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'NEW ARRIVALS', href: '/shop?filter=new' },
    { name: 'SAREES', href: '/shop/sarees' },
    { name: 'LEHENGAS', href: '/shop/lehengas' },
    { name: 'KURTIS', href: '/shop/kurtis' },
    { name: 'SUITS & SETS', href: '/shop/kurta-sets' },
    { name: 'ANARKALIS', href: '/shop/anarkalis' },
    { name: 'MEN', href: '/shop/mens-kurtas' },
    { name: 'FESTIVE', href: '/shop?occasion=Festive' },
    { name: 'WEDDING', href: '/shop?occasion=Wedding' },
    { name: 'SALE', href: '/shop?filter=sale', isSale: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300">
      <AnnouncementBar />

      <div
        className={`border-b border-vastrika-ivory-300 transition-all duration-300 ${
          isScrolled ? 'shadow-luxury py-2.5' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-vastrika-charcoal-900 hover:text-vastrika-maroon-700 transition"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link href="/" className="inline-block group">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-vastrika-maroon-900 group-hover:text-vastrika-maroon-700 transition">
                    VASTRIKA
                  </span>
                  <span className="text-[9px] tracking-[0.3em] uppercase text-vastrika-gold-700 font-medium -mt-1">
                    Tradition Woven Into Every Story
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Center Navigation with MegaMenu */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <MegaMenu />
            </nav>

            {/* Right Action Icons (Search, Account, Wishlist, Cart) */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search button / bar */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-stone-600 bg-vastrika-ivory-100 hover:bg-vastrika-ivory-200 border border-vastrika-ivory-300 text-xs transition"
                title="Search handcrafted styles"
              >
                <Search className="w-4 h-4 text-vastrika-maroon-700" />
                <span className="hidden md:inline font-normal">Search sarees, kurtis...</span>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-stone-700 hover:text-vastrika-maroon-700 transition"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-vastrika-maroon-700 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-full bg-vastrika-maroon-50 text-vastrika-maroon-900 hover:bg-vastrika-maroon-100 transition border border-vastrika-maroon-200"
                title="View Bag"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-vastrika-maroon-800" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-vastrika-maroon-800 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline text-xs font-semibold text-vastrika-maroon-900">
                  {subtotal > 0 ? formatPrice(subtotal) : 'Bag'}
                </span>
              </button>

              {/* User Account Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-2 rounded-full hover:bg-vastrika-ivory-200 text-stone-700 transition"
                  title="User Profile"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:inline" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-luxury-lg border border-vastrika-ivory-300 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    {user ? (
                      <div>
                        <div className="px-4 py-2 border-b border-vastrika-ivory-200">
                          <p className="text-xs text-stone-500">Namaste,</p>
                          <p className="text-sm font-bold text-vastrika-maroon-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                          {user.role === 'ADMIN' && (
                            <span className="inline-block mt-1 text-[10px] bg-vastrika-gold-100 text-vastrika-gold-800 font-bold px-2 py-0.5 rounded-full border border-vastrika-gold-300">
                              ADMIN ACCESS
                            </span>
                          )}
                        </div>

                        {user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-vastrika-maroon-800 hover:bg-vastrika-maroon-50"
                          >
                            <ShieldCheck className="w-4 h-4 text-vastrika-gold-600" />
                            Admin Panel
                          </Link>
                        )}

                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-vastrika-ivory-100"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>

                        <Link
                          href="/account/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-vastrika-ivory-100"
                        >
                          <Package className="w-4 h-4" />
                          My Orders & Tracking
                        </Link>

                        <Link
                          href="/account/addresses"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-vastrika-ivory-100"
                        >
                          <MapPin className="w-4 h-4" />
                          Saved Addresses
                        </Link>

                        <div className="border-t border-vastrika-ivory-200 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3">
                        <p className="text-xs text-stone-600 mb-3 text-center">
                          Experience handcrafted luxury.
                        </p>
                        <Link
                          href="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block w-full text-center bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white text-xs font-semibold py-2 rounded-lg transition mb-2 shadow"
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block w-full text-center bg-vastrika-ivory-100 hover:bg-vastrika-ivory-200 text-vastrika-maroon-900 border border-vastrika-ivory-300 text-xs font-semibold py-2 rounded-lg transition"
                        >
                          Create Account
                        </Link>
                        <div className="mt-3 pt-2 border-t border-vastrika-ivory-200 text-[11px] text-center text-stone-500">
                          Demo Admin: <code>admin@vastrika.com</code>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Secondary Quick Category Strip */}
      <div className="hidden lg:block bg-vastrika-ivory-100/90 border-b border-vastrika-ivory-300 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-8 text-[12px] font-medium tracking-wider uppercase text-stone-700">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-vastrika-maroon-800 transition py-1 relative ${
                link.isSale ? 'text-red-700 font-bold' : ''
              }`}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-vastrika-maroon-700" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-vastrika-ivory-300">
                <span className="font-serif text-xl font-bold tracking-widest text-vastrika-maroon-900">
                  VASTRIKA
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-500 hover:text-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-semibold tracking-wide text-stone-800 hover:bg-vastrika-ivory-100 hover:text-vastrika-maroon-800 rounded-lg transition"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-vastrika-ivory-300">
              {user ? (
                <div className="space-y-2">
                  <div className="text-xs text-stone-500">Signed in as {user.name}</div>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-vastrika-ivory-100 text-vastrika-maroon-900 py-2 rounded-lg text-xs font-semibold"
                  >
                    My Account & Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center text-red-600 text-xs font-semibold py-1.5"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center bg-vastrika-maroon-900 text-white py-2 rounded-lg text-xs font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center bg-vastrika-ivory-100 border border-vastrika-ivory-300 text-vastrika-maroon-900 py-2 rounded-lg text-xs font-semibold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Interactive Search Modal Overlay */}
      {searchModalOpen && <SearchBar onClose={() => setSearchModalOpen(false)} />}
    </header>
  );
}
