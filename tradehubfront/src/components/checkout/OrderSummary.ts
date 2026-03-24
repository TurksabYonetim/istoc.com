import type { OrderSummary as OrderSummaryData, OrderSummaryThumbnail } from '../../types/checkout';
import { t } from '../../i18n';
import { formatCurrency, getSelectedCurrency } from '../../services/currencyService';

export interface ProtectionSummaryItem {
  icon: string;
  key?: 'secure' | 'dispatch' | 'refund';
  title: string;
  description: string;
}

export interface OrderSummaryProps {
  data: OrderSummaryData;
  protectionItems: ProtectionSummaryItem[];
  tradeAssuranceText: string;
}

// Custom Green SVG Icons that match the screenshot aesthetics
const secureIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-[#008a00] shrink-0 mt-[2px]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const truckIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-[#008a00] shrink-0 mt-[2px]"><rect x="1" y="3" width="15" height="13" stroke="currentColor" stroke-width="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="currentColor" stroke-width="2"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" stroke-width="2"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" stroke-width="2"/></svg>`;
const refundIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-[#008a00] shrink-0 mt-[2px]"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M2 10h20" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="15" r="2" stroke="currentColor" stroke-width="2"/></svg>`;

function getIconForItem(item: ProtectionSummaryItem): string {
  if (item.key === 'secure') return secureIcon;
  if (item.key === 'dispatch') return truckIcon;
  if (item.key === 'refund') return refundIcon;
  return `<span class="text-[16px]">${item.title.charAt(0)}</span>`; // Fallback
}

function renderThumbnailGrid(thumbnails: OrderSummaryThumbnail[], itemCount: number): string {
  if (thumbnails.length === 0) return '';

  const visibleThumbnails = thumbnails.slice(0, 4);
  const grid = visibleThumbnails
    .map(
      (thumb, idx) => `
      <div class="relative w-[48px] h-[48px] min-w-[48px] rounded border border-[#e5e5e5]">
        <img class="w-full h-full object-cover rounded" src="${thumb.image}" alt="" />
        ${idx === 0 ? `<div class="absolute -top-[6px] -right-[6px] flex items-center justify-center min-w-[20px] h-[20px] rounded-[10px] px-1 bg-[#222222] text-white text-[12px] font-bold z-10 leading-none">${itemCount}</div>` : ''}
      </div>`
    )
    .join('');

  return `
    <div class="flex gap-2 mb-5">
      ${grid}
    </div>`;
}

export function OrderSummary({ data, protectionItems, tradeAssuranceText }: OrderSummaryProps): string {
  const cur = getSelectedCurrency();
  const fmt = (v: number) => formatCurrency(v, cur);

  const subtotalStr = fmt(data.itemSubtotal);
  const shippingStr = fmt(data.shipping);
  const totalStr = fmt(data.total);
  const implicitDiscount = Number((data.itemSubtotal + data.shipping - data.total).toFixed(2));

  // The protection items rendering
  const protectionRows = protectionItems.map(item => `
    <li class="flex items-start gap-2 mb-3">
      ${getIconForItem(item)}
      <div class="flex flex-col">
        <span class="text-[14px] font-bold text-[#222222] leading-5">${item.title}</span>
        <span class="text-[14px] text-[#444444] leading-5 mt-[2px]">${item.description}</span>
      </div>
    </li>
  `).join('');

  return `
    <div
      class="checkout-sidebar w-full p-4 sm:p-5 xl:p-[28px] bg-[#FFFFFF] border border-[#e5e5e5] rounded-xl xl:max-h-[calc(100vh-48px)] overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/20 hover:[&::-webkit-scrollbar-thumb]:bg-black/30 [&::-webkit-scrollbar-thumb]:rounded-full"
      x-data="checkoutOrderSummary({ itemSubtotal: ${data.itemSubtotal}, discount: ${implicitDiscount}, initialShippingFee: ${data.shipping}, currency: '${cur}' })"
    >
      <!-- Title -->
      <div class="text-[20px] font-bold leading-7 text-[#222222] mb-5 font-inter">
        <span data-i18n="checkout.orderSummary">${t('checkout.orderSummary')}</span> (${data.itemCount} <span data-i18n="common.items">${t('common.items')}</span>)
      </div>

      <!-- Thumbnail Grid -->
      ${renderThumbnailGrid(data.thumbnails, data.itemCount)}

      <!-- Price Breakdown -->
      <div class="flex flex-col summary-amounts-layout-row">
        <div class="flex justify-between items-center py-[6px] text-[14px] leading-5 text-[#222222]">
          <span data-i18n="checkout.itemSubtotal">${t('checkout.itemSubtotal')}</span>
          <span x-text="formatMoney(itemSubtotal)">${subtotalStr}</span>
        </div>
        <div class="flex justify-between items-center py-[6px] text-[14px] leading-5 text-[#222222]">
          <span data-i18n="checkout.estimatedShipping">${t('checkout.estimatedShipping')}</span>
          <span x-text="formatMoney(shippingFee)">${shippingStr}</span>
        </div>
      </div>

      <!-- Coupon Code Section -->
      <div class="mt-3 mb-1">
        <!-- Input row (hidden when coupon applied) -->
        <template x-if="!couponApplied">
          <div class="flex gap-2">
            <input
              type="text"
              x-model="couponCode"
              @keydown.enter="applyCoupon()"
              placeholder="${t('checkout.couponPlaceholder')}" data-i18n-placeholder="checkout.couponPlaceholder"
              class="flex-1 h-[38px] px-3 text-[14px] border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#e87400] focus:ring-1 focus:ring-[#e87400] transition-colors"
            />
            <button
              type="button"
              @click="applyCoupon()"
              class="h-[38px] px-4 text-[14px] font-semibold bg-[#f5f5f5] border border-[#d1d5db] rounded-lg hover:bg-[#e8e8e8] transition-colors cursor-pointer"
            ><span data-i18n="common.apply">${t('common.apply')}</span></button>
          </div>
        </template>
        <!-- Applied coupon badge -->
        <template x-if="couponApplied">
          <div class="flex items-center justify-between bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-3 py-2">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#16a34a]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="text-[14px] font-semibold text-[#16a34a]" x-text="couponApplied.code"></span>
              <span class="text-[13px] text-[#4b5563]" x-text="'— ' + couponApplied.description"></span>
            </div>
            <button type="button" @click="removeCoupon()" class="text-[#6b7280] hover:text-[#ef4444] transition-colors cursor-pointer p-0.5" aria-label="Remove coupon">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </template>
        <!-- Error message -->
        <template x-if="couponError && !couponApplied">
          <p class="text-[13px] text-[#ef4444] mt-1" x-text="couponError"></p>
        </template>
      </div>

      <!-- Coupon discount row -->
      <template x-if="couponDiscount > 0">
        <div class="flex justify-between items-center py-[6px] text-[14px] leading-5">
          <span class="text-[#16a34a]" data-i18n="checkout.couponDiscount">${t('checkout.couponDiscount')}</span>
          <span class="text-[#16a34a] font-semibold" x-text="'- ' + formatMoney(couponDiscount)"></span>
        </div>
      </template>

      <!-- Total -->
      <div class="flex justify-between items-center mt-[10px] pt-[16px] border-t border-[#e5e5e5] summary-amounts-total-block text-[20px] font-bold text-[#222222]">
        <span data-i18n="checkout.total">${t('checkout.total')}</span>
        <span x-text="formatMoney(total)">${totalStr}</span>
      </div>

      <!-- Place Order Button -->
      <button type="button" class="w-full mt-[20px] mb-[12px] flex items-center justify-center th-btn-dark th-btn-pill leading-none" id="summary-place-order-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="mr-2 shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span data-i18n="checkout.placeOrder">${t('checkout.placeOrder')}</span>
      </button>

      <!-- Terms & Privacy -->
      <p class="text-[12px] leading-snug text-[#767676] mb-[20px]" data-i18n-html="checkout.orderTerms">${t('checkout.orderTerms')}</p>

      <!-- Order Protection Link -->
      <button type="button" class="flex items-center justify-between w-full mb-3 cursor-pointer bg-transparent text-left hover:opacity-80 transition-opacity" data-modal-target="order-protection-modal" data-modal-toggle="order-protection-modal">
        <span class="text-[16px] font-bold text-[#222222]">Alibaba.com order protection</span>
        <svg class="w-[18px] h-[18px] text-[#222222] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      <!-- Protection Summary Items -->
      <ul class="list-none p-0 m-0 flex flex-col mt-2">
        ${protectionRows}
      </ul>

      <!-- Trade Assurance Footer -->
      <div class="mt-2 text-[12px] leading-snug text-[#767676]">
        ${tradeAssuranceText}
      </div>
    </div>
  `;
}
