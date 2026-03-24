/**
 * OrdersPageLayout Component
 * "Siparişlerim" page — 2-panel: left nav + right dynamic content.
 * Supports hash-based sub-pages: #all-orders, #refunds, #reviews, #coupons, #tax-info
 */
import { getBaseUrl } from '../../utils/url';
import { getCurrencyCode, getCurrencySymbol } from '../../utils/currency';
import { t } from '../../i18n';

interface OrdersNavItem {
  id: string;
  label: string;
}

function getNavItems(): OrdersNavItem[] {
  return [
    { id: 'all-orders', label: t('orders.allOrders') },
    { id: 'refunds', label: t('orders.refundsAfterSalesTitle') },
    { id: 'reviews', label: t('orders.reviews') },
    { id: 'coupons', label: t('orders.couponsAndCredits') },
    { id: 'tax-info', label: t('orders.taxInformation') },
  ];
}

/* ────────────────────────────────────────
   SHARED EMPTY ICON (receipt/document)
   ──────────────────────────────────────── */
const EMPTY_RECEIPT_ICON = `
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
    <rect x="12" y="5" width="36" height="46" rx="3" fill="#E5E7EB" stroke="#D1D5DB" stroke-width="1"/>
    <rect x="18" y="14" width="24" height="3" rx="1.5" fill="#D1D5DB"/>
    <rect x="18" y="22" width="18" height="3" rx="1.5" fill="#D1D5DB"/>
    <rect x="18" y="30" width="20" height="3" rx="1.5" fill="#D1D5DB"/>
    <path d="M12 51l4-3 4 3 4-3 4 3 4-3 4 3 4-3 4 3V5H12v46z" fill="#E5E7EB"/>
  </svg>`;

/* ────────────────────────────────────────
   SECTION RENDERERS
   ──────────────────────────────────────── */

function getOrderStatusTabs() {
  return [
    { id: 'all', label: t('common.all') },
    { id: 'confirming', label: t('orders.confirming') },
    { id: 'unpaid', label: t('orders.unpaid') },
    { id: 'preparing', label: t('orders.preparingShipment') },
    { id: 'delivering', label: t('orders.delivering') },
    { id: 'refunds-aftersales', label: t('orders.refundsAfterSales') },
    { id: 'completed-review', label: t('orders.completedReview') },
    { id: 'closed', label: t('orders.closed') },
  ];
}

function renderAllOrders(): string {
  return `
    <div x-data="ordersListComponent()" x-cloak>
      <template x-if="!selectedOrder"><div>
      <!-- Header -->
      <div class="flex items-center justify-between gap-2 px-5 max-sm:px-3 pt-6 max-[480px]:pt-4 pb-5 max-[480px]:pb-3 border-b border-gray-100">
        <h1 class="text-[22px] max-sm:text-lg max-[480px]:text-base font-bold text-gray-900" data-i18n="orders.yourOrders">${t('orders.yourOrders')}</h1>
        <template x-if="filteredOrders.some((o) => o.status === 'Waiting for payment')">
          <button @click="openRemittanceModal(filteredOrders.find((o) => o.status === 'Waiting for payment')?.orderNumber || '')"
            class="px-5 max-sm:px-3 max-[480px]:px-2.5 py-2 text-sm max-sm:text-xs text-gray-700 bg-white border border-gray-300 rounded-full cursor-pointer whitespace-nowrap transition-colors hover:border-gray-400 hover:bg-gray-50">
            ${t('orders.submitRemittanceProof')}
          </button>
        </template>
      </div>

      <!-- Status Tabs — dynamic counts, horizontal scroll -->
      <div class="relative border-b border-gray-200" id="order-tabs-wrapper">
        <!-- Left fade + arrow -->
        <button type="button" id="order-tabs-left" class="absolute left-0 top-0 bottom-0 z-10 w-8 items-center justify-center bg-gradient-to-r from-white via-white/80 to-transparent cursor-pointer border-none hidden" aria-label="Scroll left">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <!-- Scrollable tab container -->
        <div class="overflow-x-auto scrollbar-hide" id="order-tabs-scroll">
          <div class="flex px-7 max-sm:px-3 min-w-max">
            ${getOrderStatusTabs().map(tab => `
              <button
                @click="activeTab = '${tab.id}'"
                :class="activeTab === '${tab.id}'
                  ? 'text-gray-900 border-b-2 border-gray-900 font-medium'
                  : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700'"
                class="py-3 px-4 max-sm:px-2.5 text-sm max-sm:text-xs whitespace-nowrap transition-colors bg-transparent cursor-pointer"
              >
                ${tab.label}<template x-if="tabCount('${tab.id}') > 0"><span class="text-gray-400 ml-0.5" x-text="'(' + tabCount('${tab.id}') + ')'"></span></template>
              </button>
            `).join('')}
          </div>
        </div>
        <!-- Right fade + arrow -->
        <button type="button" id="order-tabs-right" class="absolute right-0 top-0 bottom-0 z-10 w-8 items-center justify-center bg-gradient-to-l from-white via-white/80 to-transparent cursor-pointer border-none hidden" aria-label="Scroll right">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <!-- Search & Filter Bar -->
      <div class="flex items-center gap-2.5 px-5 max-sm:px-3 py-4 flex-wrap">
        <!-- Search Input -->
        <div class="relative flex-1 min-w-[180px] max-w-[380px] max-sm:max-w-full max-sm:min-w-full">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            x-model.debounce.300ms="searchQuery"
            @keydown.escape="searchQuery = ''"
            placeholder="${t('orders.searchPlaceholder')}"
            class="w-full h-9 pl-9 pr-8 text-sm text-gray-700 border border-gray-300 rounded-lg outline-none bg-white placeholder:text-gray-400 transition-colors focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
            :class="searchQuery.trim() ? 'border-amber-400! ring-1! ring-amber-200!' : ''"
          />
          <button
            x-show="searchQuery.trim()"
            @click="searchQuery = ''"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none transition-colors p-0"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Order Date Dropdown -->
        <div class="relative">
          <button
            @click="dateOpen = !dateOpen; timeOpen = false"
            class="flex items-center gap-2 h-9 px-3 text-sm border rounded-lg cursor-pointer transition-colors whitespace-nowrap"
            :class="dateFilter !== 'all' && dateFilter !== 'custom'
              ? 'text-amber-700 bg-amber-50 border-amber-300 hover:bg-amber-100'
              : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'"
          >
            <span x-text="dateFilterLabel"></span>
            <svg class="w-3.5 h-3.5 transition-transform" :class="dateOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          <div
            x-show="dateOpen"
            @click.outside="dateOpen = false"
            x-transition:enter="transition ease-out duration-150"
            x-transition:enter-start="opacity-0 translate-y-1"
            x-transition:enter-end="opacity-100 translate-y-0"
            x-transition:leave="transition ease-in duration-100"
            x-transition:leave-start="opacity-100 translate-y-0"
            x-transition:leave-end="opacity-0 translate-y-1"
            class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[160px]"
          >
            <button @click="setDateFilter('all')"
              class="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer bg-transparent border-none transition-colors"
              :class="dateFilter === 'all' ? 'text-amber-700 font-medium' : 'text-gray-700'"
            >
              ${t('orders.allDates')}
              <svg x-show="dateFilter === 'all'" class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </button>
            <button @click="setDateFilter('7d')"
              class="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer bg-transparent border-none transition-colors"
              :class="dateFilter === '7d' ? 'text-amber-700 font-medium' : 'text-gray-700'"
            >
              ${t('orders.last7Days')}
              <svg x-show="dateFilter === '7d'" class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </button>
            <button @click="setDateFilter('30d')"
              class="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer bg-transparent border-none transition-colors"
              :class="dateFilter === '30d' ? 'text-amber-700 font-medium' : 'text-gray-700'"
            >
              ${t('orders.last30Days')}
              <svg x-show="dateFilter === '30d'" class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </button>
            <button @click="setDateFilter('90d')"
              class="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer bg-transparent border-none transition-colors"
              :class="dateFilter === '90d' ? 'text-amber-700 font-medium' : 'text-gray-700'"
            >
              ${t('orders.last90Days')}
              <svg x-show="dateFilter === '90d'" class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </button>
          </div>
        </div>

        <!-- Time Range Picker -->
        <div class="relative">
          <button
            @click="timeOpen = !timeOpen; dateOpen = false"
            class="flex items-center gap-2 h-9 px-3 text-sm border rounded-lg cursor-pointer transition-colors whitespace-nowrap"
            :class="dateFilter === 'custom'
              ? 'text-amber-700 bg-amber-50 border-amber-300 hover:bg-amber-100'
              : 'text-gray-400 bg-white border-gray-300 hover:bg-gray-50'"
          >
            <span x-text="timeRangeLabel"></span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </button>
          <div
            x-show="timeOpen"
            @click.outside="timeOpen = false"
            x-transition:enter="transition ease-out duration-150"
            x-transition:enter-start="opacity-0 translate-y-1"
            x-transition:enter-end="opacity-100 translate-y-0"
            x-transition:leave="transition ease-in duration-100"
            x-transition:leave-start="opacity-100 translate-y-0"
            x-transition:leave-end="opacity-0 translate-y-1"
            class="absolute top-full right-0 max-sm:left-0 max-sm:right-auto mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 min-w-[280px]"
          >
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">${t('orders.selectDateRange')}</p>
            <div class="flex items-center gap-2 mb-3">
              <div class="flex-1">
                <label class="block text-xs text-gray-500 mb-1">${t('orders.startDate')}</label>
                <input type="date" x-model="dateFrom"
                  class="w-full h-9 px-2 text-sm border border-gray-300 rounded-lg outline-none bg-white text-gray-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-200" />
              </div>
              <span class="text-gray-300 mt-4">—</span>
              <div class="flex-1">
                <label class="block text-xs text-gray-500 mb-1">${t('orders.endDate')}</label>
                <input type="date" x-model="dateTo"
                  class="w-full h-9 px-2 text-sm border border-gray-300 rounded-lg outline-none bg-white text-gray-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-200" />
              </div>
            </div>
            <div class="flex items-center justify-end gap-2">
              <button @click="clearTimeRange()"
                class="px-3 py-1.5 text-xs text-gray-500 bg-transparent border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                ${t('common.clear')}
              </button>
              <button @click="applyTimeRange()"
                class="px-3 py-1.5 text-xs text-white bg-gray-900 border border-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                :class="!(dateFrom || dateTo) ? 'opacity-40 cursor-not-allowed' : ''"
                :disabled="!(dateFrom || dateTo)">
                ${t('common.apply')}
              </button>
            </div>
          </div>
        </div>

        <!-- Active filter badges -->
        <template x-if="dateFilter !== 'all' || searchQuery.trim()">
          <button @click="searchQuery = ''; dateFilter = 'all'; dateFrom = ''; dateTo = ''; activeTab = 'all'"
            class="flex items-center gap-1 h-8 px-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-full cursor-pointer hover:bg-red-100 transition-colors whitespace-nowrap">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
            ${t('orders.clearAllFilters')}
          </button>
        </template>
      </div>

      <!-- Info Banner -->
      <div class="mx-7 max-sm:mx-3 max-[480px]:mx-2 mb-4 px-4 max-[480px]:px-3 py-3 bg-amber-50 border border-amber-200 rounded-sm">
        <div class="flex items-start gap-2.5">
          <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9l1.5-1.5L6 9V5.5a2.5 2.5 0 015 0V9l1.5-1.5L14 9v5a7 7 0 01-14 0V9z" opacity="0"/>
            <path d="M12 2C8.14 2 5 5.14 5 9v5l-2 2v1h18v-1l-2-2V9c0-3.86-3.14-7-7-7zm0 20c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/>
          </svg>
          <div class="text-[13px] text-gray-700 leading-relaxed">
            <p class="mb-1"><strong>1.</strong> ${t('orders.bannerRemittance')} <a href="#" class="text-blue-600 hover:underline">${t('orders.bannerHowTo')}</a></p>
            <p><strong>2.</strong> ${t('orders.bannerHolidayDelay')}</p>
          </div>
        </div>
      </div>

      <!-- Search result info -->
      <template x-if="searchQuery.trim() || dateFilter !== 'all'">
        <div class="px-7 max-sm:px-3 pb-3">
          <p class="text-sm text-gray-500">
            <span x-text="filteredOrders.length"></span> ${t('orders.resultsFound')}
            <template x-if="searchQuery.trim()">
              <span> &mdash; &quot;<strong class="text-gray-700" x-text="searchQuery.trim()"></strong>&quot; ${t('orders.searchFor')}</span>
            </template>
            <template x-if="dateFilter !== 'all' && dateFilter !== 'custom'">
              <span> &mdash; <span x-text="dateFilterLabel"></span></span>
            </template>
            <template x-if="dateFilter === 'custom'">
              <span> &mdash; <span x-text="timeRangeLabel"></span></span>
            </template>
          </p>
        </div>
      </template>

      <!-- Loading Indicator -->
      <template x-if="loading">
        <div class="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <p class="text-sm text-gray-500">${t('orders.loadingOrders') || 'Siparişler yükleniyor...'}</p>
        </div>
      </template>

      <!-- Orders List -->
      <div x-show="!loading" class="px-7 max-sm:px-3 max-[480px]:px-2 pb-6 space-y-4 max-[480px]:space-y-3">
        <template x-if="filteredOrders.length === 0">
          <div class="flex flex-col items-center justify-center gap-3 py-16 text-center">
            ${EMPTY_RECEIPT_ICON}
            <template x-if="searchQuery.trim() || dateFilter !== 'all'">
              <div class="flex flex-col items-center gap-2">
                <h3 class="text-base font-bold text-gray-900">${t('orders.noOrdersFound')}</h3>
                <p class="text-sm text-gray-500 max-w-[400px]">${t('orders.tryDifferentKeywords')}</p>
                <button @click="searchQuery = ''; dateFilter = 'all'; dateFrom = ''; dateTo = ''; activeTab = 'all'"
                  class="inline-block px-6 py-2 text-sm text-amber-700 border border-amber-300 rounded-full no-underline mt-2 transition-colors hover:bg-amber-50 cursor-pointer bg-transparent">
                  ${t('orders.clearFilters')}
                </button>
              </div>
            </template>
            <template x-if="!searchQuery.trim() && dateFilter === 'all'">
              <div class="flex flex-col items-center gap-2">
                <h3 class="text-base font-bold text-gray-900">${t('orders.noOrdersYet')}</h3>
                <p class="text-sm text-gray-500 max-w-[400px]">${t('orders.startSourcingDesc')}</p>
                <a href="/" class="th-btn-outline th-btn-pill mt-2">${t('orders.startSourcing')}</a>
              </div>
            </template>
          </div>
        </template>

        <template x-for="order in filteredOrders" :key="order.id">
          <div class="border border-gray-200 rounded-lg overflow-hidden bg-white">

            <!-- ── Card Header ── -->
            <div class="px-5 max-sm:px-3 py-3 bg-[#FAFAFA] border-b border-gray-200">
              <div class="flex items-center justify-between gap-3 max-[480px]:gap-2 flex-wrap">
                <!-- Left: Order info -->
                <div class="flex items-center gap-2 text-[13px] max-[480px]:text-xs text-gray-500 flex-wrap max-sm:gap-1.5">
                  <span class="inline-flex items-center gap-1 font-semibold text-gray-800">
                    <svg class="w-4 h-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                    <span x-text="order.orderNumber"></span>
                  </span>
                  <span class="text-gray-300">|</span>
                  <span x-text="order.orderDate" class="max-sm:hidden"></span>
                  <span class="text-gray-300 max-sm:hidden">|</span>
                  <span class="max-[380px]:hidden">${t('orders.supplierLabel')}: <strong class="text-gray-700" x-text="order.seller"></strong></span>
                </div>
                <!-- Right: Status + Cancel + Total -->
                <div class="flex items-center gap-2 max-[480px]:gap-1.5">
                  <button @click="cancellingOrder = order; openModal('showCancelOrder')" class="text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer transition-colors text-xs whitespace-nowrap">
                    ${t('orders.cancelOrderBtn')}
                  </button>
                  <span class="text-gray-300">|</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 max-[480px]:px-1.5 rounded text-[11px] max-[480px]:text-[10px] font-bold uppercase tracking-wide"
                        :class="order.statusColor === 'text-amber-600' ? 'bg-amber-100 text-amber-700'
                              : order.statusColor === 'text-green-600' ? 'bg-green-100 text-green-700'
                              : order.statusColor === 'text-blue-600' ? 'bg-blue-100 text-blue-700'
                              : order.statusColor === 'text-red-600' ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'"
                        x-text="order.status"></span>
                  <span class="text-[15px] max-[480px]:text-[13px] font-bold text-gray-900" x-text="order.currency + ' ' + order.total"></span>
                </div>
              </div>
            </div>

            <!-- ── Product Rows ── -->
            <div class="divide-y divide-gray-100">
              <template x-for="product in order.products" :key="product.name">
                <div class="flex items-center gap-4 max-sm:gap-3 px-5 max-sm:px-3 py-3.5">
                  <!-- Image -->
                  <div class="w-[60px] h-[60px] max-sm:w-12 max-sm:h-12 rounded-md border border-gray-100 overflow-hidden shrink-0 bg-gray-50">
                    <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'flex items-center justify-center w-full h-full text-gray-300\\'><svg class=\\'w-6 h-6\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\' viewBox=\\'0 0 24 24\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><path d=\\'M21 15l-5-5L5 21\\'/></svg></div>'" />
                  </div>
                  <!-- Name + Specs -->
                  <div class="flex-1 min-w-0">
                    <a href="#" class="text-sm text-gray-800 hover:text-blue-600 transition-colors line-clamp-1 leading-snug" x-text="product.name"></a>
                    <p class="text-xs text-gray-400 mt-1 truncate" x-text="product.variation"></p>
                  </div>
                  <!-- Price & Qty -->
                  <div class="text-right shrink-0 max-sm:hidden">
                    <p class="text-sm font-medium text-gray-800" x-text="order.currency + ' ' + product.unitPrice"></p>
                    <p class="text-xs text-gray-400 mt-0.5" x-text="'x' + product.quantity"></p>
                  </div>
                </div>
              </template>
            </div>

            <!-- ── Action Bar ── -->
            <div class="flex flex-wrap items-center justify-between gap-3 max-[480px]:gap-2 px-5 max-sm:px-3 py-3 border-t border-gray-200 bg-[#FAFAFA]">
              <!-- Link -->
              <a :href="'${getBaseUrl()}pages/dashboard/messages.html?seller=' + encodeURIComponent(order.seller)" class="text-gray-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors whitespace-nowrap text-[13px] max-[480px]:text-xs">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                ${t('orders.contactSupplier')}
              </a>
              <!-- Buttons -->
              <div class="flex items-center gap-2.5 max-[480px]:w-full">
                <button @click="viewDetail(order)" class="h-9 px-5 max-[480px]:px-3 max-[480px]:flex-1 text-[13px] max-[480px]:text-xs text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer font-medium whitespace-nowrap transition-colors hover:border-gray-400 hover:bg-gray-50">
                  ${t('orders.viewDetails')}
                </button>
                <template x-if="canPay(order)">
                  <button @click="openRemittanceModal(order.orderNumber)" class="h-9 px-5 max-[480px]:px-3 max-[480px]:flex-1 text-[13px] max-[480px]:text-xs font-medium text-white bg-(--color-cta-primary) border border-(--color-cta-primary) rounded-lg cursor-pointer whitespace-nowrap transition-colors hover:bg-(--color-cta-primary-hover)">
                    ${t('orders.makePayment')}
                  </button>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Pagination -->
      <div x-show="filteredOrders.length > 0" class="flex items-center justify-end gap-3 px-7 max-sm:px-3 pb-6">
        <span class="text-sm text-gray-500" x-text="filteredOrders.length + ' ${t('orders.ordersCount')}'"></span>
        <div class="flex items-center gap-1.5">
          <button class="flex items-center justify-center w-8 h-8 border border-gray-300 rounded bg-white text-gray-400 cursor-not-allowed" disabled>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <span class="flex items-center justify-center w-8 h-8 text-sm text-white bg-gray-900 rounded font-medium">1</span>
          <button class="flex items-center justify-center w-8 h-8 border border-gray-300 rounded bg-white text-gray-400 cursor-not-allowed" disabled>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
      </div></template>

      <!-- ════════════════════════════════════════
           ORDER DETAIL VIEW
           ════════════════════════════════════════ -->
      <template x-if="selectedOrder"><div>

        <!-- Back Button -->
        <div class="px-7 max-sm:px-3 pt-5 pb-2">
          <button @click="backToList()" class="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 bg-transparent border-none cursor-pointer transition-colors p-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M15 19l-7-7 7-7"/></svg>
            ${t('orders.backToOrders')}
          </button>
        </div>

        <!-- Section 1: Breadcrumb + Header -->
        <div class="px-7 max-sm:px-3 pt-2 pb-5 border-b border-gray-100">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <a href="/" class="hover:text-gray-600 transition-colors">${t('common.home')}</a>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M9 5l7 7-7 7"/></svg>
            <a href="/pages/dashboard/orders.html" class="hover:text-gray-600 transition-colors">${t('orders.orderManagement')}</a>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M9 5l7 7-7 7"/></svg>
            <span class="text-gray-600">${t('orders.orderDetails')}</span>
          </nav>

          <div class="flex items-start justify-between gap-4 max-sm:flex-col max-sm:gap-3">
            <div>
              <h1 class="text-[22px] max-sm:text-lg font-bold text-gray-900 mb-2">${t('orders.orderDetails')}</h1>
              <div class="flex items-center gap-3 flex-wrap max-sm:gap-2">
                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-amber-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  <span class="text-sm font-medium text-gray-800" x-text="selectedOrder.orderNumber"></span>
                </div>
                <button @click="copyOrderNumber()" class="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer transition-colors p-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  <span x-text="copiedNumber ? '${t('orders.copied')}' : '${t('orders.copy')}'"></span>
                </button>
                <span class="text-gray-300 max-sm:hidden">|</span>
                <span class="text-sm text-gray-500" x-text="'${t('orders.orderDateLabel')} ' + selectedOrder.orderDate"></span>
              </div>
            </div>
            <a href="#" class="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>
              ${t('orders.downloadDetails')}
            </a>
          </div>
        </div>

        <!-- Section 2: Progress Stepper -->
        <div class="px-7 max-sm:px-3 py-6 border-b border-gray-100">
          <!-- Cancelled banner -->
          <template x-if="isCancelled(selectedOrder)">
            <div class="flex items-center justify-center gap-2 py-3 px-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
              <svg class="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"/></svg>
              <span class="text-sm font-medium text-red-700">${t('orders.orderCancelled') || 'Bu sipariş iptal edilmiştir'}</span>
            </div>
          </template>
          <!-- Normal stepper (only for non-cancelled orders) -->
          <template x-if="!isCancelled(selectedOrder)">
            <div class="flex items-center justify-between max-w-2xl mx-auto max-sm:max-w-full">
              <!-- Step 1: Siparis -->
              <div class="flex flex-col items-center gap-1.5 relative z-10">
                <div class="w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                     :class="getStepIndex(selectedOrder) >= 0 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'">1</div>
                <span class="text-xs max-sm:text-[10px] text-gray-600 whitespace-nowrap">${t('orders.stepOrder')}</span>
              </div>
              <div class="flex-1 h-0.5 -mt-4 max-sm:-mt-3" :class="getStepIndex(selectedOrder) >= 1 ? 'bg-amber-500' : 'bg-gray-200'"></div>
              <!-- Step 2: Ödeme -->
              <div class="flex flex-col items-center gap-1.5 relative z-10">
                <div class="w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                     :class="getStepIndex(selectedOrder) >= 1 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'">2</div>
                <span class="text-xs max-sm:text-[10px] text-gray-600 whitespace-nowrap">${t('orders.stepPayment')}</span>
              </div>
              <div class="flex-1 h-0.5 -mt-4 max-sm:-mt-3" :class="getStepIndex(selectedOrder) >= 2 ? 'bg-amber-500' : 'bg-gray-200'"></div>
              <!-- Step 3: Kargolama -->
              <div class="flex flex-col items-center gap-1.5 relative z-10">
                <div class="w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                     :class="getStepIndex(selectedOrder) >= 2 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'">3</div>
                <span class="text-xs max-sm:text-[10px] text-gray-600 whitespace-nowrap">${t('orders.stepShipping')}</span>
              </div>
              <div class="flex-1 h-0.5 -mt-4 max-sm:-mt-3" :class="getStepIndex(selectedOrder) >= 3 ? 'bg-amber-500' : 'bg-gray-200'"></div>
              <!-- Step 4: Teslimat -->
              <div class="flex flex-col items-center gap-1.5 relative z-10">
                <div class="w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                     :class="getStepIndex(selectedOrder) >= 3 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'">4</div>
                <span class="text-xs max-sm:text-[10px] text-gray-600 whitespace-nowrap">${t('orders.stepDelivery')}</span>
              </div>
              <div class="flex-1 h-0.5 -mt-4 max-sm:-mt-3" :class="getStepIndex(selectedOrder) >= 4 ? 'bg-amber-500' : 'bg-gray-200'"></div>
              <!-- Step 5: Degerlendirme -->
              <div class="flex flex-col items-center gap-1.5 relative z-10">
                <div class="w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                     :class="getStepIndex(selectedOrder) >= 4 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'">5</div>
                <span class="text-xs max-sm:text-[10px] text-gray-600 whitespace-nowrap">${t('orders.stepReview')}</span>
              </div>
            </div>
          </template>
        </div>

        <!-- Section 3: Status -->
        <div class="px-7 max-sm:px-3 py-5 border-b border-gray-100">
          <p class="text-base font-bold mb-1" :class="selectedOrder.statusColor" x-text="selectedOrder.status"></p>
          <p class="text-sm text-gray-500" x-text="selectedOrder.statusDescription"></p>
        </div>

        <!-- Info Box: Inspection + Payment Info -->
        <div class="px-7 max-sm:px-3 py-5 border-b border-gray-100">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <!-- Inspection services -->
            <div class="flex items-center gap-3 flex-wrap">
              <span class="text-sm text-gray-700">${t('orders.inspectionServicesBy')}</span>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2 py-0.5 text-xs font-bold text-blue-800 bg-blue-100 rounded">SGS</span>
                <span class="inline-flex items-center px-2 py-0.5 text-xs font-bold text-red-800 bg-red-100 rounded">BV</span>
                <span class="inline-flex items-center px-2 py-0.5 text-xs font-bold text-green-800 bg-green-100 rounded">TÜV</span>
              </div>
              <a href="#" class="text-sm text-blue-600 hover:underline">${t('common.learnMore')} &gt;</a>
            </div>
            <!-- Payment amount / Refund status -->
            <template x-if="selectedOrder.refundStatus === 'Approved'">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/></svg>
                <span class="text-sm text-purple-700 font-semibold">İade onaylandı — <span x-text="selectedOrder.currency + ' ' + Number(selectedOrder.total).toLocaleString('tr-TR', {minimumFractionDigits: 2})"></span> iade edildi.</span>
              </div>
            </template>
            <template x-if="selectedOrder.refundStatus !== 'Approved'">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
                </svg>
                <span class="text-sm text-gray-800">${t('orders.yourPaymentAmount')}: <strong x-text="selectedOrder.currency + ' ' + selectedOrder.total"></strong></span>
              </div>
            </template>
            <!-- Notes -->
            <ul class="text-xs text-gray-600 space-y-1 pl-4 list-disc">
              <li>${t('orders.orderTermsNote')}</li>
              <li>${t('orders.onlinePaymentProtected')}</li>
            </ul>
          </div>

          <!-- Action Buttons (status-aware) -->
          <div class="flex items-center gap-3 mt-4 flex-wrap" x-show="isActionable(selectedOrder)">
            <template x-if="canPay(selectedOrder)">
              <button @click="openRemittanceModal(selectedOrder.orderNumber)" class="th-btn th-btn-pill">
                ${t('orders.makePayment')}
              </button>
            </template>
            <button @click="openModal('showModifyShipping')" class="th-btn-outline th-btn-pill">
              ${t('orders.modifyShippingDetails')}
            </button>
            <template x-if="canCancel(selectedOrder)">
              <button @click="openModal('showCancelOrder')" class="th-btn-outline th-btn-pill">
                ${t('orders.cancelOrderBtn')}
              </button>
            </template>
          </div>
        </div>

        <!-- Section 4: Ürün detayları -->
        <div class="px-7 max-sm:px-3 py-5 border-b border-gray-100">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <h2 class="text-base font-bold text-gray-900">${t('orders.productDetails')}</h2>
          </div>
          <div class="flex items-center gap-2 mb-4 text-sm">
            <span class="text-gray-500">${t('orders.seller')}:</span>
            <span class="font-medium text-gray-800" x-text="selectedOrder.seller"></span>
            <a href="#" class="text-blue-600 hover:underline text-sm">${t('orders.chatNow')}</a>
          </div>

          <!-- Products Table -->
          <div class="overflow-x-auto -mx-3 px-3">
            <table class="w-full min-w-[560px] border-collapse">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">${t('orders.productName')}</th>
                  <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">${t('orders.specifications')}</th>
                  <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">${t('orders.unitPrice')}</th>
                  <th class="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">${t('orders.quantity')}</th>
                  <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3">${t('orders.total')}</th>
                </tr>
              </thead>
              <tbody>
                <template x-for="product in selectedOrder.products" :key="product.name">
                  <tr class="border-b border-gray-100">
                    <td class="py-3 pr-4">
                      <div class="flex items-center gap-3">
                        <div class="w-14 h-14 max-sm:w-10 max-sm:h-10 rounded border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
                          <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                        </div>
                        <span class="text-sm text-gray-800 line-clamp-2 leading-snug" x-text="product.name"></span>
                      </div>
                    </td>
                    <td class="py-3 pr-4 text-sm text-gray-600" x-text="product.variation"></td>
                    <td class="py-3 pr-4 text-sm text-gray-800 text-right whitespace-nowrap">${getCurrencyCode()} <span x-text="product.unitPrice"></span></td>
                    <td class="py-3 pr-4 text-sm text-gray-800 text-center" x-text="product.quantity"></td>
                    <td class="py-3 text-sm font-medium text-gray-900 text-right whitespace-nowrap">${getCurrencyCode()} <span x-text="product.totalPrice"></span></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <!-- Summary Row -->
          <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
            <span class="text-sm text-gray-500">${t('orders.productQuantity')}: <strong class="text-gray-800" x-text="selectedOrder.products.reduce((s, p) => s + p.quantity, 0)"></strong></span>
            <span class="text-sm text-gray-500">${t('orders.totalPrice')}: <strong class="text-gray-900" x-text="'${getCurrencyCode()} ' + selectedOrder.products.reduce((s, p) => { const v = parseFloat(String(p.totalPrice).replace(/,/g, '')); return s + (isNaN(v) ? 0 : v); }, 0).toLocaleString('en-US', {minimumFractionDigits:2})"></strong></span>
          </div>
        </div>

        <!-- Section 5: Kargo detayları -->
        <div class="px-7 max-sm:px-3 py-5 border-b border-gray-100">
          <div class="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
              </svg>
              <h2 class="text-base font-bold text-gray-900">${t('orders.shippingDetails')}</h2>
            </div>
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full"
                    :class="selectedOrder.shipping.trackingStatus === 'Kargo yolda' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'"
                    x-text="selectedOrder.shipping.trackingStatus"></span>
              <button @click="openModal('showTrackPackage')" class="text-sm text-blue-600 hover:underline whitespace-nowrap bg-transparent border-none cursor-pointer p-0">${t('orders.trackShipments')} &gt;</button>
              <button @click="openModal('showModifyShipping')" class="text-sm text-blue-600 hover:underline whitespace-nowrap bg-transparent border-none cursor-pointer p-0">${t('orders.modifyShippingDetails')}</button>
            </div>
          </div>

          <div class="grid grid-cols-4 max-sm:grid-cols-1 gap-4 max-sm:gap-3">
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">${t('orders.deliveryAddress')}</p>
              <p class="text-sm text-gray-700 leading-relaxed" x-text="selectedOrder.shipping.address"></p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">${t('orders.shipFromCountry')}</p>
              <p class="text-sm text-gray-700" x-text="selectedOrder.shipping.shipFrom"></p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">${t('orders.shippingMethod')}</p>
              <p class="text-sm text-gray-700 whitespace-pre-line" x-text="selectedOrder.shipping.method"></p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Incoterms</p>
              <p class="text-sm text-gray-700" x-text="selectedOrder.shipping.incoterms"></p>
            </div>
          </div>
        </div>

        <!-- Section 6: Ödeme detayları -->
        <div class="px-7 max-sm:px-3 py-5 border-b border-gray-100">
          <div class="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>
              </svg>
              <h2 class="text-base font-bold text-gray-900">${t('orders.paymentDetails')}</h2>
            </div>
            <div class="flex items-center gap-2">
              <button @click="openModal('showPaymentHistory')" class="px-4 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
                ${t('orders.paymentHistoryTitle')}
              </button>
              <div class="relative" x-data="{ moreOpen: false }">
                <button @click="moreOpen = !moreOpen" class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 bg-transparent border border-gray-200 rounded-full cursor-pointer transition-colors">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="4" cy="10" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="16" cy="10" r="2"/></svg>
                </button>
                <div x-show="moreOpen" @click.outside="moreOpen = false" x-transition class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1 min-w-[160px]">
                  <button @click="downloadInvoice(selectedOrder); moreOpen = false" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 bg-transparent border-none cursor-pointer flex items-center gap-2">
                    <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    ${t('orders.downloadInvoice')}
                  </button>
                  <button @click="openRefundModal(selectedOrder); moreOpen = false" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 bg-transparent border-none cursor-pointer flex items-center gap-2">
                    <svg class="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                    ${t('orders.requestRefund')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-6 max-sm:gap-4">
            <!-- Left: Payment status -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full"
                    :class="selectedOrder.payment.status === 'Paid' ? 'bg-green-50 text-green-700' :
                            selectedOrder.payment.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                            selectedOrder.payment.status === 'Refunded' ? 'bg-purple-50 text-purple-700' :
                            'bg-amber-50 text-amber-700'">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                       x-show="selectedOrder.payment.status === 'Paid'"><path stroke-linecap="round" d="M5 13l4 4L19 7"/></svg>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                       x-show="selectedOrder.payment.status === 'Refunded'"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                       x-show="selectedOrder.payment.status !== 'Paid' && selectedOrder.payment.status !== 'Refunded'"><path stroke-linecap="round" d="M12 8v4m0 4h.01"/><circle cx="12" cy="12" r="10"/></svg>
                  <span x-text="selectedOrder.payment.status === 'Paid' ? 'Ödendi' : selectedOrder.payment.status === 'Refunded' ? 'İade Edildi' : selectedOrder.payment.status === 'Unpaid' ? 'Ödenmedi' : selectedOrder.payment.status"></span>
                </span>
              </div>
              <template x-if="selectedOrder.payment.hasRecord">
                <a href="#" class="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  ${t('orders.viewPaymentHistory')}
                </a>
              </template>
              <template x-if="!selectedOrder.payment.hasRecord">
                <p class="text-sm text-gray-400">${t('orders.noPaymentRecord')}</p>
              </template>
            </div>

            <!-- Right: Summary table -->
            <div class="bg-gray-50 rounded-lg p-4 max-sm:p-3">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">${t('orders.subtotal')}</span>
                  <span class="text-gray-800">${getCurrencyCode()} <span x-text="selectedOrder.payment.subtotal"></span></span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">${t('orders.shippingFee')}</span>
                  <span class="text-gray-800">${getCurrencyCode()} <span x-text="selectedOrder.payment.shippingFee"></span></span>
                </div>
                <div class="border-t border-gray-200 pt-2.5 flex items-center justify-between text-sm">
                  <span class="text-gray-500">${t('orders.subtotal')}</span>
                  <span class="text-gray-800">${getCurrencyCode()} <span x-text="selectedOrder.payment.grandTotal"></span></span>
                </div>
                <div class="flex items-center justify-between text-base font-bold">
                  <span class="text-gray-900">${t('orders.grandTotal')}*</span>
                  <span class="text-gray-900">${getCurrencyCode()} <span x-text="selectedOrder.payment.grandTotal"></span></span>
                </div>
              </div>
              <p class="text-[11px] text-gray-400 mt-3 leading-relaxed">${t('orders.totalDisclaimer')}</p>
            </div>
          </div>
        </div>

        <!-- Section 7: Tedarikçi detayları -->
        <div class="px-7 max-sm:px-3 py-5 border-b border-gray-100">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <h2 class="text-base font-bold text-gray-900">${t('orders.supplierDetails')}</h2>
          </div>

          <div class="grid grid-cols-4 max-sm:grid-cols-2 max-[380px]:grid-cols-1 gap-4 max-sm:gap-3 mb-4">
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">${t('orders.supplier')}</p>
              <p class="text-sm font-medium text-gray-800" x-text="selectedOrder.supplier.name"></p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">${t('orders.contactName')}</p>
              <p class="text-sm text-gray-700" x-text="selectedOrder.supplier.contact"></p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">${t('orders.phone')}</p>
              <p class="text-sm text-gray-700" x-text="selectedOrder.supplier.phone"></p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">${t('orders.email')}</p>
              <p class="text-sm text-gray-700 break-all" x-text="selectedOrder.supplier.email"></p>
            </div>
          </div>

          <div class="flex items-center gap-4 max-sm:gap-3">
            <a href="#" class="text-sm text-blue-600 hover:underline">${t('orders.visitStore')}</a>
            <span class="text-gray-300">|</span>
            <a href="#" class="text-sm text-blue-600 hover:underline">${t('orders.chatNow')}</a>
          </div>
        </div>

        <!-- Section 8: iSTOC TradeHub sipariş koruması -->
        <div class="px-7 max-sm:px-3 py-5 border-b border-gray-100">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-5 h-5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            <h2 class="text-base font-bold text-gray-900">${t('orders.orderProtection')}</h2>
          </div>

          <div class="space-y-4 max-sm:space-y-3">
            <div class="flex items-start gap-3 max-sm:gap-2">
              <svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 mb-0.5">${t('orders.securePayments')}</p>
                <p class="text-xs text-gray-500 leading-relaxed">${t('orders.securePaymentsDesc')}</p>
                <a href="#" class="text-xs text-blue-600 hover:underline mt-1 inline-block">${t('orders.viewDetails')}</a>
              </div>
            </div>

            <div class="flex items-start gap-3 max-sm:gap-2">
              <svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 mb-0.5">${t('orders.refundGuarantee')}</p>
                <p class="text-xs text-gray-500 leading-relaxed">${t('orders.refundGuaranteeDesc')}</p>
                <a href="#" class="text-xs text-blue-600 hover:underline mt-1 inline-block">${t('orders.viewDetails')}</a>
              </div>
            </div>

            <p class="text-[11px] text-gray-400 leading-relaxed pl-8 max-sm:pl-7">${t('orders.tradeAssuranceNote')}</p>
          </div>
        </div>

        <!-- Section 9: Production Monitoring & Inspection Services -->
        <div class="px-7 max-sm:px-3 py-5 border-b border-gray-100">
          <div class="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              <h2 class="text-base font-bold text-gray-900">${t('orders.productionMonitoringTitle')}</h2>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p class="text-sm text-gray-700 mb-1">${t('orders.ensureProductQuality')}</p>
              <p class="text-xs text-gray-500">${t('orders.asLowAs')} <strong class="text-amber-600">${getCurrencyCode()} 48.00</strong></p>
            </div>
            <button @click="openModal('showAddServices')" class="th-btn th-btn-pill whitespace-nowrap">
              ${t('orders.addServices')}
            </button>
          </div>
        </div>

        <!-- Section 10: Action Buttons -->
        <div class="px-7 max-sm:px-3 py-5 flex items-center gap-3 flex-wrap">
          <button @click="openModal('showOperationHistory')" class="th-btn-outline th-btn-pill whitespace-nowrap">
            ${t('orders.operationHistory')}
          </button>
          <button class="th-btn-outline th-btn-pill whitespace-nowrap">
            ${t('orders.viewContract')}
          </button>
        </div>

      <!-- ═══════════════════════════════════════
           MODALS
           ═══════════════════════════════════════ -->

      <!-- Modal 1: Operation History -->
      <template x-if="showOperationHistory">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @keydown.escape.window="closeModal('showOperationHistory')">
          <div class="absolute inset-0 bg-black/50" @click="closeModal('showOperationHistory')"></div>
          <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden" @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-bold text-gray-900">${t('orders.operationHistory')}</h3>
              <button @click="closeModal('showOperationHistory')" class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer rounded-full hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <!-- Body — Dynamic timeline based on order status -->
            <div class="px-6 py-5 overflow-y-auto max-h-[60vh]">
              <div class="relative pl-6 border-l-2 border-gray-200 space-y-6">
                <!-- Step 1: Order submitted (always) -->
                <div class="relative">
                  <div class="absolute -left-[25px] top-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></div>
                  <p class="text-sm font-medium text-gray-900">${t('orders.orderSubmitted')}</p>
                  <p class="text-xs text-gray-500 mt-0.5" x-text="selectedOrder.orderDate"></p>
                  <p class="text-xs text-gray-400 mt-1" x-text="'${t('orders.orderPrefix')} ' + selectedOrder.orderNumber"></p>
                </div>

                <!-- Cancelled -->
                <template x-if="selectedOrder.status === 'Cancelled'">
                  <div class="relative">
                    <div class="absolute -left-[25px] top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    <p class="text-sm font-medium text-red-600">${t('orders.orderCancelled')}</p>
                    <p class="text-xs text-gray-400 mt-1" x-text="selectedOrder.statusDescription"></p>
                  </div>
                </template>

                <!-- Normal flow steps -->
                <template x-if="selectedOrder.status !== 'Cancelled'">
                  <div class="space-y-6">
                    <!-- Step 2: Payment -->
                    <div class="relative">
                      <div class="absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 border-white"
                           :class="getStepIndex(selectedOrder) >= 1 ? 'bg-amber-500' : 'bg-gray-300'"></div>
                      <p class="text-sm font-medium" :class="getStepIndex(selectedOrder) >= 1 ? 'text-gray-900' : 'text-gray-400'"
                         x-text="getStepIndex(selectedOrder) === 0 ? '${t('orders.awaitingPayment')}' : '${t('orders.orderConfirming')}'"></p>
                      <p class="text-xs text-gray-400 mt-1"
                         x-text="getStepIndex(selectedOrder) === 0 ? '${t('orders.waitingPaymentMessage')}' : '${t('orders.orderConfirmingMessage')}'"></p>
                    </div>
                    <!-- Step 3: Preparing -->
                    <template x-if="getStepIndex(selectedOrder) >= 2">
                      <div class="relative">
                        <div class="absolute -left-[25px] top-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></div>
                        <p class="text-sm font-medium text-gray-900">${t('orders.orderPreparing')}</p>
                        <p class="text-xs text-gray-400 mt-1">${t('orders.orderPreparingMessage')}</p>
                      </div>
                    </template>
                    <!-- Step 4: Delivering -->
                    <template x-if="getStepIndex(selectedOrder) >= 3">
                      <div class="relative">
                        <div class="absolute -left-[25px] top-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></div>
                        <p class="text-sm font-medium text-gray-900">${t('orders.orderDelivering')}</p>
                        <p class="text-xs text-gray-400 mt-1">${t('orders.orderDeliveringMessage')}</p>
                      </div>
                    </template>
                    <!-- Step 5: Completed -->
                    <template x-if="getStepIndex(selectedOrder) >= 4">
                      <div class="relative">
                        <div class="absolute -left-[25px] top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        <p class="text-sm font-medium text-green-700">${t('orders.orderCompleted')}</p>
                        <p class="text-xs text-gray-400 mt-1">${t('orders.orderCompletedMessage')}</p>
                      </div>
                    </template>
                    <!-- Refund: Pending -->
                    <template x-if="selectedOrder.refundStatus === 'Pending'">
                      <div class="relative">
                        <div class="absolute -left-[25px] top-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white"></div>
                        <p class="text-sm font-medium text-amber-700">İade talebi inceleniyor</p>
                        <p class="text-xs text-gray-400 mt-1" x-text="selectedOrder.refundReason || 'Satıcı tarafından inceleniyor.'"></p>
                      </div>
                    </template>
                    <!-- Refund: Approved -->
                    <template x-if="selectedOrder.refundStatus === 'Approved'">
                      <div class="relative">
                        <div class="absolute -left-[25px] top-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white"></div>
                        <p class="text-sm font-medium text-purple-700">İade onaylandı</p>
                        <p class="text-xs text-gray-400 mt-1">
                          <span x-text="selectedOrder.currency + ' ' + Number(selectedOrder.total).toLocaleString('tr-TR', {minimumFractionDigits: 2})"></span> tutarında iade satıcı tarafından onaylandı.
                        </p>
                      </div>
                    </template>
                    <!-- Refund: Rejected -->
                    <template x-if="selectedOrder.refundStatus === 'Rejected'">
                      <div class="relative">
                        <div class="absolute -left-[25px] top-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white"></div>
                        <p class="text-sm font-medium text-red-600">İade talebi reddedildi</p>
                        <p class="text-xs text-gray-400 mt-1">Satıcı iade talebini reddetti.</p>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </div>
            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button @click="closeModal('showOperationHistory')" class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                ${t('common.close')}
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Modal 2: Choose a Service -->
      <template x-if="showAddServices">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @keydown.escape.window="closeModal('showAddServices')">
          <div class="absolute inset-0 bg-black/50" @click="closeModal('showAddServices')"></div>
          <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden" @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-bold text-gray-900">${t('orders.chooseAService')}</h3>
              <button @click="closeModal('showAddServices')" class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer rounded-full hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <!-- Body -->
            <div class="px-6 py-5 overflow-y-auto max-h-[65vh] space-y-4">
              <!-- Production Monitoring -->
              <div class="border border-gray-200 rounded-lg p-5 hover:border-amber-300 transition-colors cursor-pointer">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      <h4 class="text-base font-bold text-gray-900">${t('orders.productionMonitoring')}</h4>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">${t('orders.productionMonitoringDesc')}</p>
                    <p class="text-xs text-gray-500">${t('orders.startingFrom')} <strong class="text-amber-600">${getCurrencyCode()} 48.00</strong></p>
                  </div>
                  <button class="th-btn th-btn-pill whitespace-nowrap shrink-0">
                    ${t('orders.selectService')}
                  </button>
                </div>
              </div>
              <!-- Inspection Service -->
              <div class="border border-gray-200 rounded-lg p-5 hover:border-amber-300 transition-colors cursor-pointer">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                      <h4 class="text-base font-bold text-gray-900">${t('orders.preShipmentInspection')}</h4>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">${t('orders.preShipmentInspectionDesc')}</p>
                    <p class="text-xs text-gray-500">${t('orders.startingFrom')} <strong class="text-amber-600">${getCurrencyCode()} 88.00</strong></p>
                  </div>
                  <button class="th-btn th-btn-pill whitespace-nowrap shrink-0">
                    ${t('orders.selectService')}
                  </button>
                </div>
              </div>
            </div>
            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button @click="closeModal('showAddServices')" class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                ${t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Modal 3: Payment History -->
      <template x-if="showPaymentHistory">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @keydown.escape.window="closeModal('showPaymentHistory')">
          <div class="absolute inset-0 bg-black/50" @click="closeModal('showPaymentHistory')"></div>
          <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden" @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-bold text-gray-900">${t('orders.paymentHistoryTitle')}</h3>
              <button @click="closeModal('showPaymentHistory')" class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer rounded-full hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <!-- Tabs -->
            <div class="border-b border-gray-200 px-6">
              <div class="flex gap-0">
                <button @click="paymentHistoryTab = 'records'"
                  :class="paymentHistoryTab === 'records' ? 'text-gray-900 border-b-2 border-gray-900 font-medium' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700'"
                  class="py-3 px-4 text-sm bg-transparent cursor-pointer transition-colors border-none">
                  ${t('orders.paymentRecords')}
                </button>
                <button @click="paymentHistoryTab = 'refunds'"
                  :class="paymentHistoryTab === 'refunds' ? 'text-gray-900 border-b-2 border-gray-900 font-medium' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700'"
                  class="py-3 px-4 text-sm bg-transparent cursor-pointer transition-colors border-none">
                  ${t('orders.refunds')}
                </button>
                <button @click="paymentHistoryTab = 'wire'"
                  :class="paymentHistoryTab === 'wire' ? 'text-gray-900 border-b-2 border-gray-900 font-medium' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700'"
                  class="py-3 px-4 text-sm bg-transparent cursor-pointer transition-colors border-none">
                  ${t('orders.wireTransferTracking')}
                </button>
              </div>
            </div>
            <!-- Body -->
            <div class="px-6 py-5 overflow-y-auto max-h-[55vh]">
              <!-- Loading -->
              <template x-if="paymentLoading">
                <div class="flex items-center justify-center py-12">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                </div>
              </template>

              <div x-show="!paymentLoading">
                <!-- Payment records tab -->
                <div x-show="paymentHistoryTab === 'records'">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b border-gray-200">
                        <th class="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">${t('orders.date')}</th>
                        <th class="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">${t('orders.method')}</th>
                        <th class="text-right text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">${t('orders.amount')}</th>
                        <th class="text-right text-xs font-semibold text-gray-500 uppercase pb-3">${t('orders.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template x-if="paymentRecords.length === 0">
                        <tr>
                          <td colspan="4" class="py-12 text-center text-gray-400 text-sm">${t('orders.noPaymentRecords')}</td>
                        </tr>
                      </template>
                      <template x-for="rec in paymentRecords" :key="rec.name">
                        <tr class="border-b border-gray-100">
                          <td class="py-3 pr-4 text-gray-700" x-text="rec.payment_date ? new Date(rec.payment_date).toLocaleDateString('tr-TR') : '-'"></td>
                          <td class="py-3 pr-4 text-gray-700" x-text="rec.method || '-'"></td>
                          <td class="py-3 pr-4 text-right font-medium text-gray-900" x-text="(rec.currency || 'USD') + ' ' + Number(rec.amount || 0).toFixed(2)"></td>
                          <td class="py-3 text-right">
                            <span class="inline-flex px-2 py-0.5 text-xs font-medium rounded-full"
                                  :class="rec.status === 'Completed' ? 'bg-green-50 text-green-700' : rec.status === 'Failed' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'"
                                  x-text="rec.status"></span>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
                <!-- Refunds tab -->
                <div x-show="paymentHistoryTab === 'refunds'">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b border-gray-200">
                        <th class="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">${t('orders.date')}</th>
                        <th class="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">${t('orders.reason')}</th>
                        <th class="text-right text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">${t('orders.amount')}</th>
                        <th class="text-right text-xs font-semibold text-gray-500 uppercase pb-3">${t('orders.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template x-if="refundRecords.length === 0">
                        <tr>
                          <td colspan="4" class="py-12 text-center text-gray-400 text-sm">${t('orders.noRefundRecords')}</td>
                        </tr>
                      </template>
                      <template x-for="rec in refundRecords" :key="rec.name">
                        <tr class="border-b border-gray-100">
                          <td class="py-3 pr-4 text-gray-700" x-text="rec.payment_date ? new Date(rec.payment_date).toLocaleDateString('tr-TR') : '-'"></td>
                          <td class="py-3 pr-4 text-gray-700" x-text="rec.reason || '-'"></td>
                          <td class="py-3 pr-4 text-right font-medium text-red-600" x-text="(rec.currency || 'USD') + ' -' + Number(rec.amount || 0).toFixed(2)"></td>
                          <td class="py-3 text-right">
                            <span class="inline-flex px-2 py-0.5 text-xs font-medium rounded-full"
                                  :class="rec.status === 'Refunded' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'"
                                  x-text="rec.status"></span>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
                <!-- Wire transfer tab -->
                <div x-show="paymentHistoryTab === 'wire'">
                  <template x-if="wireRecords.length === 0">
                    <p class="py-12 text-center text-gray-400 text-sm">${t('orders.noWireTransferRecords')}</p>
                  </template>
                  <template x-for="rec in wireRecords" :key="rec.name">
                    <div class="border border-gray-100 rounded-xl p-5 mb-3 space-y-3">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-semibold text-gray-500 uppercase">Havale / EFT</span>
                        <span class="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full"
                              :class="rec.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'"
                              x-text="rec.status === 'Completed' ? 'Onaylandı' : 'Beklemede'"></span>
                      </div>
                      <div class="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p class="text-xs text-gray-400 mb-0.5">Havale Tarihi</p>
                          <p class="font-medium text-gray-800" x-text="rec.payment_date ? new Date(rec.payment_date).toLocaleDateString('tr-TR') : '-'"></p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-400 mb-0.5">Gönderen</p>
                          <p class="font-medium text-gray-800" x-text="rec.reference || '-'"></p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-400 mb-0.5">Tutar</p>
                          <p class="font-semibold text-gray-900" x-text="(rec.currency || 'USD') + ' ' + Number(rec.amount || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2})"></p>
                        </div>
                        <div x-show="rec.receipt_url">
                          <p class="text-xs text-gray-400 mb-0.5">Dekont</p>
                          <a :href="rec.receipt_url" target="_blank"
                            class="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:underline">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                            Dekontu görüntüle
                          </a>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button @click="closeModal('showPaymentHistory')" class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                ${t('common.close')}
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Modal: Refund Request -->
      <template x-if="showRefundModal">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @keydown.escape.window="closeModal('showRefundModal')">
          <div class="absolute inset-0 bg-black/50" @click="closeModal('showRefundModal')"></div>
          <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 class="text-base font-bold text-gray-900">İade Talebi</h3>
              <button @click="closeModal('showRefundModal')" class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer rounded-full hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <!-- Blocked: aktif iade talebi var -->
            <template x-if="refundBlocked">
              <div class="px-6 py-10 text-center">
                <div class="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                </div>
                <h4 class="text-base font-semibold text-gray-900 mb-2">İade talebi oluşturulamaz</h4>
                <p class="text-sm text-gray-500 mb-6" x-text="refundError"></p>
                <button @click="closeModal('showRefundModal')" class="px-6 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-full border-none cursor-pointer transition-colors">Kapat</button>
              </div>
            </template>
            <!-- Success state -->
            <template x-if="refundSuccess">
              <div class="px-6 py-10 text-center">
                <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h4 class="text-base font-semibold text-gray-900 mb-2">İade talebiniz alındı</h4>
                <p class="text-sm text-gray-500 mb-6">Satıcı talebinizi inceleyecek ve en kısa sürede geri dönüş yapacaktır.</p>
                <button @click="closeModal('showRefundModal')" class="px-6 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-full border-none cursor-pointer transition-colors">Kapat</button>
              </div>
            </template>
            <!-- Form -->
            <template x-if="!refundSuccess && !refundBlocked">
              <div class="px-6 py-5">
                <p class="text-sm text-gray-500 mb-5">
                  <strong x-text="selectedOrder?.orderNumber"></strong> numaralı sipariş için iade talebinizi aşağıda açıklayın. Satıcı tarafından incelenecektir.
                </p>
                <!-- Refund amount -->
                <div class="mb-4">
                  <label class="block text-xs font-semibold text-gray-600 mb-1.5">İade tutarı</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400" x-text="selectedOrder?.currency || 'TRY'"></span>
                    <input type="text" :value="Number(refundForm.amount).toLocaleString('tr-TR', {minimumFractionDigits: 2})" readonly
                      class="w-full border border-gray-100 bg-gray-50 rounded-lg py-2.5 pl-12 pr-3 text-sm text-gray-700 cursor-default select-none" />
                  </div>
                </div>
                <!-- Reason -->
                <div class="mb-5">
                  <label class="block text-xs font-semibold text-gray-600 mb-1.5">İade sebebi <span class="text-red-500">*</span></label>
                  <textarea x-model="refundForm.reason" rows="4"
                    class="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 resize-none"
                    placeholder="Ürün beklentilerinizi karşılamadıysa veya bir sorun yaşadıysanız lütfen açıklayın..."></textarea>
                </div>
                <!-- Error -->
                <p x-show="refundError" x-text="refundError" class="text-xs text-red-500 mb-3"></p>
                <!-- Actions -->
                <div class="flex gap-3 justify-end">
                  <button @click="closeModal('showRefundModal')" class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">İptal</button>
                  <button @click="submitRefundRequest()"
                    :disabled="submittingRefund || !refundForm.reason.trim()"
                    class="px-5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full border-none cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    <template x-if="submittingRefund">
                      <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    </template>
                    İade Talebi Gönder
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>

      <!-- Modal 4: Track Package -->
      <template x-if="showTrackPackage">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @keydown.escape.window="closeModal('showTrackPackage')">
          <div class="absolute inset-0 bg-black/50" @click="closeModal('showTrackPackage')"></div>
          <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden" @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-bold text-gray-900">${t('orders.trackPackage')}</h3>
              <button @click="closeModal('showTrackPackage')" class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer rounded-full hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <!-- Body -->
            <div class="px-6 py-5 overflow-y-auto max-h-[60vh] space-y-5">
              <!-- Shipment info -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">${t('orders.shipTime')}</p>
                  <p class="text-sm text-gray-700">${t('orders.pending')}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">${t('orders.shippingMethod')}</p>
                  <p class="text-sm text-gray-700" x-text="selectedOrder.shipping.method"></p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">${t('orders.estimatedDelivery')}</p>
                  <p class="text-sm text-gray-700">${t('orders.toBeConfirmed')}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">${t('orders.trackingNumber')}</p>
                  <p class="text-sm text-gray-400">${t('orders.notAvailableYet')}</p>
                </div>
              </div>
              <!-- Timeline -->
              <div class="border-t border-gray-100 pt-4">
                <h4 class="text-sm font-bold text-gray-900 mb-3">${t('orders.trackingUpdates')}</h4>
                <div class="flex flex-col items-center justify-center py-8 text-center">
                  <svg class="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                  </svg>
                  <p class="text-sm text-gray-400">${t('orders.noTrackingUpdates')}</p>
                </div>
              </div>
            </div>
            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button @click="closeModal('showTrackPackage')" class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                ${t('common.close')}
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Modal 5: Modify Shipping Details -->
      <template x-if="showModifyShipping">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @keydown.escape.window="closeModal('showModifyShipping')">
          <div class="absolute inset-0 bg-black/50" @click="closeModal('showModifyShipping')"></div>
          <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden" @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-bold text-gray-900">${t('orders.modifyShippingDetails')}</h3>
              <button @click="closeModal('showModifyShipping')" class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer rounded-full hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <!-- Body -->
            <div class="px-6 py-5 overflow-y-auto max-h-[60vh] space-y-4">
              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">${t('orders.shippingAddress')}</label>
                <textarea class="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none bg-white text-gray-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 resize-none" x-model="selectedOrder.shipping.address" placeholder="${t('orders.enterShippingAddress')}"></textarea>
              </div>
              <!-- Country -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">${t('orders.shipFrom')}</label>
                  <input type="text" class="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none bg-gray-50 text-gray-500 cursor-not-allowed" :value="selectedOrder.shipping.shipFrom" disabled />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Incoterms</label>
                  <input type="text" class="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none bg-gray-50 text-gray-500 cursor-not-allowed" :value="selectedOrder.shipping.incoterms" disabled />
                </div>
              </div>
              <!-- Service line -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">${t('orders.shippingServiceLine')}</label>
                <template x-if="shippingMethodsLoading">
                  <div class="w-full h-10 px-3 flex items-center text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400">
                    ${t('common.loading') || 'Yükleniyor...'}
                  </div>
                </template>
                <template x-if="!shippingMethodsLoading">
                  <select
                    x-model="selectedShippingMethod"
                    class="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none bg-white text-gray-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 cursor-pointer"
                  >
                    <template x-if="shippingMethods.length === 0">
                      <option value="">${t('orders.noShippingMethods') || 'Kargo yöntemi bulunamadı'}</option>
                    </template>
                    <template x-for="method in shippingMethods" :key="method.id">
                      <option :value="method.id" x-text="method.estimatedDays ? method.method + ' (' + method.estimatedDays + ')' : method.method"></option>
                    </template>
                  </select>
                </template>
              </div>
              <!-- Fee info -->
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
                  </svg>
                  <p class="text-xs text-gray-600">${t('orders.shippingModificationNote')}</p>
                </div>
              </div>
            </div>
            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button @click="closeModal('showModifyShipping')" class="th-btn-outline th-btn-pill">
                ${t('common.cancel')}
              </button>
              <button @click="closeModal('showModifyShipping')" class="th-btn th-btn-pill">
                ${t('orders.submitChanges')}
              </button>
            </div>
          </div>
        </div>
      </template>

      </div></template>

      <!-- ════════════════════════════════════════
           CANCEL ORDER MODAL (shared by list & detail)
           ════════════════════════════════════════ -->
      <template x-if="showCancelOrder">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @keydown.escape.window="closeModal('showCancelOrder')">
          <div class="absolute inset-0 bg-black/50" @click="cancelReason = ''; cancellingOrder = null; closeModal('showCancelOrder')"></div>
          <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden" @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-bold text-gray-900">${t('orders.cancelOrderTitle')}</h3>
              <button @click="cancelReason = ''; cancellingOrder = null; closeModal('showCancelOrder')" class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer rounded-full hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <!-- Body -->
            <div class="px-6 py-5 overflow-y-auto max-h-[60vh]">
              <p class="text-sm text-gray-700 mb-1">${t('orders.cancelReasonQuestion')}</p>
              <p class="text-sm text-gray-500 mb-5">${t('orders.cancelReasonSubtext')}</p>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="cancelReason" value="shipping_fee" x-model="cancelReason" class="w-4 h-4 accent-[#FF6600] cursor-pointer" />
                  <span class="text-sm text-gray-700 group-hover:text-gray-900">${t('orders.cancelShippingFee')}</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="cancelReason" value="no_stock" x-model="cancelReason" class="w-4 h-4 accent-[#FF6600] cursor-pointer" />
                  <span class="text-sm text-gray-700 group-hover:text-gray-900">${t('orders.cancelNoStock')}</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="cancelReason" value="not_paid_30" x-model="cancelReason" class="w-4 h-4 accent-[#FF6600] cursor-pointer" />
                  <span class="text-sm text-gray-700 group-hover:text-gray-900">${t('orders.cancelNotPaid30Days')}</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="cancelReason" value="shipping_method" x-model="cancelReason" class="w-4 h-4 accent-[#FF6600] cursor-pointer" />
                  <span class="text-sm text-gray-700 group-hover:text-gray-900">${t('orders.cancelShippingMethod')}</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="cancelReason" value="shipping_time" x-model="cancelReason" class="w-4 h-4 accent-[#FF6600] cursor-pointer" />
                  <span class="text-sm text-gray-700 group-hover:text-gray-900">${t('orders.cancelShippingTime')}</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="cancelReason" value="no_longer_needed" x-model="cancelReason" class="w-4 h-4 accent-[#FF6600] cursor-pointer" />
                  <span class="text-sm text-gray-700 group-hover:text-gray-900">${t('orders.cancelNoLongerNeeded')}</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="cancelReason" value="wrong_info" x-model="cancelReason" class="w-4 h-4 accent-[#FF6600] cursor-pointer" />
                  <span class="text-sm text-gray-700 group-hover:text-gray-900">${t('orders.cancelWrongOrder')}</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="cancelReason" value="price_increased" x-model="cancelReason" class="w-4 h-4 accent-[#FF6600] cursor-pointer" />
                  <span class="text-sm text-gray-700 group-hover:text-gray-900">${t('orders.cancelPriceIncreased')}</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="cancelReason" value="others" x-model="cancelReason" class="w-4 h-4 accent-[#FF6600] cursor-pointer" />
                  <span class="text-sm text-gray-700 group-hover:text-gray-900">${t('orders.cancelOther')}</span>
                </label>
              </div>
            </div>
            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button @click="confirmCancelOrder()"
                :class="cancelReason ? 'th-btn th-btn-pill' : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed rounded-full'"
                :disabled="!cancelReason"
                class="px-6 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors border">
                ${t('orders.confirmCancel')}
              </button>
              <button @click="cancelReason = ''; cancellingOrder = null; closeModal('showCancelOrder')" class="th-btn-outline th-btn-pill">
                ${t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      </template>

    </div>

      <!-- ════════════════════════════════════════
           REMITTANCE PROOF MODAL
           ════════════════════════════════════════ -->
      <div class="os-modal hidden fixed inset-0 z-[9999] items-center justify-center" id="remittance-modal">
        <div class="os-modal__overlay absolute inset-0 bg-black/45"></div>
        <div class="os-modal__dialog relative bg-white rounded-xl w-[740px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-64px)] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]" style="animation: osModalIn 200ms ease-out"
             x-data="remittanceComponent()">

          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-xl">
            <div class="flex items-center gap-3">
              <h3 class="text-lg font-bold text-gray-900">${t('orders.submitRemittanceProof')}</h3>
              <!-- Step indicator (3 steps) -->
              <div class="flex items-center gap-1.5" x-show="step !== 'success'">
                <span class="w-2 h-2 rounded-full transition-colors" :class="step === 'iban' ? 'bg-amber-500' : 'bg-gray-300'"></span>
                <span class="w-2 h-2 rounded-full transition-colors" :class="step === 'upload' ? 'bg-amber-500' : 'bg-gray-300'"></span>
                <span class="w-2 h-2 rounded-full transition-colors" :class="step === 'form' || step === 'submitting' ? 'bg-amber-500' : 'bg-gray-300'"></span>
              </div>
            </div>
            <button @click="reset()" class="os-modal__close bg-transparent border-none cursor-pointer p-1.5 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100" aria-label="${t('common.close')}">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="#666" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </div>

          <!-- ═══ STEP 0: Satıcı IBAN Bilgileri ═══ -->
          <div x-show="step === 'iban'" x-transition class="p-6">
            <!-- Loading -->
            <template x-if="loadingBank">
              <div class="flex items-center justify-center py-12 gap-3 text-gray-400">
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                <span class="text-sm">Banka bilgileri yükleniyor...</span>
              </div>
            </template>

            <template x-if="!loadingBank">
              <div>
                <!-- Title -->
                <p class="text-sm text-gray-600 mb-5">Aşağıdaki banka hesabına havale/EFT yapın, ardından <strong>"Ödeme Yaptım"</strong> butonuna tıklayın.</p>

                <!-- IBAN Card -->
                <div class="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mb-5">
                  <div class="flex items-center gap-2 mb-4">
                    <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                    <h4 class="font-bold text-amber-900 text-sm">Ödeme Bilgileri</h4>
                  </div>

                  <template x-if="!sellerIban">
                    <p class="text-sm text-red-500">Bu satıcı henüz banka bilgisi girmemiş. Satıcıyla iletişime geçin.</p>
                  </template>

                  <template x-if="sellerIban">
                    <div class="space-y-3">
                      <div class="flex items-start justify-between gap-3">
                        <span class="text-xs text-amber-700 font-medium w-28 shrink-0 pt-0.5">Hesap Sahibi</span>
                        <span class="text-sm font-semibold text-gray-900 text-right" x-text="sellerAccountHolder || sellerName || '—'"></span>
                      </div>
                      <div class="border-t border-amber-200"></div>
                      <div class="flex items-start justify-between gap-3">
                        <span class="text-xs text-amber-700 font-medium w-28 shrink-0 pt-0.5">Banka Adı</span>
                        <span class="text-sm font-semibold text-gray-900 text-right" x-text="sellerBankName || '—'"></span>
                      </div>
                      <div class="border-t border-amber-200"></div>
                      <div class="flex items-start justify-between gap-3">
                        <span class="text-xs text-amber-700 font-medium w-28 shrink-0 pt-0.5">IBAN</span>
                        <div class="flex items-center gap-2 flex-wrap justify-end">
                          <span class="text-sm font-mono font-bold text-gray-900 tracking-wider" x-text="sellerIban"></span>
                          <button type="button" @click="navigator.clipboard.writeText(sellerIban); $el.textContent='Kopyalandı!'; setTimeout(() => $el.textContent='Kopyala', 2000)"
                            class="text-xs text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 transition-colors cursor-pointer whitespace-nowrap">
                            Kopyala
                          </button>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- Warning note -->
                <div class="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
                  <svg class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <p class="text-xs text-blue-700">Havaleyi yaptıktan sonra <strong>"Ödeme Yaptım"</strong> butonuna tıklayın ve dekontunuzu yükleyin. Satıcı ödemeyi onayladıktan sonra siparişiniz hazırlanmaya başlayacaktır.</p>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between gap-3">
                  <button @click="reset()" class="text-sm text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer transition-colors">İptal</button>
                  <button @click="goToUpload()" :disabled="!sellerIban"
                    class="flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    Ödeme Yaptım — Dekont Yükle
                  </button>
                </div>
              </div>
            </template>
          </div>

          <!-- ═══ STEP 1: Upload ═══ -->
          <div x-show="step === 'upload'" x-transition class="p-6">
            <!-- Error message -->
            <template x-if="errors.file">
              <div class="flex items-center gap-2 px-4 py-2.5 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span x-text="errors.file"></span>
              </div>
            </template>

            <!-- Upload Zone -->
            <div class="border-2 border-dashed rounded-xl p-8 max-sm:p-5 text-center transition-colors cursor-pointer"
                 :class="dragging ? 'border-amber-400 bg-amber-50/60' : hasFile ? 'border-green-300 bg-green-50/30' : 'border-gray-300 bg-gray-50/50 hover:border-gray-400'"
                 @dragover.prevent="dragging = true"
                 @dragleave.prevent="dragging = false"
                 @drop.prevent="dragging = false; handleFiles($event.dataTransfer.files)">

              <div class="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                <!-- Document Preview -->
                <div class="w-[140px] h-[180px] shrink-0 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm overflow-hidden relative">
                  <!-- No file -->
                  <template x-if="!hasFile">
                    <div class="text-center">
                      <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <p class="text-[11px] text-gray-400">${t('orders.remitPreview')}</p>
                    </div>
                  </template>
                  <!-- Image preview -->
                  <template x-if="hasFile && filePreviewUrl">
                    <img :src="filePreviewUrl" class="w-full h-full object-contain" />
                  </template>
                  <!-- PDF file -->
                  <template x-if="hasFile && !filePreviewUrl">
                    <div class="text-center px-3">
                      <svg class="w-10 h-10 text-red-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 14a1 1 0 110-2 1 1 0 010 2zm7 0h-4a.5.5 0 010-1h4a.5.5 0 010 1zm0 3h-4a.5.5 0 010-1h4a.5.5 0 010 1z"/></svg>
                      <p class="text-[10px] text-gray-500 truncate" x-text="fileName"></p>
                    </div>
                  </template>
                  <!-- Remove button -->
                  <button x-show="hasFile" @click.stop="removeFile()"
                    class="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs cursor-pointer border-none hover:bg-red-600 transition-colors">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                <!-- Upload Info -->
                <div class="flex-1 text-left max-md:text-center">
                  <p class="text-sm text-gray-600 mb-1">
                    <span class="text-amber-600 font-semibold">*</span>
                    ${t('orders.remitUploadHint')}
                  </p>
                  <div class="text-[13px] text-gray-500 space-y-0.5 mb-4">
                    <p><strong class="text-gray-700">${t('orders.remitDocClear')}</strong></p>
                    <p>${t('orders.remitFileSize')}: 20 MB</p>
                    <p>${t('orders.remitFormats')}: JPG, JPEG, PNG, GIF, PDF</p>
                    <p>${t('orders.remitManualLink')} <a href="#" class="text-blue-600 hover:underline">${t('orders.remitEnterManually')}</a></p>
                  </div>

                  <!-- File info badge when uploaded -->
                  <template x-if="hasFile">
                    <div class="flex items-center gap-2 mb-3 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 inline-flex">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                      <span x-text="fileName" class="truncate max-w-[200px]"></span>
                      <span class="text-green-500 text-xs" x-text="'(' + fileSize + ')'"></span>
                    </div>
                  </template>

                  <label class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-(--color-cta-primary) rounded-full cursor-pointer transition-colors hover:bg-(--color-cta-primary-hover)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    <span x-text="hasFile ? '${t('orders.remitChangeFile')}' : '${t('orders.remitUploadFile')}'"></span>
                    <input type="file" accept=".jpg,.jpeg,.png,.gif,.pdf" class="hidden"
                           @change="handleFiles($event.target.files)" />
                  </label>
                </div>
              </div>
            </div>

            <!-- Continue Button -->
            <div class="flex justify-end mt-5">
              <button @click="goToForm()"
                class="px-6 py-2.5 text-sm font-medium text-white bg-(--color-cta-primary) rounded-lg cursor-pointer transition-all hover:bg-(--color-cta-primary-hover)"
                :class="!hasFile ? 'opacity-40 cursor-not-allowed! scale-[0.98]' : 'hover:shadow-md'">
                ${t('orders.remitContinue')}
                <svg class="w-4 h-4 inline ml-1 -mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>

          <!-- ═══ STEP 2: Form ═══ -->
          <div x-show="step === 'form'" x-transition class="p-6">
            <!-- Success Banner -->
            <div class="flex items-center gap-2 px-4 py-2.5 mb-5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              ${t('orders.remitUploadSuccess')}
            </div>

            <div class="flex gap-6 max-md:flex-col">
              <!-- Left: Preview -->
              <div class="w-[220px] max-md:w-full shrink-0 space-y-3">
                <div class="w-full aspect-[3/4] bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <template x-if="filePreviewUrl">
                    <img :src="filePreviewUrl" class="w-full h-full object-contain" />
                  </template>
                  <template x-if="!filePreviewUrl">
                    <div class="text-center">
                      <svg class="w-10 h-10 text-red-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z"/></svg>
                      <p class="text-xs text-gray-500 truncate px-2" x-text="fileName"></p>
                    </div>
                  </template>
                </div>
                <button @click="removeFile()" class="w-full text-center text-xs text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer transition-colors">
                  ${t('orders.remitChangeFile')}
                </button>
              </div>

              <!-- Right: Form -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-sm text-gray-600">${t('orders.remitFormHint')}</p>
                  <button @click="clearForm()" class="text-xs text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer flex items-center gap-1 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    ${t('orders.remitClearAll')}
                  </button>
                </div>

                <div class="space-y-4">

                  <!-- Remittance Date -->
                  <div>
                    <label class="block text-sm text-gray-700 mb-1.5">
                      <span class="text-red-500">*</span> ${t('orders.remitDate')}
                    </label>
                    <input type="date" x-model="form.remittanceDate"
                      @blur="submitted && validateField('remittanceDate')"
                      :class="errors.remittanceDate ? 'border-red-400! ring-1! ring-red-200!' : ''"
                      class="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none bg-white text-gray-700 transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-200" />
                    <p x-show="errors.remittanceDate" class="text-xs text-red-500 mt-1">${t('common.required')}</p>
                  </div>

                  <!-- Amount -->
                  <div>
                    <label class="block text-sm text-gray-700 mb-1.5">
                      <span class="text-red-500">*</span> ${t('orders.remitAmount')}
                    </label>
                    <div class="flex gap-2">
                      <select x-model="form.currency"
                        class="h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none bg-white text-gray-700 transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-200 w-[100px]">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="TRY">TRY</option>
                        <option value="CNY">CNY</option>
                      </select>
                      <input type="number" step="0.01" min="0" x-model="form.amount"
                        @blur="submitted && validateField('amount')"
                        :class="errors.amount ? 'border-red-400! ring-1! ring-red-200!' : ''"
                        placeholder="${t('orders.remitPlaceholderEnter')}"
                        class="flex-1 h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none bg-white text-gray-700 transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-200" />
                    </div>
                    <p x-show="errors.amount" class="text-xs text-red-500 mt-1">${t('common.required')}</p>
                  </div>

                  <!-- Bank Name -->
                  <div>
                    <label class="block text-sm text-gray-700 mb-1.5">
                      <span class="text-red-500">*</span> ${t('orders.remitBankName')}
                    </label>
                    <input type="text" x-model="form.bankName"
                      @blur="submitted && validateField('bankName')"
                      :class="errors.bankName ? 'border-red-400! ring-1! ring-red-200!' : ''"
                      placeholder="${t('orders.remitPlaceholderEnter')}"
                      class="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none bg-white text-gray-700 transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-200" />
                    <p x-show="errors.bankName" class="text-xs text-red-500 mt-1">${t('common.required')}</p>
                  </div>

                  <!-- Sender Name -->
                  <div>
                    <label class="block text-sm text-gray-700 mb-1.5">
                      <span class="text-red-500">*</span> ${t('orders.remitSenderName')}
                    </label>
                    <input type="text" x-model="form.senderName"
                      @blur="submitted && validateField('senderName')"
                      :class="errors.senderName ? 'border-red-400! ring-1! ring-red-200!' : ''"
                      placeholder="${t('orders.remitPlaceholderEnter')}"
                      class="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none bg-white text-gray-700 transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-200" />
                    <p x-show="errors.senderName" class="text-xs text-red-500 mt-1">${t('common.required')}</p>
                  </div>

                  <!-- Smart Prediction Note -->
                  <div class="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[13px] text-amber-700 leading-relaxed">
                    <svg class="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>
                    ${t('orders.remitSmartPrediction')}
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between mt-6 gap-3">
                  <button @click="step = 'upload'"
                    class="px-4 py-2.5 text-sm text-gray-600 bg-transparent border border-gray-300 rounded-lg cursor-pointer font-medium transition-colors hover:bg-gray-50">
                    <svg class="w-4 h-4 inline mr-1 -mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M15 19l-7-7 7-7"/></svg>
                    ${t('common.back')}
                  </button>
                  <button @click="submitRemittance()"
                    class="inline-flex items-center gap-2 px-8 py-2.5 text-sm font-medium text-white bg-(--color-cta-primary) rounded-lg cursor-pointer transition-all hover:bg-(--color-cta-primary-hover) hover:shadow-md"
                    :class="!isFormValid ? 'opacity-60' : ''">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    ${t('orders.remitCheckStatus')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ═══ STEP: Submitting ═══ -->
          <div x-show="step === 'submitting'" x-transition class="p-12 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 mb-4">
              <svg class="w-12 h-12 text-amber-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">${t('orders.remitSubmitting')}</h4>
            <p class="text-sm text-gray-500">${t('orders.remitPleaseWait')}</p>
          </div>

          <!-- ═══ STEP: Success ═══ -->
          <div x-show="step === 'success'" x-transition class="p-12 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">${t('orders.remitSuccessTitle')}</h4>
            <p class="text-sm text-gray-500 mb-6 max-w-[360px] mx-auto">${t('orders.remitSuccessDesc')}</p>
            <button @click="reset()" class="os-modal__close px-6 py-2.5 text-sm font-medium text-white bg-(--color-cta-primary) rounded-lg cursor-pointer transition-colors hover:bg-(--color-cta-primary-hover)">
              ${t('common.close')}
            </button>
          </div>
        </div>
      </div>

    </div>
  `;
}

function renderRefunds(): string {
  return `
    <div x-data="refundsComponent()" x-cloak>
    <div class="flex items-center justify-between px-7 max-sm:px-3 pt-6 pb-5 border-b border-(--color-border-light,#f0f0f0)">
      <h1 class="text-[22px] font-bold text-(--color-text-heading,#111827)">${t('orders.refundsAfterSalesTitle')}</h1>
    </div>
    <div class="os-tabs flex border-b overflow-x-auto scrollbar-hide border-(--color-border-default,#e5e5e5) px-7 max-sm:px-3" data-tabgroup="refunds">
      <button class="os-tabs__tab os-tabs__tab--active py-3 px-4 text-sm bg-transparent border-none border-b-2 border-b-transparent cursor-pointer whitespace-nowrap transition-colors" data-tab="refund-returns">${t('orders.refundsTab')}</button>
      <button class="os-tabs__tab py-3 px-4 text-sm bg-transparent border-none border-b-2 border-b-transparent cursor-pointer whitespace-nowrap transition-colors text-(--color-text-muted,#666)" data-tab="refund-tax">${t('orders.taxRefundsTab')}</button>
      <button class="os-tabs__tab py-3 px-4 text-sm bg-transparent border-none border-b-2 border-b-transparent cursor-pointer whitespace-nowrap transition-colors text-(--color-text-muted,#666)" data-tab="refund-after">${t('orders.afterSalesServicesTab')}</button>
    </div>

    <!-- Tab: Para İadeleri (dynamic) -->
    <div class="os-tab-content os-tab-content--active" data-content="refund-returns">
      <!-- Loading -->
      <template x-if="loading">
        <div class="flex items-center justify-center py-16">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
        </div>
      </template>
      <!-- Empty -->
      <template x-if="!loading && refunds.length === 0">
        <div class="flex flex-col items-center justify-center gap-3 px-10 max-sm:px-4 py-20 text-center">
          ${EMPTY_RECEIPT_ICON}
          <p class="text-sm text-(--color-text-muted,#666)">${t('orders.noAfterSalesRequest')}</p>
        </div>
      </template>
      <!-- Refund list -->
      <template x-if="!loading && refunds.length > 0">
        <div class="px-7 max-sm:px-3 py-5">
          <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">Sipariş No</th>
                  <th class="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">Tarih</th>
                  <th class="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">Satıcı</th>
                  <th class="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">Sebep</th>
                  <th class="text-right text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">İade Tutarı</th>
                  <th class="text-center text-xs font-semibold text-gray-500 uppercase pb-3">Durum</th>
                </tr>
              </thead>
              <tbody>
                <template x-for="r in refunds" :key="r.order_number">
                  <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td class="py-3 pr-4 font-mono text-xs font-semibold text-gray-800" x-text="r.order_number"></td>
                    <td class="py-3 pr-4 text-gray-500 text-xs" x-text="r.refund_requested_at || r.order_date"></td>
                    <td class="py-3 pr-4 text-gray-700 text-xs" x-text="r.seller_name || '-'"></td>
                    <td class="py-3 pr-4 text-gray-600 text-xs max-w-[200px] truncate" :title="r.refund_reason" x-text="r.refund_reason || '-'"></td>
                    <td class="py-3 pr-4 text-right font-semibold text-gray-900 text-xs" x-text="r.refund_amount > 0 ? r.currency + ' ' + Number(r.refund_amount).toLocaleString('tr-TR', {minimumFractionDigits: 2}) : '-'"></td>
                    <td class="py-3 text-center">
                      <span class="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full" :class="statusClass(r.refund_status)" x-text="r.refund_status_label"></span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>

    <!-- Tab: Vergi iadeleri (table) -->
    <div class="os-tab-content" data-content="refund-tax">
      <div class="px-7 max-sm:px-3">
        <div class="overflow-x-auto"><table class="os-table w-full border-collapse border border-(--color-border-default,#e5e5e5) rounded-md overflow-hidden">
          <thead>
            <tr>
              <th class="px-4 py-3 text-[13px] font-semibold text-(--color-text-body,#333) bg-(--color-surface-muted,#fafafa) border-b border-(--color-border-default,#e5e5e5) text-left whitespace-nowrap">${t('orders.orderNumber')}</th>
              <th class="px-4 py-3 text-[13px] font-semibold text-(--color-text-body,#333) bg-(--color-surface-muted,#fafafa) border-b border-(--color-border-default,#e5e5e5) text-left whitespace-nowrap">${t('orders.caseNumber')}</th>
              <th class="px-4 py-3 text-[13px] font-semibold text-(--color-text-body,#333) bg-(--color-surface-muted,#fafafa) border-b border-(--color-border-default,#e5e5e5) text-left whitespace-nowrap">${t('orders.applicationDate')}</th>
              <th class="px-4 py-3 text-[13px] font-semibold text-(--color-text-body,#333) bg-(--color-surface-muted,#fafafa) border-b border-(--color-border-default,#e5e5e5) text-left whitespace-nowrap">${t('orders.refundAmount')}</th>
              <th class="px-4 py-3 text-[13px] font-semibold text-(--color-text-body,#333) bg-(--color-surface-muted,#fafafa) border-b border-(--color-border-default,#e5e5e5) text-left whitespace-nowrap">${t('orders.status')}</th>
              <th class="px-4 py-3 text-[13px] font-semibold text-(--color-text-body,#333) bg-(--color-surface-muted,#fafafa) border-b border-(--color-border-default,#e5e5e5) text-left whitespace-nowrap">${t('orders.bankRefundStatus')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="6" class="text-center !py-[60px] px-4">
                ${EMPTY_RECEIPT_ICON}
                <p class="text-sm text-(--color-text-muted,#666)">${t('orders.noAfterSalesRequest')}</p>
              </td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>

    <!-- Tab: Satış sonrası hizmetler (empty) -->
    <div class="os-tab-content" data-content="refund-after">
      <div class="flex flex-col items-center justify-center gap-3 px-10 max-sm:px-4 py-20 text-center">
        ${EMPTY_RECEIPT_ICON}
        <p class="text-sm text-(--color-text-muted,#666)">${t('orders.noAfterSalesRequest')}</p>
      </div>
    </div>
    </div>
  `;
}

function renderReviews(): string {
  return `
    <div class="flex items-center justify-between flex-wrap gap-2 px-7 max-sm:px-3 max-[380px]:px-3 pt-6 pb-5 border-b border-(--color-border-light,#f0f0f0)">
      <h1 class="text-[22px] max-sm:text-lg font-bold text-(--color-text-heading,#111827)">${t('orders.myReviews')}</h1>
      <div class="flex items-center gap-1 shrink-0">
        <span class="text-[13px] text-(--color-text-muted,#666)">${t('orders.scoringRules')}</span>
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="#999" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 16v-4m0-4h.01"/>
        </svg>
      </div>
    </div>
    <div class="os-tabs flex border-b overflow-x-auto scrollbar-hide border-(--color-border-default,#e5e5e5) px-7 max-sm:px-3" data-tabgroup="reviews">
      <button class="os-tabs__tab os-tabs__tab--active os-tabs__tab--orange py-3 px-4 text-sm bg-transparent border-none border-b-2 border-b-transparent cursor-pointer whitespace-nowrap transition-colors" data-tab="review-pending">${t('orders.pendingReviews')} (0)</button>
      <button class="os-tabs__tab py-3 px-4 text-sm bg-transparent border-none border-b-2 border-b-transparent cursor-pointer whitespace-nowrap transition-colors text-(--color-text-muted,#666)" data-tab="review-done">${t('orders.reviewed')} (0)</button>
    </div>

    <div class="flex justify-end px-7 max-sm:px-3 py-3">
      <div class="flex border border-(--color-border-medium,#d1d5db) rounded overflow-hidden w-full max-w-[320px] max-sm:max-w-full">
        <input type="text" placeholder="${t('orders.reviewSearchPlaceholder')}" class="os-reviews-toolbar__input flex-1 min-w-0 h-8 px-2.5 text-[13px] border-none outline-none text-(--color-text-body,#333)" />
        <button class="flex items-center justify-center w-8 h-8 shrink-0 border-none border-l border-l-(--color-border-medium,#d1d5db) bg-(--color-surface-muted,#fafafa) text-(--color-text-muted,#666) cursor-pointer hover:bg-(--color-border-light) hover:text-(--color-text-heading,#111827)" aria-label="${t('common.search')}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="os-tab-content os-tab-content--active" data-content="review-pending">
      <div class="flex flex-col items-center justify-center gap-3 px-10 max-sm:px-4 py-20 text-center">
        <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
          <rect x="10" y="10" width="50" height="55" rx="4" fill="#FFECD2" stroke="#F7A84B" stroke-width="1"/>
          <rect x="15" y="18" width="40" height="4" rx="2" fill="#F7A84B" opacity="0.3"/>
          <rect x="15" y="28" width="30" height="4" rx="2" fill="#F7A84B" opacity="0.3"/>
          <circle cx="72" cy="38" r="8" fill="#FBBF24"/>
          <rect x="66" y="48" width="12" height="20" rx="3" fill="#1E3A5F"/>
        </svg>
        <p class="text-sm text-(--color-text-muted,#666)">${t('orders.noPendingReviews')}</p>
      </div>
    </div>

    <div class="os-tab-content" data-content="review-done">
      <div class="flex flex-col items-center justify-center gap-3 px-10 max-sm:px-4 py-20 text-center">
        ${EMPTY_RECEIPT_ICON}
        <p class="text-sm text-(--color-text-muted,#666)">${t('orders.noReviewsFound')}</p>
      </div>
    </div>
  `;
}

function renderCoupons(): string {
  return `
    <div x-data="couponsPageComponent()">
      <div class="flex items-center justify-between px-7 max-sm:px-3 pt-6 pb-5 border-b border-(--color-border-light,#f0f0f0)">
        <h1 class="text-[22px] font-bold text-(--color-text-heading,#111827)">${t('orders.couponsAndCredits')}</h1>
      </div>

      <!-- Tabs -->
      <div class="os-tabs flex border-b overflow-x-auto scrollbar-hide border-(--color-border-default,#e5e5e5) px-7 max-sm:px-3">
        <button @click="switchTab('coupons-list')" class="os-tabs__tab py-3 px-4 text-sm bg-transparent border-none border-b-2 border-b-transparent cursor-pointer whitespace-nowrap transition-colors"
          :class="activeTab === 'coupons-list' ? 'os-tabs__tab--active' : 'text-(--color-text-muted,#666)'">${t('orders.coupons')}</button>
        <button @click="switchTab('coupons-credit')" class="os-tabs__tab py-3 px-4 text-sm bg-transparent border-none border-b-2 border-b-transparent cursor-pointer whitespace-nowrap transition-colors"
          :class="activeTab === 'coupons-credit' ? 'os-tabs__tab--active' : 'text-(--color-text-muted,#666)'">${t('orders.credit')}</button>
      </div>

      <!-- Tab: Kuponlar -->
      <div x-show="activeTab === 'coupons-list'">
        <!-- Pill filters -->
        <div class="os-pill-filters flex gap-2 px-7 max-sm:px-3 py-4">
          <template x-for="pill in [{id:'available',label:'${t('orders.available')}'},{id:'used',label:'${t('orders.used')}'},{id:'expired',label:'${t('orders.expired')}'}]" :key="pill.id">
            <button @click="setPill(pill.id)" class="os-pill px-4 py-1.5 text-[13px] bg-(--color-surface,#fff) border border-(--color-border-medium,#d1d5db) rounded-[20px] cursor-pointer transition-all text-(--color-text-muted,#666)"
              :class="activePill === pill.id ? 'os-pill--active' : ''"
              x-text="pill.label"></button>
          </template>
        </div>

        <!-- Empty state -->
        <div x-show="filteredCoupons.length === 0" class="flex flex-col items-center justify-center gap-3 px-10 max-sm:px-4 py-[60px] text-center">
          <p class="text-sm text-(--color-text-muted,#666)">${t('orders.noCoupons')}</p>
        </div>

        <!-- Coupon cards -->
        <div x-show="filteredCoupons.length > 0" class="flex flex-col gap-3 px-7 max-sm:px-3 pb-6">
          <template x-for="coupon in filteredCoupons" :key="coupon.code">
            <div class="border rounded-lg p-4 transition-all"
              :class="coupon.status === 'available' ? 'border-(--color-border-default,#e5e5e5) bg-(--color-surface,#fff)' : 'border-(--color-border-light,#f0f0f0) bg-(--color-surface-muted,#fafafa) opacity-60'">
              <div class="flex items-start gap-4">
                <!-- Type badge -->
                <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold"
                  :class="couponBadgeClass(coupon.type)"
                  x-text="couponTypeBadge(coupon.type)"></div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-medium px-2 py-0.5 rounded-full"
                      :class="couponBadgeClass(coupon.type)"
                      x-text="couponTypeLabel(coupon.type)"></span>
                    <span class="font-mono text-sm font-semibold text-(--color-text-heading,#111827)" x-text="coupon.code"></span>
                  </div>
                  <p class="text-sm text-(--color-text-body,#333) mb-1" x-text="coupon.description"></p>
                  <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-(--color-text-muted,#666)">
                    <span x-show="coupon.minOrder > 0" x-text="'${t('orders.minOrder')}: $' + coupon.minOrder"></span>
                    <span x-text="'${t('orders.expiryDate')}: ' + formatDate(coupon.expiresAt)"></span>
                    <span x-show="coupon.usedAt" x-text="'${t('orders.usedOn')}: ' + formatDate(coupon.usedAt || '')"></span>
                  </div>
                </div>
                <!-- Value display -->
                <div class="flex-shrink-0 text-right">
                  <span class="text-lg font-bold" :class="coupon.status === 'available' ? 'text-(--color-text-heading,#111827)' : 'text-(--color-text-muted,#666)'"
                    x-text="coupon.type === 'shipping' ? '${t('orders.free')}' : (coupon.type === 'percent' ? '%' + coupon.value : '${getCurrencySymbol()}' + coupon.value)"></span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Tab: Kredi -->
      <div x-show="activeTab === 'coupons-credit'">
        <div class="mx-7 my-5 p-5 border border-(--color-border-default,#e5e5e5) rounded-lg">
          <p class="text-sm text-(--color-text-body,#333) mb-2">${t('orders.totalCreditBalance')}</p>
          <p class="text-[28px] font-bold text-(--color-text-heading,#111827) mb-2" x-text="'${getCurrencySymbol()}' + creditBalance.toFixed(2)"></p>
          <p class="text-[13px] text-(--color-text-muted,#666)">${t('orders.creditEqualsUsd')} <a href="#terms" class="text-(--color-text-link,#cc9900) hover:text-(--color-text-link-hover,#b38600) underline">${t('orders.termsAndConditions')}</a></p>
        </div>

        <h3 class="text-base font-bold text-(--color-text-heading,#111827) px-7 max-sm:px-3 pt-5 pb-3">${t('orders.history')}</h3>
        <div class="px-7 max-sm:px-3">
          <div class="overflow-x-auto"><table class="w-full border-collapse border border-(--color-border-default,#e5e5e5) rounded-md overflow-hidden">
            <thead>
              <tr>
                <th class="px-4 py-3 text-[13px] font-semibold text-(--color-text-body,#333) bg-(--color-surface-muted,#fafafa) border-b border-(--color-border-default,#e5e5e5) text-left whitespace-nowrap">${t('orders.transaction')}</th>
                <th class="px-4 py-3 text-[13px] font-semibold text-(--color-text-body,#333) bg-(--color-surface-muted,#fafafa) border-b border-(--color-border-default,#e5e5e5) text-left whitespace-nowrap">${t('orders.details')}</th>
                <th class="px-4 py-3 text-[13px] font-semibold text-(--color-text-body,#333) bg-(--color-surface-muted,#fafafa) border-b border-(--color-border-default,#e5e5e5) text-left whitespace-nowrap">${t('orders.dateUtc8')}</th>
                <th class="px-4 py-3 text-[13px] font-semibold text-(--color-text-body,#333) bg-(--color-surface-muted,#fafafa) border-b border-(--color-border-default,#e5e5e5) text-left whitespace-nowrap">${t('orders.amount')}</th>
              </tr>
            </thead>
            <tbody>
              <!-- Empty state -->
              <template x-if="creditHistory.length === 0">
                <tr>
                  <td colspan="4" class="text-center py-10 px-4 text-[13px] text-(--color-text-placeholder,#999)">${t('orders.noRecordsYet')}</td>
                </tr>
              </template>
              <!-- Credit rows -->
              <template x-for="entry in creditHistory" :key="entry.id">
                <tr class="border-b border-(--color-border-light,#f0f0f0) last:border-b-0">
                  <td class="px-4 py-3 text-[13px]">
                    <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="creditBadgeClass(entry.type)"
                      x-text="creditTypeLabel(entry.type)"></span>
                  </td>
                  <td class="px-4 py-3 text-[13px] text-(--color-text-body,#333)" x-text="entry.description"></td>
                  <td class="px-4 py-3 text-[13px] text-(--color-text-muted,#666) whitespace-nowrap" x-text="formatDate(entry.date)"></td>
                  <td class="px-4 py-3 text-[13px] font-semibold whitespace-nowrap" :class="creditAmountClass(entry.type)"
                    x-text="(entry.amount >= 0 ? '+' : '') + '${getCurrencySymbol()}' + Math.abs(entry.amount).toFixed(2)"></td>
                </tr>
              </template>
            </tbody>
          </table></div>
        </div>

        <div class="flex items-center justify-end gap-2 px-7 max-sm:px-3 py-4">
          <span class="text-[13px] text-(--color-text-muted,#666)" x-text="creditHistory.length + ' ${t('orders.records')}'"></span>
        </div>
      </div>
    </div>
  `;
}

function renderTaxInfo(): string {
  return `
    <div class="flex items-center justify-between px-7 max-sm:px-3 pt-6 pb-5 border-b border-(--color-border-light,#f0f0f0)">
      <h1 class="text-[22px] font-bold text-(--color-text-heading,#111827)">${t('orders.taxInformation')}</h1>
    </div>
    <div class="os-tabs flex border-b overflow-x-auto scrollbar-hide border-(--color-border-default,#e5e5e5) px-7 max-sm:px-3" data-tabgroup="tax">
      <button class="os-tabs__tab os-tabs__tab--active py-3 px-4 text-sm bg-transparent border-none border-b-2 border-b-transparent cursor-pointer whitespace-nowrap transition-colors" data-tab="tax-info-tab">${t('orders.taxInfoTab')}</button>
      <button class="os-tabs__tab py-3 px-4 text-sm bg-transparent border-none border-b-2 border-b-transparent cursor-pointer whitespace-nowrap transition-colors text-(--color-text-muted,#666)" data-tab="tax-customs">${t('orders.customsInspectionInfo')}</button>
    </div>

    <!-- Tab: Vergi Bilgileri -->
    <div class="os-tab-content os-tab-content--active" data-content="tax-info-tab">
      <div class="flex items-center justify-between gap-6 px-7 max-sm:px-3 py-5 border-b border-(--color-border-light,#f0f0f0) max-md:flex-col max-md:items-start">
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-(--color-text-heading,#111827) mb-1.5">${t('orders.vatExemptionFor')}</h4>
          <p class="text-[13px] text-(--color-text-muted,#666) leading-normal">${t('orders.vatExemptionDesc')}</p>
        </div>
        <button class="os-info-card__btn px-5 py-2 text-[13px] text-(--color-text-body,#333) bg-(--color-surface,#fff) border border-(--color-border-medium,#d1d5db) rounded-[20px] cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:border-[#999]" data-modal="pst-modal">${t('orders.addOrChangeTaxExemption')}</button>
      </div>

      <div class="flex items-center justify-between gap-6 px-7 max-sm:px-3 py-5 border-b border-(--color-border-light,#f0f0f0) max-md:flex-col max-md:items-start">
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-(--color-text-heading,#111827) mb-1.5">${t('orders.euNorwayTaxSubmission')}</h4>
          <p class="text-[13px] text-(--color-text-muted,#666) leading-normal">${t('orders.euNorwayTaxDesc')}</p>
        </div>
        <button class="os-info-card__btn px-5 py-2 text-[13px] text-(--color-text-body,#333) bg-(--color-surface,#fff) border border-(--color-border-medium,#d1d5db) rounded-[20px] cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:border-[#999]" data-modal="vat-modal">${t('orders.addTaxInfo')}</button>
      </div>

      <h3 class="text-base font-bold text-(--color-text-heading,#111827) px-7 max-sm:px-3 pt-5 pb-3">${t('orders.faq')}</h3>

      <div class="px-7 max-sm:px-3 pb-7">
        <div class="grid grid-cols-3 gap-4 mb-5 max-md:grid-cols-1">
          <div class="p-5 border border-(--color-border-default,#e5e5e5) rounded-lg">
            <h5 class="text-sm font-semibold text-(--color-text-heading,#111827) mb-2">${t('orders.faqNoTaxInfo')}</h5>
            <p class="text-[13px] text-(--color-text-muted,#666) leading-normal">${t('orders.faqNoTaxInfoAnswer')}</p>
          </div>
          <div class="p-5 border border-(--color-border-default,#e5e5e5) rounded-lg">
            <h5 class="text-sm font-semibold text-(--color-text-heading,#111827) mb-2">${t('orders.faqTaxNotApproved')}</h5>
            <p class="text-[13px] text-(--color-text-muted,#666) leading-normal">${t('orders.faqTaxNotApprovedAnswer')}</p>
          </div>
          <div class="p-5 border border-(--color-border-default,#e5e5e5) rounded-lg">
            <h5 class="text-sm font-semibold text-(--color-text-heading,#111827) mb-2">${t('orders.faqHowToApplyRefund')}</h5>
            <p class="text-[13px] text-(--color-text-muted,#666) leading-normal">${t('orders.faqHowToApplyRefundAnswer')}</p>
          </div>
        </div>

        <details class="os-faq__accordion border-b border-(--color-border-default,#e5e5e5) py-3.5">
          <summary class="text-sm text-(--color-text-heading,#111827) cursor-pointer list-none flex justify-between items-center">${t('orders.whatIsSalesTax')}</summary>
          <p class="pt-3 pb-1 text-[13px] text-(--color-text-muted,#666) leading-relaxed">${t('orders.whatIsSalesTaxAnswer')}</p>
        </details>
        <details class="os-faq__accordion border-b border-(--color-border-default,#e5e5e5) py-3.5">
          <summary class="text-sm text-(--color-text-heading,#111827) cursor-pointer list-none flex justify-between items-center">${t('orders.whatIsVat')}</summary>
          <p class="pt-3 pb-1 text-[13px] text-(--color-text-muted,#666) leading-relaxed">${t('orders.whatIsVatAnswer')}</p>
        </details>
      </div>
    </div>

    <!-- Tab: Gümrük muayenesi bilgileri -->
    <div class="os-tab-content" data-content="tax-customs">
      <div class="flex items-center justify-between gap-6 px-7 max-sm:px-3 py-5 border-b border-(--color-border-light,#f0f0f0) max-md:flex-col max-md:items-start">
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-(--color-text-heading,#111827) mb-1.5">${t('orders.customsProcessing')}</h4>
          <p class="text-[13px] text-(--color-text-muted,#666) leading-normal">${t('orders.customsProcessingDesc')}</p>
        </div>
        <button class="os-info-card__btn px-5 py-2 text-[13px] text-(--color-text-body,#333) bg-(--color-surface,#fff) border border-(--color-border-medium,#d1d5db) rounded-[20px] cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:border-[#999]" data-modal="customs-modal">${t('orders.addCustomsInspectionInfo')}</button>
      </div>
    </div>

    <!-- ═══ MODAL: PST bilgileri ═══ -->
    <div class="os-modal hidden fixed inset-0 z-[9999] items-center justify-center" id="pst-modal">
      <div class="os-modal__overlay absolute inset-0 bg-black/45"></div>
      <div class="os-modal__dialog relative bg-(--color-surface,#fff) rounded-xl w-[480px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-64px)] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]" style="animation: osModalIn 200ms ease-out">
        <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-(--color-border-light,#f0f0f0)">
          <h3 class="text-base font-semibold text-(--color-text-heading,#111827)">${t('orders.pstInfo')}</h3>
          <button class="os-modal__close bg-transparent border-none cursor-pointer p-1 rounded flex items-center justify-center transition-colors hover:bg-(--color-surface-raised,#f5f5f5)" aria-label="${t('common.close')}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="#666" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="px-6 py-5">
          <div class="mb-5">
            <label class="block text-[13px] font-semibold text-(--color-text-body,#333) mb-2">${t('orders.province')} <span class="text-[#e53935]">*</span></label>
            <div class="flex flex-col gap-2.5">
              <label class="os-modal__radio flex items-center gap-2 text-sm text-(--color-text-body,#333) cursor-pointer">
                <input type="radio" name="pst-province" value="manitoba" checked class="hidden" />
                <span class="os-modal__radio-custom w-[18px] h-[18px] border-2 border-(--color-border-medium,#d1d5db) rounded-full shrink-0 relative transition-colors"></span>
                Manitoba
              </label>
              <label class="os-modal__radio flex items-center gap-2 text-sm text-(--color-text-body,#333) cursor-pointer">
                <input type="radio" name="pst-province" value="saskatchewan" class="hidden" />
                <span class="os-modal__radio-custom w-[18px] h-[18px] border-2 border-(--color-border-medium,#d1d5db) rounded-full shrink-0 relative transition-colors"></span>
                Saskatchewan
              </label>
            </div>
          </div>
          <div class="mb-5">
            <label class="block text-[13px] font-semibold text-(--color-text-body,#333) mb-2">${t('orders.rstNumber')} <span class="text-[#e53935]">*</span></label>
            <input type="text" class="os-modal__input w-full py-2.5 px-3 text-sm border border-(--color-border-medium,#d1d5db) rounded-md outline-none text-(--color-text-heading,#111827) transition-colors box-border focus:border-(--color-cta-primary,#cc9900) focus:shadow-[0_0_0_2px_rgba(249,115,22,0.1)]" placeholder="${t('orders.enterRstNumber')}" />
          </div>
        </div>
        <div class="px-6 pt-4 pb-5 flex justify-end gap-3 border-t border-(--color-border-light,#f0f0f0)">
          <button class="os-modal__btn os-modal__btn--primary px-6 py-2.5 text-sm font-medium rounded-[20px] cursor-pointer border-none transition-all bg-(--color-cta-primary,#333333) text-white hover:bg-(--color-cta-primary-hover,#1f1f1f)">${t('orders.verify')}</button>
        </div>
      </div>
    </div>

    <!-- ═══ MODAL: KDV/GST Numarası Ekleyin ═══ -->
    <div class="os-modal hidden fixed inset-0 z-[9999] items-center justify-center" id="vat-modal">
      <div class="os-modal__overlay absolute inset-0 bg-black/45"></div>
      <div class="os-modal__dialog relative bg-(--color-surface,#fff) rounded-xl w-[480px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-64px)] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]" style="animation: osModalIn 200ms ease-out">
        <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-(--color-border-light,#f0f0f0)">
          <h3 class="text-base font-semibold text-(--color-text-heading,#111827)">${t('orders.addVatGstNumber')}</h3>
          <button class="os-modal__close bg-transparent border-none cursor-pointer p-1 rounded flex items-center justify-center transition-colors hover:bg-(--color-surface-raised,#f5f5f5)" aria-label="${t('common.close')}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="#666" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="px-6 py-5">
          <div class="mb-5">
            <label class="block text-[13px] font-semibold text-(--color-text-body,#333) mb-2">${t('orders.countryRegion')} <span class="text-[#e53935]">*</span></label>
            <div class="relative">
              <select class="os-modal__select w-full py-2.5 pl-3 pr-9 text-sm border border-(--color-border-medium,#d1d5db) rounded-md outline-none text-(--color-text-heading,#111827) bg-(--color-surface,#fff) appearance-none cursor-pointer transition-colors focus:border-(--color-cta-primary,#cc9900) focus:shadow-[0_0_0_2px_rgba(249,115,22,0.1)]">
                <option value="">${t('orders.selectCountryRegion')}</option>
                <option value="TR">${t('orders.countryTR')}</option>
                <option value="DE">${t('orders.countryDE')}</option>
                <option value="FR">${t('orders.countryFR')}</option>
                <option value="GB">${t('orders.countryGB')}</option>
                <option value="NL">${t('orders.countryNL')}</option>
                <option value="IT">${t('orders.countryIT')}</option>
                <option value="ES">${t('orders.countryES')}</option>
                <option value="NO">${t('orders.countryNO')}</option>
                <option value="CH">${t('orders.countryCH')}</option>
                <option value="AU">${t('orders.countryAU')}</option>
                <option value="NZ">${t('orders.countryNZ')}</option>
                <option value="SG">${t('orders.countrySG')}</option>
                <option value="CL">${t('orders.countryCL')}</option>
              </select>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
          <div class="mb-5">
            <label class="block text-[13px] font-semibold text-(--color-text-body,#333) mb-2">${t('orders.taxNumber')} <span class="text-[#e53935]">*</span></label>
            <input type="text" class="os-modal__input w-full py-2.5 px-3 text-sm border border-(--color-border-medium,#d1d5db) rounded-md outline-none text-(--color-text-heading,#111827) transition-colors box-border focus:border-(--color-cta-primary,#cc9900) focus:shadow-[0_0_0_2px_rgba(249,115,22,0.1)]" placeholder="${t('orders.enterTaxNumber')}" />
          </div>
          <div class="mb-5">
            <label class="block text-[13px] font-semibold text-(--color-text-body,#333) mb-2">${t('orders.fullRegistrationName')} <span class="text-[#e53935]">*</span></label>
            <input type="text" class="os-modal__input w-full py-2.5 px-3 text-sm border border-(--color-border-medium,#d1d5db) rounded-md outline-none text-(--color-text-heading,#111827) transition-colors box-border focus:border-(--color-cta-primary,#cc9900) focus:shadow-[0_0_0_2px_rgba(249,115,22,0.1)]" placeholder="${t('orders.enterFullRegistrationName')}" />
          </div>
        </div>
        <div class="px-6 pt-4 pb-5 flex justify-end gap-3 border-t border-(--color-border-light,#f0f0f0)">
          <button class="os-modal__btn os-modal__btn--primary px-6 py-2.5 text-sm font-medium rounded-[20px] cursor-pointer border-none transition-all bg-(--color-cta-primary,#333333) text-white hover:bg-(--color-cta-primary-hover,#1f1f1f)">${t('orders.verify')}</button>
        </div>
      </div>
    </div>

    <!-- ═══ MODAL: Gümrük muayenesi bilgileri ═══ -->
    <div class="os-modal hidden fixed inset-0 z-[9999] items-center justify-center" id="customs-modal">
      <div class="os-modal__overlay absolute inset-0 bg-black/45"></div>
      <div class="os-modal__dialog relative bg-(--color-surface,#fff) rounded-xl w-[480px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-64px)] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]" style="animation: osModalIn 200ms ease-out">
        <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-(--color-border-light,#f0f0f0)">
          <h3 class="text-base font-semibold text-(--color-text-heading,#111827)">${t('orders.customsInspectionInfo')}</h3>
          <button class="os-modal__close bg-transparent border-none cursor-pointer p-1 rounded flex items-center justify-center transition-colors hover:bg-(--color-surface-raised,#f5f5f5)" aria-label="${t('common.close')}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="#666" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="px-6 py-5">
          <div class="flex items-start gap-2.5 px-3.5 py-3 bg-primary-50 border border-primary-200 rounded-md text-[13px] text-primary-800 leading-normal mb-5">
            <svg class="shrink-0 mt-px" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#E8912D" stroke-width="1.5"/><path d="M8 5v3m0 2.5h.01" stroke="#E8912D" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span>${t('orders.customsTaxInfoNotice')}</span>
          </div>

          <div class="mb-5">
            <label class="block text-[13px] font-semibold text-(--color-text-body,#333) mb-2">${t('orders.taxpayerType')} <span class="text-[#e53935]">*</span></label>
            <div class="flex flex-col gap-2.5">
              <label class="os-modal__radio flex items-center gap-2 text-sm text-(--color-text-body,#333) cursor-pointer">
                <input type="radio" name="customs-type" value="business" checked class="hidden" />
                <span class="os-modal__radio-custom w-[18px] h-[18px] border-2 border-(--color-border-medium,#d1d5db) rounded-full shrink-0 relative transition-colors"></span>
                ${t('orders.business')}
              </label>
              <label class="os-modal__radio flex items-center gap-2 text-sm text-(--color-text-body,#333) cursor-pointer">
                <input type="radio" name="customs-type" value="personal" class="hidden" />
                <span class="os-modal__radio-custom w-[18px] h-[18px] border-2 border-(--color-border-medium,#d1d5db) rounded-full shrink-0 relative transition-colors"></span>
                ${t('orders.personal')}
              </label>
            </div>
          </div>
          <div class="mb-5">
            <label class="block text-[13px] font-semibold text-(--color-text-body,#333) mb-2">${t('orders.einLabel')} <span class="text-[#e53935]">*</span></label>
            <input type="text" class="os-modal__input w-full py-2.5 px-3 text-sm border border-(--color-border-medium,#d1d5db) rounded-md outline-none text-(--color-text-heading,#111827) transition-colors box-border focus:border-(--color-cta-primary,#cc9900) focus:shadow-[0_0_0_2px_rgba(249,115,22,0.1)]" placeholder="${t('orders.enterEin')}" />
          </div>
          <div class="flex items-start gap-1.5 text-xs text-(--color-text-placeholder,#999) leading-normal mb-1">
            <svg class="shrink-0 mt-px" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1a4 4 0 00-4 4v2H2a1 1 0 00-1 1v4a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm-2 4a2 2 0 114 0v2H5V5z" fill="#999"/></svg>
            <span>${t('orders.privacyNotice')} <a href="#" class="text-(--color-cta-primary,#333333) no-underline hover:underline">${t('orders.privacyPolicy')}</a> ${t('orders.privacyNoticeEnd')}</span>
          </div>
          <label class="os-modal__checkbox flex items-start gap-2.5 text-[13px] text-(--color-text-body,#333) leading-normal cursor-pointer mt-4">
            <input type="checkbox" class="hidden" />
            <span class="os-modal__checkbox-custom w-4 h-4 border-2 border-(--color-border-medium,#d1d5db) rounded-[3px] shrink-0 mt-0.5 relative transition-all"></span>
            <span>${t('orders.customsConsentText')}</span>
          </label>
        </div>
        <div class="px-6 pt-4 pb-5 flex justify-end gap-3 border-t border-(--color-border-light,#f0f0f0)">
          <button class="os-modal__btn os-modal__btn--cancel px-6 py-2.5 text-sm font-medium rounded-[20px] cursor-pointer transition-all bg-(--color-surface,#fff) text-(--color-text-body,#333) border border-(--color-border-medium,#d1d5db) hover:border-[#999]">${t('common.cancel')}</button>
          <button class="os-modal__btn os-modal__btn--primary px-6 py-2.5 text-sm font-medium rounded-[20px] cursor-pointer border-none transition-all bg-(--color-cta-primary,#333333) text-white hover:bg-(--color-cta-primary-hover,#1f1f1f)">${t('common.save')}</button>
        </div>
      </div>
    </div>
  `;
}

/* ────────────────────────────────────────
   SECTION MAP
   ──────────────────────────────────────── */
const SECTIONS: Record<string, () => string> = {
  'all-orders': renderAllOrders,
  'refunds': renderRefunds,
  'reviews': renderReviews,
  'coupons': renderCoupons,
  'tax-info': renderTaxInfo,
};

/* ────────────────────────────────────────
   MAIN LAYOUT
   ──────────────────────────────────────── */
function getActiveSection(): string {
  const hash = window.location.hash.replace('#', '');
  return SECTIONS[hash] ? hash : 'all-orders';
}

function renderNav(activeId: string): string {
  return getNavItems().map(item => {
    const isActive = item.id === activeId;
    const activeClasses = isActive
      ? 'orders-page__nav-link--active text-gray-900 border-b-2 border-gray-900 font-semibold'
      : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300';
    return `<button type="button" class="orders-page__nav-link py-3 px-4 max-sm:px-3 text-sm max-sm:text-[13px] whitespace-nowrap transition-colors shrink-0 bg-transparent border-none cursor-pointer ${activeClasses}" data-nav="${item.id}">${item.label}</button>`;
  }).join('');
}

export function OrdersPageLayout(): string {
  const activeId = getActiveSection();
  const renderFn = SECTIONS[activeId] ?? renderAllOrders;

  return `
    <div class="orders-page bg-(--color-surface,#fff) rounded-lg min-h-[calc(100vh-80px)] max-md:rounded-none max-md:min-h-0">
      <!-- Top Tab Navigation -->
      <nav class="orders-page__nav-links flex overflow-x-auto scrollbar-hide border-b border-(--color-border-light,#e5e7eb) px-3 max-sm:px-1 bg-(--color-surface,#fff)">
        ${renderNav(activeId)}
      </nav>
      <div class="orders-page__content flex-1 flex flex-col min-w-0" id="orders-content">
        ${renderFn()}
      </div>
    </div>
  `;
}

/* ────────────────────────────────────────
   INIT
   ──────────────────────────────────────── */
export function initOrdersPageLayout(): void {
  const contentEl = document.getElementById('orders-content');
  if (!contentEl) return;

  function navigate(): void {
    const activeId = getActiveSection();
    const renderFn = SECTIONS[activeId] ?? renderAllOrders;
    contentEl!.innerHTML = renderFn();

    // Update nav active state
    document.querySelectorAll<HTMLAnchorElement>('.orders-page__nav-link').forEach(link => {
      const isActive = link.dataset.nav === activeId;
      link.classList.toggle('orders-page__nav-link--active', isActive);
      link.classList.toggle('font-semibold', isActive);
      link.classList.toggle('text-gray-900', isActive);
      link.classList.toggle('border-gray-900', isActive);
      link.classList.toggle('text-gray-500', !isActive);
      link.classList.toggle('border-transparent', !isActive);
    });

    // Init inner tabs
    initInnerTabs();
    initPillFilters();
    initTaxModals();
    initOrderTabsScroll();
  }

  // Hash change listener
  window.addEventListener('hashchange', navigate);

  // Nav link clicks
  document.querySelectorAll<HTMLButtonElement>('.orders-page__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.dataset.nav ?? 'all-orders';
      window.location.hash = id;
    });
  });

  // Init inner tabs for initial render
  initInnerTabs();
  initPillFilters();
  initTaxModals();
  initOrderTabsScroll();
}

function initInnerTabs(): void {
  document.querySelectorAll<HTMLElement>('.os-tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll<HTMLButtonElement>('.os-tabs__tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        if (!targetId) return;

        // Toggle active tab
        tabs.forEach(t => t.classList.remove('os-tabs__tab--active'));
        tab.classList.add('os-tabs__tab--active');

        // Toggle content panels within same parent
        const parent = tabGroup.parentElement;
        if (!parent) return;
        parent.querySelectorAll<HTMLElement>('.os-tab-content').forEach(panel => {
          panel.classList.toggle('os-tab-content--active', panel.dataset.content === targetId);
        });
      });
    });
  });
}

function initPillFilters(): void {
  document.querySelectorAll<HTMLElement>('.os-pill-filters').forEach(group => {
    const pills = group.querySelectorAll<HTMLButtonElement>('.os-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('os-pill--active'));
        pill.classList.add('os-pill--active');
      });
    });
  });
}

function openModal(id: string): void {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal: HTMLElement): void {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

function initTaxModals(): void {
  // Open modal on button click
  document.querySelectorAll<HTMLButtonElement>('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modal;
      if (modalId) openModal(modalId);
    });
  });

  // Close modal on overlay click, close button, or cancel button
  document.querySelectorAll<HTMLElement>('.os-modal').forEach(modal => {
    const overlay = modal.querySelector<HTMLElement>('.os-modal__overlay');
    const closeBtn = modal.querySelector<HTMLButtonElement>('.os-modal__close');
    const cancelBtn = modal.querySelector<HTMLButtonElement>('.os-modal__btn--cancel');

    overlay?.addEventListener('click', () => closeModal(modal));
    closeBtn?.addEventListener('click', () => closeModal(modal));
    cancelBtn?.addEventListener('click', () => closeModal(modal));
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalEl = document.querySelector<HTMLElement>('.os-modal:not(.hidden)');
      if (openModalEl) closeModal(openModalEl);
    }
  });
}

/* ────────────────────────────────────────
   ORDER TABS HORIZONTAL SCROLL
   ──────────────────────────────────────── */
function initOrderTabsScroll(): void {
  const scrollEl = document.getElementById('order-tabs-scroll');
  const leftBtn = document.getElementById('order-tabs-left');
  const rightBtn = document.getElementById('order-tabs-right');
  if (!scrollEl || !leftBtn || !rightBtn) return;

  const SCROLL_STEP = 150;

  function updateArrows(): void {
    const { scrollLeft, scrollWidth, clientWidth } = scrollEl!;
    const canScrollLeft = scrollLeft > 2;
    const canScrollRight = scrollLeft < scrollWidth - clientWidth - 2;

    leftBtn!.style.display = canScrollLeft ? 'flex' : 'none';
    rightBtn!.style.display = canScrollRight ? 'flex' : 'none';
  }

  leftBtn.addEventListener('click', () => {
    scrollEl.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', () => {
    scrollEl.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
  });

  scrollEl.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);

  // Mouse wheel horizontal scroll support
  scrollEl.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollEl;
      const canScroll = scrollWidth > clientWidth;
      if (!canScroll) return;

      // Prevent vertical scroll only when tabs can scroll
      const atStart = scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = scrollLeft >= scrollWidth - clientWidth && e.deltaY > 0;
      if (!atStart && !atEnd) {
        e.preventDefault();
        scrollEl.scrollLeft += e.deltaY;
      }
    }
  }, { passive: false });

  // Drag to scroll
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  scrollEl.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    scrollStart = scrollEl.scrollLeft;
    scrollEl.style.cursor = 'grabbing';
    scrollEl.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.pageX - startX;
    scrollEl.scrollLeft = scrollStart - dx;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    scrollEl.style.cursor = '';
    scrollEl.style.userSelect = '';
  });

  // Initial check
  requestAnimationFrame(updateArrows);
}
