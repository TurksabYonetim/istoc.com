export function initStickyHeights(): void {
    const adjustHeights = () => {
        // Both cart and checkout tracking wrappers
        const sidebars = document.querySelectorAll<HTMLElement>(
            '.sc-shopping-cart-summary-container, .checkout-sidebar'
        );
        if (!sidebars.length) return;

        const footer = document.querySelector('footer');
        const viewportHeight = window.innerHeight;
        const headerOffset = 24; // lg:top-[24px]

        sidebars.forEach((sidebar) => {
            // Base height covers the viewport minus the top offset and bottom padding
            let maxH = viewportHeight - headerOffset - 24;

            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                // If footer enters viewport, cut the bottom height so it doesn't overlap
                if (footerRect.top < viewportHeight) {
                    maxH -= (viewportHeight - footerRect.top);
                }
            }

            sidebar.style.maxHeight = `${Math.max(200, maxH)}px`;
        });
    };

    window.addEventListener('scroll', adjustHeights, { passive: true });
    window.addEventListener('resize', adjustHeights, { passive: true });

    // Initial calculation after layout rendering
    requestAnimationFrame(adjustHeights);
}
