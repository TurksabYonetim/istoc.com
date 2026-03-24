/**
 * ProductTabs Component
 * Flowbite-based tabbed content: Description, Reviews, Company, FAQ.
 */

import { AttributesTabContent } from './AttributesTabContent';
import { ProductReviews } from './ProductReviews';
import { CompanyProfile } from './CompanyProfile';
import { ProductDescription } from './ProductDescription';
import { t } from '../../i18n';

interface TabConfig {
  id: string;
  label: string;
  i18nKey: string;
  content: () => string;
}

const tabs: TabConfig[] = [
  { id: 'attributes', label: t('product.attributes'), i18nKey: 'product.attributes', content: AttributesTabContent },
  { id: 'reviews', label: t('product.reviews'), i18nKey: 'product.reviews', content: ProductReviews },
  { id: 'company', label: t('product.supplier'), i18nKey: 'product.supplier', content: CompanyProfile },
  { id: 'description', label: t('product.description'), i18nKey: 'product.description', content: ProductDescription },
];

export function ProductTabs(): string {
  return `
    <section id="product-tabs-section" x-data="{ activeTab: 'attributes' }" class="py-6" style="background: var(--pd-bg, #ffffff);">
      <!-- Tab Navigation -->
      <div
        id="product-tabs-nav"
        class="flex gap-0 overflow-x-auto scrollbar-hide"
        style="border-bottom: 2px solid var(--pd-spec-border, #e5e5e5);"
        role="tablist"
      >
        ${tabs.map((tab) => `
          <button
            type="button"
            id="tab-btn-${tab.id}"
            class="product-tab-btn whitespace-nowrap px-5 py-3 text-sm font-medium transition-colors relative"
            :style="activeTab === '${tab.id}' ? 'color: var(--pd-tab-active-color, #cc9900)' : 'color: var(--pd-tab-color, #6b7280)'"
            role="tab"
            :aria-selected="(activeTab === '${tab.id}').toString()"
            aria-controls="tab-content-${tab.id}"
            @click="activeTab = '${tab.id}'"
          >
            <span data-i18n="${tab.i18nKey}">${tab.label}</span>
            <span
              class="absolute bottom-0 left-0 right-0 h-0.5 transition-all"
              :style="activeTab === '${tab.id}' ? 'background: var(--pd-tab-active-border, #cc9900)' : 'background: transparent'"
            ></span>
          </button>
        `).join('')}
      </div>

      <!-- Tab Content Panels -->
      ${tabs.map((tab, i) => `
        <div
          id="tab-content-${tab.id}"
          class="product-tab-panel"
          role="tabpanel"
          aria-labelledby="tab-btn-${tab.id}"
          x-show="activeTab === '${tab.id}'"
          ${i !== 0 ? 'x-cloak' : ''}
        >
          ${tab.content()}
        </div>
      `).join('')}
    </section>
  `;
}

export function initProductTabs(): void {
  // Tab switching is now handled by Alpine.js (x-data, @click, x-show)
  // Only the IntersectionObserver sticky logic remains as vanilla JS

  // Sticky tab bar on scroll
  const tabNav = document.getElementById('product-tabs-nav');
  const tabSection = document.getElementById('product-tabs-section');
  if (tabNav && tabSection) {
    const header = document.getElementById('sticky-header');
    const headerHeight = header ? header.offsetHeight : 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          tabNav.style.position = 'sticky';
          tabNav.style.top = `${headerHeight}px`;
          tabNav.style.zIndex = '20';
          tabNav.style.background = 'var(--pd-bg, #ffffff)';
        } else {
          tabNav.style.position = '';
          tabNav.style.top = '';
          tabNav.style.zIndex = '';
          tabNav.style.background = '';
        }
      },
      { rootMargin: `-${headerHeight}px 0px 0px 0px`, threshold: 1 }
    );
    observer.observe(tabSection);
  }
}
