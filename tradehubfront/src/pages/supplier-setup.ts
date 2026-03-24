/**
 * Supplier Setup Page — Entry Point
 * Standalone 4-step supplier application form for existing buyers
 * who want to become sellers.
 *
 * Requires login. Reads seller_application from session or creates one.
 */

import '../style.css'
import { getBaseUrl } from '../components/auth/AuthLayout'
import { getSessionUser, becomeSeller, completeRegistrationApplication } from '../utils/auth'
import { SupplierSetupForm, initSupplierSetupForm } from '../components/auth/SupplierSetupForm'
import type { SupplierSetupFormData } from '../components/auth/SupplierSetupForm'
import { t } from '../i18n'
import { startAlpine } from '../alpine'

async function init() {
  const appEl = document.querySelector<HTMLDivElement>('#app')!;
  const baseUrl = getBaseUrl();

  // Must be logged in
  const user = await getSessionUser();
  if (!user) {
    window.location.replace('/pages/auth/login.html');
    return;
  }

  // Already has a completed application (not Draft) → go to pending page
  if (user.seller_application_status && user.seller_application_status !== 'Draft') {
    window.location.href = '/pages/seller/application-pending.html';
    return;
  }

  // Create Seller Application if not exists (Draft)
  const result = await becomeSeller();
  const sellerApplication = result.seller_application;

  // Render page with form
  appEl.innerHTML = `
    <div>
      <header class="bg-white border-b-2" style="border-color: var(--auth-header-border, #FF6600)">
        <div class="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <a href="${baseUrl}" aria-label="iSTOC Ana Sayfa">
            <img src="${baseUrl}images/istoc-logo.png" alt="iSTOC" class="h-7" />
          </a>
        </div>
      </header>
      <div class="min-h-[calc(100vh-58px)] bg-gray-100 flex items-start justify-center pt-8 sm:pt-12 pb-12 px-2 sm:px-4">
        <div class="w-full max-w-xl bg-white rounded-xl shadow-sm p-5 sm:p-8 md:p-12">
          <h1 class="text-2xl font-bold text-gray-900 text-center mb-2">${t('auth.supplierSetup.title')}</h1>
          <p class="text-sm text-gray-500 text-center mb-6">${t('auth.supplierSetup.subtitle')}</p>
          <div id="supplier-form-container">
            ${SupplierSetupForm()}
          </div>
        </div>
      </div>
    </div>
  `;

  startAlpine();

  // Initialize form with submit handler
  initSupplierSetupForm({
    onSubmit: async (formData: SupplierSetupFormData) => {
      try {
        await completeRegistrationApplication({
          seller_application: sellerApplication,
          ...formData,
        });
        window.location.href = '/pages/seller/application-pending.html';
      } catch (err) {
        const msg = err instanceof Error ? err.message : t('common.error');
        // Show error inline
        const btn = document.getElementById('ss-next-btn') as HTMLButtonElement | null;
        if (btn) {
          btn.disabled = false;
          btn.textContent = t('auth.supplierSetup.submit');
        }
        alert(msg);
      }
    }
  });
}

init();
