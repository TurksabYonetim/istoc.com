/**
 * AuthLayout Component
 * Shared layout for login and register pages with split-screen desktop
 * and full-screen mobile layouts (Alibaba-style).
 *
 * Desktop: Orange promotional banner on left (40%), form content on right (60%)
 * Mobile: Full orange background with centered white card overlay
 */

/* ── Types ──────────────────────────────────────────── */

import { t } from '../../i18n';

export interface AuthLayoutOptions {
  /** Page title for mobile header */
  title?: string;
  /** Whether to show back button on mobile */
  showBackButton?: boolean;
  /** Custom back button handler */
  onBackClick?: () => void;
}

/* ── Utility Functions ───────────────────────────────── */

/**
 * Get base URL for assets (handles GitHub Pages subdirectory)
 */
export const getBaseUrl = (): string => {
  // Vite replaces import.meta.env.BASE_URL at build time.
  // If it's set to a subdirectory (not just "/"), use it directly.
  const viteBase = typeof import.meta !== 'undefined' ? import.meta.env?.BASE_URL : undefined;
  if (viteBase && viteBase !== '/') {
    return viteBase;
  }
  // Runtime fallback: detect GitHub Pages subdirectory from URL
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/tradehub/')) {
    return '/tradehub/';
  }
  return '/';
};

/* ── Sub-component Renders ───────────────────────────── */

/**
 * Renders the mobile header bar with optional back button and title
 */
function renderMobileHeader(options: AuthLayoutOptions = {}): string {
  const { title = t('auth.mobileHeaderTitle'), showBackButton = true } = options;
  const baseUrl = getBaseUrl();

  return `
    <header class="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center h-14 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      ${showBackButton ? `
        <button
          type="button"
          id="auth-mobile-back"
          class="flex items-center justify-center w-10 h-10 -ml-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="${t('auth.mobileBackLabel')}"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
          </svg>
        </button>
      ` : ''}
      <span class="flex-1 text-center text-sm font-medium text-gray-900 dark:text-white truncate ${showBackButton ? 'pr-10' : ''}">${title}</span>
      <a href="${baseUrl}" class="absolute right-4 top-1/2 -translate-y-1/2" aria-label="iSTOC Ana Sayfa">
        <img src="${baseUrl}images/istoc-logo.png" alt="iSTOC" class="h-6" />
      </a>
    </header>
  `;
}

/**
 * Renders the promotional banner for desktop (left side) and mobile background
 */
function renderPromoBanner(): string {
  return `
    <div class="auth-promo-banner flex flex-col items-center justify-center px-10 py-12 text-center text-white h-full relative overflow-hidden bg-[linear-gradient(145deg,var(--color-primary-400)_0%,var(--color-primary-500)_45%,var(--color-primary-700)_100%)] w-full">

      <!-- Decorative background rings -->
      <div class="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5"></div>
      <div class="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-white/5"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none"></div>

      <!-- Content -->
      <div class="relative z-10 w-full max-w-sm">

        <!-- Brand badge -->
        <div class="flex justify-center mb-8">
          <div class="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border border-white/20 backdrop-blur-sm">
            <svg class="w-4 h-4 text-yellow-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-white text-sm font-semibold tracking-wide">TradeHub B2B</span>
          </div>
        </div>

        <!-- Headline -->
        <h1 class="text-3xl lg:text-4xl font-bold leading-tight text-white mb-3">
          Global B2B<br/>Sourcing Platform
        </h1>
        <p class="text-sm text-orange-100/80 leading-relaxed mb-8">
          Order protection, verified suppliers<br/>and great savings — all in one place.
        </p>

        <!-- Stats row -->
        <div class="flex justify-center items-center gap-0 mb-10 rounded-2xl bg-white/10 border border-white/15 overflow-hidden">
          <div class="flex-1 py-4 px-2 text-center">
            <div class="text-xl font-bold text-white">200K+</div>
            <div class="text-xs text-orange-100/70 mt-0.5">Suppliers</div>
          </div>
          <div class="w-px h-10 bg-white/20"></div>
          <div class="flex-1 py-4 px-2 text-center">
            <div class="text-xl font-bold text-white">50M+</div>
            <div class="text-xs text-orange-100/70 mt-0.5">Products</div>
          </div>
          <div class="w-px h-10 bg-white/20"></div>
          <div class="flex-1 py-4 px-2 text-center">
            <div class="text-xl font-bold text-white">190+</div>
            <div class="text-xs text-orange-100/70 mt-0.5">Countries</div>
          </div>
        </div>

        <!-- Illustration: Globe with floating badges -->
        <div class="relative h-52 w-full flex items-center justify-center mb-6">
          <!-- Outer ring -->
          <div class="w-44 h-44 rounded-full bg-white/8 border border-white/15 flex items-center justify-center relative">
            <!-- Inner ring -->
            <div class="w-32 h-32 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <svg class="w-16 h-16 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <!-- Bouncing pin -->
            <div class="absolute -top-5 right-6 text-red-400 animate-bounce drop-shadow-lg">
              <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>

            <!-- Badge: Verified -->
            <div class="absolute -left-16 top-6 flex items-center gap-1.5 bg-white/15 border border-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-lg">
              <svg class="w-3.5 h-3.5 text-green-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span class="text-white text-xs font-medium whitespace-nowrap">Verified</span>
            </div>

            <!-- Badge: Fast -->
            <div class="absolute -right-16 bottom-6 flex items-center gap-1.5 bg-white/15 border border-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-lg">
              <svg class="w-3.5 h-3.5 text-yellow-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-white text-xs font-medium whitespace-nowrap">Fast Ship</span>
            </div>
          </div>
        </div>

        <!-- Trust bar -->
        <div class="flex items-center justify-center gap-2 text-xs text-orange-100/60">
          <svg class="w-3.5 h-3.5 shrink-0 text-orange-100/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>SSL Encrypted · Trade Assurance · 24/7 Support</span>
        </div>

      </div>
    </div>
  `;
}


/* ── Main Component ──────────────────────────────────────── */

/**
 * AuthLayout Component
 * Renders split-screen desktop / full-screen mobile auth layout
 *
 * @param content - HTML string for the form content (LoginPage, RegisterPage, etc.)
 * @param options - Layout configuration options
 * @returns HTML string for the complete auth layout
 */
export function AuthLayout(content: string, options: AuthLayoutOptions = {}): string {
  return `
    <div id="auth-layout" class="min-h-screen">
      <!-- Mobile Header -->
      ${renderMobileHeader(options)}

      <!-- Main Container -->
      <div class="flex min-h-screen">

        <!-- Left: Promo Banner (Desktop only) -->
        <div class="hidden lg:flex lg:w-[45%] xl:w-[50%] bg-[linear-gradient(145deg,var(--color-primary-400)_0%,var(--color-primary-500)_45%,var(--color-primary-700)_100%)]">
          ${renderPromoBanner()}
        </div>

        <!-- Right: Form Content Area -->
        <div class="flex-1 lg:w-[55%] xl:w-[50%] relative bg-white dark:bg-gray-900">

          <!-- Mobile: Full-height accent background -->
          <div class="lg:hidden absolute inset-0 bg-[linear-gradient(145deg,var(--color-primary-400)_0%,var(--color-primary-500)_45%,var(--color-primary-700)_100%)]"></div>

          <!-- Responsive content wrapper -->
          <div class="relative z-10 w-full min-h-screen flex flex-col lg:items-center lg:justify-center">
            <!-- Mobile-only: header spacer + promo text -->
            <div class="lg:hidden">
              <div class="h-14"></div>
              <div class="px-6 pt-6 pb-8 text-white text-center">
                <h2 class="text-xl font-bold mb-1">Global B2B sourcing</h2>
                <p class="text-sm opacity-80">Order protection and great savings</p>
              </div>
            </div>

            <!-- Single content area (mobile: white card, desktop: clean white) -->
            <div class="bg-white dark:bg-gray-900 mx-2 sm:mx-4 mb-8 px-6 sm:px-8 py-8 rounded-2xl shadow-xl lg:mx-0 lg:mb-0 lg:px-20 lg:py-0 lg:rounded-none lg:shadow-none lg:bg-white lg:dark:bg-gray-900 lg:h-full lg:min-h-screen lg:flex lg:items-center">
              <div class="w-full max-w-md mx-auto">
                ${content}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}


/* ── Init Logic ──────────────────────────────────────── */

/**
 * Initialize AuthLayout interactivity
 * Sets up mobile back button handler
 */
export function initAuthLayout(options: AuthLayoutOptions = {}): void {
  const backBtn = document.getElementById('auth-mobile-back');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (options.onBackClick) {
        options.onBackClick();
      } else {
        // Default: go back in history or to home
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = getBaseUrl();
        }
      }
    });
  }
}
