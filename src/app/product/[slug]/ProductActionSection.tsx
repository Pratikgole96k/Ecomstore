'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Zap,
  Star,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Truck,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { ProductItem, ProductVariantItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import VariantSelector from '@/components/product/VariantSelector';
import PincodeChecker from '@/components/shared/PincodeChecker';
import SizeChartModal from '@/components/shared/SizeChartModal';

export default function ProductActionSection({ product }: { product: ProductItem }) {
  const router = useRouter();
  const { addItem, setIsCartDrawerOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantItem | null>(
    product.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isLiked = isInWishlist(product.id);
  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock ?? 10;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      id: `${product.id}-${selectedVariant?.id || 'std'}`,
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      mrp: product.mrp,
      image:
        product.images?.[0]?.imageUrl ||
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      size: selectedVariant?.size || 'Free Size',
      color: selectedVariant?.color || 'Standard',
      stock: currentStock,
      quantity,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    addItem({
      id: `${product.id}-${selectedVariant?.id || 'std'}`,
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      mrp: product.mrp,
      image:
        product.images?.[0]?.imageUrl ||
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      size: selectedVariant?.size || 'Free Size',
      color: selectedVariant?.color || 'Standard',
      stock: currentStock,
      quantity,
    });

    setIsCartDrawerOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="space-y-6">
      {/* Brand, Tag & SKU */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-vastrika-gold-700">
            {product.brand || 'VASTRIKA'}
          </span>
          <span className="text-[11px] font-mono text-stone-400">SKU: {product.sku}</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-vastrika-maroon-950 mt-1">
          {product.name}
        </h1>

        {/* Rating summary */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 bg-vastrika-gold-100 text-vastrika-gold-800 px-2 py-0.5 rounded-md text-xs font-bold border border-vastrika-gold-300">
            <Star className="w-3.5 h-3.5 fill-vastrika-gold-600 text-vastrika-gold-600" />
            <span>{product.averageRating?.toFixed(1) || '4.9'}</span>
          </div>
          <span className="text-xs text-stone-500">
            Based on {product.reviewCount || 18} verified buyer reviews
          </span>
        </div>
      </div>

      {/* Pricing and Discount */}
      <div className="p-4 rounded-2xl bg-vastrika-ivory-100 border border-vastrika-ivory-300 flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-3xl font-bold text-vastrika-maroon-950">
            {formatPrice(currentPrice)}
          </span>
          {product.mrp > currentPrice && (
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(product.mrp)}
            </span>
          )}
          {product.discount && product.discount > 0 && (
            <span className="bg-vastrika-maroon-900 text-vastrika-gold-300 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              SAVE {product.discount}%
            </span>
          )}
        </div>
        <span className="text-xs text-stone-500 font-medium">Inclusive of all taxes</span>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {/* Variant Selector (Sizes, Colors, Stock status) */}
      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
          onOpenSizeGuide={() => setSizeChartOpen(true)}
        />
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-stone-500 font-medium">Quantity:</span>
        <div className="flex items-center border border-vastrika-ivory-300 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className="p-2 px-3 text-stone-600 hover:bg-vastrika-ivory-100 transition disabled:opacity-30"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-bold text-stone-900">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            disabled={quantity >= currentStock || isOutOfStock}
            className="p-2 px-3 text-stone-600 hover:bg-vastrika-ivory-100 transition disabled:opacity-30"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons: Add to Bag, Buy Now, Wishlist */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : isOutOfStock
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-vastrika-maroon-900 hover:bg-vastrika-maroon-800 text-white shadow-vastrika-maroon-950/15'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 text-vastrika-gold-400" />
                <span>Add to Shopping Bag</span>
              </>
            )}
          </button>

          <button
            onClick={() => toggleWishlist(product)}
            className={`p-4 rounded-xl border transition flex items-center justify-center ${
              isLiked
                ? 'bg-vastrika-maroon-900 border-vastrika-maroon-900 text-white shadow'
                : 'bg-white border-vastrika-ivory-300 text-stone-700 hover:border-vastrika-maroon-800'
            }`}
            title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
          </button>
        </div>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider bg-vastrika-gold-500 hover:bg-vastrika-gold-600 text-vastrika-charcoal-950 transition shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4 fill-vastrika-charcoal-950" />
          <span>Buy Now With 1-Click</span>
        </button>
      </div>

      {/* Pincode Delivery Checker */}
      <PincodeChecker />

      {/* Brand Trust Pillars */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-vastrika-ivory-300 text-center">
        <div className="p-2.5 rounded-xl bg-white border border-vastrika-ivory-300 flex flex-col items-center gap-1">
          <Truck className="w-4 h-4 text-vastrika-gold-600" />
          <span className="text-[10px] font-bold text-stone-800">Free Express Delivery</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-vastrika-ivory-300 flex flex-col items-center gap-1">
          <RotateCcw className="w-4 h-4 text-vastrika-gold-600" />
          <span className="text-[10px] font-bold text-stone-800">7-Day Easy Returns</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-vastrika-ivory-300 flex flex-col items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-vastrika-gold-600" />
          <span className="text-[10px] font-bold text-stone-800">100% Handloom Certified</span>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        category={product.gender}
      />
    </div>
  );
}
