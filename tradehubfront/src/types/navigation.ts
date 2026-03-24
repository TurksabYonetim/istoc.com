/**
 * TypeScript interfaces for navigation, categories, and footer links
 * Used by Header and Footer components in the TR TradeHub platform
 */

/**
 * Represents a navigation link item
 * Used in header navigation, footer links, and mega menu items
 */
export interface NavLink {
  /** Display text for the link */
  label: string;
  /** URL path or href for the link */
  href: string;
  /** Optional icon identifier (SVG name or icon class) */
  icon?: string;
  /** Optional badge content (e.g., cart count, notification count) */
  badge?: string | number;
}

/**
 * Represents a category in the mega menu
 * Categories can be nested with subcategories for hierarchical navigation
 */
export interface Category {
  /** Unique identifier for the category */
  id: string;
  /** Display name for the category */
  name: string;
  /** Optional icon identifier (SVG name or icon class) */
  icon?: string;
  /** Optional nested subcategories */
  subcategories?: Category[];
}

/**
 * Represents a column of links in the footer
 * Each column has a title and list of navigation links
 */
export interface FooterColumn {
  /** Column header title */
  title: string;
  /** List of links in this column */
  links: NavLink[];
}

/**
 * Represents a social media link with icon
 */
export interface SocialLink {
  /** Platform name (e.g., 'facebook', 'twitter', 'linkedin') */
  platform: string;
  /** URL to the social media profile */
  href: string;
  /** Icon identifier for the platform */
  icon: string;
  /** Accessible label for screen readers */
  ariaLabel: string;
}

/**
 * Represents a partner/group company in the footer
 */
export interface GroupCompany {
  /** Company name */
  name: string;
  /** URL to the company website */
  href: string;
  /** Optional logo image URL */
  logo?: string;
}

/**
 * Represents a search tab option in the SearchArea component
 */
export interface SearchTab {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Whether this tab is currently active */
  isActive?: boolean;
}

/**
 * Represents configuration for the animated placeholder
 */
export interface PlaceholderConfig {
  /** Array of placeholder texts to rotate through */
  keywords: string[];
  /** Interval in milliseconds between rotations (default: 3000) */
  interval?: number;
}

/**
 * Represents a country/language option for selectors
 */
export interface LocaleOption {
  /** Country or language code (e.g., 'TR', 'EN') */
  code: string;
  /** Display name */
  name: string;
  /** Flag emoji or icon identifier */
  flag?: string;
}

/**
 * Represents a currency option for selectors
 */
export interface CurrencyOption {
  /** Currency code (e.g., 'TRY', 'USD', 'EUR') */
  code: string;
  /** Currency symbol (e.g., '₺', '$', '€') */
  symbol: string;
  /** Display name */
  name: string;
}
