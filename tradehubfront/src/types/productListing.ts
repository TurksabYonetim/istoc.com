/**
 * Product Listing Page — TypeScript Interfaces
 * Types for product listing cards, filter sections, search header, and sorting.
 */

/**
 * Product image kind for placeholder rendering
 * Reused from ProductGrid.ts pattern
 */
export type ProductImageKind =
  | 'jewelry'
  | 'electronics'
  | 'label'
  | 'crafts'
  | 'accessory'
  | 'clothing'
  | 'tools'
  | 'packaging';

/**
 * Product card for listing grid
 * Based on ProductCard from ProductGrid.ts
 */
export interface ProductListingCard {
  id: string;
  name: string;
  href: string;
  price: string;
  moq: string;
  stats: string;
  imageKind: ProductImageKind;
  /** Additional images for card slider (uses imageKind variants for placeholders) */
  images?: ProductImageKind[];
  imageSrc?: string;
  promo?: string;
  verified?: boolean;
  supplierYears?: number;
  supplierCountry?: string;
  rating?: number;
  reviewCount?: number;
  /** Original price for strikethrough display, e.g. "$1.99-4.31" */
  originalPrice?: string;
  /** Discount label, e.g. "5% off" */
  discount?: string;
  /** Supplier company name */
  supplierName?: string;
  /** Reorder rate percentage, e.g. 16 */
  reorderRate?: number;
  /** Selling point text, e.g. "5 günde sevkiyat" */
  sellingPoint?: string;
  /** Category name for grouping (e.g. "Elektronik") */
  category?: string;
}

/**
 * Visual configuration for product placeholders
 */
export interface ProductVisual {
  background: string;
  accent: string;
  stroke: string;
  icon: string;
}

/**
 * Sort option for product listing
 */
export interface SortOption {
  id: string;
  label: string;
  value: string;
}

/**
 * Search header information
 */
export interface SearchHeaderInfo {
  keyword: string;
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  freeShippingAvailable?: boolean;
  sortOptions: SortOption[];
  selectedSort: string;
}

/**
 * Filter option for checkbox/radio filters
 */
export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
  checked?: boolean;
}

/**
 * Price range filter
 */
export interface PriceRangeFilter {
  min?: number;
  max?: number;
  currency: string;
}

/**
 * Min order filter
 */
export interface MinOrderFilter {
  value?: number;
  unit: string;
}

/**
 * Store review rating filter
 */
export interface StoreReviewFilter {
  id: string;
  label: string;
  minRating: number;
  selected?: boolean;
}

/**
 * Category item for hierarchical category filter
 */
export interface CategoryItem {
  id: string;
  name: string;
  count?: number;
  children?: CategoryItem[];
  selected?: boolean;
  expanded?: boolean;
}

/**
 * Filter section types
 */
export type FilterSectionType =
  | 'checkbox'
  | 'radio'
  | 'price-range'
  | 'min-order'
  | 'category'
  | 'searchable-checkbox';

/**
 * Base filter section interface
 */
export interface BaseFilterSection {
  id: string;
  title: string;
  type: FilterSectionType;
  collapsible?: boolean;
  collapsed?: boolean;
}

/**
 * Checkbox filter section (Trade Assurance, Supplier features, Product features)
 */
export interface CheckboxFilterSection extends BaseFilterSection {
  type: 'checkbox';
  options: FilterOption[];
}

/**
 * Radio filter section (Store reviews)
 */
export interface RadioFilterSection extends BaseFilterSection {
  type: 'radio';
  options: StoreReviewFilter[];
}

/**
 * Price range filter section
 */
export interface PriceRangeFilterSection extends BaseFilterSection {
  type: 'price-range';
  filter: PriceRangeFilter;
}

/**
 * Min order filter section
 */
export interface MinOrderFilterSection extends BaseFilterSection {
  type: 'min-order';
  filter: MinOrderFilter;
}

/**
 * Category filter section with hierarchical items
 */
export interface CategoryFilterSection extends BaseFilterSection {
  type: 'category';
  items: CategoryItem[];
  showMore?: boolean;
  maxVisible?: number;
}

/**
 * Searchable checkbox filter section (Supplier country, Certifications)
 */
export interface SearchableCheckboxFilterSection extends BaseFilterSection {
  type: 'searchable-checkbox';
  options: FilterOption[];
  searchPlaceholder?: string;
  searchQuery?: string;
}

/**
 * Union type for all filter sections
 */
export type FilterSection =
  | CheckboxFilterSection
  | RadioFilterSection
  | PriceRangeFilterSection
  | MinOrderFilterSection
  | CategoryFilterSection
  | SearchableCheckboxFilterSection;

/**
 * Complete filter sidebar state
 */
export interface FilterSidebarState {
  sections: FilterSection[];
  activeFilters: ActiveFilter[];
}

/**
 * Active filter for filter chips/tags display
 */
export interface ActiveFilter {
  sectionId: string;
  sectionTitle: string;
  filterId: string;
  label: string;
  value: string;
}

/**
 * Product listing page state
 */
export interface ProductListingState {
  searchHeader: SearchHeaderInfo;
  filters: FilterSidebarState;
  products: ProductListingCard[];
  loading?: boolean;
  error?: string;
}

/**
 * Price tier for cart drawer quantity brackets
 */
export interface ListingPriceTier {
  minQty: number;
  maxQty: number | null;  // null = unlimited
  price: number;
  originalPrice?: number;
}

/**
 * Color variant for cart drawer color rows
 */
export interface ListingColorVariant {
  id: string;
  label: string;
  hex: string;
  imageKind: ProductImageKind;
}

/**
 * View mode for product grid
 */
export type ViewMode = 'grid' | 'list';

/**
 * Grid configuration
 */
export interface GridConfig {
  viewMode: ViewMode;
  columnsDesktop: number;
  columnsTablet: number;
  columnsMobile: number;
  gap: number;
}
