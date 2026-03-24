/**
 * CookieConsentUI Component
 * Cookie category toggles and cookie table
 */

import { t } from '../../i18n';

export function CookieConsentUI(): string {
  const categories = [
    { id: 'necessary', label: t('cookieConsent.necessaryCookies'), desc: t('cookieConsent.necessaryDesc'), alwaysOn: true },
    { id: 'functional', label: t('cookieConsent.functionalCookies'), desc: t('cookieConsent.functionalDesc'), alwaysOn: false },
    { id: 'analytics', label: t('cookieConsent.analyticsCookies'), desc: t('cookieConsent.analyticsDesc'), alwaysOn: false },
    { id: 'marketing', label: t('cookieConsent.marketingCookies'), desc: t('cookieConsent.marketingDesc'), alwaysOn: false },
  ];

  const cookieTable = [
    { name: '_istoc_session', provider: 'iSTOC', purpose: t('cookieConsent.sessionManagement'), duration: t('cookieConsent.session'), type: t('cookieConsent.typeNecessary') },
    { name: '_istoc_csrf', provider: 'iSTOC', purpose: t('cookieConsent.csrfProtection'), duration: t('cookieConsent.session'), type: t('cookieConsent.typeNecessary') },
    { name: '_istoc_prefs', provider: 'iSTOC', purpose: t('cookieConsent.userPreferences'), duration: t('cookieConsent.oneYear'), type: t('cookieConsent.typeFunctional') },
    { name: '_istoc_lang', provider: 'iSTOC', purpose: t('cookieConsent.languagePreference'), duration: t('cookieConsent.oneYear'), type: t('cookieConsent.typeFunctional') },
    { name: '_ga', provider: 'Google', purpose: t('cookieConsent.visitorStats'), duration: t('cookieConsent.twoYears'), type: t('cookieConsent.typeAnalytics') },
    { name: '_gid', provider: 'Google', purpose: t('cookieConsent.visitorId'), duration: t('cookieConsent.twentyFourHours'), type: t('cookieConsent.typeAnalytics') },
    { name: '_fbp', provider: 'Facebook', purpose: t('cookieConsent.adTargeting'), duration: t('cookieConsent.threeMonths'), type: t('cookieConsent.typeMarketing') },
    { name: '_gcl_au', provider: 'Google Ads', purpose: t('cookieConsent.conversionTracking'), duration: t('cookieConsent.threeMonths'), type: t('cookieConsent.typeMarketing') },
  ];

  const typeNecessary = t('cookieConsent.typeNecessary');
  const typeFunctional = t('cookieConsent.typeFunctional');
  const typeAnalytics = t('cookieConsent.typeAnalytics');

  return `
    <div class="mt-10 bg-white rounded-lg border border-gray-200 p-6 sm:p-8" x-data="cookieConsent()">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">${t('cookieConsent.title')}</h2>

      <!-- Category Toggles -->
      <div class="space-y-4 mb-8">
        ${categories.map(cat => `
          <div class="flex items-start justify-between gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50">
            <div class="min-w-0">
              <h3 class="text-sm font-semibold text-gray-800">${cat.label}</h3>
              <p class="text-sm text-gray-500 mt-0.5">${cat.desc}</p>
            </div>
            <label class="relative inline-flex items-center shrink-0 ${cat.alwaysOn ? 'cursor-not-allowed' : 'cursor-pointer'}">
              <input type="checkbox"
                ${cat.alwaysOn ? 'checked disabled' : `:checked="categories.${cat.id}" @change="toggleCategory('${cat.id}')"`}
                class="sr-only peer">
              <div class="w-10 h-5 bg-gray-300 peer-checked:bg-primary-500 rounded-full transition-colors ${cat.alwaysOn ? 'opacity-70' : ''} after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>
        `).join('')}
      </div>

      <button @click="savePreferences()" class="th-btn cursor-pointer mb-8">
        ${t('cookieConsent.savePreferences')}
      </button>

      <!-- Cookie Table -->
      <h3 class="text-lg font-semibold text-gray-900 mb-4">${t('cookieConsent.cookiesUsed')}</h3>
      <div class="overflow-x-auto -mx-2 sm:mx-0">
        <table class="w-full text-sm min-w-[600px]">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left py-2.5 px-3 font-medium text-gray-700">${t('cookieConsent.thCookieName')}</th>
              <th class="text-left py-2.5 px-3 font-medium text-gray-700">${t('cookieConsent.thProvider')}</th>
              <th class="text-left py-2.5 px-3 font-medium text-gray-700">${t('cookieConsent.thPurpose')}</th>
              <th class="text-left py-2.5 px-3 font-medium text-gray-700">${t('cookieConsent.thDuration')}</th>
              <th class="text-left py-2.5 px-3 font-medium text-gray-700">${t('cookieConsent.thType')}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            ${cookieTable.map(c => `
              <tr class="hover:bg-gray-50">
                <td class="py-2.5 px-3 font-mono text-xs text-gray-800">${c.name}</td>
                <td class="py-2.5 px-3 text-gray-600">${c.provider}</td>
                <td class="py-2.5 px-3 text-gray-600">${c.purpose}</td>
                <td class="py-2.5 px-3 text-gray-500">${c.duration}</td>
                <td class="py-2.5 px-3"><span class="text-xs px-2 py-0.5 rounded-full ${c.type === typeNecessary ? 'bg-blue-100 text-blue-700' : c.type === typeFunctional ? 'bg-purple-100 text-purple-700' : c.type === typeAnalytics ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}">${c.type}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
