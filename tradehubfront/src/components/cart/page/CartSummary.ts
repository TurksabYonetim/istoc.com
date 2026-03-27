/**
 * CartSummary Page Component
 * Right sidebar sticky summary panel with order totals, product thumbnails,
 * line items, CTA button, and assurance block.
 */

import type { CartSummaryData, AssuranceItem } from '../../../types/cart';
import { PriceDisplay } from '../atoms/PriceDisplay';
import { t } from '../../../i18n';
import { getSelectedCurrency } from '../../../services/currencyService';

function getDefaultAssuranceItems(): AssuranceItem[] {
  return [
    {
      icon: '🛡️',
      title: t('cart.securePayment'),
      description: t('cart.securePaymentDesc'),
    },
    {
      icon: '📦',
      title: t('cart.easyReturns'),
      description: t('cart.timelyDelivery'),
    },
    {
      icon: '✅',
      title: t('cart.supplierAssurance'),
      description: t('cart.moneyBack'),
    },
  ];
}

function renderThumbnailGrid(items: CartSummaryData['items']): string {
  if (items.length === 0) return '';

  const thumbnails = items
    .map(
      (item) => `
      <div class="checkout-item-card relative w-16 h-16 min-w-[64px] rounded overflow-hidden border border-[#e5e5e5] flex-shrink-0">
        <div class="block w-full h-full">
          <img class="w-full h-full object-cover" src="${item.image}" alt="" />
        </div>
        <span class="absolute bottom-0 right-0 bg-black/60 text-white rounded-tl text-[11px] font-bold leading-4 px-1 py-px">${item.quantity}</span>
      </div>`
    )
    .join('');

  const arrowCls = 'checkout-items-arrow absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-[#e5e5e5] bg-white flex items-center justify-center cursor-pointer z-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm hover:bg-[#f5f5f5]';

  const arrowLeft = `<button type="button" class="${arrowCls} -left-1.5" data-dir="left" aria-label="${t('cart.scrollLeft')}">
    <svg class="w-3.5 h-3.5 stroke-[#222] fill-none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  </button>`;

  const arrowRight = `<button type="button" class="${arrowCls} -right-1.5" data-dir="right" aria-label="${t('cart.scrollRight')}">
    <svg class="w-3.5 h-3.5 stroke-[#222] fill-none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
  </button>`;

  return `<div class="checkout-items-wrapper group relative mb-4">${arrowLeft}<div class="checkout-items-images flex gap-2 overflow-x-auto scroll-smooth scrollbar-hide">${thumbnails}</div>${arrowRight}</div>`;
}

function renderAssurance(items: AssuranceItem[]): string {
  const rows = items
    .map(
      (item) => `
      <li class="flex flex-col gap-1">
        <div class="flex items-center gap-2 font-semibold text-[13px] leading-[18px] text-[#333]">
          <span>${item.icon}</span>
          <span>${item.title}</span>
        </div>
        <div class="text-xs leading-4 text-[#999] pl-[26px]">${item.description}</div>
      </li>`
    )
    .join('');

  return `
    <div class="hidden xl:flex flex-col gap-3 border-t border-[#e5e5e5] pt-5 mt-5">
      <div class="flex items-center justify-between font-bold text-sm leading-5 text-[#222] mb-2" data-i18n="cart.orderProtection">${t('cart.orderProtection')}</div>
      <ul class="list-none p-0 m-0 flex flex-col gap-3">${rows}</ul>
    </div>
  `;
}

export function CartSummary(
  data: CartSummaryData,
  assuranceItems: AssuranceItem[] = getDefaultAssuranceItems()
): string {
  const viewAllLink = data.items.length > 0
    ? `<div class="flex justify-end -mt-2 mb-3"><button type="button" class="sc-view-all-items text-[13px] font-medium text-[#f59e0b] hover:text-[#d97706] hover:underline transition-colors cursor-pointer bg-transparent border-0 p-0" data-i18n="common.viewAll">${t('common.viewAll')}</button></div>`
    : '';

  return `
    <div class="sc-shopping-cart-summary-container w-full xl:w-[425px] max-h-[calc(100vh-120px)] p-4 sm:p-5 xl:p-8 bg-white border border-[#e5e5e5] rounded-lg overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/20 hover:[&::-webkit-scrollbar-thumb]:bg-black/30 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div class="block text-base sm:text-lg xl:text-xl font-bold leading-7 text-[#222] mb-3 sm:mb-4 xl:mb-5"><span data-i18n="cart.orderSummary">${t('cart.orderSummary')}</span> (<span class="sc-summary-selected-count">${data.selectedCount}</span> ${t('common.item')})</div>

      ${renderThumbnailGrid(data.items)}
      ${viewAllLink}

      <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center text-sm leading-5 text-[#333]">
          <span data-i18n="cart.productSubtotal">${t('cart.productSubtotal')}</span>
          <span class="sc-summary-product-subtotal">${PriceDisplay({ amount: data.productSubtotal, fromCurrency: getSelectedCurrency() })}</span>
        </div>
        ${data.discount > 0 ? `
        <div class="sc-summary-discount-row flex justify-between items-center text-[14px] leading-[18px]">
          <span class="text-[#333]" data-i18n="cart.productDiscount">${t('cart.productDiscount')}</span>
          <span class="sc-summary-discount text-[#FF6600] font-semibold">- ${PriceDisplay({ amount: data.discount, fromCurrency: getSelectedCurrency() })}</span>
        </div>` : `
        <div class="sc-summary-discount-row flex justify-between items-center text-[14px] leading-[18px] hidden">
          <span class="text-[#333]" data-i18n="cart.productDiscount">${t('cart.productDiscount')}</span>
          <span class="sc-summary-discount text-[#FF6600] font-semibold"></span>
        </div>`}
        <div class="flex justify-between items-center text-sm leading-5 text-[#333]">
          <span data-i18n="cart.shippingFee">${t('cart.shippingFee')}</span>
          <span>${PriceDisplay({ amount: data.shippingFee, fromCurrency: getSelectedCurrency() })}</span>
        </div>
      </div>

      <div class="flex justify-between items-center text-base sm:text-lg font-bold leading-6 text-[#222] pt-4 border-t border-[#e5e5e5] mt-2">
        <span class="min-w-0 truncate mr-2" data-i18n="cart.subtotalExTax">${t('cart.subtotalExTax')}</span>
        <span class="sc-summary-subtotal">${PriceDisplay({ amount: data.subtotal, fromCurrency: getSelectedCurrency(), bold: true })}</span>
      </div>

      ${data.discount > 0 ? `
      <div class="sc-summary-savings-banner mt-3 w-full h-12 rounded-[4px] px-3 py-1.5 flex items-center" style="background:linear-gradient(90deg,#ffead1,#ffd5d1)">
        <span class="text-[14px] leading-[18px] text-[#4B1D1F]">${t('cart.savedOnOrder', { amount: `<strong class="text-[#FF6600]">${PriceDisplay({ amount: data.discount, fromCurrency: getSelectedCurrency() })}</strong>` })}</span>
      </div>` : `
      <div class="sc-summary-savings-banner mt-3 w-full h-12 rounded-[4px] px-3 py-1.5 flex items-center hidden" style="background:linear-gradient(90deg,#ffead1,#ffd5d1)">
        <span class="text-[14px] leading-[18px] text-[#4B1D1F]">${t('cart.savedOnOrder', { amount: '<strong class="text-[#FF6600]"></strong>' })}</span>
      </div>`}

      <button type="button" class="sc-summary-checkout-btn flex items-center justify-center w-full mt-4 th-btn-dark th-btn-pill h-12 text-center" @click="$dispatch('checkout-global')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="inline-block align-middle mr-2 flex-shrink-0"><g clip-path="url(#clip0_cart_cta)"><path d="M16.4861 8.48611L15.5139 7.51384L10.5 12.5277L8.48614 10.5138L7.51386 11.4861L10.5 14.4722L16.4861 8.48611Z" fill="white"/><path d="M3.5 5.06115C3.5 4.72844 3.71919 4.4355 4.03838 4.34163L11.7884 2.06221C11.9265 2.02158 12.0735 2.02158 12.2116 2.06221L19.9616 4.34163C20.2808 4.4355 20.5 4.72844 20.5 5.06115V16.1114C20.5 16.355 20.3816 16.5835 20.1825 16.7241L12.4325 22.1947C12.1732 22.3777 11.8268 22.3777 11.5675 22.1947L3.81749 16.7241C3.6184 16.5835 3.5 16.355 3.5 16.1114V5.06115ZM4.875 15.7875L12 20.8169L19.125 15.7875V5.5288L12 3.43321L4.875 5.5288V15.7875Z" fill="white"/></g><defs><clipPath id="clip0_cart_cta"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
        <span data-i18n="cart.checkout">${t('cart.checkout')}</span>
      </button>
      <p class="sc-summary-checkout-warning mt-2 text-[13px] leading-[18px] text-[#dc2626] hidden"></p>

      ${renderAssurance(assuranceItems)}
    </div>
  `;
}
