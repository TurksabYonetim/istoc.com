/**
 * StatCard Component
 * Displays a large value with label, optionally with icon
 */

interface StatCardProps {
  value: string;
  label: string;
  icon?: string;
}

export function StatCard({ value, label, icon }: StatCardProps): string {
  return `
    <div class="text-center p-6">
      ${icon ? `<div class="text-primary-500 mb-2 flex justify-center">${icon}</div>` : ''}
      <div class="text-3xl font-bold text-gray-900" x-data="{ shown: false, current: 0 }" x-intersect.once="shown = true">${value}</div>
      <div class="text-sm text-gray-500 mt-1">${label}</div>
    </div>
  `;
}
