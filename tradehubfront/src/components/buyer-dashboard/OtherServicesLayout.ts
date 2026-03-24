/**
 * OtherServicesLayout Component
 * "Diğer hizmetlerim" section with sub-navigation:
 * - Esnek ödeme koşulları: 30/60 gün
 * - Ürün denetimi
 */

import { t } from '../../i18n';

type ServiceId = 'payment-terms' | 'product-inspection';

interface ServiceNavItem {
  id: ServiceId;
  label: string;
}

function getServiceNav(): ServiceNavItem[] {
  return [
    { id: 'payment-terms', label: t('otherServices.paymentTermsNav') },
    { id: 'product-inspection', label: t('otherServices.productInspectionNav') },
  ];
}

function getActiveService(): ServiceId {
  const hash = window.location.hash.replace('#', '') as ServiceId;
  if (hash === 'payment-terms' || hash === 'product-inspection') return hash;
  return 'payment-terms';
}

function renderServiceNav(activeId: ServiceId): string {
  const items = getServiceNav().map(
    (item) => {
      const isActive = item.id === activeId;
      const activeClasses = isActive
        ? 'os-nav__item--active bg-blue-50 text-gray-800 font-semibold border-l-blue-600 max-md:border-l-transparent max-md:border-b-blue-600'
        : 'border-l-transparent max-md:border-b-transparent hover:bg-[#fafafa] hover:text-gray-800';
      return `<a href="#${item.id}" class="os-nav__item block py-2.5 px-4 text-[13px] no-underline border-l-[3px] max-md:border-l-0 max-md:border-b-2 max-[480px]:py-2 max-[480px]:px-3 max-[480px]:text-xs transition-all ${activeClasses}" style="color:var(--color-text-muted, #666666)" data-service="${item.id}">${item.label}</a>`;
    }
  ).join('');

  return `
    <div class="w-60 flex-shrink-0 bg-white rounded-lg overflow-hidden max-md:w-full max-md:flex max-md:flex-wrap max-md:items-center max-[480px]:rounded-md">
      <h3 class="text-[15px] font-bold text-gray-800 py-4 px-4 pb-3 m-0 max-md:w-full max-md:py-3 max-md:pb-2 max-[480px]:text-[13px] max-[480px]:py-2.5 max-[480px]:px-3 max-[480px]:pb-1.5">${t('otherServices.title')}</h3>
      ${items}
    </div>
  `;
}

function renderPaymentTerms(): string {
  return `
    <div class="os-content flex-1 min-w-0">
      <div class="bg-white rounded-lg py-12 px-10 text-center max-md:py-8 max-md:px-5 max-[480px]:py-6 max-[480px]:px-3">
        <div class="mb-5 max-[480px]:mb-3">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="inline-block max-[480px]:w-9 max-[480px]:h-9">
            <rect x="6" y="14" width="26" height="20" rx="3" fill="#E5E7EB"/>
            <rect x="8" y="16" width="22" height="16" rx="2" fill="#F3F4F6"/>
            <path d="M10 22h18M10 26h12" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M32 12c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v6" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/>
            <path d="M30 18h12v4c0 1-1 2-2.5 3L36 27l-3.5-2c-1.5-1-2.5-2-2.5-3v-4z" fill="#6B7280"/>
            <circle cx="36" cy="22" r="1.5" fill="white"/>
            <path d="M34.5 18v-2M37.5 18v-2" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-800 mb-2 max-[480px]:text-base max-[360px]:text-[15px]">${t('otherServices.paymentTermsTitle')}</h1>
        <p class="text-sm mb-8 max-[480px]:text-xs max-[480px]:mb-5 max-[480px]:leading-relaxed" style="color:var(--color-text-muted, #666666)">${t('otherServices.terminationDate')} <strong class="text-gray-800">${t('otherServices.terminationDateValue')}</strong> ${t('otherServices.terminationDateNote')}</p>

        <div class="max-w-[760px] mx-auto text-left bg-white border border-gray-200 rounded-lg p-8 max-md:p-5 max-[480px]:p-3.5 max-[360px]:p-3">
          <p class="text-sm mb-4 max-[480px]:text-xs max-[480px]:mb-3" style="color:var(--color-text-body, #333333)">${t('otherServices.ptDearBuyers')}</p>

          <p class="text-sm leading-[1.7] mb-4 max-[480px]:text-xs max-[480px]:leading-[1.6] max-[480px]:mb-3" style="color:var(--color-text-body, #333333)">
            ${t('otherServices.ptParagraph1')}
          </p>

          <p class="text-sm leading-[1.7] mb-4 max-[480px]:text-xs max-[480px]:leading-[1.6] max-[480px]:mb-3" style="color:var(--color-text-body, #333333)">
            ${t('otherServices.ptParagraph2')}
          </p>

          <p class="text-sm leading-[1.7] mb-4 max-[480px]:text-xs max-[480px]:leading-[1.6] max-[480px]:mb-3" style="color:var(--color-text-body, #333333)">${t('otherServices.ptParagraph3')}</p>

          <div class="mt-6 text-sm leading-relaxed max-[480px]:mt-4 max-[480px]:text-xs" style="color:var(--color-text-body, #333333)">
            <p class="m-0">${t('otherServices.ptRegards')}</p>
            <p class="m-0">${t('otherServices.ptTeam')}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProductInspection(): string {
  return `
    <div class="os-content flex-1 min-w-0">
      <div class="bg-white rounded-lg py-12 px-10 text-center max-md:py-8 max-md:px-5 max-[480px]:py-6 max-[480px]:px-3">
        <div class="mb-5 max-[480px]:mb-3">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="inline-block max-[480px]:w-9 max-[480px]:h-9">
            <rect x="10" y="6" width="28" height="36" rx="3" stroke="#6B7280" stroke-width="2" fill="none"/>
            <path d="M18 16h12M18 22h12M18 28h8" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
            <circle cx="36" cy="36" r="8" fill="#F3F4F6" stroke="#6B7280" stroke-width="2"/>
            <path d="M33 36l2 2 4-4" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-800 mb-2 max-[480px]:text-base max-[360px]:text-[15px]">${t('otherServices.piTitle')}</h1>
        <p class="text-sm mb-8 max-[480px]:text-xs max-[480px]:mb-5 max-[480px]:leading-relaxed" style="color:var(--color-text-muted, #666666)">${t('otherServices.piSubtitle')}</p>

        <div class="max-w-[760px] mx-auto text-left bg-white border border-gray-200 rounded-lg p-8 max-md:p-5 max-[480px]:p-3.5 max-[360px]:p-3">
          <p class="text-sm mb-4 max-[480px]:text-xs max-[480px]:mb-3" style="color:var(--color-text-body, #333333)">${t('otherServices.piDearBuyers')}</p>
          <p class="text-sm leading-[1.7] mb-4 max-[480px]:text-xs max-[480px]:leading-[1.6] max-[480px]:mb-3" style="color:var(--color-text-body, #333333)">
            ${t('otherServices.piParagraph1')}
          </p>
          <p class="text-sm leading-[1.7] mb-4 max-[480px]:text-xs max-[480px]:leading-[1.6] max-[480px]:mb-3" style="color:var(--color-text-body, #333333)">
            ${t('otherServices.piParagraph2')}
          </p>
          <div class="mt-6 text-sm leading-relaxed max-[480px]:mt-4 max-[480px]:text-xs" style="color:var(--color-text-body, #333333)">
            <p class="m-0">${t('otherServices.piRegards')}</p>
            <p class="m-0">${t('otherServices.piTeam')}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

const SERVICE_RENDERERS: Record<ServiceId, () => string> = {
  'payment-terms': renderPaymentTerms,
  'product-inspection': renderProductInspection,
};

export function OtherServicesLayout(): string {
  const activeId = getActiveService();

  return `
    <div class="flex gap-6 py-4 items-start max-md:flex-col max-md:gap-4 max-[480px]:gap-2.5 max-[480px]:py-2">
      ${renderServiceNav(activeId)}
      ${SERVICE_RENDERERS[activeId]()}
    </div>
  `;
}

export function initOtherServicesLayout(): void {
  const navItems = document.querySelectorAll<HTMLAnchorElement>('.os-nav__item');
  if (!navItems.length) return;

  function navigate(): void {
    const activeId = getActiveService();
    const contentEl = document.querySelector('.os-content');
    if (contentEl) {
      contentEl.outerHTML = SERVICE_RENDERERS[activeId]();
    }

    // Update nav active state
    document.querySelectorAll('.os-nav__item').forEach((link) => {
      const service = link.getAttribute('data-service');
      const isActive = service === activeId;
      link.classList.toggle('os-nav__item--active', isActive);
      link.classList.toggle('bg-blue-50', isActive);
      link.classList.toggle('font-semibold', isActive);
      link.classList.toggle('border-l-blue-600', isActive);
      link.classList.toggle('border-l-transparent', !isActive);
    });
  }

  window.addEventListener('hashchange', navigate);
}
