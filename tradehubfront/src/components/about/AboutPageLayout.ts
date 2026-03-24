/**
 * AboutPageLayout Component
 * Premium landing page with hero, story, mission/vision, stats, timeline
 */

import { t } from '../../i18n';

export function AboutPageLayout(): string {
  return `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 py-16 sm:py-24 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 text-center relative z-10">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">${t('about.heroTitle')}<br><span class="text-primary-400">${t('about.heroHighlight')}</span></h1>
        <p class="text-gray-300 text-base sm:text-lg max-w-[600px] mx-auto">${t('about.heroSubtitle')}</p>
      </div>
    </section>

    <!-- Company Story -->
    <section class="py-14 sm:py-20">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">${t('about.storyTitle')}</h2>
        <div class="text-base text-gray-600 leading-relaxed space-y-4">
          <p>${t('about.storyP1')}</p>
          <p>${t('about.storyP2')}</p>
          <p>${t('about.storyP3')}</p>
        </div>
      </div>
    </section>

    <!-- Mission / Vision -->
    <section class="py-14 sm:py-20 bg-gray-50">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">${t('about.mission')}</h3>
            <p class="text-gray-600 leading-relaxed">${t('about.missionText')}</p>
          </div>
          <div class="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <div class="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">${t('about.vision')}</h3>
            <p class="text-gray-600 leading-relaxed">${t('about.visionText')}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats with animated counters -->
    <section class="py-14 sm:py-20" x-data="aboutPage()" x-intersect.once="animateCounters()">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">${t('about.statsTitle')}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div class="text-3xl sm:text-4xl font-bold text-primary-600" x-text="counters.users.toLocaleString('tr-TR') + '+'"></div>
            <div class="text-sm text-gray-500 mt-2">${t('about.counterUsers')}</div>
          </div>
          <div class="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div class="text-3xl sm:text-4xl font-bold text-primary-600" x-text="counters.sellers.toLocaleString('tr-TR') + '+'"></div>
            <div class="text-sm text-gray-500 mt-2">${t('about.counterSellers')}</div>
          </div>
          <div class="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div class="text-3xl sm:text-4xl font-bold text-primary-600" x-text="counters.countries + '+'"></div>
            <div class="text-sm text-gray-500 mt-2">${t('about.counterCountries')}</div>
          </div>
          <div class="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div class="text-3xl sm:text-4xl font-bold text-primary-600" x-text="counters.categories + '+'"></div>
            <div class="text-sm text-gray-500 mt-2">${t('about.counterCategories')}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="py-14 sm:py-20 bg-gray-50">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">${t('about.timelineTitle')}</h2>
        <div class="relative">
          <!-- Vertical line -->
          <div class="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-primary-200"></div>

          ${[
            { year: '2010', title: t('about.timeline2010Title'), desc: t('about.timeline2010Desc') },
            { year: '2013', title: t('about.timeline2013Title'), desc: t('about.timeline2013Desc') },
            { year: '2016', title: t('about.timeline2016Title'), desc: t('about.timeline2016Desc') },
            { year: '2019', title: t('about.timeline2019Title'), desc: t('about.timeline2019Desc') },
            { year: '2022', title: t('about.timeline2022Title'), desc: t('about.timeline2022Desc') },
            { year: '2024', title: t('about.timeline2024Title'), desc: t('about.timeline2024Desc') },
            { year: '2026', title: t('about.timeline2026Title'), desc: t('about.timeline2026Desc') },
          ].map(item => `
            <div class="relative flex gap-4 sm:gap-6 mb-8 last:mb-0">
              <div class="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 z-10 relative">${item.year}</div>
              <div class="pt-1">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900">${item.title}</h3>
                <p class="text-sm text-gray-600 mt-1">${item.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
