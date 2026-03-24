/**
 * Sidebar Data — Menu structure and section definitions
 * 4 sections + bottom discover link, following SidebarSection/SidebarMenuItem types
 * All labels use i18n translation keys resolved via t() at render time.
 */

import type { SidebarSection, SidebarMenuItem } from '../../types/buyerDashboard';
import { t } from '../../i18n';

/* ════════════════════════════════════════════════════
   MENU SECTIONS
   ════════════════════════════════════════════════════ */

/**
 * Returns sidebar sections with translated labels.
 * Must be called at render time (not at module scope) so that
 * the current language is used for every render.
 */
export function getSidebarSections(): SidebarSection[] {
  return [
    /* ──── Dashboard (standalone) ──── */
    {
      items: [
        {
          id: 'dashboard',
          label: t('dashboard.myDashboard'),
          icon: 'dashboard',
          href: '/pages/dashboard/buyer-dashboard.html',
        },
      ],
    },

    /* ──── Online Trading ──── */
    {
      title: t('dashboard.onlineTrading'),
      items: [
        {
          id: 'messages',
          label: t('dashboard.myMessages'),
          icon: 'messages',
          href: '/pages/dashboard/messages.html',
          submenu: [
            { label: t('dashboard.supplierMessages'), href: '/pages/dashboard/messages.html' },
            { label: t('dashboard.rfqInquiries'), href: '/pages/dashboard/inquiries.html' },
            { label: t('dashboard.myContacts'), href: '/pages/dashboard/contacts.html' },
          ],
        },
        {
          id: 'orders',
          label: t('dashboard.myOrders'),
          icon: 'orders',
          href: '/pages/dashboard/orders.html',
          submenu: [
            { label: t('dashboard.allOrders'), href: '/pages/dashboard/orders.html' },
            { label: t('dashboard.refundsAfterSales'), href: '/pages/dashboard/orders.html#refunds' },
            { label: t('dashboard.myReviews'), href: '/pages/dashboard/orders.html#reviews' },
            { label: t('dashboard.couponsCredits'), href: '/pages/dashboard/orders.html#coupons' },
            { label: t('dashboard.taxInfo'), href: '/pages/dashboard/orders.html#tax-info' },
          ],
        },
        {
          id: 'payment',
          label: t('dashboard.payment'),
          icon: 'payment',
          href: '/pages/dashboard/payment.html',
          submenu: [
            { label: t('dashboard.paymentManagement'), href: '/pages/dashboard/payment.html#payment-management', group: t('sidebar.groupSummary') },
            { label: t('dashboard.transactions'), href: '/pages/dashboard/payment.html#transactions', group: t('sidebar.groupSummary') },
            { label: t('dashboard.bankAccounts'), href: '/pages/dashboard/payment.html#tt-accounts', group: 'T/T' },
            { label: t('dashboard.wireTransfer'), href: '/pages/dashboard/payment.html#tt-tracking', group: 'T/T' },
            { label: t('dashboard.istocCard'), href: '/pages/dashboard/payment.html#alibaba-card', group: t('sidebar.groupAdditionalServices') },
            { label: t('dashboard.payLater'), href: '/pages/dashboard/payment.html#pay-later', group: t('sidebar.groupAdditionalServices') },
          ],
        },
        {
          id: 'saved',
          label: t('dashboard.savedHistory'),
          icon: 'saved',
          href: '/pages/dashboard/favorites.html',
          submenu: [
            { label: t('dashboard.myFavorites'), href: '/pages/dashboard/favorites.html#favorites' },
            { label: t('dashboard.browsingHistory'), href: '/pages/dashboard/favorites.html#browsing-history' },
          ],
        },
      ],
    },

    /* ──── Value-added Services ──── */
    {
      title: t('dashboard.valueAddedServices'),
      items: [
        {
          id: 'subscription',
          label: t('dashboard.subscription'),
          icon: 'subscription',
          href: '/pages/dashboard/subscription.html',
          badge: 'New',
        },
        {
          id: 'logistics',
          label: t('dashboard.logisticsServices'),
          icon: 'logistics',
          href: '/pages/dashboard/logistics.html',
          submenu: [
            { label: t('dashboard.logisticsOrders'), href: '/pages/dashboard/logistics.html#orders' },
            { label: t('dashboard.logisticsReviews'), href: '/pages/dashboard/logistics.html#reviews' },
          ],
        },
        {
          id: 'dropshipping',
          label: t('dashboard.dropshipping'),
          icon: 'dropshipping',
          href: '/pages/dashboard/dropshipping.html',
          submenu: [
            { label: t('dashboard.findProducts'), href: '/pages/dashboard/dropshipping.html#find-products' },
            { label: t('dashboard.manageOrders'), href: '/pages/dashboard/dropshipping.html#manage-orders' },
          ],
        },
        {
          id: 'other-services',
          label: t('dashboard.otherServices'),
          icon: 'otherServices',
          href: '/pages/dashboard/buyer-dashboard.html#payment-terms',
          submenu: [
            { label: t('dashboard.flexiblePayment'), href: '/pages/dashboard/buyer-dashboard.html#payment-terms' },
            { label: t('dashboard.productInspection'), href: '/pages/dashboard/buyer-dashboard.html#product-inspection' },
          ],
        },
      ],
    },

    /* ──── Settings ──── */
    {
      title: t('dashboard.settings'),
      items: [
        {
          id: 'settings',
          label: t('dashboard.accountSettings'),
          icon: 'settings',
          href: '/pages/dashboard/settings.html',
        },
      ],
    },
  ];
}

/* ──── Bottom sticky discover link ──── */

export function getDiscoverItem(): SidebarMenuItem {
  return {
    id: 'discover',
    label: t('dashboard.exploreSellerSite'),
    icon: 'discover',
    href: '#discover',
  };
}

/**
 * @deprecated Use getSidebarSections() instead. Kept for backward compatibility.
 */
export const sidebarSections: SidebarSection[] = getSidebarSections();

/**
 * @deprecated Use getDiscoverItem() instead. Kept for backward compatibility.
 */
export const discoverItem: SidebarMenuItem = getDiscoverItem();
