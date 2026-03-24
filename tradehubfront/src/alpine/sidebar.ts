import Alpine from 'alpinejs'

Alpine.data('sidebar', () => ({
  closeTimer: null as ReturnType<typeof setTimeout> | null,
  activeFlyout: null as HTMLElement | null,
  isPeekExpanded: false,

  shouldUsePeekExpand(): boolean {
    return window.innerWidth >= 768 && window.innerWidth < 1280;
  },

  init() {
    const sidebarEl = this.$el as HTMLElement;

    const currentPath = window.location.pathname;
    const allItems = sidebarEl.querySelectorAll<HTMLElement>('[data-sidebar-item]');
    const activeClasses = ['bg-white', 'text-gray-900', 'shadow-sm'];
    const inactiveClasses = ['text-gray-700'];

    allItems.forEach((el) => {
      const href = el.getAttribute('href') || '';
      const hrefPath = href.split('#')[0];
      const hrefHash = href.includes('#') ? '#' + href.split('#')[1] : '';
      const pathMatches = hrefPath && currentPath.endsWith(hrefPath.replace(/^\//, ''));
      const isActive = pathMatches && (hrefHash === '' || window.location.hash === hrefHash);

      el.classList.remove(...activeClasses, 'bg-green-50', 'text-green-600');

      if (isActive) {
        el.classList.add(...activeClasses);
        el.classList.remove(...inactiveClasses);
      } else {
        el.classList.add(...inactiveClasses);
      }
    });
  },

  applyPeekExpandStyles() {
    const sidebarEl = this.$el as HTMLElement;
    sidebarEl.style.width = '260px';
    sidebarEl.style.zIndex = '30';
    sidebarEl.style.boxShadow = '4px 0 24px rgba(0,0,0,0.08)';
    sidebarEl.style.borderTopRightRadius = '0';
    sidebarEl.style.borderBottomRightRadius = '0';

    sidebarEl.querySelectorAll<HTMLElement>('.sidebar__section-title').forEach((el) => {
      el.style.display = 'block';
    });

    sidebarEl.querySelectorAll<HTMLElement>('.sidebar-item--expanded').forEach((el) => {
      el.style.marginLeft = '0.5rem';
      el.style.marginRight = '0.5rem';
      el.style.width = 'auto';
      el.style.height = '40px';
      el.style.justifyContent = 'flex-start';
      el.style.gap = '0.75rem';
      el.style.paddingLeft = '1rem';
      el.style.paddingRight = '1rem';
    });

    sidebarEl.querySelectorAll<HTMLElement>('.sidebar-item-label').forEach((el) => {
      el.style.display = 'block';
      if (el.classList.contains('truncate')) {
        el.style.whiteSpace = 'normal';
        el.style.overflow = 'visible';
        el.style.textOverflow = 'unset';
      }
    });

    sidebarEl.querySelectorAll<HTMLElement>('.sidebar-item-badge').forEach((el) => {
      el.style.display = 'inline-flex';
    });

    sidebarEl.querySelectorAll<HTMLElement>('.sidebar-item-chevron').forEach((el) => {
      el.style.display = 'block';
    });
  },

  clearPeekExpandStyles() {
    const sidebarEl = this.$el as HTMLElement;
    sidebarEl.style.width = '';
    sidebarEl.style.zIndex = '';
    sidebarEl.style.boxShadow = '';
    sidebarEl.style.borderTopRightRadius = '';
    sidebarEl.style.borderBottomRightRadius = '';

    sidebarEl.querySelectorAll<HTMLElement>('.sidebar__section-title').forEach((el) => {
      el.style.display = '';
    });

    sidebarEl.querySelectorAll<HTMLElement>('.sidebar-item--expanded').forEach((el) => {
      el.style.marginLeft = '';
      el.style.marginRight = '';
      el.style.width = '';
      el.style.height = '';
      el.style.justifyContent = '';
      el.style.gap = '';
      el.style.paddingLeft = '';
      el.style.paddingRight = '';
    });

    sidebarEl.querySelectorAll<HTMLElement>('.sidebar-item-label').forEach((el) => {
      el.style.display = '';
      el.style.whiteSpace = '';
      el.style.overflow = '';
      el.style.textOverflow = '';
    });

    sidebarEl.querySelectorAll<HTMLElement>('.sidebar-item-badge').forEach((el) => {
      el.style.display = '';
    });

    sidebarEl.querySelectorAll<HTMLElement>('.sidebar-item-chevron').forEach((el) => {
      el.style.display = '';
    });
  },

  setPeekExpanded(next: boolean) {
    const shouldExpand = next && this.shouldUsePeekExpand();
    if (shouldExpand === this.isPeekExpanded) return;
    this.isPeekExpanded = shouldExpand;

    if (this.activeFlyout) {
      this.activeFlyout.style.display = 'none';
      this.activeFlyout = null;
    }
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    (this.$el as HTMLElement).style.borderTopRightRadius = '';
    (this.$el as HTMLElement).style.borderBottomRightRadius = '';

    if (shouldExpand) this.applyPeekExpandStyles();
    else this.clearPeekExpandStyles();
  },

  positionFlyout(flyout: HTMLElement) {
    const sidebarRect = (this.$el as HTMLElement).getBoundingClientRect();
    flyout.style.left = `${sidebarRect.right}px`;
    flyout.style.top = `${sidebarRect.top}px`;
    flyout.style.height = `${sidebarRect.height}px`;
  },

  showFlyout(flyout: HTMLElement, _wrapper: HTMLElement) {
    if (this.shouldUsePeekExpand()) return;
    if (this.activeFlyout && this.activeFlyout !== flyout) {
      this.activeFlyout.style.display = 'none';
    }
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.positionFlyout(flyout);
    flyout.style.display = 'block';
    this.activeFlyout = flyout;
    (this.$el as HTMLElement).style.borderTopRightRadius = '0';
    (this.$el as HTMLElement).style.borderBottomRightRadius = '0';
  },

  scheduleClose() {
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => {
      if (this.activeFlyout) {
        this.activeFlyout.style.display = 'none';
        this.activeFlyout = null;
        (this.$el as HTMLElement).style.borderTopRightRadius = '';
        (this.$el as HTMLElement).style.borderBottomRightRadius = '';
      }
    }, 150);
  },

  handleMouseEnter(event: MouseEvent) {
    if (this.shouldUsePeekExpand()) {
      this.setPeekExpanded(true);
      return;
    }

    const target = event.target as HTMLElement;

    const flyout = target.closest<HTMLElement>('[data-sidebar-flyout]');
    if (flyout && this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    const wrapper = target.closest<HTMLElement>('[data-sidebar-wrapper]');
    if (wrapper) {
      const wrapperFlyout = wrapper.querySelector<HTMLElement>('[data-sidebar-flyout]');
      if (wrapperFlyout) this.showFlyout(wrapperFlyout, wrapper);
    }
  },

  handleMouseLeave(event: MouseEvent) {
    if (this.shouldUsePeekExpand()) {
      const related = event.relatedTarget as Node | null;
      const sidebarEl = this.$el as HTMLElement;
      if (!related || !sidebarEl.contains(related)) {
        this.setPeekExpanded(false);
      }
      return;
    }

    const target = event.target as HTMLElement;

    const flyout = target.closest<HTMLElement>('[data-sidebar-flyout]');
    if (flyout && this.activeFlyout === flyout) {
      this.scheduleClose();
    }

    const wrapper = target.closest<HTMLElement>('[data-sidebar-wrapper]');
    if (wrapper) {
      const wrapperFlyout = wrapper.querySelector<HTMLElement>('[data-sidebar-flyout]');
      if (wrapperFlyout && this.activeFlyout === wrapperFlyout) {
        this.scheduleClose();
      }
    }
  },

  handleScroll() {
    if (this.isPeekExpanded) {
      this.setPeekExpanded(false);
    }
    if (this.activeFlyout) {
      this.activeFlyout.style.display = 'none';
      this.activeFlyout = null;
      (this.$el as HTMLElement).style.borderTopRightRadius = '';
      (this.$el as HTMLElement).style.borderBottomRightRadius = '';
    }
  },

  handleResize() {
    if (!this.shouldUsePeekExpand()) {
      this.setPeekExpanded(false);
    }
  },
}));
