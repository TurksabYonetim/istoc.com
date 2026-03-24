/**
 * TopRankingSortPills Component
 * Hot selling / Most popular / Best reviewed sort pills
 * Uses project theme colors
 */

import { t } from '../../i18n';

export function TopRankingSortPills(): string {
  const pills = [
    { id: 'hot-selling', labelKey: 'topRankingPage.sortHotSelling' },
    { id: 'most-popular', labelKey: 'topRankingPage.sortMostPopular' },
    { id: 'best-reviewed', labelKey: 'topRankingPage.sortBestReviewed' },
  ];

  const pillsHtml = pills.map(pill => `
    <button
      type="button"
      class="flex-shrink-0 whitespace-nowrap py-[7px] px-[10px] sm:px-4 sm:py-1.5 text-[11px] sm:text-sm rounded-full transition-colors"
      style="margin: 0 6.72px 0 3.2px;"
      :class="activeSort === '${pill.id}'
        ? 'bg-[#F4F4F4] text-text-primary font-medium border border-secondary-800'
        : 'bg-transparent text-text-tertiary border border-border-default hover:border-border-strong'"
      @click="setSort('${pill.id}')"
      data-i18n="${pill.labelKey}"
    >${t(pill.labelKey)}</button>
  `).join('');

  return `
    <div class="flex items-center py-2 sm:py-3 overflow-x-auto scrollbar-hide">
      ${pillsHtml}
    </div>
  `;
}
