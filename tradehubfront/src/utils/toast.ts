/**
 * Toast Notification Utility
 * Flowbite-inspired toast with theme colors (Tailwind only, no raw CSS)
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  /** optional link: { text, href } shown after the message */
  link?: { text: string; href: string };
}

const TOAST_CONTAINER_ID = 'toast-container';

const ICONS: Record<ToastType, string> = {
  success: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`,
  error: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>`,
  warning: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`,
  info: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`,
};

const ICON_WRAPPER_CLASSES: Record<ToastType, string> = {
  success: 'inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-success-50 text-success-500 dark:bg-success-500/20 dark:text-success-500',
  error: 'inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-error-50 text-error-500 dark:bg-error-500/20 dark:text-error-500',
  warning: 'inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-warning-50 text-warning-500 dark:bg-warning-500/20 dark:text-warning-500',
  info: 'inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-info-50 text-info-500 dark:bg-info-500/20 dark:text-info-500',
};

function getOrCreateContainer(): HTMLElement {
  let container = document.getElementById(TOAST_CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = TOAST_CONTAINER_ID;
    container.className = 'fixed top-5 right-5 z-(--z-toast) flex flex-col gap-3 pointer-events-none';
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(options: ToastOptions): void {
  const { message, type = 'info', duration = 3500, link } = options;

  const container = getOrCreateContainer();

  const toast = document.createElement('div');
  toast.className =
    'pointer-events-auto flex items-center gap-3 w-full max-w-sm p-4 rounded-lg shadow-lg ' +
    'bg-white dark:bg-gray-800 text-secondary-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 ' +
    'transition-all duration-300 translate-x-full opacity-0';

  const linkHtml = link
    ? ` <a href="${link.href}" class="ml-1 font-medium text-primary-600 hover:text-primary-500 underline">${link.text}</a>`
    : '';

  toast.innerHTML = `
    <div class="${ICON_WRAPPER_CLASSES[type]}">${ICONS[type]}</div>
    <div class="text-sm font-normal">${message}${linkHtml}</div>
    <button type="button" class="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex items-center justify-center h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-700" aria-label="Close">
      <svg class="w-3 h-3" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
    </button>
  `;

  container.appendChild(toast);

  // Close button
  const closeBtn = toast.querySelector('button');
  closeBtn?.addEventListener('click', () => dismissToast(toast));

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-full', 'opacity-0');
    toast.classList.add('translate-x-0', 'opacity-100');
  });

  // Auto dismiss
  if (duration > 0) {
    setTimeout(() => dismissToast(toast), duration);
  }
}

function dismissToast(toast: HTMLElement): void {
  toast.classList.remove('translate-x-0', 'opacity-100');
  toast.classList.add('translate-x-full', 'opacity-0');
  setTimeout(() => toast.remove(), 300);
}
