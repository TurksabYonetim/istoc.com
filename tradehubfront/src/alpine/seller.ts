import Alpine from 'alpinejs'
import { t } from '../i18n'
import { getBaseUrl } from '../components/auth/AuthLayout'
import { callMethod } from '../utils/api'
import { getSessionUser, logout } from '../utils/auth'

// ─── Sell Page (registration form) ────────────────────────────────────
Alpine.data('sellPage', () => ({
  currentStep: 1,
  formData: {
    companyName: '',
    businessType: '',
    taxNumber: '',
    contactName: '',
    email: '',
    phone: '',
    mainCategories: [] as string[],
    productCount: '',
    termsAccepted: false,
  },
  formErrors: {} as Record<string, string>,
  submitted: false,
  submitting: false,
  submitError: '',

  get businessTypes() { return t('sellerForm.businessTypes', { returnObjects: true }) as unknown as string[]; },
  get categoryOptions() { return t('sellerForm.categoryOptions', { returnObjects: true }) as unknown as string[]; },

  validateStep(step: number): boolean {
    this.formErrors = {};
    if (step === 1) {
      if (!this.formData.companyName.trim()) this.formErrors.companyName = t('sellerForm.companyNameRequired');
      if (!this.formData.businessType) this.formErrors.businessType = t('sellerForm.businessTypeRequired');
      if (!this.formData.taxNumber.trim()) this.formErrors.taxNumber = t('sellerForm.taxNumberRequired');
    } else if (step === 2) {
      if (!this.formData.contactName.trim()) this.formErrors.contactName = t('sellerForm.contactNameRequired');
      if (!this.formData.email.trim()) this.formErrors.email = t('sellerForm.emailRequired');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) this.formErrors.email = t('sellerForm.emailInvalid');
      if (!this.formData.phone.trim()) this.formErrors.phone = t('sellerForm.phoneRequired');
    } else if (step === 3) {
      if (this.formData.mainCategories.length === 0) this.formErrors.mainCategories = t('sellerForm.categoryMinOne');
    } else if (step === 4) {
      if (!this.formData.termsAccepted) this.formErrors.termsAccepted = t('sellerForm.termsRequired');
    }
    return Object.keys(this.formErrors).length === 0;
  },

  nextStep() {
    if (this.validateStep(this.currentStep)) this.currentStep++;
  },

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  },

  toggleCategory(cat: string) {
    const idx = this.formData.mainCategories.indexOf(cat);
    if (idx === -1) this.formData.mainCategories.push(cat);
    else this.formData.mainCategories.splice(idx, 1);
  },

  async submitForm() {
    if (!this.validateStep(4)) return;
    this.submitting = true;
    this.submitError = '';

    try {
      // Kullanıcı oturum durumunu kontrol et
      type CurrentUser = { is_guest: boolean }
      const session = await callMethod<CurrentUser>('tradehub_core.api.auth.get_current_user')

      if (session.is_guest) {
        // Oturum yoksa register sayfasına yönlendir, form verisini sakla
        sessionStorage.setItem('seller_signup_pending', JSON.stringify(this.formData))
        window.location.href = `${getBaseUrl()}pages/auth/register.html`
        return
      }

      // Oturum varsa become_seller çağır
      const sellerType = ['Şahıs', 'Individual', 'Bireysel'].includes(this.formData.businessType)
        ? 'Individual'
        : 'Corporate'

      await callMethod('tradehub_core.api.seller.become_seller', {
        seller_name: this.formData.contactName || this.formData.companyName,
        seller_type: sellerType,
        company_name: this.formData.companyName,
        tax_id: this.formData.taxNumber,
        phone: this.formData.phone,
      }, true)

      this.submitted = true

    } catch (e) {
      this.submitError = (e as Error).message || t('sellerForm.submitError') || 'Bir hata oluştu'
    } finally {
      this.submitting = false
    }
  },
}));

// ─── Sell Pricing ──────────────────────────────────────────────────────
Alpine.data('sellPricing', () => ({
  billingPeriod: 'monthly' as 'monthly' | 'yearly',
  faqOpen: [false, false, false, false, false] as boolean[],
  get faqItems() {
    return [
      { question: t('pricingFaq.q1'), answer: t('pricingFaq.a1'), open: this.faqOpen[0] },
      { question: t('pricingFaq.q2'), answer: t('pricingFaq.a2'), open: this.faqOpen[1] },
      { question: t('pricingFaq.q3'), answer: t('pricingFaq.a3'), open: this.faqOpen[2] },
      { question: t('pricingFaq.q4'), answer: t('pricingFaq.a4'), open: this.faqOpen[3] },
      { question: t('pricingFaq.q5'), answer: t('pricingFaq.a5'), open: this.faqOpen[4] },
    ];
  },
  selectedPlan: '',

  toggleFaq(index: number) {
    this.faqOpen[index] = !this.faqOpen[index];
  },

  selectPlan(name: string) {
    this.selectedPlan = name;
    window.location.href = `${getBaseUrl()}pages/seller/sell.html`;
  },
}));

Alpine.data('sellerStorefront', () => ({
  activeTab: 'overview' as string,
  mobileMenuOpen: false,
  seller: null as Record<string, any> | null,
  navCategories: [] as Record<string, any>[],
  loading: true,

  async init() {
    const code = new URLSearchParams(window.location.search).get('seller');
    if (!code) { this.loading = false; return; }
    const apiBase = (window as any).API_BASE || '/api';
    try {
      const [sellerRes, catRes] = await Promise.all([
        fetch(`${apiBase}/method/tradehub_core.api.seller.get_seller?slug=${code}`, { credentials: 'omit' }).then(r => r.json()),
        fetch(`${apiBase}/method/tradehub_core.api.seller.get_seller_categories?seller_code=${code}`, { credentials: 'omit' }).then(r => r.json()),
      ]);
      this.seller = sellerRes.message || null;
      this.navCategories = catRes.message?.categories || [];
    } catch (e) {}
    this.loading = false;
  },

  get sellerYears() {
    if (!this.seller?.joined_at) return '';
    const years = new Date().getFullYear() - new Date((this.seller as any).joined_at).getFullYear();
    return years > 0 ? `${years}yrs` : '';
  },

  get sellerLocation() {
    return [(this.seller as any)?.city, (this.seller as any)?.country].filter(Boolean).join(', ');
  },

  setTab(tab: string) {
    this.activeTab = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  },
}));

// ─── Seller Dashboard ───────────────────────────────────────────────────────
Alpine.data('sellerDashboard', () => ({
  loading: true,
  isAuthenticated: false,
  isSeller: false,
  activeTab: 'account' as string,

  profile: {} as Record<string, unknown>,
  products: [] as Record<string, unknown>[],
  categories: [] as Record<string, unknown>[],
  gallery: [] as { name: string; image: string; caption: string }[],
  galleryNewUrl: '',
  galleryNewCaption: '',
  galleryAdding: false,

  tabs: [
    { id: 'account',    label: 'Hesabım',        icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>' },
    { id: 'reviews',    label: 'Yorumlar',        icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>' },
    { id: 'products',   label: 'Ürünler',         icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
    { id: 'categories', label: 'Kategoriler',     icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>' },
    { id: 'gallery',    label: 'Galeri',          icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' },
    { id: 'company',    label: 'Şirket Profili',  icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>' },
    { id: 'contact',    label: 'İletişim',        icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>' },
  ],

  form: {
    account: { seller_name: '', phone: '', website: '', city: '', district: '', postal_code: '', slogan: '', description: '', logo: '', banner_image: '' } as Record<string, unknown>,
    company: { company_name: '', business_type: '', founded_year: '', staff_count: '', annual_revenue: '', factory_size: '', tax_id: '', tax_office: '', main_markets: '' } as Record<string, unknown>,
    contact: { phone: '', website: '', address_line1: '', address_line2: '', city: '', district: '', postal_code: '', iban: '' } as Record<string, unknown>,
  },

  saving: { account: false, company: false, contact: false, gallery: false } as Record<string, boolean>,

  toast: { show: false, message: '', type: 'success' as 'success' | 'error' },

  productModal: {
    open: false,
    saving: false,
    editId: null as string | null,
    data: { product_name: '', description: '', image: '', price_min: 0, price_max: 0, moq: 1, moq_unit: 'Adet', category: '', is_featured: false, status: 'Active' } as Record<string, unknown>,
  },

  categoryModal: {
    open: false,
    saving: false,
    editId: null as string | null,
    data: { category_name: '', image: '', sort_order: 0 } as Record<string, unknown>,
  },

  async init() {
    try {
      const res = await fetch('/api/method/tradehub_core.api.auth.get_current_user', { credentials: 'include' });
      const data = await res.json() as { message: { is_guest: boolean; is_seller?: boolean; seller?: Record<string, unknown> } };
      const user = data.message;

      if (user.is_guest) { this.loading = false; return; }
      this.isAuthenticated = true;

      if (!user.is_seller) { this.loading = false; return; }
      this.isSeller = true;

      // Profil yükle
      const profileRes = await fetch('/api/method/tradehub_core.api.seller.get_my_profile', {
        method: 'POST', credentials: 'include',
        headers: { 'X-Frappe-CSRF-Token': this._csrf() },
      });
      const profileData = await profileRes.json() as { message: Record<string, unknown> };
      this.profile = profileData.message;

      // Form alanlarını doldur
      const p = this.profile;
      this.form.account = { seller_name: p.seller_name, phone: p.phone, website: p.website, city: p.city, district: p.district, postal_code: p.postal_code, slogan: p.slogan || '', description: p.description, logo: p.logo, banner_image: p.banner_image };
      this.form.company = { company_name: p.company_name, business_type: p.business_type || 'Manufacturer', founded_year: p.founded_year || '', staff_count: p.staff_count || '', annual_revenue: p.annual_revenue || '', factory_size: p.factory_size || '', tax_id: p.tax_id, tax_office: p.tax_office, main_markets: p.main_markets || '' };
      this.form.contact = { phone: p.phone, website: p.website, address_line1: p.address_line1, address_line2: p.address_line2, city: p.city, district: p.district, postal_code: p.postal_code, iban: p.iban };

      // Ürün, kategori ve galeriyi yükle
      await Promise.all([this.loadProducts(), this.loadCategories(), this.loadGallery()]);

    } catch {
      // session hatası
    } finally {
      this.loading = false;
    }
  },

  _csrf(): string {
    const m = document.cookie.match(/csrftoken=([^;]+)/);
    return m ? m[1] : 'fetch';
  },

  async _post(method: string, body: Record<string, unknown> = {}): Promise<unknown> {
    const res = await fetch(`/api/method/${method}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': this._csrf() },
      body: JSON.stringify(body),
    });
    const data = await res.json() as { message: unknown; exc?: string };
    if (!res.ok) throw new Error((data as { exception?: string }).exception || 'Hata');
    return data.message;
  },

  _showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast = { show: true, message, type };
    setTimeout(() => { this.toast.show = false; }, 3500);
  },

  async saveSection(section: 'account' | 'company' | 'contact') {
    this.saving[section] = true;
    try {
      const data = { ...this.form[section] };
      await this._post('tradehub_core.api.seller.update_profile', { data });
      // profile'ı güncelle
      const pr = await this._post('tradehub_core.api.seller.get_my_profile') as Record<string, unknown>;
      this.profile = pr;
      this._showToast('Değişiklikler kaydedildi');
    } catch (e) {
      this._showToast((e as Error).message || 'Kayıt başarısız', 'error');
    } finally {
      this.saving[section] = false;
    }
  },

  // ─── Ürünler ───────────────────────────────────────────────
  async loadProducts() {
    const data = await this._post('tradehub_core.api.seller.get_products') as Record<string, unknown>[];
    this.products = data;
  },

  openProductModal(product: Record<string, unknown> | null) {
    if (product) {
      this.productModal.editId = product.name as string;
      this.productModal.data = { ...product };
    } else {
      this.productModal.editId = null;
      this.productModal.data = { product_name: '', description: '', image: '', price_min: 0, price_max: 0, moq: 1, moq_unit: 'Adet', category: '', is_featured: false, status: 'Active' };
    }
    this.productModal.open = true;
  },

  async saveProduct() {
    if (!this.productModal.data.product_name) {
      this._showToast('Ürün adı zorunludur', 'error'); return;
    }
    this.productModal.saving = true;
    try {
      if (this.productModal.editId) {
        await this._post('tradehub_core.api.seller.update_product', { product_id: this.productModal.editId, data: this.productModal.data });
      } else {
        await this._post('tradehub_core.api.seller.create_product', { data: this.productModal.data });
      }
      await this.loadProducts();
      this.productModal.open = false;
      this._showToast(this.productModal.editId ? 'Ürün güncellendi' : 'Ürün eklendi');
    } catch (e) {
      this._showToast((e as Error).message || 'Hata', 'error');
    } finally {
      this.productModal.saving = false;
    }
  },

  async deleteProduct(id: string) {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    try {
      await this._post('tradehub_core.api.seller.delete_product', { product_id: id });
      await this.loadProducts();
      this._showToast('Ürün silindi');
    } catch (e) {
      this._showToast((e as Error).message || 'Silme başarısız', 'error');
    }
  },

  getCategoryName(categoryId: string): string {
    const cat = (this.categories as Record<string, unknown>[]).find((c) => c.name === categoryId);
    return cat ? (cat.category_name as string) : '';
  },

  // ─── Kategoriler ───────────────────────────────────────────
  async loadCategories() {
    const data = await this._post('tradehub_core.api.seller.get_categories') as Record<string, unknown>[];
    this.categories = data;
  },

  openCategoryModal(cat: Record<string, unknown> | null) {
    if (cat) {
      this.categoryModal.editId = cat.name as string;
      this.categoryModal.data = { ...cat };
    } else {
      this.categoryModal.editId = null;
      this.categoryModal.data = { category_name: '', image: '', sort_order: 0 };
    }
    this.categoryModal.open = true;
  },

  async saveCategory() {
    if (!this.categoryModal.data.category_name) {
      this._showToast('Kategori adı zorunludur', 'error'); return;
    }
    this.categoryModal.saving = true;
    try {
      if (this.categoryModal.editId) {
        await this._post('tradehub_core.api.seller.update_category', { category_id: this.categoryModal.editId, data: this.categoryModal.data });
      } else {
        await this._post('tradehub_core.api.seller.create_category', { data: this.categoryModal.data });
      }
      await this.loadCategories();
      this.categoryModal.open = false;
      this._showToast(this.categoryModal.editId ? 'Kategori güncellendi' : 'Kategori eklendi');
    } catch (e) {
      this._showToast((e as Error).message || 'Hata', 'error');
    } finally {
      this.categoryModal.saving = false;
    }
  },

  async deleteCategory(id: string) {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;
    try {
      await this._post('tradehub_core.api.seller.delete_category', { category_id: id });
      await this.loadCategories();
      this._showToast('Kategori silindi');
    } catch (e) {
      this._showToast((e as Error).message || 'Silme başarısız', 'error');
    }
  },

  // ─── Galeri ────────────────────────────────────────────────
  async loadGallery() {
    try {
      const data = await this._post('tradehub_core.api.seller.get_gallery') as { name: string; image: string; caption: string }[];
      this.gallery = data;
    } catch {
      this.gallery = [];
    }
  },

  async addGalleryImage() {
    if (!this.galleryNewUrl.trim()) {
      this._showToast('Görsel URL giriniz', 'error'); return;
    }
    if (this.gallery.length >= 20) {
      this._showToast('Maksimum 20 fotoğraf yükleyebilirsiniz', 'error'); return;
    }
    this.galleryAdding = true;
    try {
      const data = await this._post('tradehub_core.api.seller.add_gallery_image', {
        image_url: this.galleryNewUrl.trim(),
        caption: this.galleryNewCaption.trim(),
      }) as { name: string; image: string; caption: string }[];
      this.gallery = data;
      this.galleryNewUrl = '';
      this.galleryNewCaption = '';
      this._showToast('Fotoğraf eklendi');
    } catch (e) {
      this._showToast((e as Error).message || 'Hata', 'error');
    } finally {
      this.galleryAdding = false;
    }
  },

  async removeGalleryImage(rowName: string) {
    if (!confirm('Bu fotoğrafı kaldırmak istediğinizden emin misiniz?')) return;
    try {
      await this._post('tradehub_core.api.seller.remove_gallery_image', { row_name: rowName });
      this.gallery = this.gallery.filter((g) => g.name !== rowName);
      this._showToast('Fotoğraf kaldırıldı');
    } catch (e) {
      this._showToast((e as Error).message || 'Hata', 'error');
    }
  },
}));

// ─── Application Pending Page ─────────────────────────────────────────
Alpine.data('applicationPendingPage', () => ({
  status: 'loading' as string,

  async init() {
    const user = await getSessionUser();
    if (!user) {
      window.location.replace('/pages/auth/login.html');
      return;
    }

    // No seller application at all — not a seller
    if (!user.seller_application_status && !user.has_seller_profile) {
      window.location.href = '/';
      return;
    }

    // Show the application status dynamically
    // Pending application takes priority over profile status
    if (user.pending_seller_application) {
      this.status = user.seller_application_status || 'Under Review';
    } else if (user.has_seller_profile) {
      this.status = 'Approved';
    } else {
      this.status = user.seller_application_status || 'Draft';
    }
  },

  async doLogout() {
    await logout();
    window.location.href = '/';
  },
}));
