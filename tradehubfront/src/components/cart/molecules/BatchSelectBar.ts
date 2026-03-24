/**
 * Batch select bar for cart page.
 * Alpine.js: Uses x-data on container. @checkbox-change bridges to
 * batch-select-toggle for CartPage compatibility. Delete uses @click + $dispatch.
 */

import { Checkbox } from '../atoms/Checkbox';
import { t } from '../../../i18n';

export interface BatchSelectBarProps {
  totalCount: number;
  selectedCount: number;
}

export function BatchSelectBar({ totalCount, selectedCount }: BatchSelectBarProps): string {
  const allSelected = totalCount > 0 && selectedCount === totalCount;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  return `
    <div class="sc-c-batch-select-bar flex items-center justify-between gap-3 px-5 py-4 rounded-3xl border border-border-default bg-surface max-md:px-3 max-md:py-3" x-data @checkbox-change="$dispatch('batch-select-toggle', { selectAll: $event.detail.checked })">
      <div class="flex items-center gap-3 min-w-0">
        ${Checkbox({ id: 'batch-select-all', checked: allSelected, indeterminate: someSelected, onChange: 'batch-select-all' })}
        <p class="text-base text-text-heading truncate">${t('cart.selectAll')} <span class="sc-c-batch-count text-text-tertiary">(${totalCount})</span></p>
      </div>

      <button type="button" class="sc-c-batch-delete-btn flex items-center gap-1.5 text-sm text-text-tertiary hover:text-error-500 disabled:opacity-40 disabled:cursor-not-allowed shrink-0" ${selectedCount === 0 ? 'disabled' : ''} @click="$dispatch('batch-delete')">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
        <span class="max-sm:sr-only">${t('cart.deleteSelected')}</span>
      </button>
    </div>
  `.trim();
}

/** @deprecated Alpine.js handles batch events declaratively. @checkbox-change bridges to batch-select-toggle; delete uses @click + $dispatch. Kept as no-op for backward compatibility. */
export function initBatchSelectBar(_container?: HTMLElement): void {
  // No-op — Alpine x-data on bar + @checkbox-change + @click="$dispatch('batch-delete')" handles all behavior.
}
