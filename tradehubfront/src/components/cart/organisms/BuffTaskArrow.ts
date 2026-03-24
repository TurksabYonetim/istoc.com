/**
 * BuffTaskArrow Organism
 * Navigation/scroll arrow component for back-to-top or section navigation.
 * Renders a directional arrow icon button. Minimal standalone component.
 */

export type ArrowDirection = 'up' | 'down' | 'left' | 'right';

export interface BuffTaskArrowProps {
  direction?: ArrowDirection;
  label?: string;
  onClick?: string;
}

const ARROW_PATHS: Record<ArrowDirection, string> = {
  up: 'M5 15l7-7 7 7',
  down: 'M19 9l-7 7-7-7',
  left: 'M15 19l-7-7 7-7',
  right: 'M9 5l7 7-7 7',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function BuffTaskArrow({
  direction = 'up',
  label = 'Back to top',
  onClick,
}: BuffTaskArrowProps = {}): string {
  const path = ARROW_PATHS[direction];
  const ariaLabel = escapeHtml(label);
  const onClickAttr = onClick ? ` data-action="${escapeHtml(onClick)}"` : '';

  return `
    <button
      type="button"
      class="sc-c-buff-task-arrow inline-flex items-center justify-center w-10 h-10 border border-border-default rounded-full bg-surface cursor-pointer text-text-body text-lg transition-colors duration-150 fixed bottom-10 right-10 z-[100] shadow-md hover:bg-surface-raised hover:border-cta-primary"
      aria-label="${ariaLabel}"
      title="${ariaLabel}"${onClickAttr}
      data-direction="${direction}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="${path}" />
      </svg>
    </button>
  `.trim();
}

export function initBuffTaskArrow(container?: HTMLElement): void {
  const root = container || document;
  const arrows = root.querySelectorAll<HTMLButtonElement>('.sc-c-buff-task-arrow');

  arrows.forEach((arrow) => {
    arrow.addEventListener('click', () => {
      const direction = arrow.dataset.direction as ArrowDirection | undefined;

      if (direction === 'up') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      arrow.dispatchEvent(
        new CustomEvent('buff-arrow-click', {
          bubbles: true,
          detail: { direction },
        }),
      );
    });
  });
}
