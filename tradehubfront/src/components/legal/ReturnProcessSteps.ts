/**
 * ReturnProcessSteps Component
 * 5-step visual return process timeline
 */

import { t } from '../../i18n';

function getSteps() {
  return [
    { num: 1, label: t('returnProcess.step1Label'), desc: t('returnProcess.step1Desc'), icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>' },
    { num: 2, label: t('returnProcess.step2Label'), desc: t('returnProcess.step2Desc'), icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
    { num: 3, label: t('returnProcess.step3Label'), desc: t('returnProcess.step3Desc'), icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0V5.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v3.026m-4.5 0h4.5m0 0l.586 1.217"/></svg>' },
    { num: 4, label: t('returnProcess.step4Label'), desc: t('returnProcess.step4Desc'), icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>' },
    { num: 5, label: t('returnProcess.step5Label'), desc: t('returnProcess.step5Desc'), icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/></svg>' },
  ];
}

export function ReturnProcessSteps(): string {
  const STEPS = getSteps();
  return `
    <div class="my-10 py-8 px-4 bg-gradient-to-r from-primary-50 to-orange-50 rounded-xl">
      <h3 class="text-lg font-semibold text-gray-900 text-center mb-8">${t('returnProcess.title')}</h3>

      <!-- Desktop: horizontal -->
      <div class="hidden md:flex items-start justify-between max-w-[900px] mx-auto">
        ${STEPS.map((s, i) => `
          <div class="flex items-start ${i < STEPS.length - 1 ? 'flex-1' : ''}">
            <div class="flex flex-col items-center text-center w-[120px]">
              <div class="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center mb-2">${s.icon}</div>
              <span class="text-sm font-semibold text-gray-800">${s.label}</span>
              <span class="text-xs text-gray-500 mt-1 leading-tight">${s.desc}</span>
            </div>
            ${i < STEPS.length - 1 ? '<div class="flex-1 h-0.5 bg-primary-200 mt-6 mx-2"></div>' : ''}
          </div>
        `).join('')}
      </div>

      <!-- Mobile: vertical -->
      <div class="md:hidden space-y-0 pl-4">
        ${STEPS.map((s, i) => `
          <div class="flex gap-4 ${i < STEPS.length - 1 ? 'pb-6' : ''}">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center shrink-0">${s.icon}</div>
              ${i < STEPS.length - 1 ? '<div class="w-0.5 flex-1 bg-primary-200 mt-2"></div>' : ''}
            </div>
            <div class="pt-1.5">
              <span class="text-sm font-semibold text-gray-800">${s.label}</span>
              <p class="text-xs text-gray-500 mt-0.5">${s.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
