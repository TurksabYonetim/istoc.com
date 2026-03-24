/**
 * Right Panel Data — Static Configuration
 * Section layout config, empty state text/icons for the right panel.
 * Wrapped in getter functions so t() is called at render time.
 */

import { t } from '../../i18n';

export interface RightPanelSectionConfig {
  id: string;
  title: string;
  actionText?: string;
  actionHref?: string;
}

export interface FavoritesEmptyConfig {
  icon: string;
  text: string;
  linkText: string;
  linkHref: string;
}

/** Package + heart SVG icon for favorites empty state */
const favoritesEmptyIcon = `
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="8" y="12" width="24" height="20" rx="2" stroke="#ccc" stroke-width="2" fill="none"/>
    <path d="M8 18h24" stroke="#ccc" stroke-width="2"/>
    <path d="M16 12v6" stroke="#ccc" stroke-width="2"/>
    <path d="M34 20c-1.5-1.5-4-1.5-5.5 0L27 21.5 25.5 20c-1.5-1.5-4-1.5-5.5 0s-1.5 4 0 5.5L27 32.5l7-7c1.5-1.5 1.5-4 0-5.5z" fill="#E67A00" opacity="0.7"/>
  </svg>
`;

export function getFavoritesConfig(): RightPanelSectionConfig {
  return {
    id: 'favorites',
    title: t('dashboard.favorites'),
  };
}

export function getFavoritesEmptyState(): FavoritesEmptyConfig {
  return {
    icon: favoritesEmptyIcon,
    text: t('dashboard.noFavorites'),
    linkText: t('dashboard.explore'),
    linkHref: '/products',
  };
}

export function getBrowsingHistoryConfig(): RightPanelSectionConfig {
  return {
    id: 'browsing-history',
    title: t('dashboard.browsingHistoryTitle'),
    actionText: t('dashboard.viewAllHistory'),
    actionHref: '/browsing-history',
  };
}

export function getPromotionConfig(): RightPanelSectionConfig {
  return {
    id: 'promotions',
    title: t('dashboard.promotionTitle'),
  };
}
