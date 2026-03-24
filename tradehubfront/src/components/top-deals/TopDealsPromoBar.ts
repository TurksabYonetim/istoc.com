/**
 * TopDealsPromoBar Component
 * Shipping promo bar with countdown timer
 */

import { t } from '../../i18n';

export function TopDealsPromoBar(): string {
  return `
    <div
      class="flex flex-wrap items-center justify-center gap-3 sm:gap-6 rounded-lg px-4 py-3 mt-4"
      style="background-color: #FFF7ED; border: 1px solid #FDBA74;"
    >
      <!-- Free shipping info -->
      <div class="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <svg class="w-5 h-5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-3.375c0-.621-.504-1.125-1.125-1.125h-3.87a1.5 1.5 0 0 0-.904.3l-1.152.79a1.5 1.5 0 0 1-.904.3H9m12 3.75V6.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h2.25" />
        </svg>
        <span data-i18n="topDealsPage.promoShipping">${t('topDealsPage.promoShipping')}</span>
      </div>

      <div class="h-4 w-px bg-orange-300 hidden sm:block"></div>

      <!-- Countdown -->
      <div class="flex items-center gap-2 text-sm font-semibold text-orange-600">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span data-i18n="topDealsPage.promoDays">${t('topDealsPage.promoDays')}</span>
      </div>
    </div>
  `;
}
