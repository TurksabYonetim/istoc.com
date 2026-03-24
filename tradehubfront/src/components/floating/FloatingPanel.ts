/**
 * FloatingPanel Component
 * Fixed right-bottom panel with chat button (badge showing 9+),
 * visual search lens button, and scroll-to-top button.
 *
 * Reactivity handled by Alpine.js via x-data="floatingPanel".
 * Alpine.data('floatingPanel') is registered in src/alpine.ts.
 */

/**
 * Generates the chat button with message badge.
 * Uses @click to set chatOpen=true on the parent Alpine component.
 */
function renderChatButton(): string {
  const messageCount = '9+';

  return `
    <button
      type="button"
      @click="chatOpen = true"
      class="th-btn relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
      aria-label="Open chat, ${messageCount} new messages"
      data-tooltip-target="tooltip-chat"
      data-tooltip-placement="left"
    >
      <!-- Chat Icon -->
      <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
      <!-- Badge -->
      <span class="th-badge absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 bg-error-500 text-white text-xs font-bold rounded-full">
        ${messageCount}
      </span>
    </button>
    <div id="tooltip-chat" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-md shadow-sm opacity-0 tooltip dark:bg-gray-700">
      Chat Support
      <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
  `;
}

/**
 * Generates the visual search lens button.
 * Uses @click to set lensOpen=true on the parent Alpine component.
 */
function renderLensButton(): string {
  return `
    <button
      type="button"
      @click="lensOpen = true"
      class="flex items-center justify-center w-12 h-12 bg-white hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
      aria-label="Visual search"
      data-tooltip-target="tooltip-lens"
      data-tooltip-placement="left"
    >
      <!-- Camera/Lens Icon -->
      <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
      </svg>
    </button>
    <div id="tooltip-lens" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-md shadow-sm opacity-0 tooltip dark:bg-gray-700">
      Search by Image
      <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
  `;
}

/**
 * Generates the scroll-to-top button.
 * Uses x-show with x-transition to replace classList.add/remove('hidden'/'flex').
 * x-cloak prevents flash of unstyled content before Alpine initializes.
 */
function renderScrollToTopButton(): string {
  return `
    <button
      type="button"
      x-show="showScrollTop"
      x-cloak
      x-transition:enter="transition ease-out duration-200"
      x-transition:enter-start="opacity-0 scale-95"
      x-transition:enter-end="opacity-100 scale-100"
      x-transition:leave="transition ease-in duration-150"
      x-transition:leave-start="opacity-100 scale-100"
      x-transition:leave-end="opacity-0 scale-95"
      @click="scrollToTop()"
      class="flex items-center justify-center w-12 h-12 bg-white hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
      aria-label="Scroll to top"
      data-tooltip-target="tooltip-scroll-top"
      data-tooltip-placement="left"
    >
      <!-- Arrow Up Icon -->
      <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
    <div id="tooltip-scroll-top" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-md shadow-sm opacity-0 tooltip dark:bg-gray-700">
      Back to Top
      <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
  `;
}

/**
 * Generates the chat support drawer template.
 * Replaces the imperative openChatDrawer() createElement pattern.
 * Hidden by default via x-show="chatOpen" (chatOpen starts as false).
 * x-cloak prevents brief flash before Alpine processes the directives.
 */
function renderChatDrawer(): string {
  return `
    <!-- Chat Drawer Backdrop -->
    <div
      x-show="chatOpen"
      x-cloak
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0"
      x-transition:enter-end="opacity-100"
      x-transition:leave="transition ease-in duration-300"
      x-transition:leave-start="opacity-100"
      x-transition:leave-end="opacity-0"
      @click="chatOpen = false"
      class="fixed inset-0 z-(--z-popover) bg-black/50"
      aria-hidden="true"
    ></div>

    <!-- Chat Drawer Panel -->
    <div
      x-show="chatOpen"
      x-cloak
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="translate-x-full"
      x-transition:enter-end="translate-x-0"
      x-transition:leave="transition ease-in duration-300"
      x-transition:leave-start="translate-x-0"
      x-transition:leave-end="translate-x-full"
      @keydown.escape.window="chatOpen = false"
      class="fixed top-0 right-0 z-(--z-toast) h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Chat Support"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Chat Support</h2>
        <button
          type="button"
          @click="chatOpen = false"
          class="flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
          aria-label="Close chat"
        >
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Message Area -->
      <div class="flex-1 flex items-center justify-center p-6">
        <div class="text-center">
          <div class="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30">
            <svg class="w-8 h-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-sm">Chat functionality coming soon...</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generates the visual search / lens modal template.
 * Replaces the imperative openLensModal() createElement pattern.
 * Hidden by default via x-show="lensOpen" (lensOpen starts as false).
 * Uses @click.self on backdrop to close only on direct backdrop clicks.
 * Uses x-ref for the hidden file input, triggered from the drop zone.
 */
function renderLensModal(): string {
  return `
    <!-- Lens Modal Backdrop (also serves as centering container) -->
    <div
      x-show="lensOpen"
      x-cloak
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0"
      x-transition:enter-end="opacity-100"
      x-transition:leave="transition ease-in duration-300"
      x-transition:leave-start="opacity-100"
      x-transition:leave-end="opacity-0"
      @click.self="lensOpen = false"
      @keydown.escape.window="lensOpen = false"
      class="fixed inset-0 z-(--z-popover) bg-black/50 flex items-center justify-center"
      aria-hidden="true"
    >
      <!-- Lens Modal Panel -->
      <div
        x-show="lensOpen"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 scale-95"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-300"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-95"
        class="relative z-(--z-toast) w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-md shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Search by Image"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Search by Image</h2>
          <button
            type="button"
            @click="lensOpen = false"
            class="flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
            aria-label="Close modal"
          >
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Drop Zone -->
        <div class="p-6">
          <div
            @click="$refs.lensFileInput.click()"
            @keydown.enter.prevent="$refs.lensFileInput.click()"
            @keydown.space.prevent="$refs.lensFileInput.click()"
            class="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 dark:hover:border-primary-500 dark:hover:bg-primary-900/10 transition-colors"
            role="button"
            tabindex="0"
            aria-label="Click to upload an image or drag and drop"
          >
            <div class="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700">
              <svg class="w-7 h-7 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Drop an image here or click to upload</p>
            <p class="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, WEBP up to 10MB</p>
          </div>
          <input
            x-ref="lensFileInput"
            type="file"
            accept="image/*"
            class="hidden"
            aria-label="Upload image for visual search"
          />
        </div>
      </div>
    </div>
  `;
}

/**
 * FloatingPanel Component
 * Renders a fixed positioned panel at the bottom-right of the viewport containing:
 * - Chat button with badge showing 9+ messages
 * - Visual search lens button
 * - Scroll-to-top button (hidden until scrolled > 300px)
 * - Chat support drawer (hidden, shown via chatOpen state)
 * - Visual search modal (hidden, shown via lensOpen state)
 *
 * All interactivity is handled declaratively via Alpine.js x-data="floatingPanel".
 * Body scroll lock is managed via x-effect when chat drawer or lens modal is open.
 */
export function FloatingPanel(): string {
  return `
    <div
      x-data="floatingPanel"
      x-effect="document.body.style.overflow = (chatOpen || lensOpen) ? 'hidden' : ''"
    >
      <!-- Floating Action Buttons (visible on md+ screens) -->
      <div
        id="floating-panel"
        class="fixed bottom-20 right-3 xs:right-4 sm:right-6 md:bottom-6 z-35 flex flex-col items-center gap-2 xs:gap-3 hidden md:flex"
        aria-label="Quick actions panel"
      >
        <!-- Scroll to Top Button (shown on scroll > 300px via x-show) -->
        ${renderScrollToTopButton()}

        <!-- Visual Search Lens Button -->
        ${renderLensButton()}

        <!-- Chat Button with Badge -->
        ${renderChatButton()}

        <!-- Satıcı Paneli Button (only for sellers) -->
        <a
          x-show="isSeller"
          x-cloak
          :href="sellerPanelUrl"
          class="flex items-center justify-center w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          aria-label="Satıcı Paneli"
          data-tooltip-target="tooltip-seller-panel"
          data-tooltip-placement="left"
        >
          <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
          </svg>
        </a>
        <div id="tooltip-seller-panel" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-md shadow-sm opacity-0 tooltip dark:bg-gray-700">
          Satıcı Paneli
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>

      <!-- Chat Support Drawer (hidden by default, toggled by chatOpen) -->
      ${renderChatDrawer()}

      <!-- Visual Search / Lens Modal (hidden by default, toggled by lensOpen) -->
      ${renderLensModal()}
    </div>
  `;
}

/**
 * @deprecated Replaced by Alpine.js x-data="floatingPanel" directives.
 * Alpine handles scroll-to-top visibility, chat drawer, and lens modal.
 * Remove this call from page entry files and use startAlpine() instead.
 */
export function initFloatingPanel(): void {
  // No-op: All interactivity is now handled by Alpine.js via x-data="floatingPanel"
}
