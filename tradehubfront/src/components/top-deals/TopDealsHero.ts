/**
 * TopDealsHero Component
 * Gradient hero banner for Top Deals page (Alibaba-style)
 * - Mobile: Compact header bar with back arrow, title, search icon
 * - Desktop: Full hero banner with lightning bolt icons
 */

import { t } from '../../i18n';

function lightningBoltIcon(): string {
  return `
    <svg class="h-8 w-8 sm:h-10 sm:w-10" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5948 30.1888L0.735054 19.2232C0.221831 18.5826 0.604285 17.5239 1.34894 17.5239L6.20746 17.5239C6.77424 10.7461 10.1716 2.20349 20.7371 0.585977C21.9772 0.396125 23.4376 0.585405 24.5 0.585787C16.6194 3.93595 16.33 12.2572 16.2123 17.5239L21.5078 17.5239C22.2623 17.5239 22.6405 18.6069 22.1072 19.2408L11.8082 30.2064C11.4715 30.6066 10.9232 30.5987 10.5948 30.1888Z" fill="url(#paint0_linear_hero)"/>
      <defs>
        <linearGradient id="paint0_linear_hero" x1="11.4284" y1="30.5016" x2="11.2898" y2="-0.282995" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FF988C"/>
          <stop offset="1" stop-color="#FFECEB"/>
        </linearGradient>
      </defs>
    </svg>
  `;
}

/**
 * Mobile-only compact header for Top Deals page
 * Full-width orange gradient bar with back arrow, title, search icon, subtitle
 */
export function TopDealsMobileHeader(): string {
  return `
    <div class="md:hidden" style="background: var(--topdeals-page-hero-gradient, linear-gradient(135deg, #ff6b35 0%, #ee2737 50%, #c41442 100%));">
      <!-- Nav row: back + title + search -->
      <div class="flex items-center justify-between px-4 pt-3 pb-1">
        <a href="javascript:history.back()" class="text-white p-1 -ml-1" aria-label="${t('common.goBack')}">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
          </svg>
        </a>
        <h1 class="text-xl font-extrabold text-white tracking-tight" data-i18n="topDealsPage.heroTitle">${t('topDealsPage.heroTitle')}</h1>
        <button type="button" class="text-white p-1 -mr-1" aria-label="${t('common.search')}">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
          </svg>
        </button>
      </div>
      <!-- Subtitle row -->
      <p class="flex items-center justify-center gap-1.5 text-sm text-white/90 font-medium pb-3">
        <svg class="w-4 h-4 flex-shrink-0 opacity-80" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd"/>
        </svg>
        <span data-i18n="topDealsPage.heroSubtitle">${t('topDealsPage.heroSubtitle')}</span>
      </p>
    </div>
  `;
}

/**
 * Sticky compact mobile header — appears when hero scrolls out of view
 * Layout: [< back] ["Top Deals" pill] [search input]
 */
export function TopDealsStickyMobileHeader(): string {
  return `
    <div
      id="td-sticky-mobile-header"
      class="md:hidden fixed top-0 inset-x-0 z-30 transition-all duration-300 -translate-y-full opacity-0 pointer-events-none"
      style="background: var(--topdeals-page-hero-gradient, linear-gradient(135deg, #ff6b35 0%, #ee2737 50%, #c41442 100%));"
    >
      <div class="flex items-center gap-2.5 px-3 py-2">
        <!-- Back arrow -->
        <a href="javascript:history.back()" class="text-white flex-shrink-0" aria-label="${t('common.goBack')}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
          </svg>
        </a>

        <!-- "Top Deals" pill badge -->
        <span class="flex-shrink-0 bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap" data-i18n="topDealsPage.heroTitle">${t('topDealsPage.heroTitle')}</span>

        <!-- Search input -->
        <form action="/pages/products.html" method="GET" class="flex-1 min-w-0">
          <div class="flex items-center bg-white rounded-full px-3 py-1.5 gap-2">
            <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
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

/**
 * Desktop hero banner (hidden on mobile)
 */
export function TopDealsHero(): string {
  return `
    <section
      class="hidden md:block relative overflow-hidden rounded-xl px-6 py-12 md:py-16 text-center"
      style="background: var(--topdeals-page-hero-gradient, linear-gradient(135deg, #ff6b35 0%, #ee2737 50%, #c41442 100%));"
    >
      <div class="relative z-10 flex flex-col items-center gap-2">
        <div class="flex items-center gap-2">
          ${lightningBoltIcon()}
          <h1
            class="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
            data-i18n="topDealsPage.heroTitle"
          >${t('topDealsPage.heroTitle')}</h1>
          ${lightningBoltIcon()}
        </div>
        <p
          class="text-base md:text-lg text-white/90 font-medium"
          data-i18n="topDealsPage.heroSubtitle"
        >${t('topDealsPage.heroSubtitle')}</p>
      </div>
      <!-- Decorative circles -->
      <div class="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5"></div>
      <div class="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5"></div>
      <div class="absolute top-1/2 left-1/4 w-20 h-20 rounded-full bg-white/5"></div>
    </section>
  `;
}
