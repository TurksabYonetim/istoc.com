import DOMPurify from 'dompurify';

/**
 * Sanitize HTML string to prevent XSS.
 * Allows safe inline formatting tags only.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'span', 'p', 'ul', 'ol', 'li', 'small', 'sub', 'sup'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  });
}

/**
 * Set element innerHTML with DOMPurify sanitization.
 */
export function safeInnerHTML(el: HTMLElement, html: string): void {
  el.innerHTML = sanitizeHtml(html);
}
