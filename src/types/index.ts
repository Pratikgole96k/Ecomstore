export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  avatar?: string | null;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
}

export interface ProductVariantItem {
  id: string;
  productId: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface ProductImageItem {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
}

export interface ReviewItem {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  createdAt: string | Date;
  user?: {
    name: string;
    avatar?: string | null;
  };
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  mrp: number;
  discount?: number | null;
  sku: string;
  categoryId: string;
  category?: CategoryItem;
  brand: string;
  fabric?: string | null;
  occasion?: string | null;
  pattern?: string | null;
  gender: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  images: ProductImageItem[];
  variants: ProductVariantItem[];
  reviews?: ReviewItem[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CartItemType {
  id: string;
  productId: string;
  variantId?: string | null;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  stock: number;
}

export interface AddressItem {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface CouponItem {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FLAT';
  value: number;
  minimumOrder: number;
  maximumDiscount?: number | null;
  expiryDate?: string | Date | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
}

export type PaymentMethod = 'RAZORPAY' | 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED';

export interface OrderItemDetail {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  variantInfo?: string | null;
  quantity: number;
  price: number;
  imageUrl?: string | null;
}

export interface OrderTrackingStep {
  id: string;
  orderId: string;
  status: OrderStatus | string;
  message: string;
  location?: string | null;
  timestamp: string | Date;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  userId?: string | null;
  addressId?: string | null;
  shippingName?: string | null;
  shippingPhone?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPincode?: string | null;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  couponCode?: string | null;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: OrderItemDetail[];
  tracking?: OrderTrackingStep[];
  user?: {
    name: string;
    email: string;
    phone?: string | null;
  };
}

export interface FilterOptions {
  category?: string;
  gender?: string;
  fabric?: string[];
  occasion?: string[];
  color?: string[];
  size?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'discount';
  query?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
}
