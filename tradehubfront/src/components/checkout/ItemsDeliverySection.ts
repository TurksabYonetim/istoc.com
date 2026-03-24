/**
 * ItemsDeliverySection Component (C4)
 * Seller-based order list and delivery option selection.
 */

import { getCurrencyCode } from '../../utils/currency';

export interface CheckoutDeliveryMethod {
  id: string;
  etaLabel: string;
  shippingFee: number;
  isDefault?: boolean;
}

export interface CheckoutDeliverySkuLine {
  id: string;
  image: string;
  variantText: string;
  unitPrice: number;
  quantity: number;
  listingVariant?: string;
}

export interface CheckoutDeliveryProductCard {
  id: string;
  title: string;
  moqLabel: string;
  image: string;
  skuLines: CheckoutDeliverySkuLine[];
}

export interface CheckoutDeliveryOrderGroup {
  orderId: string;
  orderLabel: string;
  sellerId: string;
  sellerName: string;
  methods: CheckoutDeliveryMethod[];
  products: CheckoutDeliveryProductCard[];
}

export interface ItemsDeliverySectionProps {
  orders?: CheckoutDeliveryOrderGroup[];
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeJsSingleQuoted(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
}

function formatUsd(value: number): string {
  return `${getCurrencyCode()} ${value.toFixed(2)}`;
}

function renderMethodOption(order: CheckoutDeliveryOrderGroup, method: CheckoutDeliveryMethod): string {
  const safeOrderId = escapeJsSingleQuoted(order.orderId);
  const safeMethodId = escapeJsSingleQuoted(method.id);
  return `
    <label
      class="flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors"
      @click="selectMethod('${safeOrderId}', '${safeMethodId}')"
      :class="isMethodSelected('${safeOrderId}', '${safeMethodId}')
        ? 'border-[#111827] bg-white'
        : 'border-[#d1d5db] bg-[#fafafa] hover:border-[#9ca3af]'"
    >
      <input
        type="radio"
        class="h-6 w-6 accent-[#111827] cursor-pointer"
        :checked="isMethodSelected('${safeOrderId}', '${safeMethodId}')"
        @change="selectMethod('${safeOrderId}', '${safeMethodId}')"
      />
      <span class="text-sm sm:text-[18px] font-semibold text-[#111827] leading-tight">${method.etaLabel}</span>
      <span class="ml-auto text-sm sm:text-[18px] text-[#374151] border-l border-[#d1d5db] pl-2 sm:pl-3">Shipping fee: <strong>${formatUsd(method.shippingFee)}</strong></span>
    </label>
  `;
}

function renderSkuLine(sku: CheckoutDeliverySkuLine): string {
  const total = sku.unitPrice * sku.quantity;
  return `
    <div class="grid grid-cols-[48px_1fr] sm:grid-cols-[56px_1fr_auto_auto] gap-2 sm:gap-4 items-center rounded-lg bg-[#f3f4f6] px-3 py-2 sm:px-4 sm:py-3">
      <img src="${sku.image}" alt="" class="w-12 h-12 sm:w-14 sm:h-14 rounded object-cover border border-[#e5e7eb]" />
      <div>
        <p class="text-sm sm:text-[16px] text-[#111827]">${sku.variantText}</p>
        <p class="text-sm sm:text-[17px] font-semibold text-[#111827]">${formatUsd(sku.unitPrice)} <span class="font-normal text-[#4b5563]">/piece</span></p>
        <p class="flex gap-3 sm:hidden text-sm font-semibold text-[#111827] mt-1">
          <span>x ${sku.quantity}</span>
          <span>${formatUsd(total)}</span>
        </p>
      </div>
      <span class="hidden sm:inline text-[17px] font-semibold text-[#111827]">x ${sku.quantity}</span>
      <span class="hidden sm:inline text-[17px] font-semibold text-[#111827]">${formatUsd(total)}</span>
    </div>
  `;
}

function renderProductCard(product: CheckoutDeliveryProductCard): string {
  const skuRows = product.skuLines.map(renderSkuLine).join('');
  return `
    <div class="mt-4">
      <div class="flex items-start gap-4">
        <img src="${product.image}" alt="" class="w-16 h-16 sm:w-24 sm:h-24 rounded object-cover border border-[#e5e7eb]" />
        <div class="flex-1">
          <h4 class="text-[18px] leading-7 font-semibold text-[#111827]">${product.title}</h4>
          <p class="text-[15px] text-[#6b7280] mt-1">${product.moqLabel}</p>
        </div>
      </div>
      <div class="mt-3 space-y-2">
        ${skuRows}
      </div>
    </div>
  `;
}

function renderOrderSupplierNote(order: CheckoutDeliveryOrderGroup): string {
  const safeOrderId = escapeJsSingleQuoted(order.orderId);

  return `
    <div class="mt-4">
      <template x-if="!hasOrderNote('${safeOrderId}')">
        <button
          type="button"
          class="inline-block text-[18px] font-semibold underline text-[#111827] hover:opacity-70"
          @click="openNoteModal('${safeOrderId}')"
        >
          Add note to supplier
        </button>
      </template>
      <template x-if="hasOrderNote('${safeOrderId}')">
        <div>
          <p class="text-[18px] text-[#111827]">
            Note to supplier:
            <span class="font-medium" x-text="getOrderNote('${safeOrderId}')"></span>
          </p>
          <button
            type="button"
            class="mt-2 inline-block text-[18px] font-semibold underline text-[#111827] hover:opacity-70"
            @click="openNoteModal('${safeOrderId}')"
          >
            Edit note
          </button>
        </div>
      </template>
    </div>
  `;
}

function renderOrder(order: CheckoutDeliveryOrderGroup): string {
  const methodRows = order.methods.map((method) => renderMethodOption(order, method)).join('');
  const productCards = order.products.map(renderProductCard).join('');
  const noteBlock = renderOrderSupplierNote(order);

  return `
    <div class="pt-5 border-t border-[#e5e5e5] first:border-t-0 first:pt-0">
      <div class="flex items-center gap-3 mb-4">
        <svg class="w-6 h-6 text-[#6b7280]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
          <path d="M4 7h16M4 7l2-3h12l2 3M4 7v12a2 2 0 002 2h12a2 2 0 002-2V7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h3 class="text-[20px] font-bold text-[#111827]">${order.orderLabel}</h3>
      </div>

      <div class="space-y-3">
        ${methodRows}
      </div>

      <div class="mt-4">
        <p class="text-[17px] font-bold text-[#111827]">${order.sellerName}</p>
        ${productCards}
        ${noteBlock}
      </div>
    </div>
  `;
}

function renderSupplierNoteModal(): string {
  return `
    <div
      class="fixed inset-0 z-[90] bg-black/45 p-4 flex items-center justify-center"
      x-cloak
      x-show="isNoteModalOpen"
      @click.self="closeNoteModal()"
      @keydown.escape.window="closeNoteModal()"
    >
      <div class="w-full max-w-[760px] rounded-xl bg-white shadow-xl">
        <div class="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <h3 class="text-xl sm:text-2xl xl:text-[32px] font-bold leading-tight text-[#111827]">Note to the supplier</h3>
          <button type="button" class="text-[#111827] hover:opacity-70" @click="closeNoteModal()">
            <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <div class="px-4 pb-4 sm:px-6 sm:pb-6">
          <div class="relative">
            <textarea
              class="h-[160px] w-full resize-none rounded-md border border-[#d1d5db] p-3 sm:p-4 text-sm sm:text-[16px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
              placeholder="Please fill in"
              maxlength="2000"
              x-model="noteDraft"
            ></textarea>
            <span class="pointer-events-none absolute bottom-3 right-3 text-[14px] text-[#9ca3af]">
              <span x-text="noteDraft.length"></span>/2000
            </span>
          </div>
          <div class="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              class="min-w-0 w-full sm:min-w-[200px] sm:w-auto th-btn th-btn-pill"
              @click="saveNote()"
            >
              Confirm
            </button>
            <button
              type="button"
              class="min-w-0 w-full sm:min-w-[200px] sm:w-auto th-btn-outline th-btn-pill"
              @click="closeNoteModal()"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function ItemsDeliverySection({
  orders = [],
}: ItemsDeliverySectionProps = {}): string {
  const encodedOrders = escapeHtmlAttribute(JSON.stringify(orders));

  const ordersHtml = orders.length > 0
    ? orders.map(renderOrder).join('')
    : `<p class="text-[#6b7280] text-base p-6">Item and delivery details will appear here.</p>`;

  return `
    <section
      id="checkout-items"
      class="checkout-section border-t border-[#e5e5e5]"
      x-data="checkoutItemsDelivery"
      data-delivery-orders="${encodedOrders}"
    >
      <div class="checkout-section__header w-full flex items-center gap-3 py-4 px-4 sm:py-5 sm:px-6">
        <svg class="checkout-section__icon w-6 h-6 min-w-[24px] text-[#6b7280]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h2 class="checkout-section__title text-lg font-bold text-[#111827] flex-1 text-left">Items and delivery options</h2>
      </div>
      <div class="checkout-section__content px-4 pb-4 sm:px-6 sm:pb-6 space-y-6">
        ${ordersHtml}
      </div>
      ${renderSupplierNoteModal()}
    </section>
  `.trim();
}
