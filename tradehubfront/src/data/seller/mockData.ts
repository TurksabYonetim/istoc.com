/**
 * Seller Storefront — Mock Data
 * Complete mock dataset for all 13 components.
 * Internationalized: all user-visible strings use t() calls.
 */
import { t } from '../../i18n';
import type {
  SellerStorefrontData,
  SellerProfile,
  StoreNavData,
  HeroBannerData,
  CategoryCard,
  SimpleProduct,
  ProductCategory,
  CompanyInfo,
  Certificate,
  Advantage,
  Feature,
  CompanyInfoCell,
  CompanyPhoto,
  GalleryPhoto,
  ContactFormData,
  FloatingActionsData,
} from '../../types/seller/types';

// ─── C1: Seller Profile ─────────────────────────────────
function getSeller(): SellerProfile {
  return {
    name: t('sellerMock.companyName'),
    slug: 'anadolu-endustriyel',
    logo: '/assets/mock/anadolu-logo.png',
    verificationType: 'Verified',
    verificationBadgeType: 'standard',
    yearsOnPlatform: 12,
    location: t('sellerMock.location'),
    mainCategories: [t('sellerMock.catElectricMeters'), t('sellerMock.catWaterMeters'), t('sellerMock.catGasMeters')],
    email: 'info@anadoluolcum.com.tr',
    deliveryBadge: t('sellerMock.deliveryBadge'),
    assessmentBadge: t('sellerMock.assessmentBadge'),
    verificationDate: '2025.06.15',
    hasCategoryGrid: true,
    hasCategoryListing: true,
  };
}

// ─── C2: Navigation ─────────────────────────────────────
export function getNavData(): StoreNavData {
  return {
    items: [
      { label: t('sellerMock.navHome'), href: '#overview', isActive: true },
      { label: t('sellerMock.navProducts'), href: '#products', isActive: false, dropdownType: 'products' },
      { label: t('sellerMock.navCompanyProfile'), href: '#company', isActive: false, dropdownType: 'company' },
      { label: t('sellerMock.navContact'), href: '#contact', isActive: false },
      { label: t('sellerMock.navCampaigns'), href: '#', isActive: false },
    ],
    productCategories: [
      {
        name: t('sellerMock.pcPrepaidElectric'),
        slug: 'on-odemeli-elektrik',
        hasSubcategories: true,
        subcategories: [
          { name: t('sellerMock.pcSinglePhasePrepaid'), href: '#' },
          { name: t('sellerMock.pcThreePhasePrepaid'), href: '#' },
          { name: t('sellerMock.pcStsToken'), href: '#' },
        ],
      },
      {
        name: t('sellerMock.pcSmartElectric'),
        slug: 'akilli-elektrik',
        hasSubcategories: true,
        subcategories: [
          { name: t('sellerMock.pcWifiModule'), href: '#' },
          { name: t('sellerMock.pcLoraComm'), href: '#' },
          { name: t('sellerMock.pcGprs4g'), href: '#' },
        ],
      },
      {
        name: t('sellerMock.pcIndustrialEnergy'),
        slug: 'endustriyel-enerji',
        hasSubcategories: true,
        subcategories: [
          { name: t('sellerMock.pcCtConnected'), href: '#' },
          { name: t('sellerMock.pcReactiveEnergy'), href: '#' },
        ],
      },
      {
        name: t('sellerMock.pcWaterMeters'),
        slug: 'su-sayaclari',
        hasSubcategories: true,
        subcategories: [
          { name: t('sellerMock.pcUltrasonicWater'), href: '#' },
          { name: t('sellerMock.pcMechanicalWater'), href: '#' },
        ],
      },
      { name: t('sellerMock.pcGasMeters'), slug: 'dogalgaz', hasSubcategories: false },
      { name: t('sellerMock.pcSpareParts'), slug: 'yedek-parca', hasSubcategories: false },
    ],
    companyProfileLinks: [
      { label: t('sellerMock.cpOverview'), href: '#company' },
      { label: t('sellerMock.cpReviews'), href: '#reviews' },
    ],
    searchPlaceholder: t('sellerMock.searchPlaceholder'),
  };
}

// ─── C3: Hero Banner ────────────────────────────────────
function getHeroBanner(): HeroBannerData {
  return {
    slides: [
      {
        id: 'slide-1',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80',
        title: 'OEM/ODM',
        subtitle: t('sellerMock.slide1Subtitle'),
        textPosition: 'left',
        textColor: 'dark',
      },
      {
        id: 'slide-2',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80',
        title: t('sellerMock.slide2Title'),
        textPosition: 'left',
        textColor: 'dark',
      },
      {
        id: 'slide-3',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80',
        title: t('sellerMock.slide3Title'),
        subtitle: t('sellerMock.slide3Subtitle'),
        textPosition: 'center',
        textColor: 'white',
      },
    ],
    autoplayDelay: 5000,
    showPagination: true,
  };
}

// ─── C4: Category Cards ─────────────────────────────────
function getCategoryCards(): CategoryCard[] {
  return [
    { id: 'cat-1', name: t('sellerMock.cardPrepaidElectric'), bgColor: '#d4e157', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cat-2', name: t('sellerMock.cardSmartElectric'), bgColor: '#90caf9', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cat-3', name: t('sellerMock.cardIndustrialEnergy'), bgColor: '#bdbdbd', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cat-4', name: t('sellerMock.cardUltrasonicWater'), bgColor: '#80deea', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cat-5', name: t('sellerMock.cardMechanicalWater'), bgColor: '#a5d6a7', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cat-6', name: t('sellerMock.cardGasMeters'), bgColor: '#ffcc80', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cat-7', name: t('sellerMock.cardSpareParts'), bgColor: '#f48fb1', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
  ];
}

// ─── C5: Hot Products ───────────────────────────────────
function getHotProducts(): SimpleProduct[] {
  return [
    { id: 'hp-1', name: t('sellerMock.hp1'), image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=400&auto=format&fit=crop', link: '/pages/product-detail.html' },
    { id: 'hp-2', name: t('sellerMock.hp2'), image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=400&auto=format&fit=crop', link: '/pages/product-detail.html' },
    { id: 'hp-3', name: t('sellerMock.hp3'), image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=400&auto=format&fit=crop', link: '/pages/product-detail.html' },
    { id: 'hp-4', name: t('sellerMock.hp4'), image: 'https://images.unsplash.com/photo-1627964434947-d5ab70b8c66e?q=80&w=400&auto=format&fit=crop', link: '/pages/product-detail.html' },
    { id: 'hp-5', name: t('sellerMock.hp5'), image: 'https://images.unsplash.com/photo-1631541909061-71e34ddce158?q=80&w=400&auto=format&fit=crop', link: '/pages/product-detail.html' },
    { id: 'hp-6', name: t('sellerMock.hp6'), image: 'https://images.unsplash.com/photo-1582046426742-b06f8c792ea8?q=80&w=400&auto=format&fit=crop', link: '/pages/product-detail.html' },
    { id: 'hp-7', name: t('sellerMock.hp7'), image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop', link: '/pages/product-detail.html' },
    { id: 'hp-8', name: t('sellerMock.hp8'), image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=400&auto=format&fit=crop', link: '/pages/product-detail.html' },
    { id: 'hp-9', name: t('sellerMock.hp9'), image: 'https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?q=80&w=400&auto=format&fit=crop', link: '/pages/product-detail.html' },
  ];
}

// ─── C6: Category Product Listings ──────────────────────
function getCategoryListings(): ProductCategory[] {
  return [
    {
      id: 'cl-1',
      name: t('sellerMock.clPrepaidElectric'),
      bannerImage: '/assets/mock/banner-on-odemeli.jpg',
      products: [
        { id: 'clp-1', name: t('sellerMock.clp1'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: true, badges: [{ type: 'main-product', label: t('sellerMock.badgeMainProduct') }, { type: 'certified', label: t('sellerMock.badgeCeCertified') }], priceMin: 18.5, priceMax: 24.0, moq: 500, moqUnit: t('sellerMock.moqUnit'), soldCount: 28212, link: '/pages/product-detail.html' },
        { id: 'clp-2', name: t('sellerMock.clp2'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: false, badges: [{ type: 'certified', label: t('sellerMock.badgeIecApproved') }], priceMin: 32.0, priceMax: 45.0, moq: 300, moqUnit: t('sellerMock.moqUnit'), soldCount: 15843, link: '/pages/product-detail.html' },
        { id: 'clp-3', name: t('sellerMock.clp3'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: true, badges: [{ type: 'main-product', label: t('sellerMock.badgeMainProduct') }], priceMin: 22.0, priceMax: 28.5, moq: 500, moqUnit: t('sellerMock.moqUnit'), soldCount: 12567, link: '/pages/product-detail.html' },
        { id: 'clp-4', name: t('sellerMock.clp4'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: false, badges: [], priceMin: 35.0, priceMax: 42.0, moq: 200, moqUnit: t('sellerMock.moqUnit'), soldCount: 8934, link: '/pages/product-detail.html' },
        { id: 'clp-5', name: t('sellerMock.clp5'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: true, badges: [{ type: 'certified', label: t('sellerMock.badgeDlms') }], priceMin: 28.0, priceMax: 36.0, moq: 300, moqUnit: t('sellerMock.moqUnit'), soldCount: 19450, link: '/pages/product-detail.html' },
        { id: 'clp-6', name: t('sellerMock.clp6'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: false, badges: [{ type: 'main-product', label: t('sellerMock.badgeMainProduct') }, { type: 'certified', label: t('sellerMock.badgeCeCertified') }], priceMin: 55.0, priceMax: 72.0, moq: 100, moqUnit: t('sellerMock.moqUnit'), soldCount: 6721, link: '/pages/product-detail.html' },
        { id: 'clp-7', name: t('sellerMock.clp7'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: true, badges: [{ type: 'certified', label: 'IEC 62055' }], priceMin: 15.0, priceMax: 20.0, moq: 1000, moqUnit: t('sellerMock.moqUnit'), soldCount: 31245, link: '/pages/product-detail.html' },
        { id: 'clp-8', name: t('sellerMock.clp8'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: false, badges: [{ type: 'main-product', label: t('sellerMock.badgeMainProduct') }], priceMin: 19.0, priceMax: 25.5, moq: 500, moqUnit: t('sellerMock.moqUnit'), soldCount: 14320, link: '/pages/product-detail.html' },
      ],
    },
    {
      id: 'cl-2',
      name: t('sellerMock.clSmartWater'),
      bannerImage: '/assets/mock/banner-su-sayaci.jpg',
      products: [
        { id: 'clp-9', name: t('sellerMock.clp9'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: true, badges: [{ type: 'main-product', label: t('sellerMock.badgeMainProduct') }, { type: 'certified', label: t('sellerMock.badgeMidApproved') }], priceMin: 42.0, priceMax: 58.0, moq: 200, moqUnit: t('sellerMock.moqUnit'), soldCount: 22456, link: '/pages/product-detail.html' },
        { id: 'clp-10', name: t('sellerMock.clp10'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: false, badges: [{ type: 'certified', label: 'ISO 4064' }], priceMin: 8.5, priceMax: 12.0, moq: 500, moqUnit: t('sellerMock.moqUnit'), soldCount: 34210, link: '/pages/product-detail.html' },
        { id: 'clp-11', name: t('sellerMock.clp11'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: true, badges: [{ type: 'main-product', label: t('sellerMock.badgeMainProduct') }], priceMin: 180.0, priceMax: 450.0, moq: 50, moqUnit: t('sellerMock.moqUnit'), soldCount: 4560, link: '/pages/product-detail.html' },
        { id: 'clp-12', name: t('sellerMock.clp12'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: false, badges: [{ type: 'certified', label: t('sellerMock.badgeCeCertified') }], priceMin: 25.0, priceMax: 35.0, moq: 300, moqUnit: t('sellerMock.moqUnit'), soldCount: 18970, link: '/pages/product-detail.html' },
        { id: 'clp-13', name: t('sellerMock.clp13'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: true, badges: [{ type: 'main-product', label: t('sellerMock.badgeMainProduct') }, { type: 'certified', label: t('sellerMock.badgeIp68') }], priceMin: 55.0, priceMax: 78.0, moq: 200, moqUnit: t('sellerMock.moqUnit'), soldCount: 11230, link: '/pages/product-detail.html' },
        { id: 'clp-14', name: t('sellerMock.clp14'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: false, badges: [], priceMin: 320.0, priceMax: 520.0, moq: 20, moqUnit: t('sellerMock.moqUnit'), soldCount: 2340, link: '/pages/product-detail.html' },
        { id: 'clp-15', name: t('sellerMock.clp15'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: true, badges: [{ type: 'certified', label: t('sellerMock.badgeMidApproved') }], priceMin: 85.0, priceMax: 120.0, moq: 100, moqUnit: t('sellerMock.moqUnit'), soldCount: 7650, link: '/pages/product-detail.html' },
        { id: 'clp-16', name: t('sellerMock.clp16'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', hasVideo: false, badges: [{ type: 'main-product', label: t('sellerMock.badgeMainProduct') }], priceMin: 65.0, priceMax: 90.0, moq: 200, moqUnit: t('sellerMock.moqUnit'), soldCount: 9870, link: '/pages/product-detail.html' },
      ],
    },
  ];
}

// ─── C7: Company Info ───────────────────────────────────
function getCompany(): CompanyInfo {
  return {
    heroImage: '/assets/mock/fabrika-hero.jpg',
    heroTitle: t('sellerMock.heroTitle'),
    heroSubtitle: t('sellerMock.heroSubtitle'),
    description: t('sellerMock.companyDesc'),
    descriptionExtended: t('sellerMock.companyDescExt'),
    factoryPhotos: [
      { id: 'fp-1', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.fpProductionLine') },
      { id: 'fp-2', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.fpQualityLab') },
      { id: 'fp-3', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.fpAssemblyWorkshop') },
    ],
    carouselPhotos: [
      { id: 'cp-1', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.cpInnovationPark') },
      { id: 'cp-2', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.cpAutoProductionLine') },
      { id: 'cp-3', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.cpRdCenter') },
    ],
    locations: [
      { id: 'loc-1', name: t('sellerMock.locHQ'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
      { id: 'loc-2', name: t('sellerMock.locRegional'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
      { id: 'loc-3', name: t('sellerMock.locFactory'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
      { id: 'loc-4', name: t('sellerMock.locWarehouse'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    ],
  };
}

// ─── C8: Certificates ───────────────────────────────────
function getCertificates(): Certificate[] {
  return [
    { id: 'cert-1', name: t('sellerMock.cert1'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cert-2', name: t('sellerMock.cert2'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cert-3', name: t('sellerMock.cert3'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cert-4', name: t('sellerMock.cert4'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cert-5', name: t('sellerMock.cert5'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cert-6', name: t('sellerMock.cert6'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cert-7', name: t('sellerMock.cert7'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
    { id: 'cert-8', name: t('sellerMock.cert8'), image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80' },
  ];
}

// ─── C9: Why Choose Us ──────────────────────────────────
function getAdvantages(): Advantage[] {
  return [
    { id: 'adv-1', icon: 'shield-check', title: t('sellerMock.advSecurity'), description: t('sellerMock.advSecurityDesc') },
    { id: 'adv-2', icon: 'certificate', title: t('sellerMock.advQuality'), description: t('sellerMock.advQualityDesc') },
    { id: 'adv-3', icon: 'lightbulb', title: t('sellerMock.advInnovation'), description: t('sellerMock.advInnovationDesc') },
    { id: 'adv-4', icon: 'headset', title: t('sellerMock.advService'), description: t('sellerMock.advServiceDesc') },
    { id: 'adv-5', icon: 'cog', title: 'OEM/ODM', description: t('sellerMock.advOemDesc') },
  ];
}

function getFeatures(): Feature[] {
  return [
    { id: 'feat-1', icon: 'shield', title: t('sellerMock.featQuality') },
    { id: 'feat-2', icon: 'factory', title: t('sellerMock.featOem') },
    { id: 'feat-3', icon: 'support', title: t('sellerMock.featService') },
  ];
}

// ─── C10: Company Introduction ──────────────────────────
function getCompanyInfoCells(): CompanyInfoCell[] {
  return [
    { icon: 'globe', label: t('sellerMock.ciCountry'), value: t('sellerMock.ciCountryVal'), verified: true },
    { icon: 'calendar', label: t('sellerMock.ciEstablished'), value: '2004', verified: true },
    { icon: 'factory', label: t('sellerMock.ciBusinessType'), value: t('sellerMock.ciBusinessTypeVal'), verified: true },
    { icon: 'box', label: t('sellerMock.ciMainProducts'), value: t('sellerMock.ciMainProductsVal'), verified: true },
    { icon: 'map', label: t('sellerMock.ciMainMarkets'), value: t('sellerMock.ciMainMarketsVal'), verified: true },
    { icon: 'chart', label: t('sellerMock.ciAnnualRevenue'), value: t('sellerMock.ciAnnualRevenueVal'), verified: true },
  ];
}

function getCompanyPhotos(): CompanyPhoto[] {
  return [
    { id: 'cip-1', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.cipFactoryOverview'), hasVideo: true },
    { id: 'cip-2', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.cipProductionLine'), hasVideo: false },
    { id: 'cip-3', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.cipWarehouse'), hasVideo: false },
    { id: 'cip-4', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.cipShowroom'), hasVideo: false },
  ];
}

// ─── C11: Gallery ───────────────────────────────────────
function getGalleryPhotos(): GalleryPhoto[] {
  return [
    { id: 'gal-1', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.galAutoAssembly') },
    { id: 'gal-2', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.galQcLab') },
    { id: 'gal-3', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.galRawStorage') },
    { id: 'gal-4', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.galPackaging') },
    { id: 'gal-5', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.galRdCenter') },
    { id: 'gal-6', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.galAdminBuilding') },
    { id: 'gal-7', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.galCalibration') },
    { id: 'gal-8', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600&q=80', caption: t('sellerMock.galShipping') },
  ];
}

// ─── C12: Contact Form ──────────────────────────────────
function getContactForm(): ContactFormData {
  return {
    title: t('sellerMock.contactTitle'),
    recipient: {
      name: 'Ahmet Yilmaz',
      title: t('sellerMock.contactRecipientTitle'),
      department: t('sellerMock.contactDepartment'),
    },
    placeholder: t('sellerMock.contactPlaceholder'),
    maxLength: 8000,
    businessCardDefault: true,
  };
}

// ─── C13: Floating Actions ──────────────────────────────
function getFloatingActions(): FloatingActionsData {
  return {
    buttons: [
      {
        id: 'contact',
        label: t('sellerMock.floatContact'),
        icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
        bgColor: 'bg-[#f97316]',
        hoverColor: 'hover:bg-primary-600',
        action: 'scroll-to-contact',
        ariaLabel: 'Contact Supplier',
      },
      {
        id: 'chat',
        label: t('sellerMock.floatChat'),
        icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>',
        bgColor: 'bg-primary-600',
        hoverColor: 'hover:bg-[#dc2626]',
        action: 'open-chat',
        ariaLabel: 'Chat Now',
      },
    ],
    topPosition: '40%',
  };
}

// ─── Aggregate Export ───────────────────────────────────
export function getSellerData(): SellerStorefrontData {
  return {
    seller: getSeller(),
    navData: getNavData(),
    heroBanner: getHeroBanner(),
    categoryCards: getCategoryCards(),
    hotProducts: getHotProducts(),
    categoryListings: getCategoryListings(),
    company: getCompany(),
    certificates: getCertificates(),
    advantages: getAdvantages(),
    features: getFeatures(),
    companyInfoCells: getCompanyInfoCells(),
    companyPhotos: getCompanyPhotos(),
    galleryPhotos: getGalleryPhotos(),
    contactForm: getContactForm(),
    floatingActions: getFloatingActions(),
  };
}

// ─── C14: Seller Performance Stats & Reviews ──────────────────────────────
export function getSellerStats(): any {
  return {
    rating: 4.7,
    reviewCount: 87,
    responseTime: '3h',
    onTimeDeliveryRate: '98.5%',
    transactions: 154,
    supplierServiceScore: 4.8,
    onTimeShipmentScore: 4.6,
    productQualityScore: 4.6,
  };
}

export function getSellerReviews(): any[] {
  return [
    {
      id: 'rev-1',
      reviewerName: 'J********l',
      country: 'Angola',
      countryFlag: '\uD83C\uDDE6\uD83C\uDDF4',
      date: '25 Feb 2026 10:15',
      comment: 'muito bom veio do mesmo jeito que pedi',
      productName: t('sellerMock.review1Product'),
      productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
      productPrice: t('sellerMock.review1Price'),
    },
    {
      id: 'rev-2',
      reviewerName: 'M********a',
      country: 'Senegal',
      countryFlag: '\uD83C\uDDF8\uD83C\uDDF3',
      date: '12 Feb 2026 19:04',
      comment: 'cool',
      productName: t('sellerMock.review2Product'),
      productImage: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=100&h=100&fit=crop',
      productPrice: t('sellerMock.review2Price'),
    },
  ];
}
