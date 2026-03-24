/**
 * AccountTypeSelector Component
 * Radio card selection for Buyer vs Supplier account types on register page.
 * Each card shows an icon, label, and description with visual selection state.
 */

import { t } from '../../i18n';

/* ── Types ──────────────────────────────────────────── */

export type AccountType = 'buyer' | 'supplier';

export interface AccountTypeSelectorOptions {
  /** Container element ID for event binding */
  containerId?: string;
  /** Default selected account type */
  defaultType?: AccountType;
  /** Callback when account type is selected */
  onTypeSelect?: (type: AccountType) => void;
}

/* ── Component HTML ─────────────────────────────────── */

/**
 * AccountTypeSelector Component
 * Renders radio card selection for Buyer/Supplier account types
 *
 * @param defaultType - Initially selected account type (defaults to 'buyer')
 * @returns HTML string for the account type selector
 */
export function AccountTypeSelector(defaultType: AccountType = 'buyer'): string {
  return `
    <div id="account-type-selector" class="auth-account-type-grid flex flex-col gap-3">
      <!-- Buyer Card -->
      <button
        type="button"
        class="auth-account-type-card flex items-center gap-3.5 w-full py-4 px-[18px] rounded-xl text-left relative cursor-pointer transition-all${defaultType === 'buyer' ? ' selected' : ''}"
        data-account-type="buyer"
        aria-pressed="${defaultType === 'buyer' ? 'true' : 'false'}"
        role="radio"
      >
        <div class="auth-account-type-icon shrink-0 order-1 w-9 h-9 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
          </svg>
        </div>
        <div class="auth-account-type-content flex flex-col gap-0.5 flex-1 min-w-0">
          <span class="auth-account-type-label text-[15px] font-semibold leading-tight">${t('auth.buyer')}</span>
          <span class="auth-account-type-desc text-[13px] leading-snug">${t('auth.buyerDesc')}</span>
        </div>
      </button>

      <!-- Supplier Card -->
      <button
        type="button"
        class="auth-account-type-card flex items-center gap-3.5 w-full py-4 px-[18px] rounded-xl text-left relative cursor-pointer transition-all${defaultType === 'supplier' ? ' selected' : ''}"
        data-account-type="supplier"
        aria-pressed="${defaultType === 'supplier' ? 'true' : 'false'}"
        role="radio"
      >
        <div class="auth-account-type-icon shrink-0 order-1 w-9 h-9 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
          </svg>
        </div>
        <div class="auth-account-type-content flex flex-col gap-0.5 flex-1 min-w-0">
          <span class="auth-account-type-label text-[15px] font-semibold leading-tight">${t('auth.supplier')}</span>
          <span class="auth-account-type-desc text-[13px] leading-snug">${t('auth.supplierDesc')}</span>
        </div>
      </button>
    </div>
  `;
}

/* ── Init Logic ──────────────────────────────────────── */

/**
 * Initialize account type selector with click handlers.
 * Uses event delegation for efficient event handling.
 */
export function initAccountTypeSelector(options: AccountTypeSelectorOptions = {}): void {
  const { containerId, defaultType = 'buyer', onTypeSelect } = options;

  // Find container - either by ID or use default selector ID
  const container = containerId
    ? document.getElementById(containerId)
    : document.getElementById('account-type-selector');

  if (!container) return;

  // Set initial selection if defaultType is specified
  if (defaultType) {
    const defaultCard = container.querySelector(`[data-account-type="${defaultType}"]`);
    if (defaultCard && !defaultCard.classList.contains('selected')) {
      // Clear existing selections
      container.querySelectorAll('.auth-account-type-card').forEach((card) => {
        card.classList.remove('selected');
        card.setAttribute('aria-pressed', 'false');
      });
      // Set default selection
      defaultCard.classList.add('selected');
      defaultCard.setAttribute('aria-pressed', 'true');
    }
  }

  // Use event delegation for card clicks
  container.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const card = target.closest('[data-account-type]') as HTMLElement | null;

    if (card) {
      const type = card.getAttribute('data-account-type') as AccountType;

      // Clear previous selection
      container.querySelectorAll('.auth-account-type-card').forEach((c) => {
        c.classList.remove('selected');
        c.setAttribute('aria-pressed', 'false');
      });

      // Set new selection
      card.classList.add('selected');
      card.setAttribute('aria-pressed', 'true');

      // Callback
      if (type && onTypeSelect) {
        onTypeSelect(type);
      }

      // Dispatch custom event for external listeners
      const event = new CustomEvent('account-type-change', {
        bubbles: true,
        detail: { type }
      });
      container.dispatchEvent(event);
    }
  });
}

/**
 * Get currently selected account type
 */
export function getSelectedAccountType(containerId?: string): AccountType | null {
  const container = containerId
    ? document.getElementById(containerId)
    : document.getElementById('account-type-selector');

  if (!container) return null;

  const selected = container.querySelector('.auth-account-type-card.selected');
  if (selected) {
    return selected.getAttribute('data-account-type') as AccountType;
  }

  return null;
}
