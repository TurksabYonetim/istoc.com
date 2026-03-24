/**
 * Cart page title.
 */

export interface CartHeaderProps {
  title?: string;
}

export function CartHeader({ title = 'Sepetim' }: CartHeaderProps = {}): string {
  return `<header><h1 class="text-2xl sm:text-3xl font-bold text-text-heading">${title}</h1></header>`;
}
