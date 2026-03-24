/**
 * CheckoutLayout Component
 * Two-column layout wrapper for checkout page.
 * Left column (60%): shipping form, payment, items & delivery sections.
 * Right column (35%): sticky order summary sidebar.
 */

export interface CheckoutLayoutProps {
  leftContent: string;
  rightContent: string;
}

export function CheckoutLayout({ leftContent, rightContent }: CheckoutLayoutProps): string {
  return `
    <div class="sc-checkout-page max-w-[1640px] mx-auto px-4 py-6">
      <div class="flex flex-col xl:flex-row gap-5 items-start w-full relative">
        <!-- Left Column (Form Area) -->
        <div class="w-full xl:flex-[0_0_60%] xl:min-w-0 flex flex-col gap-4">
          ${leftContent}
        </div>

        <!-- Right Column (Sticky Summary) -->
        <div class="w-full xl:flex-[0_0_35%] flex-shrink-0 xl:sticky xl:top-[24px] self-start z-10">
          ${rightContent}
        </div>
      </div>
    </div>
  `;
}
