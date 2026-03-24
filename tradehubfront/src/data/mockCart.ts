/**
 * Mock Cart Data
 * Static data for the shopping cart page — Alibaba B2B style.
 */

import { t } from '../i18n';
import type { CartSupplier, CartSummaryData, AssuranceItem } from '../types/cart';

const PLACEHOLDER_IMG = 'https://placehold.co/120x120/f5f5f5/999?text=SKU';

export function getMockCartSuppliers(): CartSupplier[] {
  return [
    {
      id: 'supplier-001',
      name: 'JOTA KA & EUROPE 2016 SL',
      href: '/supplier/jota-ka',
      selected: true,
      paymentMethods: [
        { id: 'visa', name: 'Visa', icon: 'https://s.alicdn.com/@img/tfs/TB1xcNWdZLJ8KJjy0FnXXcFDpXa-120-120.png' },
        { id: 'mastercard', name: 'Mastercard', icon: 'https://s.alicdn.com/@img/tfs/TB1xcNWdZLJ8KJjy0FnXXcFDpXa-120-120.png' },
        { id: 'paypal', name: 'PayPal', icon: 'https://s.alicdn.com/@img/tfs/TB1xcNWdZLJ8KJjy0FnXXcFDpXa-120-120.png' }
      ],
      products: [
        {
          id: 'prod-001',
          title: t('mockData.cart.product1Title'),
          href: '/product/prod-001',
          tags: [
            {
              type: 'DELIVERY_GUARANTEE',
              text: t('mockData.cart.product1DeliveryTag'),
              color: '#0a8800',
              bgColor: '#e6f4e6',
            },
          ],
          moqLabel: t('mockData.cart.product1Moq'),
          favoriteIcon: '♡',
          deleteIcon: '🗑',
          skus: [
            {
              id: 'sku-001',
              skuImage: PLACEHOLDER_IMG,
              variantText: t('mockData.cart.product1SkuVariant'),
              unitPrice: 15.9,
              currency: '$',
              unit: t('mockData.cart.product1SkuUnit'),
              quantity: 12,
              minQty: 1,
              maxQty: 9999,
              selected: true,
              baseUnitPrice: 15.9,
              basePriceAddon: 0,
              baseCurrency: 'USD',
            },
          ],
          selected: true,
        },
      ],
    },
    {
      id: 'supplier-002',
      name: 'WANGDU COUNTY S.PETER SHOES CO.,LTD.',
      href: '/supplier/wangdu-county',
      selected: true,
      paymentMethods: [
        { id: 'tt', name: 'T/T', icon: 'https://s.alicdn.com/@img/tfs/TB1xcNWdZLJ8KJjy0FnXXcFDpXa-120-120.png' },
        { id: 'applepay', name: 'Apple Pay', icon: 'https://s.alicdn.com/@img/tfs/TB1xcNWdZLJ8KJjy0FnXXcFDpXa-120-120.png' }
      ],
      products: [
        {
          id: 'prod-002',
          title: t('mockData.cart.product2Title'),
          href: '/product/prod-002',
          tags: [
            {
              type: 'PROMOTION',
              text: t('mockData.cart.product2PromoTag'),
              color: '#d4380d',
              bgColor: '#fff1e6',
            },
            {
              type: 'DELIVERY_GUARANTEE',
              text: t('mockData.cart.product2DeliveryTag'),
              color: '#0a8800',
              bgColor: '#e6f4e6',
            },
          ],
          moqLabel: t('mockData.cart.product2Moq'),
          favoriteIcon: '♡',
          deleteIcon: '🗑',
          skus: [
            {
              id: 'sku-002',
              skuImage: PLACEHOLDER_IMG,
              variantText: t('mockData.cart.product2Sku1Variant'),
              unitPrice: 16.9,
              currency: '$',
              unit: t('mockData.cart.product2Sku1Unit'),
              quantity: 1,
              minQty: 1,
              maxQty: 9999,
              selected: true,
              baseUnitPrice: 16.9,
              basePriceAddon: 0,
              baseCurrency: 'USD',
            },
            {
              id: 'sku-003',
              skuImage: PLACEHOLDER_IMG,
              variantText: t('mockData.cart.product2Sku2Variant'),
              unitPrice: 16.9,
              currency: '$',
              unit: t('mockData.cart.product2Sku2Unit'),
              quantity: 1,
              minQty: 1,
              maxQty: 9999,
              selected: true,
              baseUnitPrice: 16.9,
              basePriceAddon: 0,
              baseCurrency: 'USD',
            },
          ],
          selected: true,
        },
      ],
    },
  ];
}

export function getMockCartSummary(): CartSummaryData {
  return {
    selectedCount: 14,
    items: [
      { image: PLACEHOLDER_IMG, quantity: 12 },
      { image: PLACEHOLDER_IMG, quantity: 1 },
      { image: PLACEHOLDER_IMG, quantity: 1 },
    ],
    productSubtotal: 224.6,
    discount: 18.81,
    couponDiscount: 0,
    couponCode: '',
    shippingFee: 182.56,
    subtotal: 388.35,
    currency: '$',
  };
}

export function getMockAssuranceItems(): AssuranceItem[] {
  return [
    {
      icon: '🛡️',
      title: t('mockData.cart.assurance1Title'),
      description: t('mockData.cart.assurance1Desc'),
    },
    {
      icon: '📦',
      title: t('mockData.cart.assurance2Title'),
      description: t('mockData.cart.assurance2Desc'),
    },
    {
      icon: '✅',
      title: t('mockData.cart.assurance3Title'),
      description: t('mockData.cart.assurance3Desc'),
    },
  ];
}
