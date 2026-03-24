import Alpine from 'alpinejs'
import { t } from '../i18n'
import { isPasswordValid } from '../utils/password-validation'
import { getSessionUser, logout } from '../utils/auth'
import { api } from '../utils/api'

Alpine.data('settingsLayout', () => ({
  currentSection: '',
  userName: '',
  userEmail: '',
  userInitial: '',
  memberId: '',

  init() {
    this.currentSection = window.location.hash || '';
    this.loadUser();
  },

  async loadUser() {
    try {
      const user = await getSessionUser();
      if (user) {
        this.userName = user.full_name || '';
        this.userEmail = user.email || '';
        this.userInitial = (user.full_name || user.email || '?').charAt(0).toLowerCase();
        this.memberId = user.member_id || '';
      }
    } catch { /* ignore */ }
  },

  async handleLogout() {
    await logout();
    window.location.replace('/pages/auth/login.html');
  },

  copyMemberId() {
    navigator.clipboard.writeText(this.memberId || this.userEmail).then(() => {
      const btn = (this.$refs as Record<string, HTMLElement>).copyBtn;
      if (btn) {
        btn.title = t('orders.copied');
        setTimeout(() => { btn.title = t('orders.copy'); }, 2000);
      }
    });
  },
}));

// settingsChangeEmail — disabled (coming soon), no Alpine data needed

Alpine.data('settingsChangePassword', () => ({
  step: 1,
  error: '',
  loading: false,

  init() {
    // Reset form when navigating back to this section
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#sifre') {
        this.step = 1;
        this.error = '';
        const refs = this.$refs as Record<string, HTMLInputElement>;
        if (refs.pwCurrent) refs.pwCurrent.value = '';
        if (refs.pwNew) refs.pwNew.value = '';
        if (refs.pwConfirm) refs.pwConfirm.value = '';
      }
    });
  },

  async savePassword() {
    const currentPw = (this.$refs as Record<string, HTMLInputElement>).pwCurrent.value;
    const newPw = (this.$refs as Record<string, HTMLInputElement>).pwNew.value;
    const confirmPw = (this.$refs as Record<string, HTMLInputElement>).pwConfirm.value;

    if (!currentPw) {
      this.error = t('settings.currentPasswordRequired');
      return;
    }
    if (!isPasswordValid(newPw)) {
      this.error = t('settings.passwordMinLength');
      return;
    }
    if (newPw !== confirmPw) {
      this.error = t('settings.passwordsMismatch');
      return;
    }

    this.error = '';
    this.loading = true;
    try {
      await api('/method/tradehub_core.api.v1.identity.change_password', {
        method: 'POST',
        body: JSON.stringify({ current_password: currentPw, new_password: newPw }),
      });
      this.step = 2;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'RATE_LIMIT') {
        this.error = t('common.rateLimitError');
      } else if (msg.includes('Incorrect') || msg.includes('incorrect') || msg.includes('Invalid')) {
        this.error = t('settings.currentPasswordWrong');
      } else {
        this.error = t('settings.passwordChangeFailed');
      }
    } finally {
      this.loading = false;
    }
  },
}));

Alpine.data('settingsChangePhone', () => ({
  step: 1,
  error: '',
  loading: false,
  currentPhone: '',

  async init() {
    try {
      const res = await api<{ message: { phone: string } }>('/method/tradehub_core.api.v1.auth.get_user_profile');
      this.currentPhone = res.message?.phone || '';
    } catch { /* ignore */ }

    // Reset form when navigating back to this section
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#telefon') {
        this.step = 1;
        this.error = '';
        const refs = this.$refs as Record<string, HTMLInputElement>;
        if (refs.newPhone) refs.newPhone.value = '';
        if (refs.phonePassword) refs.phonePassword.value = '';
      }
    });
  },

  async savePhone() {
    const newPhone = (this.$refs as Record<string, HTMLInputElement>).newPhone.value.trim();
    const password = (this.$refs as Record<string, HTMLInputElement>).phonePassword.value;

    if (!newPhone) {
      this.error = t('settings.phoneRequired') || 'Telefon numarası gerekli.';
      return;
    }
    if (!password) {
      this.error = t('settings.currentPasswordRequired');
      return;
    }

    this.error = '';
    this.loading = true;
    try {
      await api('/method/tradehub_core.api.v1.identity.change_phone', {
        method: 'POST',
        body: JSON.stringify({ phone: newPhone, password }),
      });
      this.step = 2;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('Incorrect') || msg.includes('incorrect') || msg.includes('Invalid')) {
        this.error = t('settings.currentPasswordWrong');
      } else {
        this.error = t('settings.phoneChangeFailed') || 'Telefon numarası değiştirilemedi.';
      }
    } finally {
      this.loading = false;
    }
  },
}));

Alpine.data('settingsDeleteAccount', () => ({
  step: 1,
  error: '',
  loading: false,
  reason: '',

  goToStep2() {
    this.reason = (this.$refs as Record<string, HTMLSelectElement>).reason.value;
    this.step = 2;
  },

  async confirmDelete() {
    const password = (this.$refs as Record<string, HTMLInputElement>).deletePassword.value;
    const confirmed = (this.$refs as Record<string, HTMLInputElement>).confirmCheck.checked;

    if (!password) {
      this.error = t('settings.currentPasswordRequired');
      return;
    }
    if (!confirmed) {
      this.error = t('settings.confirmDeleteRequired') || 'Lütfen onay kutusunu işaretleyin.';
      return;
    }

    this.error = '';
    this.loading = true;
    try {
      await api('/method/tradehub_core.api.v1.identity.delete_account', {
        method: 'POST',
        body: JSON.stringify({ password, reason: this.reason }),
      });
      // Account disabled in DB — now logout and redirect
      this.step = 3;
      await logout();
      setTimeout(() => { window.location.href = '/pages/auth/login.html'; }, 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('Incorrect') || msg.includes('incorrect') || msg.includes('Invalid')) {
        this.error = t('settings.currentPasswordWrong');
      } else {
        this.error = t('settings.deleteAccountFailed') || 'Hesap silinemedi.';
      }
    } finally {
      this.loading = false;
    }
  },
}));
