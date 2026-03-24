/**
 * Currency Service — handles multi-currency display for TradeHub
 *
 * Approach (same as Alibaba):
 * - Products store prices in their base currency (usually USD)
 * - User selects preferred display currency from header
 * - All prices are converted for display using exchange rates
 * - Exchange rates are managed from ERPNext admin panel
 * - User's preference is stored in localStorage
 */

import { api } from '../utils/api'

// ── Types ──

export interface CurrencyInfo {
  code: string
  symbol: string
  name: string
  nameTr: string
  decimalPlaces: number
}

export interface CurrencyRateEntry {
  [toCurrency: string]: number
}

export interface ExchangeRates {
  [fromCurrency: string]: CurrencyRateEntry
}

export interface CurrencySettings {
  currencies: CurrencyInfo[]
  rates: ExchangeRates
  defaultCurrency: string
  detectedCountry: string
  baseCurrency: string
}

// ── State ──

const STORAGE_KEY = 'tradehub-currency'
const RATES_CACHE_KEY = 'tradehub_rates'
const RATES_CACHE_TTL = 30 * 60 * 1000 // 30 minutes

let _settings: CurrencySettings | null = _loadCachedRates()
let _selectedCurrency: string = localStorage.getItem(STORAGE_KEY) || 'USD'
let _initialized = false

// Default fallback rates (USD-based)
const DEFAULT_RATES: ExchangeRates = {
  USD: { USD: 1, EUR: 0.92, TRY: 38.50, GBP: 0.79, CNY: 7.25 },
}

const CURRENCY_META: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', nameTr: 'Amerikan Doları', decimalPlaces: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', nameTr: 'Euro', decimalPlaces: 2 },
  TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira', nameTr: 'Türk Lirası', decimalPlaces: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', nameTr: 'İngiliz Sterlini', decimalPlaces: 2 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', nameTr: 'Çin Yuanı', decimalPlaces: 2 },
}

// ── Initialization ──

/**
 * Initialize currency service - call once on app startup
 */
export async function initCurrency(): Promise<void> {
  if (_initialized) return

  // Load saved preference
  _selectedCurrency = localStorage.getItem(STORAGE_KEY) || 'USD'

  // Try to load from cache first
  const cached = _loadCachedRates()
  if (cached) {
    _settings = cached
    _initialized = true
  }

  // Fetch fresh rates from API (non-blocking if cache exists)
  try {
    const response = await api<{ message: CurrencySettings }>(
      '/method/tradehub_core.api.currency.get_currency_settings'
    )
    _settings = response.message
    _saveCachedRates(_settings)

    // If no saved preference, use detected default
    if (!localStorage.getItem(STORAGE_KEY) && _settings.defaultCurrency) {
      _selectedCurrency = _settings.defaultCurrency
      localStorage.setItem(STORAGE_KEY, _selectedCurrency)
    }

    _initialized = true
    _notifyCurrencyChange()
  } catch (err) {
    console.warn('[currency] Failed to fetch rates from API, using defaults:', err)
    if (!_settings) {
      _settings = {
        currencies: Object.values(CURRENCY_META),
        rates: DEFAULT_RATES,
        defaultCurrency: 'USD',
        detectedCountry: 'US',
        baseCurrency: 'USD',
      }
    }
    _initialized = true
  }
}

// ── Currency Selection ──

/**
 * Get the currently selected display currency
 */
export function getSelectedCurrency(): string {
  return _selectedCurrency
}

/**
 * Get currency info for the selected currency
 */
export function getSelectedCurrencyInfo(): CurrencyInfo {
  return CURRENCY_META[_selectedCurrency] || CURRENCY_META['USD']
}

/**
 * Set the display currency and notify all listeners
 */
export function setSelectedCurrency(currencyCode: string): void {
  if (!CURRENCY_META[currencyCode]) {
    console.warn(`[currency] Unknown currency: ${currencyCode}`)
    return
  }
  _selectedCurrency = currencyCode
  localStorage.setItem(STORAGE_KEY, currencyCode)
  _notifyCurrencyChange()
}

/**
 * Get all supported currencies
 */
export function getSupportedCurrencies(): CurrencyInfo[] {
  if (_settings?.currencies) return _settings.currencies
  return Object.values(CURRENCY_META)
}

// ── Price Conversion ──

/**
 * Convert a price from one currency to the user's selected currency
 */
export function convertPrice(amount: number, fromCurrency: string = 'USD'): number {
  if (!amount || isNaN(amount)) return 0
  if (fromCurrency === _selectedCurrency) return amount

  const rate = getExchangeRate(fromCurrency, _selectedCurrency)
  return Math.round(amount * rate * 100) / 100
}

/**
 * Format a price in the user's selected currency
 */
export function formatPrice(amount: number, fromCurrency: string = 'USD'): string {
  const converted = convertPrice(amount, fromCurrency)
  return formatCurrency(converted, _selectedCurrency)
}

/**
 * Format a price range (e.g., "$7.80-$14.50") in the selected currency
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  fromCurrency: string = 'USD'
): string {
  const min = convertPrice(minPrice, fromCurrency)
  const max = convertPrice(maxPrice, fromCurrency)
  const info = getSelectedCurrencyInfo()

  if (min === max) {
    return formatCurrency(min, _selectedCurrency)
  }
  return `${info.symbol}${_formatNumber(min)}-${_formatNumber(max)}`
}

/**
 * Format an amount with its currency symbol
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const info = CURRENCY_META[currencyCode] || CURRENCY_META['USD']

  if (currencyCode === 'TRY') {
    // Turkish format: ₺1.234,56
    const parts = amount.toFixed(info.decimalPlaces).split('.')
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `${info.symbol}${intPart},${parts[1]}`
  }

  // International format: $1,234.56
  return `${info.symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: info.decimalPlaces,
    maximumFractionDigits: info.decimalPlaces,
  })}`
}

/**
 * Get exchange rate between two currencies
 */
export function getExchangeRate(fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return 1

  const rates = _settings?.rates || DEFAULT_RATES

  // Direct lookup
  if (rates[fromCurrency]?.[toCurrency]) {
    return rates[fromCurrency][toCurrency]
  }

  // Try via USD as intermediary
  if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
    const fromToUsd = rates[fromCurrency]?.['USD'] || (1 / (rates['USD']?.[fromCurrency] || 1))
    const usdToTarget = rates['USD']?.[toCurrency] || 1
    return fromToUsd * usdToTarget
  }

  // Try reverse
  if (rates[toCurrency]?.[fromCurrency]) {
    const reverseRate = rates[toCurrency][fromCurrency]
    if (reverseRate > 0) return 1 / reverseRate
  }

  console.warn(`[currency] No rate found for ${fromCurrency} -> ${toCurrency}`)
  return 1
}

// ── Event System ──

/**
 * Listen for currency changes
 */
export function onCurrencyChange(callback: (currency: string) => void): () => void {
  const handler = (e: Event) => {
    callback((e as CustomEvent).detail.currency)
  }
  document.addEventListener('currency-changed', handler)
  return () => document.removeEventListener('currency-changed', handler)
}

function _notifyCurrencyChange(): void {
  document.dispatchEvent(
    new CustomEvent('currency-changed', {
      detail: {
        currency: _selectedCurrency,
        info: getSelectedCurrencyInfo(),
      },
    })
  )
}

// ── Caching ──

function _loadCachedRates(): CurrencySettings | null {
  try {
    const raw = localStorage.getItem(RATES_CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw)
    if (Date.now() - cached._timestamp > RATES_CACHE_TTL) return null
    return cached.data
  } catch {
    return null
  }
}

function _saveCachedRates(settings: CurrencySettings): void {
  try {
    localStorage.setItem(
      RATES_CACHE_KEY,
      JSON.stringify({ data: settings, _timestamp: Date.now() })
    )
  } catch {
    // localStorage full or unavailable
  }
}

// ── Helpers ──

function _formatNumber(num: number): string {
  if (_selectedCurrency === 'TRY') {
    const parts = num.toFixed(2).split('.')
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `${intPart},${parts[1]}`
  }
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ── Global Access for Alpine templates ──

declare global {
  interface Window {
    csFormatPrice: typeof formatPrice
    csFormatPriceRange: typeof formatPriceRange
    csFormatCurrency: typeof formatCurrency
  }
}

window.csFormatPrice = formatPrice
window.csFormatPriceRange = formatPriceRange
window.csFormatCurrency = formatCurrency
