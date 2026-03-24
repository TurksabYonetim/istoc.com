/**
 * FavoritesLayout Component
 * Two hash-based views: #favorites (default) and #browsing-history.
 * Favorites: dynamic list-based system with sidebar, tabs, create/delete lists.
 */

import favEmptySvg from '../../assets/images/O1CN01Bny3KU1Swwfj3Ntma_!!6000000002312-55-tps-222-221.svg';
import { t } from '../../i18n';
import { formatPrice } from '../../utils/currency';
import { showToast } from '../../utils/toast';
import { getBrowsingHistory } from '../../services/browsingHistoryService';
import {
  getLists,
  getItems,
  getItemsByList,
  getListItemCount,
  getTotalCount,
  createList,
  deleteList,
  removeFromFavorites,
  type FavoriteItem,
} from '../../stores/favorites';

const DEFAULT_LIST_ID = 'default';

/* ────────────────────────────────────────
   EMPTY STATE ILLUSTRATION
   ──────────────────────────────────────── */
const FAVORITES_EMPTY_SVG = `<img src="${favEmptySvg}" alt="${t('favorites.noFavorites')}" width="160" height="160" />`;

/* ────────────────────────────────────────
   Current active filter state
   ──────────────────────────────────────── */
let activeListFilter: string = 'all'; // 'all', 'default', or a custom list id

/* ────────────────────────────────────────
   SECTION RENDERERS
   ──────────────────────────────────────── */

function renderEmptyState(): string {
  return `
    <div class="flex flex-col items-center text-center py-15 px-5">
      <div class="mb-5">${FAVORITES_EMPTY_SVG}</div>
      <h3 class="text-base font-bold text-text-primary mb-2.5">${t('favorites.noFavorites')}</h3>
      <p class="text-sm text-text-tertiary leading-relaxed max-w-[380px]">${t('favorites.noFavoritesDesc')}</p>
    </div>
  `;
}

function renderSidebarLists(): string {
  const lists = getLists();
  const totalCount = getTotalCount();
  const defaultCount = getListItemCount(DEFAULT_LIST_ID);

  const customListItems = lists.map(list => {
    const count = getListItemCount(list.id);
    const isActive = activeListFilter === list.id;
    return `
      <div class="fav-products__list-item group relative ${isActive ? 'fav-products__list-item--active bg-surface-raised' : ''} p-2.5 px-3 rounded-md cursor-pointer transition-[background] duration-150 hover:bg-surface-raised" data-filter-list="${list.id}">
        <span class="block text-sm font-semibold text-text-primary">${escapeHtml(list.name)}</span>
        <span class="block text-xs text-text-tertiary mt-0.5">${t('favorites.itemCount', { count })}</span>
        <button type="button" class="fav-delete-list-btn absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all" data-delete-list="${list.id}" title="${t('favorites.deleteList')}">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    `;
  }).join('');

  return `
    <div class="fav-products__list-item ${activeListFilter === 'all' ? 'fav-products__list-item--active bg-surface-raised' : ''} p-2.5 px-3 rounded-md cursor-pointer transition-[background] duration-150 hover:bg-surface-raised" data-filter-list="all">
      <span class="block text-sm font-semibold text-text-primary">${t('favorites.listAll')}</span>
      <span class="block text-xs text-text-tertiary mt-0.5">${t('favorites.itemCount', { count: totalCount })}</span>
    </div>
    <div class="fav-products__list-item ${activeListFilter === 'default' ? 'fav-products__list-item--active bg-surface-raised' : ''} p-2.5 px-3 rounded-md cursor-pointer transition-[background] duration-150 hover:bg-surface-raised" data-filter-list="default">
      <div class="flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 text-red-500 shrink-0" fill="#ef4444" stroke="#ef4444" stroke-width="1" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        <span class="block text-sm font-semibold text-text-primary">${t('favorites.defaultList')}</span>
      </div>
      <span class="block text-xs text-text-tertiary mt-0.5">${t('favorites.itemCount', { count: defaultCount })}</span>
    </div>
    ${customListItems}
  `;
}

function renderProductCards(items: FavoriteItem[]): string {
  if (items.length === 0) return renderEmptyState();

  const cards = items.map(p => `
    <div class="relative bg-white rounded-lg border border-[#eee] hover:border-[#F60] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all p-4 group" data-fav-item-id="${p.id}">
      <button type="button" class="fav-remove-item absolute top-2 right-2 w-8 h-8 rounded-full bg-[#f4f4f4] flex items-center justify-center cursor-pointer hover:bg-red-100 z-10 transition-colors" data-remove-id="${p.id}" title="${t('favorites.removeFromAll')}">
        <svg class="w-[18px] h-[18px] text-[#f60]" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="1.5"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
      </button>
      <a href="#" class="block no-underline">
        <div class="w-full aspect-square rounded overflow-hidden mb-3 bg-[#f5f5f5]">
          <img src="${p.image}" alt="${escapeHtml(p.title)}" class="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
        </div>
        <h4 class="text-[13px] font-normal text-[#333] leading-[18px] line-clamp-2 mb-2 group-hover:text-[#F60] transition-colors">${escapeHtml(p.title)}</h4>
        <div class="flex items-baseline gap-1 mb-1">
          <span class="text-[16px] font-[700] text-[#111] leading-none">${formatPrice(p.priceRange)}</span>
        </div>
        <p class="text-[12px] text-[#999] opacity-80">${p.minOrder}</p>
      </a>
      <div class="mt-4 flex gap-2 w-full pt-3 border-t border-[#f2f2f2] opacity-0 group-hover:opacity-100 transition-opacity">
        <button class="flex-1 th-btn th-btn-pill th-btn-sm">${t('favorites.orderNow')}</button>
      </div>
      ${p.listIds.length > 0 ? `
        <div class="mt-2 flex flex-wrap gap-1">
          ${p.listIds.filter(id => id !== DEFAULT_LIST_ID).map(id => {
            const list = getLists().find(l => l.id === id);
            return list ? `<span class="inline-flex items-center px-2 py-0.5 text-[10px] rounded-full bg-gray-100 text-gray-600">${escapeHtml(list.name)}</span>` : '';
          }).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');

  return `
    <div class="px-7 pt-5 pb-7 max-sm:px-3">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[18px] font-bold text-text-primary">${t('favorites.products')}</h2>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1 bg-surface-raised border border-border-default rounded text-[13px] text-text-secondary hover:bg-[#f0f0f0]">${t('favorites.sortBy')}</button>
          <button class="w-8 h-8 rounded bg-surface-raised border border-border-default flex items-center justify-center hover:bg-[#f0f0f0]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2">
        ${cards}
      </div>
    </div>
  `;
}

function renderFavorites(): string {
  return `
    <div class="px-7 pt-6 max-sm:px-3 max-sm:pt-4">
      <h1 class="text-xl font-bold text-text-primary">${t('favorites.title')}</h1>
    </div>

    <div class="fav-tabs flex px-7 max-sm:px-3 border-b border-border-default mt-4" data-tabgroup="fav">
      <button class="fav-tabs__tab fav-tabs__tab--active py-3 px-5 text-sm font-medium text-text-secondary bg-transparent border-none border-b-3 border-transparent cursor-pointer transition-[color,border-color] duration-150 -mb-px hover:text-text-primary" data-tab="fav-products">${t('favorites.products')}</button>
      <button class="fav-tabs__tab py-3 px-5 text-sm font-medium text-text-secondary bg-transparent border-none border-b-3 border-transparent cursor-pointer transition-[color,border-color] duration-150 -mb-px hover:text-text-primary" data-tab="fav-suppliers">${t('favorites.suppliers')}</button>
    </div>

    <!-- Tab: Products -->
    <div class="fav-tab-content fav-tab-content--active" data-content="fav-products">
      <div class="fav-products flex min-h-[400px] max-md:flex-col">
        <aside class="fav-products__sidebar w-60 shrink-0 py-5 px-6 border-r border-[#f0f0f0] max-md:w-full max-md:border-r-0 max-md:border-b max-md:border-[#f0f0f0]">
          <h3 class="text-base font-bold text-text-primary mb-2.5">${t('favorites.myList')}</h3>
          <a href="#" class="text-sm text-text-primary font-semibold underline underline-offset-2 hover:text-(--color-cta-primary)" data-action="create-list">${t('favorites.createList')}</a>
          <div class="mt-4 flex flex-col gap-0.5" id="fav-list-sidebar">
            ${renderSidebarLists()}
          </div>
        </aside>
        <div class="flex-1 min-w-0" id="fav-products-container">
          <!-- Populated via JS -->
          ${renderEmptyState()}
        </div>
      </div>
    </div>

    <!-- Tab: Suppliers -->
    <div class="fav-tab-content" data-content="fav-suppliers">
      ${renderEmptyState()}
    </div>

    <!-- Modal: New list -->
    <div class="fav-modal hidden fixed inset-0 z-[9999] items-center justify-center" id="fav-list-modal">
      <div class="fav-modal__overlay absolute inset-0 bg-black/45"></div>
      <div class="relative bg-surface rounded-xl w-[440px] max-w-[calc(100vw-32px)] shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-[favModalIn_200ms_ease-out]">
        <div class="flex items-center justify-between px-6 pt-5 pb-4">
          <h3 class="text-lg font-bold text-text-primary">${t('favorites.addNewList')}</h3>
          <button class="fav-modal__close bg-transparent border-none cursor-pointer p-1 rounded flex items-center justify-center transition-[background] duration-150 hover:bg-surface-raised" aria-label="${t('common.close')}">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14 4L4 14M4 4l10 10" stroke="#333" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="px-6 pb-5">
          <div class="relative">
            <input type="text" class="fav-modal__input w-full py-3 pr-[50px] pl-3.5 text-sm border border-border-strong rounded-[20px] outline-none text-text-primary transition-[border-color] duration-150 focus:border-secondary-800 placeholder:text-text-tertiary" placeholder="${t('favorites.enterName')}" maxlength="25" id="fav-list-input" />
            <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-tertiary"><span id="fav-char-count">0</span>/25</span>
          </div>
        </div>
        <div class="flex justify-center gap-4 px-6 pb-6">
          <button class="fav-modal__btn--cancel py-2.5 px-8 text-sm font-medium rounded-[20px] cursor-pointer transition-all duration-150 bg-surface text-text-secondary border border-border-strong hover:border-secondary-400">${t('common.cancel')}</button>
          <button class="fav-modal__btn--save th-btn th-btn-pill" disabled>${t('common.save')}</button>
        </div>
      </div>
    </div>
  `;
}

function renderBrowsingHistory(): string {
  const history = getBrowsingHistory();

  if (history.length === 0) {
    return `
      <div class="px-7 pt-6 max-sm:px-3 max-sm:pt-4">
        <h1 class="text-xl font-bold text-text-primary">${t('favorites.browsingHistoryTitle')}</h1>
        <p class="text-sm text-text-tertiary mt-1">${t('favorites.browsingHistoryDesc')}</p>
      </div>
      <div class="flex flex-col items-center text-center py-15 px-5">
        <div class="mb-5">${FAVORITES_EMPTY_SVG}</div>
        <h3 class="text-base font-bold text-text-primary mb-2.5">${t('favorites.browsingHistoryTitle')}</h3>
        <p class="text-sm text-text-tertiary leading-relaxed max-w-[380px]">${t('favorites.browsingHistoryDesc')}</p>
      </div>
    `;
  }

  const productCards = history.map(p => `
    <a href="${p.href}" class="group flex flex-col no-underline text-inherit transition-transform duration-150 hover:-translate-y-0.5">
      <div class="w-full aspect-square rounded-lg overflow-hidden border border-[#f0f0f0] mb-2.5">
        <img src="${p.image}" alt="${escapeHtml(p.title)}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" loading="lazy" />
      </div>
      <h4 class="text-[13px] text-text-secondary leading-[1.4] line-clamp-2 mb-1.5" title="${escapeHtml(p.title)}">${escapeHtml(p.title)}</h4>
      ${p.priceRange ? `<p class="text-sm font-bold text-text-primary mb-0.5">${formatPrice(p.priceRange)}</p>` : ''}
      ${p.minOrder ? `<p class="text-xs text-text-tertiary">${p.minOrder}</p>` : ''}
    </a>
  `).join('');

  return `
    <div class="px-7 pt-6 max-sm:px-3 max-sm:pt-4">
      <h1 class="text-xl font-bold text-text-primary">${t('favorites.browsingHistoryTitle')}</h1>
      <p class="text-sm text-text-tertiary mt-1">${t('favorites.browsingHistoryDesc')}</p>
    </div>
    <div class="grid grid-cols-5 gap-4 px-7 py-5 pb-7 max-md:grid-cols-2 max-md:p-4 max-sm:grid-cols-2 max-sm:gap-3 max-sm:p-3 max-lg:min-[769px]:grid-cols-3">
      ${productCards}
    </div>
  `;
}

/* ────────────────────────────────────────
   SECTION MAP
   ──────────────────────────────────────── */
const SECTIONS: Record<string, () => string> = {
  'favorites': renderFavorites,
  'browsing-history': renderBrowsingHistory,
};

function getActiveSection(): string {
  const hash = window.location.hash.replace('#', '');
  return SECTIONS[hash] ? hash : 'favorites';
}

/* ────────────────────────────────────────
   MAIN LAYOUT
   ──────────────────────────────────────── */
export function FavoritesLayout(): string {
  const activeId = getActiveSection();
  const renderFn = SECTIONS[activeId] ?? renderFavorites;

  return `
    <div class="bg-surface rounded-lg min-h-[600px]" id="fav-content">
      ${renderFn()}
    </div>
  `;
}

/* ────────────────────────────────────────
   INIT
   ──────────────────────────────────────── */
export function initFavoritesLayout(): void {
  const contentEl = document.getElementById('fav-content');
  if (!contentEl) return;

  function navigate(): void {
    const activeId = getActiveSection();
    const renderFn = SECTIONS[activeId] ?? renderFavorites;
    contentEl!.innerHTML = renderFn();
    initFavTabs();
    initFavListModal();
    loadFavoritesData();
    initListFiltering();
    initRemoveButtons();
    initDeleteListButtons();
  }

  window.addEventListener('hashchange', navigate);

  // Listen for favorites changes (from other pages like product-detail)
  window.addEventListener('favorites-changed', () => {
    refreshFavoritesView();
  });

  // Init for initial render
  initFavTabs();
  initFavListModal();
  loadFavoritesData();
  initListFiltering();
  initRemoveButtons();
  initDeleteListButtons();
}

function refreshFavoritesView(): void {
  // Refresh sidebar counts
  const sidebar = document.getElementById('fav-list-sidebar');
  if (sidebar) {
    sidebar.innerHTML = renderSidebarLists();
    initListFiltering();
    initDeleteListButtons();
  }

  // Refresh product cards
  loadFavoritesData();
  initRemoveButtons();
}

function getFilteredItems(): FavoriteItem[] {
  if (activeListFilter === 'all') {
    return getItems();
  }
  return getItemsByList(activeListFilter);
}

function loadFavoritesData(): void {
  const container = document.getElementById('fav-products-container');
  if (!container) return;

  const items = getFilteredItems();
  container.innerHTML = renderProductCards(items);
  initRemoveButtons();
}

function initListFiltering(): void {
  document.querySelectorAll<HTMLElement>('[data-filter-list]').forEach(item => {
    item.addEventListener('click', (e) => {
      // Don't trigger if clicking delete button
      if ((e.target as HTMLElement).closest('.fav-delete-list-btn')) return;

      const listId = item.dataset.filterList!;
      activeListFilter = listId;

      // Update sidebar active state
      document.querySelectorAll<HTMLElement>('.fav-products__list-item').forEach(i => {
        i.classList.remove('fav-products__list-item--active', 'bg-surface-raised');
      });
      item.classList.add('fav-products__list-item--active', 'bg-surface-raised');

      // Reload products
      loadFavoritesData();
    });
  });
}

function initRemoveButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('.fav-remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = btn.dataset.removeId!;
      removeFromFavorites(productId);

      // Animate out and refresh
      const card = btn.closest('[data-fav-item-id]') as HTMLElement;
      if (card) {
        card.style.transition = 'all 300ms ease-out';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => refreshFavoritesView(), 300);
      } else {
        refreshFavoritesView();
      }

      showToast({ message: t('product.removedFromFavorites'), type: 'info' });
    });
  });
}

function initDeleteListButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('.fav-delete-list-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const listId = btn.dataset.deleteList!;

      deleteList(listId);

      // Reset filter to 'all' if current filter was deleted
      if (activeListFilter === listId) {
        activeListFilter = 'all';
      }

      refreshFavoritesView();
      showToast({ message: t('favorites.removedFromList'), type: 'info' });
    });
  });
}

function initFavTabs(): void {
  document.querySelectorAll<HTMLElement>('.fav-tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll<HTMLButtonElement>('.fav-tabs__tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        if (!targetId) return;

        // Reset all tabs
        tabs.forEach(t => {
          t.classList.remove('fav-tabs__tab--active');
          t.style.color = '';
          t.style.fontWeight = '';
          t.style.borderBottomColor = 'transparent';
        });
        // Activate clicked tab
        tab.classList.add('fav-tabs__tab--active');
        tab.style.fontWeight = '600';
        tab.style.borderBottomColor = '#222';

        const parent = tabGroup.parentElement;
        if (!parent) return;
        parent.querySelectorAll<HTMLElement>('.fav-tab-content').forEach(panel => {
          const isActive = panel.dataset.content === targetId;
          panel.classList.toggle('fav-tab-content--active', isActive);
          panel.style.display = isActive ? 'block' : 'none';
        });
      });
    });

    // Set initial active tab style
    const activeTab = tabGroup.querySelector<HTMLButtonElement>('.fav-tabs__tab--active');
    if (activeTab) {
      activeTab.style.fontWeight = '600';
      activeTab.style.borderBottomColor = '#222';
    }
  });
}

function initFavListModal(): void {
  const modal = document.getElementById('fav-list-modal');
  if (!modal) return;

  const overlay = modal.querySelector<HTMLElement>('.fav-modal__overlay');
  const closeBtn = modal.querySelector<HTMLButtonElement>('.fav-modal__close');
  const cancelBtn = modal.querySelector<HTMLButtonElement>('.fav-modal__btn--cancel');
  const saveBtn = modal.querySelector<HTMLButtonElement>('.fav-modal__btn--save');
  const input = document.getElementById('fav-list-input') as HTMLInputElement | null;
  const counter = document.getElementById('fav-char-count');

  function openModal(): void {
    modal!.classList.remove('hidden');
    modal!.classList.add('flex');
    document.body.style.overflow = 'hidden';
    input?.focus();
  }

  function closeModal(): void {
    modal!.classList.add('hidden');
    modal!.classList.remove('flex');
    document.body.style.overflow = '';
    if (input) { input.value = ''; }
    if (counter) { counter.textContent = '0'; }
    if (saveBtn) { saveBtn.disabled = true; }
  }

  function handleSave(): void {
    if (!input || !input.value.trim()) return;
    const name = input.value.trim();
    createList(name);
    closeModal();
    refreshFavoritesView();
    showToast({
      message: `${t('favorites.listCreated')} "${name}"`,
      type: 'success',
    });
  }

  // Open modal from "Create a list" link
  document.querySelector<HTMLElement>('[data-action="create-list"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  overlay?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  saveBtn?.addEventListener('click', handleSave);

  // Character counter + save button state
  input?.addEventListener('input', () => {
    const len = input.value.length;
    if (counter) counter.textContent = String(len);
    if (saveBtn) saveBtn.disabled = len === 0;
  });

  // Enter key to save
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      handleSave();
    }
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal!.classList.contains('hidden')) {
      closeModal();
    }
  });
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
