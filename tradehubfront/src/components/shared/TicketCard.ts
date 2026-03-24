/**
 * TicketCard Component
 * Displays a support ticket summary with status badge
 */

import { t } from '../../i18n';

export interface TicketCardData {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'pending' | 'closed';
  createdDate: string;
  lastReply?: string;
  snippet?: string;
}

const STATUS_CONFIG = {
  open: { labelKey: 'shared.open', bg: 'bg-green-100 text-green-700' },
  pending: { labelKey: 'shared.pending', bg: 'bg-amber-100 text-amber-700' },
  closed: { labelKey: 'shared.resolved', bg: 'bg-gray-100 text-gray-600' },
};

const CATEGORY_ICONS: Record<string, string> = {
  order: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
  payment: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>`,
  shipping: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>`,
  'default': `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>`,
};

const CATEGORY_I18N: Record<string, string> = {
  order: 'shared.orderCategory',
  payment: 'shared.paymentCategory',
  shipping: 'shared.shippingCategory',
};

export function TicketCard(ticket: TicketCardData): string {
  const status = STATUS_CONFIG[ticket.status];
  const catIcon = CATEGORY_ICONS[ticket.category] || CATEGORY_ICONS['default'];
  const catI18nKey = CATEGORY_I18N[ticket.category];

  return `
    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer">
      <!-- Top row: status + date -->
      <div class="flex items-center justify-between mb-2">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg}" data-i18n="${status.labelKey}">${t(status.labelKey)}</span>
        <span class="text-xs text-gray-400">${ticket.createdDate}</span>
      </div>
      <!-- Middle: category icon + subject -->
      <div class="flex items-start gap-2 mb-2">
        <span class="text-gray-400 mt-0.5 shrink-0">${catIcon}</span>
        <div class="min-w-0">
          <h4 class="text-sm font-semibold text-gray-900 truncate">${ticket.subject}</h4>
          <span class="text-xs text-gray-500">#${ticket.id} &middot; ${catI18nKey ? `<span data-i18n="${catI18nKey}">${t(catI18nKey)}</span>` : ticket.category}</span>
        </div>
      </div>
      <!-- Bottom: last reply + snippet -->
      ${ticket.lastReply || ticket.snippet ? `
        <div class="pt-2 border-t border-gray-100">
          ${ticket.lastReply ? `<p class="text-xs text-gray-400 mb-1"><span data-i18n="shared.lastReply">${t('shared.lastReply')}</span> ${ticket.lastReply}</p>` : ''}
          ${ticket.snippet ? `<p class="text-xs text-gray-500 line-clamp-2">${ticket.snippet}</p>` : ''}
        </div>
      ` : ''}
    </div>
  `;
}
