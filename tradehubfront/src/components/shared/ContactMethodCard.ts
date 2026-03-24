/**
 * ContactMethodCard Component
 * Card displaying a contact method with icon, title, description, and CTA
 */

interface ContactMethodCardProps {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
  ctaAction?: string;
  variant?: 'default' | 'primary';
}

export function ContactMethodCard({ icon, title, description, ctaLabel, ctaHref, ctaAction, variant = 'default' }: ContactMethodCardProps): string {
  const btnClass = variant === 'primary'
    ? 'bg-primary-500 text-white hover:bg-primary-600'
    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';

  const ctaTag = ctaHref
    ? `<a href="${ctaHref}" class="inline-block px-5 py-2 text-sm font-medium rounded-lg transition-colors ${btnClass}">${ctaLabel}</a>`
    : `<button type="button" ${ctaAction ? `@click="${ctaAction}"` : ''} class="px-5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${btnClass}">${ctaLabel}</button>`;

  return `
    <div class="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
      <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
        ${icon}
      </div>
      <h3 class="text-base font-semibold text-gray-900 mb-2">${title}</h3>
      <p class="text-sm text-gray-500 mb-4 leading-relaxed">${description}</p>
      ${ctaTag}
    </div>
  `;
}
