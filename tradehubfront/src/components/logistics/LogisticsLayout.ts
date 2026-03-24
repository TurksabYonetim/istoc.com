import { t } from '../../i18n';

/**
 * LogisticsLayout Component
 * Two hash-based views: #orders (default) and #reviews.
 * Orders: info banner, status tabs, search/filters, data table, empty state
 * Reviews: info banner, tabs, search, data table, empty state
 */

/* ────────────────────────────────────────
   SHARED: Empty icon + Info banner
   ──────────────────────────────────────── */
const EMPTY_ENVELOPE_ICON = `
<svg width="64" height="64" viewBox="0 0 64 64" fill="none">
  <rect x="12" y="18" width="40" height="28" rx="4" fill="#F3F4F6" stroke="#D1D5DB" stroke-width="1.5"/>
  <path d="M12 22l20 14 20-14" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="18" y="8" width="28" height="14" rx="3" fill="#E5E7EB" stroke="#D1D5DB" stroke-width="1"/>
</svg>`;

function getInfoBannerOrders(): string {
  return `
<div class="flex items-start gap-2.5 px-4 sm:px-6 py-3.5 bg-[#EFF6FF] text-[13px] text-gray-700 leading-normal rounded-t-lg">
  <svg class="shrink-0 mt-px" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#3B82F6" stroke-width="1.3"/><path d="M8 5v3m0 2.5h.01" stroke="#3B82F6" stroke-width="1.3" stroke-linecap="round"/></svg>
  <span>${t('logistics.ordersBannerInfo')}</span>
</div>`;
}

function getInfoBannerReviews(): string {
  return `
<div class="flex items-start gap-2.5 px-4 sm:px-6 py-3.5 bg-[#EFF6FF] text-[13px] text-gray-700 leading-normal rounded-t-lg">
  <svg class="shrink-0 mt-px" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#3B82F6" stroke-width="1.3"/><path d="M8 5v3m0 2.5h.01" stroke="#3B82F6" stroke-width="1.3" stroke-linecap="round"/></svg>
  <span>${t('logistics.reviewsBannerInfo')}</span>
</div>`;
}

/* ────────────────────────────────────────
   SEARCH ICON
   ──────────────────────────────────────── */
const SEARCH_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#666" stroke-width="1.3"/><path d="M11 11l3 3" stroke="#666" stroke-width="1.3" stroke-linecap="round"/></svg>`;

/* ────────────────────────────────────────
   SECTION: Logistics Orders
   ──────────────────────────────────────── */
function getOrderTabs(): string[] {
  return [
    `${t('logistics.tabAll')} (0)`,
    `${t('logistics.tabWaitingForwarder')} (0)`,
    `${t('logistics.unpaid')} (0)`,
    `${t('logistics.tabToBeShipped')} (0)`,
    `${t('logistics.tabToBeReceived')} (0)`,
    `${t('logistics.tabInDispute')} (0)`,
    `${t('logistics.completedClosed')} (0)`,
  ];
}

function renderOrders(): string {
  const tabs = getOrderTabs().map((label, i) =>
    `<button class="log-tabs__tab px-4 py-3 text-[13px] font-medium text-gray-500 bg-transparent border-none border-b-2 border-b-transparent cursor-pointer transition-colors whitespace-nowrap -mb-px hover:text-gray-900${i === 0 ? ' log-tabs__tab--active !text-gray-900 !font-semibold !border-b-[#222]' : ''}" data-tab="log-order-${i}">${label}</button>`
  ).join('');

  return `
    ${getInfoBannerOrders()}

    <div class="px-4 sm:px-7 pt-6">
      <h1 class="text-[22px] font-bold text-gray-900">${t('logistics.manageOrders')}</h1>
    </div>

    <div class="flex px-4 sm:px-7 border-b border-border-default mt-4 overflow-x-auto scrollbar-hide" data-tabgroup="log-orders">
      ${tabs}
    </div>

    <!-- Search + Filters -->
    <div class="px-4 sm:px-7 py-5">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
        <div class="flex-1 flex border border-border-default rounded-md overflow-hidden min-w-0">
          <input type="text" class="flex-1 min-w-0 px-3.5 py-2.5 text-[14px] border-none outline-none text-gray-900 placeholder:text-gray-400" placeholder="${t('logistics.searchByOrderNo')}" />
          <button class="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-[14px] text-gray-700 bg-white border-none border-l border-l-border-default cursor-pointer whitespace-nowrap hover:bg-gray-100 transition-colors">${SEARCH_ICON} ${t('logistics.searchBtn')}</button>
        </div>
        <a href="#" class="text-[13px] text-primary-500 no-underline whitespace-nowrap hover:underline self-end sm:self-auto">${t('logistics.resetAll')}</a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="relative">
          <input type="text" class="w-full py-2.5 pl-3.5 pr-9 text-[14px] border border-border-default rounded-md outline-none text-gray-900 bg-white cursor-pointer box-border" placeholder="${t('logistics.orderPlaced')}" readonly />
          <svg class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="#999" stroke-width="1.2"/><path d="M2 6h12M5 1v3M11 1v3" stroke="#999" stroke-width="1.2" stroke-linecap="round"/></svg>
        </div>
        <div>
          <label class="block text-[13px] text-gray-500 mb-1">${t('logistics.serviceType')}</label>
          <select class="w-full py-2.5 px-3 text-[14px] border border-border-default rounded-md outline-none text-gray-900 bg-white appearance-none cursor-pointer box-border">
            <option>${t('logistics.selectOption')}</option>
            <option>${t('logistics.seaFreight')}</option>
            <option>${t('logistics.airFreight')}</option>
            <option>${t('logistics.landFreight')}</option>
            <option>${t('logistics.express')}</option>
          </select>
        </div>
        <div>
          <label class="block text-[13px] text-gray-500 mb-1">${t('logistics.shipmentStatus')}</label>
          <select class="w-full py-2.5 px-3 text-[14px] border border-border-default rounded-md outline-none text-gray-900 bg-white appearance-none cursor-pointer box-border">
            <option>${t('logistics.selectOption')}</option>
            <option>${t('logistics.pending')}</option>
            <option>${t('logistics.inTransit')}</option>
            <option>${t('logistics.delivered')}</option>
            <option>${t('logistics.cancelled')}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="px-4 sm:px-7 pb-7 overflow-x-auto">
      <table class="w-full border-collapse min-w-[600px]">
        <thead>
          <tr>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-3 py-3 border-b border-border-default bg-surface-muted whitespace-nowrap">${t('logistics.thServiceCarrier')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-3 py-3 border-b border-border-default bg-surface-muted whitespace-nowrap">${t('logistics.thOriginDest')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-3 py-3 border-b border-border-default bg-surface-muted whitespace-nowrap">${t('logistics.thProductInfo')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-3 py-3 border-b border-border-default bg-surface-muted whitespace-nowrap">${t('logistics.thShipmentStatus')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-3 py-3 border-b border-border-default bg-surface-muted whitespace-nowrap">${t('logistics.thQuantity')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-3 py-3 border-b border-border-default bg-surface-muted whitespace-nowrap">${t('logistics.thAction')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6" class="text-center py-20 px-4 text-gray-400 text-[14px]">
              <div class="flex justify-center mb-3">${EMPTY_ENVELOPE_ICON}</div>
              <p class="m-0">${t('logistics.noResults')}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

/* ────────────────────────────────────────
   SECTION: Logistics Order Reviews
   ──────────────────────────────────────── */
function renderReviews(): string {
  return `
    ${getInfoBannerReviews()}

    <div class="px-4 sm:px-7 pt-6 flex items-baseline gap-3 flex-wrap max-md:flex-col max-md:gap-1">
      <h1 class="text-[22px] font-bold text-gray-900">${t('logistics.myReviews')}</h1>
      <p class="text-[14px] text-gray-400 m-0">${t('logistics.reviewsDesc')}</p>
    </div>

    <div class="flex px-4 sm:px-7 border-b border-border-default mt-4 overflow-x-auto scrollbar-hide" data-tabgroup="log-reviews">
      <button class="log-tabs__tab log-tabs__tab--active px-4 py-3 text-[13px] font-semibold text-gray-900 bg-transparent border-none border-b-2 border-b-[#222] cursor-pointer whitespace-nowrap -mb-px" data-tab="log-review-pending">${t('logistics.toBeReviewed')} (0)</button>
      <button class="log-tabs__tab px-4 py-3 text-[13px] font-medium text-gray-500 bg-transparent border-none border-b-2 border-b-transparent cursor-pointer whitespace-nowrap -mb-px hover:text-gray-900" data-tab="log-review-done">${t('logistics.reviewed')} (0)</button>
    </div>

    <!-- Search -->
    <div class="px-4 sm:px-7 py-5">
      <div class="flex border border-border-default rounded-md overflow-hidden max-w-[500px]">
        <input type="text" class="flex-1 min-w-0 px-3.5 py-2.5 text-[14px] border-none outline-none text-gray-900" placeholder="" />
        <button class="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-[14px] text-gray-700 bg-white border-none border-l border-l-border-default cursor-pointer whitespace-nowrap hover:bg-gray-100 transition-colors">${SEARCH_ICON} ${t('logistics.searchBtn')}</button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="px-4 sm:px-7 pb-7 overflow-x-auto">
      <table class="w-full border-collapse min-w-[600px]">
        <thead>
          <tr>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-3 py-3 border-b border-border-default bg-surface-muted whitespace-nowrap">${t('logistics.thFreightForwarder')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-3 py-3 border-b border-border-default bg-surface-muted whitespace-nowrap">${t('logistics.thReviewServiceType')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-3 py-3 border-b border-border-default bg-surface-muted whitespace-nowrap">${t('logistics.thReviewOriginDest')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-3 py-3 border-b border-border-default bg-surface-muted whitespace-nowrap">${t('logistics.thReviewProductInfo')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-3 py-3 border-b border-border-default bg-surface-muted whitespace-nowrap">${t('logistics.thReviewStatus')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-3 py-3 border-b border-border-default bg-surface-muted whitespace-nowrap">${t('logistics.thReviewAction')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6" class="text-center py-20 px-4 text-gray-400 text-[14px]">
              <div class="flex justify-center mb-3">${EMPTY_ENVELOPE_ICON}</div>
              <p class="m-0">${t('logistics.noResults')}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

/* ────────────────────────────────────────
   SECTION MAP
   ──────────────────────────────────────── */
const SECTIONS: Record<string, () => string> = {
  'orders': renderOrders,
  'reviews': renderReviews,
};

function getActiveSection(): string {
  const hash = window.location.hash.replace('#', '');
  return SECTIONS[hash] ? hash : 'orders';
}

/* ────────────────────────────────────────
   MAIN LAYOUT
   ──────────────────────────────────────── */
export function LogisticsLayout(): string {
  const activeId = getActiveSection();
  const renderFn = SECTIONS[activeId] ?? renderOrders;

  return `
    <div class="bg-white rounded-lg min-h-[600px]" id="log-content">
      ${renderFn()}
    </div>
  `;
}

/* ────────────────────────────────────────
   INIT
   ──────────────────────────────────────── */
export function initLogisticsLayout(): void {
  const contentEl = document.getElementById('log-content');
  if (!contentEl) return;

  function navigate(): void {
    const activeId = getActiveSection();
    const renderFn = SECTIONS[activeId] ?? renderOrders;
    contentEl!.innerHTML = renderFn();
    initLogTabs();
  }

  window.addEventListener('hashchange', navigate);
  initLogTabs();
}

function initLogTabs(): void {
  document.querySelectorAll<HTMLElement>('.log-tabs__tab').forEach(tab => {
    const parent = tab.parentElement;
    if (!parent) return;
    tab.addEventListener('click', () => {
      parent.querySelectorAll<HTMLButtonElement>('.log-tabs__tab').forEach(btn => {
        btn.classList.remove('log-tabs__tab--active', '!text-gray-900', '!font-semibold', '!border-b-[#222]');
        btn.classList.add('text-gray-500');
      });
      tab.classList.add('log-tabs__tab--active', '!text-gray-900', '!font-semibold', '!border-b-[#222]');
      tab.classList.remove('text-gray-500');
    });
  });
}
