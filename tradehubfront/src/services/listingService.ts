/**
 * Listing Service — connects frontend to Frappe TradeHub backend API
 * Maps Frappe API responses to frontend TypeScript interfaces.
 */

import { api } from '../utils/api'
import {
  convertPrice,
  formatPrice,
  formatPriceRange,
  getSelectedCurrencyInfo,
} from './currencyService'
import type {
  ProductDetail,
  ProductImage,
  PriceTier,
  ProductVariant,
  ProductSpec,
  ShippingInfo,
  SupplierInfo,
  CustomizationOption,
} from '../types/product'
import type { ProductListingCard, SearchHeaderInfo } from '../types/productListing'

// Frappe API response wrapper
interface FrappeResponse<T> {
  message: {
    data: T
    total?: number
    page?: number
    page_size?: number
    total_pages?: number
    has_next?: boolean
    has_prev?: boolean
  }
}

// ── Search Params ──

export interface ListingSearchParams {
  query?: string
  category?: string
  min_price?: number
  max_price?: number
  supplier?: string
  sort_by?: string
  sort_order?: string
  page?: number
  page_size?: number
  is_featured?: boolean
  is_best_seller?: boolean
  is_new_arrival?: boolean
  free_shipping?: boolean
}

export interface ListingSearchResult {
  products: ProductListingCard[]
  searchHeader: SearchHeaderInfo
  hasNext: boolean
  hasPrev: boolean
}

// ── API Endpoints ──

/**
 * Search/filter listings for the product listing page
 */
export async function searchListings(params: ListingSearchParams): Promise<ListingSearchResult> {
  const queryParams = new URLSearchParams()

  if (params.query) queryParams.set('query', params.query)
  if (params.category) queryParams.set('category', params.category)
  if (params.min_price !== undefined) queryParams.set('min_price', String(params.min_price))
  if (params.max_price !== undefined) queryParams.set('max_price', String(params.max_price))
  if (params.supplier) queryParams.set('supplier', params.supplier)
  if (params.sort_by) queryParams.set('sort_by', params.sort_by)
  if (params.sort_order) queryParams.set('sort_order', params.sort_order)
  if (params.page) queryParams.set('page', String(params.page))
  if (params.page_size) queryParams.set('page_size', String(params.page_size))
  if (params.is_featured) queryParams.set('is_featured', '1')
  if (params.is_best_seller) queryParams.set('is_best_seller', '1')
  if (params.is_new_arrival) queryParams.set('is_new_arrival', '1')
  if (params.free_shipping) queryParams.set('free_shipping', '1')

  const qs = queryParams.toString()
  const url = `/method/tradehub_core.api.listing.get_listings${qs ? '?' + qs : ''}`
  const response = await api<FrappeResponse<Record<string, unknown>[]>>(url)
  const msg = response.message

  const products = (msg.data || []).map(mapListingCard)

  const searchHeader: SearchHeaderInfo = {
    keyword: params.query || '',
    totalProducts: msg.total || 0,
    currentPage: msg.page || 1,
    totalPages: msg.total_pages || 1,
    freeShippingAvailable: products.some(p => p.promo?.toLowerCase().includes('shipping')),
    sortOptions: [
      { id: 'relevance', label: 'En İyi Eşleşme', value: 'relevance' },
      { id: 'newest', label: 'En Yeniler', value: 'newest' },
      { id: 'orders', label: 'Siparişler', value: 'orders' },
      { id: 'rating', label: 'Değerlendirme', value: 'rating' },
      { id: 'price_asc', label: 'Fiyat (Düşük → Yüksek)', value: 'price_asc' },
      { id: 'price_desc', label: 'Fiyat (Yüksek → Düşük)', value: 'price_desc' },
    ],
    selectedSort: params.sort_by || 'relevance',
  }

  return {
    products,
    searchHeader,
    hasNext: msg.has_next || false,
    hasPrev: msg.has_prev || false,
  }
}

/**
 * Get listing detail for the product detail page
 */
export async function getListingDetail(listingId: string): Promise<ProductDetail> {
  const response = await api<FrappeResponse<Record<string, unknown>>>(
    `/method/tradehub_core.api.listing.get_listing_detail?listing_id=${encodeURIComponent(listingId)}`
  )
  return mapListingDetail(response.message.data)
}

/**
 * Get related listings for a product
 */
export async function getRelatedListings(listingId: string, limit = 8): Promise<ProductListingCard[]> {
  const response = await api<FrappeResponse<Record<string, unknown>[]>>(
    `/method/tradehub_core.api.listing.get_related_listings?listing_id=${encodeURIComponent(listingId)}&limit=${limit}`
  )
  return (response.message.data || []).map(mapListingCard)
}

/**
 * Get featured listings for homepage
 */
export async function getFeaturedListings(limit = 10): Promise<ProductListingCard[]> {
  const response = await api<FrappeResponse<Record<string, unknown>[]>>(
    `/method/tradehub_core.api.listing.get_featured_listings?limit=${limit}`
  )
  return (response.message.data || []).map(mapListingCard)
}

/**
 * Get categories for filter sidebar
 */
export async function getCategories(parent?: string) {
  const params = parent ? `?parent=${encodeURIComponent(parent)}` : ''
  const response = await api<FrappeResponse<Record<string, unknown>[]>>(
    `/method/tradehub_core.api.listing.get_categories${params}`
  )
  return response.message.data || []
}

/**
 * Get shipping methods for a listing
 */
export async function getShippingMethods(listingId?: string) {
  const params = listingId ? `?listing_id=${encodeURIComponent(listingId)}` : ''
  const response = await api<FrappeResponse<Record<string, unknown>[]>>(
    `/method/tradehub_core.api.listing.get_shipping_methods${params}`
  )
  return response.message.data || []
}

/** Search suggestion item from API */
export interface SearchSuggestion {
  text: string
  type: 'product' | 'category'
}

export interface SearchSuggestionsResult {
  suggestions: SearchSuggestion[]
  chips: SearchSuggestion[]
}

/**
 * Get search suggestions for the search dropdown (trending products + popular categories)
 */
export async function getSearchSuggestions(): Promise<SearchSuggestionsResult> {
  try {
    const response = await api<FrappeResponse<{ suggestions: SearchSuggestion[]; chips: SearchSuggestion[] }>>(
      '/method/tradehub_core.api.listing.get_search_suggestions'
    )
    return response.message.data as unknown as SearchSuggestionsResult
  } catch {
    return { suggestions: [], chips: [] }
  }
}


// ── Price Range Helper ──

function derivePriceRange(
  raw: any,
  priceTiers: PriceTier[],
  variants: ProductVariant[],
  baseCur: string,
): { priceMin?: number; priceMax?: number } {
  // 1. Collect all variant option prices
  const variantPrices: number[] = []
  for (const v of variants) {
    for (const o of v.options) {
      if (o.price && o.price > 0) variantPrices.push(o.price)
    }
  }

  // 2. If variants have prices, use min/max from those
  if (variantPrices.length >= 2) {
    return { priceMin: Math.min(...variantPrices), priceMax: Math.max(...variantPrices) }
  }

  // 3. If price tiers exist, use min/max from tier prices
  if (priceTiers.length >= 2) {
    const tierPrices = priceTiers.map(t => t.price)
    return { priceMin: Math.min(...tierPrices), priceMax: Math.max(...tierPrices) }
  }

  // 4. Fallback: single selling price
  if (raw.sellingPrice) {
    const sp = convertPrice(raw.sellingPrice, baseCur)
    return { priceMin: sp, priceMax: sp }
  }

  return {}
}

// ── Mappers: Frappe response → Frontend TypeScript interfaces ──

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapListingCard(raw: any): ProductListingCard {
  // Currency conversion for price display
  const baseCurrency = raw.baseCurrency || 'USD'

  // Parse min/max prices from pricing tiers or selling price
  let priceDisplay = raw.price || ''
  let originalPriceDisplay = raw.originalPrice || undefined

  if (raw.minPrice !== undefined && raw.maxPrice !== undefined) {
    priceDisplay = formatPriceRange(raw.minPrice, raw.maxPrice, baseCurrency)
  } else if (raw.sellingPrice) {
    priceDisplay = formatPrice(raw.sellingPrice, baseCurrency)
  } else if (typeof raw.price === 'string' && raw.price.startsWith('$')) {
    // Parse "$1.80-2.50" format and convert
    const match = raw.price.match(/\$?([\d.]+)(?:-([\d.]+))?/)
    if (match) {
      const min = parseFloat(match[1])
      const max = match[2] ? parseFloat(match[2]) : min
      priceDisplay = formatPriceRange(min, max, baseCurrency)
      if (raw.originalPrice) {
        const origMatch = raw.originalPrice.match(/\$?([\d.]+)/)
        if (origMatch) {
          originalPriceDisplay = formatPrice(parseFloat(origMatch[1]), baseCurrency)
        }
      }
    }
  }

  return {
    id: raw.id || '',
    name: raw.name || '',
    href: raw.href || `/pages/product-detail.html?id=${raw.id}`,
    price: priceDisplay,
    moq: raw.moq || '1 adet',
    stats: raw.stats || '',
    imageKind: 'jewelry',
    imageSrc: raw.imageSrc || undefined,
    images: undefined,
    promo: raw.promo || raw.sellingPoint || undefined,
    verified: raw.verified,
    supplierYears: raw.supplierYears,
    supplierCountry: raw.supplierCountry,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    originalPrice: originalPriceDisplay,
    discount: raw.discount || undefined,
    supplierName: raw.supplierName || undefined,
    sellingPoint: raw.sellingPoint || undefined,
    category: raw.categoryName || raw.category || undefined,
  }
}

function mapListingDetail(raw: any): ProductDetail {
  // Map images
  const images: ProductImage[] = (raw.images || []).map((src: string, i: number) => ({
    id: `img-${i + 1}`,
    src: src || '',
    alt: `${raw.title || ''} - ${i + 1}`,
    isVideo: false,
  }))

  // Map price tiers with currency conversion
  const baseCur = raw.currency || 'USD'
  const selectedCur = getSelectedCurrencyInfo()
  const priceTiers: PriceTier[] = (raw.priceTiers || []).map((t: any) => ({
    minQty: t.minQty,
    maxQty: t.maxQty,
    price: convertPrice(t.price, baseCur),
    basePrice: t.price,
    currency: selectedCur.code,
  }))

  // Map variants
  const variants: ProductVariant[] = (raw.variants || []).map((v: any) => {
    const nameLower = (v.name || '').toLowerCase()
    let type: 'color' | 'size' | 'material' = 'material'
    if (v.type === 'image' || nameLower.includes('renk') || nameLower.includes('color')) {
      type = 'color'
    } else if (nameLower.includes('boyut') || nameLower.includes('size') || nameLower.includes('uzunlu')) {
      type = 'size'
    }
    return {
      type,
      label: v.name,
      options: (v.options || []).map((o: any, i: number) => ({
        id: o.variantId || `${v.name}-${i}`,
        label: o.label,
        value: o.value,
        thumbnail: o.image || undefined,
        available: o.available !== false,
        rawPrice: o.price || undefined,
        price: o.price ? convertPrice(o.price, baseCur) : undefined,
        priceAddon: o.priceAddon ? convertPrice(o.priceAddon, baseCur) : 0,
        basePriceAddon: o.priceAddon || 0,
      })),
    }
  })

  // Map specs
  const specs: ProductSpec[] = (raw.specs || []).map((s: any) => ({
    key: s.label,
    value: s.value,
  }))

  // Map packaging specs
  const packagingSpecs: ProductSpec[] = (raw.packagingSpecs || []).map((s: any) => ({
    key: s.label,
    value: s.value,
  }))

  // Map shipping with currency conversion
  const shipping: ShippingInfo[] = (raw.shipping || []).map((s: any) => ({
    method: s.method,
    estimatedDays: s.estimatedDays || '',
    cost: typeof s.cost === 'number' ? formatPrice(s.cost, s.currency || baseCur) : String(s.cost || ''),
    baseCost: typeof s.cost === 'number' ? s.cost : 0,
    baseCurrency: s.currency || baseCur,
  }))

  // Map supplier
  const supplier: SupplierInfo = raw.supplier
    ? {
        name: raw.supplier.name || '',
        verified: raw.supplier.verified || false,
        yearsInBusiness: raw.supplier.yearsInBusiness || 0,
        responseTime: raw.supplier.responseTime || '',
        responseRate: raw.supplier.responseRate ? `${raw.supplier.responseRate}%` : '',
        onTimeDelivery: raw.supplier.onTimeDelivery ? `${raw.supplier.onTimeDelivery}%` : '',
        mainProducts: raw.supplier.mainProducts || [],
        employees: raw.supplier.employees || '',
        annualRevenue: raw.supplier.annualRevenue || '',
        certifications: raw.supplier.certifications || [],
      }
    : {
        name: '',
        verified: false,
        yearsInBusiness: 0,
        responseTime: '',
        responseRate: '',
        onTimeDelivery: '',
        mainProducts: [],
        employees: '',
        annualRevenue: '',
        certifications: [],
      }

  // Map customization options
  const customizationOptions: CustomizationOption[] = (raw.customizationOptions || []).map(
    (o: any) => ({
      name: o.name,
      priceAddon: o.additionalCost ? `+${formatPrice(o.additionalCost, baseCur)}/adet` : '',
      minOrder: o.minQty ? `${o.minQty} adet` : '',
    })
  )

  return {
    id: raw.id,
    title: raw.title || '',
    category: raw.category || [],
    images,
    priceTiers,
    ...derivePriceRange(raw, priceTiers, variants, baseCur),
    moq: raw.moq || 1,
    unit: raw.unit || 'adet',
    leadTime: raw.leadTime || '',
    shipping,
    variants,
    specs,
    packagingSpecs,
    description: raw.description || '',
    packaging: packagingSpecs.length > 0
      ? `<table class="w-full text-sm"><tbody>${packagingSpecs.map((s, i) =>
          `<tr style="${i < packagingSpecs.length - 1 ? 'border-bottom: 1px solid var(--pd-spec-border, #e5e5e5);' : ''}">
            <td class="py-2.5 font-medium" style="color: var(--pd-spec-key-color, #6b7280); width: 35%; padding-left: 12px;">${s.key}</td>
            <td class="py-2.5 pl-4" style="color: var(--pd-spec-value-color, #111827);">${s.value}</td>
          </tr>`).join('')}</tbody></table>`
      : '',
    rating: raw.rating || 0,
    reviewCount: raw.reviewCount || 0,
    orderCount: raw.orderCount ? Number(raw.orderCount).toLocaleString('tr-TR') : '0',
    reviews: [],
    samplePrice: raw.samplePrice ? convertPrice(raw.samplePrice, baseCur) : undefined,
    baseSamplePrice: raw.samplePrice || undefined,
    baseCurrency: baseCur,
    supplier,
    faq: [],
    leadTimeRanges: (raw.leadTimeRanges || []).map((r: any) => ({
      quantityRange: r.quantityRange || '',
      days: r.days || '',
    })),
    customizationOptions,
    reviewCategoryRatings: [],
    storeReviewCount: 0,
    reviewMentionTags: [],
  }
}
