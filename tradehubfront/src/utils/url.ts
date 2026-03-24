/** Returns the base URL for the app (handles GitHub Pages subdirectory) */
export function getBaseUrl(): string {
  return import.meta.env.BASE_URL || '/';
}

/** Prepend base URL to an absolute path starting with / */
export function toHref(path: string): string {
  const base = getBaseUrl();
  if (path.startsWith('/')) {
    return base + path.slice(1);
  }
  return base + path;
}

/**
 * Rewrite all internal <a> href and <form> action attributes to include the base URL.
 * Also intercepts clicks as a safety net for links not yet rewritten.
 * No-op when deployed at root (/).
 */
export function initLinkRewriter(): void {
  const base = getBaseUrl();
  if (base === '/') return;

  let scheduled = false;

  const rewrite = () => {
    scheduled = false;

    // Rewrite <a href="/...">
    document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach(a => {
      const h = a.getAttribute('href')!;
      if (!h.startsWith('//') && !h.startsWith(base)) {
        a.setAttribute('href', base + h.slice(1));
      }
    });

    // Rewrite <form action="/...">
    document.querySelectorAll<HTMLFormElement>('form[action^="/"]').forEach(f => {
      const action = f.getAttribute('action')!;
      if (!action.startsWith('//') && !action.startsWith(base)) {
        f.setAttribute('action', base + action.slice(1));
      }
    });
  };

  const schedule = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(rewrite);
    }
  };

  // Observe DOM changes for dynamically rendered content
  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Initial rewrite
  schedule();

  // Click interceptor: safety net for links not yet rewritten by MutationObserver
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith(base)) {
      e.preventDefault();
      window.location.href = base + href.slice(1);
    }
  }, true);
}
