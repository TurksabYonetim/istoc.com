/**
 * ProductTitleBar Component
 * Full-width section above the product hero grid (Alibaba-style).
 * Contains: product title (h1), rating/review/order line, supplier company bar.
 */

import { getCurrentProduct } from '../../alpine/product';
import { t } from '../../i18n';

function starIcon(filled: boolean): string {
  return filled
    ? `<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" style="color: var(--pd-rating-star-color, #f59e0b);"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`
    : `<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" style="color: #d1d5db;"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
}

function renderStars(rating: number): string {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(starIcon(i <= Math.round(rating)));
  }
  return stars.join('');
}

export function ProductTitleBar(): string {
  const mockProduct = getCurrentProduct();
  const p = mockProduct;
  const s = p.supplier;

  return `
    <div id="pd-title-bar" class="mb-5">
      <!-- Product Title -->
      <h1 class="text-lg font-bold leading-snug mb-1.5 line-clamp-2 break-words" style="color: var(--pd-title-color, #222222);">${p.title}</h1>

      <!-- Rating + Reviews + Orders -->
      <div class="flex items-center gap-2 flex-wrap text-[13px] mb-3">
        <div class="flex items-center gap-1">
          ${renderStars(p.rating)}
        </div>
        <span class="font-semibold" style="color: var(--pd-title-color, #222222);">${p.rating}</span>
        <span style="color: var(--pd-rating-text-color, #6b7280);">${t('product.reviewsLabel', { count: String(p.reviewCount) })}</span>
        <span style="color: var(--pd-rating-text-color, #d1d5db);">·</span>
        <span style="color: var(--pd-rating-text-color, #6b7280);">${t('product.ordersLabel', { count: String(p.orderCount) })}</span>
      </div>

      <!-- Supplier Company Bar -->
      <div class="flex items-center gap-2 flex-wrap text-[13px] px-3 py-2 rounded-md min-w-0 overflow-hidden" style="background: var(--color-surface-raised, #f5f5f5); color: var(--pd-rating-text-color, #6b7280);">
        <!-- Verified badge icon -->
        <svg class="shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="color: var(--pd-supplier-verified-color, #cc9900);">
          <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd"/>
        </svg>
        <a href="#" class="text-[13px] font-medium hover:underline truncate max-w-[200px]" style="color: var(--pd-breadcrumb-link-color, #cc9900);">${s.name}</a>
        <span class="shrink-0" style="color: #d1d5db;">·</span>
        <span class="shrink-0 inline-flex items-center gap-0.5">
          <svg class="inline-block shrink-0" width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style="color: #16a34a;"><path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
          <span class="truncate">Verified Multispecialty Supplier</span>
        </span>
        <span class="shrink-0" style="color: #d1d5db;">·</span>
        <span class="shrink-0">${t('product.yearsLabel', { count: String(s.yearsInBusiness) })}</span>
        <span class="shrink-0" style="color: #d1d5db;">·</span>
        <span class="shrink-0">🇹🇷 TR</span>
      </div>
    </div>
  `;
}
