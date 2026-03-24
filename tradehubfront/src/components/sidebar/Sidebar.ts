/**
 * Sidebar Component — Main sidebar composition
 * Composes SidebarMenuItem and SidebarFlyout for all menu sections.
 * initSidebar() handles hover flyout with 150ms bridge, single flyout,
 * responsive breakpoint at 1024px, and 200ms width transition.
 */

import { getSidebarSections, getDiscoverItem } from './sidebarData';
import { renderSidebarMenuItem } from './SidebarMenuItem';
import { renderSidebarFlyout } from './SidebarFlyout';
import type { SidebarSection } from '../../types/buyerDashboard';

/* ════════════════════════════════════════════════════
   RENDER
   ════════════════════════════════════════════════════ */

/**
 * Maps a section title string to its i18n key.
 * Used to attach data-i18n attributes for live language switching.
 */
const sectionTitleI18nKeys: Record<string, string> = {
  onlineTrading: 'dashboard.onlineTrading',
  valueAddedServices: 'dashboard.valueAddedServices',
  settings: 'dashboard.settings',
};

/**
 * Determines the i18n key for a section based on the items it contains.
 */
function getSectionI18nKey(section: SidebarSection): string | undefined {
  if (!section.title) return undefined;
  const firstItemId = section.items[0]?.id;
  if (firstItemId === 'messages') return sectionTitleI18nKeys.onlineTrading;
  if (firstItemId === 'subscription') return sectionTitleI18nKeys.valueAddedServices;
  if (firstItemId === 'settings') return sectionTitleI18nKeys.settings;
  return undefined;
}

/**
 * Renders a single sidebar section with optional title and items.
 */
function renderSection(section: SidebarSection, expanded: boolean): string {
  let title = '';
  if (section.title && expanded) {
    const i18nKey = getSectionI18nKey(section);
    const i18nAttr = i18nKey ? ` data-i18n="${i18nKey}"` : '';
    title = `<h3 class="sidebar__section-title hidden px-7 pt-5 pb-2 text-xs font-normal uppercase tracking-wider text-gray-400 dark:text-gray-500 xl:block"${i18nAttr}>${section.title}</h3>`;
  }

  const items = section.items
    .map((item) => {
      const menuItem = renderSidebarMenuItem({ item, expanded });
      const flyout = item.submenu?.length ? renderSidebarFlyout({ item }) : '';
      return `
        <div class="sidebar__item-wrapper relative" data-sidebar-wrapper="${item.id}">
          ${menuItem}
          ${flyout}
        </div>
      `;
    })
    .join('');

  return `
    <div class="sidebar__section">
      ${title}
      ${items}
    </div>
  `;
}

/**
 * Renders the full sidebar HTML.
 */
export function renderSidebar(expanded = true): string {
  const sidebarSections = getSidebarSections();
  const discoverItem = getDiscoverItem();

  const sections = sidebarSections.map((s) => renderSection(s, expanded)).join('');
  const widthClass = expanded ? 'w-[52px] md:w-[72px] xl:w-[260px]' : 'w-[52px] md:w-[72px]';

  const discoverLink = `
    <div class="sidebar__discover border-t border-gray-200 dark:border-gray-700 mt-auto pt-2 pb-3">
      <div class="sidebar__item-wrapper relative" data-sidebar-wrapper="${discoverItem.id}">
        ${renderSidebarMenuItem({ item: discoverItem, expanded })}
      </div>
    </div>
  `;

  return `
    <aside
      id="buyer-sidebar"
      x-data="sidebar"
      @mouseenter.capture="handleMouseEnter($event)"
      @mouseleave.capture="handleMouseLeave($event)"
      @scroll.window.passive="handleScroll()"
      @resize.window.passive="handleResize()"
      class="sidebar sidebar--${expanded ? 'expanded' : 'collapsed'} sticky top-[42px] z-20 flex ${widthClass} flex-col bg-gray-100 dark:bg-gray-900 rounded-lg h-[calc(100vh-42px)] transition-shadow duration-300 hover:shadow-[0_0_12px_0_rgba(0,0,0,0.12)]"
      role="navigation"
      aria-label="Buyer dashboard sidebar"
    >
      <div class="sidebar__menu flex-1 py-3">
        ${sections}
      </div>
      ${discoverLink}
    </aside>
  `;
}

/* ════════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════════ */

/**
 * Transitional no-op. Sidebar interactivity is now handled by the Alpine.js
 * 'sidebar' component registered in alpine.ts. All 6 event listeners
 * (4x mouseenter/mouseleave capture, scroll, resize) are replaced by
 * Alpine directives on the <aside x-data="sidebar"> element.
 *
 * Remove this call from page entry files and use startAlpine() instead.
 */
export function initSidebar(): void {
  // No-op — Alpine handles sidebar interactivity via x-data="sidebar"
}
