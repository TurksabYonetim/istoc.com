/**
 * HelpCenterHeader Component
 * Dedicated Help Center header — logo + "Help Center for Buyer" title on the left,
 * navigation links on the right with horizontal scroll on mobile.
 */

import { t } from '../../i18n';

const getBaseUrl = (): string => {
  const viteBase = typeof import.meta !== 'undefined' ? import.meta.env?.BASE_URL : undefined;
  if (viteBase && viteBase !== '/') return viteBase;
  if (window.location.pathname.startsWith('/tradehub/')) return '/tradehub/';
  return '/';
};

type ActivePage = 'home' | 'faq' | 'contact' | 'ticket-new' | 'tickets' | 'terms' | 'privacy' | 'cookies' | 'returns';

interface HelpCenterHeaderOptions {
  activePage?: ActivePage;
}

const NAV_LINKS: { id: ActivePage; label: string; href: string }[] = [
  { id: 'home', label: t('helpCenter.navHome'), href: '/pages/help/help-center.html' },
  { id: 'faq', label: t('helpCenter.navFaq'), href: '/pages/help/faq.html' },
  { id: 'contact', label: t('helpCenter.navContact'), href: '/pages/help/contact.html' },
  { id: 'ticket-new', label: t('helpCenter.navNewTicket'), href: '/pages/help/help-ticket-new.html' },
  { id: 'tickets', label: t('helpCenter.navMyTickets'), href: '/pages/help/help-tickets.html' },
];

export function HelpCenterHeader(opts: HelpCenterHeaderOptions = {}): string {
  const { activePage = 'home' } = opts;
  const baseUrl = getBaseUrl();

  const activeStyle = 'color:var(--color-primary-500); border-bottom:2px solid var(--color-primary-500); padding-bottom:6px; font-weight:600;';
  const inactiveStyle = 'color:#555; font-weight:500;';

  return `
    <header
      class="w-full bg-white border-b border-gray-200 sticky top-0 z-50"
      style="box-shadow: 0 1px 4px rgba(0,0,0,0.08);"
    >
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[56px]">

        <!-- Left: Logo + title -->
        <div class="flex items-center gap-3 shrink-0">
          <a href="${baseUrl}" class="flex items-center hover:opacity-80 transition-opacity shrink-0">
            <img src="${baseUrl}images/istoc-logo.png" alt="iSTOC" class="h-[26px]" />
          </a>
          <span class="hidden sm:block text-gray-300 font-light text-xl mx-1">|</span>
          <span class="hidden sm:flex items-center gap-1.5 text-[15px] font-semibold text-gray-700 tracking-tight whitespace-nowrap">
            <svg class="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
            </svg>
            ${t('helpCenter.headerTitle')}
          </span>
        </div>

        <!-- Right: Nav links with horizontal scroll on mobile -->
        <nav class="flex items-center gap-1 overflow-x-auto scrollbar-hide ml-2">
          ${NAV_LINKS.map(link => `
            <a
              id="hc-nav-${link.id}"
              href="${link.href}"
              class="relative px-3 py-1.5 text-sm transition-colors whitespace-nowrap"
              style="${activePage === link.id ? activeStyle : inactiveStyle}"
            >
              ${link.label}
            </a>
          `).join('')}
        </nav>

      </div>
    </header>
  `;
}
