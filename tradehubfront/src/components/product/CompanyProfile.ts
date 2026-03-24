/**
 * CompanyProfile Component
 * Alibaba "Know Your Supplier" design: hero banner, stat counters,
 * company details table, factory capabilities, certifications.
 */

import { getCurrentProduct } from '../../alpine/product';
import { t } from '../../i18n';

export function CompanyProfile(): string {
  const mockProduct = getCurrentProduct();
  const s = mockProduct.supplier;

  return `
    <div class="py-6 max-[374px]:py-4">
      <!-- 1. Hero Banner -->
      <div class="flex items-center justify-between gap-5 mb-6 p-6 rounded-lg border max-sm:flex-col max-sm:items-start max-[374px]:p-3.5 max-[374px]:gap-3 max-[374px]:mb-4" style="background: linear-gradient(135deg, var(--pd-spec-header-bg, #f9fafb) 0%, #fff 100%); border-color: var(--pd-spec-border, #e5e5e5);">
        <div>
          <div class="flex items-center gap-2 text-xl font-bold max-[374px]:text-base max-[374px]:gap-1.5" style="color: var(--pd-title-color, #111827);">
            ${s.name}
            ${s.verified ? `
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style="color: var(--pd-supplier-verified-color, #cc9900);">
                <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd"/>
              </svg>
            ` : ''}
          </div>
          <p class="text-[13px] mt-1" style="color: var(--pd-rating-text-color, #6b7280);">Verified Multispecialty Supplier &middot; ${t('product.servingYears', { count: String(s.yearsInBusiness) })} &middot; \u{1F1F9}\u{1F1F7} TR</p>
        </div>
        <button type="button" class="px-6 py-2.5 rounded-[20px] border text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors hover:bg-(--pd-spec-header-bg,#f9fafb) max-[374px]:px-4 max-[374px]:py-2 max-[374px]:text-[13px] max-[374px]:w-full max-[374px]:text-center" style="border-color: var(--pd-title-color, #111827); background: var(--color-surface, #ffffff); color: var(--pd-title-color, #111827);">${t('product.contactUs')}</button>
      </div>

      <!-- 2. Stat Counters -->
      <div class="grid grid-cols-3 gap-4 mb-6 max-sm:grid-cols-1 max-[374px]:gap-2 max-[374px]:mb-4">
        <div class="flex flex-col items-center text-center p-4 rounded-lg border max-[374px]:p-3 max-[374px]:flex-row max-[374px]:gap-2 max-[374px]:text-left" style="border-color: var(--pd-spec-border, #e5e5e5); background: var(--color-surface, #ffffff);">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--pd-rating-text-color, #6b7280); margin-bottom: 6px;">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span class="text-xl font-extrabold" style="color: var(--pd-title-color, #111827);">${s.responseTime}</span>
          <span class="text-xs mt-1" style="color: var(--pd-rating-text-color, #6b7280);">${t('product.responseTime')}</span>
        </div>
        <div class="flex flex-col items-center text-center p-4 rounded-lg border max-[374px]:p-3 max-[374px]:flex-row max-[374px]:gap-2 max-[374px]:text-left" style="border-color: var(--pd-spec-border, #e5e5e5); background: var(--color-surface, #ffffff);">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--pd-rating-text-color, #6b7280); margin-bottom: 6px;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span class="text-xl font-extrabold" style="color: var(--pd-title-color, #111827);">${s.responseRate}</span>
          <span class="text-xs mt-1" style="color: var(--pd-rating-text-color, #6b7280);">${t('product.responseRate')}</span>
        </div>
        <div class="flex flex-col items-center text-center p-4 rounded-lg border max-[374px]:p-3 max-[374px]:flex-row max-[374px]:gap-2 max-[374px]:text-left" style="border-color: var(--pd-spec-border, #e5e5e5); background: var(--color-surface, #ffffff);">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--pd-rating-text-color, #6b7280); margin-bottom: 6px;">
            <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          <span class="text-xl font-extrabold" style="color: var(--pd-title-color, #111827);">${s.onTimeDelivery}</span>
          <span class="text-xs mt-1" style="color: var(--pd-rating-text-color, #6b7280);">${t('product.onTimeDelivery')}</span>
        </div>
      </div>

      <!-- 3. Company Details Table -->
      <div style="margin-bottom: 24px;">
        <h3 class="pd-section-heading">${t('product.companyInfo')}</h3>
        <table class="pd-attrs-table">
          <tbody>
            <tr>
              <td class="pd-attrs-key">${t('product.employees')}</td>
              <td class="pd-attrs-val">${s.employees}</td>
              <td class="pd-attrs-key">${t('product.annualRevenue')}</td>
              <td class="pd-attrs-val">${s.annualRevenue}</td>
            </tr>
            <tr>
              <td class="pd-attrs-key">${t('product.yearsInBusiness')}</td>
              <td class="pd-attrs-val">${t('product.servingYears', { count: String(s.yearsInBusiness) })}</td>
              <td class="pd-attrs-key">${t('product.mainProductsLabel')}</td>
              <td class="pd-attrs-val">${s.mainProducts.join(', ')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 4. Factory Capabilities -->
      <div style="margin-bottom: 24px;">
        <h3 class="pd-section-heading">${t('product.factoryCapability')}</h3>
        <div class="grid grid-cols-4 gap-3 mb-6 max-sm:grid-cols-2 max-[374px]:gap-2">
          ${[
            { label: t('product.productionLine'), stroke: '#4a5e9a', icon: '<rect x="3" y="8" width="18" height="12" rx="1"/><path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2"/><path d="M12 12v4"/>' },
            { label: t('product.qualityControl'), stroke: '#2d8a5e', icon: '<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>' },
            { label: t('product.warehouse'), stroke: '#92700c', icon: '<path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/><path d="M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z"/><path d="M10 12h4"/>' },
            { label: t('product.showroom'), stroke: '#7e22ce', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
          ].map(item => `
            <div class="aspect-[4/3] rounded-md overflow-hidden border flex flex-col items-center justify-center gap-1.5 text-[11px]" style="border-color: var(--pd-spec-border, #e5e5e5); background: var(--pd-spec-header-bg, #f9fafb); color: var(--pd-rating-text-color, #6b7280);">
              <svg width="28" height="28" fill="none" stroke-width="1.4" viewBox="0 0 24 24" style="stroke: ${item.stroke};">
                ${item.icon}
              </svg>
              <span>${item.label}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 5. Certifications -->
      <div style="margin-bottom: 24px;">
        <h3 class="pd-section-heading">${t('product.certifications')}</h3>
        <div class="flex flex-wrap gap-3 max-[374px]:gap-2">
          ${s.certifications.map(cert => `
            <div class="flex items-center gap-2 px-4 py-3 rounded-md max-[374px]:px-3 max-[374px]:py-2 max-[374px]:w-full" style="border: 1px solid var(--pd-spec-border, #e5e5e5);">
              <svg class="h-5 w-5" style="color: var(--pd-trade-assurance-text, #15803d);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
              <span class="text-sm font-medium" style="color: var(--pd-title-color, #111827);">${cert}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
