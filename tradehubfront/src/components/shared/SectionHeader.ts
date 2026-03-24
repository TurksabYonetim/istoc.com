/**
 * SectionHeader Shared Component
 * Flex row with title (18px bold) and optional action link (13px gray).
 */

import type { SectionHeaderProps } from '../../types/buyerDashboard';

export function SectionHeader({ title, actionText, actionHref }: SectionHeaderProps): string {
  const actionHtml = actionText && actionHref
    ? `<a href="${actionHref}" class="text-[13px] text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-200 transition-colors">${actionText}</a>`
    : '';

  return `
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">${title}</h3>
      ${actionHtml}
    </div>
  `;
}
