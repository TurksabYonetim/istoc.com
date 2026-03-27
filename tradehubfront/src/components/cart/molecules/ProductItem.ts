/**
 * Product row inside supplier card.
 * Alpine.js: Uses x-data on section for @click + $dispatch on favorite/delete buttons.
 * Checkbox and SkuRow children have their own Alpine scopes.
 */

import type { CartProduct, CartProductTag } from '../../../types/cart';
import { Checkbox } from '../atoms/Checkbox';
import { SkuRow } from './SkuRow';
import trashIcon from '../../../assets/images/trash.png';
import favIcon from '../../../assets/images/fav.png';
import { t } from '../../../i18n';

export interface ProductItemProps {
  product: CartProduct;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderTag(tag: CartProductTag): string {
  return `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium" style="color:${escapeHtml(tag.color)};background:${escapeHtml(tag.bgColor)}">${escapeHtml(tag.text)}</span>`;
}

export function ProductItem({ product }: ProductItemProps): string {
  const skus = product.skus.map((sku) => SkuRow({ sku, productHref: product.href })).join('');

  const selectedSkuCount = product.skus.filter((s) => s.selected).length;
  const totalSkuCount = product.skus.length;
  const productIndeterminate = selectedSkuCount > 0 && selectedSkuCount < totalSkuCount;

  return `
    <section class="sc-c-spu-container-new py-5 border-b border-border-light last:border-b-0" data-product-id="${escapeHtml(product.id)}" x-data>
      <div class="flex items-start gap-3">
        <div class="pt-1 shrink-0">
          ${Checkbox({ id: `product-checkbox-${product.id}`, checked: product.selected, indeterminate: productIndeterminate, onChange: `product-select-${product.id}` })}
        </div>

        <div class="flex-1 min-w-0">
          <a href="${escapeHtml(product.href)}" class="block text-base text-text-heading leading-6 hover:text-cta-primary hover:underline truncate">${escapeHtml(product.title)}</a>
          <div class="mt-2 flex flex-wrap gap-2">${product.tags.map(renderTag).join('')}</div>
          <p class="mt-2 text-sm text-text-tertiary">${escapeHtml(product.moqLabel)}</p>
        </div>

        <div class="shrink-0 flex items-center gap-1">
          <div class="relative group">
            <button type="button" class="sc-c-spu-favorite-btn w-8 h-8 inline-flex items-center justify-center rounded-full text-text-tertiary hover:bg-black transition-colors" data-product-id="${escapeHtml(product.id)}" @click="$dispatch('product-favorite', { productId: '${escapeHtml(product.id)}' })" aria-label="${t('cart.favorite')}">
              <img src="${favIcon}" class="w-[20px] h-[20px] object-contain group-hover:invert transition-all" alt="${t('cart.favorite')}" />
            </button>
            <div class="absolute right-0 top-full mt-2 w-max px-3 py-2 bg-black text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              ${t('cart.moveToFavorites')}
              <!-- Tooltip stem -->
              <div class="absolute -top-1 right-3 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>
          <div class="relative group">
            <button type="button" class="sc-c-spu-delete-btn w-8 h-8 inline-flex items-center justify-center rounded-full text-text-tertiary hover:bg-black transition-colors" data-product-id="${escapeHtml(product.id)}" @click="$dispatch('product-delete', { productId: '${escapeHtml(product.id)}' })" aria-label="${t('cart.removeProduct')}">
              <img src="${trashIcon}" class="w-[18px] h-[18px] object-contain group-hover:invert transition-all" alt="${t('cart.removeProduct')}" />
            </button>
            <div class="absolute right-0 top-full mt-2 w-max px-3 py-2 bg-black text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              ${t('cart.removeProduct')}
              <!-- Tooltip stem -->
              <div class="absolute -top-1 right-3 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 space-y-3">${skus}</div>
    </section>
  `.trim();
}

/** @deprecated Alpine.js handles product-favorite and product-delete dispatch declaratively via @click + $dispatch. Kept as no-op for backward compatibility. */
export function initProductItems(_container?: HTMLElement): void {
  // No-op — Alpine x-data on section + @click="$dispatch(...)" handles favorite and delete dispatch.
}
