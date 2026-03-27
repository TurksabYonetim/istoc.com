/**
 * SKU row inside product card.
 * Alpine.js: Uses x-data on article for @click + $dispatch on delete button.
 * Checkbox and QuantityInput children have their own Alpine scopes.
 */

import type { CartSku } from '../../../types/cart';
import { Checkbox } from '../atoms/Checkbox';
import { PriceDisplay } from '../atoms/PriceDisplay';
import { QuantityInput } from '../atoms/QuantityInput';
import { formatPrice } from '../../../services/currencyService';
import trashIcon from '../../../assets/images/trash.png';

export interface SkuRowProps {
  sku: CartSku;
  productHref?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function SkuRow({ sku, productHref }: SkuRowProps): string {
  const unavailable = sku.isAvailable === false;
  const imgContent = `<img src="${escapeHtml(sku.skuImage)}" alt="SKU ${escapeHtml(sku.id)}" class="w-full h-full object-cover" loading="lazy" />`;
  const imgWrapper = productHref
    ? `<a href="${escapeHtml(productHref)}" class="block w-full h-full">${imgContent}</a>`
    : imgContent;

  return `
    <article class="sc-c-sku-container-new rounded-xl grid grid-cols-[auto_92px_minmax(0,1fr)] gap-3 items-start p-3 max-sm:p-2 max-sm:grid-cols-[auto_72px_minmax(0,1fr)] max-sm:gap-2 transition-colors${unavailable ? ' opacity-60 bg-surface-muted' : ''}" data-sku-id="${escapeHtml(sku.id)}" x-data>
      <div class="pt-9 max-sm:pt-7">
        ${Checkbox({ id: `sku-checkbox-${sku.id}`, checked: sku.selected, onChange: unavailable ? '' : `sku-select-${sku.id}`, disabled: unavailable })}
      </div>

      <div class="w-[92px] h-[92px] max-sm:w-[72px] max-sm:h-[72px] rounded-lg border border-border-default overflow-hidden bg-surface-muted${unavailable ? ' grayscale' : ''}">
        ${imgWrapper}
      </div>

      <div class="min-w-0">
        <div class="flex items-start justify-between gap-2">
          <div class="flex flex-col gap-1 min-w-0">
            <span class="text-sm text-text-body truncate">${escapeHtml(sku.variantText)}</span>
            ${unavailable ? `<span class="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded px-2 py-0.5 w-fit">
              <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Bu ürün artık satışta değil
            </span>` : ''}
          </div>

          <div class="relative group">
            <button type="button" class="sc-c-sku-delete-btn w-8 h-8 inline-flex items-center justify-center rounded-full text-text-tertiary hover:bg-black transition-colors" data-sku-id="${escapeHtml(sku.id)}" @click="$dispatch('sku-delete', { skuId: '${escapeHtml(sku.id)}' })" aria-label="SKU sil">
              <img src="${trashIcon}" class="w-[18px] h-[18px] object-contain group-hover:invert transition-all" alt="Sil" />
            </button>
            <div class="absolute right-0 top-full mt-2 w-max px-3 py-2 bg-black text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Remove this variation
              <div class="absolute -top-1 right-3 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>
        </div>

        <div class="mt-3 flex items-end justify-between gap-3 flex-wrap">
          ${PriceDisplay({ amount: sku.unitPrice, fromCurrency: sku.baseCurrency || 'USD', unit: `/${sku.unit}` })}
          <div class="flex flex-col items-end ${unavailable ? 'pointer-events-none opacity-50' : ''}">
            ${QuantityInput({ id: `sku-qty-${sku.id}`, value: sku.quantity, min: 1, max: sku.maxQty })}
            ${!unavailable ? `<span class="sc-c-sku-line-total mt-1 text-[12px] font-semibold text-[#555]">${formatPrice(sku.unitPrice * sku.quantity, sku.baseCurrency || 'USD')}</span>` : ''}
            ${!unavailable ? `<div class="sc-c-sku-moq-warning mt-2 text-right text-[14px] leading-[20px] text-[#dc2626] hidden">
              <span class="sc-c-sku-moq-missing">0</span> more required to check out
              <button
                type="button"
                class="ml-1 underline font-semibold text-[#8b1e1e] hover:opacity-80"
                @click="$dispatch('sku-fill-min', { skuId: '${escapeHtml(sku.id)}' })"
              >
                Add all
              </button>
            </div>` : ''}
          </div>
        </div>
      </div>
    </article>
  `.trim();
}

/** @deprecated Alpine.js handles sku-delete dispatch declaratively via @click + $dispatch. Kept as no-op for backward compatibility. */
export function initSkuRows(_container?: HTMLElement): void {
  // No-op — Alpine x-data on article + @click="$dispatch('sku-delete', ...)" handles delete dispatch.
}
