import Alpine from 'alpinejs'
import { t } from '../i18n'
import { getBaseUrl } from '../components/auth/AuthLayout'

Alpine.data('helpCenter', () => ({
  searchQuery: '',
  searchActive: false,
  searchResults: [] as string[],
  activeTab: 'account',
  activeLearningCard: '' as string,

  get popularSearches() {
    return [t('helpCenter.search1'), t('helpCenter.search2'), t('helpCenter.search3'), t('helpCenter.search4')];
  },

  get learningCards() {
    return [
      {
        id: 'sourcing',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" viewBox="0 0 64 64" fill="none">
        <circle cx="26" cy="26" r="18" stroke="#FF8C00" stroke-width="4" fill="#FFF3E0"/>
        <path d="M39 39 L54 54" stroke="#FF8C00" stroke-width="5" stroke-linecap="round"/>
        <path d="M20 26 L26 32 L34 22" stroke="#FF8C00" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
        title: t('helpCenter.sourcing'),
        subtitle: t('helpCenter.sourcingDesc'),
      },
      {
        id: 'assurance',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" viewBox="0 0 64 64" fill="none">
        <path d="M32 6L10 16v16c0 12 9.8 22.4 22 25 12.2-2.6 22-13 22-25V16L32 6z" fill="#FFF3E0" stroke="#FF8C00" stroke-width="4"/>
        <circle cx="32" cy="30" r="8" fill="#FF8C00" opacity="0.3"/>
        <path d="M26 30l4 4 8-8" stroke="#FF8C00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M28 18h8M28 42h8" stroke="#FF8C00" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
      </svg>`,
        title: t('helpCenter.tradeAssurance'),
        subtitle: t('helpCenter.tradeAssuranceDesc'),
      },
      {
        id: 'app',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" viewBox="0 0 64 64" fill="none">
        <rect x="18" y="6" width="28" height="52" rx="5" fill="#FFF3E0" stroke="#FF8C00" stroke-width="4"/>
        <rect x="24" y="14" width="16" height="10" rx="2" fill="#FF8C00" opacity="0.3"/>
        <circle cx="32" cy="50" r="3" fill="#FF8C00"/>
        <path d="M26 30h12M26 38h8" stroke="#FF8C00" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`,
        title: t('helpCenter.downloadApp'),
        subtitle: t('helpCenter.downloadAppDesc'),
      },
      {
        id: 'logistics',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" viewBox="0 0 64 64" fill="none">
        <rect x="6" y="20" width="36" height="26" rx="3" fill="#FFF3E0" stroke="#FF8C00" stroke-width="3.5"/>
        <path d="M42 30h10l6 10v10H42V30z" fill="#FFF3E0" stroke="#FF8C00" stroke-width="3.5"/>
        <circle cx="16" cy="50" r="5" fill="#FF8C00"/>
        <circle cx="48" cy="50" r="5" fill="#FF8C00"/>
        <path d="M10 20V14a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v6" stroke="#FF8C00" stroke-width="3" stroke-linecap="round"/>
      </svg>`,
        title: t('helpCenter.logistics'),
        subtitle: t('helpCenter.logisticsDesc'),
      },
    ];
  },

  get tabs() {
    return [
      {
        id: 'account',
        label: t('helpCenter.tabAccount'),
        icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>`,
        questions: [
          t('helpCenter.q_account_1'),
          t('helpCenter.q_account_2'),
          t('helpCenter.q_account_3'),
          t('helpCenter.q_account_4'),
          t('helpCenter.q_account_5'),
          t('helpCenter.q_account_6'),
          t('helpCenter.q_account_7'),
          t('helpCenter.q_account_8'),
          t('helpCenter.q_account_9'),
        ],
      },
      {
        id: 'sourcing',
        label: t('helpCenter.tabSourcing'),
        icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.6-5.15a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"/></svg>`,
        questions: [
          t('helpCenter.q_sourcing_1'),
          t('helpCenter.q_sourcing_2'),
          t('helpCenter.q_sourcing_3'),
          t('helpCenter.q_sourcing_4'),
          t('helpCenter.q_sourcing_5'),
          t('helpCenter.q_sourcing_6'),
          t('helpCenter.q_sourcing_7'),
          t('helpCenter.q_sourcing_8'),
          t('helpCenter.q_sourcing_9'),
        ],
      },
      {
        id: 'negotiation',
        label: t('helpCenter.tabNegotiation'),
        icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/></svg>`,
        questions: [
          t('helpCenter.q_negotiation_1'),
          t('helpCenter.q_negotiation_2'),
          t('helpCenter.q_negotiation_3'),
          t('helpCenter.q_negotiation_4'),
          t('helpCenter.q_negotiation_5'),
          t('helpCenter.q_negotiation_6'),
        ],
      },
      {
        id: 'payment',
        label: t('helpCenter.tabPayment'),
        icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/></svg>`,
        questions: [
          t('helpCenter.q_payment_1'),
          t('helpCenter.q_payment_2'),
          t('helpCenter.q_payment_3'),
          t('helpCenter.q_payment_4'),
          t('helpCenter.q_payment_5'),
          t('helpCenter.q_payment_6'),
          t('helpCenter.q_payment_7'),
          t('helpCenter.q_payment_8'),
          t('helpCenter.q_payment_9'),
        ],
      },
      {
        id: 'after-sales',
        label: t('helpCenter.tabAfterSales'),
        icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg>`,
        questions: [
          t('helpCenter.q_aftersales_1'),
          t('helpCenter.q_aftersales_2'),
          t('helpCenter.q_aftersales_3'),
          t('helpCenter.q_aftersales_4'),
          t('helpCenter.q_aftersales_5'),
          t('helpCenter.q_aftersales_6'),
        ],
      },
      {
        id: 'self-service',
        label: t('helpCenter.tabSelfService'),
        icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"/></svg>`,
        questions: [
          t('helpCenter.q_selfservice_1'),
          t('helpCenter.q_selfservice_2'),
          t('helpCenter.q_selfservice_3'),
          t('helpCenter.q_selfservice_4'),
          t('helpCenter.q_selfservice_5'),
          t('helpCenter.q_selfservice_6'),
        ],
      },
    ];
  },

  init() {
    // Initialize with first learning card active
    this.activeLearningCard = 'sourcing';
  },

  doSearch() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return;
    this.searchActive = true;

    // Flat-map all questions from all tabs and filter
    const allQuestions = this.tabs.flatMap((t: any) => t.questions);
    this.searchResults = allQuestions.filter((question: string) =>
      question.toLowerCase().includes(q)
    );
  },

  clearSearch() {
    this.searchQuery = '';
    this.searchActive = false;
    this.searchResults = [];
  },

  selectLearningCard(card: any) {
    this.activeLearningCard = card.id;
    // Scroll to matching tab if it exists
    const matchTab = this.tabs.find((t: any) => t.id === card.id);
    if (matchTab) this.activeTab = card.id;
  },
}));


Alpine.data('faqPage', () => ({
  searchQuery: '',
  activeCategory: 'all',

  get categories() {
    return [
      { id: 'all', label: t('faq.allCategories') },
      { id: 'intro', label: t('faq.intro') },
      { id: 'account', label: t('faq.account') },
      { id: 'sourcing', label: t('faq.sourcing') },
      { id: 'negotiation', label: t('faq.negotiation') },
      { id: 'place-order', label: t('faq.placeOrder') },
      { id: 'payment', label: t('faq.payment') },
      { id: 'tax', label: t('faq.tax') },
      { id: 'shipping', label: t('faq.shipping') },
      { id: 'receipt', label: t('faq.receipt') },
      { id: 'inspection', label: t('faq.inspection') },
      { id: 'after-sales', label: t('faq.afterSales') },
      { id: 'feedback', label: t('faq.feedback') },
      { id: 'security', label: t('faq.security') },
      { id: 'others', label: t('faq.others') },
      { id: 'promotions', label: t('faq.promotions') },
      { id: 'guaranteed', label: t('faq.guaranteed') },
      { id: 'app-settings', label: t('faq.appSettings') },
      { id: 'localization', label: t('faq.localization') },
    ];
  },

  get allCategoryCards() {
    return [
      {
        id: 'intro', label: t('faq.intro'),
        subs: [
          { label: t('faq.introDesc') },
          { label: t('faq.introMembership'), highlight: true },
        ],
      },
      {
        id: 'account', label: t('faq.account'),
        subs: [
          { label: t('faq.accountSettings') },
          { label: t('faq.accountCancelReactivate') },
          { label: t('faq.accountLogin'), highlight: true },
          { label: t('faq.accountRegister') },
          { label: t('faq.accountBecomeSeller') },
        ],
      },
      {
        id: 'sourcing', label: t('faq.sourcing'),
        subs: [
          { label: t('faq.sourcingSearch') },
          { label: t('faq.sourcingSupplierEval') },
          { label: t('faq.sourcingTradeInfo'), highlight: true },
          { label: t('faq.sourcingRecommender'), highlight: true },
          { label: t('faq.sourcingAiApp') },
          { label: t('faq.sourcingSourcing') },
        ],
      },
      {
        id: 'negotiation', label: t('faq.negotiation'),
        subs: [
          { label: t('faq.negotiationRfq') },
          { label: t('faq.negotiationMessages') },
          { label: t('faq.negotiationOtherIssues'), highlight: true },
        ],
      },
      {
        id: 'place-order', label: t('faq.placeOrder'),
        subs: [
          { label: t('faq.placeOrderTradeAssurance') },
          { label: t('faq.placeOrderPlace') },
          { label: t('faq.placeOrderConfirm') },
          { label: t('faq.placeOrderManage') },
        ],
      },
      {
        id: 'payment', label: t('faq.payment'),
        subs: [
          { label: t('faq.paymentOrderPayment'), highlight: true },
          { label: t('faq.paymentReceipt') },
          { label: t('faq.paymentFinancial') },
          { label: t('faq.paymentPayment') },
          { label: t('faq.paymentTypes') },
        ],
      },
      {
        id: 'tax', label: t('faq.tax'),
        subs: [
          { label: t('faq.taxSubmitInfo') },
          { label: t('faq.taxTypes') },
          { label: t('faq.taxInvoice') },
          { label: t('faq.taxVerifyInfo') },
          { label: t('faq.taxOrderManage') },
          { label: t('faq.taxRefund'), highlight: true },
        ],
      },
      {
        id: 'shipping', label: t('faq.shipping'),
        subs: [
          { label: t('faq.shippingShipping') },
          { label: t('faq.shippingLogistics'), highlight: true },
          { label: t('faq.shippingMaersk') },
          { label: t('faq.shippingImportFees') },
        ],
      },
      {
        id: 'receipt', label: t('faq.receipt'),
        subs: [
          { label: t('faq.receiptDelivery') },
          { label: t('faq.receiptCompletion') },
        ],
      },
      {
        id: 'inspection', label: t('faq.inspection'),
        subs: [
          { label: t('faq.inspectionServices'), highlight: true },
          { label: t('faq.inspectionMonitoring') },
        ],
      },
      {
        id: 'after-sales', label: t('faq.afterSales'),
        subs: [
          { label: t('faq.afterSalesDispute') },
          { label: t('faq.afterSalesReturn'), highlight: true },
          { label: t('faq.afterSalesDisputeProcess') },
          { label: t('faq.afterSalesGoodsIssue') },
          { label: t('faq.afterSalesDisputeRules') },
          { label: t('faq.afterSalesRefund') },
        ],
      },
      {
        id: 'feedback', label: t('faq.feedback'),
        subs: [
          { label: t('faq.feedbackManagement'), highlight: true },
          { label: t('faq.feedbackRules') },
        ],
      },
      {
        id: 'security', label: t('faq.security'),
        subs: [
          { label: t('faq.securityFraud') },
          { label: t('faq.securityIpr') },
        ],
      },
      {
        id: 'others', label: t('faq.others'),
        subs: [
          { label: t('faq.othersCustomerService') },
          { label: t('faq.othersUnclearConcern') },
          { label: t('faq.othersOfflineService') },
        ],
      },
      {
        id: 'promotions', label: t('faq.promotions'),
        subs: [
          { label: t('faq.promotionsShoppingGuide') },
          { label: t('faq.promotionsScenario'), highlight: true },
          { label: t('faq.promotionsSuper'), highlight: true },
          { label: t('faq.promotionsPayment') },
          { label: t('faq.promotionsOtherIssues') },
        ],
      },
      {
        id: 'guaranteed', label: t('faq.guaranteed'),
        subs: [
          { label: t('faq.guaranteedShipping'), highlight: true },
          { label: t('faq.guaranteedAfterSales') },
          { label: t('faq.guaranteedPreSales'), highlight: true },
          { label: t('faq.guaranteedPlaceOrder') },
          { label: t('faq.guaranteedOverseasWarehouse') },
        ],
      },
      {
        id: 'app-settings', label: t('faq.appSettings'),
        subs: [
          { label: t('faq.appSettingsLabel') },
        ],
      },
      {
        id: 'localization', label: t('faq.localization'),
        subs: [
          { label: t('faq.localizationSettings'), highlight: true },
        ],
      },
    ];
  },

  get activeCategoryLabel(): string {
    const cat = (this.categories as any[]).find((c: any) => c.id === this.activeCategory);
    return cat ? cat.label : t('faq.allCategories');
  },

  get visibleCategories(): any[] {
    const q = this.searchQuery.trim().toLowerCase();
    let cards = this.allCategoryCards as any[];

    // Filter by sidebar selection
    if (this.activeCategory !== 'all') {
      cards = cards.filter((c: any) => c.id === this.activeCategory);
    }

    // Filter by search query
    if (q) {
      cards = cards.filter((c: any) =>
        c.label.toLowerCase().includes(q) ||
        c.subs.some((s: any) => s.label.toLowerCase().includes(q))
      );
    }

    return cards;
  },

  init() { },

  selectCategory(id: string) {
    this.activeCategory = id;
    this.searchQuery = '';
  },

  doSearch() {
    if (this.searchQuery.trim()) {
      this.activeCategory = 'all';
    }
  },
}));

// ─── Contact Page ──────────────────────────────────────────────────────
Alpine.data('contactPage', () => ({
  name: '',
  email: '',
  subject: '',
  message: '',
  attachment: null as File | null,
  formSubmitting: false,
  formSubmitted: false,
  errors: {} as Record<string, string>,

  get subjectOptions() {
    return [
      t('contactForm.subjectOrder'),
      t('contactForm.subjectPayment'),
      t('contactForm.subjectShipping'),
      t('contactForm.subjectAccount'),
      t('contactForm.subjectProductQuality'),
      t('contactForm.subjectOther'),
    ];
  },

  validateForm(): boolean {
    this.errors = {};
    if (!this.name.trim()) this.errors.name = t('contactForm.nameRequired');
    if (!this.email.trim()) this.errors.email = t('contactForm.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) this.errors.email = t('contactForm.emailInvalid');
    if (!this.subject) this.errors.subject = t('contactForm.subjectRequired');
    if (!this.message.trim()) this.errors.message = t('contactForm.messageRequired');
    return Object.keys(this.errors).length === 0;
  },

  submitForm() {
    if (!this.validateForm()) return;
    this.formSubmitting = true;
    setTimeout(() => {
      this.formSubmitting = false;
      this.formSubmitted = true;
    }, 1500);
  },

  resetForm() {
    this.name = '';
    this.email = '';
    this.subject = '';
    this.message = '';
    this.attachment = null;
    this.formSubmitted = false;
    this.errors = {};
  },
}));

// ─── Ticket Form (multi-step) ─────────────────────────────────────────
Alpine.data('ticketForm', () => ({
  currentStep: 1,
  category: '',
  subCategory: '',
  subject: '',
  description: '',
  priority: 'normal',
  orderRef: '',
  files: [] as { name: string; size: number }[],
  errors: {} as Record<string, string>,
  submitted: false,

  get categories() {
    return [
      { id: 'siparis', label: t('ticketForm.catOrder'), subs: t('ticketForm.catOrderSubs', { returnObjects: true }) as unknown as string[] },
      { id: 'odeme', label: t('ticketForm.catPayment'), subs: t('ticketForm.catPaymentSubs', { returnObjects: true }) as unknown as string[] },
      { id: 'kargo', label: t('ticketForm.catShipping'), subs: t('ticketForm.catShippingSubs', { returnObjects: true }) as unknown as string[] },
      { id: 'hesap', label: t('ticketForm.catAccount'), subs: t('ticketForm.catAccountSubs', { returnObjects: true }) as unknown as string[] },
      { id: 'urun', label: t('ticketForm.catProductQuality'), subs: t('ticketForm.catProductQualitySubs', { returnObjects: true }) as unknown as string[] },
      { id: 'diger', label: t('ticketForm.catOther'), subs: t('ticketForm.catOtherSubs', { returnObjects: true }) as unknown as string[] },
    ];
  },

  get subCategories(): string[] {
    const cat = this.categories.find((c: any) => c.id === this.category);
    return cat ? cat.subs : [];
  },

  get charCount(): number {
    return this.description.length;
  },

  addFiles(fileList: FileList) {
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024;
    for (let i = 0; i < fileList.length && this.files.length < maxFiles; i++) {
      const f = fileList[i];
      if (f.size <= maxSize) {
        this.files.push({ name: f.name, size: f.size });
      }
    }
  },

  removeFile(index: number) {
    this.files.splice(index, 1);
  },

  validateStep(step: number): boolean {
    this.errors = {};
    if (step === 1) {
      if (!this.category) this.errors.category = t('ticketForm.categoryRequired');
      if (!this.subject.trim()) this.errors.subject = t('ticketForm.subjectRequired');
    } else if (step === 2) {
      if (!this.description.trim()) this.errors.description = t('ticketForm.descriptionRequired');
      if (this.description.length < 20) this.errors.description = t('ticketForm.descriptionMinLength');
    }
    return Object.keys(this.errors).length === 0;
  },

  nextStep() {
    if (this.validateStep(this.currentStep)) {
      this.currentStep++;
    }
  },

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  },

  submitTicket() {
    if (!this.validateStep(this.currentStep)) return;
    this.submitted = true;
    setTimeout(() => {
      window.location.href = `${getBaseUrl()}pages/help/help-tickets.html`;
    }, 2000);
  },
}));

// ─── Tickets List ──────────────────────────────────────────────────────
Alpine.data('ticketsList', () => ({
  activeTab: 'all' as 'all' | 'open' | 'pending' | 'closed',
  searchQuery: '',
  currentPage: 1,
  pageSize: 10,
  expandedTicket: null as string | null,

  get tickets(): any[] {
    // Import mock tickets inline to avoid circular deps at module level
    return (window as any).__mockTickets || [];
  },

  get filteredTickets(): any[] {
    return this.tickets.filter((t: any) => {
      const matchTab = this.activeTab === 'all' || t.status === this.activeTab;
      const q = this.searchQuery.toLowerCase().trim();
      const matchSearch = !q || t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  },

  get paginatedTickets(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTickets.slice(start, start + this.pageSize);
  },

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredTickets.length / this.pageSize));
  },

  tabCount(status: string): number {
    if (status === 'all') return this.tickets.length;
    return this.tickets.filter((t: any) => t.status === status).length;
  },

  setTab(tab: string) {
    this.activeTab = tab as any;
    this.currentPage = 1;
  },

  setPage(page: number) {
    this.currentPage = page;
  },

  toggleTicket(id: string) {
    this.expandedTicket = this.expandedTicket === id ? null : id;
  },
}));
