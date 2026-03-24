/**
 * ProductDescription Component
 * Description tab content: rich HTML description + specs table + packaging info.
 */

import { getCurrentProduct } from '../../alpine/product';
import { t } from '../../i18n';

function renderSpecsTable(): string {
  const mockProduct = getCurrentProduct();
  return `
    <div class="mt-6">
      <h3 class="text-base font-semibold mb-3" style="color: var(--pd-title-color, #111827);">${t('product.technicalSpecs')}</h3>
      <table class="w-full text-sm">
        <tbody>
          ${mockProduct.specs.map((spec, i) => `
            <tr style="${i < mockProduct.specs.length - 1 ? `border-bottom: 1px solid var(--pd-spec-border, #e5e5e5);` : ''}">
              <td class="py-2.5 font-medium" style="color: var(--pd-spec-key-color, #6b7280); width: 35%; ${i % 2 === 0 ? `background: var(--pd-spec-header-bg, #f9fafb);` : ''} padding-left: 12px;">${spec.key}</td>
              <td class="py-2.5 pl-4" style="color: var(--pd-spec-value-color, #111827); ${i % 2 === 0 ? `background: var(--pd-spec-header-bg, #f9fafb);` : ''}">${spec.value}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderPackaging(): string {
  const mockProduct = getCurrentProduct();
  return `
    <div class="mt-6">
      <h3 class="text-base font-semibold mb-3" style="color: var(--pd-title-color, #111827);">${t('product.packagingDelivery')}</h3>
      ${mockProduct.packaging}
    </div>
  `;
}

export function ProductDescription(): string {
  const mockProduct = getCurrentProduct();
  return `
    <div class="py-6">
      <!-- Rich Description Content -->
      <div class="prose prose-sm max-w-none" style="color: var(--pd-title-color, #111827);">
        ${mockProduct.description}
      </div>

      ${renderSpecsTable()}
      ${renderPackaging()}
    </div>
  `;
}
