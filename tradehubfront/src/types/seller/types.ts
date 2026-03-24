/**
 * Seller Storefront — TypeScript Interfaces
 * All data types for C1–C13 components
 */

// ─── C1: Store Profile Header ───────────────────────────
export interface SellerProfile {
  name: string;
  slug: string;
  logo: string;
  verificationType: 'Verified' | 'Verified PRO';
  verificationBadgeType: 'standard' | 'pro';
  yearsOnPlatform: number;
  location: string;
  mainCategories: string[];
  email?: string;
  phone?: string;
  website?: string;
  city?: string;
  district?: string;
  address?: string;
  company_name?: string;
  description?: string;
  business_type?: string;
  main_markets?: string;
  staff_count?: number;
  annual_revenue?: string;
  founded_year?: number;
  deliveryBadge?: string;
  assessmentBadge?: string;
  verificationDate: string;
  /** PRO sellers can have category grid */
  hasCategoryGrid?: boolean;
  /** PRO sellers can have category listings */
  hasCategoryListing?: boolean;
}

// ─── C2: Store Navigation Bar ───────────────────────────
export interface NavCategory {
  name: string;
  slug: string;
  hasSubcategories: boolean;
  subcategories?: Array<{ name: string; href: string }>;
}

export interface StoreNavData {
  items: Array<{
    label: string;
    href: string;
    isActive: boolean;
    dropdownType?: 'products' | 'company';
  }>;
  productCategories: NavCategory[];
  companyProfileLinks: Array<{
    label: string;
    href: string;
  }>;
  customTab?: string;
  searchPlaceholder: string;
}

// ─── C3: Hero Banner Carousel ───────────────────────────
export interface HeroSlide {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  textPosition?: 'left' | 'center' | 'right';
  textColor?: 'white' | 'dark';
}

export interface HeroBannerData {
  slides: HeroSlide[];
  autoplayDelay?: number;
  showPagination?: boolean;
}

// ─── C4: Category Grid ──────────────────────────────────
export interface CategoryCard {
  id: string;
  name: string;
  bgColor: string;
  image: string;
  link?: string;
}

// ─── C5: Hot Products ───────────────────────────────────
export interface SimpleProduct {
  id: string;
  name: string;
  image: string;
  link: string;
}

// ─── C6: Category Product Listing ───────────────────────
export interface DetailedProduct {
  id: string;
  name: string;
  image: string;
  hasVideo: boolean;
  badges: Array<{ type: string; label: string }>;
  priceMin: number;
  priceMax: number;
  moq: number;
  moqUnit: string;
  soldCount: number;
  link: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  bannerImage: string;
  products: DetailedProduct[];
}

// ─── C7: Company Info ───────────────────────────────────
export interface FactoryPhoto {
  id: string;
  image: string;
  caption: string;
}

export interface CarouselPhoto {
  id: string;
  image: string;
  caption: string;
}

export interface Location {
  id: string;
  name: string;
  image: string;
}

export interface CompanyInfo {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  descriptionExtended?: string;
  factoryPhotos: FactoryPhoto[];
  carouselPhotos: CarouselPhoto[];
  locations: Location[];
}

// ─── C8: Certificates ───────────────────────────────────
export interface Certificate {
  id: string;
  name: string;
  image: string;
}

// ─── C9: Why Choose Us ──────────────────────────────────
export interface Advantage {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
}

// ─── C10: Company Introduction ──────────────────────────
export interface CompanyInfoCell {
  label: string;
  value: string;
  icon: string;
  verified: boolean;
}

export interface CompanyPhoto {
  id: string;
  image: string;
  caption: string;
  hasVideo?: boolean;
}

// ─── C11: Gallery ───────────────────────────────────────
export interface GalleryPhoto {
  id: string;
  image: string;
  caption?: string;
}

export interface GalleryData {
  title?: string;
  photos: GalleryPhoto[];
  columns?: 3 | 4;
}

// ─── C12: Contact Form ──────────────────────────────────
export interface ContactRecipient {
  name: string;
  title?: string;
  department?: string;
}

export interface ContactFormData {
  title?: string;
  recipient: ContactRecipient;
  placeholder?: string;
  maxLength?: number;
  businessCardDefault?: boolean;
}

// ─── C13: Floating Actions ──────────────────────────────
export interface FloatingActionButton {
  id: string;
  label: string;
  icon: string;
  bgColor: string;
  hoverColor: string;
  action: 'scroll-to-contact' | 'open-chat';
  ariaLabel: string;
}

export interface FloatingActionsData {
  buttons: FloatingActionButton[];
  topPosition?: string;
}

// ─── Page-level data aggregate ──────────────────────────
export interface SellerStorefrontData {
  seller: SellerProfile;
  navData: StoreNavData;
  heroBanner: HeroBannerData;
  categoryCards?: CategoryCard[];
  hotProducts: SimpleProduct[];
  categoryListings?: ProductCategory[];
  company: CompanyInfo;
  certificates?: Certificate[];
  advantages?: Advantage[];
  features?: Feature[];
  companyInfoCells?: CompanyInfoCell[];
  companyPhotos?: CompanyPhoto[];
  galleryPhotos?: GalleryPhoto[];
  contactForm: ContactFormData;
  floatingActions: FloatingActionsData;
}
export interface SellerReview { id: string; reviewerName: string; country: string; countryFlag: string; date: string; comment: string; productName: string; productImage: string; productPrice: string; } 
export interface SellerPerformanceStats { rating: number; reviewCount: number; responseTime: string; onTimeDeliveryRate: string; transactions: number; supplierServiceScore: number; onTimeShipmentScore: number; productQualityScore: number; }
