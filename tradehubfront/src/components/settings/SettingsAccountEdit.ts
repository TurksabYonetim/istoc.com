/**
 * SettingsAccountEdit Component
 * Account profile view/edit form backed by backend API.
 * Detects account type (buyer/seller) and shows role-specific fields.
 */

import { t } from '../../i18n';
import { api } from '../../utils/api';

const ICONS = {
  verified: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#22c55e"/><path d="M4.5 7l2 2 3.5-3.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

// ── Data Model ───────────────────────────────────────────────────

interface ProfileData {
  member_id: string;
  account_type: 'buyer' | 'seller';
  first_name: string;
  last_name: string;
  email: string;
  email_verified?: boolean;
  phone: string;
  country: string;
  // Seller-specific
  seller_type?: string;
  business_name?: string;
  tax_id?: string;
  tax_id_type?: string;
  tax_office?: string;
  address?: string;
  city?: string;
  bank_name?: string;
  iban?: string;
  account_holder_name?: string;
  application_status?: string;
  seller_status?: string;
}

const emptyProfile: ProfileData = {
  member_id: '', account_type: 'buyer', first_name: '', last_name: '',
  email: '', phone: '', country: '',
};

// ── API ──────────────────────────────────────────────────────────

async function fetchProfile(): Promise<ProfileData> {
  try {
    const res = await api<{ message: ProfileData }>('/method/tradehub_core.api.v1.auth.get_user_profile');
    return { ...emptyProfile, ...res.message };
  } catch {
    return { ...emptyProfile };
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

// ── Country list ─────────────────────────────────────────────────

function countryOptions(selected: string): string {
  const countries = [
    { value: '', label: t('settings.selectCountry') },
    { value: 'Turkey', label: 'Türkiye' },
    { value: 'United States', label: 'United States' },
    { value: 'Germany', label: 'Germany' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'France', label: 'France' },
    { value: 'Netherlands', label: 'Netherlands' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Spain', label: 'Spain' },
    { value: 'China', label: 'China' },
  ];
  return countries.map(c =>
    `<option value="${c.value}" ${c.value === selected ? 'selected' : ''}>${c.label}</option>`
  ).join('');
}

// ── Shared helpers ───────────────────────────────────────────────

const inputCls = "w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";
const readonlyCls = "py-2.5 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50";
const labelCls = "block text-[13px] font-medium mb-1.5";
const req = `<span class="text-red-500">*</span> `;

function viewRow(label: string, value: string, extra?: string): string {
  const display = value || `<span style="color:var(--color-text-placeholder, #999999)">--</span>`;
  return `
    <div class="flex py-3.5 max-sm:py-3 border-b border-gray-100 last:border-b-0 max-md:flex-col max-md:gap-0.5">
      <div class="w-[200px] flex-shrink-0 text-[13px] font-medium text-right pr-4 max-md:w-auto max-md:text-left max-md:pr-0" style="color:var(--color-text-muted, #666666)">${label}</div>
      <div class="flex-1 min-w-0 text-sm max-sm:text-[13px] flex items-center gap-2 flex-wrap" style="color:var(--color-text-heading, #111827)">${display}${extra || ''}</div>
    </div>
  `;
}

function statusBadge(status: string): string {
  const colors: Record<string, string> = {
    'Active': 'color:#22c55e; background:#f0fdf4',
    'Submitted': 'color:#f59e0b; background:#fffbeb',
    'Under Review': 'color:#3b82f6; background:#eff6ff',
    'Draft': 'color:#6b7280; background:#f3f4f6',
    'Approved': 'color:#22c55e; background:#f0fdf4',
    'Rejected': 'color:#ef4444; background:#fef2f2',
  };
  const style = colors[status] || 'color:#6b7280; background:#f3f4f6';
  return `<span class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full" style="${style}">${status}</span>`;
}

// ── Buyer: View ──────────────────────────────────────────────────

function buyerView(d: ProfileData): string {
  const fullName = `${d.first_name} ${d.last_name}`.trim();
  const verifiedBadge = d.email_verified
    ? `<span class="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap" style="color:#22c55e">${ICONS.verified} ${t('settings.emailVerifiedText')}</span>`
    : '';

  return `
    <div class="flex flex-col">
      ${viewRow(t('settings.accountNumber'), d.member_id)}
      ${viewRow(t('settings.fullName'), fullName)}
      ${viewRow(t('settings.emailAddressField'), d.email, verifiedBadge)}
      ${viewRow(t('settings.countryRegion'), d.country)}
      ${viewRow(t('settings.phoneLabel'), d.phone)}
    </div>
  `;
}

// ── Buyer: Edit ──────────────────────────────────────────────────

function buyerEdit(d: ProfileData): string {
  return `
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.accountNumber')}</label>
      <div class="${readonlyCls}">${d.member_id || '--'}</div>
    </div>
    <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-5">
      <div>
        <label class="${labelCls}" style="color:var(--color-text-muted)">${req}${t('settings.firstName')}</label>
        <input type="text" class="${inputCls}" data-field="first_name" value="${d.first_name}" />
      </div>
      <div>
        <label class="${labelCls}" style="color:var(--color-text-muted)">${req}${t('settings.lastName')}</label>
        <input type="text" class="${inputCls}" data-field="last_name" value="${d.last_name}" />
      </div>
    </div>
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.emailAddressField')}</label>
      <div class="${readonlyCls}">${d.email}</div>
    </div>
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">${req}${t('settings.countryRegion')}</label>
      <select class="${inputCls} bg-white cursor-pointer" data-field="country">${countryOptions(d.country)}</select>
    </div>
    <div class="mb-6">
      <label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.phoneLabel')}</label>
      <input type="tel" class="${inputCls} max-w-[300px]" data-field="phone" value="${d.phone}" placeholder="+90 5XX XXX XX XX" />
    </div>
  `;
}

// ── Seller: View ─────────────────────────────────────────────────

function sellerView(d: ProfileData): string {
  const fullName = `${d.first_name} ${d.last_name}`.trim();
  const status = d.seller_status || d.application_status || '';

  const sellerTypeMap: Record<string, string> = {
    'Individual': t('settings.sellerTypeIndividual') || 'Bireysel',
    'Business': t('settings.sellerTypeBusiness') || 'İşletme',
    'Enterprise': t('settings.sellerTypeEnterprise') || 'Kurumsal',
  };

  return `
    <div class="flex flex-col">
      ${viewRow(t('settings.accountNumber'), d.member_id)}
      ${status ? viewRow(t('settings.applicationStatus'), statusBadge(status)) : ''}
      ${viewRow(t('settings.fullName'), fullName)}
      ${viewRow(t('settings.emailAddressField'), d.email)}
      ${viewRow(t('settings.sellerTypeLabel'), sellerTypeMap[d.seller_type || ''] || d.seller_type || '')}
      ${viewRow(t('settings.businessNameLabel'), d.business_name || '')}
      ${viewRow(t('settings.phoneLabel'), d.phone)}
      ${viewRow(t('settings.countryRegion'), d.country)}
      ${d.tax_id ? viewRow(t('settings.taxIdLabel'), `${d.tax_id_type || ''} ${d.tax_id}`.trim()) : ''}
      ${d.tax_office ? viewRow(t('settings.taxOfficeLabel'), d.tax_office) : ''}
      ${d.address || d.city ? viewRow(t('settings.addressLabel'), [d.address, d.city].filter(Boolean).join(', ')) : ''}
      ${d.bank_name ? viewRow(t('settings.bankNameLabel'), d.bank_name) : ''}
      ${d.iban ? viewRow('IBAN', d.iban) : ''}
      ${d.account_holder_name ? viewRow(t('settings.accountHolderLabel'), d.account_holder_name) : ''}
    </div>
  `;
}

// ── Seller: Edit ─────────────────────────────────────────────────

function sellerEdit(d: ProfileData): string {
  return `
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.accountNumber')}</label>
      <div class="${readonlyCls}">${d.member_id || '--'}</div>
    </div>
    <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-5">
      <div>
        <label class="${labelCls}" style="color:var(--color-text-muted)">${req}${t('settings.firstName')}</label>
        <input type="text" class="${inputCls}" data-field="first_name" value="${d.first_name}" />
      </div>
      <div>
        <label class="${labelCls}" style="color:var(--color-text-muted)">${req}${t('settings.lastName')}</label>
        <input type="text" class="${inputCls}" data-field="last_name" value="${d.last_name}" />
      </div>
    </div>
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.emailAddressField')}</label>
      <div class="${readonlyCls}">${d.email}</div>
    </div>
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">${req}${t('settings.businessNameLabel')}</label>
      <input type="text" class="${inputCls}" data-field="business_name" value="${d.business_name || ''}" />
    </div>
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.phoneLabel')}</label>
      <input type="tel" class="${inputCls} max-w-[300px]" data-field="phone" value="${d.phone}" placeholder="+90 5XX XXX XX XX" />
    </div>
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">${req}${t('settings.countryRegion')}</label>
      <select class="${inputCls} bg-white cursor-pointer" data-field="country">${countryOptions(d.country)}</select>
    </div>
    <div class="mb-5">
      <label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.addressLabel')}</label>
      <input type="text" class="${inputCls}" data-field="address" value="${d.address || ''}" placeholder="${t('settings.addressPlaceholder') || 'Açık adres'}" />
    </div>
    <div class="mb-6">
      <label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.cityLabel')}</label>
      <input type="text" class="${inputCls} max-w-[300px]" data-field="city" value="${d.city || ''}" placeholder="${t('settings.cityPlaceholder') || 'Şehir'}" />
    </div>
  `;
}

// ── Render wrappers ──────────────────────────────────────────────

function renderView(d: ProfileData): string {
  const content = d.account_type === 'seller' ? sellerView(d) : buyerView(d);
  return `
    <div class="bg-white rounded-lg p-8 max-md:p-5 max-sm:px-4 max-sm:py-4" id="acc-edit-view">
      <h2 class="text-lg max-sm:text-base font-semibold m-0 mb-4" style="color:var(--color-text-heading, #111827)">${t('settings.editAccountTitle')}</h2>
      <div class="h-px bg-gray-200 mb-1"></div>
      ${content}
      <div class="mt-6 max-sm:mt-4">
        <button class="th-btn-outline w-full max-w-[280px] mx-auto block max-sm:max-w-full" type="button" id="acc-edit-toggle">${t('settings.editBtn')}</button>
      </div>
    </div>
  `;
}

function renderEdit(d: ProfileData): string {
  const content = d.account_type === 'seller' ? sellerEdit(d) : buyerEdit(d);
  return `
    <div class="bg-white rounded-lg p-8 max-md:p-5 max-sm:px-4 max-sm:py-4" id="acc-edit-form" style="display:none">
      <h2 class="text-lg max-sm:text-base font-semibold m-0 mb-6" style="color:var(--color-text-heading, #111827)">${t('settings.editAccountTitle')}</h2>
      <div class="h-px bg-gray-200 mb-6"></div>
      ${content}
      <div class="pt-4 border-t border-gray-100 flex items-center gap-3 max-sm:flex-col">
        <button class="th-btn px-8 max-sm:w-full" type="button" id="acc-edit-submit">${t('settings.submitBtn')}</button>
        <button class="text-[13px] font-medium bg-none border-none cursor-pointer hover:underline" style="color:var(--color-text-muted)" type="button" id="acc-edit-cancel">${t('settings.cancelAction')}</button>
      </div>
      <div id="acc-edit-message" class="mt-3 text-sm hidden"></div>
    </div>
  `;
}

// ── Component Export ─────────────────────────────────────────────

export function SettingsAccountEdit(): string {
  return `<div id="acc-edit-root">
    <div class="bg-white rounded-lg p-8 max-md:p-5 max-sm:px-4 max-sm:py-4 flex items-center justify-center min-h-[200px]">
      <span class="text-sm" style="color:var(--color-text-muted)">${t('settings.loading')}</span>
    </div>
  </div>`;
}

// ── Init ─────────────────────────────────────────────────────────

export function initSettingsAccountEdit(): void {
  const root = document.getElementById('acc-edit-root');
  if (!root) return;

  let current: ProfileData = { ...emptyProfile };

  async function loadAndRender() {
    current = await fetchProfile();
    root!.innerHTML = renderView(current) + renderEdit(current);
    bindEvents();
  }

  function rerender() {
    root!.innerHTML = renderView(current) + renderEdit(current);
    bindEvents();
  }

  function collectFormData(): Record<string, string> {
    const formEl = document.getElementById('acc-edit-form');
    if (!formEl) return {};
    const data: Record<string, string> = {};
    formEl.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-field]').forEach(el => {
      const field = el.dataset.field;
      if (field) data[field] = el.value;
    });
    return data;
  }

  function bindEvents() {
    const viewEl = document.getElementById('acc-edit-view');
    const formEl = document.getElementById('acc-edit-form');
    const editBtn = document.getElementById('acc-edit-toggle');
    const submitBtn = document.getElementById('acc-edit-submit');
    const cancelBtn = document.getElementById('acc-edit-cancel');

    editBtn?.addEventListener('click', () => {
      if (viewEl && formEl) { viewEl.style.display = 'none'; formEl.style.display = ''; }
    });
    cancelBtn?.addEventListener('click', () => {
      if (viewEl && formEl) { formEl.style.display = 'none'; viewEl.style.display = ''; }
    });

    submitBtn?.addEventListener('click', async () => {
      const data = collectFormData();
      if (!data.first_name?.trim() || !data.last_name?.trim()) {
        showMessage(t('settings.nameRequired'), 'error');
        return;
      }
      submitBtn.setAttribute('disabled', 'true');
      submitBtn.textContent = t('settings.saving');
      const ok = await saveProfile(data);
      if (ok) {
        // Merge edits into current
        Object.entries(data).forEach(([k, v]) => {
          (current as unknown as Record<string, unknown>)[k] = v;
        });
        rerender();
      } else {
        showMessage(t('settings.saveFailed'), 'error');
        submitBtn.removeAttribute('disabled');
        submitBtn.textContent = t('settings.submitBtn');
      }
    });
  }

  function showMessage(text: string, type: 'error' | 'success') {
    const el = document.getElementById('acc-edit-message');
    if (!el) return;
    el.textContent = text;
    el.className = `mt-3 text-sm ${type === 'error' ? 'text-red-500' : 'text-green-600'}`;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 4000);
  }

  loadAndRender();
}
