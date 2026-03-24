/**
 * OrderReviewModal Component
 * Displays a review/confirmation modal before placing the order.
 * Shows shipping address, payment method, order items, and price summary.
 *
 * Reactivity handled by Alpine.js via x-data="checkoutReviewModal".
 */

import { getCurrencyCode } from '../../utils/currency';

export function OrderReviewModal(): string {
  return `
    <div
      id="order-review-modal"
      x-data="checkoutReviewModal"
      x-show="open"
      x-cloak
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0"
      x-transition:enter-end="opacity-100"
      x-transition:leave="transition ease-in duration-200"
      x-transition:leave-start="opacity-100"
      x-transition:leave-end="opacity-0"
      @click.self="open = false"
      @keydown.escape.window="if (open) open = false"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-labelledby="review-modal-title"
      aria-modal="true"
      style="display: none;"
    >
      <!-- Modal Card -->
      <div
        x-show="open"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 scale-95"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-200"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-95"
        class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/20 hover:[&::-webkit-scrollbar-thumb]:bg-black/30 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5] sticky top-0 bg-white z-10 rounded-t-xl">
          <h2 id="review-modal-title" class="text-[20px] font-bold text-[#222222]">Review your order</h2>
          <button
            type="button"
            @click="open = false"
            class="text-[#6b7280] hover:text-[#111827] transition-colors cursor-pointer p-1"
            aria-label="Close modal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5 space-y-5">

          <!-- Shipping Address -->
          <div>
            <h3 class="text-[14px] font-bold text-[#222222] mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Shipping address
            </h3>
            <p class="text-[14px] text-[#444444] bg-[#f9fafb] rounded-lg px-3 py-2" x-text="shippingAddress || 'Not provided'"></p>
          </div>

          <!-- Payment Method -->
          <div>
            <h3 class="text-[14px] font-bold text-[#222222] mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
              Payment method
            </h3>
            <p class="text-[14px] text-[#444444] bg-[#f9fafb] rounded-lg px-3 py-2" x-text="paymentMethod || 'Not selected'"></p>
          </div>

          <!-- Order Items -->
          <div>
            <h3 class="text-[14px] font-bold text-[#222222] mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Order items
            </h3>
            <template x-for="order in orders" :key="order.orderId">
              <div class="mb-3 border border-[#e5e5e5] rounded-lg overflow-hidden">
                <div class="bg-[#f9fafb] px-3 py-2 text-[13px] font-semibold text-[#222222] border-b border-[#e5e5e5]">
                  <span x-text="order.sellerName"></span>
                  <span class="text-[#6b7280] font-normal ml-2" x-text="'(' + order.orderLabel + ')'"></span>
                </div>
                <template x-for="product in order.products" :key="product.id">
                  <div class="flex items-start gap-3 px-3 py-2 border-b border-[#f3f4f6] last:border-b-0">
                    <img :src="product.image" class="w-10 h-10 rounded border border-[#e5e5e5] object-cover flex-shrink-0" alt="" />
                    <div class="flex-1 min-w-0">
                      <p class="text-[13px] text-[#222222] truncate" x-text="product.title"></p>
                      <template x-for="sku in product.skuLines" :key="sku.id">
                        <div class="flex justify-between text-[12px] text-[#6b7280] mt-0.5">
                          <span x-text="sku.variantText + ' x ' + sku.quantity"></span>
                          <span x-text="'${getCurrencyCode()} ' + (sku.unitPrice * sku.quantity).toFixed(2)"></span>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>

          <!-- Price Summary -->
          <div class="border-t border-[#e5e5e5] pt-4">
            <div class="flex justify-between text-[14px] text-[#222222] py-1">
              <span>Item subtotal</span>
              <span x-text="'${getCurrencyCode()} ' + summary.itemSubtotal"></span>
            </div>
            <div class="flex justify-between text-[14px] text-[#222222] py-1">
              <span>Shipping fee</span>
              <span x-text="'${getCurrencyCode()} ' + summary.shippingFee"></span>
            </div>
            <template x-if="summary.couponDiscount && parseFloat(summary.couponDiscount) > 0">
              <div class="flex justify-between text-[14px] text-[#16a34a] py-1">
                <span>Coupon discount</span>
                <span x-text="'- ${getCurrencyCode()} ' + summary.couponDiscount"></span>
              </div>
            </template>
            <div class="flex justify-between text-[18px] font-bold text-[#222222] pt-2 mt-1 border-t border-[#e5e5e5]">
              <span>Total</span>
              <span x-text="'${getCurrencyCode()} ' + summary.total"></span>
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 px-6 py-4 border-t border-[#e5e5e5] bg-[#f9fafb] rounded-b-xl">
          <button
            type="button"
            @click="open = false"
            class="flex-1 th-btn-outline th-btn-pill"
          >Back to checkout</button>
          <button
            type="button"
            id="review-confirm-btn"
            @click="confirmOrder()"
            class="flex-1 flex items-center justify-center th-btn-dark th-btn-pill"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="mr-2 shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Confirm order
          </button>
        </div>
      </div>
    </div>
  `;
}
