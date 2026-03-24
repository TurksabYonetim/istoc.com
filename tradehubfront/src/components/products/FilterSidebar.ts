import { getCurrencySymbol } from '../../utils/currency';

/**
 * FilterSidebar Component (Alibaba-style Filter Panel)
 * Left sidebar filter panel with:
 * - Trade Assurance checkbox
 * - Supplier features (Verified Supplier, Verified PRO)
 * - Store reviews (radio buttons)
 * - Product features (Paid samples)
 * - Categories (collapsible list)
 * - Price range (min/max inputs)
 * - Min. order (input)
 * - Supplier country/region (searchable checkboxes)
 * - Management certifications (searchable checkboxes)
 * - Product certifications (searchable checkboxes)
 */

import type {
  FilterSection,
  CheckboxFilterSection,
  RadioFilterSection,
  PriceRangeFilterSection,
  MinOrderFilterSection,
  CategoryFilterSection,
  SearchableCheckboxFilterSection,
  FilterOption,
  StoreReviewFilter,
  CategoryItem,
} from '../../types/productListing';

/**
 * SVG Icons for filter UI elements
 */
const icons = {
  chevronDown: `<svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M19 9l-7 7-7-7" />
  </svg>`,
  chevronRight: `<svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M9 5l7 7-7 7" />
  </svg>`,
  search: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>`,
  check: `<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
  </svg>`,
  shield: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>`,
  star: `<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>`,
  starEmpty: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>`,
  certBadge: `<svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" style="color: #6b7280;">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
  </svg>`,
};

/**
 * Default filter sections configuration
 */
const defaultFilterSections: FilterSection[] = [
  {
    id: 'trade-assurance',
    title: 'Trade Assurance',
    type: 'checkbox',
    collapsible: false,
    options: [
      {
        id: 'trade-assurance-enabled',
        label: 'Trade Assurance',
        value: 'trade-assurance',
        checked: false,
      },
    ],
  } as CheckboxFilterSection,
  {
    id: 'supplier-features',
    title: 'Supplier features',
    type: 'checkbox',
    collapsible: true,
    collapsed: false,
    options: [
      {
        id: 'verified-supplier',
        label: 'Verified Supplier',
        value: 'verified',
        checked: false,
      },
      {
        id: 'verified-pro',
        label: 'Verified PRO Supplier',
        value: 'verified-pro',
        checked: false,
      },
    ],
  } as CheckboxFilterSection,
  {
    id: 'store-reviews',
    title: 'Store reviews',
    type: 'radio',
    collapsible: true,
    collapsed: false,
    options: [
      { id: 'review-4', label: '4.0 & up', minRating: 4.0, selected: false },
      { id: 'review-4.5', label: '4.5 & up', minRating: 4.5, selected: false },
      { id: 'review-5', label: '5.0', minRating: 5.0, selected: false },
    ],
  } as RadioFilterSection,
  {
    id: 'product-features',
    title: 'Product features',
    type: 'checkbox',
    collapsible: true,
    collapsed: false,
    options: [
      {
        id: 'paid-samples',
        label: 'Paid samples',
        value: 'paid-samples',
        checked: false,
      },
    ],
  } as CheckboxFilterSection,
  {
    id: 'categories',
    title: 'Categories',
    type: 'category',
    collapsible: true,
    collapsed: false,
    items: [
      { id: 'cat-1', name: 'Laptop Backpacks', count: 1250 },
      { id: 'cat-2', name: 'Travel Bags', count: 890 },
      { id: 'cat-3', name: 'Casual Sports Backpacks', count: 720 },
      { id: 'cat-4', name: 'School Bags', count: 650 },
      { id: 'cat-5', name: 'Business Bags', count: 480 },
      { id: 'cat-6', name: 'Hiking Backpacks', count: 320 },
    ],
    showMore: true,
    maxVisible: 5,
  } as CategoryFilterSection,
  {
    id: 'price',
    title: 'Price',
    type: 'price-range',
    collapsible: true,
    collapsed: false,
    filter: {
      min: undefined,
      max: undefined,
      currency: getCurrencySymbol(),
    },
  } as PriceRangeFilterSection,
  {
    id: 'min-order',
    title: 'Min. order',
    type: 'min-order',
    collapsible: true,
    collapsed: false,
    filter: {
      value: undefined,
      unit: 'pieces',
    },
  } as MinOrderFilterSection,
  {
    id: 'supplier-country',
    title: 'Supplier country/region',
    type: 'searchable-checkbox',
    collapsible: true,
    collapsed: false,
    searchPlaceholder: 'Search country',
    options: [
      { id: 'country-bd', label: 'Bangladesh', value: 'BD', count: 245 },
      { id: 'country-cn', label: 'China', value: 'CN', count: 12500 },
      { id: 'country-de', label: 'Germany', value: 'DE', count: 180 },
      { id: 'country-in', label: 'India', value: 'IN', count: 890 },
      { id: 'country-tr', label: 'Turkey', value: 'TR', count: 420 },
      { id: 'country-vn', label: 'Vietnam', value: 'VN', count: 560 },
    ],
  } as SearchableCheckboxFilterSection,
  {
    id: 'management-certifications',
    title: 'Management certifications',
    type: 'searchable-checkbox',
    collapsible: true,
    collapsed: false,
    searchPlaceholder: 'Search',
    options: [
      { id: 'cert-iso9001', label: 'ISO 9001', value: 'ISO9001', count: 4520 },
      { id: 'cert-iso14001', label: 'ISO 14001', value: 'ISO14001', count: 2180 },
      { id: 'cert-iecq', label: 'IECQ QC080000', value: 'IECQ', count: 1120 },
      { id: 'cert-bsci', label: 'BSCI', value: 'BSCI', count: 1650 },
      { id: 'cert-sedex', label: 'SEDEX', value: 'SEDEX', count: 980 },
      { id: 'cert-sa8000', label: 'SA8000', value: 'SA8000', count: 720 },
    ],
  } as SearchableCheckboxFilterSection,
  {
    id: 'product-certifications',
    title: 'Product certifications',
    type: 'searchable-checkbox',
    collapsible: true,
    collapsed: false,
    searchPlaceholder: 'Search',
    options: [
      { id: 'pcert-ce', label: 'CE', value: 'CE', count: 8900 },
      { id: 'pcert-rohs', label: 'ROHS', value: 'ROHS', count: 5420 },
      { id: 'pcert-ip68', label: 'IP68', value: 'IP68', count: 1890 },
      { id: 'pcert-fcc', label: 'FCC', value: 'FCC', count: 3180 },
      { id: 'pcert-ul', label: 'UL', value: 'UL', count: 2450 },
      { id: 'pcert-gots', label: 'GOTS', value: 'GOTS', count: 890 },
    ],
  } as SearchableCheckboxFilterSection,
];

/**
 * Renders a checkbox input
 */
function renderCheckbox(option: FilterOption, sectionId: string, idPrefix = ''): string {
  const checkboxId = `filter-${idPrefix ? idPrefix + '-' : ''}${sectionId}-${option.id}`;
  return `
    <label
      for="${checkboxId}"
      class="flex items-center gap-2 cursor-pointer group py-1"
    >
      <div class="relative flex items-center justify-center w-4 h-4">
        <input
          type="checkbox"
          id="${checkboxId}"
          name="${sectionId}"
          value="${option.value}"
          ${option.checked ? 'checked' : ''}
          class="peer sr-only"
          data-filter-section="${sectionId}"
          data-filter-value="${option.value}"
          @change="$dispatch('filter-change')"
        />
        <div
          class="absolute inset-0 border rounded transition-colors duration-150
                 peer-checked:bg-primary-500 peer-checked:border-primary-500
                 peer-focus:ring-2 peer-focus:ring-primary-200"
          style="border-color: var(--filter-checkbox-border, #d1d5db);"
        ></div>
        <span class="relative z-10 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150">
          ${icons.check}
        </span>
      </div>
      <span
        class="text-[13px] leading-tight group-hover:text-primary-600 transition-colors duration-150"
        style="color: var(--filter-text-color, #374151);"
      >${option.label}</span>
      ${option.count !== undefined ? `
        <span
          class="text-[11px] ml-auto"
          style="color: var(--filter-count-color, #9ca3af);"
        >(${option.count.toLocaleString()})</span>
      ` : ''}
    </label>
  `;
}

/**
 * Renders a radio button for store reviews
 */
function renderRadioOption(option: StoreReviewFilter, sectionId: string, idPrefix = ''): string {
  const radioId = `filter-${idPrefix ? idPrefix + '-' : ''}${sectionId}-${option.id}`;
  const stars = Math.floor(option.minRating);
  const hasHalf = option.minRating % 1 !== 0;

  return `
    <label
      for="${radioId}"
      class="flex items-center gap-2 cursor-pointer group py-1"
    >
      <div class="relative flex items-center justify-center w-4 h-4">
        <input
          type="radio"
          id="${radioId}"
          name="${sectionId}"
          value="${option.minRating}"
          ${option.selected ? 'checked' : ''}
          class="peer sr-only"
          data-filter-section="${sectionId}"
          data-filter-value="${option.minRating}"
          @click="handleRadioClick($event)"
        />
        <div
          class="absolute inset-0 border rounded-full transition-colors duration-150
                 peer-checked:border-primary-500"
          style="border-color: var(--filter-checkbox-border, #d1d5db);"
        ></div>
        <div class="w-2 h-2 rounded-full bg-primary-500 opacity-0 peer-checked:opacity-100 transition-opacity duration-150"></div>
      </div>
      <div class="flex items-center gap-1" style="color: var(--color-cta-primary, #cc9900);">
        ${Array.from({ length: stars }, () => icons.star).join('')}
        ${hasHalf ? icons.starEmpty : ''}
      </div>
      <span
        class="text-[13px] leading-tight group-hover:text-primary-600 transition-colors duration-150"
        style="color: var(--filter-text-color, #374151);"
      >${option.label}</span>
    </label>
  `;
}

/**
 * Renders a category item
 */
function renderCategoryItem(item: CategoryItem): string {
  return `
    <li>
      <a
        href="#"
        class="flex items-center justify-between py-1.5 text-[13px] hover:text-primary-600 transition-colors duration-150"
        style="color: var(--filter-text-color, #374151);"
        data-category-id="${item.id}"
      >
        <span>${item.name}</span>
        ${item.count !== undefined ? `
          <span
            class="text-[11px]"
            style="color: var(--filter-count-color, #9ca3af);"
          >(${item.count.toLocaleString()})</span>
        ` : ''}
      </a>
    </li>
  `;
}

/**
 * Renders the price range filter
 */
function renderPriceRange(section: PriceRangeFilterSection): string {
  return `
    <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-center gap-2 mt-2">
      <input
        type="number"
        placeholder="Min"
        min="0"
        class="w-full min-w-0 px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
        style="border-color: var(--filter-input-border, #d1d5db); color: var(--filter-text-color, #374151);"
        data-filter-section="${section.id}"
        data-filter-type="min"
      />
      <span class="text-gray-400">-</span>
      <input
        type="number"
        placeholder="Max"
        min="0"
        class="w-full min-w-0 px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
        style="border-color: var(--filter-input-border, #d1d5db); color: var(--filter-text-color, #374151);"
        data-filter-section="${section.id}"
        data-filter-type="max"
      />
      <button
        type="button"
        class="th-btn th-btn-sm whitespace-nowrap"
        data-filter-section="${section.id}"
        data-filter-action="apply"
        @click="$dispatch('filter-change')"
      >OK</button>
    </div>
  `;
}

/**
 * Renders the min order filter
 */
function renderMinOrder(section: MinOrderFilterSection): string {
  return `
    <div class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 mt-2">
      <input
        type="number"
        placeholder="Quantity"
        min="1"
        class="w-full min-w-0 px-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
        style="border-color: var(--filter-input-border, #d1d5db); color: var(--filter-text-color, #374151);"
        data-filter-section="${section.id}"
        data-filter-type="value"
      />
      <span
        class="text-[12px] whitespace-nowrap"
        style="color: var(--filter-text-color, #6b7280);"
      >${section.filter.unit}</span>
      <button
        type="button"
        class="th-btn th-btn-sm whitespace-nowrap"
        data-filter-section="${section.id}"
        data-filter-action="apply"
        @click="$dispatch('filter-change')"
      >OK</button>
    </div>
  `;
}

/**
 * Renders a searchable checkbox section
 */
function renderSearchableCheckbox(section: SearchableCheckboxFilterSection, idPrefix = ''): string {
  const isCertSection = section.id === 'management-certifications' || section.id === 'product-certifications';

  return `
    <div class="space-y-2">
      <!-- Search input -->
      <div class="relative mt-2">
        <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none" style="color: var(--filter-search-icon, #9ca3af);">
          ${icons.search}
        </div>
        <input
          type="text"
          placeholder="${section.searchPlaceholder || 'Search...'}"
          class="w-full pl-8 pr-3 py-1.5 text-[13px] border rounded focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
          style="border-color: var(--filter-input-border, #d1d5db); color: var(--filter-text-color, #374151);"
          data-filter-section="${section.id}"
          data-filter-type="search"
          @input="handleSearchInput($event)"
        />
      </div>
      <!-- Options list -->
      <div class="space-y-0.5 max-h-[180px] overflow-y-auto">
        ${section.options.map(opt => isCertSection
          ? renderCertCheckbox(opt, section.id, idPrefix)
          : renderCheckbox(opt, section.id, idPrefix)
        ).join('')}
      </div>
      ${isCertSection ? renderCertDisclaimer() : ''}
    </div>
  `;
}

/**
 * Renders a certification checkbox with badge icon
 */
function renderCertCheckbox(option: FilterOption, sectionId: string, idPrefix = ''): string {
  const checkboxId = `filter-${idPrefix ? idPrefix + '-' : ''}${sectionId}-${option.id}`;
  return `
    <label
      for="${checkboxId}"
      class="flex items-center gap-2 cursor-pointer group py-1"
    >
      <div class="relative flex items-center justify-center w-4 h-4">
        <input
          type="checkbox"
          id="${checkboxId}"
          name="${sectionId}"
          value="${option.value}"
          ${option.checked ? 'checked' : ''}
          class="peer sr-only"
          data-filter-section="${sectionId}"
          data-filter-value="${option.value}"
          @change="$dispatch('filter-change')"
        />
        <div
          class="absolute inset-0 border rounded transition-colors duration-150
                 peer-checked:bg-primary-500 peer-checked:border-primary-500
                 peer-focus:ring-2 peer-focus:ring-primary-200"
          style="border-color: var(--filter-checkbox-border, #d1d5db);"
        ></div>
        <span class="relative z-10 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150">
          ${icons.check}
        </span>
      </div>
      ${icons.certBadge}
      <span
        class="text-[13px] leading-tight group-hover:text-primary-600 transition-colors duration-150"
        style="color: var(--filter-text-color, #374151);"
      >${option.label}</span>
    </label>
  `;
}

/**
 * Renders the certification disclaimer text
 */
function renderCertDisclaimer(): string {
  return `
    <div class="mt-2 pt-2 border-t" style="border-color: var(--filter-divider-color, #e5e7eb);">
      <p class="text-[10px] leading-relaxed" style="color: var(--filter-count-color, #9ca3af);">
        *Certification Disclaimer: Any assessment, certification, inspection and/or related examination related to any authenticity of certificates are provided or conducted by independent third parties with no involvement from iSTOC.
      </p>
      <a
        href="#"
        class="inline-block mt-1 text-[12px] font-medium text-gray-700 hover:text-primary-600 hover:underline transition-colors dark:text-gray-300"
      >Learn More</a>
    </div>
  `;
}

/**
 * Renders a collapsible section header
 */
function renderSectionHeader(section: FilterSection): string {
  const isCollapsible = section.collapsible !== false;
  const isCollapsed = section.collapsed === true;

  return `
    <div
      class="flex items-center justify-between py-2 ${isCollapsible ? 'cursor-pointer group' : ''}"
      ${isCollapsible ? `@click="toggleSection('${section.id}')"` : ''}
    >
      <h3
        class="text-[13px] font-semibold uppercase tracking-wide"
        style="color: var(--filter-heading-color, #111827);"
      >${section.title}</h3>
      ${isCollapsible ? `
        <span
          class="transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}"
          :class="{ 'rotate-180': !collapsed['${section.id}'] }"
          style="color: var(--filter-chevron-color, #6b7280);"
          data-filter-chevron="${section.id}"
        >
          ${icons.chevronDown}
        </span>
      ` : ''}
    </div>
  `;
}

/**
 * Renders the content of a filter section based on its type
 */
function renderSectionContent(section: FilterSection, idPrefix = ''): string {
  switch (section.type) {
    case 'checkbox': {
      const checkboxSection = section as CheckboxFilterSection;
      return `
        <div class="space-y-0.5">
          ${checkboxSection.options.map(opt => renderCheckbox(opt, section.id, idPrefix)).join('')}
        </div>
      `;
    }
    case 'radio': {
      const radioSection = section as RadioFilterSection;
      return `
        <div class="space-y-0.5">
          ${radioSection.options.map(opt => renderRadioOption(opt, section.id, idPrefix)).join('')}
        </div>
      `;
    }
    case 'category': {
      const categorySection = section as CategoryFilterSection;
      const maxVisible = categorySection.maxVisible || 5;
      const visibleItems = categorySection.items.slice(0, maxVisible);
      const hasMore = categorySection.items.length > maxVisible;

      return `
        <ul class="space-y-0.5">
          ${visibleItems.map(item => renderCategoryItem(item)).join('')}
        </ul>
        ${hasMore && categorySection.showMore ? `
          <button
            type="button"
            class="mt-2 text-[12px] text-primary-500 hover:text-primary-600 hover:underline transition-colors duration-150"
            data-filter-section="${section.id}"
            data-filter-action="show-more"
          >View more</button>
        ` : ''}
      `;
    }
    case 'price-range':
      return renderPriceRange(section as PriceRangeFilterSection);
    case 'min-order':
      return renderMinOrder(section as MinOrderFilterSection);
    case 'searchable-checkbox':
      return renderSearchableCheckbox(section as SearchableCheckboxFilterSection, idPrefix);
    default:
      return '';
  }
}

/**
 * Renders a complete filter section
 */
function renderFilterSection(section: FilterSection, idPrefix = ''): string {
  const isCollapsed = section.collapsed === true;

  return `
    <div
      class="border-b py-3"
      style="border-color: var(--filter-divider-color, #e5e7eb);"
      data-filter-section-wrapper="${section.id}"
    >
      ${renderSectionHeader(section)}
      <div
        class="overflow-hidden transition-all duration-200 ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'}"
        :class="collapsed['${section.id}'] ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'"
        data-filter-content="${section.id}"
      >
        ${renderSectionContent(section, idPrefix)}
      </div>
    </div>
  `;
}

/**
 * Renders the Trade Assurance section with shield icon
 */
function renderTradeAssuranceSection(idPrefix = ''): string {
  const taId = `filter-${idPrefix ? idPrefix + '-' : ''}trade-assurance`;
  return `
    <div
      class="border-b py-3"
      style="border-color: var(--filter-divider-color, #e5e7eb);"
    >
      <label
        for="${taId}"
        class="flex items-center gap-2 cursor-pointer group"
      >
        <div class="relative flex items-center justify-center w-4 h-4">
          <input
            type="checkbox"
            id="${taId}"
            name="trade-assurance"
            value="trade-assurance"
            class="peer sr-only"
            data-filter-section="trade-assurance"
            data-filter-value="enabled"
            @change="$dispatch('filter-change')"
          />
          <div
            class="absolute inset-0 border rounded transition-colors duration-150
                   peer-checked:bg-primary-500 peer-checked:border-primary-500
                   peer-focus:ring-2 peer-focus:ring-primary-200"
            style="border-color: var(--filter-checkbox-border, #d1d5db);"
          ></div>
          <span class="relative z-10 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150">
            ${icons.check}
          </span>
        </div>
        <span class="text-primary-500">${icons.shield}</span>
        <span
          class="text-[13px] font-semibold group-hover:text-primary-600 transition-colors duration-150"
          style="color: var(--filter-heading-color, #111827);"
        >Trade Assurance</span>
      </label>
    </div>
  `;
}

/**
 * FilterSidebar Component
 * Renders the complete filter sidebar with all filter sections
 */
export function FilterSidebar(sections?: FilterSection[], idPrefix = ''): string {
  const filterSections = sections || defaultFilterSections;

  // Separate Trade Assurance from other sections
  const tradeAssurance = filterSections.find(s => s.id === 'trade-assurance');
  const otherSections = filterSections.filter(s => s.id !== 'trade-assurance');

  // Build initial collapsed state for Alpine (sections with collapsed: true)
  const collapsedEntries = otherSections
    .filter(s => s.collapsible !== false && s.collapsed === true)
    .map(s => `'${s.id}': true`);
  const xDataArg = collapsedEntries.length > 0
    ? `filterSidebar({${collapsedEntries.join(', ')}})`
    : 'filterSidebar';

  return `
    <aside
      class="w-full lg:w-60 xl:w-64 flex-shrink-0"
      aria-label="Product filters"
      x-data="${xDataArg}"
    >
      <div
        class="sticky top-[120px] p-4 rounded-md border"
        style="background: var(--filter-bg, #ffffff); border-color: var(--filter-border-color, #e5e7eb);"
      >
        <!-- Header -->
        <h2
          class="text-[15px] font-bold mb-2"
          style="color: var(--filter-heading-color, #111827);"
        >Filters</h2>

        <!-- Trade Assurance (special section with icon) -->
        ${tradeAssurance ? renderTradeAssuranceSection(idPrefix) : ''}

        <!-- Other filter sections -->
        ${otherSections.map(section => renderFilterSection(section, idPrefix)).join('')}

        <!-- Clear All Filters Button -->
        <button
          type="button"
          class="w-full mt-4 py-2 text-[13px] font-medium border rounded hover:bg-gray-50 transition-colors duration-150"
          style="border-color: var(--filter-input-border, #d1d5db); color: var(--filter-text-color, #374151);"
          data-filter-action="clear-all"
          @click="clearAllFilters()"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  `;
}

/**
 * Initialize filter sidebar interactions
 * No-op — Alpine.js handles all filter interactions via x-data="filterSidebar"
 */
export function initFilterSidebar(): void {
  // Alpine.js handles section toggle, checkbox change, radio click,
  // price apply, search input, and clear all via directives
}

/**
 * Get default filter sections for use by other components
 */
export function getDefaultFilterSections(): FilterSection[] {
  return defaultFilterSections;
}
