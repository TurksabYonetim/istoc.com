/**
 * BuyerDashboardLayout Component
 * 3-column layout orchestrator: Sidebar (260px) | Center (flex-1) | Right Panel (~380px)
 * Max-width 1425px centered, page bg #F5F5F5, 14px gap.
 */

import type { BuyerDashboardData } from '../../types/buyerDashboard';
import { t } from '../../i18n';
import { NewBuyerInfo, initNewBuyerInfo } from './NewBuyerInfo';
import { OrdersSection, initOrdersSection } from './OrdersSection';
import { initOperationSlider } from './OperationSlider';
import { FavoritesSection } from '../right-panel/FavoritesSection';
import { BrowsingHistorySection } from '../right-panel/BrowsingHistorySection';
import { PromotionSection, initPromotionSection } from '../right-panel/PromotionSection';
import { getBrowsingHistory } from '../../services/browsingHistoryService';

export interface BuyerDashboardLayoutProps {
  data: BuyerDashboardData;
  emailVerified?: boolean;
}

export function BuyerDashboardLayout({ data, emailVerified = true }: BuyerDashboardLayoutProps): string {
  const emailBanner = !emailVerified
    ? `<div class="sc-email-verification-banner w-full bg-[#FFF3E0] border border-[#FFE0B2] rounded-lg px-4 py-3 flex items-center gap-3 text-sm text-[#E65100] mb-4 max-sm:flex-col max-sm:gap-2 max-sm:text-xs max-sm:px-3">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="flex-shrink-0">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 11a1 1 0 110-2 1 1 0 010 2zm1-4H9V6h2v3z" fill="#E65100"/>
        </svg>
        <span>${t('dashboard.emailVerification')}</span>
        <a href="/verify-email" class="ml-auto text-[#E65100] font-semibold hover:underline whitespace-nowrap">${t('dashboard.verify')}</a>
      </div>`
    : '';

  return `
    <div class="sc-buyer-dashboard bg-[#F5F5F5]">
      <div class="max-w-[1425px] mx-auto px-[clamp(0.25rem,0.2rem+0.4vw,1rem)] py-4 max-sm:py-3">
        ${emailBanner}
        <div class="flex gap-[clamp(0.5rem,0.4rem+0.4vw,0.875rem)] items-start max-lg:flex-col max-lg:items-stretch">
          <!-- Center Column -->
          <div class="flex-1 min-w-0 flex flex-col gap-[clamp(0.5rem,0.4rem+0.4vw,0.875rem)] max-lg:w-full">
            ${NewBuyerInfo({ user: data.user, stats: data.stats, notifications: data.notifications })}
            ${OrdersSection()}
          </div>

          <!-- Right Panel -->
          <div class="w-[380px] max-xl:w-[300px] max-lg:w-full flex-shrink-0 flex flex-col gap-[clamp(0.5rem,0.4rem+0.4vw,0.875rem)]">
            ${FavoritesSection()}
            ${BrowsingHistorySection(getBrowsingHistory().map(h => ({
              id: h.id,
              image: h.image,
              price: h.price ?? 0,
              currency: h.currency ?? '$',
              minOrder: h.minOrder ?? '',
              href: h.href,
            })))}
            ${PromotionSection(data.promotions)}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize all BuyerDashboardLayout interactive behaviors.
 */
export function initBuyerDashboardLayout(): void {
  initNewBuyerInfo();
  initOperationSlider();
  initOrdersSection();
  initPromotionSection();
}
