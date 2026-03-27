/**
 * QuantityInput Atom
 * Rounded stepper used in cart SKU rows.
 * Alpine component: quantityInput (registered in alpine.ts)
 */

import { t } from '../../../i18n';

export interface QuantityInputProps {
  id: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
}

export function QuantityInput({
  id,
  value,
  min = 1,
  max = 9999,
  step = 1,
}: QuantityInputProps): string {
  const minusDisabled = value <= min ? 'disabled' : '';
  const plusDisabled = value >= max ? 'disabled' : '';

  return `
    <div class="number-picker inline-flex items-center w-[136px] h-[40px] px-[2px] bg-white border border-[#ddd] rounded-full select-none" x-data="quantityInput({ value: ${value}, min: ${min}, max: ${max}, step: ${step}, id: '${id}' })">
      <button type="button" class="number-picker-button number-picker-minus flex items-center justify-center shrink-0 w-[36px] h-[36px] rounded-full text-text-primary hover:bg-[#F2F2F2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:text-[#bbb] disabled:hover:bg-transparent" @click="decrement()" :disabled="value <= min" ${minusDisabled} aria-label="${t('cart.quantityDecrease')}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <input
        type="number"
        id="${id}"
        x-ref="input"
        class="number-picker-input flex-1 w-0 h-full border-none focus:ring-0 focus:outline-none focus:border-none text-center text-[14px] font-medium text-text-heading bg-transparent p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        :value="value"
        value="${value}"
        @change="clampAndDispatch()"
        min="${min}"
        max="${max}"
        step="${step}"
        aria-label="${t('cart.quantityLabel')}"
      />
      <button type="button" class="number-picker-button number-picker-plus flex items-center justify-center shrink-0 w-[36px] h-[36px] rounded-full text-text-primary hover:bg-[#F2F2F2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:text-[#bbb] disabled:hover:bg-transparent" @click="increment()" :disabled="value >= max" ${plusDisabled} aria-label="${t('cart.quantityIncrease')}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `.trim();
}

/** @deprecated Alpine handles all interactivity now – kept for backward compatibility */
export function initQuantityInputs(_container?: HTMLElement): void {
  // no-op – Alpine x-data="quantityInput" handles everything
}
