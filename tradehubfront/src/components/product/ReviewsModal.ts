/**
 * ReviewsModal Component
 * Full-screen overlay modal showing all store reviews with filters,
 * mention tags, language toggle, and scrollable review cards.
 * Opened by the "Tümünü Göster" button in the Store Reviews panel.
 *
 * Reactivity handled by Alpine.js via x-data="reviewsModal".
 * Alpine.data('reviewsModal') is registered in src/alpine.ts.
 */

import { getCurrentProduct } from '../../alpine/product';
import { t } from '../../i18n';
import {
  renderReviewCard,
  renderStars,
} from './ProductReviews';

/* ── Modal HTML ──────────────────────────────────────── */

export function ReviewsModal(): string {
  const mockProduct = getCurrentProduct();
  const p = mockProduct;
  const photoReviewCount = p.reviews.filter(r => r.images && r.images.length > 0).length;

  return `
    <div
      id="rv-reviews-modal"
      x-data="reviewsModal"
      x-show="open"
      x-cloak
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0"
      x-transition:enter-end="opacity-100"
      x-transition:leave="transition ease-in duration-200"
      x-transition:leave-start="opacity-100"
      x-transition:leave-end="opacity-0"
      @click.self="close()"
      @keydown.escape.window="if (open) { close() }"
      @reviews-modal-show.window="show()"
      :data-open="open"
      class="rv-modal-overlay"
    >
      <div
        x-show="open"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 scale-95"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-200"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-95"
        class="rv-modal max-sm:!w-full max-sm:!h-full max-sm:!max-h-[100vh] max-sm:!rounded-none"
      >
        <!-- Fixed Header -->
        <div class="rv-modal-header flex justify-between items-center px-6 py-5 shrink-0 max-sm:!p-4">
          <span class="rv-modal-title">${t('product.storeReviewsTitle', { count: String(p.storeReviewCount) })}</span>
          <button type="button" @click="close()" class="rv-modal-close" id="rv-modal-close">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="rv-modal-body overflow-y-auto px-6 pb-6 flex-1 max-sm:!px-4 max-sm:!pb-4" @click="ratingOpen = false; sortOpen = false">
          <!-- Filter Row -->
          <div class="rv-filter-row flex items-center gap-2 flex-wrap mb-4">
            <button type="button" class="rv-filter-pill" :class="{ active: filterType === 'all' }" @click="setFilter('all')">${t('product.allFilter')}</button>
            <button type="button" class="rv-filter-pill" :class="{ active: filterType === 'photo' }" @click="setFilter('photo')">${t('product.withPhotos', { count: String(photoReviewCount) })}</button>

            <!-- Rating Dropdown -->
            <div class="rv-rating-dropdown" id="rv-modal-rating-dropdown" :class="{ open: ratingOpen }" @click.outside="ratingOpen = false">
              <button type="button" class="rv-rating-dropdown-trigger" @click.stop="ratingOpen = !ratingOpen; sortOpen = false" :class="{ active: ratingFilter !== 'all' }">
                <span x-text="ratingLabel()"></span>
                <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div class="rv-rating-dropdown-panel max-sm:!min-w-[160px]">
                <button type="button" class="rv-rating-dropdown-item" :class="{ active: ratingFilter === 'all' }" @click="setRating('all')">${t('product.allRatings')}</button>
                <button type="button" class="rv-rating-dropdown-item" :class="{ active: ratingFilter === 5 }" @click="setRating('5')">${renderStars(5, true)} ${t('product.starLabel', { count: '5' })}</button>
                <button type="button" class="rv-rating-dropdown-item" :class="{ active: ratingFilter === 4 }" @click="setRating('4')">${renderStars(4, true)} ${t('product.starLabel', { count: '4' })}</button>
                <button type="button" class="rv-rating-dropdown-item" :class="{ active: ratingFilter === 3 }" @click="setRating('3')">${renderStars(3, true)} ${t('product.starLabel', { count: '3' })}</button>
                <button type="button" class="rv-rating-dropdown-item" :class="{ active: ratingFilter === 2 }" @click="setRating('2')">${renderStars(2, true)} ${t('product.starLabel', { count: '2' })}</button>
                <button type="button" class="rv-rating-dropdown-item" :class="{ active: ratingFilter === 1 }" @click="setRating('1')">${renderStars(1, true)} ${t('product.starLabel', { count: '1' })}</button>
              </div>
            </div>

            <!-- Sort Dropdown -->
            <div class="rv-sort-dropdown max-sm:!ml-0 max-sm:!w-full" id="rv-modal-sort-dropdown" :class="{ open: sortOpen }" @click.outside="sortOpen = false">
              <button type="button" class="rv-sort-dropdown-trigger max-sm:!w-full max-sm:!justify-between" @click.stop="sortOpen = !sortOpen; ratingOpen = false">
                <span x-text="'${t('product.sortLabel')}: ' + sortLabel()"></span>
                <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div class="rv-sort-dropdown-panel max-sm:!left-0 max-sm:!right-0">
                <button type="button" class="rv-sort-dropdown-item" :class="{ active: sortBy === 'relevant' }" @click="setSort('relevant')">${t('product.sortRelevant')}</button>
                <button type="button" class="rv-sort-dropdown-item" :class="{ active: sortBy === 'newest' }" @click="setSort('newest')">${t('product.sortNewest')}</button>
              </div>
            </div>
          </div>

          <!-- Mention Tags -->
          <div class="flex gap-2 flex-wrap mb-5">
            <span style="font-size: 12px; color: var(--pd-rating-text-color, #6b7280); align-self: center;">${t('product.frequentMentions')}</span>
            ${p.reviewMentionTags.map(tag => `
              <button type="button" class="rv-mention-tag" :class="{ active: mentionFilter === '${tag.label}' }" @click="toggleMention('${tag.label}')">${tag.label} (${tag.count})</button>
            `).join('')}
          </div>

          <!-- Language Toggle -->
          <div class="rv-lang-row flex items-center gap-2 mt-2">
            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd"/></svg>
            <span class="text-[13px]">${t('product.langNote')}</span>
            <a class="rv-lang-toggle-link" href="javascript:void(0)">${t('product.showOriginal')}</a>
          </div>

          <!-- Review Cards (with product thumbnails) -->
          <div id="rv-modal-reviews-list" x-ref="reviewsList">
            ${p.reviews.map(r => renderReviewCard(r, true)).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ── Init logic ──────────────────────────────────────── */

/**
 * @deprecated Replaced by Alpine.js x-data="reviewsModal" directives.
 * Alpine handles show/hide, filters, dropdowns, mention tags, Escape key,
 * and body scroll lock. This function only binds the show-all button
 * (which lives outside the Alpine component in ProductReviews) as a
 * transitional bridge until ProductReviews is also migrated.
 * Remove this call from page entry files and use startAlpine() instead.
 */
export function initReviewsModal(): void {
  // Bind the show-all button (outside the Alpine component) to dispatch
  // the custom event that the Alpine reviewsModal component listens for.
  const showAllBtn = document.querySelector<HTMLButtonElement>('.rv-show-all-btn');
  if (showAllBtn) {
    showAllBtn.addEventListener('click', showReviewsModal);
  }
}

/**
 * Show the reviews modal.
 * Dispatches a custom event that the Alpine reviewsModal component listens for.
 */
export function showReviewsModal(): void {
  window.dispatchEvent(new CustomEvent('reviews-modal-show'));
}
