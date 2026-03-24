/**
 * Currency utility — reads the user's preferred currency from localStorage
 * and provides helpers to swap the default "$" symbol in price strings.
 */

const CURRENCY_STORAGE_KEY = 'tradehub-currency';

export interface CurrencyInfo {
  code: string;
  symbol: string;
}

const CURRENCIES: Record<string, CurrencyInfo> = {
  TRY: { code: 'TRY', symbol: '₺' },
  USD: { code: 'USD', symbol: '$' },
  EUR: { code: 'EUR', symbol: '€' },
};

/** Get the currently selected currency info */
export function getSelectedCurrency(): CurrencyInfo {
  const code = localStorage.getItem(CURRENCY_STORAGE_KEY) || 'USD';
  return CURRENCIES[code] || CURRENCIES.USD;
}

/** Get just the symbol */
export function getCurrencySymbol(): string {
  return getSelectedCurrency().symbol;
}

/** Get just the code */
export function getCurrencyCode(): string {
  return getSelectedCurrency().code;
}

/** Save the selected currency code to localStorage */
export function setSelectedCurrency(code: string): void {
  localStorage.setItem(CURRENCY_STORAGE_KEY, code);
}

/**
 * Replace the "$" prefix in a price string with the selected currency symbol.
 * Examples:
 *   formatPrice('$1.28-2.99')  → '₺1.28-2.99'  (if TRY selected)
 *   formatPrice('$320.00')     → '€320.00'       (if EUR selected)
 *   formatPrice('USD 48.00')   → 'EUR 48.00'     (if EUR selected)
 *
 * Handles both "$..." and "USD ..." formats.
 */
export function formatPrice(price: string): string {
  const { symbol, code } = getSelectedCurrency();
  return price
    .replace(/^\$/, symbol)
    .replace(/\$(?=\d)/g, symbol)
    .replace(/\bUSD\b/g, code);
}

export function formatStartingPrice(price: string): string {
  const { symbol, code } = getSelectedCurrency();
  // Match range patterns in both formats:
  //   USD/EUR: "$0.88-1.51", "$0.88 - $1.51"
  //   TRY:     "₺50,00-90,00", "₺1.925,00-3.850,00"
  const rangeMatch = price.match(/[\$€₺£¥]?([\d.,]+)\s*-\s*[\$€₺£¥]?([\d.,]+)/);
  if (rangeMatch) {
    const parseNum = (s: string): number => {
      if (code === 'TRY') {
        // TRY format: 1.925,50 → remove dots (thousands), replace comma with dot (decimal)
        return parseFloat(s.replace(/\./g, '').replace(',', '.'));
      }
      // USD/EUR format: 1,925.50 → remove commas
      return parseFloat(s.replace(/,/g, ''));
    };
    const a = parseNum(rangeMatch[1]);
    const b = parseNum(rangeMatch[2]);
    if (!isNaN(a) && !isNaN(b)) {
      const startingPrice = Math.max(a, b);
      if (code === 'TRY') {
        // TRY format with comma decimal
        const formatted = startingPrice.toFixed(2).replace('.', ',').replace(/,00$/, '');
        return `${symbol}${formatted}`;
      }
      return `${symbol}${startingPrice.toFixed(2).replace(/\.00$/, '')}`;
    }
  }
  // Single price — just swap symbol
  return formatPrice(price);
}
