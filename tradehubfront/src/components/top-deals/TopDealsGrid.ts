/**
 * TopDealsGrid Component
 * 5-column product grid with lightweight deal cards
 * Matches Alibaba top-deals reference design
 */

import { t } from '../../i18n';
import { formatPrice } from '../../utils/currency';
import type { TopDealsProduct } from '../../data/mockTopDeals';
import type { ProductImageKind } from '../../types/productListing';

const categoryImages: Record<ProductImageKind, string[]> = {
  jewelry: [
    'https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop&q=80',
  ],
  electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop&q=80',
  ],
  label: [
    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568702846914-96b305d2ead1?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&h=400&fit=crop&q=80',
  ],
  crafts: [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800c?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1452860606245-08f97f4c8657?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595436810223-7dbab2f3bc56?w=400&h=400&fit=crop&q=80',
  ],
  accessory: [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1622560480654-d96214fddae9?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1473188588951-1003bbe4a275?w=400&h=400&fit=crop&q=80',
  ],
  clothing: [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cda3f96?w=400&h=400&fit=crop&q=80',
  ],
  tools: [
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=400&h=400&fit=crop&q=80',
  ],
  packaging: [
    'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=400&h=400&fit=crop&q=80',
  ],
};

function getProductImage(product: TopDealsProduct): string {
  const urls = categoryImages[product.imageKind];
  if (!urls || urls.length === 0) return '';
  const hash = product.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return urls[hash % urls.length];
}

export function renderTopDealCard(product: TopDealsProduct): string {
  const imgSrc = getProductImage(product);

  // Badge — "Match" green badge on image
  let badgeHtml = '';
  if (product.dealBadge === 'match') {
    badgeHtml = `<span class="inline-flex items-center rounded text-[11px] font-bold leading-none text-white px-1.5 py-0.5 mr-1" style="background-color: #16a34a;" data-i18n="topDealsPage.badgeMatch">${t('topDealsPage.badgeMatch')}</span>`;
  } else if (product.dealBadge === 'top-pick') {
    badgeHtml = `<span class="inline-flex items-center rounded text-[11px] font-bold leading-none text-white px-1.5 py-0.5 mr-1" style="background-color: #DE0505;">Top Pick</span>`;
  }

  // Discount line with fire icon
  let discountLineHtml = '';
  if (product.discountPercent) {
    let label = '';
    if (product.discountLabel === 'lowest') {
      label = t('topDealsPage.lowestPrices');
    } else if (product.discountLabel === 'lower') {
      label = t('topDealsPage.lowerPriced');
    } else {
      label = t('topDealsPage.offPercent', { percent: String(product.discountPercent) });
    }
    discountLineHtml = `
      <div class="flex items-center gap-1 mt-0.5">
        <svg class="w-3 h-3 flex-shrink-0 text-red-500" viewBox="0 0 12 12" fill="currentColor"><path d="M6 0L7.8 4.2L12 4.9L9 7.8L9.7 12L6 10.1L2.3 12L3 7.8L0 4.9L4.2 4.2L6 0Z"/></svg>
        <span class="text-xs font-medium text-red-500">${label}</span>
      </div>
    `;
  }

  // Sold count
  let soldHtml = '';
  if (product.soldCount) {
    soldHtml = `<span class="text-xs text-[#999]">${product.soldCount} sold</span>`;
  }

  // Feature tags — small gray pills at bottom
  let tagsHtml = '';
  if (product.featureTags && product.featureTags.length > 0) {
    tagsHtml = `
      <div class="flex flex-wrap gap-1 mt-2 overflow-hidden max-h-[20px]">
        ${product.featureTags.map(tag => `<span class="inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] text-[#999] bg-[#f5f5f5] whitespace-nowrap">${tag}</span>`).join('')}
      </div>
    `;
  }

  return `
    <a href="${product.href}" class="group/deal flex flex-col">
      <!-- Image -->
      <div class="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-100">
        <img
          src="${imgSrc}"
          alt="${product.name}"
          loading="lazy"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Content -->
      <div class="pt-2">
        <!-- Badge + Product name (inline) -->
        <h3 class="text-sm font-normal text-[#333] line-clamp-2 leading-[1.4]">${badgeHtml}${product.name}</h3>

        <!-- Price + MOQ (same line) -->
        <div class="flex items-baseline gap-1.5 mt-1.5">
          <span class="text-xl font-bold text-[#222]">${formatPrice(product.price)}</span>
          <span class="text-xs text-[#999]">MOQ: ${product.moq.replace(/\s*pcs$/i, '')}</span>
        </div>

        <!-- Sold count -->
        ${soldHtml ? `<div class="mt-0.5">${soldHtml}</div>` : ''}

        <!-- Discount info -->
        ${discountLineHtml}

        <!-- Feature tags -->
        ${tagsHtml}
      </div>
    </a>
  `;
}

export function TopDealsGrid(): string {
  return `
    <section class="mt-4" aria-label="Top deals products">
      <div
        id="top-deals-grid"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5"
        role="list"
        aria-label="Deal products"
      >
        <template x-for="product in visibleProducts" :key="product.id">
          <div role="listitem" x-html="renderCard(product)"></div>
        </template>
      </div>

      <!-- Load more button -->
      <div class="flex justify-center mt-8" x-show="visibleCount < filteredProducts.length">
        <button
          type="button"
          class="px-8 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          @click="loadMore()"
          data-i18n="topDealsPage.loadMore"
        >${t('topDealsPage.loadMore')}</button>
      </div>
    </section>
  `;
}
