/**
 * Header Components Barrel Export
 * Re-exports all header components for easier importing
 */

// TopBar component - main navigation with logo, auth, cart, locale selectors
export { TopBar, MobileSearchTabs, initMobileDrawer, initHeaderCart, initLanguageSelector, initAuthState } from './TopBar';

// SubHeader component - secondary navigation with categories trigger, nav links
export { SubHeader } from './SubHeader';

// StickyHeaderSearch — compact search expand/collapse behavior
export { initStickyHeaderSearch } from './StickyHeaderSearch';

// MegaMenu component - full-width category dropdown
export { MegaMenu, initMegaMenu, megaCategories, getCategoryIcon } from './MegaMenu';
export type { MegaMenuCategory } from './MegaMenu';

// PromoBanner component - top promotional banner (Alibaba-style)
export { PromoBanner, initPromoBanner } from './PromoBanner';
