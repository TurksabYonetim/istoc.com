/**
 * C10: Company Introduction Detail (Optional — PRO sellers)
 * Structured company info grid with verification badges, photo grid, CTAs
 * BEM Block: company-intro
 */
import type { CompanyInfoCell, CompanyPhoto, SellerProfile } from '../../types/seller/types';
import { t } from '../../i18n';

function getInfoIconSvg(iconName: string): string {
  const icons: Record<string, string> = {
    'globe': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    'calendar': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>',
    'factory': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>',
    'box': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>',
    'map': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>',
    'chart': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>',
  };
  return icons[iconName] || icons['globe'];
}

export function CompanyIntroduction(
  seller: SellerProfile,
  cells: CompanyInfoCell[],
  photos: CompanyPhoto[]
): string {
  if (!cells || !cells.length) return '';

  return `
    <section id="company-introduction" class="company-intro py-12" aria-label="${t('seller.sf.companyIntroLabel')}">
      <div class="max-w-(--container-lg) mx-auto px-[clamp(0.75rem,0.5rem+1vw,1.5rem)] lg:px-6 xl:px-8">
        <div class="company-intro__card bg-white dark:bg-gray-800 border border-(--card-border-color) rounded-(--radius-lg) shadow-md dark:shadow-lg p-4 sm:p-6 lg:p-10">

          <!-- Title -->
          <h2 class="company-intro__title text-[24px] font-bold text-[#1e3a5f] dark:text-blue-300 uppercase text-center mb-6">
            ${t('seller.sf.companyIntroTitle')}
          </h2>

          <!-- Verification Line -->
          <div class="company-intro__verification flex items-center justify-center flex-wrap gap-3 mb-8">
            <span class="text-[13px] text-[#6b7280] dark:text-gray-400">${t('seller.sf.verificationType')}</span>
            <span class="inline-flex items-center gap-1 bg-[#eff6ff] dark:bg-blue-900 text-[#1e40af] dark:text-blue-300 text-[13px] font-medium px-2.5 py-1 rounded-sm">
              <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.2"/>
                <path d="M5.5 8.5l2 2 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
              ${seller.verificationType}
            </span>
            <span class="text-[13px] text-[#374151] dark:text-gray-300">${t('seller.sf.supplierAssessment')}</span>
            ${seller.verificationBadgeType === 'pro' ? `
              <span class="inline-flex items-center bg-(--store-accent) text-white text-[11px] font-semibold px-2 py-0.5 rounded-sm uppercase">PRO</span>
            ` : ''}
          </div>

          <!-- 3×2 Info Grid -->
          <div class="company-intro__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            ${cells.map(cell => `
              <div class="company-intro__cell flex items-start gap-3 hover:shadow-md transition-shadow duration-300">
                <div class="w-10 h-10 rounded-full bg-[#f3f4f6] dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-[var(--color-primary-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    ${getInfoIconSvg(cell.icon)}
                  </svg>
                </div>
                <div class="flex flex-col">
                  <span class="text-[13px] text-[var(--color-primary-500)] font-medium uppercase">${cell.label}</span>
                  <span class="text-[14px] text-[#374151] dark:text-gray-300 font-medium mt-0.5">${cell.value}</span>
                  ${cell.verified ? `
                    <span class="flex items-center gap-1 text-[11px] text-[var(--color-primary-500)] mt-0.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      ${t('seller.sf.verified')}
                    </span>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Photo Grid -->
          ${photos && photos.length ? `
            <div class="company-intro__photos grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              ${photos.map(photo => `
                <div class="relative rounded-(--radius-md) overflow-hidden aspect-[4/3]">
                  <img src="${photo.image}" alt="${photo.caption}" class="w-full h-full object-cover" loading="lazy" />
                  ${photo.hasVideo ? `
                    <button class="absolute inset-0 flex items-center justify-center" aria-label="${t('seller.sf.playVideo')}">
                      <div class="w-14 h-14 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                        <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </button>
                  ` : ''}
                  <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent py-2 px-3">
                    <span class="text-white text-[11px] font-medium">${photo.caption}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- CTA Buttons -->
          <div class="company-intro__cta flex flex-wrap items-center justify-center gap-4">
            <button class="th-btn flex items-center gap-2"
                    onclick="document.getElementById('contact-form')?.scrollIntoView({behavior:'smooth'})">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              ${t('seller.sf.contactSupplier')}
            </button>
            <button class="th-btn-outline">
              ${t('seller.sf.startOrder')}
            </button>
            <a href="#company-info" class="text-[var(--color-primary-500)] font-medium text-[14px] hover:underline flex items-center gap-1 focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 rounded">
              ${t('seller.sf.learnMore')}
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}
