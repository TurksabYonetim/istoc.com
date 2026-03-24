/**
 * SocialLoginButtons Component
 * Reusable social login buttons (Google, Facebook, LinkedIn, Email) for authentication flows.
 * Supports full-width buttons or a row of icons.
 */

import { t } from '../../i18n';

/* ── Types ──────────────────────────────────────────── */

export type LoginProvider = 'google' | 'facebook' | 'linkedin' | 'apple' | 'email';

export interface SocialLoginButtonsOptions {
  /** Container element ID for event binding */
  containerId?: string;
  /** Callback when a provider is selected */
  onProviderSelect?: (provider: LoginProvider) => void;
  /** Display mode: 'full' (default) or 'icons' */
  mode?: 'full' | 'icons';
}

/* ── Button HTML ─────────────────────────────────────── */

export function SocialLoginButtons(options: { mode?: 'full' | 'icons' } = {}): string {
  const mode = options.mode || 'full';

  if (mode === 'icons') {
    return `
      <div class="rv-social-login-buttons icons-mode flex justify-center gap-4">
        <!-- Google -->
        <button type="button" class="rv-login-icon-btn" data-login-provider="google" title="Google">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </button>

        <!-- Facebook -->
        <button type="button" class="rv-login-icon-btn" data-login-provider="facebook" title="Facebook">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>

        <!-- LinkedIn (replaced Apple) -->
        <button type="button" class="rv-login-icon-btn" data-login-provider="linkedin" title="LinkedIn">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </button>
      </div>
    `;
  }

  // Default 'full' mode (legacy)
  return `
    <div class="rv-social-login-buttons">
      <!-- Google Button -->
      <button type="button" class="rv-login-btn" data-login-provider="google">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span data-i18n="auth.social.google">${t('auth.social.google')}</span>
      </button>

      <!-- Facebook Button -->
      <button type="button" class="rv-login-btn" data-login-provider="facebook">
        <svg viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <span data-i18n="auth.social.facebook">${t('auth.social.facebook')}</span>
      </button>

      <!-- Apple Button -->
      <button type="button" class="rv-login-btn" data-login-provider="apple">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
        <span data-i18n="auth.social.apple">${t('auth.social.apple')}</span>
      </button>

      <!-- Divider -->
      <div class="rv-login-divider" data-i18n="auth.login.or">${t('auth.login.or')}</div>

      <!-- Email Button -->
      <button type="button" class="rv-login-btn" data-login-provider="email">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        <span data-i18n="auth.social.emailContinue">${t('auth.social.emailContinue')}</span>
      </button>
    </div>
  `;
}

/* ── Init logic ──────────────────────────────────────── */

/**
 * Initialize social login buttons with click handlers.
 * Uses event delegation for efficient event handling.
 */
export function initSocialLoginButtons(options: SocialLoginButtonsOptions = {}): void {
  const { containerId, onProviderSelect } = options;

  // Find container - either by ID or find the first social login buttons container
  // Note: we might have multiple containers (e.g. if we have both modes), so this might need refinement if used multiple times on same page
  const container = containerId
    ? document.getElementById(containerId)
    : document.querySelector('.rv-social-login-buttons');

  if (!container) return;

  // Use event delegation for button clicks
  container.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest('[data-login-provider]') as HTMLElement | null;

    if (button) {
      const provider = button.getAttribute('data-login-provider') as LoginProvider;

      if (provider && onProviderSelect) {
        onProviderSelect(provider);
      }

      // Dispatch custom event for external listeners
      const event = new CustomEvent('rv-social-login', {
        bubbles: true,
        detail: { provider }
      });
      container.dispatchEvent(event);
    }
  });
}

/**
 * Get all social login button elements within a container
 */
export function getSocialLoginButtons(containerId?: string): NodeListOf<HTMLButtonElement> {
  const container = containerId
    ? document.getElementById(containerId)
    : document;

  return (container || document).querySelectorAll('[data-login-provider]');
}
