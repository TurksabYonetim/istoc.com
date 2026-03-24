/**
 * TopRanking Component
 * Horizontal scrollable category ranking cards with badges and trend labels.
 */

import topBadgeUrl from '../../assets/images/top.avif';
import { t } from '../../i18n';

interface TopRankingCard {
  name: string;
  nameKey: string;
  href: string;
  label: string;
  labelKey: string;
  imageSrc: string;
}

// Empty — will be populated from API categories in future
const topRankingCards: TopRankingCard[] = [];

function renderRankingImage(card: TopRankingCard): string {
  return `
    <div class="relative h-full w-full overflow-hidden rounded-md bg-gray-100" aria-hidden="true">
      <img
        src="${card.imageSrc}"
        alt="${card.name}"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 group-hover/rank:scale-110"
      />
    </div>
  `;
}

function renderRankingCard(card: TopRankingCard): string {
  return `
    <a
      href="${card.href}"
      class="group/rank relative flex-shrink-0 flex flex-col w-[156px] sm:w-[188px] h-[230px] sm:h-[262px] rounded-md border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 cursor-pointer"
      style="background: var(--topranking-card-bg, #ffffff); border-color: var(--topranking-card-border, #e5e7eb); padding: var(--space-card-padding, 12px);"
      aria-label="${t(card.nameKey)}"
    >
      <!-- Image area with badge -->
      <div class="relative w-full flex-1">
        <div class="h-full w-full overflow-hidden rounded-md">
          ${renderRankingImage(card)}
        </div>
        <!-- TOP badge — overlaps bottom edge of image -->
        <div class="absolute -bottom-5 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center">
          <img
            src="${topBadgeUrl}"
            alt=""
            class="h-[48px] w-[48px] object-contain drop-shadow"
            loading="lazy"
          />
        </div>
      </div>

      <!-- Info area -->
      <div class="flex flex-col min-w-0" style="margin-top: 28px;">
        <p
          class="truncate font-semibold leading-tight"
          style="color: var(--topranking-name-color, #222222); font-size: var(--text-product-title, 16px);"
          title="${t(card.nameKey)}"
        ><span data-i18n="${card.nameKey}">${t(card.nameKey)}</span></p>
        <p
          class="truncate leading-none"
          style="color: var(--topranking-label-color, #666666); margin-top: 2px; font-size: var(--text-product-meta, 14px);"
        ><span data-i18n="${card.labelKey}">${t(card.labelKey)}</span></p>
      </div>
    </a>
  `;
}

/** No-op init — TopRanking uses native scroll, no JS library needed. */
export function initTopRanking(): void {
  // Placeholder for future enhancements
}

export function TopRanking(): string {
  return `
    <section class="py-4 lg:py-6" aria-label="Top Ranking" style="margin-top: 28px;">
      <div class="container-boxed">
        <div class="relative overflow-hidden rounded-md" style="background-color: var(--topranking-bg, #F5F5F5);">
          <div style="padding: var(--space-card-padding, 20px);">
            <!-- Section header -->
            <div class="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2
                  class="text-[20px] sm:text-[22px] font-bold leading-tight"
                  style="color: var(--topranking-title-color, #111827);"
                ><span data-i18n="topRanking.title">${t('topRanking.title')}</span></h2>
                <p
                  class="mt-0.5 text-[13px]"
                  style="color: var(--topranking-subtitle-color, #6b7280);"
                ><span data-i18n="topRanking.subtitle">${t('topRanking.subtitle')}</span></p>
              </div>
              <a
                href="/pages/top-ranking.html"
                class="flex-shrink-0 text-[13px] font-semibold transition-colors duration-150 hover:underline"
                style="color: var(--topranking-link-color, #111827);"
              ><span data-i18n="common.viewMore">${t('common.viewMore')}</span> &gt;</a>
            </div>

            <!-- Scrollable cards -->
            <div class="relative">
              ${topRankingCards.length > 0 ? `
              <div
                class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                role="list"
                aria-label="Top ranking categories"
              >
                ${topRankingCards.map(card => `<div role="listitem">${renderRankingCard(card)}</div>`).join('')}
              </div>
              ` : `
              <div id="top-ranking-empty" class="flex items-center justify-center py-12">
                <div class="text-center">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  <p class="text-sm text-gray-400">Yak\u0131nda yeni \u00fcr\u00fcnler eklenecek</p>
                </div>
              </div>
              `}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
