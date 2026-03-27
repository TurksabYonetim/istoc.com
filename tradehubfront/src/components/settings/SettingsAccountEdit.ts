/**
 * SettingsAccountEdit Component
 * 4-card Alibaba-style profile page backed by backend API.
 * Detects account type (buyer/seller) and shows role-specific fields.
 */

import { t } from '../../i18n';
import { api } from '../../utils/api';
import { validatePhone } from '../../utils/tr-validation';

const ICONS = {
  verified: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#22c55e"/><path d="M4.5 7l2 2 3.5-3.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5l2 2L5.5 12.5H3.5v-2l8-8z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  info: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#3b82f6" stroke-width="1.2"/><path d="M8 7v4M8 5h0" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round"/></svg>`,
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
  avatar?: string;
  // Business fields
  business_type?: string;
  company_name?: string;
  business_name?: string;
  address?: string;
  job_title?: string;
  website?: string;
  // More info
  selling_platforms?: string;
  year_established?: string;
  employee_count?: string;
  about_us?: string;
  // Sourcing (buyer only)
  industry_preferences?: string;
  sourcing_frequency?: string;
  annual_spending?: string;
  // Seller-specific
  seller_type?: string;
  tax_id?: string;
  tax_id_type?: string;
  tax_office?: string;
  city?: string;
  bank_name?: string;
  iban?: string;
  account_holder_name?: string;
  seller_status?: string;
  application_status?: string;
}

const emptyProfile: ProfileData = {
  member_id: '', account_type: 'buyer', first_name: '', last_name: '',
  email: '', phone: '', country: '',
};

// ── Dynamic Select Options from DocType Meta ────────────────────

const _optionsCache: Record<string, Record<string, string[]>> = {};

async function loadDocTypeSelectOptions(doctype: string): Promise<Record<string, string[]>> {
  if (_optionsCache[doctype]) return _optionsCache[doctype];
  try {
    const res = await api<{ message: Record<string, string[]> }>(
      `/method/tradehub_core.api.v1.auth.get_select_options?doctype=${encodeURIComponent(doctype)}`
    );
    _optionsCache[doctype] = res.message || {};
    return _optionsCache[doctype];
  } catch {
    return {};
  }
}

let selectOptions: Record<string, string[]> = {};

async function loadSelectOptionsForType(accountType: string): Promise<void> {
  const doctype = accountType === 'seller' ? 'Seller Profile' : 'Buyer Profile';
  selectOptions = await loadDocTypeSelectOptions(doctype);
}

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

// ── Helpers ──────────────────────────────────────────────────────

function maskEmail(email: string): string {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.substring(0, Math.min(3, local.length));
  return `${visible}***@${domain}`;
}

const inputCls = "w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";
const readonlyCls = "py-2.5 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50";
const labelCls = "block text-[13px] font-medium mb-1.5";

function viewRow(label: string, value: string | undefined | null, extra?: string): string {
  const display = value || `<span class="text-orange-500 text-xs font-medium">${t('settings.incompleteLabel')}</span>`;
  return `
    <div class="flex py-3 border-b border-gray-100 last:border-b-0 max-md:flex-col max-md:gap-0.5">
      <div class="w-[180px] flex-shrink-0 text-[13px] font-medium max-md:w-auto" style="color:var(--color-text-muted, #666666)">${label}</div>
      <div class="flex-1 min-w-0 text-sm flex items-center gap-2 flex-wrap" style="color:var(--color-text-heading, #111827)">${display}${extra || ''}</div>
    </div>
  `;
}

function renderSelectOpts(options: string[], selected: string): string {
  return ['', ...options].map(opt =>
    `<option value="${opt}" ${opt === selected ? 'selected' : ''}>${opt || t('settings.incompleteLabel')}</option>`
  ).join('');
}

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

// ── Profile Card Renderer ────────────────────────────────────────

function renderCard(cardId: string, title: string, icon: string, viewHtml: string, editHtml: string, hint?: string): string {
  return `
    <div class="bg-white rounded-lg overflow-hidden" id="card-${cardId}">
      <div class="flex items-center justify-between p-6 max-sm:p-4 pb-0">
        <h3 class="text-base font-semibold m-0 flex items-center gap-2" style="color:var(--color-text-heading, #111827)">
          ${icon} ${title}
        </h3>
        <button class="card-edit-btn inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 cursor-pointer transition-all hover:bg-gray-50" style="color:var(--color-text-muted, #666666)" data-card="${cardId}" title="${t('settings.editBtn')}">
          ${ICONS.edit}
        </button>
      </div>
      ${hint ? `<div class="mx-6 max-sm:mx-4 mt-3 flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-[13px] text-blue-700"><span class="flex-shrink-0 mt-0.5">${ICONS.info}</span><span>${hint}</span></div>` : ''}
      <div class="p-6 max-sm:p-4" id="card-${cardId}-view">${viewHtml}</div>
      <div class="p-6 max-sm:p-4 hidden" id="card-${cardId}-edit">
        ${editHtml}
        <div class="pt-4 mt-4 border-t border-gray-100 flex items-center gap-3 max-sm:flex-col">
          <button class="th-btn px-6 max-sm:w-full card-save-btn" type="button" data-card="${cardId}">${t('settings.submitBtn') || 'Kaydet'}</button>
          <button class="text-[13px] font-medium bg-none border-none cursor-pointer hover:underline card-cancel-btn" style="color:var(--color-text-muted)" type="button" data-card="${cardId}">${t('settings.cancelAction') || 'Vazgeç'}</button>
        </div>
        <div class="mt-3 text-sm hidden card-message" data-card="${cardId}"></div>
      </div>
    </div>
  `;
}

// ── Card Icons ───────────────────────────────────────────────────

const CARD_ICONS = {
  basic: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="12" rx="2" stroke="#6366f1" stroke-width="1.3"/><path d="M2 7h14" stroke="#6366f1" stroke-width="1.3"/></svg>`,
  business: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 6h12v8a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" stroke="#f59e0b" stroke-width="1.3"/><path d="M6 6V4a2 2 0 012-2h2a2 2 0 012 2v2" stroke="#f59e0b" stroke-width="1.3"/></svg>`,
  more: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="3" stroke="#10b981" stroke-width="1.3"/><path d="M6 6h6M6 9h6M6 12h4" stroke="#10b981" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  sourcing: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" stroke="#ec4899" stroke-width="1.3"/><path d="M6 9l2 2 4-4" stroke="#ec4899" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

// ── Buyer Cards ──────────────────────────────────────────────────

function buyerBasicView(d: ProfileData): string {
  const fullName = `${d.first_name} ${d.last_name}`.trim();
  const verifiedBadge = d.email_verified
    ? `<span class="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap" style="color:#22c55e">${ICONS.verified} ${t('settings.emailVerifiedText') || 'Verified'}</span>`
    : '';
  const avatarHtml = d.avatar
    ? `<img src="${d.avatar}" class="w-16 h-16 rounded-full object-cover border-2 border-gray-200" alt="avatar" />`
    : `<div class="w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-200 text-2xl font-bold text-white" style="background:linear-gradient(135deg, var(--color-primary-400, #e6b212) 0%, var(--color-primary-500, #cc9900) 100%)">${(fullName || '?')[0].toLowerCase()}</div>`;

  return `
    <div class="flex items-center gap-4 mb-4">${avatarHtml}<div>
      <div class="text-base font-bold" style="color:var(--color-text-heading)">${fullName || '--'}</div>
      <div class="text-xs" style="color:var(--color-text-muted)">Member ID: ${d.member_id} · ${t('settings.yearJoined') || 'Year Joined'}: ${new Date().getFullYear()}</div>
    </div></div>
    ${viewRow(t('settings.emailAddressField') || 'Email', maskEmail(d.email), verifiedBadge)}
    ${viewRow(t('settings.phoneLabel') || 'Phone', d.phone)}
    ${viewRow(t('settings.countryRegion') || 'Country', d.country)}
  `;
}

function buyerBasicEdit(d: ProfileData): string {
  return `
    <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-4">
      <div><label class="${labelCls}" style="color:var(--color-text-muted)">* ${t('settings.firstName') || 'Ad'}</label>
      <input type="text" class="${inputCls}" data-field="first_name" value="${d.first_name}" /></div>
      <div><label class="${labelCls}" style="color:var(--color-text-muted)">* ${t('settings.lastName') || 'Soyad'}</label>
      <input type="text" class="${inputCls}" data-field="last_name" value="${d.last_name}" /></div>
    </div>
    <div class="mb-4"><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.emailAddressField') || 'Email'}</label>
    <div class="${readonlyCls}">${d.email}</div></div>
    <div class="mb-4"><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.phoneLabel') || 'Telefon'}</label>
    <input type="tel" class="${inputCls} max-w-[300px]" data-field="phone" value="${d.phone}" placeholder="+90 5XX XXX XX XX" /></div>
    <div class="mb-4"><label class="${labelCls}" style="color:var(--color-text-muted)">* ${t('settings.countryRegion') || 'Ülke'}</label>
    <select class="${inputCls} bg-white cursor-pointer" data-field="country">${countryOptions(d.country)}</select></div>
  `;
}

function buyerBusinessView(d: ProfileData): string {
  return `
    ${viewRow(t('settings.businessTypeLabel'), d.business_type)}
    ${viewRow(t('settings.companyNameLabel') || t('settings.businessNameLabel'), d.company_name || d.business_name)}
    ${viewRow(t('settings.addressLabel') || 'Address', d.address)}
    ${viewRow(t('settings.jobTitleLabel'), d.job_title)}
    ${viewRow(t('settings.websiteLabel'), d.website)}
  `;
}

function buyerBusinessEdit(d: ProfileData): string {
  return `
    <div class="mb-4"><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.businessTypeLabel')}</label>
    <select class="${inputCls} bg-white cursor-pointer" data-field="business_type">${renderSelectOpts(selectOptions.business_type || [], d.business_type || '')}</select></div>
    <div class="mb-4"><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.companyNameLabel')}</label>
    <input type="text" class="${inputCls}" data-field="company_name" value="${d.company_name || d.business_name || ''}" /></div>
    <div class="mb-4"><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.addressLabel') || 'Address'}</label>
    <input type="text" class="${inputCls}" data-field="address" value="${d.address || ''}" /></div>
    <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-4">
      <div><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.jobTitleLabel')}</label>
      <input type="text" class="${inputCls}" data-field="job_title" value="${d.job_title || ''}" /></div>
      <div><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.websiteLabel')}</label>
      <input type="url" class="${inputCls}" data-field="website" value="${d.website || ''}" placeholder="https://" /></div>
    </div>
  `;
}

function moreInfoView(d: ProfileData): string {
  return `
    ${viewRow(t('settings.sellingPlatformsLabel'), d.selling_platforms)}
    ${viewRow(t('settings.yearEstablishedLabel'), d.year_established)}
    ${viewRow(t('settings.employeeCountLabel'), d.employee_count)}
    ${viewRow(t('settings.aboutUsLabel'), d.about_us)}
  `;
}

function moreInfoEdit(d: ProfileData): string {
  const ecOptions = selectOptions.employee_count || [];
  return `
    <div class="mb-4"><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.sellingPlatformsLabel')}</label>
    <input type="text" class="${inputCls}" data-field="selling_platforms" value="${d.selling_platforms || ''}" placeholder="Amazon, Trendyol, Hepsiburada..." /></div>
    <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-4">
      <div><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.yearEstablishedLabel')}</label>
      <input type="number" class="${inputCls}" data-field="year_established" value="${d.year_established || ''}" placeholder="2020" /></div>
      <div><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.employeeCountLabel')}</label>
      <select class="${inputCls} bg-white cursor-pointer" data-field="employee_count">${renderSelectOpts(ecOptions, d.employee_count || '')}</select></div>
    </div>
    <div class="mb-4"><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.aboutUsLabel')}</label>
    <textarea class="${inputCls} resize-none" rows="3" data-field="about_us" placeholder="${t('settings.aboutUsLabel')}">${d.about_us || ''}</textarea></div>
  `;
}

function sourcingPrefsView(d: ProfileData): string {
  return `
    ${viewRow(t('settings.industryPrefsLabel'), d.industry_preferences)}
    ${viewRow(t('settings.sourcingFreqLabel'), d.sourcing_frequency)}
    ${viewRow(t('settings.annualSpendingLabel'), d.annual_spending)}
  `;
}

function sourcingPrefsEdit(d: ProfileData): string {
  const sfOptions = selectOptions.sourcing_frequency || [];
  const asOptions = selectOptions.annual_spending || [];
  return `
    <div class="mb-4"><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.industryPrefsLabel')}</label>
    <input type="text" class="${inputCls}" data-field="industry_preferences" value="${d.industry_preferences || ''}" placeholder="${t('settings.industryPrefsLabel')}" /></div>
    <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-4">
      <div><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.sourcingFreqLabel')}</label>
      <select class="${inputCls} bg-white cursor-pointer" data-field="sourcing_frequency">${renderSelectOpts(sfOptions, d.sourcing_frequency || '')}</select></div>
      <div><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.annualSpendingLabel')}</label>
      <select class="${inputCls} bg-white cursor-pointer" data-field="annual_spending">${renderSelectOpts(asOptions, d.annual_spending || '')}</select></div>
    </div>
  `;
}

// ── Seller uses same basic/more cards, business card differs ─────

function sellerBasicView(d: ProfileData): string {
  const fullName = `${d.first_name} ${d.last_name}`.trim();
  const avatarHtml = d.avatar
    ? `<img src="${d.avatar}" class="w-16 h-16 rounded-full object-cover border-2 border-gray-200" alt="avatar" />`
    : `<div class="w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-200 text-2xl font-bold text-white" style="background:linear-gradient(135deg, var(--color-primary-400, #e6b212) 0%, var(--color-primary-500, #cc9900) 100%)">${(fullName || '?')[0].toLowerCase()}</div>`;

  return `
    <div class="flex items-center gap-4 mb-4">${avatarHtml}<div>
      <div class="text-base font-bold" style="color:var(--color-text-heading)">${fullName || '--'}</div>
      <div class="text-xs" style="color:var(--color-text-muted)">Member ID: ${d.member_id}</div>
    </div></div>
    ${viewRow(t('settings.emailAddressField') || 'Email', maskEmail(d.email))}
    ${viewRow(t('settings.phoneLabel') || 'Phone', d.phone)}
    ${viewRow(t('settings.countryRegion') || 'Country', d.country)}
  `;
}

function sellerBusinessView(d: ProfileData): string {
  return `
    ${viewRow(t('settings.businessNameLabel') || 'Business Name', d.business_name)}
    ${viewRow(t('settings.addressLabel') || 'Address', [d.address, d.city].filter(Boolean).join(', '))}
    ${viewRow(t('settings.jobTitleLabel'), d.job_title)}
    ${viewRow(t('settings.websiteLabel'), d.website)}
  `;
}

function sellerBusinessEdit(d: ProfileData): string {
  return `
    <div class="mb-4"><label class="${labelCls}" style="color:var(--color-text-muted)">* ${t('settings.businessNameLabel')}</label>
    <input type="text" class="${inputCls}" data-field="business_name" value="${d.business_name || ''}" /></div>
    <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-4">
      <div><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.addressLabel') || 'Address'}</label>
      <input type="text" class="${inputCls}" data-field="address" value="${d.address || ''}" /></div>
      <div><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.cityLabel') || 'City'}</label>
      <input type="text" class="${inputCls}" data-field="city" value="${d.city || ''}" /></div>
    </div>
    <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-4">
      <div><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.jobTitleLabel')}</label>
      <input type="text" class="${inputCls}" data-field="job_title" value="${d.job_title || ''}" /></div>
      <div><label class="${labelCls}" style="color:var(--color-text-muted)">${t('settings.websiteLabel')}</label>
      <input type="url" class="${inputCls}" data-field="website" value="${d.website || ''}" placeholder="https://" /></div>
    </div>
  `;
}

// ── Main Render ──────────────────────────────────────────────────

function renderAllCards(d: ProfileData): string {
  const isSeller = d.account_type === 'seller';
  const businessHint = t('settings.cardBusinessInfo') ? `Bu bölümü doldurun, tedarikçilerden daha iyi teklifler alın.` : '';
  const moreHint = businessHint;
  const sourcingHint = `Bu bölümü doldurun, ihtiyaçlarınıza uygun ürün önerileri görün.`;

  const basicView = isSeller ? sellerBasicView(d) : buyerBasicView(d);
  const basicEdit = buyerBasicEdit(d); // same edit form for both

  const businessView = isSeller ? sellerBusinessView(d) : buyerBusinessView(d);
  const businessEdit = isSeller ? sellerBusinessEdit(d) : buyerBusinessEdit(d);

  const cards = [
    renderCard('basic', t('settings.cardBasicInfo'), CARD_ICONS.basic, basicView, basicEdit),
    renderCard('business', t('settings.cardBusinessInfo'), CARD_ICONS.business, businessView, businessEdit, businessHint),
    renderCard('more', t('settings.cardMoreInfo'), CARD_ICONS.more, moreInfoView(d), moreInfoEdit(d), moreHint),
  ];

  cards.push(renderCard('sourcing', t('settings.cardSourcingPrefs'), CARD_ICONS.sourcing, sourcingPrefsView(d), sourcingPrefsEdit(d), sourcingHint));

  return cards.join('');
}

// ── Component Export ─────────────────────────────────────────────

export function SettingsAccountEdit(): string {
  return `<div id="acc-edit-root">
    <div class="bg-white rounded-lg p-8 max-md:p-5 max-sm:px-4 max-sm:py-4 flex items-center justify-center min-h-[200px]">
      <span class="text-sm" style="color:var(--color-text-muted)">${t('settings.loading') || 'Yükleniyor...'}</span>
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
    await Promise.all([loadSelectOptionsForType(current.account_type), fetchCountryList()]);
    root!.innerHTML = `<div class="flex flex-col gap-5">${renderAllCards(current)}</div>`;
    bindEvents();
  }

  function collectCardData(cardId: string): Record<string, string> {
    const cardEl = document.getElementById(`card-${cardId}-edit`);
    if (!cardEl) return {};
    const data: Record<string, string> = {};
    cardEl.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[data-field]').forEach(el => {
      const field = el.dataset.field;
      if (field) data[field] = el.value;
    });
    return data;
  }

  function showCardMessage(cardId: string, text: string, type: 'error' | 'success') {
    const el = document.querySelector(`.card-message[data-card="${cardId}"]`) as HTMLElement;
    if (!el) return;
    el.textContent = text;
    el.className = `mt-3 text-sm card-message ${type === 'error' ? 'text-red-500' : 'text-green-600'}`;
    el.dataset.card = cardId;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 4000);
  }

  function bindEvents() {
    // Edit buttons
    document.querySelectorAll<HTMLButtonElement>('.card-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cardId = btn.dataset.card!;
        const viewEl = document.getElementById(`card-${cardId}-view`);
        const editEl = document.getElementById(`card-${cardId}-edit`);
        if (viewEl && editEl) {
          viewEl.classList.add('hidden');
          editEl.classList.remove('hidden');
        }
      });
    });

    // Cancel buttons
    document.querySelectorAll<HTMLButtonElement>('.card-cancel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cardId = btn.dataset.card!;
        const viewEl = document.getElementById(`card-${cardId}-view`);
        const editEl = document.getElementById(`card-${cardId}-edit`);
        if (viewEl && editEl) {
          editEl.classList.add('hidden');
          viewEl.classList.remove('hidden');
        }
      });
    });

    // Save buttons
    document.querySelectorAll<HTMLButtonElement>('.card-save-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const cardId = btn.dataset.card!;
        const data = collectCardData(cardId);

        // Validate required fields
        if (data.first_name !== undefined && !data.first_name?.trim()) {
          showCardMessage(cardId, t('settings.nameRequired') || 'Ad gerekli', 'error');
          return;
        }
        if (data.last_name !== undefined && !data.last_name?.trim()) {
          showCardMessage(cardId, t('settings.nameRequired') || 'Soyad gerekli', 'error');
          return;
        }
        if (data.phone?.trim() && !validatePhone(data.phone)) {
          showCardMessage(cardId, t('settings.invalidPhone') || 'Geçersiz telefon', 'error');
          return;
        }

        btn.setAttribute('disabled', 'true');
        btn.textContent = t('settings.saving') || 'Kaydediliyor...';

        const ok = await saveProfile(data);
        if (ok) {
          // Merge into current
          Object.entries(data).forEach(([k, v]) => {
            (current as unknown as Record<string, unknown>)[k] = v;
          });
          // Re-render all cards
          root!.innerHTML = `<div class="flex flex-col gap-5">${renderAllCards(current)}</div>`;
          bindEvents();
        } else {
          showCardMessage(cardId, t('settings.saveFailed') || 'Kayıt başarısız', 'error');
          btn.removeAttribute('disabled');
          btn.textContent = t('settings.submitBtn') || 'Kaydet';
        }
      });
    });
  }

  loadAndRender();
}
