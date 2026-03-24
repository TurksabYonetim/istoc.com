/**
 * ProductCard Shared Component
 * Anchor element with lazy-loaded image, price range, and min order text.
 */

import type { ProductCardProps } from '../../types/buyerDashboard';
import { formatPrice } from '../../utils/currency';

export function ProductCard({ image, price, currency, minOrder, href }: ProductCardProps): string {
  return `
    <a href="${href}" class="block w-full min-w-0 max-w-[169.5px] flex-shrink-0 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div class="w-full aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src="${image}"
          alt=""
          loading="lazy"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="p-(--space-card-padding) min-w-0">
        <p class="text-(length:--text-product-price) font-semibold text-gray-900 dark:text-gray-100 leading-tight truncate">${formatPrice(currency + price)}</p>
        <p class="text-(length:--text-product-meta) text-gray-400 dark:text-gray-500 mt-0.5 truncate">${minOrder}</p>
      </div>
    </a>
  `;
}
