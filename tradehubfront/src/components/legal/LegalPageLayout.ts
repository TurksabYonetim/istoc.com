/**
 * LegalPageLayout Component
 * Shared layout for all legal pages: sticky TOC sidebar on desktop, dropdown on mobile
 */

import { Breadcrumb } from '../shared/Breadcrumb';
import { t } from '../../i18n';

export interface LegalSection {
  id: string;
  title: string;
  content: string;
}

export interface LegalPageLayoutProps {
  pageTitle: string;
  lastUpdated: string;
  sections: LegalSection[];
  breadcrumbLabel: string;
}

export function LegalPageLayout({ pageTitle, lastUpdated, sections, breadcrumbLabel }: LegalPageLayoutProps): string {
  return `
    <div class="bg-gray-50 min-h-screen">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6">
        ${Breadcrumb([
          { label: t('legal.breadcrumbLegal'), href: '/pages/legal/terms.html' },
          { label: breadcrumbLabel }
        ])}
      </div>

      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 pb-16" x-data="legalToc()">
        <!-- Page Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">${pageTitle}</h1>
            <p class="text-sm text-gray-500 mt-1">${t('legal.lastUpdated')} ${lastUpdated}</p>
          </div>
          <button @click="printPage()" class="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m0 0a48.019 48.019 0 0110.5 0m-10.5 0V4.875c0-.621.504-1.125 1.125-1.125h8.25c.621 0 1.125.504 1.125 1.125v3.659"/></svg>
            ${t('legal.print')}
          </button>
        </div>

        <div class="flex gap-8">
          <!-- TOC Sidebar (Desktop) -->
          <aside class="hidden lg:block w-[240px] shrink-0">
            <nav class="sticky top-[72px]">
              <div class="bg-white rounded-lg border border-gray-200 p-4">
                <h3 class="text-sm font-semibold text-gray-700 mb-3">${t('legal.tableOfContents')}</h3>
                <ul class="space-y-1">
                  ${sections.map(s => `
                    <li>
                      <button
                        @click="scrollToSection('${s.id}')"
                        class="w-full text-left text-sm py-1.5 px-2 rounded transition-colors cursor-pointer"
                        :class="activeSection === '${s.id}' ? 'text-primary-600 bg-primary-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
                      >${s.title}</button>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </nav>
          </aside>

          <!-- Mobile TOC -->
          <div class="lg:hidden mb-4 w-full">
            <button @click="tocOpen = !tocOpen" class="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer">
              <span>${t('legal.tableOfContents')}</span>
              <svg class="w-4 h-4 transition-transform" :class="tocOpen && 'rotate-180'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
            </button>
            <div x-show="tocOpen" x-transition class="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <ul class="py-1">
                ${sections.map(s => `
                  <li>
                    <button
                      @click="scrollToSection('${s.id}'); tocOpen = false"
                      class="w-full text-left text-sm py-2 px-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      :class="activeSection === '${s.id}' ? 'text-primary-600 font-medium' : 'text-gray-600'"
                    >${s.title}</button>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 lg:max-w-none max-w-full">
            <div class="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
              ${sections.map(s => `
                <section id="${s.id}" class="mb-10 last:mb-0 scroll-mt-20">
                  <h2 class="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">${s.title}</h2>
                  <div class="text-base leading-relaxed text-gray-700 space-y-3">
                    ${s.content}
                  </div>
                </section>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
