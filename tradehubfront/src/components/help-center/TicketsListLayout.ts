/**
 * TicketsListLayout Component
 * Lists support tickets with tab filters, search, and pagination
 */

import { t } from '../../i18n';

const STATUS_TABS = [
  { id: 'all', label: t('helpCenter.statusAll') },
  { id: 'open', label: t('helpCenter.statusOpen') },
  { id: 'pending', label: t('helpCenter.statusPending') },
  { id: 'closed', label: t('helpCenter.statusResolved') },
];

export function TicketsListLayout(): string {
  return `
    <div class="bg-gray-50 min-h-screen" x-data="ticketsList()">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900">${t('helpCenter.myTickets')}</h1>
          <a href="/pages/help/help-ticket-new.html" class="th-btn th-btn-sm inline-flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            ${t('helpCenter.newTicket')}
          </a>
        </div>

        <!-- Status Tabs -->
        <div class="flex gap-1 mb-4 overflow-x-auto scrollbar-hide">
          ${STATUS_TABS.map(tab => `
            <button
              @click="setTab('${tab.id}')"
              class="px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer"
              :class="activeTab === '${tab.id}' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
            >
              ${tab.label}
              <span class="ml-1 text-xs" :class="activeTab === '${tab.id}' ? 'text-white/70' : 'text-gray-400'" x-text="'(' + tabCount('${tab.id}') + ')'"></span>
            </button>
          `).join('')}
        </div>

        <!-- Search -->
        <div class="mb-6">
          <div class="relative max-w-[400px]">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            <input type="text" x-model="searchQuery" placeholder="${t('helpCenter.ticketSearchPlaceholder')}" class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
          </div>
        </div>

        <!-- Ticket Cards -->
        <template x-if="filteredTickets.length > 0">
          <div class="space-y-3">
            <template x-for="ticket in paginatedTickets" :key="ticket.id">
              <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer" @click="toggleTicket(ticket.id)">
                <div class="flex items-center justify-between mb-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-700': ticket.status === 'open',
                      'bg-amber-100 text-amber-700': ticket.status === 'pending',
                      'bg-gray-100 text-gray-600': ticket.status === 'closed'
                    }"
                    x-text="ticket.status === 'open' ? '${t('helpCenter.statusOpen')}' : ticket.status === 'pending' ? '${t('helpCenter.statusPending')}' : '${t('helpCenter.statusResolved')}'">
                  </span>
                  <span class="text-xs text-gray-400" x-text="ticket.createdDate"></span>
                </div>
                <div class="flex items-start gap-2 mb-2">
                  <div class="min-w-0">
                    <h4 class="text-sm font-semibold text-gray-900" x-text="ticket.subject"></h4>
                    <span class="text-xs text-gray-500" x-text="'#' + ticket.id + ' \u00b7 ' + ticket.category"></span>
                  </div>
                </div>
                <template x-if="ticket.snippet">
                  <div class="pt-2 border-t border-gray-100">
                    <p class="text-xs text-gray-500 line-clamp-2" x-text="ticket.snippet"></p>
                  </div>
                </template>

                <!-- Expanded messages -->
                <template x-if="expandedTicket === ticket.id && ticket.messages">
                  <div class="mt-3 pt-3 border-t border-gray-200 space-y-3">
                    <template x-for="(msg, mi) in ticket.messages" :key="mi">
                      <div class="flex gap-3" :class="msg.sender === 'support' ? 'flex-row-reverse' : ''">
                        <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-medium"
                          :class="msg.sender === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'"
                          x-text="msg.sender === 'user' ? 'S' : 'D'">
                        </div>
                        <div class="rounded-lg px-3 py-2 text-sm max-w-[80%]"
                          :class="msg.sender === 'user' ? 'bg-primary-50 text-gray-800' : 'bg-gray-50 text-gray-700'">
                          <p x-text="msg.text"></p>
                          <span class="text-[10px] text-gray-400 mt-1 block" x-text="msg.date"></span>
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </template>

        <!-- Empty State -->
        <template x-if="filteredTickets.length === 0">
          <div class="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>
            <h3 class="text-base font-medium text-gray-700 mb-1">${t('helpCenter.noTickets')}</h3>
            <p class="text-sm text-gray-400">${t('helpCenter.noTicketsDesc')}</p>
          </div>
        </template>

        <!-- Pagination -->
        <template x-if="totalPages > 1">
          <div class="flex items-center justify-center gap-2 mt-8">
            <button @click="setPage(Math.max(1, currentPage - 1))" :disabled="currentPage === 1" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer">${t('helpCenter.previousPage')}</button>
            <template x-for="p in totalPages" :key="p">
              <button @click="setPage(p)" class="w-8 h-8 text-sm rounded-lg transition-colors cursor-pointer" :class="currentPage === p ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'" x-text="p"></button>
            </template>
            <button @click="setPage(Math.min(totalPages, currentPage + 1))" :disabled="currentPage === totalPages" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer">${t('helpCenter.nextPage')}</button>
          </div>
        </template>
      </div>
    </div>
  `;
}
