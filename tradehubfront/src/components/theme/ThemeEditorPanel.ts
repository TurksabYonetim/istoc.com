/**
 * ThemeEditorPanel Component
 * A collapsible right-side drawer for theme customization
 * Default state: collapsed (only trigger button visible)
 * Expanded state: 400px wide panel sliding from right
 */

import { sectionEditors, themeTokenGroups, type ThemeToken } from '../../utils/themeTokens';
import { themePresets } from '../../utils/themePresets';
import { loadTheme, saveTheme, clearTheme, applyTheme, collectOverrides } from '../../utils/themeStorage';

/**
 * ThemeEditorPanel Component
 * Renders a collapsible theme editor panel trigger button
 * The full panel is created dynamically when opened
 */
export function ThemeEditorPanel(): string {
  return `
    <button
      type="button"
      id="theme-editor-trigger"
      class="fixed top-1/2 right-0 -translate-y-1/2 z-(--z-sidebar) flex items-center justify-center w-10 h-24 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-l-md shadow-lg border border-r-0 border-gray-200 dark:border-gray-600 transition-all duration-200 hover:w-12 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
      aria-label="Open theme editor"
      data-tooltip-target="tooltip-theme-editor"
      data-tooltip-placement="left"
    >
      <!-- Paint Palette Icon (vertical orientation hint) -->
      <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    </button>
    <div id="tooltip-theme-editor" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-md shadow-sm opacity-0 tooltip dark:bg-gray-700">
      Customize Theme
      <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
  `;
}

/**
 * Initializes the ThemeEditorPanel behavior
 * Handles opening/closing the theme editor drawer
 * Should be called after DOM is ready
 */
export function initThemeEditorPanel(): void {
  // Restore saved theme overrides on page load
  const saved = loadTheme();
  if (Object.keys(saved).length > 0) {
    applyTheme(saved);
  }

  const triggerBtn = document.getElementById('theme-editor-trigger');

  if (!triggerBtn) return;

  // Open drawer on trigger click
  triggerBtn.addEventListener('click', () => {
    openThemeEditorDrawer();
  });
}

/**
 * Token control configuration interface (uses ThemeToken from themeTokens.ts)
 */
type TokenControl = ThemeToken;

/**
 * Renders a collapsible theme section with controls
 */
function renderThemeSection(id: string, title: string, collapsed: boolean, tokens: TokenControl[], icon?: string): string {
  const sectionId = `theme-section-${id}`;
  const chevronRotation = collapsed ? '' : 'rotate-90';
  const contentVisibility = collapsed ? 'hidden' : '';

  return `
    <div class="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 overflow-hidden">
      <button
        type="button"
        class="theme-accordion-btn w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        data-target="${sectionId}"
        data-section-id="${id}"
        aria-expanded="${!collapsed}"
        aria-controls="${sectionId}"
      >
        <span class="flex items-center gap-2">
          <svg class="theme-chevron w-4 h-4 text-gray-400 transition-transform ${chevronRotation}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 5 7 7-7 7"/>
          </svg>
          ${icon ? `<span class="text-base" aria-hidden="true">${icon}</span>` : ''}
          <span class="text-sm font-semibold text-gray-900 dark:text-white">${title}</span>
          <span class="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full" aria-label="${tokens.length} controls">${tokens.length}</span>
        </span>
        <button
          type="button"
          class="theme-reset-section text-[10px] font-semibold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          data-section="${id}"
          onclick="event.stopPropagation()"
          aria-label="Reset ${title} section"
        >
          Reset
        </button>
      </button>
      <div id="${sectionId}" class="${contentVisibility} px-4 pb-4" role="region" aria-labelledby="${sectionId}-btn">
        <div class="space-y-4 pt-2">
          ${tokens.map((token, index) => renderTokenControl(id, index, token)).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders an individual token control based on type
 */
function renderTokenControl(sectionId: string, index: number, token: TokenControl): string {
  const controlId = `theme-ctrl-${sectionId}-${index}`;
  const label = token.label || token.var;
  const value = token.default;

  if (token.type === 'color') {
    return `
      <div class="space-y-1.5">
        <label for="${controlId}" class="block text-[11px] font-mono text-gray-600 dark:text-gray-400 truncate" title="${token.var}">${label}</label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            id="${controlId}"
            value="${value}"
            data-var="${token.var}"
            aria-label="${label} color picker"
            aria-describedby="${controlId}-val"
            class="w-10 h-10 rounded cursor-pointer border-2 border-gray-200 dark:border-gray-600 transition-colors hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <span id="${controlId}-val" class="text-[11px] font-mono text-gray-500 dark:text-gray-400 flex-1" role="status" aria-live="polite">${value}</span>
        </div>
      </div>
    `;
  }

  if (token.type === 'range') {
    const displayValue = token.unit ? `${value}${token.unit}` : `${value}`;
    return `
      <div class="space-y-1.5">
        <label for="${controlId}" class="flex items-baseline justify-between text-[11px] font-mono text-gray-600 dark:text-gray-400 gap-2">
          <span class="truncate" title="${token.var}">${label}</span>
          <span id="${controlId}-val" class="text-gray-500 dark:text-gray-400 flex-shrink-0 font-semibold" role="status" aria-live="polite">${displayValue}</span>
        </label>
        <input
          type="range"
          id="${controlId}"
          min="${token.min}"
          max="${token.max}"
          step="${token.step}"
          value="${value}"
          data-var="${token.var}"
          data-unit="${token.unit || ''}"
          aria-label="${label} slider"
          aria-valuemin="${token.min}"
          aria-valuemax="${token.max}"
          aria-valuenow="${value}"
          aria-valuetext="${displayValue}"
          class="w-full h-2 bg-gray-200 rounded-md appearance-none cursor-pointer accent-primary-500 dark:bg-gray-700"
        />
      </div>
    `;
  }

  if (token.type === 'font') {
    const options = token.options?.map(opt => `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`).join('') || '';
    return `
      <div class="space-y-1.5">
        <label for="${controlId}" class="block text-[11px] font-mono text-gray-600 dark:text-gray-400 truncate" title="${token.var}">${label}</label>
        <select
          id="${controlId}"
          data-var="${token.var}"
          aria-label="${label} font selector"
          aria-describedby="${controlId}-preview"
          class="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-400 focus:outline-none cursor-pointer transition-colors"
        >
          ${options}
        </select>
        <div id="${controlId}-preview" class="mt-1.5 text-base text-gray-700 dark:text-gray-300 truncate px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded" style="font-family:${value}" role="presentation" aria-hidden="true">
          AaBbCc 123
        </div>
      </div>
    `;
  }

  // Default text input
  return `
    <div class="space-y-1.5">
      <label for="${controlId}" class="block text-[11px] font-mono text-gray-600 dark:text-gray-400 truncate" title="${token.var}">${label}</label>
      <input
        type="text"
        id="${controlId}"
        value="${value}"
        data-var="${token.var}"
        aria-label="${label} text input"
        class="w-full text-[11px] font-mono border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-400 focus:outline-none transition-colors"
      />
    </div>
  `;
}

/**
 * Opens the theme editor drawer on the right side of the screen
 * Creates a collapsible 400px wide panel with optional backdrop
 */
function openThemeEditorDrawer(): void {
  // Prevent duplicate drawers
  if (document.getElementById('theme-editor-drawer')) {
    return;
  }

  // Create backdrop (semi-transparent overlay on mobile)
  const backdrop = document.createElement('div');
  backdrop.id = 'theme-editor-backdrop';
  backdrop.className = 'fixed inset-0 z-[calc(var(--z-toast)-1)] bg-black/30 transition-opacity duration-300 opacity-0 md:hidden';
  backdrop.setAttribute('aria-hidden', 'true');

  // Create drawer
  const drawer = document.createElement('div');
  drawer.id = 'theme-editor-drawer';
  drawer.className = 'fixed top-0 right-0 z-(--z-toast) h-full w-full md:max-w-[400px] bg-white dark:bg-gray-800 shadow-2xl flex flex-col transition-transform duration-300 translate-x-full';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true'); // Modal on mobile
  drawer.setAttribute('aria-label', 'Theme Editor');

  drawer.innerHTML = `
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-primary-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Theme Editor</h2>
      </div>
      <div class="flex items-center gap-2">
        <!-- Minimize Button -->
        <button
          id="theme-editor-minimize-btn"
          type="button"
          class="flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
          aria-label="Minimize theme editor"
          title="Minimize"
        >
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
          </svg>
        </button>
        <!-- Close Button -->
        <button
          id="theme-editor-close-btn"
          type="button"
          class="flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
          aria-label="Close theme editor"
          title="Close"
        >
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Drag Handle (for mobile/touch support) -->
    <div class="flex items-center justify-center py-2 border-b border-gray-100 dark:border-gray-700/50 cursor-move md:hidden" id="theme-editor-drag-handle">
      <div class="w-12 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-y-auto">
      <!-- Theme Presets Section -->
      <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-5 py-4">
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3" id="theme-presets-label">Theme Presets</h3>
        <div class="grid grid-cols-3 gap-2" role="group" aria-labelledby="theme-presets-label">
          ${themePresets.map((preset, i) => `
            <button type="button" class="theme-preset-btn px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 active:scale-95 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-400" data-preset-index="${i}" aria-label="Apply ${preset.name} theme preset" title="${preset.description}">
              <span class="mr-1">${preset.icon}</span>${preset.name}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-5">
        <div class="flex gap-1" role="tablist">
          <button type="button" class="theme-tab px-4 py-2.5 text-xs font-semibold border-b-2 border-primary-500 text-primary-600" data-tab="sections" role="tab" aria-selected="true">Page Sections</button>
          <button type="button" class="theme-tab px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700" data-tab="globals" role="tab" aria-selected="false">Global Tokens</button>
        </div>
      </div>

      <!-- Page Sections Tab -->
      <div id="theme-tab-sections" class="px-5 py-4 space-y-3">
        ${sectionEditors.map((section, index) =>
          renderThemeSection(section.id, section.name, index > 0, section.tokens, section.icon)
        ).join('')}
      </div>

      <!-- Global Tokens Tab (hidden by default) -->
      <div id="theme-tab-globals" class="px-5 py-4 space-y-3 hidden">
        ${themeTokenGroups.map((group, index) =>
          renderThemeSection(`global-${index}`, group.name, group.collapsed !== false, group.tokens)
        ).join('')}
      </div>
    </div>

    <!-- Footer (action buttons) -->
    <div class="border-t border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <button
          type="button"
          id="theme-reset-all-btn"
          class="px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          title="Reset all theme customizations to default"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Reset All
          </span>
        </button>
        <button
          type="button"
          id="theme-save-css-btn"
          class="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-sm"
          style="background: linear-gradient(135deg, #f5a623, #e8740c)"
          title="Save changes permanently to style.css (dev server only)"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span id="theme-save-css-text">Save to style.css</span>
          </span>
        </button>
        <button
          type="button"
          id="theme-export-btn"
          class="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
          title="Download theme as CSS file"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(drawer);

  // Prevent body scroll on mobile when drawer is open
  const preventBodyScroll = (): void => {
    if (window.innerWidth < 768) { // Mobile only
      document.body.style.overflow = 'hidden';
    }
  };

  const restoreBodyScroll = (): void => {
    document.body.style.overflow = '';
  };

  preventBodyScroll();

  // Close handler
  const closeDrawer = (): void => {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    restoreBodyScroll();
    setTimeout(() => {
      backdrop.remove();
      drawer.remove();
    }, 300);
  };

  // Minimize handler (same as close for now)
  const minimizeDrawer = (): void => {
    closeDrawer();
  };

  // Animate in on next frame
  requestAnimationFrame(() => {
    backdrop.classList.remove('opacity-0');
    backdrop.classList.add('opacity-100');
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    // Focus the close button for accessibility
    const closeBtn = document.getElementById('theme-editor-close-btn');
    closeBtn?.focus();
  });

  // Close on backdrop click (mobile only)
  backdrop.addEventListener('click', closeDrawer);

  // Focus trap: Keep focus within the drawer
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = drawer.querySelectorAll(focusableSelectors);
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleFocusTrap = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab: Focus previous element
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab: Focus next element
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  drawer.addEventListener('keydown', handleFocusTrap);

  // Close button handler
  const closeBtn = document.getElementById('theme-editor-close-btn');
  closeBtn?.addEventListener('click', closeDrawer);

  // Minimize button handler
  const minimizeBtn = document.getElementById('theme-editor-minimize-btn');
  minimizeBtn?.addEventListener('click', minimizeDrawer);

  // Close on Escape key
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      closeDrawer();
      document.removeEventListener('keydown', handleKeyDown);
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  // Swipe-to-close gesture for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const SWIPE_THRESHOLD = 100; // Minimum distance for swipe
  const SWIPE_ANGLE_THRESHOLD = 30; // Maximum angle deviation from horizontal

  drawer.addEventListener('touchstart', (e: TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  drawer.addEventListener('touchend', (e: TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
  }, { passive: true });

  const handleSwipeGesture = (): void => {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const angle = Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI);

    // Swipe right to close (only if mostly horizontal)
    if (deltaX > SWIPE_THRESHOLD && angle < SWIPE_ANGLE_THRESHOLD) {
      closeDrawer();
    }
  };

  // Tab switching (Page Sections / Global Tokens)
  const tabs = drawer.querySelectorAll('.theme-tab');
  const tabSections = drawer.querySelector('#theme-tab-sections');
  const tabGlobals = drawer.querySelector('#theme-tab-globals');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      tabs.forEach(t => {
        t.classList.remove('border-primary-500', 'text-primary-600');
        t.classList.add('border-transparent', 'text-gray-500');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.remove('border-transparent', 'text-gray-500');
      tab.classList.add('border-primary-500', 'text-primary-600');
      tab.setAttribute('aria-selected', 'true');
      if (target === 'sections') {
        tabSections?.classList.remove('hidden');
        tabGlobals?.classList.add('hidden');
      } else {
        tabSections?.classList.add('hidden');
        tabGlobals?.classList.remove('hidden');
      }
    });
  });

  // Accordion toggle functionality
  const accordionButtons = drawer.querySelectorAll('.theme-accordion-btn');
  accordionButtons.forEach(btn => {
    const toggleAccordion = (e?: Event) => {
      // Don't toggle if clicking the reset button
      if (e && (e.target as HTMLElement).closest('.theme-reset-section')) {
        return;
      }

      const targetId = btn.getAttribute('data-target');
      const panel = document.getElementById(targetId || '');
      const chevron = btn.querySelector('.theme-chevron');

      if (panel) {
        const isHidden = panel.classList.contains('hidden');
        panel.classList.toggle('hidden');
        btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      }
      if (chevron) {
        chevron.classList.toggle('rotate-90');
      }
    };

    btn.addEventListener('click', toggleAccordion);

    // Keyboard navigation: Enter or Space to toggle
    (btn as HTMLElement).addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion();
      }
    });

    // Live preview: Highlight corresponding page section on hover
    btn.addEventListener('mouseenter', () => {
      const sectionId = btn.getAttribute('data-section-id');
      highlightPageSection(sectionId);
    });

    btn.addEventListener('mouseleave', () => {
      removePageSectionHighlight();
    });
  });

  // Theme preset handlers — apply preset variables
  const presetButtons = drawer.querySelectorAll('.theme-preset-btn');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const indexStr = btn.getAttribute('data-preset-index');
      if (indexStr == null) return;
      const preset = themePresets[parseInt(indexStr, 10)];
      if (!preset) return;

      // Clear all existing inline overrides first
      const allVarInputs = drawer.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-var]');
      allVarInputs.forEach(input => {
        const cssVar = input.getAttribute('data-var');
        if (cssVar) root.style.removeProperty(cssVar);
      });
      root.style.removeProperty('--default-font-family');
      root.style.removeProperty('--default-mono-font-family');

      // Apply preset variables
      applyTheme(preset.variables);

      // Save to localStorage
      saveTheme(preset.variables);

      // Sync controls to new values
      initControlsFromComputed(drawer);

      // Visual feedback — highlight the active preset button
      presetButtons.forEach(b => b.classList.remove('ring-2', 'ring-primary-500', 'bg-primary-50'));
      btn.classList.add('ring-2', 'ring-primary-500', 'bg-primary-50');
    });
  });

  // Per-section reset — remove only that section's CSS variable overrides
  const resetSectionButtons = drawer.querySelectorAll('.theme-reset-section');
  resetSectionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.getAttribute('data-section');
      if (!sectionId) return;
      const sectionDef = sectionEditors.find(s => s.id === sectionId);
      if (!sectionDef) return;

      // Remove inline overrides for this section's tokens
      sectionDef.tokens.forEach(token => {
        root.style.removeProperty(token.var);
      });

      // Re-sync controls and persist
      initControlsFromComputed(drawer);
      autoSave(drawer);
    });
  });

  // ── Live CSS Variable Updates ──
  const root = document.documentElement;

  // Helper: collect all current overrides and persist to localStorage
  const autoSave = (container: HTMLElement): void => {
    const varNames: string[] = [];
    container.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-var]').forEach(el => {
      const v = el.getAttribute('data-var');
      if (v) varNames.push(v);
    });
    saveTheme(collectOverrides(varNames));
  };

  // Color inputs → live update CSS variables
  const colorInputs = drawer.querySelectorAll('input[type="color"]');
  colorInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const cssVar = target.getAttribute('data-var');
      if (cssVar) root.style.setProperty(cssVar, target.value);
      const valSpan = document.getElementById(`${target.id}-val`);
      if (valSpan) valSpan.textContent = target.value;
      autoSave(drawer);
    });
  });

  // Range inputs → live update CSS variables
  const rangeInputs = drawer.querySelectorAll('input[type="range"]');
  rangeInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const cssVar = target.getAttribute('data-var');
      const unit = target.getAttribute('data-unit') || '';
      const value = `${target.value}${unit}`;
      if (cssVar) root.style.setProperty(cssVar, value);
      const valSpan = document.getElementById(`${target.id}-val`);
      if (valSpan) valSpan.textContent = value;
      target.setAttribute('aria-valuenow', target.value);
      target.setAttribute('aria-valuetext', value);
      autoSave(drawer);
    });
  });

  // Font selects → live update CSS variables + load Google Fonts
  const fontSelects = drawer.querySelectorAll('select[data-var]');
  fontSelects.forEach(select => {
    select.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      const cssVar = target.getAttribute('data-var');
      if (cssVar) {
        root.style.setProperty(cssVar, target.value);
        if (cssVar === '--font-sans') root.style.setProperty('--default-font-family', target.value);
        if (cssVar === '--font-mono') root.style.setProperty('--default-mono-font-family', target.value);
      }
      const preview = document.getElementById(`${target.id}-preview`);
      if (preview) preview.style.fontFamily = target.value;
      const googleParam = target.options[target.selectedIndex]?.getAttribute('data-google');
      if (googleParam) loadGoogleFont(googleParam);
      autoSave(drawer);
    });
  });

  // Text inputs → live update CSS variables
  const textInputs = drawer.querySelectorAll<HTMLInputElement>('input[type="text"][data-var]');
  textInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const cssVar = target.getAttribute('data-var');
      if (cssVar) root.style.setProperty(cssVar, target.value);
      autoSave(drawer);
    });
  });

  // Reset All → remove all inline overrides, clear storage, and re-init controls
  const resetAllBtn = document.getElementById('theme-reset-all-btn');
  resetAllBtn?.addEventListener('click', () => {
    const allVarInputs = drawer.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-var]');
    allVarInputs.forEach(input => {
      const cssVar = input.getAttribute('data-var');
      if (cssVar) root.style.removeProperty(cssVar);
    });
    root.style.removeProperty('--default-font-family');
    root.style.removeProperty('--default-mono-font-family');
    clearTheme();
    initControlsFromComputed(drawer);

    // Remove active preset highlight
    presetButtons.forEach(b => b.classList.remove('ring-2', 'ring-primary-500', 'bg-primary-50'));
  });

  // Save to style.css → POST to Vite dev server /__save-css endpoint
  // This permanently writes CSS variable changes to src/style.css
  // Vite HMR then propagates updates to ALL pages using that CSS
  const saveCssBtn = document.getElementById('theme-save-css-btn');
  const saveCssText = document.getElementById('theme-save-css-text');
  saveCssBtn?.addEventListener('click', async () => {
    const updates: Record<string, string> = {};
    const allVarInputs = drawer.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-var]');
    allVarInputs.forEach(input => {
      const cssVar = input.getAttribute('data-var');
      if (!cssVar) return;
      const inlineVal = root.style.getPropertyValue(cssVar).trim();
      if (inlineVal) updates[cssVar] = inlineVal;
    });

    if (Object.keys(updates).length === 0) {
      if (saveCssText) saveCssText.textContent = 'No changes';
      setTimeout(() => { if (saveCssText) saveCssText.textContent = 'Save to style.css'; }, 1500);
      return;
    }

    // Remove derived vars that shouldn't be saved
    delete updates['--default-font-family'];
    delete updates['--default-mono-font-family'];

    // Build Google Font @import if font changed
    if (updates['--font-sans'] || updates['--font-mono']) {
      const fontUrls: string[] = [];
      for (const varName of ['--font-sans', '--font-mono'] as const) {
        if (!updates[varName]) continue;
        // Font tokens live in themeTokenGroups (global tokens), not sectionEditors
        for (const group of themeTokenGroups) {
          for (const token of group.tokens) {
            if (token.var === varName && token.options) {
              const opt = token.options.find(o => o.value === updates[varName]);
              if (opt?.google) fontUrls.push(`family=${opt.google}`);
            }
          }
        }
      }
      if (fontUrls.length > 0) {
        updates['__google_font_imports__'] = `@import url('https://fonts.googleapis.com/css2?${fontUrls.join('&')}&display=swap');`;
      }
    }

    if (saveCssBtn) saveCssBtn.style.opacity = '0.6';
    if (saveCssText) saveCssText.textContent = 'Saving...';

    try {
      const res = await fetch('/__save-css', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json() as { ok?: boolean };
      if (data.ok) {
        // Clear inline overrides — the file is now the source of truth
        allVarInputs.forEach(input => {
          const cssVar = input.getAttribute('data-var');
          if (cssVar && updates[cssVar]) root.style.removeProperty(cssVar);
        });
        clearTheme(); // Clear localStorage too
        if (saveCssText) saveCssText.textContent = 'Saved!';
        setTimeout(() => {
          if (saveCssText) saveCssText.textContent = 'Save to style.css';
          initControlsFromComputed(drawer);
        }, 1500);
      } else {
        if (saveCssText) saveCssText.textContent = 'Error!';
        setTimeout(() => { if (saveCssText) saveCssText.textContent = 'Save to style.css'; }, 2000);
      }
    } catch {
      if (saveCssText) saveCssText.textContent = 'Dev server only';
      setTimeout(() => { if (saveCssText) saveCssText.textContent = 'Save to style.css'; }, 2000);
    }
    if (saveCssBtn) saveCssBtn.style.opacity = '1';
  });

  // Export Theme → download as CSS file
  const exportBtn = document.getElementById('theme-export-btn');
  exportBtn?.addEventListener('click', () => {
    const overrides: string[] = [];
    const allVarInputs = drawer.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-var]');
    allVarInputs.forEach(input => {
      const cssVar = input.getAttribute('data-var');
      if (!cssVar) return;
      const val = getComputedStyle(root).getPropertyValue(cssVar).trim();
      if (val) overrides.push(`  ${cssVar}: ${val};`);
    });
    const css = `@theme {\n${overrides.join('\n')}\n}`;
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradehub-theme-${new Date().toISOString().slice(0, 10)}.css`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Initialize controls from current computed styles
  initControlsFromComputed(drawer);
}

/**
 * Loads a Google Font dynamically by injecting a <link> tag
 */
function loadGoogleFont(googleParam: string): void {
  const linkId = `gfont-${googleParam.replace(/[^a-zA-Z0-9]/g, '-')}`;
  if (document.getElementById(linkId)) return; // already loaded
  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${googleParam}&display=swap`;
  document.head.appendChild(link);
}

/**
 * Reads current computed CSS values and syncs all controls in the drawer
 */
function initControlsFromComputed(drawer: HTMLElement): void {
  const root = document.documentElement;
  const computed = getComputedStyle(root);

  // Sync color inputs
  drawer.querySelectorAll<HTMLInputElement>('input[type="color"]').forEach(input => {
    const cssVar = input.getAttribute('data-var');
    if (!cssVar) return;
    const val = computed.getPropertyValue(cssVar).trim();
    if (val && val.startsWith('#')) {
      input.value = val;
      const valSpan = document.getElementById(`${input.id}-val`);
      if (valSpan) valSpan.textContent = val;
    }
  });

  // Sync range inputs
  drawer.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(input => {
    const cssVar = input.getAttribute('data-var');
    if (!cssVar) return;
    const val = computed.getPropertyValue(cssVar).trim();
    if (val) {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        input.value = String(num);
        const unit = input.getAttribute('data-unit') || '';
        const display = `${num}${unit}`;
        const valSpan = document.getElementById(`${input.id}-val`);
        if (valSpan) valSpan.textContent = display;
        input.setAttribute('aria-valuenow', String(num));
        input.setAttribute('aria-valuetext', display);
      }
    }
  });

  // Sync font selects
  drawer.querySelectorAll<HTMLSelectElement>('select[data-var]').forEach(select => {
    const cssVar = select.getAttribute('data-var');
    if (!cssVar) return;
    const val = computed.getPropertyValue(cssVar).trim();
    if (val) {
      for (const opt of Array.from(select.options)) {
        if (val.includes(opt.value.split(',')[0].replace(/['"]/g, '').trim())) {
          select.value = opt.value;
          break;
        }
      }
      const preview = document.getElementById(`${select.id}-preview`);
      if (preview) preview.style.fontFamily = select.value;
    }
  });

  // Sync text inputs
  drawer.querySelectorAll<HTMLInputElement>('input[type="text"][data-var]').forEach(input => {
    const cssVar = input.getAttribute('data-var');
    if (!cssVar) return;
    const val = computed.getPropertyValue(cssVar).trim();
    if (val) input.value = val;
  });
}

/**
 * Highlights the corresponding page section when hovering over a section in the theme panel
 */
function highlightPageSection(sectionId: string | null): void {
  if (!sectionId) return;

  // Map section IDs to actual page element selectors
  const sectionSelectors: Record<string, string> = {
    'section-header': '#header, header',
    'section-subheader': '#subheader, .subheader',
    'section-search': '#search-area, .search-area',
    'section-gradient': '#header, header', // Gradient is part of header
    'section-mega': '#mega-menu, .mega-menu',
    'section-hero': '#hero, .hero-section',
    'section-productgrid': '[data-theme-section="productgrid"], [aria-label="Recommended Products"]',
    'section-footer': '#footer, footer',
  };

  const selector = sectionSelectors[sectionId];
  if (!selector) return;

  const element = document.querySelector(selector);
  if (!element) return;

  // Add highlight outline with smooth transition
  const highlightStyle = document.createElement('style');
  highlightStyle.id = 'theme-panel-highlight-style';
  highlightStyle.textContent = `
    .theme-panel-highlight {
      outline: 3px solid #3b82f6 !important;
      outline-offset: -3px !important;
      position: relative !important;
      z-index: 25 !important;
      transition: outline 0.2s ease !important;
    }
    .theme-panel-highlight::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(59, 130, 246, 0.05);
      pointer-events: none;
      transition: background 0.2s ease;
    }
  `;

  // Remove existing highlight style if present
  const existingStyle = document.getElementById('theme-panel-highlight-style');
  if (!existingStyle) {
    document.head.appendChild(highlightStyle);
  }

  element.classList.add('theme-panel-highlight');
}

/**
 * Removes the highlight from page sections
 */
function removePageSectionHighlight(): void {
  const highlightedElements = document.querySelectorAll('.theme-panel-highlight');
  highlightedElements.forEach(el => {
    el.classList.remove('theme-panel-highlight');
  });
}
