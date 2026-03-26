/**
 * Seller utilities — centralised routing for seller store/panel access.
 */

import type { AuthUser } from './auth';

const SELLER_PANEL_URL = import.meta.env.VITE_SELLER_PANEL_URL || 'http://localhost:8082/';

/**
 * Returns the URL a seller should be taken to based on their status.
 *
 *   - Approved + active profile → seller admin panel (8082)
 *   - All others → application-pending page
 */
export function getSellerStoreUrl(user: AuthUser): string {
  if (user.has_seller_profile) return SELLER_PANEL_URL;
  return '/pages/seller/application-pending.html';
}
