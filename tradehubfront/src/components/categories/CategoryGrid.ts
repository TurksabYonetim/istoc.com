/**
 * CategoryGrid — Amazon-style category section with circular thumbnails.
 * Renders a section title, responsive grid of circular category images,
 * and a "Tümünü gör" (See all) link item.
 */

import type { CategorySection as CategorySectionType } from '../../data/categories';
import { t } from '../../i18n';

/** Render a single category item as circular thumbnail + label */
function CategoryItem(cat: { name: string; href: string; image: string }): string {
  return `
    <a href="${cat.href}" class="group flex flex-col items-center gap-2 text-center no-underline">
      <div class="w-[68px] h-[68px] sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-full bg-gray-100 overflow-hidden border-2 border-transparent group-hover:border-(--primary) group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
        <img
          src="${cat.image}"
          alt="${cat.name}"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <span class="text-xs sm:text-sm lg:text-sm xl:text-base font-medium text-gray-700 group-hover:text-(--primary) transition-colors duration-200 leading-tight max-w-[80px] sm:max-w-[100px] lg:max-w-[120px] xl:max-w-[140px] line-clamp-2">
        ${cat.name}
      </span>
    </a>
  `;
}

/** Render a "Tümünü gör" (See all) item with dashed border circle + grid icon */
function SeeAllItem(sectionTitle: string): string {
  const query = encodeURIComponent(sectionTitle);
  return `
    <a href="/pages/products.html?q=${query}" class="group flex flex-col items-center gap-2 text-center no-underline">
      <div class="w-[68px] h-[68px] sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center group-hover:border-(--primary) group-hover:shadow-lg transition-all duration-200 group-hover:scale-105 bg-white">
        <svg class="w-8 h-8 lg:w-10 lg:h-10 text-gray-400 group-hover:text-(--primary) transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      </div>
      <span class="text-sm font-medium text-gray-500 group-hover:text-(--primary) transition-colors duration-200 leading-tight">
        ${t('categoryPage.seeAll')}
      </span>
    </a>
  `;
}

/** Render a full category section: title + grid of circular thumbnails */
export function CategorySection(section: CategorySectionType, isLast: boolean, index: number): string {
  const items = section.categories.map(cat => CategoryItem(cat)).join('');
  const seeAll = SeeAllItem(section.title);
  const borderClass = isLast ? '' : 'border-b border-gray-200';

  return `
    <section id="cat-section-${index}" class="py-6 lg:py-8 ${borderClass} scroll-mt-28">
      <h2 class="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-5 lg:mb-6">${section.title}</h2>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-x-2 sm:gap-x-4 lg:gap-x-6 xl:gap-x-8 gap-y-4 sm:gap-y-6 lg:gap-y-8 justify-items-center">
        ${items}
        ${seeAll}
      </div>
    </section>
  `;
}

/** Render the full categories page content (all sections) */
export function renderCategoryPage(sections: CategorySectionType[]): string {
  return sections
    .map((section, i) => CategorySection(section, i === sections.length - 1, i))
    .join('');
}
