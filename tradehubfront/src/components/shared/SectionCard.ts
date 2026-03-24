/**
 * SectionCard Shared Component
 * White background card wrapper with padding and border-radius.
 */

import type { SectionCardProps } from '../../types/buyerDashboard';

export function SectionCard({ children, className = '' }: SectionCardProps): string {
  return `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-5 transition-shadow duration-300 hover:shadow-[0_0_12px_0_rgba(0,0,0,0.12)]${className ? ` ${className}` : ''}">
      ${children}
    </div>
  `;
}
