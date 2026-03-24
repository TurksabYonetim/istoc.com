import Alpine from 'alpinejs'
import { t } from '../i18n'
import { callMethod } from '../utils/api'
import { orderStore } from '../components/orders/state/OrderStore'
import { getOrderTabs, getOrderFilters } from '../components/buyer-dashboard/ordersData'

export const ORDER_STATUS_MAP: Record<string, string[]> = {
  all: [],
  unpaid: ['Waiting for payment'],
  confirming: ['Confirming'],
  preparing: ['Confirming'],
  delivering: ['Delivering'],
  'refunds-aftersales': ['Cancelled'],
  'completed-review': ['Completed'],
  completed: ['Completed'],
  cancelled: ['Cancelled'],
  closed: ['Cancelled'],
};

Alpine.data('ordersListComponent', () => ({
  activeTab: 'all',
  searchQuery: '',
  dateFilter: 'all',
  dateFrom: '',
  dateTo: '',
  dateOpen: false,
  timeOpen: false,
  selectedOrder: null,
  copiedNumber: false,
  orders: [] as any[],
  loading: true,
  error: '',

  async init() {
    orderStore.subscribe(() => {
      this.orders = orderStore.getOrders();
      this.loading = orderStore.isLoading();
    });

    // Backend'den siparişleri çek (OrderStore.load() → order.py::get_my_orders)
    await orderStore.load();
    this.orders = orderStore.getOrders();
    this.loading = false;
  },

  get filteredOrders() {
    return this.orders.filter((o: any) => {
      // Status filter
      const allowedStatuses = ORDER_STATUS_MAP[this.activeTab];
      const matchStatus = !allowedStatuses || allowedStatuses.length === 0 || allowedStatuses.includes(o.status);

      // Search filter
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || o.orderNumber.toLowerCase().includes(q) || o.seller.toLowerCase().includes(q) || o.products.some((p: any) => p.name.toLowerCase().includes(q));

      // Date filter
      let matchDate = true;
      if (this.dateFilter !== 'all' && o.createdAt) {
        const orderTime = o.createdAt;
        const now = Date.now();
        if (this.dateFilter === '7d') {
          matchDate = now - orderTime <= 7 * 24 * 60 * 60 * 1000;
        } else if (this.dateFilter === '30d') {
          matchDate = now - orderTime <= 30 * 24 * 60 * 60 * 1000;
        } else if (this.dateFilter === '90d') {
          matchDate = now - orderTime <= 90 * 24 * 60 * 60 * 1000;
        } else if (this.dateFilter === 'custom') {
          if (this.dateFrom) matchDate = orderTime >= new Date(this.dateFrom).getTime();
          if (this.dateTo && matchDate) matchDate = orderTime <= new Date(this.dateTo).getTime() + 24 * 60 * 60 * 1000;
        }
      }

      return matchStatus && matchSearch && matchDate;
    });
  },

  tabCount(tabId: string) {
    const allowedStatuses = ORDER_STATUS_MAP[tabId];
    if (!allowedStatuses || allowedStatuses.length === 0) return this.orders.length;
    return this.orders.filter((o: any) => allowedStatuses.includes(o.status)).length;
  },

  viewDetail(order: any) {
    this.selectedOrder = order;
    window.scrollTo({ top: 0 });
  },

  backToList() {
    this.selectedOrder = null;
    this.copiedNumber = false;
  },

  get dateFilterLabel() {
    if (this.dateFilter === 'custom') return t('orders.customDate');
    if (this.dateFilter === '7d') return t('orders.last7Days');
    if (this.dateFilter === '30d') return t('orders.last30Days');
    if (this.dateFilter === '90d') return t('orders.last90Days');
    return t('orders.orderDate');
  },

  setDateFilter(val: string) {
    this.dateFilter = val;
    if (val !== 'custom') {
      this.dateFrom = '';
      this.dateTo = '';
    }
  },

  clearTimeRange() {
    this.dateFrom = '';
    this.dateTo = '';
    this.dateFilter = 'all';
    this.timeOpen = false;
  },

  applyTimeRange() {
    if (this.dateFrom || this.dateTo) {
      this.dateFilter = 'custom';
      this.timeOpen = false;
    }
  },

  copyOrderNumber() {
    if (!this.selectedOrder) return;
    navigator.clipboard.writeText((this.selectedOrder as any).orderNumber);
    this.copiedNumber = true;
    setTimeout(() => { this.copiedNumber = false; }, 2000);
  },

  // Modal states
  showOperationHistory: false,
  showPaymentHistory: false,
  showTrackPackage: false,
  showModifyShipping: false,
  showAddServices: false,
  showCancelOrder: false,
  showRefundModal: false,
  paymentHistoryTab: 'records',
  cancelReason: '',
  cancellingOrder: null as any,

  // Kargo hizmet türü — dinamik
  shippingMethods: [] as { id: string; method: string; estimatedDays: string; baseCost: number; currency: string }[],
  shippingMethodsLoading: false,
  selectedShippingMethod: '',

  // Refund form
  refundForm: { reason: '', amount: '' },
  submittingRefund: false,
  refundSuccess: false,
  refundError: '',
  refundBlocked: false,

  // Payment history data (API-driven)
  paymentRecords: [] as any[],
  refundRecords: [] as any[],
  wireRecords: [] as any[],
  paymentLoading: false,

  openModal(name: string) {
    (this as any)[name] = true;
    document.body.style.overflow = 'hidden';

    // Ödeme geçmişi modal'ı açılırken API'den veri çek
    if (name === 'showPaymentHistory' && this.selectedOrder) {
      this.fetchPaymentRecords((this.selectedOrder as any).orderNumber);
    }

    // Kargo değişiklik modal'ı açılırken kargo hizmet türlerini backend'den çek
    if (name === 'showModifyShipping') {
      this.fetchShippingMethods();
    }
  },

  async fetchShippingMethods() {
    this.shippingMethodsLoading = true;
    this.shippingMethods = [];
    try {
      const result = await callMethod<{ data: { id: string; method: string; estimatedDays: string; baseCost: number; currency: string }[] }>(
        'tradehub_core.api.listing.get_shipping_methods',
      );
      this.shippingMethods = result?.data ?? [];
      // Mevcut siparişin kargo yöntemini seç, yoksa ilki
      const currentMethod = (this.selectedOrder as any)?.shipping?.method ?? '';
      const match = this.shippingMethods.find((m) => m.method === currentMethod || m.id === currentMethod);
      this.selectedShippingMethod = match ? match.id : (this.shippingMethods[0]?.id ?? '');
    } catch (err) {
      console.warn('[Orders] Kargo yöntemleri alınamadı:', err);
    } finally {
      this.shippingMethodsLoading = false;
    }
  },

  async fetchPaymentRecords(orderNumber: string) {
    this.paymentLoading = true;
    this.paymentRecords = [];
    this.refundRecords = [];
    this.wireRecords = [];

    try {
      const result = await callMethod<{
        success: boolean;
        payments: any[];
        refunds: any[];
        wire_transfers: any[];
      }>(
        'tradehub_core.api.order.get_payment_records',
        { order_number: orderNumber },
      );

      if (result?.success) {
        this.paymentRecords = result.payments || [];
        this.refundRecords = result.refunds || [];
        this.wireRecords = result.wire_transfers || [];
      }
    } catch (err) {
      console.warn('[Orders] Payment records fetch failed:', err);
    } finally {
      this.paymentLoading = false;
    }
  },

  closeModal(name: string) {
    (this as any)[name] = false;
    document.body.style.overflow = '';
  },

  async confirmCancelOrder() {
    const order = (this.cancellingOrder || this.selectedOrder) as any;
    if (!order || !this.cancelReason) return;

    await orderStore.cancelOrder(order.orderNumber, this.cancelReason);

    this.cancelReason = '';
    this.cancellingOrder = null;
    this.closeModal('showCancelOrder');
    if (this.selectedOrder && (this.selectedOrder as any).orderNumber === order.orderNumber) {
      this.selectedOrder = null;
    }
  },

  getStepIndex(order: any) {
    if (!order) return -1;
    if (order.status === 'Cancelled') return -2;
    if (order.status === 'Waiting for payment') return 0;
    if (order.status === 'Confirming') return 1;
    if (order.status === 'Preparing Shipment') return 2;
    if (order.status === 'Delivering') return 3;
    if (order.status === 'Completed') return 4;
    return 0;
  },

  isCancelled(order: any) {
    return order?.status === 'Cancelled';
  },

  isActionable(order: any) {
    return order && order.status !== 'Cancelled' && order.status !== 'Completed';
  },

  canPay(order: any) {
    return order && (order.status === 'Waiting for payment');
  },

  openRemittanceModal(orderNumber: string) {
    document.dispatchEvent(new CustomEvent('remittance:open', { detail: { orderNumber } }));
  },

  async downloadInvoice(order: any) {
    if (!order) return;
    try {
      const res = await callMethod<{ html: string; filename: string }>(
        'tradehub_core.api.order.download_invoice',
        { order_number: order.orderNumber },
      );
      if (res?.html) {
        const blob = new Blob([res.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const w = window.open(url, '_blank');
        if (w) { setTimeout(() => URL.revokeObjectURL(url), 10000); }
      }
    } catch (err: any) {
      console.warn('[Orders] Invoice download failed:', err);
    }
  },

  openRefundModal(order: any) {
    if (!order) return;
    // Bekleyen veya onaylanmış iade varsa yeni talep açılamaz
    if (['Pending', 'Approved'].includes(order.refundStatus)) {
      this.refundBlocked = true;
      this.refundError = order.refundStatus === 'Approved'
        ? 'Bu sipariş için iade talebiniz zaten onaylanmıştır.'
        : 'Bu sipariş için bekleyen bir iade talebiniz zaten bulunmaktadır.';
      this.refundSuccess = false;
      this.showRefundModal = true;
      document.body.style.overflow = 'hidden';
      return;
    }
    const grandTotal = order.payment?.grandTotal || order.grandTotal || '';
    this.refundForm = { reason: '', amount: String(grandTotal) };
    this.refundBlocked = false;
    this.refundSuccess = false;
    this.refundError = '';
    this.showRefundModal = true;
    document.body.style.overflow = 'hidden';
  },

  async submitRefundRequest() {
    const order = this.selectedOrder as any;
    if (!order || !this.refundForm.reason.trim()) return;
    this.submittingRefund = true;
    this.refundError = '';
    try {
      await callMethod<{ success: boolean }>(
        'tradehub_core.api.order.submit_refund_request',
        {
          order_number: order.orderNumber,
          reason: this.refundForm.reason,
          amount: this.refundForm.amount,
        },
        true,
      );
      this.refundSuccess = true;
    } catch (err: any) {
      this.refundError = err?.message || 'Bir hata oluştu.';
    } finally {
      this.submittingRefund = false;
    }
  },

  canCancel(order: any) {
    return order && order.status !== 'Cancelled' && order.status !== 'Completed' && order.status !== 'Delivering';
  }
}));

Alpine.data('ordersSection', () => ({
  activeTabId: getOrderTabs()[0].id,
  selectedFilterId: getOrderFilters()[0].id as string | null,
  dropdownOpen: false,

  selectTab(tabId: string, hasDropdown: boolean) {
    if (hasDropdown) {
      if (this.activeTabId === tabId) {
        this.dropdownOpen = !this.dropdownOpen;
        return;
      }
      this.activeTabId = tabId;
      this.dropdownOpen = true;
    } else {
      this.activeTabId = tabId;
      this.dropdownOpen = false;
    }
  },

  selectFilter(filterId: string) {
    this.selectedFilterId = filterId;
    this.dropdownOpen = false;
  },
}));

Alpine.data('refundsComponent', () => ({
  refunds: [] as any[],
  loading: true,

  async init() {
    try {
      const res = await callMethod<{ success: boolean; refunds: any[] }>(
        'tradehub_core.api.order.get_my_refunds',
      );
      this.refunds = res?.refunds || [];
    } catch (err) {
      console.warn('[Refunds] fetch failed:', err);
    } finally {
      this.loading = false;
    }
  },

  statusClass(status: string) {
    if (status === 'Approved' || status === 'Onaylandı') return 'bg-green-50 text-green-700 border border-green-200';
    if (status === 'Rejected' || status === 'Reddedildi') return 'bg-red-50 text-red-700 border border-red-200';
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  },
}));
