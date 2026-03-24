/**
 * PricingPageLayout Component
 * Pricing plans with monthly/yearly toggle, comparison table, and FAQ
 */

import { t } from '../../i18n';
import { PricingTable } from '../shared/PricingTable';

const PLANS = [
  {
    nameKey: 'sellPage.pricing.planFree' as const,
    monthlyPrice: '\u20BA0',
    yearlyPrice: '\u20BA0',
    yearlyNoteKey: '',
    recommended: false,
    featureKeys: [
      'sellPage.pricing.feat50Products',
      'sellPage.pricing.featBasicStore',
      'sellPage.pricing.featStandardSupport',
      'sellPage.pricing.featBasicAnalytics',
    ],
    isFree: true,
  },
  {
    nameKey: 'sellPage.pricing.planGold' as const,
    monthlyPrice: '\u20BA499',
    yearlyPrice: '\u20BA399',
    yearlyNoteKey: 'sellPage.pricing.yearlyNoteGold',
    recommended: false,
    featureKeys: [
      'sellPage.pricing.feat500Products',
      'sellPage.pricing.featCustomStore',
      'sellPage.pricing.featPrioritySupport',
      'sellPage.pricing.featDetailedAnalytics',
      'sellPage.pricing.featGoldBadge',
      'sellPage.pricing.featFeaturedListing',
    ],
    isFree: false,
  },
  {
    nameKey: 'sellPage.pricing.planVerified' as const,
    monthlyPrice: '\u20BA999',
    yearlyPrice: '\u20BA799',
    yearlyNoteKey: 'sellPage.pricing.yearlyNoteVerified',
    recommended: true,
    featureKeys: [
      'sellPage.pricing.featUnlimitedProducts',
      'sellPage.pricing.featPremiumStore',
      'sellPage.pricing.featDedicatedManager',
      'sellPage.pricing.featAiAnalytics',
      'sellPage.pricing.featVerifiedBadge',
      'sellPage.pricing.featPrioritySearch',
      'sellPage.pricing.featBulkUpload',
      'sellPage.pricing.featApiAccess',
    ],
    isFree: false,
  },
];

const COMPARISON_FEATURE_KEYS = [
  { labelKey: 'sellPage.pricing.compProductListing', values: ['50', '500', 'sellPage.pricing.compValUnlimited'] },
  { labelKey: 'sellPage.pricing.compStorePage', values: ['sellPage.pricing.compValBasic', 'sellPage.pricing.compValCustom', 'sellPage.pricing.compValPremium'] },
  { labelKey: 'sellPage.pricing.compSupport', values: ['sellPage.pricing.compValStandard', 'sellPage.pricing.compValPriority', 'sellPage.pricing.compValDedicatedManager'] },
  { labelKey: 'sellPage.pricing.compAnalytics', values: ['sellPage.pricing.compValBasic', 'sellPage.pricing.compValDetailed', 'sellPage.pricing.compValAiPowered'] },
  { labelKey: 'sellPage.pricing.compBadge', values: [false, true, true] as (boolean | string)[] },
  { labelKey: 'sellPage.pricing.compFeaturedListing', values: [false, true, true] as (boolean | string)[] },
  { labelKey: 'sellPage.pricing.compBulkUpload', values: [false, false, true] as (boolean | string)[] },
  { labelKey: 'sellPage.pricing.compApiAccess', values: [false, false, true] as (boolean | string)[] },
  { labelKey: 'sellPage.pricing.compPrioritySearch', values: [false, false, true] as (boolean | string)[] },
];

export function PricingPageLayout(): string {
  const comparisonFeatures = COMPARISON_FEATURE_KEYS.map(f => ({
    label: t(f.labelKey),
    values: f.values.map(v => {
      if (typeof v === 'boolean') return v;
      if (typeof v === 'string' && v.startsWith('sellPage.')) return t(v);
      return v;
    }),
  }));

  return `
    <div x-data="sellPricing()" class="pb-16">
      <!-- Header -->
      <div class="text-center py-10 sm:py-14">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">${t('sellPage.pricing.title')}</h1>
        <p class="text-gray-500 mb-6">${t('sellPage.pricing.subtitle')}</p>

        <!-- Billing Toggle -->
        <div class="inline-flex items-center bg-gray-100 rounded-full p-1">
          <button @click="billingPeriod = 'monthly'" class="px-4 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer" :class="billingPeriod === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'">${t('sellPage.pricing.monthly')}</button>
          <button @click="billingPeriod = 'yearly'" class="px-4 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer" :class="billingPeriod === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'">
            ${t('sellPage.pricing.yearly')} <span class="text-xs text-green-600 font-semibold ml-1">${t('sellPage.pricing.yearlyDiscount')}</span>
          </button>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          ${PLANS.map(plan => {
            const planName = t(plan.nameKey);
            return `
            <div class="relative bg-white rounded-xl ${plan.recommended ? 'border-2 border-primary-500 shadow-lg' : 'border border-gray-200 shadow-sm'} p-6 sm:p-8 flex flex-col">
              ${plan.recommended ? `<div class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">${t('sellPage.pricing.popular')}</div>` : ''}
              <h3 class="text-xl font-bold text-gray-900">${planName}</h3>
              <div class="mt-4 mb-6">
                <span class="text-3xl font-bold text-gray-900" x-text="billingPeriod === 'monthly' ? '${plan.monthlyPrice}' : '${plan.yearlyPrice}'"></span>
                <span class="text-sm text-gray-500"> ${t('sellPage.pricing.perMonth')}</span>
                ${plan.yearlyNoteKey ? `<p class="text-xs text-gray-400 mt-1" x-show="billingPeriod === 'yearly'">${t(plan.yearlyNoteKey)}</p>` : ''}
              </div>
              <ul class="space-y-3 mb-8 flex-1">
                ${plan.featureKeys.map(fk => `
                  <li class="flex items-start gap-2 text-sm text-gray-600">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    ${t(fk)}
                  </li>
                `).join('')}
              </ul>
              <a href="/pages/seller/sell.html" class="block text-center ${plan.recommended ? 'th-btn' : 'th-btn-outline'}">
                ${plan.isFree ? t('sellPage.pricing.ctaFree') : t('sellPage.pricing.ctaSelect')}
              </a>
            </div>
          `}).join('')}
        </div>

        <!-- Feature Comparison -->
        <div class="mb-16">
          <h2 class="text-xl font-bold text-gray-900 mb-6 text-center">${t('sellPage.pricing.comparisonTitle')}</h2>
          ${PricingTable({
            plans: [
              { name: t('sellPage.pricing.planFree') },
              { name: t('sellPage.pricing.planGold') },
              { name: t('sellPage.pricing.planVerified'), recommended: true },
            ],
            features: comparisonFeatures,
          })}
        </div>

        <!-- FAQ -->
        <div class="max-w-[800px] mx-auto">
          <h2 class="text-xl font-bold text-gray-900 mb-6 text-center">${t('sellPage.pricing.faqTitle')}</h2>
          <div class="space-y-2">
            <template x-for="(item, index) in faqItems" :key="index">
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <button @click="toggleFaq(index)" class="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer">
                  <span x-text="item.question"></span>
                  <svg class="w-4 h-4 text-gray-500 transition-transform shrink-0 ml-2" :class="item.open && 'rotate-180'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                </button>
                <div x-show="item.open" x-collapse>
                  <p class="px-4 pb-4 text-sm text-gray-600 leading-relaxed" x-text="item.answer"></p>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center mt-14">
          <a href="/pages/seller/sell.html" class="th-btn inline-block">${t('sellPage.pricing.ctaBottom')}</a>
        </div>
      </div>
    </div>
  `;
}
