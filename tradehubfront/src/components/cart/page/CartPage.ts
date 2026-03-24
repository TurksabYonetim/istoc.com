/**
 * Cart page composition + store-driven interactions.
 * Alpine.js: Uses x-data="cartPage" on the page container for event aggregation,
 * CartStore sync, and thumbnail slider. Registered in alpine.ts.
 */

import type { CartSupplier, CartSummaryData, AssuranceItem } from '../../../types/cart';
import { t } from '../../../i18n';
import { CartHeader } from '../organisms/CartHeader';
import { BatchSelectBar } from '../molecules/BatchSelectBar';
import { SupplierCard } from '../organisms/SupplierCard';
import { CartSummary } from './CartSummary';
import { cartStore } from '../state/CartStore';
import { getCurrencySymbol } from '../../../utils/currency';

export interface CartPageProps {
  suppliers: CartSupplier[];
  summary: CartSummaryData;
  assuranceItems?: AssuranceItem[];
}

export function CartPage({ suppliers, summary, assuranceItems }: CartPageProps): string {
  if (suppliers.length === 0) {
    return `
      <div class="sc-cart-page max-w-[1640px] mx-auto px-(--space-page-x) py-4 sm:py-6">
        <div class="flex flex-col items-center justify-center py-20 text-center">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="text-text-tertiary mb-6">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h2 class="text-2xl font-bold text-text-heading mb-2" data-i18n="cart.empty">${t('cart.empty')}</h2>
          <p class="text-base text-text-secondary mb-8 max-w-md" data-i18n="cart.emptyDesc">${t('cart.emptyDesc')}</p>
          <a href="/pages/products.html" class="inline-flex items-center justify-center th-btn-dark th-btn-pill no-underline" data-i18n="cart.continueShopping">
            ${t('cart.continueShopping')}
          </a>
        </div>
      </div>
    `;
  }

  const totalItems = suppliers.reduce(
    (acc, supplier) => acc + supplier.products.reduce((sum, product) => sum + product.skus.length, 0),
    0,
  );

  const selectedCount = suppliers.reduce(
    (acc, supplier) => acc + supplier.products.reduce((sum, product) => sum + product.skus.filter((sku) => sku.selected).length, 0),
    0,
  );

  return `
    <div class="sc-cart-page flex flex-col flex-1 w-full max-w-[1640px] mx-auto px-(--space-page-x) py-4 sm:py-6"
      x-data="cartPage"
      @batch-select-toggle="handleBatchSelectToggle($event)"
      @supplier-select="handleSupplierSelect($event)"
      @checkbox-change="handleCheckboxChange($event)"
      @quantity-change="handleQuantityChange($event)"
      @sku-fill-min="handleSkuFillMin($event)"
      @sku-delete="handleSkuDelete($event)"
      @product-delete="handleProductDelete($event)"
      @batch-delete="handleBatchDelete()"
      @product-favorite="handleProductFavorite($event)"
      @checkout-supplier="handleCheckoutSupplier($event)">
      <div class="flex flex-col xl:flex-row gap-5 items-start flex-1">
        <section class="w-full xl:min-w-0 xl:flex-1 space-y-4">
          ${CartHeader()}
          ${BatchSelectBar({ totalCount: totalItems, selectedCount })}
          <div class="sc-cart-supplier-list space-y-4">
            ${suppliers.map((supplier) => SupplierCard({ supplier, isSingleSupplier: suppliers.length === 1 })).join('')}
          </div>
        </section>

        <section class="w-full xl:w-[425px] xl:sticky xl:top-6 self-start z-10">
          ${CartSummary(summary, assuranceItems)}
        </section>
      </div>
    </div>
  `;
}

/**
 * Initialize CartStore with data. All event handling, sync functions, and
 * thumbnail slider are now managed by Alpine.data('cartPage') in alpine.ts.
 */
export function initCartPage(suppliers?: CartSupplier[], shippingFee?: number, discount?: number): void {
  if (suppliers) {
    cartStore.init(suppliers, shippingFee ?? 0, getCurrencySymbol(), discount ?? 0);
  }
  // Event handlers, sync functions, thumbnail slider, and store subscription
  // are managed by Alpine.data('cartPage') component registered in alpine.ts.
}

/** Show an error toast (e.g. stock exceeded). Used by the cartPage Alpine component. */
export function showCartError(message: string): void {
  const existing = document.getElementById('cart-error-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'cart-error-toast';
  toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center justify-between gap-4 px-4 py-3 min-w-[340px] rounded bg-[#FEE2E2] border border-[#FECACA] shadow-sm text-[14px] text-[#333] transition-all duration-300 translate-y-[-20px] opacity-0';
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <svg class="w-4 h-4 text-[#dc2626] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
      <span>${message}</span>
    </div>
    <button class="text-[#999] hover:text-[#666] shrink-0" onclick="this.parentElement.remove()">
      <svg class="w-3.5 h-3.5" viewBox="0 0 1024 1024" fill="currentColor"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"/></svg>
    </button>
  `;

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translate(-50%, 0)';
    toast.style.opacity = '1';
  });
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, -20px)';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

/** Show a toast notification when a product is moved to favorites. Used by the cartPage Alpine component. */
export function showFavoriteToast(): void {
  const existing = document.getElementById('fav-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'fav-toast';
  toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center justify-between gap-4 px-4 py-3 min-w-[340px] rounded bg-[#E4F8E2] border border-[#CAEFC7] shadow-sm text-[14px] text-[#333] transition-all duration-300 translate-y-[-20px] opacity-0';
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <svg class="w-4 h-4 text-[#2db744]" viewBox="0 0 1024 1024" fill="currentColor">
        <path d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.8 535.2L292.6 435.6a32 32 0 1 0-45.2 45.3l186 186a32 32 0 0 0 45.2 0l324-324a32 32 0 0 0-45.2-45.3L456.2 599.2z"/>
      </svg>
      <span data-i18n="cart.movedToFavorites">${t('cart.movedToFavorites')}</span> <a href="/pages/dashboard/favorites.html" class="text-[#333] underline hover:text-[#ff6a00]" data-i18n="cart.favorites">${t('cart.favorites')}</a>
    </div>
    <button class="text-[#999] hover:text-[#666] shrink-0" onclick="this.parentElement.remove()">
      <svg class="w-3.5 h-3.5" viewBox="0 0 1024 1024" fill="currentColor">
        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"/>
      </svg>
    </button>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translate(-50%, 0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, -20px)';
      setTimeout(() => toast.remove(), 300);
    }
  }, 3000);
}
