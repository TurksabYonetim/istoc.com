/**
 * SettingsMyAccount Component
 * "Hesabım" page — member profile details (Alibaba-style Edit Member Profile).
 * View/Edit toggle, backed by get_user_profile / update_user_profile API.
 */

import { t } from '../../i18n';
import { api } from '../../utils/api';
import { validatePhone } from '../../utils/tr-validation';

// ── Data ─────────────────────────────────────────────────────────

interface AccountData {
  member_id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified?: boolean;
  phone: string;
  address?: string;
  city?: string;
  country: string;
  postal_code?: string;
  account_type?: string;
}

const inputCls = "w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";
const readonlyCls = "py-2.5 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50";
const labelCls = "block text-[13px] font-medium mb-1.5";

// ── Helpers ──────────────────────────────────────────────────────

const ICONS = {
  verified: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#22c55e"/><path d="M4.5 7l2 2 3.5-3.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5l2 2L5.5 12.5H3.5v-2l8-8z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

let _countryList: string[] = [];

async function fetchCountryList(): Promise<void> {
  if (_countryList.length > 0) return;
  try {
    const res = await api<{ message: { name: string }[] }>(
      '/method/frappe.client.get_list?doctype=Country&fields=["name"]&limit_page_length=0&order_by=name asc'
    );
    _countryList = (res.message || []).map((c: { name: string }) => c.name);
  } catch {
    _countryList = ['Turkey'];
  }
}

function countryOptions(selected: string): string {
  return ['', ..._countryList].map(c =>
    `<option value="${c}" ${c === selected ? 'selected' : ''}>${c || '---'}</option>`
  ).join('');
}

function maskEmail(email: string): string {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.substring(0, Math.min(3, local.length));
  return `${visible}***@${domain}`;
}

function viewRow(label: string, value: string, extra?: string): string {
  const display = value || `<span style="color:var(--color-text-placeholder, #999999)">--</span>`;
  return `
    <div class="flex py-3.5 max-sm:py-3 border-b border-gray-100 last:border-b-0 max-md:flex-col max-md:gap-0.5">
      <div class="w-[200px] flex-shrink-0 text-[13px] font-medium text-right pr-4 max-md:w-auto max-md:text-left max-md:pr-0" style="color:var(--color-text-muted, #666666)">${label}</div>
      <div class="flex-1 min-w-0 text-sm flex items-center gap-2 flex-wrap" style="color:var(--color-text-heading, #111827)">${display}${extra || ''}</div>
    </div>
  `;
}

// ── API ──────────────────────────────────────────────────────────

async function fetchProfile(): Promise<AccountData> {
  try {
    const res = await api<{ message: AccountData }>('/method/tradehub_core.api.v1.auth.get_user_profile');
    return res.message || {} as AccountData;
  } catch {
    return {} as AccountData;
  }
}

async function saveProfile(data: Record<string, string>): Promise<boolean> {
  try {
    await api('/method/tradehub_core.api.v1.auth.update_user_profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return true;
  } catch {
    return false;
  }
}

// ── View Mode ────────────────────────────────────────────────────

function renderView(d: AccountData): string {
  const fullName = `${d.first_name || ''} ${d.last_name || ''}`.trim();
  const verifiedBadge = d.email_verified
    ? `<span class="inline-flex items-center gap-1 text-xs font-medium" style="color:#22c55e">${ICONS.verified} ${t('settings.emailVerifiedText') || 'Verified'}</span>`
    : '';
  const addressParts = [d.address, d.city, d.country, d.postal_code].filter(Boolean).join(', ');

  return `
    <div class="flex flex-col">
      ${viewRow('Member ID', d.member_id)}
      ${viewRow(t('settings.fullName') || 'Ad Soyad', fullName)}
      ${viewRow(t('settings.emailAddressField') || 'E-posta', maskEmail(d.email), verifiedBadge)}
      ${viewRow(t('settings.addressLabel') || 'Adres', addressParts)}
      ${viewRow(t('settings.phoneLabel') || 'Telefon', d.phone)}
    </div>
  `;
}

// ── Edit Mode ────────────────────────────────────────────────────

function renderEdit(d: AccountData): string {
  return `
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">Member ID</label>
      <div class="${readonlyCls}">${d.member_id || '--'}</div>
    </div>
    <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-5">
      <div>
        <label class="${labelCls}" style="color:var(--color-text-muted)">* ${t('settings.firstName') || 'Ad'}</label>
        <input type="text" class="${inputCls}" data-field="first_name" value="${d.first_name || ''}" />
      </div>
      <div>
        <label class="${labelCls}" style="color:var(--color-text-muted)">* ${t('settings.lastName') || 'Soyad'}</label>
        <input type="text" class="${inputCls}" data-field="last_name" value="${d.last_name || ''}" />
      </div>
    </div>
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">* ${t('settings.emailAddressField') || 'E-posta'}</label>
      <div class="${readonlyCls} flex items-center gap-2">${d.email} ${d.email_verified ? `<span class="text-xs font-medium" style="color:#22c55e">${t('settings.emailVerifiedText') || 'Email address confirmed'}</span>` : ''}</div>
    </div>
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.addressLabel') || 'Adres'}</label>
      <input type="text" class="${inputCls}" data-field="address" value="${d.address || ''}" placeholder="${t('settings.addressLabel') || 'Sokak adresi'}" />
    </div>
    <div class="grid grid-cols-3 max-sm:grid-cols-1 gap-4 mb-5">
      <div>
        <label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.cityLabel') || 'Şehir'}</label>
        <input type="text" class="${inputCls}" data-field="city" value="${d.city || ''}" />
      </div>
      <div>
        <label class="${labelCls}" style="color:var(--color-text-muted)">* ${t('settings.countryRegion') || 'Ülke'}</label>
        <select class="${inputCls} bg-white cursor-pointer" data-field="country">${countryOptions(d.country || '')}</select>
      </div>
      <div>
        <label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.postalCodeLabel') || 'Posta Kodu'}</label>
        <input type="text" class="${inputCls}" data-field="postal_code" value="${d.postal_code || ''}" />
      </div>
    </div>
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">* ${t('settings.phoneLabel') || 'Telefon'}</label>
      <input type="tel" class="${inputCls} max-w-[300px]" data-field="phone" value="${d.phone || ''}" placeholder="+90 5XX XXX XX XX" />
    </div>
  `;
}

// ── Component ────────────────────────────────────────────────────

export function SettingsMyAccount(): string {
  return `<div id="my-account-root">
    <div class="bg-white rounded-lg p-8 max-md:p-5 max-sm:px-4 max-sm:py-4 flex items-center justify-center min-h-[200px]">
      <span class="text-sm" style="color:var(--color-text-muted)">${t('settings.loading') || 'Yükleniyor...'}</span>
    </div>
  </div>`;
}

export function initSettingsMyAccount(): void {
  const root = document.getElementById('my-account-root');
  if (!root) return;

  let current: AccountData = {} as AccountData;
  let isEditing = false;

  async function loadAndRender() {
    await fetchCountryList();
    current = await fetchProfile();
    render();
  }

  function render() {
    const title = t('settings.myAccountTitle') || 'Hesabım';
    root!.innerHTML = `
      <div class="bg-white rounded-lg p-8 max-md:p-5 max-sm:px-4 max-sm:py-4">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold m-0" style="color:var(--color-text-heading, #111827)">${title}</h2>
          ${!isEditing ? `<button id="ma-edit-btn" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 cursor-pointer transition-all hover:bg-gray-50" style="color:var(--color-text-muted)" title="${t('settings.editBtn') || 'Düzenle'}">${ICONS.edit}</button>` : ''}
        </div>
        <div id="ma-view" ${isEditing ? 'style="display:none"' : ''}>
          ${renderView(current)}
          <div class="mt-6">
            <button class="th-btn-outline w-full max-w-[280px] mx-auto block max-sm:max-w-full" type="button" id="ma-edit-toggle">${t('settings.editBtn') || 'Düzenle'}</button>
          </div>
        </div>
        <div id="ma-edit" ${!isEditing ? 'style="display:none"' : ''}>
          ${renderEdit(current)}
          <div class="pt-4 border-t border-gray-100 flex items-center gap-3 max-sm:flex-col">
            <button class="th-btn px-8 max-sm:w-full" type="button" id="ma-submit">${t('settings.submitBtn') || 'Kaydet'}</button>
            <button class="text-[13px] font-medium bg-none border-none cursor-pointer hover:underline" style="color:var(--color-text-muted)" type="button" id="ma-cancel">${t('settings.cancelAction') || 'Vazgeç'}</button>
          </div>
          <div id="ma-message" class="mt-3 text-sm hidden"></div>
        </div>
      </div>
    `;
    bindEvents();
  }

  function bindEvents() {
    document.getElementById('ma-edit-btn')?.addEventListener('click', () => {
      isEditing = true;
      render();
    });
    document.getElementById('ma-edit-toggle')?.addEventListener('click', () => {
      isEditing = true;
      render();
    });
    document.getElementById('ma-cancel')?.addEventListener('click', () => {
      isEditing = false;
      render();
    });
    document.getElementById('ma-submit')?.addEventListener('click', async () => {
      const editEl = document.getElementById('ma-edit');
      if (!editEl) return;
      const data: Record<string, string> = {};
      editEl.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-field]').forEach(el => {
        if (el.dataset.field) data[el.dataset.field] = el.value;
      });

      // Validate
      if (!data.first_name?.trim() || !data.last_name?.trim()) {
        showMessage(t('settings.nameRequired') || 'Ad ve soyad gerekli', 'error');
        return;
      }
      if (data.phone?.trim() && !validatePhone(data.phone)) {
        showMessage(t('settings.invalidPhone') || 'Geçersiz telefon', 'error');
        return;
      }

      const submitBtn = document.getElementById('ma-submit') as HTMLButtonElement;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = t('settings.saving') || 'Kaydediliyor...'; }

      const ok = await saveProfile(data);
      if (ok) {
        Object.entries(data).forEach(([k, v]) => {
          (current as unknown as Record<string, unknown>)[k] = v;
        });
        isEditing = false;
        render();
      } else {
        showMessage(t('settings.saveFailed') || 'Kayıt başarısız', 'error');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = t('settings.submitBtn') || 'Kaydet'; }
      }
    });
  }

  function showMessage(text: string, type: 'error' | 'success') {
    const el = document.getElementById('ma-message');
    if (!el) return;
    el.textContent = text;
    el.className = `mt-3 text-sm ${type === 'error' ? 'text-red-500' : 'text-green-600'}`;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 4000);
  }

  loadAndRender();
}
