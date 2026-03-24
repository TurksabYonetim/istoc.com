/**
 * Shopping Cart Page — TypeScript Interfaces
 * Types for cart items, suppliers, summary, and assurance data.
 */

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface CartSku {
  id: string;
  skuImage: string;
  variantText: string;
  unitPrice: number;
  currency: string;
  unit: string;
  quantity: number;
  minQty: number;
  maxQty: number;
  selected: boolean;
  baseUnitPrice: number;
  basePriceAddon: number;
  baseCurrency: string;
  listingVariant?: string;  // Frappe Listing Variant adı (merge için)
  isAvailable?: boolean;    // false ise listing silinmiş/pasif, snapshot gösteriliyor
}

export interface CartShippingMethod {
  id: string;
  method: string;
  estimatedDays: string;
  baseCost: number;
  baseCurrency: string;
}

export interface CartProduct {
  id: string;
  title: string;
  href: string;
  tags: CartProductTag[];
  moqLabel: string;
  favoriteIcon: string;
  deleteIcon: string;
  skus: CartSku[];
  selected: boolean;
}

export interface CartProductTag {
  type: 'DELIVERY_GUARANTEE' | 'PROMOTION';
  text: string;
  color: string;
  bgColor: string;
}

export interface CartSupplier {
  id: string;
  name: string;
  href: string;
  selected: boolean;
  products: CartProduct[];
  paymentMethods?: PaymentMethod[];
  shippingFee?: number;  // Satıcı bazlı kargo ücreti (checkout'ta seçilince CartStore'a set edilir)
}

export interface CartSummaryData {
  selectedCount: number;
  items: CartSummaryItem[];
  productSubtotal: number;
  discount: number;
  couponDiscount: number;
  couponCode: string;
  shippingFee: number;
  subtotal: number;
  currency: string;
}

export interface CartSummaryItem {
  image: string;
  quantity: number;
}

export interface AssuranceItem {
  icon: string;
  title: string;
  description: string;
  logos?: string[];
}
