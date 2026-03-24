/**
 * AttributesTabContent Component
 * Renders the "Ozellikler" tab content with Key Attributes and Packaging tables.
 */

import { getCurrentProduct } from '../../alpine/product';
import { t } from '../../i18n';
// Product loaded lazily via getCurrentProduct() inside functions

function buildTableRows(specs: { key: string; value: string }[]): string {
  const rows: string[] = [];
  for (let i = 0; i < specs.length; i += 2) {
    const left = specs[i];
    const right = specs[i + 1];
    if (right) {
      rows.push(`<tr><td class="pd-attrs-key">${left.key}</td><td class="pd-attrs-val">${left.value}</td><td class="pd-attrs-key">${right.key}</td><td class="pd-attrs-val">${right.value}</td></tr>`);
    } else {
      rows.push(`<tr><td class="pd-attrs-key">${left.key}</td><td class="pd-attrs-val" colspan="3">${left.value}</td></tr>`);
    }
  }
  return rows.join('');
}

export function AttributesTabContent(): string {
  const p = getCurrentProduct();
  return `
    <div id="pd-tab-attributes">
      <h3 class="text-lg font-bold mb-4" style="color: var(--pd-title-color, #111827);">${t('product.keyAttributes')}</h3>
      <table class="pd-attrs-table">
        <tbody>
          ${buildTableRows(p.specs)}
        </tbody>
      </table>

      <h3 class="text-lg font-bold mb-4 mt-8" style="color: var(--pd-title-color, #111827);">${t('product.packagingDelivery')}</h3>
      <table class="pd-attrs-table">
        <tbody>
          ${buildTableRows(p.packagingSpecs)}
        </tbody>
      </table>

      <!-- Lead Time — collapsible -->
      <div class="mt-8" style="border-top: 1px solid var(--pd-spec-border, #e5e5e5);">
        <button type="button" class="pd-section-collapsible flex items-center justify-between w-full py-4 border-0 bg-transparent text-lg font-bold cursor-pointer" id="pd-leadtime-toggle" style="color: var(--pd-title-color, #111827);">
          <span>${t('product.leadTime')}</span>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div id="pd-leadtime-content" class="hidden">
          <table class="pd-attrs-table">
            <thead>
              <tr>
                <th>${t('product.leadTimeQty')}</th>
                ${p.leadTimeRanges.map(r => `<th>${r.quantityRange}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="pd-attrs-key">${t('product.leadTimeDays')}</td>
                ${p.leadTimeRanges.map(r => `<td class="pd-attrs-val">${r.days}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Customization Options -->
      <div class="mt-8 pt-6" style="border-top: 1px solid var(--pd-spec-border, #e5e5e5);">
        <h3 class="text-lg font-bold mb-4" style="color: var(--pd-title-color, #111827);">${t('product.customizationOptions')}</h3>
        ${p.customizationOptions.map(opt => `
          <div class="flex items-baseline gap-2 mb-2 text-sm">
            <strong style="color: var(--pd-spec-value-color, #111827);">${opt.name}</strong>
            <span style="color: var(--pd-spec-key-color, #6b7280);">${opt.priceAddon}</span>
            <span style="color: var(--pd-spec-key-color, #6b7280);">(${opt.minOrder})</span>
          </div>
        `).join('')}
        <a class="text-sm underline cursor-pointer" style="color: var(--pd-title-color, #111827);">${t('product.viewDetails')}</a>
        <div>
          <button type="button" class="inline-flex items-center gap-1.5 mt-3 px-6 py-2.5 text-sm font-medium rounded-full cursor-pointer transition-colors" style="border: 1px solid #333; background: var(--color-surface, #ffffff);">${t('product.startChat')}</button>
        </div>
      </div>
    </div>
  `;
}

export function initAttributesTab(): void {
  const toggle = document.getElementById('pd-leadtime-toggle');
  const content = document.getElementById('pd-leadtime-content');

  if (toggle && content) {
    toggle.addEventListener('click', () => {
      content.classList.toggle('hidden');
      toggle.classList.toggle('open');
    });
  }
}
