/**
 * LoginModal Component
 * Sign-in popup with social buttons (Google, Facebook, LinkedIn, Email),
 * promotional banner, QR code link, and close behavior.
 * Triggered when unauthenticated users try to interact with review actions.
 *
 * Reactivity handled by Alpine.js via x-data="loginModal".
 * Alpine.data('loginModal') is registered in src/alpine.ts.
 */

import { t } from '../../i18n';

/* ── Modal HTML ──────────────────────────────────────── */

export function LoginModal(): string {
  return `
    <div
      id="rv-login-modal"
      x-data="loginModal"
      x-show="open"
      x-cloak
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0"
      x-transition:enter-end="opacity-100"
      x-transition:leave="transition ease-in duration-200"
      x-transition:leave-start="opacity-100"
      x-transition:leave-end="opacity-0"
      @click.self="close()"
      @keydown.escape.window.capture="if (open) { $event.stopImmediatePropagation(); close() }"
      @login-modal-show.window="show()"
      @login-modal-hide.window="close()"
      class="rv-login-overlay fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
    >
      <div
        x-show="open"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 scale-95"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-200"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-95"
        class="rv-login-modal max-w-[420px] w-[95%] p-0 rounded-2xl bg-surface shadow-modal overflow-hidden relative max-sm:!w-full max-sm:!max-w-full max-sm:!rounded-none max-sm:!min-h-screen"
      >
        <!-- Close Button -->
        <button
          type="button"
          @click="close()"
          class="rv-login-close absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full border-none bg-transparent cursor-pointer text-secondary-400 hover:bg-black/5 hover:text-secondary-900 transition-colors z-[1]"
          id="rv-login-close"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Banner -->
        <div class="text-center py-4 px-6" style="background:linear-gradient(135deg,#fff1f2 0%,#ffe4e6 100%)">
          <strong class="text-[#f43f5e] font-bold text-sm">${t('product.loginFreeShipping')}</strong>
        </div>

        <!-- Content -->
        <div class="px-8 pb-8">
          <div class="text-2xl font-bold text-center mt-5 text-secondary-900">${t('product.loginTitle')}</div>
          <div class="text-sm text-secondary-400 text-center mt-2 mb-6">${t('product.loginSubtitle')}</div>

          <!-- Social Buttons -->
          <button type="button" @click="close()" class="rv-login-btn w-full h-12 border border-border-default rounded-lg flex items-center gap-3 px-4 cursor-pointer text-[15px] font-medium text-secondary-900 bg-surface hover:bg-surface-raised transition-colors mb-3" data-login-provider="google">
            <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            ${t('product.continueGoogle')}
          </button>

          <button type="button" @click="close()" class="rv-login-btn w-full h-12 border border-border-default rounded-lg flex items-center gap-3 px-4 cursor-pointer text-[15px] font-medium text-secondary-900 bg-surface hover:bg-surface-raised transition-colors mb-3" data-login-provider="facebook">
            <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            ${t('product.continueFacebook')}
          </button>

          <button type="button" @click="close()" class="rv-login-btn w-full h-12 border border-border-default rounded-lg flex items-center gap-3 px-4 cursor-pointer text-[15px] font-medium text-secondary-900 bg-surface hover:bg-surface-raised transition-colors mb-3" data-login-provider="linkedin">
            <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            ${t('product.continueLinkedin')}
          </button>

          <!-- Divider -->
          <div class="rv-login-divider flex items-center gap-3 my-5 text-xs text-secondary-400 uppercase">${t('product.orDivider')}</div>

          <!-- Email Button -->
          <button type="button" @click="close()" class="rv-login-btn w-full h-12 border border-border-default rounded-lg flex items-center gap-3 px-4 cursor-pointer text-[15px] font-medium text-secondary-900 bg-surface hover:bg-surface-raised transition-colors mb-3" data-login-provider="email">
            <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            ${t('product.continueEmail')}
          </button>

          <!-- Footer -->
          <div class="rv-login-footer text-center text-[13px] text-secondary-400 mt-4">
            ${t('product.newToTradehub')} <a href="javascript:void(0)" class="text-primary-500 font-semibold no-underline cursor-pointer hover:underline">${t('product.createAccount')}</a>
          </div>

          <!-- QR Code link -->
          <div class="text-center text-[13px] text-secondary-400 mt-3 flex items-center justify-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
            </svg>
            ${t('product.qrLogin')}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ── Init logic ──────────────────────────────────────── */

/**
 * @deprecated Replaced by Alpine.js x-data="loginModal" directives.
 * Alpine handles show/hide, click handlers, Escape key, and body scroll lock.
 * Remove this call from page entry files and use startAlpine() instead.
 */
export function initLoginModal(): void {
  // No-op: All interactivity is now handled by Alpine.js via x-data="loginModal"
}

/**
 * Show the login modal.
 * Dispatches a custom event that the Alpine loginModal component listens for.
 */
export function showLoginModal(): void {
  window.dispatchEvent(new CustomEvent('login-modal-show'));
}

/**
 * Hide the login modal.
 * Dispatches a custom event that the Alpine loginModal component listens for.
 */
export function hideLoginModal(): void {
  window.dispatchEvent(new CustomEvent('login-modal-hide'));
}

/** Alias for backward compatibility */
export const openLoginModal = showLoginModal;
