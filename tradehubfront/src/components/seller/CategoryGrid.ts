/**
 * C4: Product Category Grid (Optional — PRO sellers only)
 * 3+4 pastel-colored category cards with product images
 * BEM Block: category-grid
 */
import type { CategoryCard } from '../../types/seller/types';
import { t } from '../../i18n';

export function CategoryGrid(cards: CategoryCard[]): string {
  if (!cards || !cards.length) return '';

  // Split into top row (3) and bottom row (4+)
  const topRow = cards.slice(0, 3);
  const bottomRow = cards.slice(3);

  return `
    <section id="category-grid" class="category-grid py-12" aria-label="${t('seller.sf.productCategoriesLabel')}">
      <div class="max-w-(--container-lg) mx-auto px-[clamp(0.75rem,0.5rem+1vw,1.5rem)] lg:px-6 xl:px-8">
        <!-- Top Row: 3 columns -->
        <div class="category-grid__row-top grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
          ${topRow.map(card => `
            <a href="${card.link || '#'}"
               class="category-grid__card relative rounded-(--radius-lg) overflow-hidden min-h-[180px] group cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-(--store-accent)"
               style="background-color: ${card.bgColor}">
              <span class="category-grid__label absolute top-5 left-5 text-white text-[17px] font-bold uppercase drop-shadow-md z-10 leading-tight max-w-[60%]">
                ${card.name}
              </span>
              <img src="${card.image}" alt="${card.name}"
                   class="category-grid__image absolute right-0 bottom-0 max-h-[80%] object-contain transition-transform duration-300 group-hover:scale-105"
                   loading="lazy"
                   onerror="this.style.display='none'" />
            </a>
          `).join('')}
        </div>

        <!-- Bottom Row: 4 columns -->
        ${bottomRow.length ? `
          <div class="category-grid__row-bottom grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            ${bottomRow.map(card => `
              <a href="${card.link || '#'}"
                 class="category-grid__card relative rounded-(--radius-lg) overflow-hidden min-h-[160px] group cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-(--store-accent)"
                 style="background-color: ${card.bgColor}">
                <span class="category-grid__label absolute top-4 left-4 text-white text-[15px] font-bold uppercase drop-shadow-md z-10 leading-tight max-w-[55%]">
                  ${card.name}
                </span>
                <img src="${card.image}" alt="${card.name}"
                     class="category-grid__image absolute right-0 bottom-0 max-h-[75%] object-contain transition-transform duration-300 group-hover:scale-105"
                     loading="lazy"
                     onerror="this.style.display='none'" />
              </a>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </section>
  `;
}
