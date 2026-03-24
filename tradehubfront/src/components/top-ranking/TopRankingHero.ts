/**
 * TopRankingHero Component
 * Full-width beige gradient hero banner containing:
 * - Title + subtitle (centered, desktop only)
 * - Region + Category dropdown filters (centered, both mobile and desktop)
 *
 * Also exports mobile-specific headers:
 * - TopRankingMobileHeader()  — compact header that scrolls with content
 * - TopRankingStickyMobileHeader() — fixed header that appears when hero scrolls out
 */

import { t } from '../../i18n';
import { TopRankingFilters } from './TopRankingFilters';

/**
 * Mobile-only compact header for Top Ranking page
 * White background bar with back arrow, centered title, search icon
 */
export function TopRankingMobileHeader(): string {
  return `
    <div class="lg:hidden bg-white">
      <!-- Nav row: back + title + search -->
      <div class="flex items-center justify-between px-4 pt-3 pb-3">
        <a href="javascript:history.back()" class="text-gray-800 p-1 -ml-1" aria-label="${t('common.goBack')}" data-i18n-aria-label="common.goBack">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
          </svg>
        </a>
        <h1 class="text-base font-bold text-[#222]" data-i18n="topRankingPage.heroTitle">${t('topRankingPage.heroTitle')}</h1>
        <button type="button" class="text-gray-800 p-1 -mr-1" aria-label="${t('common.search')}" data-i18n-aria-label="common.search">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

/**
 * Sticky compact mobile header -- appears when hero scrolls out of view
 * Layout: [< back]  ["Top Ranking" text]  [search icon]
 */
export function TopRankingStickyMobileHeader(): string {
  return `
    <div
      id="tr-sticky-mobile-header"
      class="lg:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-gray-200 transition-all duration-300 -translate-y-full opacity-0 pointer-events-none"
    >
      <div class="flex items-center gap-2.5 px-3 py-2">
        <!-- Back arrow -->
        <a href="javascript:history.back()" class="text-gray-800 flex-shrink-0" aria-label="${t('common.goBack')}" data-i18n-aria-label="common.goBack">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
          </svg>
        </a>

        <!-- Title -->
        <span class="text-sm font-bold text-gray-900 flex-shrink-0 whitespace-nowrap" data-i18n="topRankingPage.heroTitle">${t('topRankingPage.heroTitle')}</span>

        <!-- Search input -->
        <form action="/pages/products.html" method="GET" class="flex-1 min-w-0">
          <div class="flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2">
            <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <input
              type="text"
              name="q"
              class="flex-1 bg-transparent text-sm text-gray-700 border-0 outline-none p-0 min-w-0"
              placeholder="${t('search.placeholder')}"
              data-i18n-placeholder="search.placeholder"
              autocomplete="off"
            />
          </div>
        </form>
      </div>
    </div>
  `;
}

export function TopRankingHero(): string {
  return `
    <div class="relative">
      <!-- Centered content -->
      <div class="relative z-10 container-boxed py-2 sm:py-4 lg:py-10 lg:py-14 text-center">
        <!-- Title + subtitle: desktop only -->
        <div class="hidden lg:block">
          <h1
            class="text-3xl sm:text-[40px] md:text-[44px] font-bold leading-tight text-secondary-800"
            data-i18n="topRankingPage.heroTitle"
          >${t('topRankingPage.heroTitle')}</h1>
          <p
            class="mt-1 text-sm sm:text-base font-medium text-secondary-500"
            data-i18n="topRankingPage.heroSubtitle"
          >${t('topRankingPage.heroSubtitle')}</p>
        </div>

        <div class="flex justify-center">
          ${TopRankingFilters()}
        </div>
      </div>
    </div>
  `;
}
