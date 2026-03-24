/**
 * C7: Company Info / About Us
 * Variant A: Text + Image side by side (Standard sellers)
 * Variant B: Scrollable text + Carousel (PRO sellers)
 */
import type { CompanyInfo as CompanyInfoData, SellerProfile } from '../../types/seller/types';
import { t } from '../../i18n';

function renderVariantA(data: CompanyInfoData, seller: SellerProfile): string {
  return `
    <section id="company-info" class="company-info company-info__variant-a py-12" aria-label="${t('seller.sf.companyInfoLabel')}">
      <div class="max-w-(--container-lg) mx-auto px-[clamp(0.75rem,0.5rem+1vw,1.5rem)] lg:px-6 xl:px-8">
        <h2 class="text-[clamp(1.5rem,1.2rem+1.5vw,3.375rem)] font-black text-[#1e3a5f] dark:text-blue-300 uppercase text-center tracking-tight mb-6 md:mb-8">
          ${t('seller.sf.companyTitle')}
        </h2>

        <!-- Verified Banner -->
        <div class="company-info__verified-banner flex items-center gap-4 bg-gradient-to-r from-primary-600 to-[#dc2626] text-white px-6 py-3 rounded-t-(--radius-md) text-[13px]">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span><strong>${t('seller.sf.verifiedSupplier')}</strong> — ${seller.name}</span>
        </div>

        <!-- Content Grid: 55% / 45% -->
        <div class="company-info__content grid grid-cols-1 lg:grid-cols-[55%_45%] gap-4 lg:gap-6 mt-0">
          <!-- Hero Image -->
          <div class="company-info__hero-image relative rounded-bl-(--radius-md) overflow-hidden">
            <img src="${data.heroImage}" alt="${data.heroTitle}" class="w-full h-[200px] sm:h-[250px] lg:h-[400px] object-cover" loading="lazy"
                 onerror="this.parentElement.style.background='linear-gradient(135deg,#1e3a5f,#2563eb)'" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 dark:from-black/70 to-transparent flex flex-col justify-end p-6">
              <h3 class="text-white text-[28px] font-bold">${data.heroTitle}</h3>
              <p class="text-white/80 text-[14px] mt-1">${data.heroSubtitle}</p>
            </div>
          </div>

          <!-- Description -->
          <div class="company-info__description flex flex-col gap-4 py-4">
            <img src="${seller.logo}" alt="${seller.name}" class="w-[120px] object-contain" onerror="this.style.display='none'" />
            <p class="text-[14px] text-[#4b5563] dark:text-gray-300 leading-[1.7]">${data.description}</p>
            ${data.descriptionExtended ? `<p class="text-[14px] text-[#4b5563] dark:text-gray-300 leading-[1.7]">${data.descriptionExtended}</p>` : ''}
          </div>
        </div>

        <!-- Factory Photos Grid -->
        ${data.factoryPhotos.length ? `
          <div class="company-info__factory-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
            ${data.factoryPhotos.map(photo => `
              <div class="relative rounded-(--radius-md) overflow-hidden group">
                <img src="${photo.image}" alt="${photo.caption}" class="w-full h-[200px] object-cover" loading="lazy"
                     onerror="this.parentElement.style.background='#f3f4f6'" />
                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent py-2 px-3">
                  <span class="text-white text-[12px] font-medium">${photo.caption}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

function renderVariantB(data: CompanyInfoData, seller: SellerProfile): string {
  return `
    <section id="company-info" class="company-info company-info__variant-b py-12 bg-[#f5f0e8] dark:bg-gray-800" aria-label="${t('seller.sf.companyInfoLabel')}">
      <div class="max-w-(--container-lg) mx-auto px-[clamp(0.75rem,0.5rem+1vw,1.5rem)] lg:px-6 xl:px-8">
        <h2 class="company-info__title-b text-[28px] font-normal text-[#8b5e3c] dark:text-[#d4a76a] mb-6 italic">
          ${seller.name}
        </h2>

        <!-- Content Grid: 40% / 60% -->
        <div class="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8">
          <!-- Scrollable Text Panel -->
          <div class="company-info__text-panel">
            <div class="company-info__scrollable-text max-h-[300px] overflow-y-auto pr-4 text-[14px] text-[#4b5563] dark:text-gray-300 leading-[1.7]">
              <p>${data.description}</p>
              ${data.descriptionExtended ? `<p class="mt-4">${data.descriptionExtended}</p>` : ''}
            </div>
          </div>

          <!-- Carousel -->
          <div class="company-info__carousel relative">
            <div class="company-info__carousel-swiper swiper rounded-(--radius-md) overflow-hidden">
              <div class="swiper-wrapper">
                ${data.carouselPhotos.map(photo => `
                  <div class="swiper-slide">
                    <div class="relative">
                      <img src="${photo.image}" alt="${photo.caption}" class="w-full h-[320px] object-cover" loading="lazy" />
                      <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent py-4 px-6">
                        <span class="text-white text-[14px] font-medium">${photo.caption}</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            <!-- Navigation Arrows -->
            <button class="company-info__prev absolute left-2 top-1/2 -translate-y-1/2 bg-[#e5e5e5] hover:bg-[#d1d5db] dark:bg-gray-700 dark:hover:bg-gray-600 w-8 h-12 rounded-sm flex items-center justify-center z-10 transition-colors border-none cursor-pointer" aria-label="${t('seller.sf.previous')}">
              <svg class="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button class="company-info__next absolute right-2 top-1/2 -translate-y-1/2 bg-[#e5e5e5] hover:bg-[#d1d5db] dark:bg-gray-700 dark:hover:bg-gray-600 w-8 h-12 rounded-sm flex items-center justify-center z-10 transition-colors border-none cursor-pointer" aria-label="${t('seller.sf.nextSlide')}">
              <svg class="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Location Cards -->
        ${data.locations.length ? `
          <div class="company-info__locations grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-8">
            ${data.locations.map(loc => `
              <div class="relative rounded-(--radius-md) overflow-hidden aspect-[4/3] group cursor-pointer">
                <img src="${loc.image}" alt="${loc.name}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 dark:from-black/80 to-transparent py-3 px-4">
                  <span class="text-white text-[13px] font-medium">${loc.name}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

export function CompanyInfoComponent(data: CompanyInfoData, seller: SellerProfile): string {
  if (seller.verificationBadgeType === 'pro') {
    return renderVariantB(data, seller);
  }
  return renderVariantA(data, seller);
}
