'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItemType, CouponItem } from '@/types';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, GST_RATE } from '@/lib/utils';

interface CartContextType {
  items: CartItemType[];
  addItem: (item: Omit<CartItemType, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: CouponItem | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  itemCount: number;
  freeShippingProgress: number; // percentage (0 - 100)
  amountForFreeShipping: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponItem | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('vastrika_cart');
      const savedCoupon = localStorage.getItem('vastrika_coupon');
      if (savedCart) setItems(JSON.parse(savedCart));
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('vastrika_cart', JSON.stringify(items));
      if (appliedCoupon) {
        localStorage.setItem('vastrika_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('vastrika_coupon');
      }
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items, appliedCoupon, isLoaded]);

  const addItem = (item: Omit<CartItemType, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = item.quantity || 1;
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + qtyToAdd, item.stock || 99);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        return [...prev, { ...item, quantity: qtyToAdd }];
      }
    });
    setIsCartDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const validQty = Math.min(quantity, item.stock || 99);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Coupon discount calculation
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minimumOrder) {
    if (appliedCoupon.type === 'PERCENTAGE') {
      discount = (subtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maximumDiscount && discount > appliedCoupon.maximumDiscount) {
        discount = appliedCoupon.maximumDiscount;
      }
    } else {
      discount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  // Shipping
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const freeShippingProgress = Math.min(Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100), 100);
  const amountForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  // Tax (5% GST on Indian Apparels)
  const taxableAmount = Math.max(subtotal - discount, 0);
  const tax = Math.round(taxableAmount * GST_RATE * 100) / 100;

  // Final Total
  const total = Math.max(taxableAmount + shippingFee + tax, 0);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(code)}&amount=${subtotal}`);
      const data = await res.json();
      if (!res.ok || !data.coupon) {
        return { success: false, message: data.message || 'Invalid coupon code' };
      }
      setAppliedCoupon(data.coupon);
      return { success: true, message: `Coupon ${data.coupon.code} applied successfully!` };
    } catch (e) {
      return { success: false, message: 'Could not validate coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        itemCount,
        freeShippingProgress,
        amountForFreeShipping,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
