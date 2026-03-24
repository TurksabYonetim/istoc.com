/**
 * SubHeader Component
 * Secondary navigation bar with "All Categories" trigger (amber text),
 * navigation links (each triggers a different mega menu view), and utility links
 */

import { t } from '../../i18n';

/** Right-side utility links (non-mega-trigger) */
const utilityLinks = [
  { labelKey: 'subheader.sellOnIstoc', href: '/pages/seller/sell.html' },
];

/**
 * Generates the "All Categories" mega menu trigger
 */
function renderCategoriesTrigger(): string {
  return `
    <button
      id="mega-menu-trigger"
      class="mega-trigger subheader-link th-subheader-link relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 rounded-md text-sm sm:text-base dark:text-primary-400 dark:hover:text-primary-300 dark:hover:bg-gray-800/60 transition-all"
      style="color:var(--subheader-active-color)"
      type="button"
      aria-expanded="false"
      data-mega-target="categories"
    >
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
      <span data-i18n="subheader.allCategories">${t('subheader.allCategories')}</span>
    </button>
  `;
}

/**
 * Generates the main navigation links — each triggers its own mega menu view
 */
function renderNavigationLinks(): string {
  return `
    <div class="hidden lg:flex items-center gap-0.5 xl:gap-1">
      <button
        class="mega-trigger subheader-link th-subheader-link relative flex items-center gap-1.5 px-2 xl:px-3 py-2.5 rounded-md text-sm whitespace-nowrap dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800/60 transition-all"
        type="button"
        data-mega-target="featured"
      >
        <span data-i18n="subheader.featuredSelections">${t('subheader.featuredSelections')}</span>
      </button>
      <button
        class="mega-trigger subheader-link th-subheader-link relative flex items-center gap-1.5 px-2 xl:px-3 py-2.5 rounded-md text-sm whitespace-nowrap dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800/60 transition-all"
        type="button"
        data-mega-target="protections"
      >
        <span data-i18n="subheader.orderProtections">${t('subheader.orderProtections')}</span>
      </button>
    </div>
  `;
}

/**
 * Generates the right-side utility links
 */
function renderUtilityLinks(): string {
  return `
    <div class="hidden xl:flex items-center gap-0.5">
      <button
        class="mega-trigger subheader-link th-subheader-link relative px-2 xl:px-3 py-2.5 rounded-md text-sm whitespace-nowrap dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800/60 transition-all"
        type="button"
        data-mega-target="buyer-central"
      >
        <span data-i18n="subheader.buyerCentral">${t('subheader.buyerCentral')}</span>
      </button>
      <a
        href="/pages/help/help-center.html"
        class="subheader-link th-subheader-link relative px-2 xl:px-3 py-2.5 rounded-md text-sm whitespace-nowrap dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800/60 transition-all"
      >
        <span data-i18n="subheader.helpCenter">${t('subheader.helpCenter')}</span>
      </a>
      <button
        class="mega-trigger subheader-link th-subheader-link relative px-2 xl:px-3 py-2.5 rounded-md text-sm whitespace-nowrap dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800/60 transition-all"
        type="button"
        data-mega-target="app-extension"
      >
        <span data-i18n="subheader.appExtension">${t('subheader.appExtension')}</span>
      </button>
      ${utilityLinks.map(link => `
        <a
          href="${link.href}"
          class="th-subheader-link px-2 xl:px-3 py-2.5 rounded-md text-sm whitespace-nowrap dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800/60 transition-all"
        >
          <span data-i18n="${link.labelKey}">${t(link.labelKey)}</span>
        </a>
      `).join('')}
    </div>
  `;
}

/**
 * SubHeader Component
 */
export function SubHeader(): string {
  return `
    <nav class="hidden lg:block dark:bg-gray-900 dark:border-gray-700" style="background-color:var(--subheader-bg);border-bottom:1px solid var(--subheader-border-color)" aria-label="Secondary navigation">
      <div class="container-boxed px-3 sm:px-4 lg:px-6">
        <div class="flex items-center justify-between min-w-0">
          <!-- Left Side: Categories Trigger + Navigation Links -->
          <div class="flex items-center gap-0.5 sm:gap-1 lg:gap-2 min-w-0">
            ${renderCategoriesTrigger()}
            ${renderNavigationLinks()}
          </div>

          <!-- Right Side: Utility Links -->
          ${renderUtilityLinks()}
        </div>
      </div>
    </nav>
  `;
}
