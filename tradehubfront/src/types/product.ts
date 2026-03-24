/**
 * Product Detail Page — TypeScript Interfaces
 * Types for product detail, supplier, reviews, and related data.
 */

export interface ProductImage {
  id: string;
  src: string;
  alt: string;
  isVideo?: boolean;
}

export interface PriceTier {
  minQty: number;
  maxQty: number | null;
  price: number;
  basePrice?: number;
  currency: string;
}

export interface ProductVariant {
  type: 'color' | 'size' | 'material';
  label: string;
  options: VariantOption[];
}

export interface VariantOption {
  id: string;
  label: string;
  value: string;
  thumbnail?: string;
  available: boolean;
  price?: number;
  rawPrice?: number;
  priceAddon?: number;
  basePriceAddon?: number;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  country: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  helpful: number;
  tags?: string[];
  verified?: boolean;
  repeatBuyer?: boolean;
  supplierReply?: string;
  countryName?: string;
  productTitle?: string;
  productPrice?: string;
  productImage?: string;
}

export interface ReviewCategoryRating {
  label: string;
  score: number;
}

export interface ReviewMentionTag {
  label: string;
  count: number;
}

export interface SupplierInfo {
  name: string;
  verified: boolean;
  yearsInBusiness: number;
  responseTime: string;
  responseRate: string;
  onTimeDelivery: string;
  mainProducts: string[];
  employees: string;
  annualRevenue: string;
  certifications: string[];
}

export interface ShippingInfo {
  method: string;
  estimatedDays: string;
  cost: string;
  baseCost?: number;
  baseCurrency?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LeadTimeRange {
  quantityRange: string;
  days: string;
}

export interface CustomizationOption {
  name: string;
  priceAddon: string;
  minOrder: string;
}

export interface ProductDetail {
  id: string;
  title: string;
  category: string[];
  images: ProductImage[];
  priceTiers: PriceTier[];
  priceMin?: number;
  priceMax?: number;
  moq: number;
  unit: string;
  leadTime: string;
  shipping: ShippingInfo[];
  variants: ProductVariant[];
  specs: ProductSpec[];
  packagingSpecs: ProductSpec[];
  description: string;
  packaging: string;
  rating: number;
  reviewCount: number;
  orderCount: string;
  reviews: ProductReview[];
  samplePrice?: number;
  baseSamplePrice?: number;
  baseCurrency: string;
  supplier: SupplierInfo;
  faq: FAQItem[];
  leadTimeRanges: LeadTimeRange[];
  customizationOptions: CustomizationOption[];
  reviewCategoryRatings: ReviewCategoryRating[];
  storeReviewCount: number;
  reviewMentionTags: ReviewMentionTag[];
}
