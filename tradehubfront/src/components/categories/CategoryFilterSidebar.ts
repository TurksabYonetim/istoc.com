/**
 * CategoryFilterSidebar — Amazon-style left filter sidebar for categories page.
 * Shows collapsible filter groups per category section with "Tümünü Gör" links.
 */

import type { CategorySection, FilterGroup } from '../../data/categories';
import { t } from '../../i18n';

/** Chevron SVG for "Shop All" links */
const chevronRight = `<svg class="w-3 h-3 inline-block ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m9 5 7 7-7 7"/></svg>`;

/** Render a single filter group block */
function renderFilterGroup(group: FilterGroup): string {
  const items = group.items
    .map(
      item => `<li><a href="${item.href}" class="text-[13px] text-gray-600 hover:text-(--primary) hover:underline leading-relaxed block py-0.5">${item.name}</a></li>`
    )
    .join('');

  const shopAll = group.showShopAll
    ? `<li class="mt-1"><a href="${group.shopAllHref ?? '#'}" class="text-[13px] font-medium text-gray-800 hover:text-(--primary) inline-flex items-center">${chevronRight} ${t('categoryPage.shopAll')}</a></li>`
    : '';

  return `
    <div class="mb-4">
      <h4 class="text-sm font-bold text-gray-900 mb-2">${group.title}</h4>
      <ul class="space-y-0.5 list-none p-0 m-0">
        ${items}
        ${shopAll}
      </ul>
    </div>
  `;
}

/** Render a collapsible section in the sidebar */
function renderSidebarSection(section: CategorySection, index: number): string {
  if (!section.filters || section.filters.length === 0) return '';

  const filterGroups = section.filters.map(g => renderFilterGroup(g)).join('');
  const sectionId = `cat-filter-${index}`;

  return `
    <div class="border-b border-gray-200 pb-4 mb-4" data-filter-section="${index}">
      <button
        type="button"
        class="cat-filter-toggle flex items-center justify-between w-full text-left"
        data-target="${sectionId}"
        aria-expanded="true"
        aria-controls="${sectionId}"
      >
        <h3 class="text-sm font-bold text-gray-900">${section.title}</h3>
        <svg class="cat-filter-chevron w-4 h-4 text-gray-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7"/>
        </svg>
      </button>
      <div id="${sectionId}" class="cat-filter-content mt-3">
        ${filterGroups}
      </div>
    </div>
  `;
}

/** Render the full filter sidebar */
export function CategoryFilterSidebar(sections: CategorySection[]): string {
  const sidebarSections = sections.map((s, i) => renderSidebarSection(s, i)).join('');

  return `
    <aside class="w-56 shrink-0">
      <div class="sticky top-24">
        <nav class="bg-white rounded-lg border border-gray-200 p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          <!-- Quick Nav -->
          <div class="border-b border-gray-200 pb-3 mb-4">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">${t('categoryPage.quickNav')}</h3>
            <ul class="space-y-1 list-none p-0 m-0">
              ${sections.map((s, i) => `<li><a href="#cat-section-${i}" class="text-[13px] text-gray-600 hover:text-(--primary) hover:underline block py-0.5">${s.title}</a></li>`).join('')}
            </ul>
          </div>

          <!-- Filter Groups -->
          ${sidebarSections}
        </nav>
      </div>
    </aside>
  `;
}

/** Initialize collapsible toggle behavior for filter sections */
export function initCategoryFilters(): void {
  document.querySelectorAll<HTMLButtonElement>('.cat-filter-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;
      const content = document.getElementById(targetId);
      const chevron = btn.querySelector('.cat-filter-chevron');
      if (!content) return;

      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isExpanded));
      content.style.display = isExpanded ? 'none' : '';
      if (chevron) {
        (chevron as HTMLElement).style.transform = isExpanded ? 'rotate(-90deg)' : '';
      }
    });
  });

  // Smooth scroll for quick nav anchor links
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#cat-section-"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href')?.slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
