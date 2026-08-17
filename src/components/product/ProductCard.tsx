'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { ProductItem } from '@/types';
import { formatPrice, optimizeImageUrl } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: ProductItem;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [addedEffect, setAddedEffect] = useState(false);

  const isLiked = isInWishlist(product.id);

  const primaryImage = optimizeImageUrl(product.images?.[0]?.imageUrl, 600, 75);
  const secondaryImage = optimizeImageUrl(product.images?.[1]?.imageUrl || product.images?.[0]?.imageUrl, 600, 75);

  const defaultVariant = product.variants?.[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}-${defaultVariant?.id || 'default'}`,
      productId: product.id,
      variantId: defaultVariant?.id,
      name: product.name,
      slug: product.slug,
      price: defaultVariant?.price || product.price,
      mrp: product.mrp,
      image: primaryImage,
      size: defaultVariant?.size || 'Free Size',
      color: defaultVariant?.color || 'Standard',
      stock: defaultVariant?.stock || 10,
      quantity: 1,
    });

    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-vastrika-ivory-300 hover:border-vastrika-gold-500/50 hover:shadow-luxury-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full bg-vastrika-ivory-100 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-vastrika-maroon-900 text-vastrika-gold-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-vastrika-gold-500/30">
              Bestseller
            </span>
          )}
          {product.isNew && !product.isBestSeller && (
            <span className="bg-stone-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              New Arrival
            </span>
          )}
          {product.discount && product.discount > 0 && (
            <span className="bg-vastrika-gold-500 text-vastrika-maroon-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 shadow-sm ${
            isLiked
              ? 'bg-vastrika-maroon-900 text-white shadow-md scale-110'
              : 'bg-white/90 text-stone-700 hover:bg-white hover:text-vastrika-maroon-900'
          }`}
          title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex gap-2">
          <button
            onClick={handleQuickAdd}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-lg ${
              addedEffect
                ? 'bg-emerald-700 text-white'
                : 'bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white'
            }`}
          >
            {addedEffect ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Quick Add</span>
              </>
            )}
          </button>

          <Link
            href={`/product/${product.slug}`}
            className="p-2.5 rounded-xl bg-white/95 hover:bg-white text-stone-800 hover:text-vastrika-maroon-900 shadow-lg transition flex items-center justify-center"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Fabric & Occasion Tag */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="truncate font-medium">{product.fabric || 'Pure Fabric'}</span>
            <span className="text-vastrika-gold-700 font-semibold">{product.occasion || 'Festive'}</span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-vastrika-maroon-800 transition">
            <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Reviews Rating summary */}
          <div className="flex items-center gap-1 mt-1 text-xs">
            <div className="flex items-center text-vastrika-gold-500">
              <Star className="w-3.5 h-3.5 fill-vastrika-gold-500" />
            </div>
            <span className="font-bold text-stone-700 text-xs">
              {product.averageRating ? product.averageRating.toFixed(1) : '4.9'}
            </span>
            <span className="text-stone-400 text-[11px]">
              ({product.reviewCount || product.reviews?.length || 18})
            </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-vastrika-ivory-200 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-vastrika-maroon-950 font-serif">
              {formatPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>

          <span className="text-[10px] text-stone-500 font-medium">
            Incl. all taxes
          </span>
        </div>
      </div>
    </div>
  );
}
