/**
 * C9: Why Choose Us / Advantages (Optional)
 * Variant A: 5 icon cards (Standard sellers)
 * Variant B: 3 feature bars (PRO sellers)
 * BEM Block: why-choose
 */
import type { Advantage, Feature } from '../../types/seller/types';

function getIconSvg(iconName: string): string {
  const icons: Record<string, string> = {
    'shield-check': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>',
    'certificate': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>',
    'lightbulb': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>',
    'headset': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>',
    'cog': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',
    'shield': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>',
    'factory': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>',
    'support': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>',
  };
  return icons[iconName] || icons['shield-check'];
}

function renderVariantA(advantages: Advantage[]): string {
  return `
    <section id="why-choose" class="why-choose why-choose__variant-a py-16" aria-label="Neden bizi tercih etmelisiniz">
      <div class="max-w-(--container-lg) mx-auto px-4 lg:px-6 xl:px-8">
        <h2 class="why-choose__title text-[24px] sm:text-[36px] lg:text-[48px] xl:text-[54px] font-black text-[var(--color-primary-500)] uppercase text-center tracking-tight mb-8 sm:mb-12">
          Why Choose Us
        </h2>
        <div class="why-choose__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          ${advantages.map(adv => `
            <div class="why-choose__icon-card flex flex-col items-center text-center p-4 hover:shadow-md hover:-translate-y-1 transition-[transform,box-shadow] duration-300">
              <div class="why-choose__icon w-[120px] h-[120px] rounded-full border-[3px] border-[var(--color-primary-500)] flex items-center justify-center mb-4">
                <svg class="w-12 h-12 text-[var(--color-primary-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  ${getIconSvg(adv.icon)}
                </svg>
              </div>
              <h3 class="text-[16px] font-bold text-[#111827] dark:text-gray-50 uppercase mb-2">${adv.title}</h3>
              <p class="text-[13px] text-[#6b7280] dark:text-gray-400 leading-relaxed">${adv.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderVariantB(features: Feature[]): string {
  return `
    <section id="why-choose" class="why-choose why-choose__variant-b py-12" aria-label="Neden bizi tercih etmelisiniz">
      <div class="max-w-(--container-lg) mx-auto px-4 lg:px-6 xl:px-8">
        <div class="why-choose__bars grid grid-cols-1 md:grid-cols-3 gap-4">
          ${features.map(feat => `
            <div class="why-choose__feature-bar flex items-center gap-3 sm:gap-4 bg-[#7c6340] dark:bg-[#5a4a2a] rounded-(--radius-lg) px-4 sm:px-8 py-4 sm:py-5 hover:bg-[#6b5535] dark:hover:bg-[#4a3d22] transition-colors cursor-pointer">
              <svg class="w-10 h-10 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${getIconSvg(feat.icon)}
              </svg>
              <span class="text-white text-[16px] font-medium">${feat.title}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

export function WhyChooseUs(advantages?: Advantage[], features?: Feature[], isPro?: boolean): string {
  if (isPro && features && features.length) {
    return renderVariantB(features);
  }
  if (advantages && advantages.length) {
    return renderVariantA(advantages);
  }
  return '';
}
