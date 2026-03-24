/**
 * Orders Section — Static Data Configuration
 * Tab items and dropdown filter items with translated labels.
 * Wrapped in getter functions so t() is called at render time.
 */

import type { OrdersTabItem, OrdersFilterItem } from '../../types/buyerDashboard';
import { t } from '../../i18n';

export function getOrderTabs(): OrdersTabItem[] {
  return [
    { id: 'delivery', label: t('dashboard.orderTabs.delivery') },
    { id: 'refunds', label: t('dashboard.orderTabs.refunds') },
    { id: 'completed', label: t('dashboard.orderTabs.completedReview'), hasDropdown: true },
  ];
}

export function getOrderFilters(): OrdersFilterItem[] {
  return [
    { id: 'all', label: t('dashboard.orderFilters.all'), selected: true },
    { id: 'pending-review', label: t('dashboard.orderFilters.pendingReview') },
    { id: 'reviewed', label: t('dashboard.orderFilters.reviewed') },
    { id: 'completed', label: t('dashboard.orderFilters.completed') },
    { id: 'cancelled', label: t('dashboard.orderFilters.cancelled') },
    { id: 'closed', label: t('dashboard.orderFilters.closed') },
    { id: 'archived', label: t('dashboard.orderFilters.archived') },
  ];
}
