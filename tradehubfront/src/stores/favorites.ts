/**
 * Favorites Store
 * YouTube-like list-based favorites system with localStorage persistence.
 */

export interface FavoriteList {
  id: string;
  name: string;
  createdAt: number;
}

export interface FavoriteItem {
  id: string;
  image: string;
  title: string;
  priceRange: string;
  minOrder: string;
  listIds: string[];   // which lists this item belongs to ('default' = favoriler)
  addedAt: number;
}

export interface FavoritesState {
  lists: FavoriteList[];
  items: FavoriteItem[];
}

const STORAGE_KEY = 'tradehub-favorites-v2';
const DEFAULT_LIST_ID = 'default';

// ── Migration from old format ──
function migrateOldData(): void {
  const oldKey = 'tradehub-favorites';
  const oldData = localStorage.getItem(oldKey);
  if (!oldData) return;

  // Already migrated?
  if (localStorage.getItem(STORAGE_KEY)) return;

  try {
    const oldItems: any[] = JSON.parse(oldData);
    if (!Array.isArray(oldItems)) return;

    const state: FavoritesState = {
      lists: [],
      items: oldItems.map(item => ({
        id: item.id || crypto.randomUUID(),
        image: item.image || '',
        title: item.title || '',
        priceRange: item.priceRange || '',
        minOrder: item.minOrder || '',
        listIds: [DEFAULT_LIST_ID],
        addedAt: Date.now(),
      })),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.removeItem(oldKey);
  } catch { /* ignore */ }
}

// Run migration on load
migrateOldData();

// ── State helpers ──

function getState(): FavoritesState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lists: [], items: [] };
    const parsed = JSON.parse(raw);
    return {
      lists: Array.isArray(parsed.lists) ? parsed.lists : [],
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch {
    return { lists: [], items: [] };
  }
}

function saveState(state: FavoritesState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent('favorites-changed', { detail: state }));
}

// ── Public API ──

export function getFavoritesState(): FavoritesState {
  return getState();
}

export function getLists(): FavoriteList[] {
  return getState().lists;
}

export function getItems(): FavoriteItem[] {
  return getState().items;
}

export function isItemFavorited(productId: string): boolean {
  return getState().items.some(item => item.id === productId);
}

/** Get which list IDs a product belongs to */
export function getItemListIds(productId: string): string[] {
  const item = getState().items.find(i => i.id === productId);
  return item ? item.listIds : [];
}

/** Add item to favorites (optionally to specific lists). If no lists, uses 'default'. */
export function addToFavorites(
  product: { id: string; image: string; title: string; priceRange: string; minOrder: string },
  listIds?: string[]
): void {
  const state = getState();
  const existing = state.items.find(i => i.id === product.id);

  if (existing) {
    // Update list memberships
    const targetLists = listIds && listIds.length > 0 ? listIds : [DEFAULT_LIST_ID];
    existing.listIds = [...new Set([...existing.listIds, ...targetLists])];
  } else {
    state.items.push({
      ...product,
      listIds: listIds && listIds.length > 0 ? listIds : [DEFAULT_LIST_ID],
      addedAt: Date.now(),
    });
  }

  saveState(state);
}

/** Remove item from all favorites */
export function removeFromFavorites(productId: string): void {
  const state = getState();
  state.items = state.items.filter(i => i.id !== productId);
  saveState(state);
}

/** Toggle item in a specific list. Returns true if item was added to list, false if removed. */
export function toggleItemInList(
  product: { id: string; image: string; title: string; priceRange: string; minOrder: string },
  listId: string
): boolean {
  const state = getState();
  let item = state.items.find(i => i.id === product.id);

  if (!item) {
    // New item, add to this list
    state.items.push({
      ...product,
      listIds: [listId],
      addedAt: Date.now(),
    });
    saveState(state);
    return true;
  }

  const idx = item.listIds.indexOf(listId);
  if (idx >= 0) {
    // Remove from this list
    item.listIds.splice(idx, 1);
    // If no lists left, remove item entirely
    if (item.listIds.length === 0) {
      state.items = state.items.filter(i => i.id !== product.id);
    }
    saveState(state);
    return false;
  } else {
    // Add to this list
    item.listIds.push(listId);
    saveState(state);
    return true;
  }
}

/** Create a new list */
export function createList(name: string): FavoriteList {
  const state = getState();
  const list: FavoriteList = {
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: Date.now(),
  };
  state.lists.push(list);
  saveState(state);
  return list;
}

/** Delete a list and remove all items from it */
export function deleteList(listId: string): void {
  const state = getState();
  state.lists = state.lists.filter(l => l.id !== listId);
  // Remove this list from all items
  state.items.forEach(item => {
    item.listIds = item.listIds.filter(id => id !== listId);
  });
  // Remove orphaned items
  state.items = state.items.filter(i => i.listIds.length > 0);
  saveState(state);
}

/** Rename a list */
export function renameList(listId: string, newName: string): void {
  const state = getState();
  const list = state.lists.find(l => l.id === listId);
  if (list) {
    list.name = newName.trim();
    saveState(state);
  }
}

/** Get items filtered by list ID. 'default' = ungrouped/default favorites. */
export function getItemsByList(listId: string): FavoriteItem[] {
  return getState().items.filter(item => item.listIds.includes(listId));
}

/** Get item count for a list */
export function getListItemCount(listId: string): number {
  return getState().items.filter(item => item.listIds.includes(listId)).length;
}

/** Get total favorites count */
export function getTotalCount(): number {
  return getState().items.length;
}
