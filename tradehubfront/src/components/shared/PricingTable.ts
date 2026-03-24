/**
 * PricingTable Component
 * Feature comparison matrix for pricing plans
 */

import { t } from '../../i18n';

export interface PricingPlan {
  name: string;
  recommended?: boolean;
}

export interface PricingFeature {
  label: string;
  values: (boolean | string)[];
}

interface PricingTableProps {
  plans: PricingPlan[];
  features: PricingFeature[];
}

export function PricingTable({ plans, features }: PricingTableProps): string {
  return `
    <!-- Desktop: table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-3 px-4 font-semibold text-gray-700 w-1/4" data-i18n="common.feature">${t('common.feature')}</th>
            ${plans.map(p => `
              <th class="text-center py-3 px-4 font-semibold ${p.recommended ? 'text-primary-600' : 'text-gray-700'}">
                ${p.name}
                ${p.recommended ? `<span class="ml-1 text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full" data-i18n="common.recommended">${t('common.recommended')}</span>` : ''}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${features.map((f, i) => `
            <tr class="${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
              <td class="py-3 px-4 text-gray-700">${f.label}</td>
              ${f.values.map(v => `
                <td class="py-3 px-4 text-center">
                  ${typeof v === 'boolean'
                    ? (v ? '<svg class="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'
                         : '<svg class="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>')
                    : `<span class="text-gray-700">${v}</span>`}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Mobile: cards per plan -->
    <div class="md:hidden space-y-6">
      ${plans.map((plan, pi) => `
        <div class="border ${plan.recommended ? 'border-primary-500' : 'border-gray-200'} rounded-lg overflow-hidden">
          <div class="px-4 py-3 font-semibold text-center ${plan.recommended ? 'bg-primary-50 text-primary-700' : 'bg-gray-50 text-gray-700'}">
            ${plan.name} ${plan.recommended ? `<span class="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full ml-1" data-i18n="common.recommended">${t('common.recommended')}</span>` : ''}
          </div>
          <div class="divide-y divide-gray-100">
            ${features.map(f => `
              <div class="flex items-center justify-between px-4 py-2.5 text-sm">
                <span class="text-gray-600">${f.label}</span>
                <span>
                  ${typeof f.values[pi] === 'boolean'
                    ? (f.values[pi] ? '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'
                                    : '<svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>')
                    : `<span class="text-gray-700 font-medium">${f.values[pi]}</span>`}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
