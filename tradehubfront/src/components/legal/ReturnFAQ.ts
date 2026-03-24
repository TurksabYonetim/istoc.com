/**
 * ReturnFAQ Component
 * FAQ accordion for return policy page
 */

import { t } from '../../i18n';

function getFaqItems() {
  return [
    { q: t('returnFaq.q1'), a: t('returnFaq.a1') },
    { q: t('returnFaq.q2'), a: t('returnFaq.a2') },
    { q: t('returnFaq.q3'), a: t('returnFaq.a3') },
    { q: t('returnFaq.q4'), a: t('returnFaq.a4') },
    { q: t('returnFaq.q5'), a: t('returnFaq.a5') },
    { q: t('returnFaq.q6'), a: t('returnFaq.a6') },
    { q: t('returnFaq.q7'), a: t('returnFaq.a7') },
  ];
}

export function ReturnFAQ(): string {
  const FAQ_ITEMS = getFaqItems();
  return `
    <div class="mt-10" x-data="{ openFaq: null }">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">${t('returnFaq.title')}</h3>
      <div class="space-y-2">
        ${FAQ_ITEMS.map((item, i) => `
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="openFaq = openFaq === ${i} ? null : ${i}"
              class="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span>${item.q}</span>
              <svg class="w-4 h-4 text-gray-500 transition-transform shrink-0 ml-2" :class="openFaq === ${i} && 'rotate-180'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
            </button>
            <div x-show="openFaq === ${i}" x-collapse>
              <p class="px-4 pb-4 text-sm text-gray-600 leading-relaxed">${item.a}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
