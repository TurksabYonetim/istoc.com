/**
 * SupplierSetupForm Component
 * 4-step multi-step form for supplier registration application.
 * Used after AccountSetupForm when account_type is 'supplier'.
 *
 * Steps:
 *  1. Business Information (seller_type, business_name, contact_phone)
 *  2. Tax & Address (tax_id_type, tax_id, tax_office, address_line_1, city, country)
 *  3. Bank Information (bank_name, iban, account_holder_name)
 *  4. Identity & Agreements (identity_document_*, checkboxes)
 */

import { t } from '../../i18n';
import {
  TR_CITIES, TR_TAX_OFFICES,
  validatePhone, validateIBAN, validateTCKN, getCityForTaxOffice,
} from '../../utils/tr-validation';

/* ── Types ──────────────────────────────────────────── */

export interface SupplierSetupFormData {
  seller_type: string;
  business_name: string;
  contact_phone: string;
  tax_id_type: string;
  tax_id: string;
  tax_office: string;
  address_line_1: string;
  city: string;
  country: string;
  bank_name: string;
  iban: string;
  account_holder_name: string;
  identity_document_type: string;
  identity_document_number: string;
  identity_document_expiry: string;
  identity_document: string;
  terms_accepted: boolean;
  privacy_accepted: boolean;
  kvkk_accepted: boolean;
  commission_accepted: boolean;
  return_policy_accepted: boolean;
}

export interface SupplierSetupFormOptions {
  onSubmit?: (data: SupplierSetupFormData) => void;
}

/* ── Component HTML ─────────────────────────────────── */

export function SupplierSetupForm(): string {
  return `
    <div id="supplier-setup-form" class="w-full">
      <!-- Step indicator -->
      <div id="supplier-step-indicator" class="flex items-center justify-center gap-2 mb-6">
        ${[1, 2, 3, 4].map(n => `
          <div class="supplier-step-dot flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all ${n === 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}" data-step-dot="${n}">${n}</div>
          ${n < 4 ? '<div class="w-6 h-0.5 bg-gray-200 dark:bg-gray-700"></div>' : ''}
        `).join('')}
      </div>

      <!-- Step 1: Business Information -->
      <div class="supplier-step" data-supplier-step="1">
        <div class="mb-6 text-center lg:text-left">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">${t('auth.supplierSetup.step1Title')}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">${t('auth.supplierSetup.step1Desc')}</p>
        </div>
        <div class="space-y-4">
          <!-- Seller Type (hidden — default Business) -->
          <input type="hidden" id="ss-seller-type" value="Business" />
          <!-- Business Name -->
          <div>
            <label for="ss-business-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.businessName')}</label>
            <input type="text" id="ss-business-name" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="${t('auth.supplierSetup.businessNamePh')}" required />
          </div>
          <!-- Contact Phone -->
          <div>
            <label for="ss-contact-phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.contactPhone')}</label>
            <input type="tel" id="ss-contact-phone" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="05XX XXX XX XX" required />
            <p id="ss-phone-error" class="text-xs text-red-500 mt-1 hidden"></p>
          </div>
        </div>
      </div>

      <!-- Step 2: Tax & Address -->
      <div class="supplier-step hidden" data-supplier-step="2">
        <div class="mb-6 text-center lg:text-left">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">${t('auth.supplierSetup.step2Title')}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">${t('auth.supplierSetup.step2Desc')}</p>
        </div>
        <div class="space-y-4">
          <!-- Tax ID Type (hidden — default TCKN) -->
          <input type="hidden" id="ss-tax-id-type" value="TCKN" />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Tax ID (VKN) -->
            <div>
              <label for="ss-tax-id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.taxId')}</label>
              <input type="text" id="ss-tax-id" maxlength="11" inputmode="numeric" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="${t('auth.supplierSetup.taxIdPh')}" required />
              <p id="ss-taxid-error" class="text-xs text-red-500 mt-1 hidden"></p>
            </div>
            <!-- Tax Office -->
            <div>
              <label for="ss-tax-office" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.taxOffice')}</label>
              <select id="ss-tax-office" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required>
                <option value="">${t('auth.supplierSetup.selectOption')}</option>
                ${TR_TAX_OFFICES.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            </div>
          </div>
          <!-- Address -->
          <div>
            <label for="ss-address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.address')}</label>
            <input type="text" id="ss-address" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="${t('auth.supplierSetup.addressPh')}" required />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- City (81 il dropdown) -->
            <div>
              <label for="ss-city" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.city')}</label>
              <select id="ss-city" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required>
                <option value="">${t('auth.supplierSetup.selectOption')}</option>
                ${TR_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            <!-- Country (read-only) -->
            <div>
              <label for="ss-country" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.country')}</label>
              <input type="text" id="ss-country" value="Turkey" readonly class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white cursor-not-allowed" />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Bank Information -->
      <div class="supplier-step hidden" data-supplier-step="3">
        <div class="mb-6 text-center lg:text-left">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">${t('auth.supplierSetup.step3Title')}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">${t('auth.supplierSetup.step3Desc')}</p>
        </div>
        <div class="space-y-4">
          <!-- Bank Name -->
          <div>
            <label for="ss-bank-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.bankName')}</label>
            <input type="text" id="ss-bank-name" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="${t('auth.supplierSetup.bankNamePh')}" required />
          </div>
          <!-- IBAN -->
          <div>
            <label for="ss-iban" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.iban')}</label>
            <input type="text" id="ss-iban" maxlength="26" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="TR..." required />
            <p id="ss-iban-error" class="text-xs text-red-500 mt-1 hidden"></p>
            <p id="ss-iban-bank" class="text-xs text-green-600 mt-1 hidden"></p>
          </div>
          <!-- Account Holder Name -->
          <div>
            <label for="ss-account-holder" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.accountHolder')}</label>
            <input type="text" id="ss-account-holder" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="${t('auth.supplierSetup.accountHolderPh')}" required />
          </div>
        </div>
      </div>

      <!-- Step 4: Identity & Agreements -->
      <div class="supplier-step hidden" data-supplier-step="4">
        <div class="mb-6 text-center lg:text-left">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">${t('auth.supplierSetup.step4Title')}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">${t('auth.supplierSetup.step4Desc')}</p>
        </div>
        <div class="space-y-4">
          <!-- Identity Document Type -->
          <div>
            <label for="ss-id-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.idType')}</label>
            <select id="ss-id-type" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" required>
              <option value="">${t('auth.supplierSetup.selectOption')}</option>
              <option value="National ID Card">${t('auth.supplierSetup.nationalId')}</option>
            </select>
          </div>
          <!-- Identity Document Number (TCKN) -->
          <div>
            <label for="ss-id-number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.idNumber')}</label>
            <input type="text" id="ss-id-number" maxlength="11" inputmode="numeric" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="${t('auth.supplierSetup.idNumberPh')}" required />
            <p id="ss-tckn-error" class="text-xs text-red-500 mt-1 hidden"></p>
          </div>
          <!-- Hidden expiry field -->
          <input type="hidden" id="ss-id-expiry" value="" />
          <!-- Identity Document Upload -->
          <div>
            <label for="ss-id-file" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">${t('auth.supplierSetup.idDocument')}</label>
            <div id="ss-file-drop" class="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center hover:border-orange-400 transition-colors cursor-pointer">
              <input type="file" id="ss-id-file" accept=".pdf,.jpg,.jpeg,.png" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <svg class="mx-auto w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
              <p id="ss-file-name" class="text-sm text-gray-500 dark:text-gray-400">${t('auth.supplierSetup.uploadHint')}</p>
            </div>
          </div>

          <!-- Agreements -->
          <div class="space-y-3 pt-2">
            <label class="flex items-start gap-3">
              <input type="checkbox" id="ss-terms" class="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500/20 bg-white dark:bg-gray-800" required />
              <span class="text-sm text-gray-600 dark:text-gray-400">${t('auth.supplierSetup.termsAccept')}</span>
            </label>
            <label class="flex items-start gap-3">
              <input type="checkbox" id="ss-privacy" class="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500/20 bg-white dark:bg-gray-800" required />
              <span class="text-sm text-gray-600 dark:text-gray-400">${t('auth.supplierSetup.privacyAccept')}</span>
            </label>
            <label class="flex items-start gap-3">
              <input type="checkbox" id="ss-kvkk" class="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500/20 bg-white dark:bg-gray-800" required />
              <span class="text-sm text-gray-600 dark:text-gray-400">${t('auth.supplierSetup.kvkkAccept')}</span>
            </label>
            <label class="flex items-start gap-3">
              <input type="checkbox" id="ss-commission" class="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500/20 bg-white dark:bg-gray-800" required />
              <span class="text-sm text-gray-600 dark:text-gray-400">${t('auth.supplierSetup.commissionAccept')}</span>
            </label>
            <label class="flex items-start gap-3">
              <input type="checkbox" id="ss-return" class="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500/20 bg-white dark:bg-gray-800" required />
              <span class="text-sm text-gray-600 dark:text-gray-400">${t('auth.supplierSetup.returnAccept')}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center gap-3 mt-8">
        <button type="button" id="ss-back-btn" class="hidden flex-1 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          ${t('auth.supplierSetup.back')}
        </button>
        <button type="button" id="ss-next-btn" class="flex-1 th-btn th-btn-pill py-3 text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled>
          ${t('auth.supplierSetup.next')}
        </button>
      </div>

      <!-- Error message -->
      <p id="ss-error" class="text-sm text-red-600 mt-3 hidden"></p>
    </div>
  `;
}

/* ── Init Logic ──────────────────────────────────────── */

export function initSupplierSetupForm(options: SupplierSetupFormOptions = {}): void {
  const container = document.getElementById('supplier-setup-form');
  if (!container) return;

  let currentStep = 1;
  let uploadedFileUrl = '';

  // DOM refs
  const steps = container.querySelectorAll<HTMLElement>('.supplier-step');
  const dots = container.querySelectorAll<HTMLElement>('.supplier-step-dot');
  const backBtn = document.getElementById('ss-back-btn') as HTMLButtonElement;
  const nextBtn = document.getElementById('ss-next-btn') as HTMLButtonElement;
  const errorEl = document.getElementById('ss-error');

  // Step 1 fields
  const sellerType = document.getElementById('ss-seller-type') as HTMLSelectElement;
  const businessName = document.getElementById('ss-business-name') as HTMLInputElement;
  const contactPhone = document.getElementById('ss-contact-phone') as HTMLInputElement;

  // Step 2 fields
  const taxIdType = document.getElementById('ss-tax-id-type') as HTMLInputElement;
  const taxId = document.getElementById('ss-tax-id') as HTMLInputElement;
  const taxOffice = document.getElementById('ss-tax-office') as HTMLSelectElement;
  const address = document.getElementById('ss-address') as HTMLInputElement;
  const city = document.getElementById('ss-city') as HTMLSelectElement;
  const country = document.getElementById('ss-country') as HTMLInputElement;

  // Validation error elements
  const phoneError = document.getElementById('ss-phone-error');
  const taxIdError = document.getElementById('ss-taxid-error');
  const ibanError = document.getElementById('ss-iban-error');
  const ibanBank = document.getElementById('ss-iban-bank');
  const tcknError = document.getElementById('ss-tckn-error');

  // Step 3 fields
  const bankName = document.getElementById('ss-bank-name') as HTMLInputElement;
  const iban = document.getElementById('ss-iban') as HTMLInputElement;
  const accountHolder = document.getElementById('ss-account-holder') as HTMLInputElement;

  // Step 4 fields
  const idType = document.getElementById('ss-id-type') as HTMLSelectElement;
  const idNumber = document.getElementById('ss-id-number') as HTMLInputElement;
  const idExpiry = document.getElementById('ss-id-expiry') as HTMLInputElement;
  const fileInput = document.getElementById('ss-id-file') as HTMLInputElement;
  const fileNameEl = document.getElementById('ss-file-name');
  const termsCheck = document.getElementById('ss-terms') as HTMLInputElement;
  const privacyCheck = document.getElementById('ss-privacy') as HTMLInputElement;
  const kvkkCheck = document.getElementById('ss-kvkk') as HTMLInputElement;
  const commissionCheck = document.getElementById('ss-commission') as HTMLInputElement;
  const returnCheck = document.getElementById('ss-return') as HTMLInputElement;

  // ── Helpers ──

  function showStep(step: number) {
    steps.forEach((el, i) => {
      el.classList.toggle('hidden', i + 1 !== step);
    });
    dots.forEach((dot, i) => {
      const s = i + 1;
      dot.classList.toggle('bg-orange-500', s <= step);
      dot.classList.toggle('text-white', s <= step);
      dot.classList.toggle('bg-gray-200', s > step);
      dot.classList.toggle('dark:bg-gray-700', s > step);
      dot.classList.toggle('text-gray-500', s > step);
      dot.classList.toggle('dark:text-gray-400', s > step);
    });
    backBtn.classList.toggle('hidden', step === 1);
    nextBtn.textContent = step === 4 ? t('auth.supplierSetup.submit') : t('auth.supplierSetup.next');
    if (errorEl) errorEl.classList.add('hidden');
    validateCurrentStep();
  }

  function showFieldError(el: HTMLElement | null, msg: string) {
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle('hidden', !msg);
  }

  function validateCurrentStep(): boolean {
    let valid = false;
    switch (currentStep) {
      case 1: {
        const phoneVal = contactPhone.value.replace(/[\s\-\(\)]/g, '');
        const phoneOk = !phoneVal || validatePhone(phoneVal);
        showFieldError(phoneError, phoneVal && !phoneOk ? t('auth.supplierSetup.invalidPhone') : '');
        valid = !!sellerType.value && !!businessName.value.trim() && !!phoneVal && phoneOk;
        break;
      }
      case 2: {
        const tcknVal = taxId.value.replace(/\s/g, '');
        const tcknOk = !tcknVal || validateTCKN(tcknVal);
        showFieldError(taxIdError, tcknVal && !tcknOk ? t('auth.supplierSetup.invalidTCKN') : '');
        valid = !!taxIdType.value && !!tcknVal && tcknOk && !!taxOffice.value
          && !!address.value.trim() && !!city.value && !!country.value.trim();
        break;
      }
      case 3: {
        const ibanVal = iban.value.replace(/\s/g, '');
        const ibanResult = ibanVal.length >= 26 ? validateIBAN(ibanVal) : { valid: false };
        showFieldError(ibanError, ibanVal.length >= 5 && !ibanResult.valid ? t('auth.supplierSetup.invalidIBAN') : '');
        showFieldError(ibanBank, ibanResult.valid && ibanResult.bankName ? ibanResult.bankName : '');
        if (ibanBank) ibanBank.classList.toggle('hidden', !ibanResult.bankName);
        // Auto-fill bank name from IBAN
        if (ibanResult.valid && ibanResult.bankName && bankName) {
          bankName.value = ibanResult.bankName;
        }
        valid = !!bankName.value.trim() && !!ibanVal && ibanResult.valid && !!accountHolder.value.trim();
        break;
      }
      case 4: {
        const tcknVal = idNumber.value.replace(/\s/g, '');
        const tcknOk = !tcknVal || validateTCKN(tcknVal);
        showFieldError(tcknError, tcknVal && !tcknOk ? t('auth.supplierSetup.invalidTCKN') : '');
        valid = !!idType.value && !!tcknVal && tcknOk
          && termsCheck.checked && privacyCheck.checked && kvkkCheck.checked
          && commissionCheck.checked && returnCheck.checked;
        break;
      }
    }
    nextBtn.disabled = !valid;
    return valid;
  }

  function collectData(): SupplierSetupFormData {
    return {
      seller_type: sellerType.value,
      business_name: businessName.value.trim(),
      contact_phone: contactPhone.value.trim(),
      tax_id_type: taxIdType.value,
      tax_id: taxId.value.trim(),
      tax_office: taxOffice.value.trim(),
      address_line_1: address.value.trim(),
      city: city.value.trim(),
      country: country.value.trim(),
      bank_name: bankName.value.trim(),
      iban: iban.value.trim(),
      account_holder_name: accountHolder.value.trim(),
      identity_document_type: idType.value,
      identity_document_number: idNumber.value.trim(),
      identity_document_expiry: idExpiry.value,
      identity_document: uploadedFileUrl,
      terms_accepted: termsCheck.checked,
      privacy_accepted: privacyCheck.checked,
      kvkk_accepted: kvkkCheck.checked,
      commission_accepted: commissionCheck.checked,
      return_policy_accepted: returnCheck.checked,
    };
  }

  // ── File upload ──

  if (fileInput) {
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      if (fileNameEl) fileNameEl.textContent = `${t('common.loading')}...`;

      // Read CSRF token from cookie
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrf_token='))
        ?.split('=')[1] || 'Guest';

      // Upload to Frappe
      const formData = new FormData();
      formData.append('file', file);
      formData.append('is_private', '1');

      try {
        const BASE_URL = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${BASE_URL}/method/upload_file`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'X-Frappe-CSRF-Token': csrfToken,
          },
          body: formData,
        });
        if (res.ok) {
          const json = await res.json();
          uploadedFileUrl = json.message?.file_url || '';
          if (fileNameEl) fileNameEl.textContent = file.name;
        } else {
          uploadedFileUrl = '';
          if (fileNameEl) fileNameEl.textContent = t('auth.supplierSetup.uploadFailed') || 'Yukleme basarisiz. Tekrar deneyin.';
        }
      } catch {
        uploadedFileUrl = '';
        if (fileNameEl) fileNameEl.textContent = t('auth.supplierSetup.uploadFailed') || 'Yukleme basarisiz. Tekrar deneyin.';
      }

      validateCurrentStep();
    });
  }

  // ── Tax office → auto-fill city ──

  taxOffice.addEventListener('change', () => {
    const selectedOffice = taxOffice.value;
    if (selectedOffice) {
      const cityName = getCityForTaxOffice(selectedOffice);
      if (cityName) {
        city.value = cityName;
      }
    }
    validateCurrentStep();
  });

  // ── Event listeners ──

  // Validation on input for all steps
  const allInputs = container.querySelectorAll('input, select');
  allInputs.forEach(el => {
    el.addEventListener('input', () => validateCurrentStep());
    el.addEventListener('change', () => validateCurrentStep());
  });

  // Back button
  backBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  // Next / Submit button
  nextBtn.addEventListener('click', () => {
    if (!validateCurrentStep()) return;

    if (currentStep < 4) {
      currentStep++;
      showStep(currentStep);
    } else {
      // Submit
      if (options.onSubmit) {
        nextBtn.disabled = true;
        nextBtn.textContent = t('common.loading');
        options.onSubmit(collectData());
      }
    }
  });

  // Initial state
  showStep(1);
}
