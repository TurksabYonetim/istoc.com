/**
 * Checkout Page — TypeScript Interfaces
 * Types for shipping address, order summary, modal, payment icons, and form data.
 */

export interface Country {
  code: string;
  name: string;
  flag: string;
  phonePrefix: string;
}

export interface Province {
  code: string;
  name: string;
}

export interface OrderSummaryThumbnail {
  image: string;
  quantity: number;
}

export interface OrderSummary {
  itemCount: number;
  thumbnails: OrderSummaryThumbnail[];
  itemSubtotal: number;
  shipping: number;
  subtotal: number;
  processingFee: number;
  total: number;
  currency: string;
}

export interface ModalSection {
  id: string;
  iconType: string;
  title: string;
  description: string;
  learnMoreText?: string;
  learnMoreUrl?: string;
}

export interface PaymentIcon {
  name: string;
  altText: string;
  bgColor: string;
  textColor: string;
}

export interface SavedAddress {
  label: string;
  fullAddress: string;
  country: string;
  countryName: string;
  firstName: string;
  lastName: string;
  phone: string;
  phonePrefix: string;
  street: string;
  apartment: string;
  state: string;
  city: string;
  postalCode: string;
}

export interface CheckoutFormData {
  country: string;
  firstName: string;
  lastName: string;
  phonePrefix: string;
  phone: string;
  streetAddress: string;
  apartment: string;
  state: string;
  city: string;
  postalCode: string;
  isDefaultAddress: boolean;
}

export interface PageContent {
  pageTitle: string;
  shippingAddressTitle: string;
  paymentMethodTitle: string;
  itemsDeliveryTitle: string;
  orderSummaryTitle: string;
  orderProtectionTitle: string;
  submitButtonText: string;
  useCurrentLocationText: string;
  savedAddressLabel: string;
  requiredFieldError: string;
  countryLabel: string;
  firstNameLabel: string;
  lastNameLabel: string;
  phoneLabel: string;
  streetAddressLabel: string;
  apartmentLabel: string;
  stateLabel: string;
  cityLabel: string;
  postalCodeLabel: string;
  defaultAddressCheckbox: string;
  orderProtectionLinkText: string;
  trustIconsLabel: string;
}
