import Alpine from 'alpinejs'
import { getSessionUser } from '../utils/auth'
import { t } from '../i18n'

Alpine.data('buyerUserInfo', () => ({
  userName: '',
  userInitial: '',

  init() {
    this.loadUser();
  },

  async loadUser() {
    try {
      const user = await getSessionUser();
      if (user) {
        this.userName = user.full_name || '';
        this.userInitial = (user.full_name || user.email || '?').charAt(0).toLowerCase();

        // Update TopBar greeting if present
        const greetingEl = document.querySelector('#user-dropdown-menu [data-i18n="header.hello"]');
        if (greetingEl) {
          greetingEl.textContent = t('header.hello', { name: user.full_name });
        }

        // Update auth area (show user button if login buttons are shown)
        const authArea = document.querySelector('[data-auth-area]');
        if (authArea && !document.getElementById('user-dropdown-btn')) {
          // Session loaded but TopBar rendered before session — page needs a reload
          // This is handled by auth-guard in production; for now just update greeting
        }
      }
    } catch { /* ignore */ }
  },
}));
