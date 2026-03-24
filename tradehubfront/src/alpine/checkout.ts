import Alpine from 'alpinejs'
import {
  countries as checkoutCountries,
  districtsByProvince,
} from '../data/mockCheckout'
import type { SavedAddress } from '../types/checkout'
import { getUser, isLoggedIn } from '../utils/auth'
import { formatCurrency } from '../services/currencyService'
import { t } from '../i18n'

interface CheckoutDeliveryMethod {
  id: string;
  etaLabel: string;
  shippingFee: number;
  isDefault?: boolean;
}

interface CheckoutDeliveryOrderGroup {
  orderId: string;
  methods: CheckoutDeliveryMethod[];
}

interface CheckoutSupplierNotesStorage {
  [ownerKey: string]: Record<string, string>;
}

function parseCheckoutDeliveryOrders(raw: string | undefined): CheckoutDeliveryOrderGroup[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CheckoutDeliveryOrderGroup[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const CHECKOUT_SUPPLIER_NOTES_KEY = 'tradehub_checkout_supplier_notes';

function getCheckoutOwnerKey(): string {
  const user = getUser();
  if (isLoggedIn() && user?.email) {
    return `user:${user.email.toLowerCase()}`;
  }
  return 'guest';
}

function readCheckoutSupplierNotesStorage(): CheckoutSupplierNotesStorage {
  try {
    const raw = localStorage.getItem(CHECKOUT_SUPPLIER_NOTES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CheckoutSupplierNotesStorage;
  } catch {
    return {};
  }
}

function writeCheckoutSupplierNotesStorage(storage: CheckoutSupplierNotesStorage): void {
  localStorage.setItem(CHECKOUT_SUPPLIER_NOTES_KEY, JSON.stringify(storage));
}

Alpine.data('checkoutItemsDelivery', () => ({
  deliveryOrders: [] as CheckoutDeliveryOrderGroup[],
  selectedMethodByOrderId: {} as Record<string, string>,
  supplierNotesByOrderId: {} as Record<string, string>,
  isNoteModalOpen: false,
  activeNoteOrderId: '',
  noteDraft: '',

  init() {
    const root = this.$el as HTMLElement;
    this.deliveryOrders = parseCheckoutDeliveryOrders(root.dataset.deliveryOrders);

    this.deliveryOrders.forEach((order) => {
      const defaultMethod = order.methods.find((method) => method.isDefault) ?? order.methods[0];
      if (defaultMethod) this.selectedMethodByOrderId[order.orderId] = defaultMethod.id;
    });

    this.loadSupplierNotes();
    this.emitShippingFeeUpdate();
    this.emitNotesUpdate();
  },

  selectMethod(orderId: string, methodId: string) {
    this.selectedMethodByOrderId[orderId] = methodId;
    this.emitShippingFeeUpdate();
  },

  isMethodSelected(orderId: string, methodId: string): boolean {
    return this.selectedMethodByOrderId[orderId] === methodId;
  },

  loadSupplierNotes() {
    const storage = readCheckoutSupplierNotesStorage();
    const ownerNotes = storage[getCheckoutOwnerKey()] ?? {};
    const validOrderIds = new Set(this.deliveryOrders.map((order) => order.orderId));

    this.supplierNotesByOrderId = Object.fromEntries(
      Object.entries(ownerNotes).filter(([orderId, note]) => validOrderIds.has(orderId) && typeof note === 'string' && note.trim().length > 0),
    );
  },

  persistSupplierNotes() {
    const storage = readCheckoutSupplierNotesStorage();
    storage[getCheckoutOwnerKey()] = this.supplierNotesByOrderId;
    writeCheckoutSupplierNotesStorage(storage);
  },

  openNoteModal(orderId: string) {
    this.activeNoteOrderId = orderId;
    this.noteDraft = this.getOrderNote(orderId);
    this.isNoteModalOpen = true;
  },

  closeNoteModal() {
    this.isNoteModalOpen = false;
    this.activeNoteOrderId = '';
    this.noteDraft = '';
  },

  saveNote() {
    if (!this.activeNoteOrderId) {
      this.closeNoteModal();
      return;
    }

    const note = this.noteDraft.trim();
    if (note) {
      this.supplierNotesByOrderId[this.activeNoteOrderId] = note;
    } else {
      delete this.supplierNotesByOrderId[this.activeNoteOrderId];
    }

    this.persistSupplierNotes();
    this.emitNotesUpdate();
    this.closeNoteModal();
  },

  hasOrderNote(orderId: string): boolean {
    return this.getOrderNote(orderId).trim().length > 0;
  },

  getOrderNote(orderId: string): string {
    return this.supplierNotesByOrderId[orderId] ?? '';
  },

  getSelectedShippingFeeTotal(): number {
    const total = this.deliveryOrders.reduce((sum, order) => {
      const selectedMethodId = this.selectedMethodByOrderId[order.orderId];
      const selectedMethod = order.methods.find((method) => method.id === selectedMethodId)
        ?? order.methods.find((method) => method.isDefault)
        ?? order.methods[0];

      return sum + (selectedMethod?.shippingFee ?? 0);
    }, 0);

    return Number(total.toFixed(2));
  },

  emitShippingFeeUpdate() {
    window.dispatchEvent(new CustomEvent('checkout:shipping-updated', {
      detail: {
        shippingFee: this.getSelectedShippingFeeTotal(),
        selectedMethodByOrderId: { ...this.selectedMethodByOrderId },
      },
    }));
  },

  emitNotesUpdate() {
    window.dispatchEvent(new CustomEvent('checkout:notes-updated', {
      detail: { notesByOrderId: { ...this.supplierNotesByOrderId } },
    }));
  },
}));

Alpine.data('checkoutOrderSummary', (props?: { itemSubtotal?: number; discount?: number; initialShippingFee?: number; currency?: string }) => ({
  itemSubtotal: Number(props?.itemSubtotal ?? 0),
  discount: Number(props?.discount ?? 0),
  shippingFee: Number(props?.initialShippingFee ?? 0),
  currency: props?.currency ?? 'USD',

  // Coupon state
  couponCode: '',
  couponError: '',
  couponApplying: false,
  couponApplied: null as { code: string; type: string; value: number; description: string } | null,
  couponDiscount: 0,

  init() {
    window.addEventListener('checkout:shipping-updated', (event: Event) => {
      const detail = (event as CustomEvent<{ shippingFee?: number }>).detail;
      const nextShippingFee = detail?.shippingFee;
      if (typeof nextShippingFee === 'number' && Number.isFinite(nextShippingFee)) {
        this.shippingFee = Number(nextShippingFee.toFixed(2));
        this.recalcCouponDiscount();
      }
    });
  },

  async applyCoupon() {
    const code = this.couponCode.trim().toUpperCase();
    if (!code) { this.couponError = t('checkout.couponRequired'); return; }
    if (this.couponApplying) return;

    this.couponApplying = true;
    this.couponError = '';

    try {
      const validateFn = (window as unknown as Record<string, unknown>).__validateCoupon as
        ((code: string, total: number) => Promise<{ code: string; type: string; value: number; minOrder: number; description: string }>) | undefined;

      // Min sipariş kontrolü kargo hariç ürün toplamı üzerinden yapılır
      const productTotal = this.itemSubtotal - this.discount;

      if (validateFn) {
        const coupon = await validateFn(code, productTotal);
        this.couponApplied = { code: coupon.code, type: coupon.type, value: coupon.value, description: coupon.description };
        this.couponError = '';
        this.recalcCouponDiscount();

        window.dispatchEvent(new CustomEvent('checkout:coupon-updated', {
          detail: { coupon: this.couponApplied, couponDiscount: this.couponDiscount },
        }));
      } else {
        this.couponError = t('checkout.couponServiceUnavailable');
      }
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message || 'Geçersiz kupon kodu';
      this.couponError = msg;
    } finally {
      this.couponApplying = false;
    }
  },

  removeCoupon() {
    this.couponApplied = null;
    this.couponDiscount = 0;
    this.couponCode = '';
    this.couponError = '';

    window.dispatchEvent(new CustomEvent('checkout:coupon-updated', {
      detail: { coupon: null, couponDiscount: 0 },
    }));
  },

  recalcCouponDiscount() {
    if (!this.couponApplied) { this.couponDiscount = 0; return; }
    // Kargo ücreti indirim hesabına dahil edilmez — sadece ürün toplamı üzerinden indirim
    const productSubtotal = this.itemSubtotal - this.discount;
    if (this.couponApplied.type === 'percent') {
      this.couponDiscount = Number((productSubtotal * this.couponApplied.value / 100).toFixed(2));
    } else if (this.couponApplied.type === 'fixed') {
      this.couponDiscount = Math.min(this.couponApplied.value, productSubtotal);
    } else if (this.couponApplied.type === 'shipping') {
      this.couponDiscount = this.shippingFee;
    }
  },

  get total(): number {
    return Number((this.itemSubtotal + this.shippingFee - this.discount - this.couponDiscount).toFixed(2));
  },

  formatMoney(value: number): string {
    return formatCurrency(value, this.currency);
  },
}));

// ── Checkout Review Modal ──

Alpine.data('checkoutReviewModal', () => ({
  open: false,
  shippingAddress: '',
  paymentMethod: '',
  orders: [] as Array<{ orderId: string; orderLabel: string; sellerName: string; products: Array<{ id: string; title: string; image: string; skuLines: Array<{ id: string; variantText: string; unitPrice: number; quantity: number }> }> }>,
  summary: { itemSubtotal: '0.00', shippingFee: '0.00', couponDiscount: '0.00', total: '0.00' },

  init() {
    window.addEventListener('checkout:open-review', ((event: CustomEvent) => {
      const d = event.detail;
      this.shippingAddress = d.shippingAddress || '';
      this.paymentMethod = d.paymentMethod || '';
      this.orders = d.orders || [];
      this.summary = d.summary || this.summary;
      this.open = true;
      document.body.style.overflow = 'hidden';
    }) as EventListener);
  },

  confirmOrder() {
    this.open = false;
    document.body.style.overflow = '';
    window.dispatchEvent(new CustomEvent('checkout:confirm-order'));
  },

  // Clean up on close
  '$watch': {
    open(val: boolean) {
      if (!val) document.body.style.overflow = '';
    },
  },
}));

// ── Checkout Accordion (PaymentMethodSection, ItemsDeliverySection) ──

Alpine.data('checkoutAccordion', (props?: { initialExpanded?: boolean }) => ({
  expanded: props?.initialExpanded ?? false,

  toggle() {
    const content = (this.$refs as Record<string, HTMLElement>).content;
    if (!content) {
      this.expanded = !this.expanded;
      return;
    }

    if (this.expanded) {
      // Collapse: set explicit height first, then animate to 0
      content.style.height = `${content.scrollHeight}px`;
      content.offsetHeight; // force reflow
      content.style.height = '0';
      content.style.overflow = 'hidden';
      this.expanded = false;
    } else {
      // Expand: animate from 0 to scrollHeight
      content.style.height = `${content.scrollHeight}px`;
      content.style.overflow = 'hidden';
      this.expanded = true;

      const onEnd = () => {
        content.style.height = '';
        content.style.overflow = '';
        content.removeEventListener('transitionend', onEnd);
      };
      content.addEventListener('transitionend', onEnd);
    }
  },
}));

// ── Shipping Address Form (checkout page) ──
interface CheckoutStoredAddress extends SavedAddress {
  id: string;
  isDefault: boolean;
}

interface CheckoutAddressBookStorage {
  [userKey: string]: CheckoutStoredAddress[];
}

interface CheckoutAddAddressForm {
  country: string;
  fullName: string;
  phonePrefix: string;
  phone: string;
  street: string;
  apartment: string;
  state: string;
  city: string;
  postalCode: string;
  isDefaultAddress: boolean;
}

const CHECKOUT_ADDRESS_BOOK_KEY = 'tradehub_checkout_address_book';
const defaultShippingCountry = checkoutCountries.find(c => c.code === 'TR') ?? checkoutCountries[0];

function generateAddressId(): string {
  return `addr-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

function readCheckoutAddressBook(): CheckoutAddressBookStorage {
  try {
    const raw = localStorage.getItem(CHECKOUT_ADDRESS_BOOK_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CheckoutAddressBookStorage;
  } catch {
    return {};
  }
}

function writeCheckoutAddressBook(storage: CheckoutAddressBookStorage): void {
  localStorage.setItem(CHECKOUT_ADDRESS_BOOK_KEY, JSON.stringify(storage));
}

function getCountryByCode(code: string) {
  return checkoutCountries.find((country) => country.code === code) ?? defaultShippingCountry;
}

function formatAddressLine(address: Pick<SavedAddress, 'street' | 'city' | 'state' | 'postalCode' | 'countryName'>): string {
  return [address.street, address.city, address.state, address.postalCode, address.countryName]
    .filter(Boolean)
    .join(', ');
}

function normalizeProvinceName(value: string): string {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('ı', 'i')
    .replace(/\s+/g, ' ')
    .trim();
}

const DISTRICTS_BY_PROVINCE_NORMALIZED = Object.fromEntries(
  Object.entries(districtsByProvince).map(([province, districts]) => [normalizeProvinceName(province), districts]),
) as Record<string, string[]>;

const FALLBACK_CITY_OPTIONS = ['Merkez', 'Cumhuriyet', 'Yeni Mahalle', 'Sanayi'];

Alpine.data('shippingForm', () => ({
  countryOpen: false,
  stateOpen: false,
  cityOpen: false,

  countryDisplay: `${defaultShippingCountry.flag} ${defaultShippingCountry.name}`,
  stateDisplay: '',
  cityDisplay: '',
  cityOptions: [] as string[],
  phonePrefix: defaultShippingCountry.phonePrefix,
  errors: {} as Record<string, boolean>,

  showAddressForm: true,
  savedAddresses: [] as CheckoutStoredAddress[],
  selectedAddressId: '',
  pendingAddressId: '',
  selectedAddressName: '',
  selectedAddressPhone: '',
  selectedAddressLine: '',

  isAddressSelectorOpen: false,
  isAddAddressModalOpen: false,
  isEditingAddress: false,
  editingAddressId: '',
  addAddressForm: {
    country: defaultShippingCountry.code,
    fullName: '',
    phonePrefix: defaultShippingCountry.phonePrefix,
    phone: '',
    street: '',
    apartment: '',
    state: '',
    city: '',
    postalCode: '',
    isDefaultAddress: false,
  } as CheckoutAddAddressForm,
  addFormErrors: {} as Record<string, boolean>,

  init() {
    this.loadAddressesForCurrentUser();
    this.updateCityDropdown(this.stateDisplay);
  },

  getAddressOwnerKey(): string {
    const user = getUser();
    if (isLoggedIn() && user?.email) {
      return `user:${user.email.toLowerCase()}`;
    }
    return 'guest';
  },

  loadAddressesForCurrentUser() {
    const storage = readCheckoutAddressBook();
    const ownerKey = this.getAddressOwnerKey();
    const addresses = storage[ownerKey] ?? [];

    this.savedAddresses = addresses;

    if (this.savedAddresses.length === 0) {
      this.showAddressForm = true;
      this.selectedAddressId = '';
      this.pendingAddressId = '';
      this.selectedAddressName = '';
      this.selectedAddressPhone = '';
      this.selectedAddressLine = '';
      return;
    }

    const defaultAddress = this.savedAddresses.find((address) => address.isDefault) ?? this.savedAddresses[0];
    this.applySelectedAddress(defaultAddress.id);
    this.showAddressForm = false;
  },

  persistAddresses() {
    const storage = readCheckoutAddressBook();
    storage[this.getAddressOwnerKey()] = this.savedAddresses;
    writeCheckoutAddressBook(storage);
  },

  fillMainFormFromAddress(address: CheckoutStoredAddress) {
    const el = this.$el as HTMLElement;
    const setInput = (id: string, value: string) => {
      const input = el.querySelector<HTMLInputElement>(`#${id}`);
      if (input) input.value = value;
    };

    const country = getCountryByCode(address.country);
    this.countryDisplay = `${country.flag} ${country.name}`;
    this.phonePrefix = address.phonePrefix || country.phonePrefix;
    this.stateDisplay = address.state;
    this.updateCityDropdown(address.state);
    this.cityDisplay = address.city;

    setInput('first-name', `${address.firstName} ${address.lastName}`.trim());
    setInput('phone', address.phone);
    setInput('street-address', address.street);
    setInput('apartment', address.apartment);
    setInput('postal-code', address.postalCode);

    this.errors.country = false;
    this.errors.firstName = false;
    this.errors.phone = false;
    this.errors.streetAddress = false;
    this.errors.state = false;
    this.errors.city = false;
    this.errors.postalCode = false;
  },

  applySelectedAddress(addressId: string) {
    const address = this.savedAddresses.find((row) => row.id === addressId);
    if (!address) return;

    this.selectedAddressId = address.id;
    this.pendingAddressId = address.id;
    this.selectedAddressName = `${address.firstName} ${address.lastName}`.trim();
    this.selectedAddressPhone = `${address.phonePrefix} ${address.phone}`.trim();
    this.selectedAddressLine = address.fullAddress || formatAddressLine(address);
    this.fillMainFormFromAddress(address);
  },

  openAddressSelector() {
    if (this.savedAddresses.length === 0) {
      this.openAddAddressModal();
      return;
    }
    this.pendingAddressId = this.selectedAddressId || this.savedAddresses[0].id;
    this.isAddressSelectorOpen = true;
  },

  closeAddressSelector() {
    this.isAddressSelectorOpen = false;
  },

  confirmSelectedAddress() {
    const address = this.savedAddresses.find((row) => row.id === this.pendingAddressId) ?? this.savedAddresses[0];
    if (!address) return;

    this.applySelectedAddress(address.id);
    this.showAddressForm = false;
    this.isAddressSelectorOpen = false;
  },

  resetAddAddressForm() {
    this.addAddressForm = {
      country: defaultShippingCountry.code,
      fullName: '',
      phonePrefix: defaultShippingCountry.phonePrefix,
      phone: '',
      street: '',
      apartment: '',
      state: '',
      city: '',
      postalCode: '',
      isDefaultAddress: false,
    };
    this.addFormErrors = {};
    this.isEditingAddress = false;
    this.editingAddressId = '';
  },

  openAddAddressModal() {
    this.resetAddAddressForm();
    this.isAddressSelectorOpen = false;
    this.isAddAddressModalOpen = true;
  },

  closeAddAddressModal() {
    this.isAddAddressModalOpen = false;
    this.addFormErrors = {};
  },

  syncAddAddressCountry() {
    const country = getCountryByCode(this.addAddressForm.country);
    this.addAddressForm.phonePrefix = country.phonePrefix;
  },

  startEditAddress(addressId: string) {
    const address = this.savedAddresses.find((row) => row.id === addressId);
    if (!address) return;

    this.isEditingAddress = true;
    this.editingAddressId = address.id;
    this.addAddressForm = {
      country: address.country,
      fullName: `${address.firstName} ${address.lastName}`.trim(),
      phonePrefix: address.phonePrefix,
      phone: address.phone,
      street: address.street,
      apartment: address.apartment,
      state: address.state,
      city: address.city,
      postalCode: address.postalCode,
      isDefaultAddress: address.isDefault,
    };
    this.addFormErrors = {};
    this.isAddressSelectorOpen = false;
    this.isAddAddressModalOpen = true;
  },

  deleteAddress(addressId: string) {
    this.savedAddresses = this.savedAddresses.filter((address) => address.id !== addressId);

    if (this.savedAddresses.length === 0) {
      this.persistAddresses();
      this.selectedAddressId = '';
      this.pendingAddressId = '';
      this.selectedAddressName = '';
      this.selectedAddressPhone = '';
      this.selectedAddressLine = '';
      this.showAddressForm = true;
      this.isAddressSelectorOpen = false;
      return;
    }

    if (!this.savedAddresses.some((address) => address.isDefault)) {
      this.savedAddresses[0].isDefault = true;
    }

    const nextAddress = this.savedAddresses.find((address) => address.id === this.selectedAddressId)
      ?? this.savedAddresses.find((address) => address.isDefault)
      ?? this.savedAddresses[0];

    this.persistAddresses();
    this.applySelectedAddress(nextAddress.id);
  },

  setDefaultAddress(addressId: string) {
    this.savedAddresses = this.savedAddresses.map((address) => ({
      ...address,
      isDefault: address.id === addressId,
    }));
    this.persistAddresses();
  },

  validateAddAddressForm(): boolean {
    const requiredFields: Array<keyof CheckoutAddAddressForm> = [
      'country',
      'fullName',
      'phone',
      'street',
      'state',
      'city',
      'postalCode',
    ];

    this.addFormErrors = {};
    let hasErrors = false;

    for (const field of requiredFields) {
      const value = String(this.addAddressForm[field] ?? '').trim();
      const invalid = !value;
      this.addFormErrors[field] = invalid;
      if (invalid) hasErrors = true;
    }

    return !hasErrors;
  },

  buildAddressFromAddForm(): CheckoutStoredAddress {
    const country = getCountryByCode(this.addAddressForm.country);
    const nameParts = splitFullName(this.addAddressForm.fullName);
    const baseAddress: SavedAddress = {
      label: 'Shipping address',
      fullAddress: formatAddressLine({
        street: this.addAddressForm.street.trim(),
        city: this.addAddressForm.city.trim(),
        state: this.addAddressForm.state.trim(),
        postalCode: this.addAddressForm.postalCode.trim(),
        countryName: country.name,
      }),
      country: country.code,
      countryName: country.name,
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      phone: this.addAddressForm.phone.trim(),
      phonePrefix: this.addAddressForm.phonePrefix,
      street: this.addAddressForm.street.trim(),
      apartment: this.addAddressForm.apartment.trim(),
      state: this.addAddressForm.state.trim(),
      city: this.addAddressForm.city.trim(),
      postalCode: this.addAddressForm.postalCode.trim(),
    };

    return {
      id: this.editingAddressId || generateAddressId(),
      isDefault: this.addAddressForm.isDefaultAddress,
      ...baseAddress,
    };
  },

  submitAddAddress() {
    if (!this.validateAddAddressForm()) return;

    const candidate = this.buildAddressFromAddForm();

    if (this.isEditingAddress && this.editingAddressId) {
      this.savedAddresses = this.savedAddresses.map((address) => (
        address.id === this.editingAddressId ? candidate : address
      ));
    } else {
      this.savedAddresses = [candidate, ...this.savedAddresses];
    }

    if (candidate.isDefault || this.savedAddresses.length === 1) {
      this.savedAddresses = this.savedAddresses.map((address) => ({
        ...address,
        isDefault: address.id === candidate.id,
      }));
    } else if (!this.savedAddresses.some((address) => address.isDefault)) {
      this.savedAddresses[0].isDefault = true;
    }

    this.persistAddresses();
    this.applySelectedAddress(candidate.id);
    this.showAddressForm = false;
    this.isAddAddressModalOpen = false;
    this.isAddressSelectorOpen = false;
  },

  toggleDropdown(name: string) {
    const keys = ['country', 'state', 'city'];
    keys.forEach((key) => {
      if (key !== name) {
        const otherProp = `${key}Open` as 'countryOpen' | 'stateOpen' | 'cityOpen';
        this[otherProp] = false;
      }
    });
    const prop = `${name}Open` as 'countryOpen' | 'stateOpen' | 'cityOpen';
    if (name === 'city') {
      const stateFromDom = ((this.$el as HTMLElement)
        .querySelector('[data-dropdown="state-dropdown"] [data-display]')?.textContent ?? '')
        .trim();
      const effectiveState = this.stateDisplay.trim() || stateFromDom;
      this.updateCityDropdown(effectiveState);
    }
    this[prop] = !this[prop];
  },

  selectCountryItem(event: Event) {
    const item = (event.target as HTMLElement).closest('li') as HTMLElement | null;
    if (!item) return;

    const list = item.closest('[data-list]');
    list?.querySelectorAll('li').forEach((node) => node.classList.remove('bg-blue-50', 'text-blue-800'));
    item.classList.add('bg-blue-50', 'text-blue-800');

    this.countryDisplay = `${item.dataset.flag || ''} ${item.dataset.name || ''}`;
    if (item.dataset.prefix) this.phonePrefix = item.dataset.prefix;

    this.countryOpen = false;
    this.errors.country = false;
  },

  selectStateItem(event: Event) {
    const item = (event.target as HTMLElement).closest('li') as HTMLElement | null;
    if (!item) return;

    const list = item.closest('[data-list]');
    list?.querySelectorAll('li').forEach((node) => node.classList.remove('bg-blue-50', 'text-blue-800'));
    item.classList.add('bg-blue-50', 'text-blue-800');

    const stateValue = (item.dataset.value || item.textContent || '').trim();
    this.stateDisplay = stateValue;
    this.stateOpen = false;
    this.errors.state = false;
    this.updateCityDropdown(stateValue);
  },

  selectCityItem(event: Event) {
    const item = (event.target as HTMLElement).closest('li') as HTMLElement | null;
    if (!item) return;
    if (item.dataset.disabled === 'true') return;

    const list = item.closest('[data-list]');
    list?.querySelectorAll('li').forEach((node) => node.classList.remove('bg-blue-50', 'text-blue-800'));
    item.classList.add('bg-blue-50', 'text-blue-800');

    this.cityDisplay = item.dataset.value || item.textContent?.trim() || '';
    this.cityOpen = false;
    this.errors.city = false;
  },

  updateCityDropdown(stateName: string) {
    const normalizedState = normalizeProvinceName(stateName);
    this.cityDisplay = '';

    if (!normalizedState) {
      this.cityOptions = [];
      return;
    }

    this.cityOptions = DISTRICTS_BY_PROVINCE_NORMALIZED[normalizedState] ?? FALLBACK_CITY_OPTIONS;
  },

  clearError(fieldName: string) {
    this.errors[fieldName] = false;
  },

  handleSubmit() {
    const requiredFields = ['country', 'firstName', 'phone', 'streetAddress', 'state', 'city', 'postalCode'];
    requiredFields.forEach(field => { this.errors[field] = false; });

    const el = this.$el as HTMLElement;
    const idMap: Record<string, string> = {
      firstName: 'first-name',
      phone: 'phone',
      streetAddress: 'street-address',
      postalCode: 'postal-code',
    };

    const getValue = (field: string): string => {
      if (field === 'country') return this.countryDisplay;
      if (field === 'state') return this.stateDisplay;
      if (field === 'city') return this.cityDisplay;
      const id = idMap[field];
      return id ? (el.querySelector<HTMLInputElement>(`#${id}`))?.value?.trim() ?? '' : '';
    };

    let hasErrors = false;
    let firstErrorField: HTMLElement | null = null;

    for (const field of requiredFields) {
      if (!getValue(field)) {
        hasErrors = true;
        this.errors[field] = true;
        if (!firstErrorField) {
          firstErrorField = el.querySelector<HTMLElement>(`[data-field="${field}"]`);
        }
      }
    }

    if (hasErrors && firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const countryMatch = checkoutCountries.find((country) => this.countryDisplay.includes(country.name));
    const country = countryMatch ?? defaultShippingCountry;
    const fullName = getValue('firstName');
    const nameParts = splitFullName(fullName);
    const street = getValue('streetAddress');
    const state = this.stateDisplay;
    const city = this.cityDisplay;
    const postalCode = getValue('postalCode');
    const apartment = (el.querySelector<HTMLInputElement>('#apartment'))?.value?.trim() ?? '';

    const candidate: CheckoutStoredAddress = {
      id: generateAddressId(),
      isDefault: (el.querySelector<HTMLInputElement>('#default-address'))?.checked ?? this.savedAddresses.length === 0,
      label: 'Shipping address',
      fullAddress: formatAddressLine({
        street,
        city,
        state,
        postalCode,
        countryName: country.name,
      }),
      country: country.code,
      countryName: country.name,
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      phone: getValue('phone'),
      phonePrefix: this.phonePrefix,
      street,
      apartment,
      state,
      city,
      postalCode,
    };

    this.savedAddresses = [candidate, ...this.savedAddresses];
    if (candidate.isDefault || this.savedAddresses.length === 1) {
      this.savedAddresses = this.savedAddresses.map((address) => ({
        ...address,
        isDefault: address.id === candidate.id,
      }));
    }

    this.persistAddresses();
    this.applySelectedAddress(candidate.id);
    this.showAddressForm = false;
    this.isAddressSelectorOpen = false;
    this.isAddAddressModalOpen = false;
  },

}));
