/**
 * FavoritesDropdown Component
 * YouTube-like "Save to list" dropdown that appears when clicking the heart button.
 * Shows existing lists with checkboxes + "Create new list" option.
 */

import { t } from '../../i18n';
import {
  getLists,
  isItemFavorited,
  getItemListIds,
  toggleItemInList,
  removeFromFavorites,
  createList,
  type FavoriteList,
} from '../../stores/favorites';
import { showToast } from '../../utils/toast';

interface ProductData {
  id: string;
  image: string;
  title: string;
  priceRange: string;
  minOrder: string;
}

const DEFAULT_LIST_ID = 'default';
let activeDropdown: HTMLElement | null = null;
let outsideClickHandler: ((e: MouseEvent) => void) | null = null;

/**
 * Close any open dropdown
 */
export function closeFavoritesDropdown(): void {
  if (activeDropdown) {
    activeDropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
    activeDropdown.classList.remove('opacity-100', 'scale-100');
    setTimeout(() => {
      activeDropdown?.remove();
      activeDropdown = null;
    }, 150);
  }
  if (outsideClickHandler) {
    document.removeEventListener('click', outsideClickHandler, true);
    outsideClickHandler = null;
  }
}

/**
 * Open the favorites dropdown anchored to the given button element
 */
export function openFavoritesDropdown(anchorBtn: HTMLElement, product: ProductData): void {
  // Close any existing dropdown
  closeFavoritesDropdown();

  const isFav = isItemFavorited(product.id);
  const itemListIds = getItemListIds(product.id);
  const lists = getLists();

  // Build dropdown HTML
  const dropdown = document.createElement('div');
  dropdown.id = 'fav-dropdown';
  dropdown.className =
    'fixed z-[9999] w-[280px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.16)] border border-gray-100 ' +
    'opacity-0 scale-95 pointer-events-none transition-all duration-150 origin-top';

  dropdown.innerHTML = buildDropdownContent(isFav, itemListIds, lists);

  document.body.appendChild(dropdown);
  activeDropdown = dropdown;

  // Position dropdown
  positionDropdown(anchorBtn, dropdown);

  // Animate in
  requestAnimationFrame(() => {
    dropdown.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
    dropdown.classList.add('opacity-100', 'scale-100');
  });

  // Wire events
  wireDropdownEvents(dropdown, product, anchorBtn);

  // Outside click to close
  outsideClickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!dropdown.contains(target) && !anchorBtn.contains(target)) {
      closeFavoritesDropdown();
    }
  };
  setTimeout(() => {
    document.addEventListener('click', outsideClickHandler!, true);
  }, 10);

  // Escape key
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeFavoritesDropdown();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

function buildDropdownContent(
  isFav: boolean,
  itemListIds: string[],
  lists: FavoriteList[]
): string {
  const defaultChecked = itemListIds.includes(DEFAULT_LIST_ID);

  // List items
  const listItems = lists.map(list => {
    const checked = itemListIds.includes(list.id);
    return `
      <label class="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors" data-list-id="${list.id}">
        <input type="checkbox" class="fav-list-checkbox w-[18px] h-[18px] rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer accent-[#F60]" ${checked ? 'checked' : ''} data-list-id="${list.id}" />
        <div class="flex-1 min-w-0">
          <span class="block text-sm text-gray-700 truncate">${escapeHtml(list.name)}</span>
        </div>
        ${checked ? '<svg class="w-4 h-4 text-[#F60] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>' : ''}
      </label>
    `;
  }).join('');

  return `
    <!-- Header -->
    <div class="flex items-center justify-between px-4 pt-3.5 pb-2">
      <h3 class="text-sm font-semibold text-gray-900">${t('favorites.saveToList')}</h3>
      <button type="button" class="fav-dropdown-close p-1 rounded-lg hover:bg-gray-100 transition-colors" aria-label="${t('common.close')}">
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Default favorites -->
    <div class="border-b border-gray-100">
      <label class="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors" data-list-id="${DEFAULT_LIST_ID}">
        <input type="checkbox" class="fav-list-checkbox w-[18px] h-[18px] rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer accent-[#F60]" ${defaultChecked ? 'checked' : ''} data-list-id="${DEFAULT_LIST_ID}" />
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <svg class="w-5 h-5 text-red-500 shrink-0" fill="${defaultChecked ? '#ef4444' : 'none'}" stroke="#ef4444" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <span class="text-sm font-medium text-gray-700">${t('favorites.defaultList')}</span>
        </div>
      </label>
    </div>

    <!-- Custom lists -->
    <div class="max-h-[200px] overflow-y-auto" id="fav-dropdown-lists">
      ${listItems}
    </div>

    <!-- Create new list -->
    <div class="border-t border-gray-100" id="fav-dropdown-footer">
      <button type="button" class="fav-create-list-btn flex items-center gap-2.5 w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        <span>${t('favorites.newList')}</span>
      </button>

      <!-- Inline create form (hidden by default) -->
      <div class="hidden px-4 pb-3" id="fav-inline-create">
        <div class="flex gap-2">
          <input type="text" id="fav-inline-input" maxlength="25" placeholder="${t('favorites.enterName')}" class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#F60] focus:ring-1 focus:ring-[#F60]/30 transition-colors" />
          <button type="button" id="fav-inline-save" class="px-3 py-2 text-sm font-medium text-white bg-[#F60] rounded-lg hover:bg-[#e55a00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            ${t('common.save')}
          </button>
        </div>
      </div>
    </div>

    ${isFav ? `
    <!-- Remove from all -->
    <div class="border-t border-gray-100">
      <button type="button" class="fav-remove-all-btn flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-b-xl">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        <span>${t('favorites.removeFromAll')}</span>
      </button>
    </div>
    ` : ''}
  `;
}

function positionDropdown(anchor: HTMLElement, dropdown: HTMLElement): void {
  const rect = anchor.getBoundingClientRect();
  const dropdownHeight = 350; // approximate max height
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceRight = window.innerWidth - rect.left;

  let top: number;
  let left: number;

  // Vertical: prefer below
  if (spaceBelow >= dropdownHeight || spaceBelow > rect.top) {
    top = rect.bottom + 8;
  } else {
    top = rect.top - dropdownHeight - 8;
  }

  // Horizontal: align right edge with button, fallback left
  if (spaceRight >= 280) {
    left = rect.left;
  } else {
    left = rect.right - 280;
  }

  // Clamp to viewport
  top = Math.max(8, Math.min(top, window.innerHeight - dropdownHeight - 8));
  left = Math.max(8, Math.min(left, window.innerWidth - 288));

  dropdown.style.top = `${top}px`;
  dropdown.style.left = `${left}px`;
}

function wireDropdownEvents(
  dropdown: HTMLElement,
  product: ProductData,
  _anchorBtn: HTMLElement
): void {
  // Close button
  dropdown.querySelector('.fav-dropdown-close')?.addEventListener('click', () => {
    closeFavoritesDropdown();
  });

  // Checkbox toggles
  dropdown.querySelectorAll<HTMLInputElement>('.fav-list-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const listId = checkbox.dataset.listId!;
      const added = toggleItemInList(product, listId);

      if (added) {
        const listName = listId === DEFAULT_LIST_ID
          ? t('favorites.defaultList')
          : getLists().find(l => l.id === listId)?.name || '';
        showToast({
          message: `${t('favorites.addedToList')} "${listName}"`,
          type: 'success',
          link: { text: t('cart.favorites'), href: '/pages/dashboard/favorites.html' },
        });
      } else {
        showToast({ message: t('favorites.removedFromList'), type: 'info' });
      }

      updateFavoriteButtons(product.id);
      // Refresh dropdown state
      refreshDropdownCheckboxes(dropdown, product.id);
    });
  });

  // Create new list button
  const createBtn = dropdown.querySelector('.fav-create-list-btn');
  const inlineCreate = dropdown.querySelector('#fav-inline-create') as HTMLElement;
  const inlineInput = dropdown.querySelector('#fav-inline-input') as HTMLInputElement;
  const inlineSave = dropdown.querySelector('#fav-inline-save') as HTMLButtonElement;

  createBtn?.addEventListener('click', () => {
    (createBtn as HTMLElement).classList.add('hidden');
    inlineCreate?.classList.remove('hidden');
    inlineInput?.focus();
  });

  inlineInput?.addEventListener('input', () => {
    if (inlineSave) {
      inlineSave.disabled = inlineInput.value.trim().length === 0;
    }
  });

  inlineInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && inlineInput.value.trim()) {
      saveNewList(dropdown, product, inlineInput, inlineSave, createBtn as HTMLElement, inlineCreate);
    }
  });

  inlineSave?.addEventListener('click', () => {
    if (inlineInput.value.trim()) {
      saveNewList(dropdown, product, inlineInput, inlineSave, createBtn as HTMLElement, inlineCreate);
    }
  });

  // Remove from all
  dropdown.querySelector('.fav-remove-all-btn')?.addEventListener('click', () => {
    removeFromFavorites(product.id);
    updateFavoriteButtons(product.id);
    showToast({ message: t('product.removedFromFavorites'), type: 'info' });
    closeFavoritesDropdown();
  });
}

function saveNewList(
  dropdown: HTMLElement,
  product: ProductData,
  input: HTMLInputElement,
  saveBtn: HTMLButtonElement,
  createBtn: HTMLElement,
  inlineCreate: HTMLElement
): void {
  const name = input.value.trim();
  if (!name) return;

  const list = createList(name);
  // Auto-add product to the new list
  toggleItemInList(product, list.id);
  updateFavoriteButtons(product.id);

  showToast({
    message: `${t('favorites.listCreated')} "${name}"`,
    type: 'success',
    link: { text: t('cart.favorites'), href: '/pages/dashboard/favorites.html' },
  });

  // Reset inline form
  input.value = '';
  saveBtn.disabled = true;
  inlineCreate.classList.add('hidden');
  createBtn.classList.remove('hidden');

  // Add new list to the dropdown
  const listsContainer = dropdown.querySelector('#fav-dropdown-lists');
  if (listsContainer) {
    const newLabel = document.createElement('label');
    newLabel.className = 'flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors';
    newLabel.dataset.listId = list.id;
    newLabel.innerHTML = `
      <input type="checkbox" class="fav-list-checkbox w-[18px] h-[18px] rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer accent-[#F60]" checked data-list-id="${list.id}" />
      <div class="flex-1 min-w-0">
        <span class="block text-sm text-gray-700 truncate">${escapeHtml(list.name)}</span>
      </div>
      <svg class="w-4 h-4 text-[#F60] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
    `;

    // Wire checkbox
    const checkbox = newLabel.querySelector('input') as HTMLInputElement;
    checkbox.addEventListener('change', () => {
      const added = toggleItemInList(product, list.id);
      if (added) {
        showToast({
          message: `${t('favorites.addedToList')} "${list.name}"`,
          type: 'success',
        });
      } else {
        showToast({ message: t('favorites.removedFromList'), type: 'info' });
      }
      updateFavoriteButtons(product.id);
    });

    listsContainer.appendChild(newLabel);
  }
}

function refreshDropdownCheckboxes(dropdown: HTMLElement, productId: string): void {
  const currentListIds = getItemListIds(productId);
  dropdown.querySelectorAll<HTMLInputElement>('.fav-list-checkbox').forEach(cb => {
    const listId = cb.dataset.listId!;
    cb.checked = currentListIds.includes(listId);
  });

  // Update default heart icon fill
  const defaultLabel = dropdown.querySelector(`[data-list-id="${DEFAULT_LIST_ID}"]`);
  if (defaultLabel) {
    const heartSvg = defaultLabel.querySelector('svg');
    if (heartSvg) {
      heartSvg.setAttribute('fill', currentListIds.includes(DEFAULT_LIST_ID) ? '#ef4444' : 'none');
    }
  }
}

/**
 * Update all heart button visuals on the page for a given product
 */
export function updateFavoriteButtons(productId: string): void {
  const isFav = isItemFavorited(productId);
  document.querySelectorAll<HTMLButtonElement>('[data-favorite-btn]').forEach(btn => {
    const svg = btn.querySelector('svg');
    if (!svg) return;
    if (isFav) {
      svg.setAttribute('fill', '#ef4444');
      svg.setAttribute('stroke', '#ef4444');
      btn.style.color = '#ef4444';
    } else {
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      btn.style.color = '';
    }
  });
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
