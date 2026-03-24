/**
 * EmptyState Shared Component
 * Centered flex-col layout with SVG icon, title text, and optional link.
 * Link color is configurable (defaults to orange #E67A00).
 */

import type { EmptyStateProps } from '../../types/buyerDashboard';

export interface EmptyStateFullProps extends EmptyStateProps {
  linkColor?: string;
}

export function EmptyState({ icon, text, linkText, linkHref, linkColor = '#E67A00' }: EmptyStateFullProps): string {
  const linkHtml = linkText && linkHref
    ? `<a href="${linkHref}" class="text-[13px] mt-2 hover:underline" style="color: ${linkColor}">${linkText}</a>`
    : '';

  return `
    <div class="flex flex-col items-center justify-center py-6 xs:py-8 px-4">
      <div class="w-10 h-10 xs:w-12 xs:h-12 mb-2 xs:mb-3">${icon}</div>
      <p class="text-xs xs:text-sm text-gray-400 dark:text-gray-500 mb-1 text-center">${text}</p>
      ${linkHtml}
    </div>
  `;
}
