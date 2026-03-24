/**
 * HelpCenterLayout Component
 * Full Help Center page with hero search, learning center cards,
 * category tabs + FAQ links, contact us section and footer.
 * Built with Tailwind CSS + Alpine.js
 */

import { t } from '../../i18n';

export function HelpCenterLayout(): string {
  return `
    <!-- Help Center page — Alpine.js drives tab state & search -->
    <div
      id="help-center-root"
      x-data="helpCenter()"
      x-init="init()"
      class="min-h-screen bg-[#F5F5F5]"
    >

      <!-- ══════════════════════════════════════
           HERO SECTION — background image + search
      ══════════════════════════════════════════ -->
      <section class="relative w-full overflow-hidden" style="height:clamp(200px,28vw,320px);">
        <!-- Background image overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        <div
          class="absolute inset-0 bg-cover bg-center"
          style="background-image:url('https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80&auto=format&fit=crop'); filter:brightness(0.7);"
        ></div>

        <!-- Search content -->
        <div class="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 class="text-white text-2xl sm:text-3xl font-bold mb-1 drop-shadow-md tracking-tight" data-i18n-html="help.title">${t('help.title')}</h1>
          <p class="text-gray-200 text-sm mb-5 drop-shadow" data-i18n="help.subtitle">${t('help.subtitle')}</p>

          <!-- Search bar -->
          <div class="relative w-full max-w-[580px]">
            <form @submit.prevent="doSearch()" class="flex items-center bg-white rounded-lg shadow-2xl overflow-hidden border border-white/20">
              <div class="flex items-center pl-4 text-gray-400">
                <!-- Search icon -->
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.6-5.15a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"/>
                </svg>
              </div>
              <input
                id="hc-search-input"
                x-model="searchQuery"
                type="text"
                placeholder="${t('help.searchPlaceholder')}" data-i18n-placeholder="help.searchPlaceholder"
                class="flex-1 px-3 py-3 text-sm border-0 text-gray-700 outline-none placeholder-gray-400 bg-transparent"
              />
              <button
                type="submit"
                id="hc-search-btn"
                class="px-5 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 shrink-0"
                style="background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))"
              >
                <span data-i18n="help.searchBtn">${t('help.searchBtn')}</span>
              </button>
            </form>

            <!-- Quick search chips -->
            <div class="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span class="text-xs text-gray-300" data-i18n="help.popular">${t('help.popular')}</span>
              <template x-for="chip in popularSearches" :key="chip">
                <button
                  @click="searchQuery = chip; doSearch()"
                  class="text-xs text-white/90 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 transition-all border border-white/30"
                  x-text="chip"
                ></button>
              </template>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════
           SEARCH RESULTS (shown only when active)
      ══════════════════════════════════════════ -->
      <div x-show="searchActive" x-transition class="max-w-[900px] mx-auto px-4 py-6">
        <div class="bg-white rounded-xl shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-800">
              "<span x-text="searchQuery"></span>" ${t('help.searchResultsFor')}
            </h2>
            <button @click="clearSearch()" class="text-sm text-primary-500 hover:underline" data-i18n="help.clearBtn">${t('help.clearBtn')}</button>
          </div>
          <template x-if="searchResults.length === 0">
            <p class="text-gray-500 text-sm" data-i18n="help.noResults">${t('help.noResults')}</p>
          </template>
          <ul class="divide-y divide-gray-100">
            <template x-for="(r, i) in searchResults" :key="i">
              <li class="py-3">
                <a href="#" class="group flex items-start gap-3">
                  <span class="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style="background: var(--color-primary-50)">
                    <svg class="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 0 1 0-1.414L10.586 10 7.293 6.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0z" clip-rule="evenodd"/></svg>
                  </span>
                  <span class="text-sm text-gray-700 group-hover:text-primary-600 transition-colors" x-text="r"></span>
                </a>
              </li>
            </template>
          </ul>
        </div>
      </div>

      <!-- ══════════════════════════════════════
           MAIN CONTENT
      ══════════════════════════════════════════ -->
      <div x-show="!searchActive" class="max-w-[960px] mx-auto px-4 py-8 space-y-8">

        <!-- ── Learning Center ───────────────── -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-7">
          <h2 class="text-[17px] font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span class="w-1 h-5 rounded-full inline-block" style="background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))"></span>
            <span data-i18n="help.learningCenter">${t('help.learningCenter')}</span>
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <template x-for="card in learningCards" :key="card.id">
              <a
                href="#"
                @click.prevent="selectLearningCard(card)"
                class="group flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer"
                :class="activeLearningCard === card.id
                  ? 'border-primary-400 bg-primary-50 shadow-md'
                  : 'border-transparent hover:border-primary-200 hover:bg-primary-50/50'"
              >
                <!-- Icon circle -->
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-200"
                  :class="activeLearningCard === card.id ? 'bg-primary-100' : 'bg-gray-50'"
                >
                  <span x-html="card.icon" class="text-3xl"></span>
                </div>
                <p class="text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition-colors" x-text="card.title"></p>
                <p class="text-[11px] text-gray-500 mt-1" x-text="card.subtitle"></p>
              </a>
            </template>
          </div>
        </div>

        <!-- ── Category Tabs + FAQ Grid ─────────── -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <!-- Tab bar -->
          <div class="flex overflow-x-auto scrollbar-none border-b border-gray-100">
            <template x-for="tab in tabs" :key="tab.id">
              <button
                @click="activeTab = tab.id"
                class="flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all shrink-0"
                :class="activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 bg-primary-50'
                  : 'border-transparent text-gray-600 hover:text-primary-500 hover:bg-gray-50'"
              >
                <span x-html="tab.icon" class="text-base"></span>
                <span x-text="tab.label"></span>
              </button>
            </template>
          </div>

          <!-- FAQ links threee-column grid -->
          <div class="p-6">
            <template x-for="tab in tabs" :key="tab.id">
              <div x-show="activeTab === tab.id" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 translate-y-1" x-transition:enter-end="opacity-100 translate-y-0">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-2">
                  <template x-for="(question, qi) in tab.questions" :key="qi">
                    <a
                      href="#"
                      class="flex items-start gap-1.5 py-1.5 text-[13px] text-gray-700 hover:text-primary-600 transition-colors group"
                      :class="qi % 5 === 1 ? 'font-medium text-primary-500 hover:text-primary-700' : ''"
                    >
                      <span class="text-primary-400 mt-0.5 shrink-0">›</span>
                      <span x-text="question"></span>
                    </a>
                  </template>
                </div>
                <!-- View more link -->
                <div class="mt-5 pt-4 border-t border-gray-100 text-center">
                  <a href="#" class="inline-flex items-center gap-1 text-sm text-primary-500 hover:underline font-medium">
                    <span data-i18n="help.viewMore">${t('help.viewMore')}</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/></svg>
                  </a>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- ── Contact Us ───────────────────── -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-7">
          <h2 class="text-[17px] font-bold text-gray-800 mb-5 text-center" data-i18n="help.contactUs">${t('help.contactUs')}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- Online Service -->
            <a href="#" class="group flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors" data-i18n="help.onlineService">${t('help.onlineService')}</p>
                <p class="text-[12px] text-gray-500 mt-0.5" data-i18n="help.onlineServiceDesc">${t('help.onlineServiceDesc')}</p>
              </div>
              <svg class="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/></svg>
            </a>

            <!-- Survey -->
            <a href="#" class="group flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors" data-i18n="help.survey">${t('help.survey')}</p>
                <p class="text-[12px] text-gray-500 mt-0.5" data-i18n="help.surveyDesc">${t('help.surveyDesc')}</p>
              </div>
              <svg class="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/></svg>
            </a>

            <!-- Phone Support -->
            <a href="tel:+908001234567" class="group flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors" data-i18n="help.phoneSupport">${t('help.phoneSupport')}</p>
                <p class="text-[12px] text-gray-500 mt-0.5" data-i18n="help.phoneNumber">${t('help.phoneNumber')}</p>
              </div>
              <svg class="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/></svg>
            </a>

            <!-- Email -->
            <a href="mailto:support@istoc.com" class="group flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors" data-i18n="help.emailSupport">${t('help.emailSupport')}</p>
                <p class="text-[12px] text-gray-500 mt-0.5">support@istoc.com</p>
              </div>
              <svg class="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>
        </div>

        <!-- ── Useful Links Strip ─────────────── -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
          <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-gray-500">
            <a href="#" class="hover:text-primary-500 transition-colors" data-i18n="help.productListingPolicy">${t('help.productListingPolicy')}</a>
            <span class="text-gray-200">|</span>
            <a href="#" class="hover:text-primary-500 transition-colors" data-i18n="help.ipProtection">${t('help.ipProtection')}</a>
            <span class="text-gray-200">|</span>
            <a href="#" class="hover:text-primary-500 transition-colors" data-i18n="help.privacyPolicy">${t('help.privacyPolicy')}</a>
            <span class="text-gray-200">|</span>
            <a href="#" class="hover:text-primary-500 transition-colors" data-i18n="help.termsOfUse">${t('help.termsOfUse')}</a>
            <span class="text-gray-200">|</span>
            <a href="#" class="hover:text-primary-500 transition-colors" data-i18n="help.userInfoLaws">${t('help.userInfoLaws')}</a>
            <span class="text-gray-200">|</span>
            <a href="#" class="hover:text-primary-500 transition-colors" data-i18n="help.contactGuide">${t('help.contactGuide')}</a>
          </div>
          <p class="text-center text-[11px] text-gray-400 mt-3" data-i18n="help.copyright">${t('help.copyright')}</p>
        </div>

      </div><!-- /main content -->
    </div><!-- /help-center-root -->
  `;
}

export function initHelpCenter(): void {
  // Alpine component definition — registered globally via startAlpine()
}
