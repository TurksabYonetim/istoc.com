/**
 * TopBar Component
 * Top navigation bar with iSTOC logo, delivery selector, language/currency,
 * utility icons (messages, orders), cart, and auth buttons
 * Each icon/selector has a Flowbite popover panel
 */

import type { LocaleOption, CurrencyOption } from '../../types/navigation';
import { megaCategories } from './MegaMenu';
import { cartStore } from '../cart/state/CartStore';
import { isLoggedIn, getUser, getSessionUser, waitForAuth, logout } from '../../utils/auth';
import { getSellerStoreUrl } from '../../utils/seller';
import { mockConversations } from '../../data/mockMessages';
import { t, getCurrentLang, updatePageTranslations } from '../../i18n';
import type { SupportedLang } from '../../i18n';
import { getSelectedCurrency, setSelectedCurrency, getCurrencySymbol } from '../../utils/currency';
import { formatCurrency, formatPrice, getSelectedCurrency as csGetSelectedCurrency } from '../../services/currencyService';
import { getSearchSuggestions } from '../../services/listingService';
import { apiRemoveCartItem, fetchCart } from '../../services/cartService';

/** Default country options for the delivery selector */
const countryOptions: LocaleOption[] = [
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
];

/** Default language options */
const languageOptions: LocaleOption[] = [
  { code: 'TR', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
];

/** Default currency options (names resolved via i18n) */
function getCurrencyOptions(): CurrencyOption[] {
  return [
    { code: 'TRY', symbol: '₺', name: t('header.currencyTRY') },
    { code: 'USD', symbol: '$', name: t('header.currencyUSD') },
    { code: 'EUR', symbol: '€', name: t('header.currencyEUR') },
  ];
}

/**
 * Get base URL for assets (handles GitHub Pages subdirectory)
 */
const getBaseUrl = (): string => {
  // Vite replaces import.meta.env.BASE_URL at build time.
  // If it's set to a subdirectory (not just "/"), use it directly.
  const viteBase = typeof import.meta !== 'undefined' ? import.meta.env?.BASE_URL : undefined;
  if (viteBase && viteBase !== '/') {
    return viteBase;
  }
  // Runtime fallback: detect GitHub Pages subdirectory from URL
  if (window.location.pathname.startsWith('/tradehub/')) {
    return '/tradehub/';
  }
  return '/';
};

/**
 * Generates the iSTOC logo
 */
function renderLogo(): string {
  const baseUrl = getBaseUrl();
  return `
    <a href="${baseUrl}" class="flex items-center hover:opacity-80 transition-opacity cursor-pointer shrink-0" aria-label="iSTOC Home">
      <img src="${baseUrl}images/istoc-logo.png" alt="iSTOC" class="h-[25px] shrink-0" />
    </a>
  `;
}

/**
 * Generates a smaller logo for compact dashboard header
 */
function renderCompactLogo(): string {
  const baseUrl = getBaseUrl();
  return `
    <a href="${baseUrl}" class="flex items-center hover:opacity-80 transition-opacity" aria-label="iSTOC Home">
      <img src="${baseUrl}images/istoc-logo.png" alt="iSTOC" class="h-6" />
    </a>
  `;
}

/**
 * User profile button with dropdown for compact header (Alibaba-style)
 * Only shown when user is logged in.
 */
function renderUserButton(): string {
  const user = getUser();
  const displayName = user?.full_name ?? t('topbar.defaultUser');
  return `
    <div class="relative">
      <button
        id="user-dropdown-btn"
        data-dropdown-toggle="user-dropdown-menu"
        data-dropdown-placement="bottom-end"
        class="th-header-icon inline-flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-200 transition-colors cursor-pointer shrink-0"
        aria-label="${t('header.myAccount')}" data-i18n-aria-label="header.myAccount"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
        </svg>
      </button>

      <!-- User Dropdown Menu -->
      <div
        id="user-dropdown-menu"
        class="z-50 hidden bg-white rounded-lg shadow-lg border border-gray-200 w-[220px] py-2"
      >
        <div class="px-4 py-2 border-b border-gray-100">
          <p class="text-[14px] font-semibold text-[#222]"><span data-i18n="header.hello" data-i18n-options='{"name":"${displayName}"}'>${t('header.hello', { name: displayName })}</span></p>
        </div>
        <ul class="py-1">
          <li><a href="/pages/dashboard/buyer-dashboard.html" class="block px-4 py-2 text-[13px] text-[#222] hover:bg-gray-50 transition-colors"><span data-i18n="header.myDashboard">${t('header.myDashboard')}</span></a></li>
          ${user?.has_seller_profile ? `<li><a href="${getSellerStoreUrl(user!)}" class="block px-4 py-2 text-[13px] text-[#222] hover:bg-gray-50 transition-colors"><span data-i18n="header.myStore">${t('header.myStore')}</span></a></li>` : ''}
          <li><a href="/pages/dashboard/orders.html" class="block px-4 py-2 text-[13px] text-[#222] hover:bg-gray-50 transition-colors"><span data-i18n="header.myOrders">${t('header.myOrders')}</span></a></li>
          <li><a href="/pages/dashboard/messages.html" class="block px-4 py-2 text-[13px] text-[#222] hover:bg-gray-50 transition-colors"><span data-i18n="header.myMessages">${t('header.myMessages')}</span></a></li>
          <li><a href="/pages/dashboard/rfq.html" class="block px-4 py-2 text-[13px] text-[#222] hover:bg-gray-50 transition-colors"><span data-i18n="header.myRfq">${t('header.myRfq')}</span></a></li>
          <li><a href="/pages/dashboard/favorites.html" class="block px-4 py-2 text-[13px] text-[#222] hover:bg-gray-50 transition-colors"><span data-i18n="header.myFavorites">${t('header.myFavorites')}</span></a></li>
          <li><a href="/pages/dashboard/settings.html" class="block px-4 py-2 text-[13px] text-[#222] hover:bg-gray-50 transition-colors"><span data-i18n="header.accountSettings">${t('header.accountSettings')}</span></a></li>
        </ul>
        <div class="border-t border-gray-100 pt-1">
          <button id="logout-btn" class="w-full text-left block px-4 py-2 text-[13px] text-[#222] hover:bg-gray-50 transition-colors cursor-pointer"><span data-i18n="header.logout">${t('header.logout')}</span></button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Compact sticky search shown after hero search area is scrolled out.
 */
function renderCompactStickySearch(): string {
  return `
    <div id="topbar-compact-search-shell" x-data="stickyHeaderSearch" @click.outside="close()" @istoc:close-search.window="close()" class="hidden lg:flex flex-col justify-center relative min-w-0 flex-1 lg:mx-4 h-[56px]">

      <form
        id="topbar-compact-search"
        x-ref="searchForm"
        @click="open()"
        action="/pages/products.html"
        method="GET"
        role="search"
        aria-label="Sticky header search"
        aria-hidden="false"
        aria-expanded="false"
        :aria-expanded="expanded ? 'true' : 'false'"
        aria-controls="topbar-compact-dropdown"
        class="absolute left-0 right-0 top-[7px] z-[50] w-full border border-gray-300 bg-white shadow-sm transition-all duration-300 ease-in-out overflow-hidden dark:border-gray-600 dark:bg-gray-800"
        :class="expanded ? 'rounded-2xl shadow-md h-[100px] pt-1.5' : 'rounded-full h-[42px]'"
      >
        <div id="topbar-compact-primary-row" class="flex items-center gap-1.5 transition-all duration-300 ease-in-out shrink-0" :class="expanded ? 'px-3 h-[40px] w-full' : 'px-1.5 h-[40px]'">
          <div class="relative min-w-0 flex-1 h-full">
            <input
              id="topbar-compact-search-input"
              x-ref="searchInput"
              @focus="open()"
              name="q"
              type="text"
              tabindex="-1"
              placeholder="${t('header.searchPlaceholder')}" data-i18n-placeholder="header.searchPlaceholder"
              autocomplete="off"
              aria-label="Search products from sticky header"
              aria-expanded="false"
              :aria-expanded="expanded ? 'true' : 'false'"
              aria-controls="topbar-compact-dropdown"
              class="w-full h-full border-0 bg-transparent px-3 text-gray-900 placeholder:text-gray-400 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-all duration-300 ease-in-out dark:text-white dark:placeholder:text-gray-400"
              :class="expanded ? 'text-base pr-12' : 'text-[13px] py-0'"
            />
          </div>

          <a
            id="topbar-compact-image-search"
            href="/image-search"
            tabindex="-1"
            aria-label="Image search"
            class="inline-flex items-center justify-center text-gray-500 transition-all duration-300 ease-in-out hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 shrink-0"
            :class="expanded ? 'absolute left-4 bottom-2 h-9 w-auto gap-1.5 rounded-md px-0 text-sm font-medium text-gray-700 hover:bg-transparent dark:hover:bg-transparent' : 'h-[36px] w-[36px] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            <svg class="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
            </svg>
            <span id="topbar-compact-image-search-label" x-show="expanded" x-transition.opacity.duration.300ms x-cloak data-i18n="header.imageSearch">${t('header.imageSearch')}</span>
          </a>

          <button
            id="topbar-compact-search-submit"
            type="submit"
            tabindex="-1"
            class="th-btn inline-flex items-center justify-center gap-1.5 font-semibold transition-all duration-300 ease-in-out shrink-0"
            :class="expanded ? 'px-6 py-2 text-base absolute right-4 bottom-2 th-btn-pill' : 'px-5 h-[32px] text-[13px] rounded-full ml-1'"
            style="background: linear-gradient(135deg, var(--search-btn-gradient-start) 0%, var(--search-btn-gradient-end) 100%); color: white; border: none;"
          >
            <span x-show="!expanded" data-i18n="common.search">${t('common.search')}</span>
            <svg x-show="expanded" class="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.6-5.15a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z" />
            </svg>
            <span x-show="expanded" data-i18n="common.search">${t('common.search')}</span>
          </button>
        </div>

        <div id="topbar-compact-secondary-row" class="h-11 w-full shrink-0"></div>
      </form>

      <div
        id="topbar-compact-dropdown"
        x-ref="dropdown"
        x-show="expanded"
        x-transition:enter="transition ease-out duration-300 transform origin-top"
        x-transition:enter-start="opacity-0 scale-y-95 -translate-y-2"
        x-transition:enter-end="opacity-100 scale-y-100 translate-y-0"
        x-transition:leave="transition ease-in duration-200 transform origin-top"
        x-transition:leave-start="opacity-100 scale-y-100 translate-y-0"
        x-transition:leave-end="opacity-0 scale-y-95 -translate-y-2"
        x-cloak
        aria-hidden="true"
        :aria-hidden="expanded ? 'false' : 'true'"
        class="absolute left-0 right-0 top-[110px] z-(--z-modal) rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="flex items-center justify-between gap-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white"><span data-i18n="header.recommendedForYou">${t('header.recommendedForYou')}</span></h3>
          <button
            type="button"
            tabindex="-1"
            data-compact-expanded-interactive="true"
            class="text-sm font-medium text-gray-500 underline decoration-gray-300 underline-offset-2 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <span data-i18n="common.refresh">${t('common.refresh')}</span>
          </button>
        </div>

        <div id="topbar-compact-reco-list" class="mt-3 space-y-2">
        </div>

        <div class="mt-4 flex items-center justify-between gap-4">
          <p class="text-sm font-semibold text-primary-600 dark:text-primary-400">
            <span class="mr-1" aria-hidden="true">&#10022;</span>
            <span data-i18n="header.deepSearch">${t('header.deepSearch')}</span>
          </p>
          <a
            href="/pages/legal/terms.html"
            tabindex="-1"
            data-compact-expanded-interactive="true"
            class="text-sm text-gray-500 underline decoration-gray-300 underline-offset-2 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <span data-i18n="header.termsOfUse">${t('header.termsOfUse')}</span>
          </a>
        </div>

        <div id="topbar-compact-chips" class="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
        </div>
      </div>
    </div>
  `;
}

/**
 * Generates the delivery country selector with popover panel
 */
function renderCountrySelector(): string {
  const defaultCountry = countryOptions[0];
  return `
    <button
      data-popover-target="popover-deliver-to"
      data-popover-placement="bottom"
      class="th-header-icon flex flex-col items-center px-2 py-1 dark:text-gray-300 dark:hover:text-primary-400 transition-colors cursor-pointer shrink-0"
      type="button"
      aria-label="Select delivery country"
    >
      <span class="text-xs text-gray-500 dark:text-gray-400" data-i18n="header.deliverTo">${t('header.deliverTo')}</span>
      <span class="text-sm font-medium">${defaultCountry.flag} ${defaultCountry.code}</span>
    </button>

    <!-- Deliver To Popover -->
    <div data-popover id="popover-deliver-to" role="tooltip"
      class="absolute z-50 invisible inline-block w-80 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 transition-opacity duration-300 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-5">
        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-1"><span data-i18n="header.specifyLocation">${t('header.specifyLocation')}</span></h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4"><span data-i18n="header.shippingVary">${t('header.shippingVary')}</span></p>

        <!-- Add Address Button -->
        <button type="button" class="th-btn th-btn-pill w-full px-4 py-2.5 text-sm font-medium transition-colors mb-4">
          <span data-i18n="header.addAddress">${t('header.addAddress')}</span>
        </button>

        <!-- Or Divider -->
        <div class="flex items-center gap-3 mb-4">
          <div class="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
          <span class="text-sm text-gray-400" data-i18n="common.or">${t('common.or')}</span>
          <div class="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
        </div>

        <!-- Country Select -->
        <div class="mb-3">
          <select class="th-input w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none cursor-pointer">
            ${countryOptions.map(country => `
              <option value="${country.code}">${country.flag} ${country.name}</option>
            `).join('')}
          </select>
        </div>

        <!-- ZIP Code Input -->
        <div class="mb-4">
          <input
            type="text"
            placeholder="${t('header.enterZip')}" data-i18n-placeholder="header.enterZip"
            class="th-input w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <!-- Save Button -->
        <button type="button" class="th-btn th-btn-pill w-full px-4 py-2.5 text-sm font-medium transition-colors">
          <span data-i18n="common.save">${t('common.save')}</span>
        </button>
      </div>
      <div data-popper-arrow></div>
    </div>
  `;
}

/**
 * Generates the language/currency selector with popover panel
 */
function renderLanguageCurrencySelector(): string {
  return `
    <button
      data-popover-target="popover-language-currency"
      data-popover-placement="bottom"
      class="th-header-icon flex items-center gap-1.5 px-2 py-1.5 text-sm dark:text-gray-300 dark:hover:text-primary-400 transition-colors cursor-pointer shrink-0"
      type="button"
      aria-label="Select language and currency"
    >
      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-4.247m0 0A8.959 8.959 0 0 1 3 12c0-1.177.227-2.302.637-3.332" />
      </svg>
      <span class="font-medium truncate" data-i18n="header.englishUsd" id="lang-currency-label">${t('header.englishUsd')}</span>
    </button>

    <!-- Language & Currency Popover -->
    <div data-popover id="popover-language-currency" role="tooltip"
      class="absolute z-50 invisible inline-block w-96 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 transition-opacity duration-300 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-5">
        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-1"><span data-i18n="header.langCurrency">${t('header.langCurrency')}</span></h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5"><span data-i18n="header.langCurrencyDesc">${t('header.langCurrencyDesc')}</span></p>

        <!-- Language Select -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2" data-i18n="header.language">${t('header.language')}</label>
          <select id="lang-select" class="th-input w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none cursor-pointer">
            ${languageOptions.map(lang => `
              <option value="${lang.code}">${lang.name}</option>
            `).join('')}
          </select>
        </div>

        <!-- Currency Select -->
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2" data-i18n="header.currency">${t('header.currency')}</label>
          <select id="currency-select" class="th-input w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none cursor-pointer">
            ${getCurrencyOptions().map(currency => `
              <option value="${currency.code}">${currency.code} - ${currency.name}</option>
            `).join('')}
          </select>
        </div>

        <!-- Save Button -->
        <button type="button" class="th-btn th-btn-pill w-full px-4 py-2.5 text-sm font-medium transition-colors">
          <span data-i18n="common.save">${t('common.save')}</span>
        </button>
      </div>
      <div data-popper-arrow></div>
    </div>
  `;
}

/**
 * Generates the Messages icon button with popover panel
 */
function renderMessagesButton(): string {
  const conversations = mockConversations();
  const recentMessages = conversations.slice(0, 3);
  const unreadTotal = conversations.reduce((sum, msg) => sum + (msg.unreadCount || 0), 0);

  return `
    <button
      data-popover-target="popover-messages"
      data-popover-placement="bottom"
      class="th-header-icon flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0 relative"
      type="button"
      aria-label="Messages"
    >
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
      ${unreadTotal > 0 ? `<span class="th-badge absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold" style="background:var(--color-error-500);color:#fff">${unreadTotal > 9 ? '9+' : unreadTotal}</span>` : ''}
    </button>

    <!-- Messages Popover -->
    <div data-popover id="popover-messages" role="tooltip"
      class="absolute z-50 invisible inline-block w-96 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 transition-opacity duration-300 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-5">
        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4"><span data-i18n="header.messages">${t('header.messages')}</span></h3>

        <!-- Message Items -->
        <div class="space-y-2 mb-4">
          ${recentMessages.map(msg => `
          <a href="/pages/dashboard/messages.html" class="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 overflow-hidden">
              ${msg.avatar ? `<img src="${msg.avatar}" alt="${msg.name}" class="w-full h-full object-cover" />` : `
              <svg class="w-5 h-5 text-blue-500 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              `}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">${msg.name}</p>
                <span class="text-xs text-gray-400">${msg.date}</span>
              </div>
              <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">${msg.company || 'iSTOC'}</p>
              <p class="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-1">${msg.preview}</p>
            </div>
            ${msg.unreadCount > 0 ? `<span class="th-badge flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-bold" style="background:var(--color-error-500);color:#fff">${msg.unreadCount}</span>` : ''}
          </a>
          `).join('')}
        </div>

        <!-- View More Button -->
        <a href="/pages/dashboard/messages.html" class="th-btn th-btn-pill block w-full px-4 py-2.5 text-sm font-medium text-center transition-colors">
          <span data-i18n="common.viewMore">${t('common.viewMore')}</span>
        </a>
      </div>
      <div data-popper-arrow></div>
    </div>
  `;
}

/**
 * Generates the Orders icon button with popover panel
 */
function renderOrdersButton(): string {
  return `
    <button
      data-popover-target="popover-orders"
      data-popover-placement="bottom"
      class="th-header-icon hidden lg:flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
      type="button"
      aria-label="Orders"
      title="Orders"
    >
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    </button>

    <!-- Orders Popover -->
    <div data-popover id="popover-orders" role="tooltip"
      class="absolute z-50 invisible inline-block w-96 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 transition-opacity duration-300 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-5">
        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4"><span data-i18n="header.orders">${t('header.orders')}</span></h3>

        <!-- Trade Assurance Header -->
        <div class="flex items-center gap-2 mb-2">
          <span class="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
            <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.94s4.18 1.36 4.18 3.85c0 1.89-1.44 2.98-3.12 3.19z"/>
            </svg>
          </span>
          <span class="text-lg font-bold text-gray-900 dark:text-white" data-i18n="header.tradeAssurance">${t('header.tradeAssurance')}</span>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5"><span data-i18n="header.tradeAssuranceDesc">${t('header.tradeAssuranceDesc')}</span></p>

        <!-- Features List -->
        <div class="space-y-4 mb-5">
          <div class="flex items-center gap-3">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50">
              <svg class="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </span>
            <span class="text-sm text-gray-700 dark:text-gray-300" data-i18n="header.safePayments">${t('header.safePayments')}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50">
              <svg class="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            </span>
            <span class="text-sm text-gray-700 dark:text-gray-300" data-i18n="header.moneyBack">${t('header.moneyBack')}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50">
              <svg class="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.029-.504 1.029-1.125a3.75 3.75 0 0 0-3.75-3.75H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </span>
            <span class="text-sm text-gray-700 dark:text-gray-300" data-i18n="header.shippingLogistics">${t('header.shippingLogistics')}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50">
              <svg class="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
              </svg>
            </span>
            <span class="text-sm text-gray-700 dark:text-gray-300" data-i18n="header.afterSales">${t('header.afterSales')}</span>
          </div>
        </div>

        <!-- Learn More Link -->
        <a href="/trade-assurance" class="text-sm font-medium text-gray-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400 underline transition-colors">
          <span data-i18n="common.learnMore">${t('common.learnMore')}</span>
        </a>
      </div>
      <div data-popper-arrow></div>
    </div>
  `;
}

/**
 * Generates the cart button with badge and popover panel
 */
function renderCartButton(itemCount: number = 0): string {
  const showBadge = itemCount > 0;
  const badgeText = itemCount > 99 ? '99+' : String(itemCount);
  const baseUrl = getBaseUrl();

  return `
    <button
      id="header-cart-btn"
      data-popover-target="popover-cart"
      data-popover-placement="bottom"
      class="th-header-icon relative flex items-center justify-center p-1.5 sm:p-2 rounded-full hover:bg-surface-raised transition-colors cursor-pointer shrink-0"
      type="button"
      aria-label="Shopping cart${showBadge ? `, ${itemCount} items` : ''}"
    >
      <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      <span id="header-cart-badge" class="th-badge absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold${showBadge ? '' : ' hidden'}" style="background:var(--btn-bg);color:var(--btn-text)">
        ${badgeText}
      </span>
    </button>

    <!-- Cart Popover -->
    <div data-popover id="popover-cart" role="tooltip"
      class="absolute z-50 invisible inline-block w-[400px] max-w-[calc(100vw-16px)] bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 transition-opacity duration-300 overflow-hidden"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <h3 class="text-[15px] font-bold text-gray-900"><span data-i18n="header.myCart">${t('header.myCart')}</span></h3>
          <span id="header-cart-count-chip" class="hidden text-[11px] font-bold px-2 py-0.5 rounded-full" style="background:var(--btn-bg,#d97706);color:#fff"></span>
        </div>
        <a href="${baseUrl}pages/cart.html" class="text-xs font-semibold text-[--btn-bg] hover:underline" style="color:var(--btn-bg,#d97706)"><span data-i18n="common.viewAll">${t('common.viewAll')}</span> &rarr;</a>
      </div>

      <div class="px-5 py-4" id="header-cart-body">
        <!-- Empty Cart State -->
        <div id="header-cart-empty" class="flex flex-col items-center py-8">
          <div class="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
            <svg class="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-700 mb-1"><span data-i18n="header.cartEmpty">${t('header.cartEmpty')}</span></p>
          <p class="text-xs text-gray-400"><span data-i18n="header.cartEmptyDesc">${t('header.cartEmptyDesc')}</span></p>
        </div>

        <!-- Cart Items (hidden initially) -->
        <div id="header-cart-items" class="hidden"></div>

        <!-- Subtotal (hidden initially) -->
        <div id="header-cart-subtotal" style="display:none" class="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <span class="text-sm text-gray-500" data-i18n="header.cartSubtotal">${t('header.cartSubtotal')}</span>
          <span id="header-cart-subtotal-price" class="text-lg font-bold" style="color:var(--btn-bg,#d97706)">$0.00</span>
        </div>

        <!-- Go to Cart Button -->
        <a href="${baseUrl}pages/cart.html" class="inline-flex items-center justify-center w-full mt-4 h-11 px-4 text-sm font-bold text-center rounded-full text-white transition-all hover:opacity-90 hover:shadow-md gap-2" style="background:linear-gradient(135deg,var(--btn-bg,#d97706),var(--btn-bg-end,#b45309))">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138A60.114 60.114 0 0 0 3.375 5.272M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/></svg>
          <span data-i18n="header.goToCart">${t('header.goToCart')}</span>
        </a>
      </div>
      <div data-popper-arrow></div>
    </div>
  `;
}

/**
 * Generates the sign-in button with dropdown panel (Alibaba-style)
 * Shows person icon + "Sign in" text; dropdown has sign-in CTA, social logins, and nav links
 */
function renderAuthButtons(): string {
  const baseUrl = getBaseUrl();
  return `
    <div class="relative">
      <button
        id="auth-dropdown-button"
        data-dropdown-toggle="auth-dropdown-menu"
        data-dropdown-placement="bottom-end"
        class="inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        aria-label="Sign in"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
        </svg>
        <span class="hidden sm:inline" data-i18n="header.signIn">${t('header.signIn')}</span>
      </button>

      <!-- Auth Dropdown Menu -->
      <div
        id="auth-dropdown-menu"
        class="z-50 hidden bg-white rounded-lg shadow-lg border border-gray-200 w-[280px] py-4"
      >
        <!-- Sign in CTA -->
        <div class="px-5 pb-3">
          <p class="text-[15px] font-semibold text-[#222] mb-3"><span data-i18n="header.signBackIn">${t('header.signBackIn')}</span></p>
          <a
            href="${baseUrl}pages/auth/login.html"
            class="block w-full text-center th-btn th-btn-pill"
          >
            <span data-i18n="header.signIn">${t('header.signIn')}</span>
          </a>
        </div>

        <!-- Social Login -->
        <div class="px-5 pb-3 text-center">
          <p class="text-[12px] text-gray-500 mb-2"><span data-i18n="header.continueWith">${t('header.continueWith')}</span></p>
          <div class="flex items-center justify-center gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:opacity-90 transition-opacity">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
          <p class="text-[11px] text-gray-400 mt-2 leading-tight">
            By signing in via social media, I agree to the
            <a href="#" class="underline"><span data-i18n="header.freeAgreement">${t('header.freeAgreement')}</span></a> and
            <a href="#" class="underline"><span data-i18n="header.privacyPolicy">${t('header.privacyPolicy')}</span></a>.
          </p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the 3-panel sliding mobile drawer (istoc.com style)
 * Panel 1: Main menu, Panel 2: Categories list, Panel 3: Subcategory detail
 */
function renderMobileDrawer(): string {
  const baseUrl = getBaseUrl();
  const filteredCategories = megaCategories.filter(
    cat => !cat.id.startsWith('featured') && !cat.id.startsWith('new-') && !cat.id.startsWith('deal')
  );

  return `
    <!-- Mobile Menu Drawer -->
    <div
      id="mobile-menu-drawer"
      class="fixed top-0 left-0 z-(--z-backdrop) h-screen overflow-hidden transition-transform -translate-x-full bg-white w-[min(80vw,20rem)] sm:w-80 dark:bg-gray-800"
      tabindex="-1"
      aria-labelledby="drawer-label"
    >
      <div class="relative h-full w-full">

        <!-- Panel 1: Main Menu -->
        <div id="drawer-panel-main" class="absolute inset-0 overflow-y-auto transition-transform duration-300 ease-in-out">

          <!-- Header: Logo + Close -->
          <div class="flex items-center justify-between px-4 pt-4 pb-2">
            <a href="${getBaseUrl()}" aria-label="iSTOC Home">
              <img src="${getBaseUrl()}images/istoc-logo.png" alt="iSTOC" class="h-8" />
            </a>
            <button
              type="button"
              data-drawer-hide="mobile-menu-drawer"
              aria-controls="mobile-menu-drawer"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
              <span class="sr-only">Close menu</span>
            </button>
          </div>

          <!-- Profile Section -->
          <div id="mobile-drawer-profile" class="mx-4 mt-2 rounded-md bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-gray-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-1 text-sm">
                <a href="${baseUrl}pages/auth/login.html" class="font-medium text-primary-600 hover:underline dark:text-primary-400"><span data-i18n="header.signIn">${t('header.signIn')}</span></a>
                <span class="text-gray-400 dark:text-gray-500">|</span>
                <a href="${baseUrl}pages/auth/register.html" class="font-medium text-primary-600 hover:underline dark:text-primary-400"><span data-i18n="header.joinFree">${t('header.joinFree')}</span></a>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"><span data-i18n="header.startShopping">${t('header.startShopping')}</span></p>
            </div>
          </div>

          <!-- My Account Section -->
          <div class="mx-4 mt-3">
            <button
              id="drawer-account-toggle"
              type="button"
              class="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              <span data-i18n="header.myAccount">${t('header.myAccount')}</span>
              <svg id="drawer-account-icon" class="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
              </svg>
            </button>
            <div id="drawer-account-panel" class="hidden pb-2 space-y-1">
              <a href="/buyer/messages" class="flex items-center gap-3 px-3 py-2.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <span data-i18n="header.messages">${t('header.messages')}</span>
                <span class="th-badge ml-auto flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-bold" style="background:var(--color-error-500);color:#fff">1</span>
              </a>
              <a href="/buyer/orders" class="flex items-center gap-3 px-3 py-2.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <span data-i18n="header.orders">${t('header.orders')}</span>
              </a>
              <a href="${baseUrl}pages/cart.html" class="flex items-center gap-3 px-3 py-2.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <span data-i18n="header.shoppingCart">${t('header.shoppingCart')}</span>
                <span class="th-badge ml-auto flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-bold" style="background:var(--btn-bg);color:var(--btn-text)">3</span>
              </a>
            </div>
          </div>

          <!-- Navigation Section -->
          <div class="border-b border-gray-200 dark:border-gray-700 mx-4 pb-3 space-y-1">

            <!-- Categories Button -->
            <button
              id="drawer-open-categories"
              type="button"
              class="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-gray-900 dark:text-white" data-i18n="drawer.categories">${t('drawer.categories')}</span>
                  <span class="th-badge inline-flex items-center px-2 py-0.5 text-[10px] font-bold" style="background:var(--btn-bg);color:var(--btn-text)">ALL</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"><span data-i18n="drawer.browseCategories">${t('drawer.browseCategories')}</span></p>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
            </button>

            <!-- Campaigns -->
            <a href="/campaigns" class="block px-3 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span class="text-sm font-bold text-gray-900 dark:text-white" data-i18n="drawer.campaigns">${t('drawer.campaigns')}</span>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"><span data-i18n="drawer.campaignsDesc">${t('drawer.campaignsDesc')}</span></p>
            </a>

            <!-- Brands -->
            <a href="/brands" class="block px-3 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span class="text-sm font-bold text-gray-900 dark:text-white" data-i18n="drawer.brands">${t('drawer.brands')}</span>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"><span data-i18n="drawer.brandsDesc">${t('drawer.brandsDesc')}</span></p>
            </a>

            <!-- Sellers -->
            <a href="/sellers" class="block px-3 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span class="text-sm font-bold text-gray-900 dark:text-white" data-i18n="drawer.sellers">${t('drawer.sellers')}</span>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"><span data-i18n="drawer.sellersDesc">${t('drawer.sellersDesc')}</span></p>
            </a>

            <!-- iSTOC B2B Marketplace -->
            <a href="/b2b" class="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div class="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold text-gray-700 dark:text-gray-200">iS</span>
              </div>
              <div class="flex-1 min-w-0">
                <span class="text-sm font-bold text-gray-900 dark:text-white" data-i18n="drawer.b2bMarketplace">${t('drawer.b2bMarketplace')}</span>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"><span data-i18n="drawer.b2bDesc">${t('drawer.b2bDesc')}</span></p>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
            </a>
          </div>

          <!-- Language / Currency Pills -->
          <div class="mx-4 mt-3 space-y-3">
            <!-- Language pills -->
            <div class="flex flex-wrap gap-2">
              ${languageOptions.map((lang, i) => `
                <button type="button" data-lang-pill="${lang.code}" class="px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${i === 0 ? 'border-primary-500 text-primary-600 bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:bg-primary-900/20' : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'}">
                  ${lang.code}
                </button>
              `).join('')}
            </div>
            <!-- Currency pills -->
            <div class="flex flex-wrap gap-2">
              ${getCurrencyOptions().map((currency, i) => `
                <button type="button" class="px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${i === 0 ? 'border-primary-500 text-primary-600 bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:bg-primary-900/20' : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'}">
                  ${currency.code === 'TRY' ? 'TL' : currency.symbol}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Deliver to -->
          <div class="mx-4 mt-4 mb-6">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1" data-i18n="header.deliverTo">${t('header.deliverTo')}</label>
            <select class="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none cursor-pointer">
              ${countryOptions.map(country => `
                <option value="${country.code}">${country.flag} ${country.name}</option>
              `).join('')}
            </select>
          </div>

        </div>

        <!-- Panel 2: Categories List -->
        <div id="drawer-panel-categories" class="absolute inset-0 overflow-y-auto translate-x-full transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800">

          <!-- Header: Back + Close -->
          <div class="flex items-center justify-between px-4 pt-4 pb-2">
            <button id="drawer-categories-back" type="button" class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
              <span data-i18n="common.back">${t('common.back')}</span>
            </button>
            <button
              type="button"
              data-drawer-hide="mobile-menu-drawer"
              aria-controls="mobile-menu-drawer"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
              <span class="sr-only">Close menu</span>
            </button>
          </div>

          <!-- Category Header Bar -->
          <div class="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700">
            <span class="text-lg font-bold text-gray-900 dark:text-white" data-i18n="drawer.categories">${t('drawer.categories')}</span>
            <span class="th-badge inline-flex items-center px-2 py-0.5 text-[10px] font-bold" style="background:var(--btn-bg);color:var(--btn-text)">ALL</span>
          </div>

          <!-- Category List -->
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            ${filteredCategories.map(cat => `
              <button
                type="button"
                data-drawer-cat-id="${cat.id}"
                class="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span>${cat.name}</span>
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
              </button>
            `).join('')}
          </div>

        </div>

        <!-- Panel 3: Subcategory -->
        <div id="drawer-panel-subcategory" class="absolute inset-0 overflow-y-auto translate-x-full transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800">

          <!-- Header: Back + Close -->
          <div class="flex items-center justify-between px-4 pt-4 pb-2">
            <button id="drawer-subcategory-back" type="button" class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
              <span data-i18n="drawer.categories">${t('drawer.categories')}</span>
            </button>
            <button
              type="button"
              data-drawer-hide="mobile-menu-drawer"
              aria-controls="mobile-menu-drawer"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
              <span class="sr-only">Close menu</span>
            </button>
          </div>

          <!-- Subcategory Header -->
          <div class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700">
            <span id="drawer-subcategory-title" class="text-lg font-bold text-gray-900 dark:text-white"></span>
            <a id="drawer-subcategory-link" href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"><span data-i18n="common.detail">${t('common.detail')}</span></a>
          </div>

          <!-- Subcategory List -->
          <div id="drawer-subcategory-list"></div>

        </div>

      </div>
    </div>
  `;
}

/**
 * Initializes mobile drawer interactivity:
 * - Account toggle expand/collapse
 * - Panel sliding (main -> categories -> subcategory)
 * - MutationObserver to reset panels on drawer close
 */
export function initMobileDrawer(): void {
  // Move drawer to body so it escapes all stacking contexts (sticky-header, TopBar z-30)
  const drawerEl = document.getElementById('mobile-menu-drawer');
  if (drawerEl) document.body.appendChild(drawerEl);

  // TopBar mobile search tabs switching
  const topbarTabs = document.querySelectorAll<HTMLButtonElement>('.topbar-search-tab');
  const mobileSearchType = document.getElementById('mobile-search-type') as HTMLInputElement | null;
  const mobileSearchInput = document.querySelector<HTMLInputElement>('#mobile-search-form input[name="q"]');
  const TB_ACT = ['font-semibold', 'text-gray-900', 'dark:text-white', 'after:bg-gray-900', 'after:dark:bg-white'];
  const TB_INACT = ['font-normal', 'text-gray-400', 'dark:text-gray-500', 'after:bg-transparent'];
  topbarTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      topbarTabs.forEach(t => { t.classList.remove(...TB_ACT); t.classList.add(...TB_INACT); });
      tab.classList.remove(...TB_INACT);
      tab.classList.add(...TB_ACT);
      const tabValue = tab.getAttribute('data-search-tab') || 'products';
      if (mobileSearchType) {
        mobileSearchType.value = tabValue;
      }
      if (mobileSearchInput) {
        mobileSearchInput.placeholder = `Search ${tabValue}...`;
      }
    });
  });

  // Account toggle
  const accountToggle = document.getElementById('drawer-account-toggle');
  const accountPanel = document.getElementById('drawer-account-panel');
  const accountIcon = document.getElementById('drawer-account-icon');
  if (accountToggle && accountPanel && accountIcon) {
    accountToggle.addEventListener('click', () => {
      accountPanel.classList.toggle('hidden');
      const path = accountIcon.querySelector('path');
      if (path) {
        const isOpen = !accountPanel.classList.contains('hidden');
        path.setAttribute('d', isOpen ? 'M5 12h14' : 'M12 4.5v15m7.5-7.5h-15');
      }
    });
  }

  const panelMain = document.getElementById('drawer-panel-main');
  const panelCategories = document.getElementById('drawer-panel-categories');
  const panelSubcategory = document.getElementById('drawer-panel-subcategory');

  // Open categories panel
  const openCategories = document.getElementById('drawer-open-categories');
  if (openCategories && panelMain && panelCategories) {
    openCategories.addEventListener('click', () => {
      panelMain.classList.add('-translate-x-full');
      panelCategories.classList.remove('translate-x-full');
    });
  }

  // Back from categories
  const categoriesBack = document.getElementById('drawer-categories-back');
  if (categoriesBack && panelMain && panelCategories) {
    categoriesBack.addEventListener('click', () => {
      panelMain.classList.remove('-translate-x-full');
      panelCategories.classList.add('translate-x-full');
    });
  }

  // Open subcategory panel
  const catButtons = document.querySelectorAll<HTMLButtonElement>('[data-drawer-cat-id]');
  const subcategoryTitle = document.getElementById('drawer-subcategory-title');
  const subcategoryLink = document.getElementById('drawer-subcategory-link') as HTMLAnchorElement | null;
  const subcategoryList = document.getElementById('drawer-subcategory-list');

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.getAttribute('data-drawer-cat-id');
      const cat = megaCategories.find(c => c.id === catId);
      if (!cat || !panelCategories || !panelSubcategory || !subcategoryTitle || !subcategoryLink || !subcategoryList) return;

      subcategoryTitle.textContent = cat.name;
      subcategoryLink.href = `/categories/${cat.id}`;
      subcategoryList.innerHTML = cat.products.map(
        p => `<a href="${p.href}" class="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700 transition-colors">${p.name}</a>`
      ).join('');

      panelCategories.classList.add('-translate-x-full');
      panelSubcategory.classList.remove('translate-x-full');
    });
  });

  // Back from subcategory
  const subcategoryBack = document.getElementById('drawer-subcategory-back');
  if (subcategoryBack && panelCategories && panelSubcategory) {
    subcategoryBack.addEventListener('click', () => {
      panelCategories.classList.remove('-translate-x-full');
      panelSubcategory.classList.add('translate-x-full');
    });
  }

  // Reset panels when drawer is closed
  const drawer = document.getElementById('mobile-menu-drawer');
  if (drawer && panelMain && panelCategories && panelSubcategory) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (drawer.classList.contains('-translate-x-full')) {
            setTimeout(() => {
              panelMain.classList.remove('-translate-x-full');
              panelCategories.classList.remove('-translate-x-full');
              panelCategories.classList.add('translate-x-full');
              panelSubcategory.classList.remove('-translate-x-full');
              panelSubcategory.classList.add('translate-x-full');
            }, 300);
          }
        }
      }
    });
    observer.observe(drawer, { attributes: true, attributeFilter: ['class'] });
  }
}

/**
 * Mobile Search Tabs (Products | Manufacturers | Worldwide)
 * Rendered outside the sticky header as a separate non-sticky section.
 */
export function MobileSearchTabs(activeTab: 'products' | 'manufacturers' | 'country' = 'products', options?: { hideWorldwide?: boolean }): string {
  const activeClass = "topbar-search-tab relative py-2 text-[13px] font-semibold text-gray-900 dark:text-white whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gray-900 after:dark:bg-white after:rounded-full";
  const inactiveClass = "topbar-search-tab relative py-2 text-[13px] font-normal text-gray-400 dark:text-gray-500 whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-transparent after:rounded-full";

  const worldwideTab = options?.hideWorldwide ? '' : `
      <a href="#" class="${activeTab === 'country' ? activeClass : inactiveClass}" data-search-tab="country"><span data-i18n="search.worldwide">${t('search.worldwide')}</span></a>`;

  return `
    <div class="lg:hidden flex items-center gap-3 sm:gap-6 px-2 sm:px-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-x-auto no-scrollbar scroll-smooth">
      <a href="/" class="${activeTab === 'products' ? activeClass : inactiveClass}" data-search-tab="products"><span data-i18n="search.products">${t('search.products')}</span></a>
      <a href="/pages/manufacturers.html" class="${activeTab === 'manufacturers' ? activeClass : inactiveClass}" data-search-tab="manufacturers"><span data-i18n="search.manufacturers">${t('search.manufacturers')}</span></a>${worldwideTab}
    </div>
  `;
}

/**
 * TopBar Component
 * Renders the top navigation bar containing:
 * - iSTOC logo
 * - Delivery country selector with location popover
 * - Language/Currency selector with settings popover
 * - Messages icon with messages popover
 * - Orders icon with trade assurance popover
 * - Cart with empty/items popover
 * - Auth buttons (Sign In / Join Free pill)
 */
export interface TopBarProps {
  /** Compact mode for dashboard pages — no search, no tabs, shorter height */
  compact?: boolean;
}

export function TopBar(props?: TopBarProps): string {
  const compact = props?.compact ?? false;

  if (compact) {
    /* ──── Compact Dashboard Header (Alibaba-style ~40px) ──── */
    return `
      <div class="relative z-30" style="background:#F5F5F5">
        <div class="container-boxed">
          <div class="flex items-center h-10 gap-2 sm:gap-4">
            <!-- Logo (smaller, white for gradient bg) -->
            <div class="flex-shrink-0">
              ${renderCompactLogo()}
            </div>

            <!-- "Hesabım" label like Alibaba's "Alibabam" -->
            <span class="text-[#666] text-[13px] font-normal border-l border-gray-300 pl-2 sm:pl-3 truncate" data-i18n="header.myAccount">${t('header.myAccount')}</span>

            <!-- Spacer -->
            <div class="flex-1"></div>

            <!-- Right Side: Selectors + Icons -->
            <div class="flex items-center gap-3 flex-shrink-0 text-[#333] [&_.th-header-icon]:text-[#333] [&_.th-header-icon:hover]:text-[#000]">
              <!-- Country Selector -->
              <div class="hidden lg:block">
                ${renderCountrySelector()}
              </div>

              <!-- Language/Currency Selector -->
              <div class="hidden lg:block">
                ${renderLanguageCurrencySelector()}
              </div>

              <!-- Sell on iSTOC link -->
              <a href="/pages/seller/sell.html" class="hidden lg:inline-flex items-center text-[13px] text-[#333] hover:text-[#000] transition-opacity whitespace-nowrap">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/></svg>
                <span data-i18n="footer.startSelling">${t('footer.startSelling')}</span>
              </a>

              <!-- Messages Button -->
              <div class="hidden lg:block">
                ${renderMessagesButton()}
              </div>

              <!-- Orders Button -->
              <div class="hidden lg:block">
                ${renderOrdersButton()}
              </div>

              <!-- Cart Button -->
              ${renderCartButton(0)}

              <!-- Auth/User Button -->
              <div class="hidden lg:block" data-auth-area>
                ${isLoggedIn() ? renderUserButton() : renderAuthButtons()}
              </div>

              <!-- Mobile Menu Button -->
              <button
                data-drawer-target="mobile-menu-drawer"
                data-drawer-toggle="mobile-menu-drawer"
                class="inline-flex items-center p-1.5 rounded-md lg:hidden text-[#333] hover:text-[#000] hover:bg-gray-200 focus:outline-none"
                type="button"
                aria-controls="mobile-menu-drawer"
                aria-label="Open main menu"
              >
                <svg class="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        ${renderMobileDrawer()}
      </div>
    `;
  }

  /* ──── Full Header (default — with search + tabs) ──── */
  const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
  const isManufacturersPage = pathname.includes('manufacturers');
  const desktopActiveTabClass = "topbar-search-tab relative py-1 text-[13px] font-semibold text-gray-900 dark:text-white whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gray-900 after:dark:bg-white after:rounded-full";
  const desktopInactiveTabClass = "topbar-search-tab relative py-1 text-[13px] font-normal text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-transparent after:rounded-full";

  return `
    <div class="relative z-30 dark:bg-gray-900" style="background-color:var(--header-bg);border-bottom:1px solid var(--header-border-color)">
      <div class="container-boxed">
        <!-- Row 1: Logo + Search (mobile) + Icons -->
        <div class="flex items-center h-14 sm:h-16 gap-1 sm:gap-2 lg:gap-0">
          <!-- Logo -->
          <div class="flex-shrink-0">
            ${renderLogo()}
          </div>

          <!-- Mobile Inline Search (between logo and icons) -->
          <div class="flex-1 min-w-0 mx-1 sm:mx-2 lg:hidden">
            <form id="mobile-search-form" action="/pages/products.html" method="GET" role="search">
              <input type="hidden" id="mobile-search-type" name="searchType" value="products" />
              <div class="flex">
                <input
                  type="text"
                  name="q"
                  class="w-full h-9 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm text-gray-900 bg-white border-2 border-primary-400 border-r-0 rounded-l-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-primary-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Search products..."
                  autocomplete="off"
                  aria-label="Search products"
                />
                <a href="/image-search" class="flex items-center justify-center h-9 sm:h-10 px-1.5 sm:px-2.5 bg-white border-2 border-primary-400 border-l-0 border-r-0 text-gray-400 hover:text-primary-600 transition-colors cursor-pointer shrink-0 dark:bg-gray-700 dark:border-primary-600" aria-label="Image search">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"/>
                  </svg>
                </a>
                <button
                  type="submit"
                  class="flex items-center justify-center h-9 sm:h-10 px-3 sm:px-4 text-white rounded-r-md transition-colors cursor-pointer shrink-0"
                  style="background: linear-gradient(135deg, var(--search-btn-gradient-start) 0%, var(--search-btn-gradient-end) 100%);"
                  aria-label="Search"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <!-- Desktop Compact Sticky Search -->
          ${renderCompactStickySearch()}

          <!-- Right Side: Selectors + Icons + Cart + Auth -->
          <div class="ml-auto flex items-center gap-1 sm:gap-2 lg:gap-4 shrink-0">
            <!-- Country Selector (xl+ only) -->
            <div class="hidden xl:block">
              ${renderCountrySelector()}
            </div>

            <!-- Language/Currency Selector (xl+ only) -->
            <div class="hidden xl:block">
              ${renderLanguageCurrencySelector()}
            </div>

            <!-- Messages Button (hidden on mobile) -->
            <div class="hidden lg:block">
              ${renderMessagesButton()}
            </div>

            <!-- Orders Button (hidden on mobile) -->
            <div class="hidden lg:block">
              ${renderOrdersButton()}
            </div>

            <!-- Cart Button -->
            ${renderCartButton(0)}

            <!-- Auth/User Button (hidden on mobile) -->
            <div class="hidden lg:block" data-auth-area>
              ${isLoggedIn() ? renderUserButton() : renderAuthButtons()}
            </div>

            <!-- Mobile Menu Button -->
            <button
              data-drawer-target="mobile-menu-drawer"
              data-drawer-toggle="mobile-menu-drawer"
              class="th-header-icon inline-flex items-center p-1.5 sm:p-2 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer shrink-0 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              type="button"
              aria-controls="mobile-menu-drawer"
              aria-label="Open main menu"
            >
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Row 2: Search Tabs (Desktop Only) -->
        <div class="hidden lg:flex items-center gap-6 pb-2 -mt-1">
          <a href="/" class="${isManufacturersPage ? desktopInactiveTabClass : desktopActiveTabClass}" data-search-tab="products"><span data-i18n="search.products">${t('search.products')}</span></a>
          <a href="/pages/manufacturers.html" class="${isManufacturersPage ? desktopActiveTabClass : desktopInactiveTabClass}" data-search-tab="manufacturers"><span data-i18n="search.manufacturers">${t('search.manufacturers')}</span></a>
        </div>
      </div>

      ${renderMobileDrawer()}
    </div>
  `;
}

/**
 * Initializes header cart popover — listens for cart-add events and updates badge + popover.
 * Supports two rendering modes:
 *   1. groupedItems (multi-supplier) — products listing page sends grouped cart items by supplier
 *   2. Legacy single-product — product detail page sends single product with colorItems
 */
let _headerCartInitialized = false;

export function initHeaderCart(): void {
  _headerCartInitialized = true; // auto-init'e "zaten çağrıldı" sinyali ver

  // Sepeti yükle: giriş yapılmışsa API'den, misafirse localStorage'dan
  const renderFromStore = () => {
    const suppliers = cartStore.getSuppliers();
    const count = cartStore.getTotalSkuCount();
    const summary = cartStore.getSummary();

    const badge = document.getElementById('header-cart-badge');
    if (badge) {
      badge.textContent = count > 99 ? '99+' : String(count);
      if (count > 0) badge.classList.remove('hidden');
      else badge.classList.add('hidden');
    }

    // Update count chip in popover header
    const countChip = document.getElementById('header-cart-count-chip');
    if (countChip) {
      if (count > 0) {
        countChip.textContent = `${count} ${t('common.items')}`;
        countChip.classList.remove('hidden');
      } else {
        countChip.classList.add('hidden');
      }
    }

    const emptyState = document.getElementById('header-cart-empty');
    const itemsContainer = document.getElementById('header-cart-items');
    const subtotalContainer = document.getElementById('header-cart-subtotal');
    const subtotalPrice = document.getElementById('header-cart-subtotal-price');

    if (count === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      if (itemsContainer) itemsContainer.classList.add('hidden');
      if (subtotalContainer) subtotalContainer.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (subtotalContainer) subtotalContainer.style.display = 'flex';
    if (subtotalPrice) {
      const gTotal = summary.subtotal || 0;
      subtotalPrice.textContent = formatCurrency(gTotal, csGetSelectedCurrency());
    }

    if (itemsContainer) {
      let html = '<div class="max-h-[320px] overflow-y-auto -mx-1 px-1 space-y-1 scrollbar-thin">';
      for (const supplier of suppliers) {
        // Supplier header
        html += `
          <div class="flex items-center gap-2 pt-1 pb-0.5">
            <div class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72"/></svg>
            </div>
            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wide truncate">${supplier.name}</p>
          </div>`;

        for (const product of supplier.products) {
          for (const sku of product.skus) {
            const thumbHtml = sku.skuImage
              ? `<img src="${sku.skuImage}" alt="sku" class="w-[52px] h-[52px] rounded-xl object-cover border border-gray-100 flex-shrink-0 shadow-sm">`
              : `<div class="w-[52px] h-[52px] rounded-xl flex-shrink-0 bg-gray-100 border border-gray-100 flex items-center justify-center"><svg class="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"/></svg></div>`;

            html += `
              <div class="flex items-center gap-3 py-2.5 px-1 rounded-xl hover:bg-gray-50 transition-colors group">
                ${thumbHtml}
                <div class="flex-1 min-w-0">
                  <p class="text-[12px] font-medium text-gray-800 leading-tight line-clamp-2 mb-1">${product.title}</p>
                  <p class="text-[11px] text-gray-400">${sku.variantText || ''}</p>
                </div>
                <div class="flex flex-col items-end gap-1 flex-shrink-0">
                  <button type="button" data-delete-sku="${sku.id}" class="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400" aria-label="${t('cart.removeProduct')}">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                  <span class="text-[13px] font-bold text-gray-900">${formatPrice(sku.unitPrice, sku.baseCurrency || 'USD')}</span>
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">x${sku.quantity}</span>
                </div>
              </div>`;
          }
        }
      }
      html += '</div>';

      itemsContainer.innerHTML = html;
      itemsContainer.classList.remove('hidden');
    }
  };

  // Sepeti yükle: oturum açıksa API'den (kullanıcıya özel), misafirse localStorage'dan
  (async () => {
    const sessionUser = getUser() ?? await getSessionUser();
    if (sessionUser) {
      try {
        const apiCart = await fetchCart();
        const sym = getCurrencySymbol();
        cartStore.init(apiCart.suppliers, 0, sym, 0);
      } catch {
        cartStore.load();
      }
    } else {
      cartStore.load();
    }
  })();

  // Initial read and subscribe to future cart metadata
  renderFromStore();
  cartStore.subscribe(renderFromStore);

  // Mini cart item silme — event delegation (innerHTML her yenilendiği için)
  const cartBodyEl = document.getElementById('header-cart-body');
  if (cartBodyEl) {
    cartBodyEl.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-delete-sku]');
      if (!btn) return;
      const skuId = btn.dataset.deleteSku;
      if (!skuId) return;
      e.stopPropagation();
      cartStore.deleteSku(skuId);
      if (isLoggedIn()) {
        apiRemoveCartItem(skuId).catch(() => {});
      }
    });
  }

  document.addEventListener('cart-add', ((e: CustomEvent) => {
    // If we're relying on legacy data injection, we can manually parse e.detail here
    // But ideal path is making components add to cartStore directly.
    // For now, let's keep it simple: just render what store has.
    // In our case cartStore might not be updated for other pages unless updated there.
    // Let me fall back to custom logic if store is empty but event fires:
    if (cartStore.getTotalSkuCount() === 0) {
      const { quantity, grandTotal, groupedItems, productTitle, supplierName, unitPrice, colorItems } = e.detail;
      const count = quantity || 0;

      const badge = document.getElementById('header-cart-badge');
      if (badge) {
        badge.textContent = count > 99 ? '99+' : String(count);
        if (count > 0) badge.classList.remove('hidden');
      }

      const emptyState = document.getElementById('header-cart-empty');
      if (emptyState) emptyState.style.display = 'none';

      const itemsContainer = document.getElementById('header-cart-items');
      if (itemsContainer) {
        let html = '';
        if (groupedItems && groupedItems.length > 0) {
          html += '<div class="max-h-[340px] overflow-y-auto pr-1 space-y-3">';
          for (const group of groupedItems) {
            html += `
              <div class="rounded-xl border border-border-light bg-surface px-3 py-2">
                <p class="text-xs font-semibold text-text-tertiary mb-1 truncate">${group.supplierName || 'Supplier'}</p>
                <p class="text-[13px] font-medium text-text-heading mb-2 leading-tight overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">${group.productTitle}</p>`;
            for (const item of group.items) {
              html += `
                <div class="flex items-center gap-3 py-1.5 border-b border-border-light last:border-0">
                  <div class="w-10 h-10 rounded-md flex-shrink-0" style="background:${item.colorValue || '#e5e7eb'}"></div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[11px] text-text-tertiary truncate">${item.label}</p>
                    <div class="flex items-center justify-between mt-0.5">
                      <span class="text-[13px] font-semibold text-text-heading">${getCurrencySymbol()}${item.unitPrice.toFixed(2)}</span>
                      <span class="text-xs text-text-tertiary">x ${item.qty}</span>
                    </div>
                  </div>
                </div>`;
            }
            html += '</div>';
          }
          html += '</div>';
        } else {
          html += `<p class="text-xs text-text-tertiary mb-1 truncate">${supplierName}</p>`;
          html += `<p class="text-sm text-text-heading mb-2 leading-tight overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">${productTitle}</p>`;
          html += '<div class="max-h-56 overflow-y-auto pr-1">';
          const items = colorItems && colorItems.length > 0 ? colorItems : null;
          if (items) {
            for (const ci of items) {
              const thumbHtml = ci.colorThumb
                ? `<img src="${ci.colorThumb}" alt="${ci.colorLabel}" class="w-12 h-12 rounded-md object-cover border border-border-default flex-shrink-0">`
                : `<div class="w-12 h-12 rounded-md flex-shrink-0 border border-border-default" style="background:${ci.colorValue || 'var(--color-surface-muted,#e5e7eb)'}"></div>`;
              for (const vi of ci.variants) {
                const desc = [vi.label, ci.colorLabel].filter(Boolean).join(', ');
                html += `
                  <div class="flex items-center gap-3 py-2 border-b border-border-light last:border-0">
                    ${thumbHtml}
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-text-tertiary">${desc}</p>
                      <div class="flex items-center justify-between mt-0.5">
                        <span class="text-sm font-semibold text-text-heading">${getCurrencySymbol()}${unitPrice.toFixed(2)}</span>
                        <span class="text-xs text-text-tertiary">x ${vi.qty}</span>
                      </div>
                    </div>
                  </div>`;
              }
            }
          } else {
            html += `
              <div class="flex items-center gap-3 py-2">
                <div class="w-12 h-12 rounded-md flex-shrink-0 bg-surface-muted border border-border-default"></div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mt-0.5">
                    <span class="text-sm font-semibold text-text-heading">${getCurrencySymbol()}${unitPrice.toFixed(2)}</span>
                    <span class="text-xs text-text-tertiary">x ${quantity}</span>
                  </div>
                </div>
              </div>`;
          }
          html += '</div>';
        }
        itemsContainer.innerHTML = html;
        itemsContainer.classList.remove('hidden');
      }

      const subtotalContainer = document.getElementById('header-cart-subtotal');
      const subtotalPrice = document.getElementById('header-cart-subtotal-price');
      if (subtotalContainer) subtotalContainer.style.display = 'flex';
      if (subtotalPrice) subtotalPrice.textContent = `${getCurrencySymbol()}${grandTotal.toFixed(2)}`;
    } else {
      renderFromStore();
    }
  }) as EventListener);
}

// Auto-init: logout handler via event delegation (works on any page that imports this module)
document.addEventListener('click', async (e) => {
  const target = e.target as HTMLElement;
  if (target.id === 'logout-btn' || target.closest('#logout-btn')) {
    e.preventDefault();
    await logout();
    window.location.replace('/pages/auth/login.html');
  }
});

/**
 * Check session state and update header auth UI accordingly.
 * Replaces "Sign In" buttons with user dropdown when logged in,
 * and updates mobile drawer profile section.
 */
export async function initAuthState(): Promise<void> {
  // waitForAuth() modül yüklenince başlatılan promise'i bekler —
  // çoğunlukla DOM render'dan önce cevap gelmiş olur, bu yüzden gecikme olmaz.
  const wasLoggedIn = isLoggedIn();
  const user = await waitForAuth();
  const isNowLoggedIn = user !== null;

  // Auth state değiştiyse DOM'u güncelle; değişmediyse mevcut Flowbite
  // dropdown instance'larını korumak için innerHTML'e dokunma.
  const domChanged = wasLoggedIn !== isNowLoggedIn;

  if (domChanged) {
    const authAreas = document.querySelectorAll<HTMLElement>('[data-auth-area]');
    authAreas.forEach(container => {
      container.innerHTML = user ? renderUserButton() : renderAuthButtons();
    });
  }

  // Update mobile drawer profile
  if (isNowLoggedIn && user) {
    const mobileProfile = document.getElementById('mobile-drawer-profile');
    if (mobileProfile) {
      const initials = (user.full_name || user.email || 'U').charAt(0).toUpperCase();
      const escapedName = (user.full_name || user.email).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const escapedEmail = user.email.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      mobileProfile.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-orange-600 dark:text-orange-300">${initials}</span>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">${escapedName}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${escapedEmail}</p>
        </div>
      `;
    }
  }

  // DOM değiştiyse Flowbite dropdown'larını yeniden başlat
  if (domChanged) {
    try {
      const { initDropdowns } = await import('flowbite');
      initDropdowns();
    } catch {
      // Flowbite not available, skip
    }
  }
}

/**
 * Initialize language selector functionality.
 * Wires up the language <select> in the header popover to change the app language.
 */
export function initLanguageSelector(): void {
  // Check auth state and update header UI (fire-and-forget)
  initAuthState();

  // Run initial translation update for all data-i18n elements
  updatePageTranslations();

  const langSelect = document.getElementById('lang-select') as HTMLSelectElement | null;
  const currencySelect = document.getElementById('currency-select') as HTMLSelectElement | null;
  const langMap: Record<string, SupportedLang> = { TR: 'tr', EN: 'en', DE: 'en' };

  if (langSelect) {
    const currentLang = getCurrentLang();
    langSelect.value = currentLang === 'tr' ? 'TR' : 'EN';
  }

  if (currencySelect) {
    currencySelect.value = getSelectedCurrency().code;
  }

  // Desktop popover "Save" button — applies language + currency, then refreshes
  const popover = document.getElementById('popover-language-currency');
  const saveBtn = popover?.querySelector<HTMLButtonElement>('.th-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const selectedLangCode = langSelect?.value || (getCurrentLang() === 'tr' ? 'TR' : 'EN');
      const lang = langMap[selectedLangCode] || 'en';
      localStorage.setItem('i18nextLng', lang);

      if (currencySelect) {
        setSelectedCurrency(currencySelect.value);
      }

      window.location.reload();
    });
  }

  // Mobile language pills — save + refresh on click
  document.querySelectorAll<HTMLButtonElement>('[data-lang-pill]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-lang-pill');
      const lang = langMap[val || ''] || 'en';
      localStorage.setItem('i18nextLng', lang);
      window.location.reload();
    });
  });

  // Load dynamic search suggestions for compact header dropdown
  initCompactSearchSuggestions();
}

/**
 * Loads dynamic search suggestions into the compact header dropdown.
 * Populates recommendation list (large text) and chip buttons.
 */
function initCompactSearchSuggestions(): void {
  const recoList = document.getElementById('topbar-compact-reco-list');
  const chipsContainer = document.getElementById('topbar-compact-chips');
  if (!recoList && !chipsContainer) return;

  const loadSuggestions = async (): Promise<void> => {
    try {
      const data = await getSearchSuggestions();

      // Populate large-text suggestion list (first 3 suggestions)
      if (recoList) {
        const items = data.suggestions.slice(0, 3);
        recoList.innerHTML = items.map(item => `
          <button type="button" tabindex="-1" data-compact-expanded-interactive="true" data-search-value="${item.text}" @click="pickValue($event.currentTarget.dataset.searchValue)" class="block w-full text-left text-[22px] font-normal leading-tight text-gray-900 transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400 truncate">${item.text}</button>
        `).join('');
      }

      // Populate chip buttons (categories or fallback to remaining suggestions)
      if (chipsContainer) {
        const chipItems = data.chips.length > 0 ? data.chips : data.suggestions.slice(3, 6);
        chipsContainer.innerHTML = chipItems.map(item => `
          <button type="button" tabindex="-1" data-compact-expanded-interactive="true" data-search-value="${item.text}" @click="pickValue($event.currentTarget.dataset.searchValue)" class="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 min-w-0 overflow-hidden"><span class="text-primary-500 shrink-0">&#10022;</span><span class="truncate">${item.text}</span></button>
        `).join('');
      }
    } catch {
      // Silently fail — areas stay empty
    }
  };

  loadSuggestions();

  // Wire up "Refresh" button to reload suggestions
  const refreshBtn = recoList?.parentElement?.querySelector('button');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loadSuggestions();
    });
  }
}

// ── Auto-init: initHeaderCart() çağırmayan sayfalar için ─────────────────────
// DOMContentLoaded, tüm sync modül scriptleri bittikten SONRA tetiklenir.
// Eğer sayfa sync olarak initHeaderCart() çağırdıysa (_headerCartInitialized=true)
// auto-init atlanır. Async (.then() içinde) çağıran veya hiç çağırmayan sayfalar
// için auto-init devreye girer.
if (document.readyState === 'complete') {
  setTimeout(() => { if (!_headerCartInitialized) initHeaderCart(); }, 0);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    if (!_headerCartInitialized) initHeaderCart();
  });
}
