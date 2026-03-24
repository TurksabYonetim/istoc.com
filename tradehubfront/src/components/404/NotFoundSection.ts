/**
 * 404 Not Found — Error Hero Section
 * SVG illustration + error message + action buttons
 */

function telescopeIllustration(): string {
  return `
    <svg class="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <!-- Tripod legs -->
      <line x1="100" y1="130" x2="65" y2="190" stroke="var(--color-error-500, #ef4444)" stroke-width="3" stroke-linecap="round"/>
      <line x1="100" y1="130" x2="135" y2="190" stroke="var(--color-error-500, #ef4444)" stroke-width="3" stroke-linecap="round"/>
      <line x1="100" y1="130" x2="100" y2="195" stroke="var(--color-error-500, #ef4444)" stroke-width="3" stroke-linecap="round"/>
      <!-- Tripod feet -->
      <circle cx="65" cy="190" r="3" fill="var(--color-error-500, #ef4444)"/>
      <circle cx="135" cy="190" r="3" fill="var(--color-error-500, #ef4444)"/>
      <circle cx="100" cy="195" r="3" fill="var(--color-error-500, #ef4444)"/>
      <!-- Telescope body -->
      <rect x="58" y="62" width="90" height="36" rx="18" transform="rotate(-25 103 80)" fill="var(--color-primary-500, #cc9900)"/>
      <!-- Lens (front) -->
      <ellipse cx="60" cy="58" rx="22" ry="22" fill="var(--color-primary-600, #a37a00)" stroke="var(--color-primary-700, #7a5c00)" stroke-width="3"/>
      <ellipse cx="60" cy="58" rx="16" ry="16" fill="var(--color-primary-100, #fef3c7)"/>
      <ellipse cx="60" cy="58" rx="10" ry="10" fill="var(--color-primary-200, #fde68a)" opacity="0.6"/>
      <!-- Lens shine -->
      <ellipse cx="54" cy="52" rx="4" ry="3" fill="white" opacity="0.7"/>
      <!-- Eyepiece (back) -->
      <rect x="142" y="95" width="20" height="14" rx="4" transform="rotate(-25 152 102)" fill="var(--color-primary-700, #7a5c00)"/>
      <!-- Joint circle -->
      <circle cx="100" cy="130" r="6" fill="var(--color-secondary-400, #9ca3af)" stroke="var(--color-secondary-500, #6b7280)" stroke-width="2"/>
      <!-- Stars around telescope -->
      <g fill="var(--color-primary-400, #fbbf24)" opacity="0.8">
        <polygon points="30,30 33,24 36,30 30,28 36,28" />
        <polygon points="160,20 162,16 164,20 160,18.5 164,18.5" />
        <polygon points="170,55 172,51 174,55 170,53.5 174,53.5" />
        <polygon points="20,80 22,76 24,80 20,78.5 24,78.5" />
      </g>
      <!-- Sparkle dots -->
      <circle cx="45" cy="20" r="2" fill="var(--color-primary-300, #fcd34d)" opacity="0.6"/>
      <circle cx="155" cy="40" r="2.5" fill="var(--color-primary-300, #fcd34d)" opacity="0.5"/>
      <circle cx="175" cy="80" r="1.5" fill="var(--color-primary-300, #fcd34d)" opacity="0.7"/>
    </svg>
  `;
}

export function NotFoundSection(): string {
  return `
    <section class="py-8 sm:py-12 lg:py-16">
      <div class="container-boxed">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-center sm:text-left">

          <!-- Illustration -->
          <div class="flex-shrink-0">
            ${telescopeIllustration()}
          </div>

          <!-- Text + Buttons -->
          <div class="flex flex-col items-center sm:items-start gap-4">
            <h1 class="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-secondary-100">
              Bir hata olustu
            </h1>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 max-w-md">
              Aradiginiz sayfa su anda kullanilamaz durumda
            </p>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1">
              <button
                onclick="history.back()"
                class="th-btn"
              >
                Geri Don
              </button>
              <a
                href="/"
                class="th-btn-outline"
              >
                Ana Sayfaya Git
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}
