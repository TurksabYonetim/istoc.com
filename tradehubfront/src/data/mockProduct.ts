/**
 * Mock Product Data
 * Static data for the product detail page — Alibaba B2B style.
 * Internationalized: all user-visible strings use t() calls.
 */

import type { ProductDetail } from '../types/product';
import { t } from '../i18n';

export function getMockProduct(): ProductDetail {
  return {
    id: 'prod-001',
    title: t('mockProduct.title'),
    category: [
      t('mockProduct.catHome'),
      t('mockProduct.catJewelry'),
      t('mockProduct.catNecklaces'),
      t('mockProduct.catPendants'),
    ],
    images: [
      { id: 'img-1', src: '', alt: t('mockProduct.imgAlt1') },
      { id: 'img-2', src: '', alt: t('mockProduct.imgAlt2') },
      { id: 'img-3', src: '', alt: t('mockProduct.imgAlt3') },
      { id: 'img-4', src: '', alt: t('mockProduct.imgAlt4') },
      { id: 'img-5', src: '', alt: t('mockProduct.imgAlt5') },
      { id: 'img-6', src: '', alt: t('mockProduct.imgAlt6') },
    ],
    priceTiers: [
      { minQty: 1, maxQty: 99, price: 12.00, currency: 'USD' },
      { minQty: 100, maxQty: 499, price: 10.00, currency: 'USD' },
      { minQty: 500, maxQty: null, price: 8.50, currency: 'USD' },
    ],
    moq: 1,
    unit: t('mockProduct.unit'),
    leadTime: t('mockProduct.leadTime'),
    shipping: [
      { method: t('mockProduct.shipDhl'), estimatedDays: t('mockProduct.shipDhlDays'), cost: '$45.00' },
      { method: t('mockProduct.shipAir'), estimatedDays: t('mockProduct.shipAirDays'), cost: '$28.00' },
      { method: t('mockProduct.shipSea'), estimatedDays: t('mockProduct.shipSeaDays'), cost: '$12.00' },
    ],
    variants: [
      {
        type: 'color',
        label: t('mockProduct.varColor'),
        options: [
          { id: 'gold', label: t('mockProduct.varGold'), value: '#D4AF37', available: true, thumbnail: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=120&h=120&fit=crop&q=80' },
          { id: 'silver', label: t('mockProduct.varSilver'), value: '#C0C0C0', available: true, thumbnail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=120&h=120&fit=crop&q=80' },
          { id: 'rosegold', label: t('mockProduct.varRoseGold'), value: '#B76E79', available: true, thumbnail: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=120&h=120&fit=crop&q=80' },
          { id: 'black', label: t('mockProduct.varBlack'), value: '#2D2D2D', available: false, thumbnail: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=120&h=120&fit=crop&q=80' },
        ],
      },
      {
        type: 'size',
        label: t('mockProduct.varChainLength'),
        options: [
          { id: 's', label: '40 cm', value: '40', available: true },
          { id: 'm', label: '45 cm', value: '45', available: true },
          { id: 'l', label: '50 cm', value: '50', available: true },
          { id: 'xl', label: '55 cm', value: '55', available: true },
        ],
      },
      {
        type: 'material',
        label: t('mockProduct.varMaterial'),
        options: [
          { id: 'steel316', label: t('mockProduct.varSteel316'), value: '316L', available: true },
          { id: 'titanium', label: t('mockProduct.varTitanium'), value: 'Ti', available: true },
          { id: 'silver925', label: t('mockProduct.varSilver925'), value: '925', available: false },
        ],
      },
    ],
    specs: [
      { key: t('mockProduct.specMaterial'), value: t('mockProduct.specMaterialVal') },
      { key: t('mockProduct.specPlating'), value: t('mockProduct.specPlatingVal') },
      { key: t('mockProduct.specChainLength'), value: t('mockProduct.specChainLengthVal') },
      { key: t('mockProduct.specPendantSize'), value: t('mockProduct.specPendantSizeVal') },
      { key: t('mockProduct.specWeight'), value: t('mockProduct.specWeightVal') },
      { key: t('mockProduct.specWaterproof'), value: t('mockProduct.specWaterproofVal') },
      { key: t('mockProduct.specWarranty'), value: t('mockProduct.specWarrantyVal') },
      { key: t('mockProduct.specCertificates'), value: t('mockProduct.specCertificatesVal') },
      { key: t('mockProduct.specOrigin'), value: t('mockProduct.specOriginVal') },
      { key: t('mockProduct.specBrand'), value: t('mockProduct.specBrandVal') },
    ],
    packagingSpecs: [
      { key: t('mockProduct.pkgUnit'), value: t('mockProduct.pkgUnitVal') },
      { key: t('mockProduct.pkgSize'), value: t('mockProduct.pkgSizeVal') },
      { key: t('mockProduct.pkgWeight'), value: t('mockProduct.pkgWeightVal') },
    ],
    description: `
    <div class="space-y-4">
      <p>${t('mockProduct.descIntro')}</p>
      <h4 class="font-semibold text-base">${t('mockProduct.descFeaturesTitle')}</h4>
      <ul class="list-disc list-inside space-y-1 text-sm" style="color: var(--color-text-secondary);">
        <li>${t('mockProduct.descFeat1')}</li>
        <li>${t('mockProduct.descFeat2')}</li>
        <li>${t('mockProduct.descFeat3')}</li>
        <li>${t('mockProduct.descFeat4')}</li>
        <li>${t('mockProduct.descFeat5')}</li>
        <li>${t('mockProduct.descFeat6')}</li>
      </ul>
      <h4 class="font-semibold text-base">${t('mockProduct.descUsageTitle')}</h4>
      <p class="text-sm" style="color: var(--color-text-secondary);">${t('mockProduct.descUsage')}</p>
      <h4 class="font-semibold text-base">${t('mockProduct.descQcTitle')}</h4>
      <p class="text-sm" style="color: var(--color-text-secondary);">${t('mockProduct.descQc')}</p>
    </div>
  `,
    packaging: `
    <table class="w-full text-sm">
      <tbody>
        <tr style="border-bottom: 1px solid var(--pd-spec-border, #e5e5e5);">
          <td class="py-2 font-medium" style="color: var(--pd-spec-key-color, #6b7280); width: 40%;">${t('mockProduct.pkgTableUnit')}</td>
          <td class="py-2">${t('mockProduct.pkgTableUnitVal')}</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--pd-spec-border, #e5e5e5);">
          <td class="py-2 font-medium" style="color: var(--pd-spec-key-color, #6b7280);">${t('mockProduct.pkgTableSize')}</td>
          <td class="py-2">10cm x 8cm x 3cm</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--pd-spec-border, #e5e5e5);">
          <td class="py-2 font-medium" style="color: var(--pd-spec-key-color, #6b7280);">${t('mockProduct.pkgTableWeight')}</td>
          <td class="py-2">${t('mockProduct.pkgTableWeightVal')}</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--pd-spec-border, #e5e5e5);">
          <td class="py-2 font-medium" style="color: var(--pd-spec-key-color, #6b7280);">${t('mockProduct.pkgTableBoxSize')}</td>
          <td class="py-2">40cm x 30cm x 25cm</td>
        </tr>
        <tr>
          <td class="py-2 font-medium" style="color: var(--pd-spec-key-color, #6b7280);">${t('mockProduct.pkgTableBoxQty')}</td>
          <td class="py-2">${t('mockProduct.pkgTableBoxQtyVal')}</td>
        </tr>
      </tbody>
    </table>
  `,
    samplePrice: 30,
    rating: 4.7,
    reviewCount: 328,
    orderCount: '4,056',
    reviews: [
      {
        id: 'rev-1',
        author: 'Ahmet Y.',
        country: 'TR',
        countryName: t('mockProduct.countryTR'),
        rating: 5,
        date: '2025-12-15',
        comment: t('mockProduct.rev1Comment'),
        helpful: 24,
        verified: true,
        repeatBuyer: false,
        supplierReply: t('mockProduct.rev1Reply'),
        tags: [t('mockProduct.tagQuality'), t('mockProduct.tagGoodSupplier')],
        productTitle: t('mockProduct.rev1Product'),
        productPrice: '$8.50-12.00',
        productImage: '',
      },
      {
        id: 'rev-2',
        author: 'Maria S.',
        country: 'DE',
        countryName: t('mockProduct.countryDE'),
        rating: 4,
        date: '2025-11-28',
        comment: t('mockProduct.rev2Comment'),
        helpful: 18,
        verified: true,
        repeatBuyer: false,
        tags: [t('mockProduct.tagOnTime'), t('mockProduct.tagFastComm')],
        productTitle: t('mockProduct.rev2Product'),
        productPrice: '$5.20-9.80',
        productImage: '',
      },
      {
        id: 'rev-3',
        author: 'Fatma K.',
        country: 'TR',
        countryName: t('mockProduct.countryTR'),
        rating: 5,
        date: '2025-11-10',
        comment: t('mockProduct.rev3Comment'),
        helpful: 15,
        verified: true,
        repeatBuyer: true,
        supplierReply: t('mockProduct.rev3Reply'),
        tags: [t('mockProduct.tagQuality'), t('mockProduct.tagGoodSupplier'), t('mockProduct.tagProfessional')],
        productTitle: t('mockProduct.rev3Product'),
        productPrice: '$3.80-7.50',
        productImage: '',
      },
      {
        id: 'rev-4',
        author: 'John D.',
        country: 'US',
        countryName: t('mockProduct.countryUS'),
        rating: 4,
        date: '2025-10-22',
        comment: t('mockProduct.rev4Comment'),
        helpful: 9,
        verified: true,
        repeatBuyer: false,
        tags: [t('mockProduct.tagGoodSupplier')],
        productTitle: t('mockProduct.rev4Product'),
        productPrice: '$4.60-8.20',
        productImage: '',
      },
      {
        id: 'rev-5',
        author: 'Elena P.',
        country: 'IT',
        countryName: t('mockProduct.countryIT'),
        rating: 5,
        date: '2025-10-05',
        comment: t('mockProduct.rev5Comment'),
        helpful: 31,
        verified: true,
        repeatBuyer: true,
        supplierReply: t('mockProduct.rev5Reply'),
        tags: [t('mockProduct.tagQuality'), t('mockProduct.tagGoodSupplier'), t('mockProduct.tagFastComm')],
        productTitle: t('mockProduct.rev5Product'),
        productPrice: '$2.90-5.40',
        productImage: '',
      },
      {
        id: 'rev-6',
        author: 'Mehmet A.',
        country: 'TR',
        countryName: t('mockProduct.countryTR'),
        rating: 3,
        date: '2025-09-18',
        comment: t('mockProduct.rev6Comment'),
        helpful: 7,
        verified: true,
        repeatBuyer: false,
        supplierReply: t('mockProduct.rev6Reply'),
        tags: [],
        productTitle: t('mockProduct.rev6Product'),
        productPrice: '$6.30-11.00',
        productImage: '',
      },
    ],
    supplier: {
      name: 'Guangzhou Golden Craft Jewelry Co., Ltd.',
      verified: true,
      yearsInBusiness: 8,
      responseTime: t('mockProduct.supplierResponseTime'),
      responseRate: t('mockProduct.supplierResponseRate'),
      onTimeDelivery: t('mockProduct.supplierOnTimeDelivery'),
      mainProducts: [
        t('mockProduct.supplierProd1'),
        t('mockProduct.supplierProd2'),
        t('mockProduct.supplierProd3'),
        t('mockProduct.supplierProd4'),
      ],
      employees: '150-200',
      annualRevenue: '$5M - $10M',
      certifications: ['SGS', 'ISO 9001', 'BSCI', 'ROHS'],
    },
    faq: [
      {
        question: t('mockProduct.faq1Q'),
        answer: t('mockProduct.faq1A'),
      },
      {
        question: t('mockProduct.faq2Q'),
        answer: t('mockProduct.faq2A'),
      },
      {
        question: t('mockProduct.faq3Q'),
        answer: t('mockProduct.faq3A'),
      },
      {
        question: t('mockProduct.faq4Q'),
        answer: t('mockProduct.faq4A'),
      },
      {
        question: t('mockProduct.faq5Q'),
        answer: t('mockProduct.faq5A'),
      },
      {
        question: t('mockProduct.faq6Q'),
        answer: t('mockProduct.faq6A'),
      },
    ],
    leadTimeRanges: [
      { quantityRange: '1 - 10', days: '7' },
      { quantityRange: '11 - 100', days: '20' },
      { quantityRange: '101 - 2.000', days: '45' },
      { quantityRange: '> 2.000', days: t('mockProduct.leadTimeNegotiate') },
    ],
    customizationOptions: [
      { name: t('mockProduct.custMaterial'), priceAddon: t('mockProduct.custMaterialAddon'), minOrder: t('mockProduct.custMaterialMin') },
    ],
    reviewCategoryRatings: [
      { label: t('mockProduct.ratingSupplierService'), score: 4.9 },
      { label: t('mockProduct.ratingOnTime'), score: 4.6 },
      { label: t('mockProduct.ratingQuality'), score: 4.8 },
    ],
    baseCurrency: 'USD',
    storeReviewCount: 151,
    reviewMentionTags: [
      { label: t('mockProduct.tagProfessional'), count: 1 },
      { label: t('mockProduct.tagOnTime'), count: 1 },
      { label: t('mockProduct.tagGoodSupplier'), count: 4 },
      { label: t('mockProduct.tagQuality'), count: 3 },
      { label: t('mockProduct.tagFastComm'), count: 2 },
    ],
  };
}

