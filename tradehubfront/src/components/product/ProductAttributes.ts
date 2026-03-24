/**
 * ProductAttributes Component
 * Renders product specs as a grid (first 6) + list (remaining).
 */

import { getCurrentProduct } from '../../alpine/product';
import { t } from '../../i18n';

export function ProductAttributes(): string {
  const mockProduct = getCurrentProduct();
  const specs = mockProduct.specs;
  const gridSpecs = specs.slice(0, 6);
  const listSpecs = specs.slice(6);

  const gridCells = gridSpecs
    .map(
      (spec) => `
      <div class="pd-attr-cell flex flex-col gap-1 py-3.5 px-4 min-w-0" style="border-bottom: 1px solid var(--pd-spec-border, #e5e5e5); border-right: 1px solid var(--pd-spec-border, #e5e5e5);">
        <span class="text-sm font-bold truncate" style="color: var(--pd-spec-value-color, #111827);">${spec.value}</span>
        <span class="text-xs truncate" style="color: var(--pd-spec-key-color, #6b7280);">${spec.key}</span>
      </div>`
    )
    .join('');

  const listRows =
    listSpecs.length > 0
      ? `<div class="mt-4">
          ${listSpecs
            .map(
              (spec) => `
            <div class="pd-attr-row flex gap-3 py-2.5 text-[13px]" style="border-bottom: 1px solid var(--pd-spec-border, #e5e5e5);">
              <span class="min-w-[100px] xl:min-w-[120px] shrink-0" style="color: var(--pd-spec-key-color, #6b7280);">${spec.key}</span>
              <span class="font-medium min-w-0 break-words" style="color: var(--pd-spec-value-color, #111827);">${spec.value}</span>
            </div>`
            )
            .join('')}
        </div>`
      : '';

  return `
    <div id="pd-attributes-card" class="hidden flex-1 min-w-0 overflow-y-auto rounded-lg p-5" style="background: var(--pd-spec-header-bg, #f9fafb); border: 1px solid var(--pd-spec-border, #e5e5e5);">
      <h3 class="text-lg font-semibold mb-4" style="color: var(--color-text-primary);">${t('product.attributes')}</h3>
      <div class="grid grid-cols-1 xl:grid-cols-2 rounded-md overflow-hidden" style="border: 1px solid var(--pd-spec-border, #e5e5e5); background: var(--color-surface, #ffffff);">
        ${gridCells}
      </div>
      ${listRows}
    </div>
  `;
}
