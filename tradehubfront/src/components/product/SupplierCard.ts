/**
 * SupplierCard Component
 * Sidebar card showing supplier info, verification, and contact CTA.
 */

import { getCurrentProduct } from '../../alpine/product';
import { t } from '../../i18n';

function verifiedBadge(): string {
  return `
    <svg class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" style="color: var(--pd-supplier-verified-color, #cc9900);">
      <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd"/>
    </svg>
  `;
}

function statRow(icon: string, label: string, value: string): string {
  return `
    <div class="flex items-center gap-2 min-w-0">
      <svg class="h-4 w-4 shrink-0" style="color: var(--pd-shipping-icon-color, #6b7280);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${icon}
      </svg>
      <span class="text-xs truncate" style="color: var(--pd-rating-text-color, #6b7280);">${label}</span>
      <span class="text-xs font-semibold ml-auto shrink-0" style="color: var(--pd-title-color, #111827);">${value}</span>
    </div>
  `;
}

export function SupplierCard(): string {
  const mockProduct = getCurrentProduct();
  const s = mockProduct.supplier;

  return `
    <div class="th-card flex flex-col gap-4 min-w-0 overflow-hidden" style="background: var(--pd-supplier-card-bg, #ffffff);">
      <!-- Company Name -->
      <div class="flex items-start gap-2 min-w-0">
        <div class="h-10 w-10 rounded-md flex items-center justify-center shrink-0" style="background: var(--pd-price-tier-active-bg, #fef9e7);">
          <svg class="h-5 w-5" style="color: var(--pd-supplier-verified-color, #cc9900);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <h3 class="text-sm font-bold truncate" style="color: var(--pd-title-color, #111827);">${s.name}</h3>
            ${s.verified ? verifiedBadge() : ''}
          </div>
          <p class="text-xs mt-0.5" style="color: var(--pd-rating-text-color, #6b7280);">${t('product.servingYears', { count: String(s.yearsInBusiness) })}</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="flex flex-col gap-2.5 py-3" style="border-top: 1px solid var(--pd-spec-border, #e5e5e5); border-bottom: 1px solid var(--pd-spec-border, #e5e5e5);">
        ${statRow(
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>',
          t('product.responseTime'), s.responseTime
        )}
        ${statRow(
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
          t('product.responseRate'), s.responseRate
        )}
        ${statRow(
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>',
          t('product.onTimeDelivery'), s.onTimeDelivery
        )}
      </div>

      <!-- Main Products -->
      <div>
        <p class="text-xs font-medium mb-1.5" style="color: var(--pd-rating-text-color, #6b7280);">${t('product.mainProductsLabel')}</p>
        <div class="flex flex-wrap gap-1.5">
          ${s.mainProducts.slice(0, 3).map(mp => `
            <span class="text-xs px-2 py-1 rounded-md" style="background: var(--pd-price-tier-bg, #f9fafb); color: var(--pd-title-color, #111827);">${mp}</span>
          `).join('')}
        </div>
      </div>

      <!-- Certifications -->
      <div>
        <p class="text-xs font-medium mb-1.5" style="color: var(--pd-rating-text-color, #6b7280);">${t('product.certifications')}</p>
        <div class="flex flex-wrap gap-1.5">
          ${s.certifications.map(cert => `
            <span class="text-xs px-2 py-1 rounded-md font-medium" style="background: var(--pd-trade-assurance-bg, #f0fdf4); color: var(--pd-trade-assurance-text, #15803d);">${cert}</span>
          `).join('')}
        </div>
      </div>

      <!-- CTA Buttons -->
      <div class="flex flex-col gap-2 pt-1">
        <button type="button" class="th-btn w-full text-sm">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          ${t('product.contactUs')}
        </button>
        <a href="#" class="text-center text-xs font-medium hover:underline" style="color: var(--pd-breadcrumb-link-color, #cc9900);">
          ${t('product.viewCompany')} →
        </a>
      </div>
    </div>
  `;
}
