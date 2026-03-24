/**
 * Supplier card containing product rows.
 * Alpine.js: Uses inline x-data="{ expanded }" for accordion toggle.
 * @checkbox-change on section bridges supplier checkbox to supplier-select for CartPage.
 */

import type { CartSupplier } from '../../../types/cart';
import { Checkbox } from '../atoms/Checkbox';
import { ProductItem } from '../molecules/ProductItem';
import { t } from '../../../i18n';

export interface SupplierCardProps {
  supplier: CartSupplier;
  isSingleSupplier?: boolean;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function SupplierCard({ supplier, isSingleSupplier = true }: SupplierCardProps): string {
  const products = supplier.products.map((product) => ProductItem({ product })).join('');
  const isOpen = isSingleSupplier;

  const totalSupplierSkus = supplier.products.reduce((acc, p) => acc + p.skus.length, 0);
  const selectedSupplierSkus = supplier.products.reduce((acc, p) => acc + p.skus.filter((s) => s.selected).length, 0);
  const supplierIndeterminate = selectedSupplierSkus > 0 && selectedSupplierSkus < totalSupplierSkus;

  return `
    <section class="sc-c-supplier-container rounded-3xl border border-border-default bg-surface overflow-hidden"
      data-supplier-id="${escapeHtml(supplier.id)}"
      x-data="{ expanded: ${isOpen} }"
      @checkbox-change="if ($event.detail.handlerId === 'supplier-select-${escapeHtml(supplier.id)}') $dispatch('supplier-select', { supplierId: '${escapeHtml(supplier.id)}', selected: $event.detail.checked })">
      <header class="sc-c-supplier-header flex items-center justify-between gap-3 px-5 py-4 border-b border-border-default max-md:flex-col max-md:items-stretch max-md:gap-2 max-md:px-3 max-md:py-3 cursor-pointer hover:bg-surface-muted transition-colors select-none"
        @click="expanded = !expanded">
        <div class="flex items-center gap-3 min-w-0 overflow-hidden">
          <div onclick="event.stopPropagation()" class="shrink-0">
            ${Checkbox({ id: `supplier-checkbox-${supplier.id}`, checked: supplier.selected, indeterminate: supplierIndeterminate, onChange: `supplier-select-${supplier.id}` })}
          </div>
          <a href="${escapeHtml(supplier.href)}" onclick="event.stopPropagation()" class="text-lg max-sm:text-sm font-semibold text-text-heading hover:text-cta-primary hover:underline truncate">${escapeHtml(supplier.name)}</a>
          <svg class="sc-c-supplier-chevron w-5 h-5 max-sm:w-4 max-sm:h-4 text-text-tertiary transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}"
            :class="{ 'rotate-180': expanded }"
            fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="flex items-center gap-3 text-sm font-bold text-text-primary whitespace-nowrap sc-c-supplier-total max-md:flex-col max-md:items-stretch max-md:gap-1.5 shrink-0">
          <span class="sc-c-supplier-total-text max-sm:text-xs" x-show="!expanded" ${isOpen ? 'x-cloak' : ''}></span>
          <button type="button" class="sc-c-supplier-checkout-btn px-4 py-1.5 rounded-[var(--radius-button,8px)] text-sm font-semibold transition-colors hover:brightness-95 max-md:py-2 max-md:text-center"
                  style="background-color: var(--btn-bg, #FF6600); color: var(--btn-text, #ffffff); border: var(--btn-border-width, 0) solid var(--btn-border-color, transparent); box-shadow: var(--btn-shadow, none);"
                  @click.stop="$dispatch('checkout-supplier', { supplierId: '${escapeHtml(supplier.id)}' })">
            ${t('cart.payThisSupplier')}
          </button>
        </div>
      </header>
      <div class="sc-c-supplier-content px-5 pb-1 max-md:px-3 transition-all duration-300"
        x-show="expanded" ${!isOpen ? 'x-cloak' : ''}>${products}</div>
    </section>
  `.trim();
}

/** @deprecated Alpine.js manages accordion toggle and checkbox bridge declaratively. Kept as no-op for backward compatibility. */
export function initSupplierCards(_container?: HTMLElement): void {
  // No-op — Alpine x-data on section handles accordion toggle via @click on header;
  // @checkbox-change bridges supplier checkbox to supplier-select for CartPage.
}
