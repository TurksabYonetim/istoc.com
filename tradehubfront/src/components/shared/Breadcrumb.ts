/**
 * Shared Breadcrumb Component
 * Reusable breadcrumb navigation for all pages (except homepage).
 * Always starts with "Home" (translated) -> ... -> current page.
 */

import { t } from '../../i18n';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Render a breadcrumb navigation bar.
 * @param items - Array of breadcrumb items. Last item is rendered as plain text (current page).
 *                "Home" is automatically prepended using i18n.
 */
export function Breadcrumb(items: BreadcrumbItem[]): string {
  const allItems: BreadcrumbItem[] = [
    { label: t('shared.home'), href: '/' },
    ...items,
  ];

  const crumbs = allItems.map((item, i) => {
    const isLast = i === allItems.length - 1;
    const isHome = i === 0;

    if (isLast) {
      return `<span class="text-sm truncate max-w-[100px] xs:max-w-[140px] sm:max-w-[200px] text-gray-500 dark:text-gray-400">${item.label}</span>`;
    }

    if (isHome) {
      return `
        <a href="${item.href ?? '#'}" class="text-sm hover:underline whitespace-nowrap truncate max-w-[60px] xs:max-w-[80px] sm:max-w-none text-primary-500 dark:text-primary-400"><span data-i18n="shared.home">${item.label}</span></a>
        <svg class="h-3 w-3 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      `;
    }

    return `
      <a href="${item.href ?? '#'}" class="text-sm hover:underline whitespace-nowrap truncate max-w-[60px] xs:max-w-[80px] sm:max-w-none text-primary-500 dark:text-primary-400">${item.label}</a>
      <svg class="h-3 w-3 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    `;
  });

  return `
    <nav aria-label="Breadcrumb" class="py-2 sm:py-3 overflow-hidden">
      <ol class="flex items-center gap-1 xs:gap-1.5 sm:gap-2 flex-nowrap overflow-x-auto scrollbar-hide">
        ${crumbs.map(c => `<li class="flex items-center gap-1 xs:gap-1.5 sm:gap-2 min-w-0">${c}</li>`).join('')}
      </ol>
    </nav>
  `;
}
