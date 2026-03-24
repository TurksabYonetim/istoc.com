/**
 * SidebarMenuItem Component
 * Renders a single sidebar menu item with icon, label, chevron, optional badge.
 * Supports expanded (full) and collapsed (icon-only) display modes.
 * Active state: green left border + light green background.
 *
 * Labels are translated via i18n t() at render time and carry data-i18n
 * attributes for live language switching.
 */

import type { SidebarMenuItem as SidebarMenuItemType } from '../../types/buyerDashboard';
import { sidebarIcons, type SidebarIconKey } from './sidebarIcons';

/* ════════════════════════════════════════════════════
   I18N KEY MAP
   ════════════════════════════════════════════════════ */

/**
 * Maps sidebar item IDs to their i18n translation keys.
 * Used to attach data-i18n / data-i18n-aria-label / data-i18n-title attributes.
 */
const itemI18nKeys: Record<string, string> = {
  dashboard: 'dashboard.myDashboard',
  messages: 'dashboard.myMessages',
  orders: 'dashboard.myOrders',
  payment: 'dashboard.payment',
  saved: 'dashboard.savedHistory',
  subscription: 'dashboard.subscription',
  logistics: 'dashboard.logisticsServices',
  dropshipping: 'dashboard.dropshipping',
  'other-services': 'dashboard.otherServices',
  settings: 'dashboard.accountSettings',
  discover: 'dashboard.exploreSellerSite',
};

/* ════════════════════════════════════════════════════
   RENDER
   ════════════════════════════════════════════════════ */

export interface SidebarMenuItemProps {
  item: SidebarMenuItemType;
  expanded: boolean;
}

/**
 * Renders a single sidebar menu item.
 * In expanded mode: icon + label + optional badge + chevron (if submenu).
 * In collapsed mode: icon only in a centered 40x40 box.
 */
export function renderSidebarMenuItem({ item, expanded }: SidebarMenuItemProps): string {
  const icon = sidebarIcons[item.icon as SidebarIconKey] ?? '';
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const chevron = sidebarIcons.chevronRight;
  const i18nKey = itemI18nKeys[item.id] ?? '';

  const activeClasses = item.active
    ? 'bg-gray-200 text-[#222] dark:bg-gray-700 dark:text-white'
    : 'text-[#222] dark:text-gray-300';

  const hoverClasses = 'hover:bg-gray-200 dark:hover:bg-gray-700';

  if (!expanded) {
    /* ──── Collapsed mode: icon only ──── */
    return `
      <a
        href="${item.href}"
        class="sidebar-item sidebar-item--collapsed group relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mx-auto rounded-[8px] ${item.active ? 'bg-gray-200 text-[#222] dark:bg-gray-700 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'} ${hoverClasses} transition-colors"
        data-sidebar-item="${item.id}"
        data-tooltip-target="tooltip-sidebar-${item.id}"
        data-tooltip-placement="right"
        role="menuitem"
        aria-label="${item.label}"
        ${i18nKey ? `data-i18n-aria-label="${i18nKey}"` : ''}
      >
        <span class="w-4 h-4 flex-shrink-0">${icon}</span>
        ${item.badge ? `<span class="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-red-500 rounded-full">${item.badge}</span>` : ''}
      </a>
      <div id="tooltip-sidebar-${item.id}" role="tooltip" class="absolute z-50 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
        <span${i18nKey ? ` data-i18n="${i18nKey}"` : ''}>${item.label}</span>
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
    `;
  }

  /* ──── Expanded mode: full item ──── */
  return `
    <a
      href="${item.href}"
      class="sidebar-item sidebar-item--expanded group relative mx-auto flex h-9 w-9 md:h-11 md:w-11 cursor-pointer items-center justify-center rounded-[8px] ${activeClasses} ${hoverClasses} transition-colors xl:mx-5 xl:mb-2 xl:h-auto xl:min-h-[40px] xl:w-auto xl:justify-start xl:gap-3 xl:p-2"
      data-sidebar-item="${item.id}"
      role="menuitem"
      aria-label="${item.label}"
      title="${item.label}"
      ${i18nKey ? `data-i18n-aria-label="${i18nKey}" data-i18n-title="${i18nKey}"` : ''}
      ${hasSubmenu ? 'aria-haspopup="true" aria-expanded="false"' : ''}
    >
      <span class="w-4 h-4 flex-shrink-0">${icon}</span>
      <span class="sidebar-item-label hidden flex-1 truncate text-[14px] font-normal text-[#222] dark:text-gray-200 xl:block"${i18nKey ? ` data-i18n="${i18nKey}"` : ''}>${item.label}</span>
      ${item.badge ? `<span class="sidebar-item-badge hidden items-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] leading-none font-semibold text-white xl:inline-flex">${item.badge}</span>` : ''}
      ${hasSubmenu ? `<span class="sidebar-item-chevron hidden h-4 w-4 flex-shrink-0 text-gray-400 transition-transform dark:text-gray-500 xl:block">${chevron}</span>` : ''}
    </a>
  `;
}
