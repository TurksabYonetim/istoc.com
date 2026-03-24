/**
 * PromoBanner Component
 * Top promotional banner with gradient background (Alibaba-style)
 * Dismissable campaign banner shown above the main header
 */

import { t } from '../../i18n';

export function PromoBanner(): string {
  return `
    <div id="promo-banner" class="relative w-full overflow-hidden" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 25%, #a855f7 50%, #f59e0b 75%, #f97316 100%);">
      <div class="container-boxed">
        <div class="flex items-center justify-center h-10 sm:h-11 gap-3 sm:gap-6 text-white text-sm">
          <!-- Campaign Name -->
          <span class="hidden sm:inline-flex items-center font-bold text-base tracking-wide">
            <svg class="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"/></svg>
            <span data-i18n="promo.campaignName">${t('promo.campaignName')}</span>
          </span>

          <!-- Campaign Message -->
          <span class="text-xs sm:text-sm font-medium text-white/90 truncate" data-i18n="promo.campaignMessage">${t('promo.campaignMessage')}</span>

          <!-- CTA Button -->
          <a href="/pages/products.html?featured=true" class="inline-flex items-center gap-1 px-3 py-1 text-xs sm:text-sm font-semibold text-amber-900 bg-amber-300 hover:bg-amber-200 rounded-full transition-colors whitespace-nowrap shrink-0">
            <span data-i18n="promo.exploreNow">${t('promo.exploreNow')}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
          </a>

          <!-- Close Button -->
          <button
            type="button"
            id="promo-banner-close"
            class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors"
            aria-label="Close banner"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize promo banner close button behavior
 */
export function initPromoBanner(): void {
  const banner = document.getElementById('promo-banner');
  const closeBtn = document.getElementById('promo-banner-close');
  if (banner && closeBtn) {
    // Check if previously dismissed
    if (sessionStorage.getItem('promo-banner-dismissed') === 'true') {
      banner.remove();
      return;
    }
    closeBtn.addEventListener('click', () => {
      banner.style.transition = 'all 0.3s ease';
      banner.style.maxHeight = '0';
      banner.style.opacity = '0';
      banner.style.overflow = 'hidden';
      setTimeout(() => banner.remove(), 300);
      sessionStorage.setItem('promo-banner-dismissed', 'true');
    });
  }
}
