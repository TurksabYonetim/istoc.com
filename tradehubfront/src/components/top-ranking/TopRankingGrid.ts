/**
 * TopRankingGrid Component
 * Category group cards grid with ranked products (3 per group)
 * Uses project theme colors
 */

import { t } from '../../i18n';
import { formatPrice } from '../../utils/currency';
import type { RankingCategoryGroup } from '../../data/mockTopRanking';

export function renderRankingGroupCard(group: RankingCategoryGroup): string {
  const productsHtml = group.products.map(product => {
    // Rank badge colors using theme semantic colors
    let badgeClass = '';
    if (product.rank === 1) badgeClass = 'bg-success-500';
    else if (product.rank === 2) badgeClass = 'bg-info-500';
    else badgeClass = 'bg-warning-500';

    return `
      <a href="${product.href}" class="flex-1 min-w-0 group/product">
        <div class="relative aspect-square w-full overflow-hidden rounded-md bg-surface-raised">
          <img
            src="${product.imageSrc}"
            alt="${product.name}"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-300 group-hover/product:scale-105"
          />
          <!-- Rank badge -->
          <span
            class="absolute top-1.5 left-1.5 w-6 h-6 flex items-center justify-center rounded text-xs font-bold text-white shadow-sm ${badgeClass}"
          >#${product.rank}</span>
        </div>
        <div class="mt-1.5">
          <p class="text-sm font-semibold text-text-primary">${formatPrice(product.price)}</p>
          <p class="text-xs text-text-tertiary mt-0.5">MOQ: ${product.moq}</p>
        </div>
      </a>
    `;
  }).join('');

  return `
    <div class="bg-surface border border-border-default rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <h3 class="text-sm font-bold text-text-primary mb-3 truncate" title="${group.name}">${group.name}</h3>
      <div class="flex gap-3">
        ${productsHtml}
      </div>
    </div>
  `;
}

export function TopRankingGrid(): string {
  return `
    <section class="mt-4" aria-label="Top ranking products">
      <div
        id="top-ranking-grid"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5"
        role="list"
        aria-label="Ranking category groups"
      >
        <template x-for="group in visibleGroups" :key="group.id">
          <div role="listitem" x-html="renderGroupCard(group)"></div>
        </template>
      </div>

      <!-- Load more button -->
      <div class="flex justify-center mt-8" x-show="visibleGroupCount < filteredGroups.length">
        <button
          type="button"
          class="px-8 py-2.5 rounded-full border border-border-default text-sm font-semibold text-text-secondary bg-surface hover:bg-surface-raised transition-colors"
          @click="loadMore()"
          data-i18n="topRankingPage.loadMore"
        >${t('topRankingPage.loadMore')}</button>
      </div>
    </section>
  `;
}
