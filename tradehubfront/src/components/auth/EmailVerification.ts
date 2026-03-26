/**
 * EmailVerification Component
 * 6-digit OTP input with auto-focus progression, paste support,
 * and countdown timer for resend functionality.
 * Used in registration flow after email submission.
 */

import { t } from '../../i18n';

/* ── Types ──────────────────────────────────────────── */

export interface EmailVerificationOptions {
  /** Email address being verified */
  email?: string;
  /** Container element ID */
  containerId?: string;
  /** Callback when OTP is completed (all 6 digits entered) — sync, fires immediately */
  onComplete?: (otp: string) => void;
  /** Async callback to verify OTP against backend. If provided, disables inputs during verification. */
  onVerify?: (otp: string) => Promise<void>;
  /** Callback when resend is clicked */
  onResend?: () => void;
  /** Callback when back/change email is clicked */
  onBack?: () => void;
  /** Initial countdown seconds for resend (default: 60) */
  resendCountdown?: number;
}

export interface EmailVerificationState {
  /** Current OTP digits */
  otp: string[];
  /** Whether resend is available */
  canResend: boolean;
  /** Seconds remaining until resend available */
  countdownSeconds: number;
  /** Current countdown interval ID */
  countdownInterval: number | null;
}

/* ── Component HTML ─────────────────────────────────── */

/**
 * Renders the email verification component with 6-digit OTP input
 * @param email - The email address being verified
 */
export function EmailVerification(email: string = ''): string {
  const maskedEmail = maskEmail(email);

  return `
    <div id="email-verification" class="w-full">
      <!-- Header -->
      <div class="mb-6 text-center lg:text-left">
        <h1 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          ${t('auth.verifyEmail')}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          <span id="verification-email-display">${maskedEmail || t('auth.otpSentFallback')}</span> ${t('auth.otpSentTo')}
        </p>
      </div>

      <!-- OTP Input Fields -->
      <div class="mb-6">
        <div id="otp-input-container" class="flex justify-center lg:justify-start gap-2 sm:gap-3">
          ${renderOTPInputs()}
        </div>

        <!-- Error message (hidden by default) -->
        <p id="otp-error" class="mt-3 text-sm text-red-600 dark:text-red-400 text-center lg:text-left hidden">
          ${t('auth.otpInvalidCode')}
        </p>
      </div>

      <!-- Resend Section -->
      <div class="mb-6 text-center lg:text-left">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          ${t('auth.otpDidntReceive')}
          <button
            type="button"
            id="otp-resend-btn"
            class="ml-1 font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            disabled
          >
            <span id="otp-resend-text">${t('auth.otpResend')}</span>
            <span id="otp-countdown" class="text-gray-400 dark:text-gray-500">(60s)</span>
          </button>
        </p>
      </div>

      <!-- Continue Button -->
      <button
        type="button"
        id="otp-continue-btn"
        class="th-btn th-btn-pill w-full py-3 text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled
      >
        ${t('auth.otpVerifyAndContinue')}
      </button>

      <!-- Back/Change Email Link -->
      <div class="mt-4 text-center lg:text-left">
        <button
          type="button"
          id="otp-back-btn"
          class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:underline transition-colors"
        >
          ${t('auth.otpChangeEmail')}
        </button>
      </div>
    </div>
  `;
}

/**
 * Renders the 6 OTP input fields
 */
function renderOTPInputs(): string {
  const inputs: string[] = [];

  for (let i = 0; i < 6; i++) {
    inputs.push(`
      <input
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="1"
        id="otp-input-${i}"
        data-otp-index="${i}"
        class="otp-input w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold
               rounded-md border-2 border-gray-200 dark:border-gray-600
               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
               focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20
               transition-all duration-200 outline-none
               placeholder:text-gray-300 dark:placeholder:text-gray-600"
        placeholder="·"
        autocomplete="one-time-code"
        aria-label="OTP digit ${i + 1} of 6"
      />
    `);
  }

  return inputs.join('');
}

/* ── Helper Functions ────────────────────────────────── */

/**
 * Mask email address for display (e.g., "t***@example.com")
 */
function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;

  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}${local[1]}***@${domain}`;
}

/* ── Init Logic ──────────────────────────────────────── */

/**
 * Initialize EmailVerification interactivity
 * Sets up OTP input handlers, countdown timer, and button states
 */
export function initEmailVerification(options: EmailVerificationOptions = {}): EmailVerificationState {
  const {
    onComplete,
    onVerify,
    onResend,
    onBack,
    resendCountdown = 60
  } = options;

  // Initialize state
  const state: EmailVerificationState = {
    otp: ['', '', '', '', '', ''],
    canResend: false,
    countdownSeconds: resendCountdown,
    countdownInterval: null
  };

  const container = document.getElementById('email-verification');
  if (!container) return state;

  // Get all OTP inputs
  const otpInputs = container.querySelectorAll<HTMLInputElement>('[data-otp-index]');
  const continueBtn = document.getElementById('otp-continue-btn') as HTMLButtonElement | null;
  const resendBtn = document.getElementById('otp-resend-btn') as HTMLButtonElement | null;
  const backBtn = document.getElementById('otp-back-btn') as HTMLButtonElement | null;
  const countdownSpan = document.getElementById('otp-countdown');
  const errorMsg = document.getElementById('otp-error');

  // Helper to handle OTP submission (sync onComplete + async onVerify)
  let verifying = false;

  function setInputsDisabled(disabled: boolean): void {
    otpInputs.forEach(inp => { inp.disabled = disabled; });
    if (continueBtn) {
      continueBtn.disabled = disabled;
      continueBtn.textContent = disabled
        ? t('auth.otpVerifying')
        : t('auth.otpVerifyAndContinue');
    }
  }

  async function handleOTPSubmit(): Promise<void> {
    if (!isOTPComplete(state) || verifying) return;

    const otp = state.otp.join('');

    // Fire sync callback if provided
    if (onComplete && !onVerify) {
      onComplete(otp);
      return;
    }

    // Fire async verify callback if provided
    if (onVerify) {
      verifying = true;
      setInputsDisabled(true);
      hideError(errorMsg);

      try {
        await onVerify(otp);
        // Success — caller (alpine/auth.ts) handles navigation
      } catch (err) {
        // Verification failed — show error, clear inputs
        const rawMsg = err instanceof Error ? err.message : '';
        // Rate limit (429) mesajını backend'den al, diğerlerinde frontend i18n kullan
        const displayMsg = rawMsg === 'RATE_LIMIT'
          ? t('auth.otpTooManyAttempts')
          : t('auth.otpInvalidCode');
        showOTPError(displayMsg);
        clearOTPInputs();
        state.otp = ['', '', '', '', '', ''];
        updateContinueButton(state, continueBtn);
      } finally {
        verifying = false;
        setInputsDisabled(false);
      }
    }
  }

  // Setup OTP input handlers
  otpInputs.forEach((input, index) => {
    // Handle input
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const value = target.value.replace(/\D/g, ''); // Only digits

      if (value.length === 1) {
        state.otp[index] = value;
        target.value = value;

        // Auto-focus next input
        if (index < 5) {
          const nextInput = otpInputs[index + 1];
          nextInput?.focus();
        }
      } else if (value.length === 0) {
        state.otp[index] = '';
        target.value = '';
      }

      // Hide error on input
      hideError(errorMsg);

      // Check if OTP is complete
      updateContinueButton(state, continueBtn);

      // Auto-submit when all digits entered
      if (isOTPComplete(state)) {
        handleOTPSubmit();
      }
    });

    // Handle paste (support pasting full 6-digit code)
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData?.getData('text') || '';
      const digits = pastedData.replace(/\D/g, '').slice(0, 6);

      if (digits.length > 0) {
        // Fill all inputs with pasted digits
        for (let i = 0; i < 6; i++) {
          state.otp[i] = digits[i] || '';
          const otpInput = otpInputs[i];
          if (otpInput) {
            otpInput.value = digits[i] || '';
          }
        }

        // Focus last filled input or first empty
        const lastFilledIndex = Math.min(digits.length - 1, 5);
        otpInputs[lastFilledIndex]?.focus();

        // Hide error
        hideError(errorMsg);

        // Update button state
        updateContinueButton(state, continueBtn);

        // Auto-submit if complete
        if (isOTPComplete(state)) {
          handleOTPSubmit();
        }
      }
    });

    // Handle backspace - move to previous input
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        const prevInput = otpInputs[index - 1];
        prevInput?.focus();
      }

      // Handle arrow keys for navigation
      if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        otpInputs[index - 1]?.focus();
      }
      if (e.key === 'ArrowRight' && index < 5) {
        e.preventDefault();
        otpInputs[index + 1]?.focus();
      }
    });

    // Select all on focus
    input.addEventListener('focus', () => {
      input.select();
    });
  });

  // Continue button handler
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      handleOTPSubmit();
    });
  }

  // Resend button handler
  if (resendBtn) {
    resendBtn.addEventListener('click', () => {
      if (state.canResend && onResend) {
        onResend();
        // Reset countdown
        startCountdown(state, resendCountdown, resendBtn, countdownSpan);
      }
    });
  }

  // Back button handler
  if (backBtn && onBack) {
    backBtn.addEventListener('click', () => {
      onBack();
    });
  }

  // Start initial countdown
  startCountdown(state, resendCountdown, resendBtn, countdownSpan);

  // Focus first input
  otpInputs[0]?.focus();

  return state;
}

/**
 * Start or restart the resend countdown timer
 */
function startCountdown(
  state: EmailVerificationState,
  seconds: number,
  resendBtn: HTMLButtonElement | null,
  countdownSpan: HTMLElement | null
): void {
  // Clear existing interval
  if (state.countdownInterval) {
    clearInterval(state.countdownInterval);
  }

  state.countdownSeconds = seconds;
  state.canResend = false;

  // Update UI immediately
  updateCountdownUI(state, resendBtn, countdownSpan);

  // Start countdown
  state.countdownInterval = window.setInterval(() => {
    state.countdownSeconds--;

    if (state.countdownSeconds <= 0) {
      // Countdown complete
      if (state.countdownInterval) {
        clearInterval(state.countdownInterval);
        state.countdownInterval = null;
      }
      state.canResend = true;
    }

    updateCountdownUI(state, resendBtn, countdownSpan);
  }, 1000);
}

/**
 * Update countdown UI elements
 */
function updateCountdownUI(
  state: EmailVerificationState,
  resendBtn: HTMLButtonElement | null,
  countdownSpan: HTMLElement | null
): void {
  if (resendBtn) {
    resendBtn.disabled = !state.canResend;
  }

  if (countdownSpan) {
    if (state.canResend) {
      countdownSpan.classList.add('hidden');
    } else {
      countdownSpan.classList.remove('hidden');
      countdownSpan.textContent = `(${state.countdownSeconds}s)`;
    }
  }
}

/**
 * Check if all OTP digits are entered
 */
function isOTPComplete(state: EmailVerificationState): boolean {
  return state.otp.every(digit => digit !== '');
}

/**
 * Update continue button disabled state based on OTP completeness
 */
function updateContinueButton(
  state: EmailVerificationState,
  continueBtn: HTMLButtonElement | null
): void {
  if (continueBtn) {
    continueBtn.disabled = !isOTPComplete(state);
  }
}

/**
 * Hide error message
 */
function hideError(errorMsg: HTMLElement | null): void {
  if (errorMsg) {
    errorMsg.classList.add('hidden');
  }
}

/**
 * Show error message
 */
export function showOTPError(message?: string): void {
  const errorMsg = document.getElementById('otp-error');
  if (errorMsg) {
    if (message) {
      errorMsg.textContent = message;
    }
    errorMsg.classList.remove('hidden');
  }
}

/**
 * Clear all OTP inputs
 */
export function clearOTPInputs(): void {
  const container = document.getElementById('email-verification');
  if (!container) return;

  const otpInputs = container.querySelectorAll<HTMLInputElement>('[data-otp-index]');
  otpInputs.forEach(input => {
    input.value = '';
  });

  // Focus first input
  const firstInput = container.querySelector<HTMLInputElement>('[data-otp-index="0"]');
  firstInput?.focus();
}

/**
 * Get the current OTP value
 */
export function getOTPValue(): string {
  const container = document.getElementById('email-verification');
  if (!container) return '';

  const otpInputs = container.querySelectorAll<HTMLInputElement>('[data-otp-index]');
  return Array.from(otpInputs).map(input => input.value).join('');
}

/**
 * Update the displayed email address
 */
export function updateVerificationEmail(email: string): void {
  const emailDisplay = document.getElementById('verification-email-display');
  if (emailDisplay) {
    emailDisplay.textContent = maskEmail(email);
  }
}

/**
 * Cleanup function to clear intervals when component is removed
 */
export function cleanupEmailVerification(state: EmailVerificationState): void {
  if (state.countdownInterval) {
    clearInterval(state.countdownInterval);
    state.countdownInterval = null;
  }
}
