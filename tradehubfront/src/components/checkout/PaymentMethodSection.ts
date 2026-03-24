/**
 * PaymentMethodSection Component (C3)
 * Collapsed accordion section for payment method selection.
 *
 * Interactivity handled by Alpine.js x-data="checkoutAccordion" (see alpine.ts).
 * Accordion expand/collapse uses scrollHeight-based height animation.
 */

import type { CartSupplier } from '../../types/cart';
import { t } from '../../i18n';
import '../payment/state/PaymentCardStore';

export interface PaymentMethodSectionProps {
  initialExpanded?: boolean;
  suppliers: CartSupplier[];
  isSupplierCheckout?: boolean;
}

export function PaymentMethodSection({ initialExpanded = false, suppliers, isSupplierCheckout = false }: PaymentMethodSectionProps): string {
  const chevronRotate = initialExpanded ? 'rotate-180' : '';
  const contentStyle = initialExpanded ? '' : 'height: 0; overflow: hidden;';

  const renderPaymentMethods = () => {
    if (!suppliers || suppliers.length === 0) {
      return `<p class="text-[#6b7280] text-base p-4 sm:p-6" data-i18n="checkout.paymentMethodsAfterAddress">${t('checkout.paymentMethodsAfterAddress')}</p>`;
    }

    const supplierNames = suppliers.length > 1
      ? (isSupplierCheckout ? suppliers.map(s => s.name).join(', ') : 'iSTOC')
      : (isSupplierCheckout ? suppliers[0].name : 'iSTOC');

    return `
      <div class="p-4 sm:p-6 bg-[#fafafa]" x-data="{ selectedMethod: 'banka_havale' }">
        <h3 class="text-sm font-semibold text-[#111827] mb-4" data-i18n="checkout.paymentMethodFor" data-i18n-options='{"name":"${supplierNames}"}'>${t('checkout.paymentMethodFor', { name: supplierNames })}</h3>
        <div class="flex flex-col gap-3">
          <!-- Option 1: Banka Havalesi / EFT -->
          <label class="flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors relative"
                 :style="selectedMethod === 'banka_havale' ? 'border-color: var(--btn-bg, #ff6600); background-color: var(--color-primary-50, #fff9f5);' : 'border-color: var(--color-border-default, #e5e5e5); background-color: var(--color-surface, #ffffff);'">
            <input type="radio" name="payment_method" value="banka_havale" x-model="selectedMethod" class="mt-1" style="accent-color: var(--btn-bg, #ff6600);">
            <div>
              <span class="block text-sm font-bold text-[#111827]" data-i18n="checkout.bankTransfer">${t('checkout.bankTransfer')}</span>
              <span class="block text-xs text-[#6b7280] mt-1" data-i18n="checkout.bankTransferDesc">${t('checkout.bankTransferDesc')}</span>
            </div>
            <span class="absolute top-3 right-3 sm:top-4 sm:right-4 text-xs font-bold px-2 py-1 rounded" style="color: var(--btn-bg, #ff6600); background-color: var(--color-primary-100, #ffeedd);" data-i18n="common.recommended">${t('common.recommended')}</span>
          </label>

          <!-- Option 2: Çek / Senet -->
          <label class="flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
                 :style="selectedMethod === 'cek_senet' ? 'border-color: var(--btn-bg, #ff6600); background-color: var(--color-primary-50, #fff9f5);' : 'border-color: var(--color-border-default, #e5e5e5); background-color: var(--color-surface, #ffffff);'">
            <input type="radio" name="payment_method" value="cek_senet" x-model="selectedMethod" class="mt-1" style="accent-color: var(--btn-bg, #ff6600);">
            <div>
              <span class="block text-sm font-semibold" :style="selectedMethod === 'cek_senet' ? 'color: var(--btn-bg, #ff6600);' : 'color: var(--color-text-primary, #111827);'" data-i18n="checkout.checkDraft">${t('checkout.checkDraft')}</span>
              <span class="block text-xs text-[#6b7280] mt-1" data-i18n="checkout.checkDraftDesc">${t('checkout.checkDraftDesc')}</span>
            </div>
          </label>
        </div>
      </div>
    `;
  };

  return `
    <section
      id="checkout-payment"
      class="checkout-section border-t border-[#e5e5e5]"
      x-data="checkoutAccordion({ initialExpanded: ${initialExpanded} })"
      :class="{ 'checkout-section--collapsed': !expanded }"
      ${!initialExpanded ? 'x-cloak' : ''}
    >
      <button
        class="checkout-section__header checkout-section__header--toggle w-full flex items-center gap-3 py-4 px-4 sm:py-5 sm:px-6 cursor-pointer hover:bg-[#fafafa] transition-colors"
        :aria-expanded="expanded"
        aria-expanded="${initialExpanded ? 'true' : 'false'}"
        @click="toggle()"
        type="button"
      >
        <svg class="checkout-section__icon w-6 h-6 min-w-[24px] text-[#6b7280]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12M9 9.5c0-1.1.9-2 2-2h2a2 2 0 010 4h-2a2 2 0 000 4h2a2 2 0 002-2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h2 class="checkout-section__title text-lg font-bold text-[#111827] flex-1 text-left" data-i18n="checkout.paymentMethod">${t('checkout.paymentMethod')}</h2>
        <svg class="checkout-section__chevron w-5 h-5 text-[#6b7280] transition-transform duration-300 ${chevronRotate}" :class="{ 'rotate-180': expanded }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div class="checkout-section__content transition-[height] duration-300 ease-in-out overflow-hidden" style="${contentStyle}" x-ref="content">
        ${renderPaymentMethods()}
      </div>
    </section>
  `.trim();
}

/** @deprecated Migrated to Alpine.js x-data="checkoutAccordion" — see alpine.ts */
export function initAccordionSections(): void {
  // No-op: accordion interactions now handled by Alpine.js checkoutAccordion component
}
