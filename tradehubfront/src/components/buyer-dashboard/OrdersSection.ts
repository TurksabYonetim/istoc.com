/**
 * OrdersSection Component
 * Composes header ('Siparişler' + 'Tümünü görüntüle >') + tabs + content.
 * Alpine x-data="ordersSection" handles tab clicks, dropdown toggle, outside click close.
 */

import { getOrderTabs, getOrderFilters } from './ordersData';
import { OrdersTabs } from './OrdersTabs';
import { OrdersContent } from './OrdersContent';
import { t } from '../../i18n';

export function OrdersSection(): string {
  const ORDER_TABS = getOrderTabs();
  const ORDER_FILTERS = getOrderFilters();

  return `
    <div class="orders bg-(--color-surface,#ffffff) rounded-(--radius-card) overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_12px_0_rgba(0,0,0,0.12)]"
      x-data="ordersSection"
      data-orders-section>
      <div class="flex items-center justify-between px-[clamp(0.75rem,0.5rem+1vw,1.25rem)] pt-4 pb-3">
        <h2 class="text-base font-bold text-(--color-text-body,#333333) m-0">${t('dashboard.ordersTitle')}</h2>
        <a href="#" class="orders__view-all text-[13px] text-(--color-text-placeholder,#999999) no-underline inline-flex items-center gap-0.5 transition-colors hover:text-(--color-cta-primary)" aria-label="${t('dashboard.ariaViewAllOrders')}">
          ${t('dashboard.viewAll')}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
      ${OrdersTabs({
        tabs: ORDER_TABS,
        filters: ORDER_FILTERS,
        activeTabId: ORDER_TABS[0].id,
        selectedFilterId: ORDER_FILTERS[0].id,
        dropdownOpen: false,
      })}
      ${OrdersContent()}
    </div>
  `;
}

/**
 * @deprecated Alpine x-data="ordersSection" handles interactivity.
 * Remove this call from page entry files and use startAlpine() instead.
 */
export function initOrdersSection(): void {
  // No-op — Alpine handles orders section interactivity via x-data="ordersSection"
}
