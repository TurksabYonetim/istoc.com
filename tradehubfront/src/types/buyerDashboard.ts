/**
 * Buyer Dashboard Page — TypeScript Interfaces
 * Types for sidebar, user info, orders, right panel, and shared components.
 */

// ========================================
// Sidebar
// ========================================

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string;
  active?: boolean;
  submenu?: SidebarSubmenuItem[];
}

export interface SidebarSubmenuItem {
  label: string;
  href: string;
  group?: string;
}

export interface SidebarSection {
  title?: string;
  items: SidebarMenuItem[];
}

export interface SidebarState {
  expanded: boolean;
  activeItemId: string;
  hoveredItemId: string | null;
  flyoutVisible: boolean;
}

// ========================================
// NewBuyerInfo
// ========================================

export interface UserProfile {
  avatar: string;
  username: string;
  profileHref: string;
}

export interface UserStat {
  label: string;
  count: number;
  href: string;
}

export interface NotificationSlide {
  icon?: string;
  title: string;
  description?: string;
  linkText: string;
  linkHref: string;
  bgColor: string;
}

export interface NewBuyerInfoProps {
  user: UserProfile;
  stats: UserStat[];
  notifications: NotificationSlide[];
}

// ========================================
// Orders
// ========================================

export interface OrdersTabItem {
  id: string;
  label: string;
  hasDropdown?: boolean;
}

export interface OrdersFilterItem {
  id: string;
  label: string;
  selected?: boolean;
}

export interface OrdersState {
  activeTabId: string;
  selectedFilterId: string | null;
  dropdownOpen: boolean;
  loading: boolean;
}

// ========================================
// Shared Components
// ========================================

export interface SectionCardProps {
  children: string;
  className?: string;
}

export interface SectionHeaderProps {
  title: string;
  actionText?: string;
  actionHref?: string;
}

export interface EmptyStateProps {
  icon: string;
  text: string;
  linkText?: string;
  linkHref?: string;
}

export interface ProductCardProps {
  image: string;
  price: string;
  currency: string;
  minOrder: string;
  href: string;
}

export interface PromotionBannerProps {
  title: string;
  subtitle: string;
  image: string;
  bgColor: string;
  href: string;
}

export interface DotIndicatorProps {
  total: number;
  activeIndex: number;
  className?: string;
}

// ========================================
// Right Panel — Browsing History & Promotions
// ========================================

export interface BrowsingHistoryProduct {
  id: string;
  image: string;
  price: number;
  currency: string;
  minOrder: string;
  href: string;
}

export interface PromotionBannerData {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  bgColor: string;
  href: string;
}

// ========================================
// Master Data Type
// ========================================

export interface BuyerDashboardData {
  user: UserProfile;
  stats: UserStat[];
  notifications: NotificationSlide[];
  browsingHistory: BrowsingHistoryProduct[];
  promotions: PromotionBannerData[];
}
