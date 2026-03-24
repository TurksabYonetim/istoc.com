/**
 * PriceDisplay Atom
 */

import { formatPrice as csFormatPrice } from '../../../services/currencyService';

export interface PriceDisplayProps {
  amount: number;
  fromCurrency?: string;
  bold?: boolean;
  unit?: string;
  emphasize?: boolean;
  /** @deprecated Use fromCurrency instead */
  currency?: string;
}

export function PriceDisplay({
  amount,
  fromCurrency = 'USD',
  bold: _bold = false,
  unit,
  emphasize: _emphasize = false,
}: PriceDisplayProps): string {
  const price = csFormatPrice(amount, fromCurrency);
  let unitHtml = '';
  if (unit) {
    unitHtml = `
      <span class="inline-flex items-center text-[12px] text-[#666] ml-[2px] font-normal">
        ${unit}
      </span>
    `;
  }

  return `
    <div class="inline-flex items-baseline relative group cursor-pointer select-none">
      <span class="text-[16px] font-[700] text-[#111] whitespace-nowrap leading-none">${price}</span>
      ${unitHtml}
    </div>
  `;
}
