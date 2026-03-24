/**
 * Order Types
 * OrdersPageLayout template binding'leriyle uyumlu tip tanımları.
 */

export type OrderStatus =
  | 'Waiting for payment'
  | 'Confirming'
  | 'Delivering'
  | 'Completed'
  | 'Cancelled';

export type OrderStatusColor =
  | 'text-amber-600'
  | 'text-blue-600'
  | 'text-green-600'
  | 'text-gray-500'
  | 'text-red-600';

export interface OrderProduct {
  name: string;
  variation: string;
  unitPrice: string;
  quantity: number;
  totalPrice: string;
  image: string;
}

export interface OrderShipping {
  trackingStatus: string;
  address: string;
  shipFrom: string;
  method: string;
  incoterms: string;
}

export interface OrderPayment {
  status: string;
  hasRecord: boolean;
  subtotal: string;
  shippingFee: string;
  grandTotal: string;
}

export interface OrderSupplier {
  name: string;
  contact: string;
  phone: string;
  email: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  total: string;
  currency: string;
  seller: string;
  status: OrderStatus;
  statusColor: OrderStatusColor;
  statusDescription: string;
  products: OrderProduct[];
  shipping: OrderShipping;
  payment: OrderPayment;
  supplier: OrderSupplier;
  paymentMethod: string;
  createdAt: number;
  remittanceAmount: number;
  refundStatus: string;
  refundReason: string;
  refundAmount: number;
}
