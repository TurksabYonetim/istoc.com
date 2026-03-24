/**
 * C6: Category Product Listing — Banner + Grid (Optional — PRO sellers only)
 * Full-width category banner + 4-column detailed product cards with badges
 * BEM Block: category-listing
 */
import type { ProductCategory, DetailedProduct } from '../../types/seller/types';
import { formatPriceRange } from '../../services/currencyService';
import { t } from '../../i18n';

function getBadgeClasses(type: string): string {
  const base = 'inline-flex items-center gap-0.5 text-[11px] rounded-sm px-1.5 py-0.5';
  const map: Record<string, string> = {
    'main-product': 'bg-[#f3f4f6] text-[#374151] dark:bg-gray-700 dark:text-gray-300',
    'fsc-certified': 'bg-[#f0fdf4] text-[#166534] dark:bg-emerald-900 dark:text-emerald-300',
    'certified': 'bg-[#f0fdf4] text-[#166534] dark:bg-emerald-900 dark:text-emerald-300',
    'custom': 'bg-[#eff6ff] text-[#1e40af] dark:bg-blue-900 dark:text-blue-300',
  };
  return `${base} ${map[type] || 'bg-[#f3f4f6] text-[#374151] dark:bg-gray-700 dark:text-gray-300'}`;
}

function formatSoldCount(count: number): string {
  if (count >= 10000) return `${(count / 1000).toFixed(0)}K+`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

function renderProductCard(product: DetailedProduct): string {
  const detailUrl = `/pages/product-detail.html?id=${encodeURIComponent(product.id)}`;
  return `
    <a href="${detailUrl}" class="category-listing__card bg-white dark:bg-gray-800 border-r border-b border-(--card-border-color) dark:border-gray-700 p-4 lg:p-3 flex flex-col hover:shadow-lg dark:hover:shadow-xl transition-shadow duration-300 relative group cursor-pointer">
      <!-- Image -->
      <div class="category-listing__image relative w-full h-[200px] lg:h-[180px] md:h-[160px] flex items-center justify-center mb-3">
        <img src="${product.image}" alt="${product.name}" class="max-h-full max-w-full object-contain group-hover:scale-[1.02] transition-transform" loading="lazy"
             onerror="this.parentElement.style.background='#f3f4f6'" />
        ${product.hasVideo ? `
          <button class="category-listing__play-btn absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 focus:ring-2 focus:ring-white focus:ring-offset-2 active:bg-black/80 flex items-center justify-center transition-colors"
                  aria-label="${t('seller.sf.playProductVideo')}">
            <svg class="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
            </svg>
          </button>
        ` : ''}
      </div>

      <!-- Badges -->
      ${product.badges.length ? `
        <div class="category-listing__badges flex flex-wrap gap-1 mb-2">
          ${product.badges.map(b => `<span class="${getBadgeClasses(b.type)}">${b.label}</span>`).join('')}
        </div>
      ` : ''}

      <!-- Name -->
      <p class="category-listing__name text-[14px] text-[#222222] dark:text-gray-50 font-normal leading-snug line-clamp-2 mb-2">${product.name}</p>

      <!-- Price -->
      <p class="category-listing__price text-[16px] text-[#111827] dark:text-gray-50 font-bold">
        ${formatPriceRange(product.priceMin, product.priceMax, 'USD')}
      </p>

      <!-- MOQ -->
      <p class="category-listing__moq text-[13px] text-[#6b7280] dark:text-gray-400 mt-1">
        ${t('seller.sf.minOrder')} ${product.moq} ${product.moqUnit}
      </p>

      <!-- Sold -->
      <p class="category-listing__sold text-[12px] text-[#9ca3af] dark:text-gray-500 mt-0.5">
        ${formatSoldCount(product.soldCount)} ${t('seller.sf.sold')}
      </p>
    </a>
  `;
}

function renderCategory(category: ProductCategory): string {
  return `
    <section id="category-listing-${category.id}" class="category-listing mb-12">
      <!-- Banner -->
      <div class="category-listing__banner relative w-full overflow-hidden">
        <img src="${category.bannerImage}" alt="${category.name}"
             class="w-full h-[160px] sm:h-[160px] md:h-[200px] xl:h-[300px] object-cover" loading="lazy"
             onerror="this.parentElement.style.background='linear-gradient(135deg,#1e3a5f,var(--color-primary-500))'" />
        <div class="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/20">
          <h3 class="text-[20px] sm:text-[22px] md:text-[28px] xl:text-[40px] font-black text-white uppercase tracking-tight drop-shadow-xl"
              style="text-shadow: 0 2px 12px rgba(0,0,0,0.4);">
            ${category.name}
          </h3>
        </div>
      </div>

      <!-- Product Grid (Shared Border System) -->
      <div class="category-listing__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 border-t border-l border-(--card-border-color) dark:border-gray-700">
        ${category.products.map(p => renderProductCard(p)).join('')}
      </div>
    </section>
  `;
}

export function CategoryProductListing(categories: ProductCategory[]): string {
  if (!categories || !categories.length) return '';

  return `
    <div id="category-listings" aria-label="${t('seller.sf.categoryProductListings')}">
      <div class="max-w-(--container-lg) mx-auto px-[clamp(0.75rem,0.5rem+1vw,1.5rem)] lg:px-6 xl:px-8">
        ${categories.map(cat => renderCategory(cat)).join('')}
      </div>
    </div>
  `;
}
