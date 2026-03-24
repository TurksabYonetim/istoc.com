/**
 * OrdersContent Component
 * Gradient background area with empty state display.
 */

import { t } from '../../i18n';

function documentIconSvg(): string {
  return `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="6" width="28" height="36" rx="3" stroke="var(--color-orders-empty-icon)" stroke-width="2" fill="none"/>
    <line x1="16" y1="16" x2="32" y2="16" stroke="var(--color-orders-empty-icon)" stroke-width="2" stroke-linecap="round"/>
    <line x1="16" y1="22" x2="32" y2="22" stroke="var(--color-orders-empty-icon)" stroke-width="2" stroke-linecap="round"/>
    <line x1="16" y1="28" x2="26" y2="28" stroke="var(--color-orders-empty-icon)" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

export function OrdersContent(): string {
  return `
    <div class="orders__content mx-[clamp(0.75rem,0.5rem+1vw,1.25rem)] mb-[clamp(0.75rem,0.5rem+1vw,1.25rem)] mt-3 rounded-(--radius-card) bg-(--color-orders-empty-bg) min-h-[140px] sm:min-h-[180px] flex items-center justify-center" role="tabpanel" aria-label="${t('dashboard.ariaOrderContent')}">
      <div class="flex flex-col items-center gap-3 py-6 sm:py-8 px-3 sm:px-5">
        <div class="text-(--color-orders-empty-icon)" aria-hidden="true">
          ${documentIconSvg()}
        </div>
        <p class="text-sm text-(--color-orders-empty-text) m-0">${t('dashboard.noOrders')}</p>
        <a href="#" class="orders__empty-btn inline-block py-2 px-6 rounded-(--radius-btn) bg-(--color-orders-empty-btn-bg) text-(--color-orders-empty-btn-text) border border-(--color-orders-empty-btn-border) text-[13px] font-semibold no-underline transition-all hover:bg-(--color-surface-raised,#f5f5f5)" role="button">
          ${t('dashboard.startSourcing')}
        </a>
      </div>
    </div>
  `;
}
