/**
 * Payment Processing Page
 * Simulates 3D Secure / OTP verification before redirecting to success or failed.
 */
import '../style.css';
import { t } from '../i18n';
import { getBaseUrl, initLinkRewriter } from '../utils/url';

initLinkRewriter();

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const count = params.get('count') || '1';
  const method = params.get('method') || 'credit_card';
  const orderNumbers = params.get('orderNumbers') || '';

  const appEl = document.getElementById('app');
  if (!appEl) return;

  // Use first order number from URL or generate fallback
  // (order number available via orderNumbers param if needed)

  // Generate a random 4-digit OTP code (for simulation)
  const otpCode = String(Math.floor(1000 + Math.random() * 9000));

  let phase: 'processing' | 'otp' | 'verifying' = 'processing';

  function render() {
    if (!appEl) return;

    if (phase === 'processing') {
      appEl.innerHTML = `
        <div class="flex flex-col items-center gap-6">
          <!-- Spinner -->
          <div class="relative w-20 h-20">
            <div class="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div class="absolute inset-0 rounded-full border-4 border-t-[#d24600] animate-spin"></div>
          </div>

          <div>
            <h1 class="text-xl font-bold text-[#222] mb-2"><span data-i18n="paymentStatus.processingTitle">${t('paymentStatus.processingTitle')}</span></h1>
            <p class="text-sm text-[#666]"><span data-i18n="paymentStatus.doNotClose">${t('paymentStatus.doNotClose')}</span></p>
          </div>

          <div class="bg-[#fff8f0] border border-[#f0d9b5] rounded-lg p-4 w-full max-w-sm">
            <div class="flex items-center gap-2 text-sm text-[#8a6d3b]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              <span data-i18n="paymentStatus.bankVerification">${t('paymentStatus.bankVerification')}</span>
            </div>
          </div>
        </div>
      `;
    } else if (phase === 'otp') {
      appEl.innerHTML = `
        <div class="flex flex-col items-center gap-6">
          <!-- Lock icon -->
          <div class="w-16 h-16 rounded-full bg-[#f0f7ff] border-2 border-[#3b82f6] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          <div>
            <h1 class="text-xl font-bold text-[#222] mb-1"><span data-i18n="paymentStatus.secureVerification">${t('paymentStatus.secureVerification')}</span></h1>
            <p class="text-sm text-[#666] mb-1"><span data-i18n="paymentStatus.enterCode">${t('paymentStatus.enterCode')}</span></p>
            <p class="text-xs text-[#999]">(<span data-i18n="paymentStatus.demoCode">${t('paymentStatus.demoCode')}</span> <strong class="text-[#333]">${otpCode}</strong>)</p>
          </div>

          <div class="w-full max-w-[240px]">
            <div class="flex justify-center gap-2 mb-4" id="otp-inputs">
              <input type="text" maxlength="1" class="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#3b82f6] focus:outline-none transition-colors" data-otp-index="0" inputmode="numeric" autofocus />
              <input type="text" maxlength="1" class="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#3b82f6] focus:outline-none transition-colors" data-otp-index="1" inputmode="numeric" />
              <input type="text" maxlength="1" class="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#3b82f6] focus:outline-none transition-colors" data-otp-index="2" inputmode="numeric" />
              <input type="text" maxlength="1" class="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#3b82f6] focus:outline-none transition-colors" data-otp-index="3" inputmode="numeric" />
            </div>
            <p class="text-xs text-red-500 hidden mb-3" id="otp-error"><span data-i18n="paymentStatus.incorrectCode">${t('paymentStatus.incorrectCode')}</span></p>
            <button id="otp-verify-btn" class="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3 px-6 rounded-full transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              <span data-i18n="paymentStatus.verify">${t('paymentStatus.verify')}</span>
            </button>
          </div>

          <p class="text-xs text-[#999]">
            <svg class="inline w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span data-i18n="paymentStatus.secureConnection">${t('paymentStatus.secureConnection')}</span>
          </p>
        </div>
      `;
      initOtpInputs();
    } else if (phase === 'verifying') {
      appEl.innerHTML = `
        <div class="flex flex-col items-center gap-6">
          <div class="relative w-20 h-20">
            <div class="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div class="absolute inset-0 rounded-full border-4 border-t-[#16a34a] animate-spin"></div>
          </div>
          <div>
            <h1 class="text-xl font-bold text-[#222] mb-2"><span data-i18n="paymentStatus.verifyingPayment">${t('paymentStatus.verifyingPayment')}</span></h1>
            <p class="text-sm text-[#666]"><span data-i18n="paymentStatus.almostDone">${t('paymentStatus.almostDone')}</span></p>
          </div>
        </div>
      `;
    }
  }

  function initOtpInputs() {
    const inputs = document.querySelectorAll<HTMLInputElement>('[data-otp-index]');
    const verifyBtn = document.getElementById('otp-verify-btn') as HTMLButtonElement | null;
    const errorEl = document.getElementById('otp-error');

    inputs.forEach((input, idx) => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
        if (input.value && idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        }
        updateVerifyBtn();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && idx > 0) {
          inputs[idx - 1].focus();
        }
      });

      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData?.getData('text') || '').replace(/[^0-9]/g, '').slice(0, 4);
        pasted.split('').forEach((char, i) => {
          if (inputs[i]) inputs[i].value = char;
        });
        const focusIdx = Math.min(pasted.length, inputs.length - 1);
        inputs[focusIdx].focus();
        updateVerifyBtn();
      });
    });

    function updateVerifyBtn() {
      const filled = Array.from(inputs).every(i => i.value.length === 1);
      if (verifyBtn) verifyBtn.disabled = !filled;
    }

    verifyBtn?.addEventListener('click', () => {
      const entered = Array.from(inputs).map(i => i.value).join('');
      if (entered === otpCode) {
        phase = 'verifying';
        render();
        setTimeout(() => {
          window.location.href = `${getBaseUrl()}pages/order/order-success.html?status=success&count=${count}&orderNumbers=${encodeURIComponent(orderNumbers)}`;
        }, 2000);
      } else {
        if (errorEl) errorEl.classList.remove('hidden');
        inputs.forEach(i => {
          i.value = '';
          i.classList.add('border-red-400');
        });
        inputs[0].focus();
        if (verifyBtn) verifyBtn.disabled = true;
        setTimeout(() => {
          inputs.forEach(i => i.classList.remove('border-red-400'));
        }, 1500);
      }
    });
  }

  // Start with processing phase
  render();

  // After 2 seconds, show OTP phase (simulating bank redirect)
  if (method === 'credit_card') {
    setTimeout(() => {
      phase = 'otp';
      render();
    }, 2000);
  } else {
    // Non-credit card: just redirect after delay
    setTimeout(() => {
      window.location.href = `${getBaseUrl()}pages/order/order-success.html?status=pending&count=${count}&orderNumbers=${encodeURIComponent(orderNumbers)}`;
    }, 3000);
  }
});
