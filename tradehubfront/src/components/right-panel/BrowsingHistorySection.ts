/**
 * BrowsingHistorySection Component
 * Horizontal scrollable product cards with hidden scrollbar.
 */

import type { BrowsingHistoryProduct } from '../../types/buyerDashboard';
import { SectionCard } from '../shared/SectionCard';
import { SectionHeader } from '../shared/SectionHeader';
import { ProductCard } from '../shared/ProductCard';
import { getBrowsingHistoryConfig } from './rightPanelData';

export function BrowsingHistorySection(products: BrowsingHistoryProduct[]): string {
  const browsingHistoryConfig = getBrowsingHistoryConfig();
  const cards = products.map((p) =>
    ProductCard({
      image: p.image,
      price: p.price.toFixed(2),
      currency: p.currency,
      minOrder: p.minOrder,
      href: p.href,
    })
  ).join('');

  return SectionCard({
    children: `
      ${SectionHeader({
        title: browsingHistoryConfig.title,
        actionText: browsingHistoryConfig.actionText,
        actionHref: browsingHistoryConfig.actionHref,
      })}
      <div class="flex gap-3 overflow-x-auto scrollbar-hide">
        ${cards}
      </div>
    `,
  });
}
