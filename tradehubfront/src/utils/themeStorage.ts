/**
 * Theme Storage - localStorage persistence for theme overrides
 */

const STORAGE_KEY = 'tradehub-theme-overrides';

/**
 * Load saved theme overrides from localStorage
 */
export function loadTheme(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

/**
 * Save theme overrides to localStorage
 */
export function saveTheme(overrides: Record<string, string>): void {
  try {
    if (Object.keys(overrides).length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    }
  } catch {
    // localStorage may be full or disabled
  }
}

/**
 * Clear all saved theme overrides
 */
export function clearTheme(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Apply saved theme overrides to the document root
 */
export function applyTheme(overrides: Record<string, string>): void {
  const root = document.documentElement;
  for (const [cssVar, value] of Object.entries(overrides)) {
    root.style.setProperty(cssVar, value);
  }
}

/**
 * Collect all currently applied inline CSS variable overrides from the root
 */
export function collectOverrides(varNames: string[]): Record<string, string> {
  const root = document.documentElement;
  const overrides: Record<string, string> = {};
  for (const varName of varNames) {
    const val = root.style.getPropertyValue(varName).trim();
    if (val) overrides[varName] = val;
  }
  return overrides;
}
