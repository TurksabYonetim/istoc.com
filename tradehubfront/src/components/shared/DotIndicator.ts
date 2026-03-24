/**
 * DotIndicator Shared Component
 * Pagination dots with active (oval) and inactive (round) styling.
 */

import type { DotIndicatorProps } from '../../types/buyerDashboard';

export function DotIndicator({ total, activeIndex, className = '' }: DotIndicatorProps): string {
  const dots = Array.from({ length: total }, (_, i) => {
    const isActive = i === activeIndex;
    const dotCls = isActive
      ? 'w-4 h-2 rounded-full bg-gray-900 dark:bg-gray-100'
      : 'w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600';
    return `<button type="button" class="${dotCls} transition-all" data-dot-index="${i}" aria-label="Slide ${i + 1}"></button>`;
  }).join('');

  return `
    <div class="flex items-center justify-center gap-1.5 mt-3${className ? ` ${className}` : ''}" role="tablist">
      ${dots}
    </div>
  `;
}
