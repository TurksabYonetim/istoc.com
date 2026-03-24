/**
 * SubscriptionLayout Component
 * Two views: main dashboard (AI Modu overview + invoice history)
 * and plan selection (pricing cards + FAQ).
 */

import { formatPrice } from '../../utils/currency';
import { t } from '../../i18n';

/* ────────────────────────────────────────
   EMPTY RECEIPT ICON
   ──────────────────────────────────────── */
const EMPTY_INVOICE_ICON = `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
  <rect x="10" y="4" width="28" height="36" rx="3" fill="#E5E7EB" stroke="#D1D5DB" stroke-width="1"/>
  <rect x="16" y="12" width="16" height="2.5" rx="1.25" fill="#D1D5DB"/>
  <rect x="16" y="18" width="12" height="2.5" rx="1.25" fill="#D1D5DB"/>
  <rect x="16" y="24" width="14" height="2.5" rx="1.25" fill="#D1D5DB"/>
  <path d="M10 40l3-2.5 3 2.5 3-2.5 3 2.5 3-2.5 3 2.5 3-2.5 3 2.5V4H10v36z" fill="#E5E7EB"/>
</svg>`;

/* ────────────────────────────────────────
   PLAN DATA
   ──────────────────────────────────────── */
interface PlanFeature {
  icon: 'sparkle' | 'check';
  text: string;
  bold?: string;
}

interface Plan {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  yearlyTotal: string;
  billingNote?: string;
  popular?: boolean;
  currentPlan?: boolean;
  features: PlanFeature[];
}

function getPlans(): Plan[] {
  return [
    {
      name: 'Free',
      monthlyPrice: '$0.00',
      yearlyPrice: '$0.00',
      yearlyTotal: '',
      currentPlan: true,
      features: [
        { icon: 'sparkle', text: t('subscription.aiQueryRight'), bold: `3 ${t('subscription.perDay')}` },
        { icon: 'check', text: t('subscription.unlimitedQueries') },
        { icon: 'check', text: t('subscription.standardSpeed') },
      ],
    },
    {
      name: 'Starter',
      monthlyPrice: '$9.9',
      yearlyPrice: '$4.95',
      yearlyTotal: t('subscription.yearlyTotalStarter'),
      billingNote: t('subscription.billedMonthly'),
      features: [
        { icon: 'sparkle', text: t('subscription.aiModeTask'), bold: `200 ${t('subscription.perMonthCount')}` },
        { icon: 'check', text: t('subscription.unlimitedQueries') },
        { icon: 'check', text: t('subscription.fasterSpeed') },
        { icon: 'check', text: t('subscription.partnerDataAccess') },
        { icon: 'check', text: t('subscription.productDesign') },
        { icon: 'check', text: t('subscription.trendAnalysis') },
        { icon: 'check', text: t('subscription.prioritySupport') },
      ],
    },
    {
      name: 'Pro',
      monthlyPrice: '$19.9',
      yearlyPrice: '$9.95',
      yearlyTotal: t('subscription.yearlyTotalPro'),
      billingNote: t('subscription.billedMonthly'),
      popular: true,
      features: [
        { icon: 'sparkle', text: t('subscription.aiModeTask'), bold: `400 ${t('subscription.perMonthCount')}` },
        { icon: 'check', text: t('subscription.unlimitedQueries') },
        { icon: 'check', text: t('subscription.premiumSpeed') },
        { icon: 'check', text: t('subscription.partnerDataAccess') },
        { icon: 'check', text: t('subscription.productDesign') },
        { icon: 'check', text: t('subscription.trendAnalysis') },
        { icon: 'check', text: t('subscription.earlyAccess') },
        { icon: 'check', text: t('subscription.prioritySupport') },
      ],
    },
  ];
}

function getFaqItems(): { q: string; a: string }[] {
  return [
    { q: t('subscription.faqChargeToday'), a: t('subscription.faqChargeTodayA') },
    { q: t('subscription.faqBilling'), a: t('subscription.faqBillingA') },
    { q: t('subscription.faqChangePlan'), a: t('subscription.faqChangePlanA') },
    { q: t('subscription.faqCancel'), a: t('subscription.faqCancelA') },
  ];
}

/* ────────────────────────────────────────
   SVG ICONS
   ──────────────────────────────────────── */
const SPARKLE_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5L8 1z" stroke="#F97316" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
const CHECK_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.5 3.5L13 5" stroke="#222" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ────────────────────────────────────────
   VIEW RENDERERS
   ──────────────────────────────────────── */

function renderMainView(): string {
  return `
    <!-- Header -->
    <div class="flex items-center justify-between px-7 max-sm:px-3 pt-6 pb-5 max-sm:flex-col max-sm:items-start max-sm:gap-3">
      <h1 class="text-[20px] font-bold text-gray-900">${t('subscription.aiMode')}</h1>
      <button class="px-5 max-sm:px-4 py-2 max-sm:py-1.5 text-[14px] max-sm:text-[13px] text-gray-700 bg-white border border-gray-300 rounded-full cursor-pointer hover:border-gray-400 transition-colors" id="sub-manage-btn">${t('subscription.managePlan')}</button>
    </div>

    <!-- Current Plan Card -->
    <div class="mx-7 max-sm:mx-3 border border-border-default rounded-[10px] overflow-hidden">
      <div class="flex items-center justify-between px-6 pt-6 pb-5 max-md:flex-col max-md:items-start max-md:gap-3">
        <span class="text-[22px] max-sm:text-[18px] font-bold text-gray-900">${t('subscription.currentPlanFree')}</span>
        <div class="flex items-center gap-3 text-[14px] text-gray-500 border border-border-default rounded-lg px-4 py-2.5">
          <span>${t('subscription.aiModeTasks')}</span>
          <span class="text-[18px] font-bold text-gray-900">3</span>
        </div>
      </div>
      <div class="flex items-center justify-between px-6 py-3.5 bg-primary-50 text-[14px] text-gray-700 max-md:flex-col max-md:items-start max-md:gap-3">
        <span>${t('subscription.tryBeforeUpgrade')}</span>
        <button class="th-btn-dark th-btn-pill whitespace-nowrap max-sm:!py-2 max-sm:!px-4 max-sm:!text-[13px]" id="sub-try-btn">${t('subscription.tryAiModeFree')}</button>
      </div>
    </div>

    <!-- Invoice History -->
    <h2 class="text-[18px] font-bold text-gray-900 px-7 max-sm:px-3 pt-7 pb-4">${t('subscription.invoiceHistory')}</h2>
    <div class="px-7 max-sm:px-3 pb-7">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-4 py-3 border-b border-border-default bg-surface-muted">${t('subscription.thDate')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-4 py-3 border-b border-border-default bg-surface-muted">${t('subscription.thDescription')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-4 py-3 border-b border-border-default bg-surface-muted">${t('subscription.thPaymentMethod')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-4 py-3 border-b border-border-default bg-surface-muted">${t('subscription.thStatus')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-4 py-3 border-b border-border-default bg-surface-muted">${t('subscription.thAmount')}</th>
            <th class="text-left text-[13px] font-semibold text-gray-500 px-4 py-3 border-b border-border-default bg-surface-muted">${t('subscription.thAction')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6" class="text-center py-[60px] px-4 text-gray-400 text-[14px]">
              <div class="flex justify-center mb-3">${EMPTY_INVOICE_ICON}</div>
              <p class="m-0">${t('subscription.noInvoices')}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderFeatureItem(f: PlanFeature): string {
  const icon = f.icon === 'sparkle' ? SPARKLE_ICON : CHECK_ICON;
  const text = f.bold ? `${f.bold} ${f.text}` : f.text;
  return `<li class="flex items-start gap-2 text-[14px] max-sm:text-[13px] text-gray-700"><span class="shrink-0 w-4 h-4 mt-0.5 flex items-center justify-center">${icon}</span><span>${text}</span></li>`;
}

function renderPlanCard(plan: Plan, isYearly: boolean): string {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const billing = isYearly && plan.yearlyTotal ? plan.yearlyTotal : (plan.billingNote ?? '');
  const popularBadge = plan.popular ? `<span class="text-[12px] font-semibold text-primary-500 bg-primary-50 px-2.5 py-0.5 rounded-[10px]">${t('subscription.popular')}</span>` : '';
  const borderClass = plan.popular ? 'border-2 border-primary-500' : 'border border-border-default';

  let btnHtml: string;
  if (plan.currentPlan) {
    btnHtml = `<button class="w-full py-3 max-sm:py-2 px-5 text-[14px] max-sm:text-[13px] font-semibold rounded-full bg-gray-200 text-gray-400 cursor-default" disabled>${t('subscription.currentPlan')}</button>`;
  } else if (plan.popular) {
    btnHtml = `<button class="w-full th-btn th-btn-pill max-sm:!py-2 max-sm:!px-4 max-sm:!text-[13px]">${t('subscription.startFreeTrial')}</button>`;
  } else {
    btnHtml = `<button class="w-full th-btn-dark th-btn-pill max-sm:!py-2 max-sm:!px-4 max-sm:!text-[13px]">${t('subscription.startFreeTrial')}</button>`;
  }

  return `
    <div class="${borderClass} rounded-[10px] p-7 max-sm:p-5 flex flex-col">
      <div class="mb-5 max-sm:mb-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-[18px] font-bold text-gray-900">${plan.name}</h3>
          ${popularBadge}
        </div>
        <div class="mb-1 flex items-baseline flex-wrap gap-x-1">
          <span class="text-[28px] max-sm:text-[24px] font-bold text-gray-900">${formatPrice(price)}</span>
          <span class="text-[14px] text-gray-400">${t('subscription.perMonth')}</span>
        </div>
        ${billing ? `<p class="text-[13px] text-gray-400 m-0">${billing}</p>` : ''}
      </div>
      <div class="mb-6 max-sm:mb-4">
        ${btnHtml}
      </div>
      <ul class="list-none p-0 m-0 flex flex-col gap-3 max-sm:gap-2.5 border-t border-gray-100 pt-5 max-sm:pt-4">
        ${plan.features.map(f => renderFeatureItem(f)).join('')}
      </ul>
    </div>
  `;
}

function renderPricingView(): string {
  const cards = getPlans().map(p => renderPlanCard(p, false)).join('');
  const faqItems = getFaqItems().map(item => `
    <details class="border-b border-gray-100 py-4 max-sm:py-3 group">
      <summary class="text-[14px] max-sm:text-[13px] font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center gap-3 after:content-['▾'] after:text-[16px] after:text-gray-400 after:transition-transform after:duration-200 after:shrink-0 group-open:after:rotate-180">${item.q}</summary>
      <p class="pt-3 max-sm:pt-2 pb-1 text-[13px] max-sm:text-[12px] text-gray-500 leading-relaxed m-0">${item.a}</p>
    </details>
  `).join('');

  return `
    <!-- Back + Title -->
    <div class="px-7 max-sm:px-3 pt-6 pb-2">
      <button class="bg-transparent border-none cursor-pointer p-1 mb-3 flex items-center rounded hover:bg-gray-100 transition-colors" id="sub-back-btn" aria-label="${t('subscription.backBtn')}">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4l-6 6 6 6" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <h1 class="text-[18px] font-bold text-gray-900 text-center">${t('subscription.pricingTitle')}</h1>
    </div>

    <!-- Billing Toggle -->
    <div class="flex justify-center my-5 mb-7" id="sub-billing-toggle">
      <button class="sub-billing-toggle__btn sub-billing-toggle__btn--active px-7 max-sm:px-4 py-2.5 max-sm:py-2 text-[14px] max-sm:text-[13px] bg-white border border-border-default cursor-pointer transition-all rounded-l-full border-r-0" data-billing="monthly">${t('subscription.monthly')}</button>
      <button class="sub-billing-toggle__btn px-7 max-sm:px-4 py-2.5 max-sm:py-2 text-[14px] max-sm:text-[13px] text-gray-500 bg-white border border-border-default cursor-pointer transition-all rounded-r-full" data-billing="yearly">${t('subscription.yearly')} <span class="text-primary-500 font-semibold ml-1">${t('subscription.yearlySaving')}</span></button>
    </div>

    <!-- Pricing Cards -->
    <div class="grid grid-cols-3 max-2xl:grid-cols-1 gap-5 max-2xl:gap-4 px-7 max-sm:px-3 pb-8 max-2xl:max-w-lg max-2xl:mx-auto" id="sub-pricing-grid">
      ${cards}
    </div>

    <!-- FAQ -->
    <div class="px-7 max-sm:px-3 pb-7 max-sm:pb-5 border-t border-gray-100 mt-2">
      <div class="flex items-center justify-between py-5 max-sm:py-4 pb-3 max-sm:pb-2">
        <h2 class="text-[16px] max-sm:text-[15px] font-bold text-gray-900">${t('subscription.faqTitle')}</h2>
        <a href="#" class="flex items-center gap-1.5 text-[13px] max-sm:text-[12px] text-gray-500 no-underline hover:text-gray-900 transition-colors shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="max-sm:w-3.5 max-sm:h-3.5"><circle cx="8" cy="8" r="7" stroke="#666" stroke-width="1.2"/><path d="M6.5 6.5a1.5 1.5 0 113 0c0 .83-.67 1-1.5 1.5M8 11.5h.01" stroke="#666" stroke-width="1.2" stroke-linecap="round"/></svg>
          ${t('subscription.getHelp')}
        </a>
      </div>
      ${faqItems}
    </div>
  `;
}

/* ────────────────────────────────────────
   MAIN LAYOUT
   ──────────────────────────────────────── */
export function SubscriptionLayout(): string {
  return `
    <div class="bg-white rounded-lg min-h-[600px]" id="sub-content">
      ${renderMainView()}
    </div>
  `;
}

/* ────────────────────────────────────────
   INIT
   ──────────────────────────────────────── */
export function initSubscriptionLayout(): void {
  const contentEl = document.getElementById('sub-content');
  if (!contentEl) return;

  function showMain(): void {
    contentEl!.innerHTML = renderMainView();
    bindMainEvents();
  }

  function showPricing(): void {
    contentEl!.innerHTML = renderPricingView();
    bindPricingEvents();
  }

  function bindMainEvents(): void {
    document.getElementById('sub-manage-btn')?.addEventListener('click', showPricing);
    document.getElementById('sub-try-btn')?.addEventListener('click', showPricing);
  }

  function bindPricingEvents(): void {
    // Back button
    document.getElementById('sub-back-btn')?.addEventListener('click', showMain);

    // Billing toggle
    const toggleBtns = document.querySelectorAll<HTMLButtonElement>('.sub-billing-toggle__btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const isYearly = btn.dataset.billing === 'yearly';
        toggleBtns.forEach(b => {
          b.classList.remove('sub-billing-toggle__btn--active');
          b.classList.remove('bg-gray-100', 'text-gray-900', 'font-semibold');
          b.classList.add('text-gray-500');
        });
        btn.classList.add('sub-billing-toggle__btn--active');
        btn.classList.remove('text-gray-500');
        btn.classList.add('bg-gray-100', 'text-gray-900', 'font-semibold');

        // Re-render pricing cards
        const grid = document.getElementById('sub-pricing-grid');
        if (grid) {
          grid.innerHTML = getPlans().map(p => renderPlanCard(p, isYearly)).join('');
        }
      });
    });
  }

  // Init main view events
  bindMainEvents();
}
