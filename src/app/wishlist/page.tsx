'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { ProductItem } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/products?limit=50');
        if (res.ok) {
          const data = await res.json();
          const filtered = (data.products || []).filter((p: ProductItem) =>
            wishlistIds.includes(p.id)
          );
          setProducts(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadWishlistProducts();
  }, [wishlistIds]);

  const handleMoveToCart = (product: ProductItem) => {
    const variant = product.variants?.[0];
    addItem({
      id: `${product.id}-${variant?.id || 'std'}`,
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      slug: product.slug,
      price: variant?.price || product.price,
      mrp: product.mrp,
      image:
        product.images?.[0]?.imageUrl ||
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      size: variant?.size || 'Free Size',
      color: variant?.color || 'Standard',
      stock: variant?.stock || 10,
      quantity: 1,
    });
    toggleWishlist(product);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-vastrika-gold-600 animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="bg-white p-10 rounded-3xl border border-vastrika-ivory-300 shadow-luxury space-y-4">
          <div className="w-16 h-16 rounded-full bg-vastrika-maroon-50 text-vastrika-maroon-800 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Bookmark your favorite handcrafted Banarasi sarees, bridal lehengas, and kurtis to view them here.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-vastrika-maroon-950">
          My Wishlist ({products.length})
        </h1>
        <p className="text-xs text-stone-500 mt-1">Your saved handcrafted royal drapes & couture.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl overflow-hidden border border-vastrika-ivory-300 shadow-luxury flex flex-col justify-between group"
          >
            <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
              <Link href={`/product/${product.slug}`}>
                <img
                  src={
                    product.images?.[0]?.imageUrl ||
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </Link>
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-600 hover:bg-white shadow"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                  {product.fabric || 'Pure Silk'}
                </span>
                <Link
                  href={`/product/${product.slug}`}
                  className="font-serif text-sm font-bold text-stone-900 hover:text-vastrika-maroon-800 line-clamp-1"
                >
                  {product.name}
                </Link>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-base font-bold text-vastrika-maroon-950">
                    {formatPrice(product.price)}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-xs text-stone-400 line-through">
                      {formatPrice(product.mrp)}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleMoveToCart(product)}
                className="w-full py-2.5 px-3 rounded-xl bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-vastrika-gold-400" />
                <span>Move to Bag</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
