/**
 * Seller utilities — centralised routing for seller store/panel access.
 *
 * When the seller admin panel is built, update this single function
 * to redirect Approved sellers to the panel URL instead.
 */

import type { AuthUser } from './auth';

// TODO: uncomment when seller admin panel is ready
// const SELLER_PANEL_URL = import.meta.env.VITE_SELLER_PANEL_URL || '/seller-panel/';

/**
 * Returns the URL a seller should be taken to based on their application status.
 *
 * Current behaviour:
 *   - All statuses → application-pending page (shows dynamic status)
 *
 * Future behaviour (when admin panel is ready):
 *   - Approved + active profile → seller admin panel
 *   - All others → application-pending page
 */
export function getSellerStoreUrl(_user: AuthUser): string {
  // TODO: when seller admin panel is built, uncomment:
  // if (user.has_seller_profile) return SELLER_PANEL_URL;
  return '/pages/seller/application-pending.html';
}
