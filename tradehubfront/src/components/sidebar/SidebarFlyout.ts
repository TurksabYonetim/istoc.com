/**
 * SidebarFlyout Component
 * Renders the flyout submenu panel that appears on hover over a sidebar menu item.
 * Supports grouped sections (e.g., Payment with Summary, T/T, Extra Services groups).
 * Positioned absolute, left: 100% of sidebar.
 *
 * All labels are translated via i18n and carry data-i18n attributes
 * for live language switching.
 */

import type { SidebarMenuItem, SidebarSubmenuItem } from '../../types/buyerDashboard';

/* ════════════════════════════════════════════════════
   I18N KEY MAPS
   ════════════════════════════════════════════════════ */

/**
 * Maps flyout heading (parent item) IDs to their i18n keys.
 */
const flyoutHeadingI18nKeys: Record<string, string> = {
  messages: 'dashboard.myMessages',
  orders: 'dashboard.myOrders',
  payment: 'dashboard.payment',
  saved: 'dashboard.savedHistory',
  logistics: 'dashboard.logisticsServices',
  dropshipping: 'dashboard.dropshipping',
  'other-services': 'dashboard.otherServices',
};

/**
 * Maps submenu item labels to their i18n keys.
 * We match on the translation key that was used to produce the label,
 * by mapping the href (unique per submenu item) to the key.
 */
const submenuI18nKeys: Record<string, string> = {
  // Messages
  '/pages/dashboard/messages.html': 'dashboard.supplierMessages',
  '/pages/dashboard/inquiries.html': 'dashboard.rfqInquiries',
  '/pages/dashboard/contacts.html': 'dashboard.myContacts',
  // Orders
  '/pages/dashboard/orders.html': 'dashboard.allOrders',
  '/pages/dashboard/orders.html#refunds': 'dashboard.refundsAfterSales',
  '/pages/dashboard/orders.html#reviews': 'dashboard.myReviews',
  '/pages/dashboard/orders.html#coupons': 'dashboard.couponsCredits',
  '/pages/dashboard/orders.html#tax-info': 'dashboard.taxInfo',
  // Payment
  '/pages/dashboard/payment.html#payment-management': 'dashboard.paymentManagement',
  '/pages/dashboard/payment.html#transactions': 'dashboard.transactions',
  '/pages/dashboard/payment.html#tt-accounts': 'dashboard.bankAccounts',
  '/pages/dashboard/payment.html#tt-tracking': 'dashboard.wireTransfer',
  '/pages/dashboard/payment.html#alibaba-card': 'dashboard.istocCard',
  '/pages/dashboard/payment.html#pay-later': 'dashboard.payLater',
  // Saved & History
  '/pages/dashboard/favorites.html#favorites': 'dashboard.myFavorites',
  '/pages/dashboard/favorites.html#browsing-history': 'dashboard.browsingHistory',
  // Logistics
  '/pages/dashboard/logistics.html#orders': 'dashboard.logisticsOrders',
  '/pages/dashboard/logistics.html#reviews': 'dashboard.logisticsReviews',
  // Dropshipping
  '/pages/dashboard/dropshipping.html#find-products': 'dashboard.findProducts',
  '/pages/dashboard/dropshipping.html#manage-orders': 'dashboard.manageOrders',
  // Other Services
  '/pages/dashboard/buyer-dashboard.html#payment-terms': 'dashboard.flexiblePayment',
  '/pages/dashboard/buyer-dashboard.html#product-inspection': 'dashboard.productInspection',
};

/* ════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════ */

/**
 * Groups submenu items by their optional `group` property.
 * Items without a group go into a default '' key.
 */
function groupSubmenuItems(items: SidebarSubmenuItem[]): Map<string, SidebarSubmenuItem[]> {
  const groups = new Map<string, SidebarSubmenuItem[]>();
  for (const item of items) {
    const key = item.group ?? '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }
  return groups;
}

/**
 * Renders a single flyout link item.
 */
function renderFlyoutLink(item: SidebarSubmenuItem): string {
  const i18nKey = submenuI18nKeys[item.href] ?? '';
  return `
    <a
      href="${item.href}"
      class="block px-3 py-2 text-sm font-normal text-gray-900 dark:text-gray-300 rounded-md transition-colors hover:bg-gray-50 hover:text-secondary-600 dark:hover:bg-gray-700 dark:hover:text-primary-400"
    >
      <span${i18nKey ? ` data-i18n="${i18nKey}"` : ''}>${item.label}</span>
    </a>
  `;
}

/* ════════════════════════════════════════════════════
   RENDER
   ════════════════════════════════════════════════════ */

export interface SidebarFlyoutProps {
  item: SidebarMenuItem;
}

/**
 * Renders the flyout submenu panel for a sidebar menu item.
 * Returns empty string if no submenu exists.
 */
export function renderSidebarFlyout({ item }: SidebarFlyoutProps): string {
  if (!item.submenu || item.submenu.length === 0) return '';

  const groups = groupSubmenuItems(item.submenu);
  const hasGroups = groups.size > 1 || (groups.size === 1 && !groups.has(''));

  let content: string;

  if (hasGroups) {
    /* ──── Grouped sections ──── */
    const sections: string[] = [];
    for (const [groupName, items] of groups) {
      sections.push(`
        <div class="sidebar-flyout__section ${sections.length > 0 ? 'mt-3 pt-3 border-t border-gray-100 dark:border-gray-700' : ''}">
          ${groupName ? `<h4 class="px-3 mb-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">${groupName}</h4>` : ''}
          ${items.map(renderFlyoutLink).join('')}
        </div>
      `);
    }
    content = sections.join('');
  } else {
    /* ──── Flat list ──── */
    content = item.submenu.map(renderFlyoutLink).join('');
  }

  const headingI18nKey = flyoutHeadingI18nKeys[item.id] ?? '';

  return `
    <div
      class="sidebar-flyout fixed z-50 w-[196px] bg-gray-100 dark:bg-gray-800 pt-5 px-5 pb-5 overflow-y-auto rounded-r-lg"
      data-sidebar-flyout="${item.id}"
      role="menu"
      aria-label="${item.label} submenu"
      style="display: none; clip-path: inset(-20px -20px -20px 0); box-shadow: 0 0 12px 0 rgba(0,0,0,0.12);"
    >
      <h3 class="px-3 mb-3 text-base font-bold text-gray-900 dark:text-white"${headingI18nKey ? ` data-i18n="${headingI18nKey}"` : ''}>${item.label}</h3>
      ${content}
    </div>
  `;
}
