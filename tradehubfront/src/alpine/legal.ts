import Alpine from 'alpinejs'

// ─── Legal TOC scrollspy ───────────────────────────────────────────────
Alpine.data('legalToc', () => ({
  activeSection: '',
  tocOpen: false,
  _observer: null as IntersectionObserver | null,

  init() {
    this.$nextTick(() => {
      const sections = document.querySelectorAll('section[id]');
      this._observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.activeSection = entry.target.id;
            }
          }
        },
        { rootMargin: '-80px 0px -60% 0px' }
      );
      sections.forEach((s) => this._observer!.observe(s));
      // Set initial from hash
      if (window.location.hash) {
        this.activeSection = window.location.hash.slice(1);
      } else if (sections.length) {
        this.activeSection = sections[0].id;
      }
    });
  },

  destroy() {
    this._observer?.disconnect();
  },

  scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    }
  },

  printPage() {
    window.print();
  },
}));

// ─── Cookie Consent ────────────────────────────────────────────────────
Alpine.data('cookieConsent', () => ({
  categories: {
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  },

  init() {
    this.loadPreferences();
  },

  toggleCategory(cat: string) {
    if (cat === 'necessary') return;
    (this.categories as any)[cat] = !(this.categories as any)[cat];
  },

  savePreferences() {
    localStorage.setItem('istoc_cookie_prefs', JSON.stringify(this.categories));
    // Show brief confirmation
    const el = document.getElementById('cookie-save-toast');
    if (el) {
      el.classList.remove('hidden');
      setTimeout(() => el.classList.add('hidden'), 2000);
    }
  },

  loadPreferences() {
    const saved = localStorage.getItem('istoc_cookie_prefs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.categories = { ...this.categories, ...parsed, necessary: true };
      } catch { /* ignore */ }
    }
  },
}));

Alpine.data('aboutPage', () => ({
  counters: { users: 0, sellers: 0, countries: 0, categories: 0 },
  targets: { users: 250000, sellers: 12000, countries: 45, categories: 180 },
  animated: false,

  animateCounters() {
    if (this.animated) return;
    this.animated = true;
    const duration = 2000;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      this.counters = {
        users: Math.round(this.targets.users * ease),
        sellers: Math.round(this.targets.sellers * ease),
        countries: Math.round(this.targets.countries * ease),
        categories: Math.round(this.targets.categories * ease),
      };
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },
}));
