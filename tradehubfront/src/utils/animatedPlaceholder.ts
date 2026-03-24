/**
 * Animated Placeholder Utility
 * Rotates through search keywords with fade animation
 * for the TR TradeHub B2B Marketplace platform
 */

import type { PlaceholderConfig } from '../types/navigation';

/**
 * Default configuration for the animated placeholder
 */
const DEFAULT_CONFIG: Required<PlaceholderConfig> = {
  keywords: [
    'Tekstil ve Konfeksiyon',
    'Makine ve Ekipman',
    'Elektronik ve Yazılım',
    'Gıda ve İçecek',
    'İnşaat Malzemeleri',
    'Otomotiv Parçaları',
    'Kimyasal Ürünler',
    'Sağlık Ekipmanları',
  ],
  interval: 3000,
};

/**
 * State interface for tracking animation
 */
interface AnimatedPlaceholderState {
  currentIndex: number;
  intervalId: number | null;
  isAnimating: boolean;
  inputElement: HTMLInputElement | null;
  placeholderElement: HTMLElement | null;
}

/**
 * Creates the animated placeholder state
 */
function createState(): AnimatedPlaceholderState {
  return {
    currentIndex: 0,
    intervalId: null,
    isAnimating: false,
    inputElement: null,
    placeholderElement: null,
  };
}

/**
 * Global state for the animated placeholder
 */
let state: AnimatedPlaceholderState = createState();

/**
 * Generates the CSS styles for the animated placeholder
 * These styles are injected once into the document head
 */
export function getAnimatedPlaceholderStyles(): string {
  return `
    .animated-placeholder-container {
      position: relative;
    }

    .animated-placeholder {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: rgb(156 163 175); /* text-gray-400 */
      transition: opacity 300ms ease-in-out;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: calc(100% - 1rem);
      padding-left: 1rem; /* Match input padding */
    }

    .animated-placeholder.fade-out {
      opacity: 0;
    }

    .animated-placeholder.fade-in {
      opacity: 1;
    }

    .animated-placeholder.hidden {
      display: none;
    }

    .search-input-animated::placeholder {
      color: transparent;
    }
  `;
}

/**
 * Injects the placeholder styles into the document head
 * Only injects once even if called multiple times
 */
export function injectAnimatedPlaceholderStyles(): void {
  const styleId = 'animated-placeholder-styles';

  // Check if styles already exist
  if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = getAnimatedPlaceholderStyles();
    document.head.appendChild(styleElement);
  }
}

/**
 * Creates the placeholder element that will be animated
 */
function createPlaceholderElement(keyword: string): HTMLSpanElement {
  const element = document.createElement('span');
  element.className = 'animated-placeholder fade-in';
  element.textContent = keyword;
  element.setAttribute('aria-hidden', 'true');
  return element;
}

/**
 * Rotates to the next keyword with fade animation
 */
function rotateKeyword(keywords: string[]): void {
  if (!state.placeholderElement || !state.inputElement) return;

  // Don't rotate if user has typed something
  if (state.inputElement.value.length > 0) {
    state.placeholderElement.classList.add('hidden');
    return;
  }

  // Fade out
  state.placeholderElement.classList.remove('fade-in');
  state.placeholderElement.classList.add('fade-out');

  // After fade out, change text and fade in
  setTimeout(() => {
    if (!state.placeholderElement) return;

    state.currentIndex = (state.currentIndex + 1) % keywords.length;
    state.placeholderElement.textContent = keywords[state.currentIndex];

    // Fade in
    state.placeholderElement.classList.remove('fade-out');
    state.placeholderElement.classList.add('fade-in');
  }, 300); // Match the CSS transition duration
}

/**
 * Handles input events to show/hide the animated placeholder
 */
function handleInput(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!state.placeholderElement) return;

  if (input.value.length > 0) {
    // Hide placeholder when user types
    state.placeholderElement.classList.add('hidden');
  } else {
    // Show placeholder when input is empty
    state.placeholderElement.classList.remove('hidden');
    state.placeholderElement.classList.add('fade-in');
  }
}

/**
 * Initializes the animated placeholder on a search input element
 *
 * @param inputSelector - CSS selector for the input element
 * @param config - Optional configuration for keywords and interval
 * @returns Cleanup function to stop the animation and remove event listeners
 *
 * @example
 * ```typescript
 * // Initialize with default keywords
 * const cleanup = initAnimatedPlaceholder('#search-input');
 *
 * // Initialize with custom keywords
 * const cleanup = initAnimatedPlaceholder('#search-input', {
 *   keywords: ['Electronics', 'Machinery', 'Textiles'],
 *   interval: 4000
 * });
 *
 * // Clean up when done
 * cleanup();
 * ```
 */
export function initAnimatedPlaceholder(
  inputSelector: string,
  config: Partial<PlaceholderConfig> = {}
): () => void {
  // Merge with default config
  const mergedConfig: Required<PlaceholderConfig> = {
    keywords: config.keywords ?? DEFAULT_CONFIG.keywords,
    interval: config.interval ?? DEFAULT_CONFIG.interval,
  };

  // Wait for DOM to be ready
  const initialize = (): void => {
    const inputElement = document.querySelector<HTMLInputElement>(inputSelector);

    if (!inputElement) {
      return;
    }

    // Clean up any existing animation
    stopAnimatedPlaceholder();

    // Reset state
    state = createState();
    state.inputElement = inputElement;

    // Inject styles
    injectAnimatedPlaceholderStyles();

    // Add class to hide native placeholder
    inputElement.classList.add('search-input-animated');

    // Ensure parent is positioned relatively
    const parent = inputElement.parentElement;
    if (parent) {
      parent.classList.add('animated-placeholder-container');
    }

    // Create and append placeholder element
    state.placeholderElement = createPlaceholderElement(mergedConfig.keywords[0]);

    if (parent) {
      parent.appendChild(state.placeholderElement);
    }

    // Add input event listener
    inputElement.addEventListener('input', handleInput);

    // Start rotation
    state.isAnimating = true;
    state.intervalId = window.setInterval(() => {
      rotateKeyword(mergedConfig.keywords);
    }, mergedConfig.interval);
  };

  // Initialize when DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
    } else {
      // DOM is already ready
      initialize();
    }
  }

  // Return cleanup function
  return () => stopAnimatedPlaceholder();
}

/**
 * Stops the animated placeholder and cleans up resources
 */
export function stopAnimatedPlaceholder(): void {
  // Clear interval
  if (state.intervalId !== null) {
    window.clearInterval(state.intervalId);
    state.intervalId = null;
  }

  // Remove event listener
  if (state.inputElement) {
    state.inputElement.removeEventListener('input', handleInput);
    state.inputElement.classList.remove('search-input-animated');
  }

  // Remove placeholder element
  if (state.placeholderElement && state.placeholderElement.parentElement) {
    state.placeholderElement.parentElement.removeChild(state.placeholderElement);
  }

  // Reset state
  state = createState();
}

/**
 * Gets the default placeholder keywords for TR TradeHub
 * These can be used as a reference or starting point
 */
export function getDefaultKeywords(): string[] {
  return [...DEFAULT_CONFIG.keywords];
}

/**
 * Gets the default rotation interval in milliseconds
 */
export function getDefaultInterval(): number {
  return DEFAULT_CONFIG.interval;
}
