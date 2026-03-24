/**
 * FooterGroup Component
 * Payment methods badge row with security indicators
 * Simplified inline layout with flex-wrap
 */

/**
 * FooterGroup Component
 * Renders payment method badges and security indicators in a centered row.
 */
export function FooterGroup(): string {
  return `
    <section class="dark:bg-gray-800 border-t dark:border-gray-700 py-4 sm:py-6" style="background-color:var(--footer-bg);border-color:var(--footer-border-color)" aria-label="Payment methods and security">
      <div class="container-boxed px-3 sm:px-4">
        <div class="flex items-center justify-center">
          <!-- Payment Methods (Turkey) -->
          <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <!-- Visa -->
            <span class="inline-flex items-center px-3 py-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 font-bold italic text-sm text-blue-800 dark:text-blue-400">VISA</span>
            <!-- Mastercard -->
            <span class="inline-flex items-center px-2.5 py-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
              <svg class="w-7 h-5" viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="12" cy="16" r="10" fill="#EB001B"/>
                <circle cx="20" cy="16" r="10" fill="#F79E1B"/>
                <path d="M16 8.8a10 10 0 0 1 0 14.4 10 10 0 0 1 0-14.4z" fill="#FF5F00"/>
              </svg>
            </span>
            <!-- iyzico -->
            <span class="inline-flex items-center px-3 py-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-bold">
              <span class="text-blue-600">iy</span><span class="text-blue-800 dark:text-blue-400">zico</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Get group companies data for use by other components
 * @deprecated Use FooterGroup() directly
 */
export function getGroupCompaniesData(): { name: string; href: string }[] {
  return [];
}
