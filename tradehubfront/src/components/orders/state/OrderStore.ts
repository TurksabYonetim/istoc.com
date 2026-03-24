/**
 * OrderStore — API-only Sipariş State Store
 * Tüm sipariş verisi backend'den (Buyer Order DocType) gelir.
 * localStorage kullanılmaz — eski mock veri sayfa yüklenirken temizlenir.
 */

import type { Order, OrderStatus, OrderStatusColor } from '../../../types/order';
import { callMethod } from '../../../utils/api';

// Eski mock verinin tüm kalıntılarını temizle
localStorage.removeItem('tradehub_orders');
localStorage.removeItem('tradehub_orders_seeded');
localStorage.removeItem('tradehub_orders_api_migrated');

interface ApiOrderItem {
  product_name: string;
  variation: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image: string;
}

interface ApiOrder {
  name: string;
  order_number: string;
  order_date: string;
  seller_name: string;
  status: string;
  status_color: string;
  status_description: string;
  grand_total: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  shipping_status: string;
  subtotal: number;
  shipping_fee: number;
  supplier_name: string;
  supplier_contact: string;
  supplier_phone: string;
  supplier_email: string;
  shipping_address: string;
  ship_from: string;
  shipping_method: string;
  incoterms: string;
  cancel_reason: string;
  remittance_amount: number;
  refund_status: string;
  refund_reason: string;
  refund_amount: number;
  refund_requested_at: string;
  items: ApiOrderItem[];
}

function apiOrderToOrder(apiOrder: ApiOrder): Order {
  const dateStr = apiOrder.order_date
    ? new Date(apiOrder.order_date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }) + ', PST'
    : '';

  return {
    id: apiOrder.name,
    orderNumber: apiOrder.order_number,
    orderDate: dateStr,
    total: String(apiOrder.grand_total || 0),
    currency: apiOrder.currency || 'USD',
    seller: apiOrder.seller_name || '',
    status: (apiOrder.status || 'Waiting for payment') as OrderStatus,
    statusColor: (apiOrder.status_color || 'text-amber-600') as OrderStatusColor,
    statusDescription: apiOrder.status_description || '',
    products: (apiOrder.items || []).map((item) => ({
      name: item.product_name,
      variation: item.variation || '',
      unitPrice: String(item.unit_price || 0),
      quantity: item.quantity || 1,
      totalPrice: String(item.total_price || 0),
      image: item.image || '',
    })),
    shipping: {
      trackingStatus: apiOrder.shipping_status || 'Pending',
      address: apiOrder.shipping_address || '',
      shipFrom: apiOrder.ship_from || '',
      method: apiOrder.shipping_method || 'Standard',
      incoterms: apiOrder.incoterms || 'DAP',
    },
    payment: {
      status: apiOrder.payment_status || 'Unpaid',
      hasRecord: apiOrder.payment_status === 'Paid' || apiOrder.payment_status === 'Refunded',
      subtotal: String(apiOrder.subtotal || 0),
      shippingFee: String(apiOrder.shipping_fee || 0),
      grandTotal: String(apiOrder.grand_total || 0),
    },
    supplier: {
      name: apiOrder.supplier_name || apiOrder.seller_name || '',
      contact: apiOrder.supplier_contact || 'Sales Team',
      phone: apiOrder.supplier_phone || '',
      email: apiOrder.supplier_email || '',
    },
    paymentMethod: apiOrder.payment_method || '',
    createdAt: apiOrder.order_date ? new Date(apiOrder.order_date).getTime() : Date.now(),
    remittanceAmount: apiOrder.remittance_amount || 0,
    refundStatus: apiOrder.refund_status || '',
    refundReason: apiOrder.refund_reason || '',
    refundAmount: apiOrder.refund_amount || 0,
  };
}

export class OrderStore {
  private orders: Order[] = [];
  private listeners = new Set<() => void>();
  private loading = false;
  private loaded = false;

  async load(): Promise<void> {
    await this.fetchFromApi();
  }

  async fetchFromApi(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    this.notify();

    try {
      const result = await callMethod<{
        success: boolean;
        orders: ApiOrder[];
        total: number;
      }>(
        'tradehub_core.api.order.get_my_orders',
        { page_size: 100 },
      );

      if (result?.success && Array.isArray(result.orders)) {
        this.orders = result.orders.map(apiOrderToOrder);
        this.loaded = true;
      }
    } catch (err) {
      console.warn('[OrderStore] API fetch failed:', err);
      // API başarısız → boş liste (mock data yok artık)
      this.orders = [];
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getOrderByNumber(orderNumber: string): Order | undefined {
    return this.orders.find((o) => o.orderNumber === orderNumber);
  }

  isLoading(): boolean {
    return this.loading;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  /** Sipariş iptal — API'ye gönder */
  async cancelOrder(orderNumber: string, reason: string): Promise<boolean> {
    try {
      await callMethod<{ success: boolean }>(
        'tradehub_core.api.order.cancel_order',
        { order_number: orderNumber, reason },
        true,
      );
      // Local state'i güncelle
      this.updateOrderStatus(orderNumber, 'Cancelled', 'text-red-600', 'Order cancelled by buyer.');
      return true;
    } catch (err) {
      console.error('[OrderStore] cancel_order failed:', err);
      return false;
    }
  }

  updateOrderStatus(
    orderNumber: string,
    status: OrderStatus,
    statusColor: OrderStatusColor,
    statusDescription: string,
  ): void {
    const order = this.getOrderByNumber(orderNumber);
    if (!order) return;
    order.status = status;
    order.statusColor = statusColor;
    order.statusDescription = statusDescription;
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const orderStore = new OrderStore();
