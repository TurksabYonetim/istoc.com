/**
 * Filter Engine
 * Connects FilterSidebar UI to ProductListingGrid.
 * Uses document-level event delegation to capture filter changes from
 * both desktop sidebar and mobile drawer without requiring custom events.
 */

import type { ProductListingCard } from '../../types/productListing';

/* ── Types ── */

export interface FilterState {
  verified: boolean;
  verifiedPro: boolean;
  minRating: number | null;
  priceMin: number | null;
  priceMax: number | null;
  minOrder: number | null;
  supplierCountries: string[];
}

export type SortKey =
  | 'best-match'
  | 'orders'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'min-order'
  | 'supplier-rating';

export interface FilterEngineOptions {
  /** Source product data */
  products: ProductListingCard[];
  /** Callback when filters/sort produce new results */
  onUpdate: (filtered: ProductListingCard[], count: number) => void;
}

export interface FilterEngine {
  /** Get current filter state */
  getState: () => Readonly<FilterState>;
  /** Get current sort key */
  getSortKey: () => SortKey;
  /** Remove all event listeners */
  destroy: () => void;
}

/* ── Parsing Helpers ── */

/** Parse price string like "$1.80-2.50" and return the minimum price */
function parseMinPrice(priceStr: string): number {
  const match = priceStr.match(/\$?([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

/** Parse MOQ string like "10 adet" or "1000 adet" and return number */
function parseMoq(moqStr: string): number {
  const match = moqStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/** Parse stats string like "4,056 satis" and return number */
function parseSales(stats: string): number {
  return parseInt(stats.replace(/[^0-9]/g, '')) || 0;
}

/* ── Filter Application (AND logic) ── */

function createDefaultState(): FilterState {
  return {
    verified: false,
    verifiedPro: false,
    minRating: null,
    priceMin: null,
    priceMax: null,
    minOrder: null,
    supplierCountries: [],
  };
}

function applyFilters(products: ProductListingCard[], state: FilterState): ProductListingCard[] {
  return products.filter(p => {
    if (state.verified && !p.verified) return false;
    if (state.verifiedPro && (!p.verified || (p.supplierYears ?? 0) < 5)) return false;
    if (state.minRating !== null && (p.rating ?? 0) < state.minRating) return false;

    if (state.priceMin !== null || state.priceMax !== null) {
      const minPrice = parseMinPrice(p.price);
      if (state.priceMin !== null && minPrice < state.priceMin) return false;
      if (state.priceMax !== null && minPrice > state.priceMax) return false;
    }

    if (state.minOrder !== null) {
      const moq = parseMoq(p.moq);
      if (moq > state.minOrder) return false;
    }

    if (state.supplierCountries.length > 0) {
      if (!p.supplierCountry || !state.supplierCountries.includes(p.supplierCountry)) return false;
    }

    return true;
  });
}

/* ── Sorting ── */

function applySorting(products: ProductListingCard[], sortKey: SortKey): ProductListingCard[] {
  const sorted = [...products];

  switch (sortKey) {
    case 'best-match':
      return sorted;
    case 'orders':
      return sorted.sort((a, b) => parseSales(b.stats) - parseSales(a.stats));
    case 'newest':
      return sorted.reverse();
    case 'price-asc':
      return sorted.sort((a, b) => parseMinPrice(a.price) - parseMinPrice(b.price));
    case 'price-desc':
      return sorted.sort((a, b) => parseMinPrice(b.price) - parseMinPrice(a.price));
    case 'min-order':
      return sorted.sort((a, b) => parseMoq(a.moq) - parseMoq(b.moq));
    case 'supplier-rating':
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    default:
      return sorted;
  }
}

/* ── Engine ── */

export function initFilterEngine(options: FilterEngineOptions): FilterEngine {
  const { products, onUpdate } = options;
  const state = createDefaultState();
  let currentSort: SortKey = 'best-match';
  const ac = new AbortController();
  const { signal } = ac;

  function update(): void {
    const filtered = applyFilters(products, state);
    const sorted = applySorting(filtered, currentSort);
    onUpdate(sorted, sorted.length);
  }

  /* ── Checkbox / radio changes via event delegation ── */
  document.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.dataset?.filterSection) return;

    const section = target.dataset.filterSection;
    const value = target.dataset.filterValue ?? target.value;

    switch (section) {
      case 'supplier-features':
        if (value === 'verified') state.verified = target.checked;
        if (value === 'verified-pro') state.verifiedPro = target.checked;
        break;

      case 'store-reviews':
        state.minRating = target.checked ? parseFloat(value) : null;
        break;

      case 'supplier-country':
        if (target.checked) {
          if (!state.supplierCountries.includes(value)) {
            state.supplierCountries.push(value);
          }
        } else {
          state.supplierCountries = state.supplierCountries.filter(c => c !== value);
        }
        break;

      // trade-assurance, product-features, certifications: no matching mock data
    }

    update();
  }, { signal });

  /* ── Price range & min order "OK" buttons ── */
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.dataset?.filterAction !== 'apply') return;

    const section = target.dataset.filterSection;
    if (!section) return;

    if (section === 'price') {
      const minInput = document.querySelector<HTMLInputElement>(
        '[data-filter-section="price"][data-filter-type="min"]'
      );
      const maxInput = document.querySelector<HTMLInputElement>(
        '[data-filter-section="price"][data-filter-type="max"]'
      );
      state.priceMin = minInput?.value ? parseFloat(minInput.value) : null;
      state.priceMax = maxInput?.value ? parseFloat(maxInput.value) : null;
      update();
    }

    if (section === 'min-order') {
      const valueInput = document.querySelector<HTMLInputElement>(
        '[data-filter-section="min-order"][data-filter-type="value"]'
      );
      state.minOrder = valueInput?.value ? parseInt(valueInput.value, 10) : null;
      update();
    }
  }, { signal });

  /* ── Clear All ── */
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.dataset?.filterAction !== 'clear-all') return;

    Object.assign(state, createDefaultState());
    currentSort = 'best-match';
    update();
  }, { signal });

  /* ── Generic filter-change (re-read price/min-order inputs from DOM) ── */
  document.addEventListener('filter-change', () => {
    const priceMin = document.querySelector<HTMLInputElement>('[data-filter-section="price"][data-filter-type="min"]');
    const priceMax = document.querySelector<HTMLInputElement>('[data-filter-section="price"][data-filter-type="max"]');
    state.priceMin = priceMin?.value ? parseFloat(priceMin.value) : null;
    state.priceMax = priceMax?.value ? parseFloat(priceMax.value) : null;

    const moqInput = document.querySelector<HTMLInputElement>('[data-filter-section="min-order"][data-filter-type="value"]');
    state.minOrder = moqInput?.value ? parseInt(moqInput.value, 10) : null;

    update();
  }, { signal });

  /* ── Sorting from SearchHeader ── */
  document.addEventListener('sort-change', ((e: CustomEvent) => {
    currentSort = (e.detail?.value as SortKey) || 'best-match';
    update();
  }) as EventListener, { signal });

  // Initial render
  update();

  return {
    getState: () => ({ ...state }),
    getSortKey: () => currentSort,
    destroy: () => ac.abort(),
  };
}
