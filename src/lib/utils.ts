import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number as Indian Rupee currency (e.g. ₹4,999)
 */
export function formatPrice(
  price: number | string,
  options: {
    currency?: 'INR' | 'USD' | 'EUR';
    notation?: Intl.NumberFormatOptions['notation'];
    showDecimals?: boolean;
  } = {}
) {
  const { currency = 'INR', notation = 'standard', showDecimals = false } = options;
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numericPrice)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  }).format(numericPrice);
}

/**
 * Format standard readable date (e.g. 15 Aug 2026, 04:30 PM)
 */
export function formatDate(date: Date | string | number) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

/**
 * Generate human readable unique order number like VAST-2026-87421
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VAS-${timestamp}-${random}`;
}

/**
 * Calculate percentage discount between MRP and Sale Price
 */
export function calculateDiscount(price: number, mrp: number): number {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/**
 * Slugify text helper
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * Dynamically compress and resize image URLs for lightning-fast delivery
 */
export function optimizeImageUrl(url: string | null | undefined, width = 600, quality = 75): string {
  if (!url) return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=75';
  
  if (url.includes('images.unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
  }

  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
  }

  return url;
}

/**
 * Free shipping threshold (₹1999)
 */
export const FREE_SHIPPING_THRESHOLD = 1999;
export const STANDARD_SHIPPING_FEE = 99;
export const GST_RATE = 0.05; // 5% GST on Indian Apparel
